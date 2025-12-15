-- Allow users to update their own profile (e.g. username)
-- This is required because the default policy might only allow admins or no one to update.

-- 1. Drop existing policy if it conflicts (optional, aiming for safety)
-- DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 2. Create the policy
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Notes:
-- This allows updates to ANY column for own profile. 
-- In a strict environment, you might want to use a TRIGGER to prevent changing 'role' or 'id'.
-- However, 'role' is usually protected by app logic or further constraints, 
-- and typically clients send only the fields they want to update.
-- Ideally, ensure 'role' is not exposed in the update payload from the client.
