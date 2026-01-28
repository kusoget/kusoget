-- Add theme_preference column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Update existing profiles to use 'system' as default
UPDATE public.profiles
SET theme_preference = 'system'
WHERE theme_preference IS NULL;
