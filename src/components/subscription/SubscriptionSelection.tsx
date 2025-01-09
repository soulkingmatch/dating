import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PlansGrid } from './PlansGrid';

export function SubscriptionSelection() {
  const navigate = useNavigate();
  const { plans, loading, error, fetchPlans, subscribe } = useSubscriptionStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubscribe = async (planId: string) => {
    try {
      if (planId === 'free_tier') {
        navigate('/profile-setup');
      } else {
        await subscribe(planId);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Choose Your Perfect Match Plan
          </h2>
          <p className="mt-4 text-xl text-pink-100">
            Start your journey to find love with the perfect plan for you
          </p>
        </div>

        {error && (
          <div className="mt-8 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <PlansGrid plans={plans} onSubscribe={handleSubscribe} />
      </div>
    </div>
  );
}