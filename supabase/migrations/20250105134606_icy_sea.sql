-- Add cover_url column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'cover_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN cover_url text;
  END IF;
END $$;

-- Create index for cover_url
CREATE INDEX IF NOT EXISTS idx_profiles_cover_url ON profiles(cover_url);

-- Update storage policies for cover images
DO $$
BEGIN
  -- Drop existing cover image policies if they exist
  DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;

  -- Recreate cover image policies
  CREATE POLICY "Authenticated users can upload covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Anyone can view covers"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'covers');
END $$;