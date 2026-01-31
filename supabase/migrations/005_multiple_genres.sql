-- Migrate from single genre to multiple genres (array)
-- This migration adds genres column (TEXT[]) and migrates data from genre column

-- Step 1: Add the new genres column as TEXT array
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS genres TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing single genre data to the new array column
UPDATE public.games 
SET genres = ARRAY[genre]
WHERE genre IS NOT NULL AND (genres IS NULL OR genres = ARRAY[]::TEXT[]);

-- Step 3: Drop the old constraint
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_genre_check;

-- Step 4: Create a function to validate genres array
CREATE OR REPLACE FUNCTION validate_genres(genres_array TEXT[])
RETURNS BOOLEAN AS $$
DECLARE
  valid_genres TEXT[] := ARRAY[
    'action', 
    'rpg', 
    'puzzle', 
    'simulation', 
    'joke', 
    'platformer',
    'shooter',
    'racing',
    'strategy',
    'horror',
    'adventure',
    'music',
    'sports',
    'fighting',
    'online',
    'gambling',
    'other'
  ];
  g TEXT;
BEGIN
  -- Check if array is not empty
  IF array_length(genres_array, 1) IS NULL OR array_length(genres_array, 1) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if all genres are valid
  FOREACH g IN ARRAY genres_array LOOP
    IF NOT (g = ANY(valid_genres)) THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Add a check constraint for the genres array
ALTER TABLE public.games ADD CONSTRAINT games_genres_check 
CHECK (validate_genres(genres));

-- Step 6: Create an index for genres array for better query performance
CREATE INDEX IF NOT EXISTS idx_games_genres ON public.games USING GIN(genres);

-- Note: The old 'genre' column is kept for backward compatibility but can be dropped later
-- To drop: ALTER TABLE public.games DROP COLUMN genre;
