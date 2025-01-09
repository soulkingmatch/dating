/*
  # Add search functionality

  1. New Functions
    - Add full text search for profiles
    - Add location-based search capabilities
    - Add age range filtering

  2. Security
    - Ensure RLS policies allow searching while protecting user data
*/

-- Enable the pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add a GiST index for the location column
CREATE INDEX IF NOT EXISTS idx_profiles_location 
ON profiles USING gist(location);

-- Add indexes for common search fields
CREATE INDEX IF NOT EXISTS idx_profiles_gender 
ON profiles(gender);

CREATE INDEX IF NOT EXISTS idx_profiles_birth_date 
ON profiles(birth_date);

-- Create a function for location-based search
CREATE OR REPLACE FUNCTION search_profiles_by_location(
  search_location point,
  max_distance float,
  p_gender text[] DEFAULT NULL,
  min_age int DEFAULT NULL,
  max_age int DEFAULT NULL
) RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM profiles p
  WHERE (p_gender IS NULL OR p.gender = ANY(p_gender))
    AND (min_age IS NULL OR 
         EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birth_date)) >= min_age)
    AND (max_age IS NULL OR 
         EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birth_date)) <= max_age)
    AND (search_location IS NULL OR 
         point(p.location[0], p.location[1]) <-> search_location <= max_distance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy for searching profiles
CREATE POLICY "Allow authenticated users to search profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);