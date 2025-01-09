import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import type { SubscriptionPlan, Subscription } from '../types/subscription';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price');

  if (error) throw error;
  return data || [];
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // First try to get active subscription
  const { data: activeSubscription, error: activeError } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (activeError && activeError.code !== 'PGRST116') throw activeError;
  if (activeSubscription) return activeSubscription;

  // If no active subscription, get the free plan
  const { data: freePlan, error: freeError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('price', 0)
    .single();

  if (freeError) throw freeError;

  // Return a synthetic subscription object for the free plan
  return {
    id: 'free',
    user_id: user.id,
    plan_id: freePlan.id,
    status: 'active',
    stripe_subscription_id: 'free_tier',
    current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    cancel_at_period_end: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subscription_plans: freePlan
  };
}

export async function createCheckoutSession(planId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, userId: user.id }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  
  if (!stripe) throw new Error('Stripe failed to load');
  
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
}

export async function cancelSubscription(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('status', 'active');

  if (error) throw error;
}