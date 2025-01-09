-- Create feed-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'feed-images', 'feed-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'feed-images'
);

-- Update bucket configuration
UPDATE storage.buckets
SET 
  public = true,
  avif_autodetection = false,
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']
WHERE id = 'feed-images';

-- Ensure storage policies exist
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Authenticated users can upload feed images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view feed images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own feed images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own feed images" ON storage.objects;

  -- Recreate policies
  CREATE POLICY "Authenticated users can upload feed images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'feed-images' AND
    auth.uid() = owner
  );

  CREATE POLICY "Anyone can view feed images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'feed-images');

  CREATE POLICY "Users can update their own feed images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'feed-images' AND auth.uid() = owner);

  CREATE POLICY "Users can delete their own feed images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'feed-images' AND auth.uid() = owner);
END $$;