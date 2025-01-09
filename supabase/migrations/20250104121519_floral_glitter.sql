/*
  # Add media support to profiles
  
  1. Changes
    - Add avatar_url column to profiles table if it doesn't exist
    - Add video_url column to profiles table if it doesn't exist
  
  2. Notes
    - Storage buckets and policies should be configured via Supabase dashboard
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add media columns if they don't exist
DO $$ 
BEGIN
  -- Add avatar_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;

  -- Add video_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN video_url text;
  END IF;
END $$;