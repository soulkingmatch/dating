-- Create all required storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('covers', 'covers', true),
  ('feed-images', 'feed-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Configure bucket settings
UPDATE storage.buckets
SET 
  public = true,
  avif_autodetection = false,
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']
WHERE id IN ('avatars', 'covers', 'feed-images');

-- Drop existing policies
DO $$
BEGIN
  -- Avatars bucket policies
  DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
  
  -- Covers bucket policies
  DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
  
  -- Feed images bucket policies
  DROP POLICY IF EXISTS "Authenticated users can upload feed images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view feed images" ON storage.objects;
END $$;

-- Create policies for avatars bucket
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

-- Create policies for covers bucket
CREATE POLICY "Authenticated users can upload covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view covers"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'covers');

-- Create policies for feed images bucket
CREATE POLICY "Authenticated users can upload feed images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'feed-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view feed images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'feed-images');

-- Create policies for updating and deleting own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (auth.uid()::text = (storage.foldername(name))[1]);