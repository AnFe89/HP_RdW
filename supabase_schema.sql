-- 0. Create Profiles Table & User Trigger
-- This table mirrors the auth.users table and holds public profile info
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'guest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT,
    email_confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Function to handle new user signup automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, role, email, email_confirmed_at)
    VALUES (
        new.id, 
        new.raw_user_meta_data->>'username', 
        'guest', 
        new.email, 
        new.email_confirmed_at
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        email_confirmed_at = EXCLUDED.email_confirmed_at;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on every new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger for UPDATE (Email Confirmation sync)
CREATE OR REPLACE FUNCTION public.handle_user_update() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        email = new.email,
        email_confirmed_at = new.email_confirmed_at
    WHERE id = new.id;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();

-- 1. Create News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL, -- Flexible 40k date format
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies for News
-- Everyone can read news
CREATE POLICY "Public can view news" 
ON public.news FOR SELECT 
USING (true);

-- Only Admins can insert/update/delete news
-- Assuming 'role' in 'profiles' table is 'admin'
CREATE POLICY "Admins can manage news" 
ON public.news FOR ALL 
USING (
    exists (
        select 1 from public.profiles 
        where profiles.id = auth.uid() 
        and profiles.role = 'admin'
    )
);

-- 4. Update Profiles Policies (Allow Admins to update roles)
-- Ensure RLS is on for profiles (should be already)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (needed for Admin list)
-- Note: You might want to restrict this in a real high-security app, 
-- but for this club app, knowing who is a member is fine.
CREATE POLICY "Members can view all profiles" 
ON public.profiles FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow Admins to update profiles (e.g. change roles)
CREATE POLICY "Admins can update profiles" 
ON public.profiles FOR UPDATE 
USING (
    exists (
        select 1 from public.profiles 
        where profiles.id = auth.uid() 
        and profiles.role = 'admin'
    )
);

-- 5. Helper to make yourself Admin (Run this manually once for your user)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
