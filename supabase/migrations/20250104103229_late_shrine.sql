/*
  # Fix user creation flow

  1. Changes
    - Add better error handling for profile creation
    - Add default values for required fields
    - Add validation checks
    - Improve transaction handling
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create improved function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user_account()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  -- First ensure we can get the free plan
  SELECT id INTO free_plan_id 
  FROM subscription_plans 
  WHERE price = 0 AND name = 'Free' 
  LIMIT 1;

  IF free_plan_id IS NULL THEN
    RAISE WARNING 'Free plan not found, creating default plan';
    
    INSERT INTO subscription_plans (
      name, 
      price, 
      interval, 
      features, 
      stripe_price_id, 
      daily_match_limit, 
      messaging_limit
    ) VALUES (
      'Free',
      0,
      'month',
      ARRAY['3 matches per day', 'Basic profile', 'Limited messaging'],
      'free_tier',
      3,
      10
    ) RETURNING id INTO free_plan_id;
  END IF;

  -- Create profile with safe defaults
  BEGIN
    INSERT INTO profiles (
      id,
      username,
      full_name,
      birth_date,
      gender,
      looking_for,
      interests
    ) VALUES (
      NEW.id,
      COALESCE(NEW.email, 'user_' || NEW.id),
      '',
      CURRENT_DATE - INTERVAL '18 years',
      'other',
      ARRAY[]::text[],
      ARRAY[]::text[]
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    -- Continue execution to create subscription
  END;

  -- Create subscription
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
    RAISE WARNING 'Failed to create subscription for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_account();