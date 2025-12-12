-- 1. Create or Get 'Gastspieler' User
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Check if user exists by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'gast@ritter.de';

  IF target_user_id IS NULL THEN
    target_user_id := gen_random_uuid();
    
    -- Insert into auth.users
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES (
      target_user_id, 
      '00000000-0000-0000-0000-000000000000', 
      'authenticated', 
      'authenticated', 
      'gast@ritter.de', 
      crypt('gast_password_dummy', gen_salt('bf')),
      now(), 
      now(), 
      now(), 
      '{"provider":"email","providers":["email"]}', 
      '{}', 
      now(), 
      now(), 
      '', 
      '', 
      '', 
      ''
    );
    
    RAISE NOTICE 'Created auth.user for Gastspieler with ID: %', target_user_id;
  ELSE
    RAISE NOTICE 'Found existing auth.user for Gastspieler with ID: %', target_user_id;
  END IF;

  -- Ensure Profile Exists (Handle existing profile gracefully)
  INSERT INTO public.profiles (id, username, role)
  VALUES (target_user_id, 'Gastspieler', 'guest')
  ON CONFLICT (id) DO UPDATE 
  SET username = 'Gastspieler', role = 'guest';  -- Ensure correct name/role

END $$;

-- 2. Drop the existing UNIQUE constraint
ALTER TABLE reservations 
DROP CONSTRAINT IF EXISTS reservations_user_id_start_time_key;

-- 3. Create Function to check for Single Reservation (Except for Gastspieler)
CREATE OR REPLACE FUNCTION check_reservation_limit()
RETURNS TRIGGER AS $$
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
    SELECT 1 FROM reservations 
    WHERE user_id = NEW.user_id 
      AND start_time = NEW.start_time
      AND id IS DISTINCT FROM NEW.id
  ) THEN
    RAISE EXCEPTION 'Dieser User hat bereits eine Reservierung für diesen Termin!';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create Trigger
DROP TRIGGER IF EXISTS tr_check_reservation_limit ON reservations;

CREATE TRIGGER tr_check_reservation_limit
BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION check_reservation_limit();
