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
