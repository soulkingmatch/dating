-- Change location column type from point to text
ALTER TABLE profiles 
DROP COLUMN IF EXISTS location,
ADD COLUMN location text;

-- Update location-related functions
DROP FUNCTION IF EXISTS search_profiles_by_location;

-- Create new location search function that works with text
CREATE OR REPLACE FUNCTION search_profiles_by_location(
  search_text text,
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
    AND (search_text IS NULL OR 
         p.location ILIKE '%' || search_text || '%');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;