-- Fix for "Function Search Path Mutable" warnings
-- We need to explicitly set the search_path to 'public' (or whatever schemas are needed)
-- to prevent malicious users from overriding objects in the search path.

-- 1. Fix delete_own_account
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- 2. Fix check_reservation_limit
CREATE OR REPLACE FUNCTION check_reservation_limit()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name text;
BEGIN
  -- Get Username
  SELECT username INTO user_name FROM public.profiles WHERE id = NEW.user_id;

  -- If Gastspieler, allow everything
  IF user_name = 'Gastspieler' THEN
    RETURN NEW;
  END IF;

  -- For everyone else: Check if they already have a reservation at this start_time
  IF EXISTS (
    SELECT 1 FROM public.reservations 
    WHERE user_id = NEW.user_id 
      AND start_time = NEW.start_time
      AND id IS DISTINCT FROM NEW.id
  ) THEN
    RAISE EXCEPTION 'Dieser User hat bereits eine Reservierung für diesen Termin!';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
