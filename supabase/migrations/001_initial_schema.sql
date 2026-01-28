-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects if they exist (for development only)
-- WARNING: This will delete all data. Use with caution in production.

-- Drop policies first
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON public.profiles;
DROP POLICY IF EXISTS "Games are viewable by everyone" ON public.games;
DROP POLICY IF EXISTS "Authenticated users can insert games" ON public.games;
DROP POLICY IF EXISTS "Authors can delete own games or admins can delete any" ON public.games;
DROP POLICY IF EXISTS "Thumbnails are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own thumbnails or admins can delete any" ON storage.objects;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.increment_view_count(UUID);

-- Drop tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    game_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('playable', 'log')),
    genre TEXT NOT NULL CHECK (genre IN ('action', 'rpg', 'puzzle', 'simulation', 'joke', 'other')),
    platform TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    view_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for better query performance
CREATE INDEX idx_games_author_id ON public.games(author_id);
CREATE INDEX idx_games_created_at ON public.games(created_at DESC);
CREATE INDEX idx_games_view_count ON public.games(view_count DESC);
CREATE INDEX idx_games_type ON public.games(type);
CREATE INDEX idx_games_genre ON public.games(genre);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Read: Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Update: Users can update their own profile, or admins can update any profile
CREATE POLICY "Users can update own profile or admins can update any"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- RLS Policies for games
-- Read: Anyone can read games
CREATE POLICY "Games are viewable by everyone"
    ON public.games FOR SELECT
    USING (true);

-- Insert: Only authenticated users can insert games
CREATE POLICY "Authenticated users can insert games"
    ON public.games FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Delete: Authors can delete their own games, or admins can delete any game
CREATE POLICY "Authors can delete own games or admins can delete any"
    ON public.games FOR DELETE
    USING (
        author_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Function to handle new user creation (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment view count (RPC)
CREATE OR REPLACE FUNCTION public.increment_view_count(game_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.games
    SET view_count = view_count + 1
    WHERE id = game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on RPC function
GRANT EXECUTE ON FUNCTION public.increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_view_count(UUID) TO anon;

-- Create storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for thumbnails bucket
-- Read: Anyone can read thumbnails
CREATE POLICY "Thumbnails are viewable by everyone"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'thumbnails');

-- Upload: Only authenticated users can upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'thumbnails' AND
        auth.role() = 'authenticated'
    );

-- Update: Only authenticated users can update their own uploads
CREATE POLICY "Users can update own thumbnails"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'thumbnails' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Delete: Users can delete their own uploads, or admins can delete any
CREATE POLICY "Users can delete own thumbnails or admins can delete any"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'thumbnails' AND (
            auth.role() = 'authenticated' AND
            (storage.foldername(name))[1] = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );
