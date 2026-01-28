-- Add more genres to the games table
-- First, drop the existing constraint
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_genre_check;

-- Add new constraint with expanded genre list
ALTER TABLE public.games ADD CONSTRAINT games_genre_check 
CHECK (genre IN (
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
  'other'
));
