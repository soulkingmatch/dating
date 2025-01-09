-- First ensure we have the correct price IDs
UPDATE subscription_plans
SET stripe_price_id = CASE 
  WHEN name = 'Basic' THEN 'prod_RWWYMeP34jrI6g'
  WHEN name = 'Premium' THEN 'prod_RWWcIq96Rl3z6i'
  WHEN name = 'VIP' THEN 'prod_RWWjxlrec225WY'
  ELSE stripe_price_id -- Keep free tier as is
END
WHERE name IN ('Basic', 'Premium', 'VIP');

-- Update plan features and limits
UPDATE subscription_plans
SET 
  features = CASE
    WHEN name = 'Basic' THEN ARRAY[
      '10 matches per day',
      'Basic messaging',
      'View who likes you',
      'Hide ads'
    ]
    WHEN name = 'Premium' THEN ARRAY[
      'Unlimited matches',
      'Advanced messaging',
      'See who likes you',
      'Priority in search results',
      'Advanced filters',
      'Read receipts'
    ]
    WHEN name = 'VIP' THEN ARRAY[
      'All Premium features',
      'Priority in search results',
      'Profile highlighting',
      'Advanced matching algorithm',
      'Dedicated support',
      'Early access to new features'
    ]
    ELSE features -- Keep free tier as is
  END,
  daily_match_limit = CASE
    WHEN name = 'Basic' THEN 10
    WHEN name = 'Premium' THEN 999999 -- Effectively unlimited
    WHEN name = 'VIP' THEN 999999 -- Effectively unlimited
    ELSE daily_match_limit -- Keep free tier as is
  END,
  messaging_limit = CASE
    WHEN name = 'Basic' THEN 50
    WHEN name = 'Premium' THEN 999999 -- Effectively unlimited
    WHEN name = 'VIP' THEN 999999 -- Effectively unlimited
    ELSE messaging_limit -- Keep free tier as is
  END
WHERE name IN ('Basic', 'Premium', 'VIP');

-- Ensure all plans have the correct prices
UPDATE subscription_plans
SET price = CASE
  WHEN name = 'Basic' THEN 9.99
  WHEN name = 'Premium' THEN 19.99
  WHEN name = 'VIP' THEN 39.99
  ELSE price -- Keep free tier as is
END
WHERE name IN ('Basic', 'Premium', 'VIP');