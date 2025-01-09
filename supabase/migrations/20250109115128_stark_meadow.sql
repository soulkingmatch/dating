-- Add new profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_completion integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_prompts jsonb DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT '{
  "show_online_status": true,
  "show_profile_visitors": true,
  "show_photos": true,
  "incognito_mode": false
}';

-- Create profile visitors table
CREATE TABLE IF NOT EXISTS profile_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  visited_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  visited_at timestamptz DEFAULT now(),
  UNIQUE(visitor_id, visited_id)
);

-- Create blocks table
CREATE TABLE IF NOT EXISTS user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Create reports table
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Add message features
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read_receipt boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS type text DEFAULT 'text';

-- Enable RLS
ALTER TABLE profile_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can see who visited their profile"
  ON profile_visitors FOR SELECT
  TO authenticated
  USING (auth.uid() = visited_id);

CREATE POLICY "Users can create visit records"
  ON profile_visitors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = visitor_id);

CREATE POLICY "Users can manage their blocks"
  ON user_blocks FOR ALL
  TO authenticated
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create reports"
  ON user_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Function to update profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion()
RETURNS trigger AS $$
DECLARE
  completion integer := 0;
  total_fields integer := 8;
BEGIN
  -- Basic info
  IF NEW.full_name IS NOT NULL THEN completion := completion + 1; END IF;
  IF NEW.birth_date IS NOT NULL THEN completion := completion + 1; END IF;
  IF NEW.gender IS NOT NULL THEN completion := completion + 1; END IF;
  IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN completion := completion + 1; END IF;
  IF NEW.avatar_url IS NOT NULL THEN completion := completion + 1; END IF;
  IF NEW.location IS NOT NULL THEN completion := completion + 1; END IF;
  IF NEW.education IS NOT NULL THEN completion := completion + 1; END IF;
  IF NEW.occupation IS NOT NULL THEN completion := completion + 1; END IF;

  NEW.profile_completion := (completion::float / total_fields::float * 100)::integer;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile completion
CREATE TRIGGER update_profile_completion
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completion();