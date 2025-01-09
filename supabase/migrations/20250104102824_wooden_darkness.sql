/*
  # Fix user creation flow

  1. Changes
    - Drop and recreate trigger with proper ordering
    - Add profile creation before subscription
    - Improve error handling
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_subscription;

-- Create improved function that handles both profile and subscription
CREATE OR REPLACE FUNCTION handle_new_user_account()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  -- First create the profile
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
    NEW.email, -- Temporary username from email
    '', -- Empty full name to be updated later
    '2000-01-01'::date, -- Default date to be updated later
    'other', -- Default gender to be updated later
    ARRAY[]::text[], -- Empty looking_for array
    ARRAY[]::text[] -- Empty interests array
  );

  -- Then get free plan with retry logic
  FOR i IN 1..3 LOOP
    SELECT id INTO free_plan_id FROM subscription_plans WHERE price = 0 LIMIT 1;
    IF free_plan_id IS NOT NULL THEN
      EXIT;
    END IF;
    PERFORM pg_sleep(0.1);
  END LOOP;

  IF free_plan_id IS NULL THEN
    RAISE WARNING 'Free plan not found for user %', NEW.id;
    RETURN NEW;
  END IF;

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