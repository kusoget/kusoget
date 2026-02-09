-- Make the old 'genre' column nullable since we are now using 'genres'
ALTER TABLE public.games ALTER COLUMN genre DROP NOT NULL;

-- Ensure the old check constraint is removed (if not already)
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_genre_check;
