-- Add more genres to the validation function
-- New genres: novel, typing, card, quiz, rhythm, survival, mmorpg, escape, idle

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
    'novel',
    'typing',
    'card',
    'quiz',
    'rhythm',
    'survival',
    'mmorpg',
    'escape',
    'idle',
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
