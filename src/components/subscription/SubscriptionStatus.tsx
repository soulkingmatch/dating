import React, { useState } from 'react';
import { Crown, AlertTriangle } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { cancelSubscription } from '../../services/subscriptionService';

export function SubscriptionStatus() {
  const { currentSubscription, fetchCurrentSubscription } = useSubscriptionStore();
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentSubscription || currentSubscription.stripe_subscription_id === 'free_tier') {
    return null;
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    setCanceling(true);
    setError(null);

    try {
      await cancelSubscription();
      await fetchCurrentSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Crown className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold">Current Subscription</h2>
        </div>
        {currentSubscription.cancel_at_period_end && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Cancels at period end
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-2 mb-6">
        <p className="text-gray-600">
          Plan: <span className="font-semibold">{currentSubscription.subscription_plans.name}</span>
        </p>
        <p className="text-gray-600">
          Status: <span className="font-semibold capitalize">{currentSubscription.status}</span>
        </p>
        <p className="text-gray-600">
          Renews: <span className="font-semibold">
            {new Date(currentSubscription.current_period_end).toLocaleDateString()}
          </span>
        </p>
      </div>

      {!currentSubscription.cancel_at_period_end && (
        <button
          onClick={handleCancel}
          disabled={canceling}
          className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
        >
          {canceling ? 'Canceling...' : 'Cancel Subscription'}
        </button>
      )}
    </div>
  );
}