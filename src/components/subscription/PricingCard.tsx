import React from 'react';
import { Check, Crown, Star } from 'lucide-react';
import type { SubscriptionPlan } from '../../types/subscription';

interface Props {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  onSubscribe: (planId: string) => void;
  isCurrentPlan?: boolean;
  loading?: boolean;
}

export function PricingCard({ plan, isPopular, onSubscribe, isCurrentPlan, loading }: Props) {
  const getPlanStyle = () => {
    switch (plan.name.toLowerCase()) {
      case 'vip':
        return {
          icon: <Crown className="h-6 w-6 text-yellow-500" />,
          buttonClass: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      case 'premium':
        return {
          icon: <Star className="h-6 w-6 text-purple-600" />,
          buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white'
        };
      default:
        return {
          icon: null,
          buttonClass: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
    }
  };

  const style = getPlanStyle();

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
        isPopular ? 'border-2 border-purple-500 transform scale-105' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {style.icon}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-500 ml-1">/{plan.interval}</span>
          </p>
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSubscribe(plan.stripe_price_id)}
          disabled={isCurrentPlan || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isCurrentPlan
              ? 'bg-green-100 text-green-800 cursor-default'
              : style.buttonClass
          }`}
        >
          {isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
}