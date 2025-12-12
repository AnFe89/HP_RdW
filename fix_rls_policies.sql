-- POLICY: Allow users to create reservations for themselves OR others
-- Drop the existing policy if it exists (assuming it was strict)
DROP POLICY IF EXISTS "Users can create their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can insert reservations" ON reservations;

-- Create a new policy that allows any authenticated user to insert into reservations
-- This is necessary so User A can create a reservation for User B (Partner)
CREATE POLICY "Users can insert reservations"
ON reservations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ensure users can still view all reservations (assuming this was already established)
DROP POLICY IF EXISTS "Users can view all reservations" ON reservations;
CREATE POLICY "Users can view all reservations"
ON reservations
FOR SELECT
TO authenticated
USING (true);

-- Allow users to delete their OWN reservations only
DROP POLICY IF EXISTS "Users can delete their own reservations" ON reservations;
CREATE POLICY "Users can delete their own reservations"
ON reservations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Optional: Allow Admins to delete any reservation
-- (This depends on if you have an admin function or proper role check in policies)
-- Assuming 'admin' role logic is complex, we might stick to basic RLS or use a function.
-- But for deletions, strictly speaking, the Partner feature doesn't require deleting *partner's* reservation necessarily
-- (Unless we want User A to be able to cancel User B's reservation if they made it. The current schema tracks 'user_id' but not 'created_by').
