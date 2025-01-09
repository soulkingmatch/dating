/*
  # Add Post Interaction Restrictions

  1. Changes
    - Add function to check subscription status
    - Update post interaction policies
    - Add subscription-based restrictions
  
  2. Security
    - Restrict commenting to paid subscribers
    - Allow likes for all users
*/

-- Create function to check if user has paid subscription
CREATE OR REPLACE FUNCTION has_paid_subscription(user_id uuid)
RETURNS boolean AS $$
DECLARE
  has_paid boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = user_id
    AND s.status = 'active'
    AND sp.price > 0
  ) INTO has_paid;
  
  RETURN has_paid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update post_comments policy to check for paid subscription
DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Only paid subscribers can create comments"
  ON post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_paid_subscription(auth.uid())
  );

-- Keep existing policies for likes (all users can like)
DROP POLICY IF EXISTS "Users can create likes" ON post_likes;
CREATE POLICY "All users can create likes"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);