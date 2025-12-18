-- Create a table for contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' -- new, read, replied
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public contact form)
CREATE POLICY "Anyone can insert messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

-- Policy: Only Admins can view messages
CREATE POLICY "Admins can view messages"
ON public.contact_messages FOR SELECT
USING (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);
