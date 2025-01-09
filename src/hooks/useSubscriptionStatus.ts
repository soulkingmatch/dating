import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSubscriptionStatus() {
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasPaidSubscription(false);
        return;
      }

      // First try to get active subscription
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      // Check if any subscription is paid
      const hasPaid = subscriptions?.some(sub => sub.subscription_plans.price > 0) ?? false;
      setHasPaidSubscription(hasPaid);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasPaidSubscription(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSubscription]);

  return { hasPaidSubscription, loading, refreshStatus: checkSubscription };
}