-- Create the invitations table
create table if not exists public.invitations (
  id uuid default uuid_generate_v4() primary key,
  inviter_id uuid references auth.users(id) not null,
  invitee_id uuid references auth.users(id) not null,
  table_id int not null,
  game_date timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'expired', 'declined')),
  token uuid default uuid_generate_v4() not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.invitations enable row level security;

-- Policies
-- Inviter can see their sent invitations
create policy "Inviters can view their sent invitations"
  on public.invitations for select
  using (auth.uid() = inviter_id);

-- Inviter can insert invitations
create policy "Users can insert invitations"
  on public.invitations for insert
  with check (auth.uid() = inviter_id);

-- Invitee can view their invitations (needed for confirmation logic if we fetch by token and filter by user)
-- Ideally we fetch by token mainly, but ensuring the user is the invitee is good practice.
create policy "Invitees can view their invitations"
  on public.invitations for select
  using (auth.uid() = invitee_id);

-- Invitees updates status (accept/decline)
create policy "Invitees can update their invitations"
  on public.invitations for update
  using (auth.uid() = invitee_id);
  
-- Admins can view all (optional but good for dashboard)
-- Assuming admin check is done via profile role or similar, simplified here:
-- create policy "Admins can view all invitations" ... (SKIPPED for now, sticking to basics)
