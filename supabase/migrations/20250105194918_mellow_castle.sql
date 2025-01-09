-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Create trigger function to validate sender
CREATE OR REPLACE FUNCTION validate_message_sender()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if sender is part of the match
  IF NOT EXISTS (
    SELECT 1 FROM matches
    WHERE id = NEW.match_id
    AND (user1_id = NEW.sender_id OR user2_id = NEW.sender_id)
  ) THEN
    RAISE EXCEPTION 'Sender must be a participant in the match';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sender validation
CREATE TRIGGER validate_message_sender_trigger
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION validate_message_sender();

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can send messages to their matches"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id
      AND status = 'accepted'
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can read messages from their matches"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- Create indexes
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Add function to check subscription before sending messages
CREATE OR REPLACE FUNCTION check_message_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan_limit integer;
  daily_messages integer;
BEGIN
  -- Get user's messaging limit
  SELECT sp.messaging_limit INTO user_plan_limit
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = NEW.sender_id
    AND s.status = 'active'
  LIMIT 1;

  -- If no limit (premium plan), allow message
  IF user_plan_limit IS NULL THEN
    RETURN NEW;
  END IF;

  -- Count today's messages
  SELECT COUNT(*) INTO daily_messages
  FROM messages
  WHERE sender_id = NEW.sender_id
    AND created_at::date = CURRENT_DATE;

  IF daily_messages >= user_plan_limit THEN
    RAISE EXCEPTION 'Daily message limit reached';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for message limit
CREATE TRIGGER enforce_message_limit
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION check_message_limit();