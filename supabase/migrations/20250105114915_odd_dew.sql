-- Create policies for storage objects
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_owner
ON storage.objects(owner);

CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket
ON storage.objects(bucket_id);