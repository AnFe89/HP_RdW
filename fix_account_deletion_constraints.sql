-- FIX ACCOUNT DELETION ISSUES
-- This script updates foreign key constraints to allow cascading deletes.
-- When a user is deleted, their invitations and reservations will now be automatically removed.

-- 1. Fix 'invitations' table constraints
-- We drop existing constraints and re-add them with ON DELETE CASCADE

-- Invitee (Empfänger)
ALTER TABLE public.invitations 
DROP CONSTRAINT IF EXISTS invitations_invitee_id_fkey;

ALTER TABLE public.invitations
ADD CONSTRAINT invitations_invitee_id_fkey
FOREIGN KEY (invitee_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Inviter (Absender)
-- Assuming the column is named 'inviter_id' typically paired with invitee_id.
-- If the constraint name differs, this drop might be skipped, but we try standard naming.
ALTER TABLE public.invitations 
DROP CONSTRAINT IF EXISTS invitations_inviter_id_fkey;

ALTER TABLE public.invitations
ADD CONSTRAINT invitations_inviter_id_fkey
FOREIGN KEY (inviter_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;


-- 2. Fix 'reservations' table constraints (Preventative)
-- Validating that reservations are also deleted when a user is removed.

ALTER TABLE public.reservations 
DROP CONSTRAINT IF EXISTS reservations_user_id_fkey;

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;


-- 3. Fix 'news' table (Optional but recommended)
-- Keep news but remove author link if author is deleted
ALTER TABLE public.news 
DROP CONSTRAINT IF EXISTS news_author_id_fkey;

ALTER TABLE public.news
ADD CONSTRAINT news_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;
