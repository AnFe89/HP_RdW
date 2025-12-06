-- Create a storage bucket for news images
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'news-images' );

-- Policy: Admins can upload images
CREATE POLICY "Admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'news-images' 
    AND exists (
        select 1 from public.profiles 
        where profiles.id = auth.uid() 
        and profiles.role = 'admin'
    )
);

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'news-images' 
    AND exists (
        select 1 from public.profiles 
        where profiles.id = auth.uid() 
        and profiles.role = 'admin'
    )
);
