import { useState, useEffect, useCallback } from 'react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { supabase } from '../lib/supabase';

interface SubscriptionLimits {
  dailyMatchesLeft: number;
  hasUnlimitedMessaging: boolean;
  messagesLeft: number | null;
}

export function useSubscriptionLimits() {
  const [limits, setLimits] = useState<SubscriptionLimits>({
    dailyMatchesLeft: 0,
    hasUnlimitedMessaging: false,
    messagesLeft: null
  });
  const { currentSubscription } = useSubscriptionStore();

  const fetchLimits = useCallback(async () => {
    if (!currentSubscription) return;

    try {
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('daily_match_limit, messaging_limit')
        .eq('id', currentSubscription.plan_id)
        .single();

      if (!plan) return;

      const { data: todayMatches } = await supabase
        .from('matches')
        .select('id')
        .eq('user1_id', currentSubscription.user_id)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      const matchesUsed = todayMatches?.length || 0;
      
      setLimits({
        dailyMatchesLeft: plan.daily_match_limit - matchesUsed,
        hasUnlimitedMessaging: plan.messaging_limit === null,
        messagesLeft: plan.messaging_limit
      });
    } catch (error) {
      console.error('Error fetching subscription limits:', error);
    }
  }, [currentSubscription]);

  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]);

  return limits;
}