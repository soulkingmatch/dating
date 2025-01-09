import React from 'react';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';

export function SubscriptionBadge() {
  const { currentSubscription } = useSubscriptionStore();

  if (currentSubscription?.plan_id === 'free_tier') {
    return (
      <Link
        to="/subscription"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
      >
        <Crown className="w-4 h-4 mr-1" />
        Upgrade Now
      </Link>
    );
  }

  return null;
}