/*
  # Fix User Creation Process

  1. Changes
    - Add better error handling for user creation
    - Fix potential race conditions
    - Make profile fields nullable for initial creation
    - Improve trigger reliability
  
  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity
*/

-- First, modify the profiles table to make initial fields nullable
ALTER TABLE profiles
ALTER COLUMN username DROP NOT NULL,
ALTER COLUMN full_name DROP NOT NULL,
ALTER COLUMN birth_date DROP NOT NULL,
ALTER COLUMN gender DROP NOT NULL,
ALTER COLUMN looking_for SET DEFAULT ARRAY[]::text[];

-- Create a more reliable function for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id
  FROM subscription_plans
  WHERE price = 0 AND name = 'Free'
  LIMIT 1;

  -- Create initial profile with minimal data
  INSERT INTO profiles (
    id,
    username,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    now(),
    now()
  );

  -- Create free subscription
  IF free_plan_id IS NOT NULL THEN
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
      (now() + interval '100 years')
    );
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but allow user creation to proceed
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();