-- Create game_likes table
CREATE TABLE IF NOT EXISTS public.game_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(game_id, user_id) -- 1ユーザー1ゲームにつき1いいねのみ
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_game_likes_game_id ON public.game_likes(game_id);
CREATE INDEX IF NOT EXISTS idx_game_likes_user_id ON public.game_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_game_likes_game_user ON public.game_likes(game_id, user_id);

-- Enable Row Level Security
ALTER TABLE public.game_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_likes
-- Read: Anyone can read likes
CREATE POLICY "Likes are viewable by everyone"
    ON public.game_likes FOR SELECT
    USING (true);

-- Insert: Only authenticated users can like games
CREATE POLICY "Authenticated users can like games"
    ON public.game_likes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Delete: Users can unlike their own likes
CREATE POLICY "Users can unlike their own likes"
    ON public.game_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Function to toggle like (like if not exists, unlike if exists)
CREATE OR REPLACE FUNCTION public.toggle_game_like(p_game_id UUID)
RETURNS TABLE(liked BOOLEAN, like_count BIGINT) AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '認証が必要です';
  END IF;

  -- Check if game exists
  IF NOT EXISTS (SELECT 1 FROM public.games WHERE id = p_game_id) THEN
    RAISE EXCEPTION 'ゲームが見つかりません';
  END IF;

  -- Check if like already exists
  SELECT EXISTS (
    SELECT 1 FROM public.game_likes 
    WHERE game_id = p_game_id AND user_id = v_user_id
  ) INTO v_liked;

  IF v_liked THEN
    -- Unlike: delete the like
    DELETE FROM public.game_likes 
    WHERE game_id = p_game_id AND user_id = v_user_id;
  ELSE
    -- Like: insert new like
    INSERT INTO public.game_likes (game_id, user_id)
    VALUES (p_game_id, v_user_id)
    ON CONFLICT (game_id, user_id) DO NOTHING;
  END IF;

  -- Return updated state
  RETURN QUERY
  SELECT 
    EXISTS (
      SELECT 1 FROM public.game_likes 
      WHERE game_id = p_game_id AND user_id = v_user_id
    ) AS liked,
    (SELECT COUNT(*)::BIGINT FROM public.game_likes WHERE game_id = p_game_id) AS like_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.toggle_game_like(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_game_like(UUID) TO anon;
