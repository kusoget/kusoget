-- Safe migration script that preserves existing data
-- Use this if you want to keep existing data and only add missing objects

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;
    END IF;
END $$;

-- Create games table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.games (
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_games_author_id ON public.games(author_id);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON public.games(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_view_count ON public.games(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_games_type ON public.games(type);
CREATE INDEX IF NOT EXISTS idx_games_genre ON public.games(genre);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (to ensure they're correct)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON public.profiles;
CREATE POLICY "Users can update own profile or admins can update any"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

DROP POLICY IF EXISTS "Games are viewable by everyone" ON public.games;
CREATE POLICY "Games are viewable by everyone"
    ON public.games FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert games" ON public.games;
CREATE POLICY "Authenticated users can insert games"
    ON public.games FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authors can delete own games or admins can delete any" ON public.games;
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
DROP POLICY IF EXISTS "Thumbnails are viewable by everyone" ON storage.objects;
CREATE POLICY "Thumbnails are viewable by everyone"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
CREATE POLICY "Authenticated users can upload thumbnails"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'thumbnails' AND
        auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Users can update own thumbnails" ON storage.objects;
CREATE POLICY "Users can update own thumbnails"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'thumbnails' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can delete own thumbnails or admins can delete any" ON storage.objects;
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
