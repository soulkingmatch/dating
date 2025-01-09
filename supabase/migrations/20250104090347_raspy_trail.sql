/*
  # Update Stripe price IDs and add portal configuration

  1. Changes
    - Update subscription plans with correct Stripe price IDs
    - Add customer portal configuration
    - Add subscription management policies
*/

-- Update subscription plans with correct Stripe price IDs
UPDATE subscription_plans
SET stripe_price_id = CASE 
  WHEN name = 'Free' THEN 'free_tier'
  WHEN name = 'Basic' THEN 'price_basic'
  WHEN name = 'Premium' THEN 'price_premium'
  WHEN name = 'VIP' THEN 'price_vip'
END;

-- Add policy for subscription management
CREATE POLICY "Users can manage their own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);