export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripe_price_id: string;
  daily_match_limit: number;
  messaging_limit: number | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  stripe_subscription_id: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  subscription_plans: SubscriptionPlan;
}