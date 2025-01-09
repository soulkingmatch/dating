/*
  # Update Stripe Product IDs

  1. Changes
    - Update subscription plans with correct Stripe product IDs
    - Ensure proper mapping between plans and Stripe products
*/

UPDATE subscription_plans
SET stripe_price_id = CASE 
  WHEN name = 'Basic' THEN 'prod_RWWYMeP34jrI6g'
  WHEN name = 'Premium' THEN 'prod_RWWcIq96Rl3z6i'
  WHEN name = 'VIP' THEN 'prod_RWWjxlrec225WY'
  ELSE stripe_price_id -- Keep free tier as is
END
WHERE name != 'Free';