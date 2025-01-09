/*
  # Add subscription limits and constraints

  1. Changes
    - Add daily match limit column to subscription plans
    - Add messaging limit column to subscription plans
    - Add function to check subscription limits
    - Add trigger for match creation checks

  2. Security
    - Maintain existing RLS policies
    - Add constraints for subscription limits
*/

-- Add limit columns to subscription_plans
ALTER TABLE subscription_plans
ADD COLUMN daily_match_limit integer NOT NULL DEFAULT 3,
ADD COLUMN messaging_limit integer DEFAULT NULL; -- NULL means unlimited

-- Update existing plans with limits
UPDATE subscription_plans
SET daily_match_limit = CASE 
  WHEN name = 'Free' THEN 3
  WHEN name = 'Basic' THEN 10
  WHEN name = 'Premium' THEN 50
  WHEN name = 'VIP' THEN 100
  ELSE 3
END,
messaging_limit = CASE
  WHEN name = 'Free' THEN 10
  WHEN name = 'Basic' THEN NULL
  WHEN name = 'Premium' THEN NULL
  WHEN name = 'VIP' THEN NULL
  ELSE 10
END;

-- Function to check daily match limit
CREATE OR REPLACE FUNCTION check_match_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan_limit integer;
  daily_matches integer;
BEGIN
  -- Get user's plan limit
  SELECT sp.daily_match_limit INTO user_plan_limit
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = NEW.user1_id AND s.status = 'active'
  LIMIT 1;

  -- Count today's matches
  SELECT COUNT(*) INTO daily_matches
  FROM matches
  WHERE user1_id = NEW.user1_id
  AND created_at::date = CURRENT_DATE;

  IF daily_matches >= user_plan_limit THEN
    RAISE EXCEPTION 'Daily match limit reached';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for match limit
CREATE TRIGGER enforce_match_limit
  BEFORE INSERT ON matches
  FOR EACH ROW
  EXECUTE FUNCTION check_match_limit();