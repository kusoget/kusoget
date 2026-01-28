-- Create game_comments table
CREATE TABLE IF NOT EXISTS public.game_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_game_comments_game_id ON public.game_comments(game_id);
CREATE INDEX IF NOT EXISTS idx_game_comments_user_id ON public.game_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_game_comments_created_at ON public.game_comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.game_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_comments
-- Read: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
    ON public.game_comments FOR SELECT
    USING (true);

-- Insert: Only authenticated users can post comments
CREATE POLICY "Authenticated users can post comments"
    ON public.game_comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Update: Users can update their own comments
CREATE POLICY "Users can update own comments"
    ON public.game_comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Delete: Users can delete their own comments, or admins can delete any comment
CREATE POLICY "Users can delete own comments or admins can delete any"
    ON public.game_comments FOR DELETE
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_game_comments_updated_at ON public.game_comments;
CREATE TRIGGER update_game_comments_updated_at
    BEFORE UPDATE ON public.game_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
