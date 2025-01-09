/*
  # Dating App Profile System

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text)
      - full_name (text)
      - bio (text)
      - birth_date (date)
      - gender (text)
      - looking_for (text[])
      - location (point)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on profiles table
    - Add policies for profile management
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  bio text,
  birth_date date NOT NULL,
  gender text NOT NULL,
  looking_for text[] NOT NULL DEFAULT '{}',
  location point,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
END $$;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS profile_updated ON profiles;

-- Create or replace function
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_update();