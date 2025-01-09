-- Add AI-specific columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS favorite_llms text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_tools text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_interests text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_use_case text;

-- Create index for AI interests search
CREATE INDEX IF NOT EXISTS idx_profiles_ai_interests
ON profiles USING gin(ai_interests);

-- Create index for AI tools search
CREATE INDEX IF NOT EXISTS idx_profiles_ai_tools
ON profiles USING gin(ai_tools);

-- Update the profile matching function to consider AI preferences
CREATE OR REPLACE FUNCTION calculate_ai_match_score(
  user1_interests text[],
  user2_interests text[],
  user1_tools text[],
  user2_tools text[]
) RETURNS float AS $$
DECLARE
  common_interests integer;
  common_tools integer;
  total_score float;
BEGIN
  -- Calculate common interests
  SELECT COUNT(*) INTO common_interests
  FROM unnest(user1_interests) i1
  WHERE i1 = ANY(user2_interests);

  -- Calculate common tools
  SELECT COUNT(*) INTO common_tools
  FROM unnest(user1_tools) t1
  WHERE t1 = ANY(user2_tools);

  -- Calculate total score (50% interests, 50% tools)
  total_score := (
    (common_interests::float / GREATEST(array_length(user1_interests, 1), array_length(user2_interests, 1), 1)) * 0.5 +
    (common_tools::float / GREATEST(array_length(user1_tools, 1), array_length(user2_tools, 1), 1)) * 0.5
  ) * 100;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;