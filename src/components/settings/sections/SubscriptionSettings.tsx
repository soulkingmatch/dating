import React from 'react';
import { useSubscriptionStore } from '../../../store/subscriptionStore';
import { Crown } from 'lucide-react';

export function SubscriptionSettings() {
  const { currentSubscription, plans } = useSubscriptionStore();

  const currentPlan = plans.find(p => p.id === currentSubscription?.plan_id);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Crown className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {currentPlan?.name || 'Free'} Plan
          </h3>
          {currentSubscription?.status === 'active' && (
            <p className="text-sm text-gray-500">
              Next billing date: {new Date(currentSubscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Plan Features</h4>
        <ul className="space-y-2">
          {currentPlan?.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Upgrade Plan
        </button>
        {currentSubscription?.status === 'active' && (
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel Subscription
          </button>
        )}
      </div>
    </div>
  );
}