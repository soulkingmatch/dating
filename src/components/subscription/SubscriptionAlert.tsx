import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useSubscriptionLimits } from '../../hooks/useSubscriptionLimits';
import { Link } from 'react-router-dom';

export function SubscriptionAlert() {
  const { dailyMatchesLeft, hasUnlimitedMessaging, messagesLeft } = useSubscriptionLimits();

  if (dailyMatchesLeft > 0 && (hasUnlimitedMessaging || messagesLeft! > 5)) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
        <div>
          {dailyMatchesLeft <= 0 && (
            <p className="text-sm text-yellow-700">
              You've reached your daily match limit.{' '}
              <Link to="/pricing" className="font-medium underline">
                Upgrade your plan
              </Link>{' '}
              for more matches!
            </p>
          )}
          {!hasUnlimitedMessaging && messagesLeft! <= 5 && (
            <p className="text-sm text-yellow-700">
              You have {messagesLeft} messages left today.{' '}
              <Link to="/pricing" className="font-medium underline">
                Upgrade for unlimited messaging
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}