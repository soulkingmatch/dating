/*
  # Fix user creation and subscription handling

  1. Changes
    - Drop and recreate trigger with better error handling
    - Ensure free plan exists
    - Add proper ordering for user creation flow
*/

-- First ensure the free plan exists
INSERT INTO subscription_plans (name, price, interval, features, stripe_price_id, daily_match_limit, messaging_limit)
SELECT 'Free', 0, 'month', 
  ARRAY['3 matches per day', 'Basic profile', 'Limited messaging'],
  'free_tier', 3, 10
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_plans WHERE price = 0
);

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_subscription;

-- Create improved function with error handling
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  -- Get free plan with retry logic
  FOR i IN 1..3 LOOP
    SELECT id INTO free_plan_id FROM subscription_plans WHERE price = 0 LIMIT 1;
    IF free_plan_id IS NOT NULL THEN
      EXIT;
    END IF;
    PERFORM pg_sleep(0.1); -- Small delay before retry
  END LOOP;

  IF free_plan_id IS NULL THEN
    RAISE EXCEPTION 'Free plan not found';
  END IF;

  -- Create subscription with better error handling
  BEGIN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      status,
      stripe_subscription_id,
      current_period_end
    ) VALUES (
      NEW.id,
      free_plan_id,
      'active',
      'free_tier',
      (NOW() + INTERVAL '100 years')
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Failed to create subscription for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_subscription();