/*
  # Add Profile Policies

  1. New Policies
    - Add INSERT policy for profile creation
    - Add DELETE policy for profile deletion
  
  2. Security
    - Ensure users can only manage their own profiles
    - Maintain data integrity with proper constraints
*/

-- Add INSERT policy
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add DELETE policy
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Add trigger to automatically set id on insert
CREATE OR REPLACE FUNCTION set_profile_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_id_on_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_profile_id();