import React, { useEffect } from 'react';
import { Crown } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { PricingCard } from './PricingCard';

export function PricingPlans() {
  const { plans, currentSubscription, subscribe, loading, fetchPlans } = useSubscriptionStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubscribe = async (priceId: string) => {
    if (priceId === 'free_tier') return;
    try {
      await subscribe(priceId);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  // Sort plans by price
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <Crown className="w-12 h-12 text-white/90 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg text-white/80">
          Unlock premium features and find your perfect match
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {sortedPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isPopular={plan.name === 'Premium'}
            onSubscribe={handleSubscribe}
            isCurrentPlan={currentSubscription?.plan_id === plan.id}
            loading={loading}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-white/80 text-sm">
          All plans include a 7-day money-back guarantee
        </p>
        <p className="text-white/60 text-sm mt-2">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}