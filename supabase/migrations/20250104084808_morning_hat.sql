/*
  # Add Free Plan and Update Subscription Plans

  1. Changes
    - Add free plan to subscription_plans table
    - Update existing plans with more descriptive features
    - Add default plan assignment trigger for new users

  2. Security
    - Maintain existing RLS policies
    - Add trigger for automatic free plan assignment
*/

-- Insert free plan
INSERT INTO subscription_plans (name, price, interval, features, stripe_price_id) VALUES
('Free', 0, 'month', ARRAY[
  '3 matches per day',
  'Basic profile',
  'Limited messaging'
], 'free_tier');

-- Update premium plans with better features
INSERT INTO subscription_plans (name, price, interval, features, stripe_price_id) VALUES
('Basic', 9.99, 'month', ARRAY[
  '10 matches per day',
  'Enhanced profile customization',
  'Unlimited messaging',
  'See who likes you'
], 'price_H1...'),
('Premium', 19.99, 'month', ARRAY[
  'Unlimited matches',
  'Advanced profile customization',
  'Priority in search results',
  'Read receipts',
  'Advanced matching algorithm',
  'Profile highlighting'
], 'price_H2...'),
('VIP', 39.99, 'month', ARRAY[
  'All Premium features',
  'Profile boost every week',
  'Dedicated support',
  'Early access to new features',
  'Ad-free experience',
  'Exclusive VIP badge'
], 'price_H3...');

-- Create function to assign free plan to new users
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  SELECT id INTO free_plan_id FROM subscription_plans WHERE price = 0 LIMIT 1;
  
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically assign free plan
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_subscription();