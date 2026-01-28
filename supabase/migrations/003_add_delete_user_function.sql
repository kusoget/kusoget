-- Function to allow users to delete their own account
-- This function deletes the user's profile, which will cascade delete their games
-- Note: auth.users deletion requires admin privileges, so we'll handle profile deletion
-- The user will need to contact support or use Supabase dashboard to fully delete auth.users

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the current user's ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION '認証が必要です';
  END IF;

  -- Delete the user's profile (this will cascade delete their games due to ON DELETE CASCADE)
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Note: auth.users deletion requires admin privileges
  -- The user will be logged out and their profile/games will be deleted
  -- To fully delete auth.users, use Supabase dashboard or admin API
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
