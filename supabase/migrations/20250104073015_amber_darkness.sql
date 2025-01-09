/*
  # Create matches table and policies

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `user1_id` (uuid, references profiles)
      - `user2_id` (uuid, references profiles)
      - `status` (text: pending/accepted/rejected)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for:
      - Creating matches
      - Viewing own matches
      - Updating match status
*/

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) NOT NULL,
  user2_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can view their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (user1_id, user2_id));

CREATE POLICY "Users can update their received matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user2_id);