import React, { useEffect } from 'react';
import { Crown } from 'lucide-react';
import { PricingPlans } from './PricingPlans';
import { SubscriptionStatus } from './SubscriptionStatus';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function SubscriptionPage() {
  const { initialize, loading, error } = useSubscriptionStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Crown className="text-white w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">Premium Membership</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <SubscriptionStatus />
        <PricingPlans />
      </div>
    </div>
  );
}