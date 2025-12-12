-- Function to allow users to delete their own account
-- This must be SECURITY DEFINER to access auth.users
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user from auth.users
  -- This typically cascades to public.profiles if foreign keys are set up correctly
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
