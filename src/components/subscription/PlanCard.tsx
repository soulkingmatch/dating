import React from 'react';
import { Crown, Check, Star } from 'lucide-react';
import type { SubscriptionPlan } from '../../types/subscription';

interface Props {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
}

export function PlanCard({ plan, onSubscribe }: Props) {
  const getPlanStyle = () => {
    switch (plan.name) {
      case 'VIP':
        return {
          border: 'border-yellow-500 ring-2 ring-yellow-500',
          icon: <Crown className="h-8 w-8 text-yellow-400" />,
          button: 'bg-yellow-600 text-white hover:bg-yellow-700'
        };
      case 'Premium':
        return {
          border: 'border-purple-500 ring-2 ring-purple-500',
          icon: <Star className="h-8 w-8 text-purple-500" />,
          button: 'bg-purple-600 text-white hover:bg-purple-700'
        };
      default:
        return {
          border: 'border-gray-200',
          icon: null,
          button: plan.price === 0 
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            : 'bg-pink-600 text-white hover:bg-pink-700'
        };
    }
  };

  const style = getPlanStyle();

  return (
    <div className={`bg-white border rounded-lg shadow-xl divide-y divide-gray-200 ${style.border}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
          {style.icon}
        </div>
        <p className="mt-8">
          <span className="text-4xl font-extrabold text-gray-900">
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-base font-medium text-gray-500">
              /{plan.interval}
            </span>
          )}
        </p>
        <button
          onClick={() => onSubscribe(plan.stripe_price_id)}
          className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${style.button}`}
        >
          {plan.price === 0 ? 'Start Free' : 'Subscribe'}
        </button>
      </div>
      <div className="px-6 pt-6 pb-8">
        <h4 className="text-sm font-medium text-gray-900 tracking-wide mb-4">
          Features included:
        </h4>
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="ml-3 text-sm text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}