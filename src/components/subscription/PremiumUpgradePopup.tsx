import React from 'react';
import { X, Crown, Star, Zap } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { PlanFeatureList } from './PlanFeatureList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumUpgradePopup({ isOpen, onClose }: Props) {
  const { plans, subscribe, loading } = useSubscriptionStore();

  if (!isOpen) return null;

  const premiumPlans = plans.filter(plan => plan.price > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
          </div>
          <p className="text-gray-600">
            Unlock premium features and increase your chances of finding your perfect AI match!
          </p>
        </div>

        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {premiumPlans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                {plan.name === 'VIP' ? (
                  <Crown className="w-6 h-6 text-yellow-500" />
                ) : plan.name === 'Premium' ? (
                  <Star className="w-6 h-6 text-purple-500" />
                ) : (
                  <Zap className="w-6 h-6 text-blue-500" />
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>

              <PlanFeatureList features={plan.features} />

              <button
                onClick={() => subscribe(plan.id)}
                disabled={loading}
                className={`mt-auto w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  plan.name === 'VIP'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : plan.name === 'Premium'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}