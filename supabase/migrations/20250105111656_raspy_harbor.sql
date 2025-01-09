/*
  # Create feed system

  1. New Tables
    - `feed_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `image_url` (text, nullable)
      - `interests` (text array)
      - `likes_count` (integer)
      - `comments_count` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `feed_items` table
    - Add policies for authenticated users
*/

-- Create feed_items table
CREATE TABLE IF NOT EXISTS feed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  image_url text,
  interests text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view feed items"
  ON feed_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own feed items"
  ON feed_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feed items"
  ON feed_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add some sample feed items
INSERT INTO feed_items (user_id, content, interests, image_url)
SELECT 
  id as user_id,
  'Just joined Soul King Match! Excited to meet fellow AI enthusiasts 🤖',
  ARRAY['AI', 'Dating'],
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'
FROM profiles
LIMIT 1;