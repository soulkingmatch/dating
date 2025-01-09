import React, { useEffect } from 'react';
import { useProfileStore } from '../../store/profileStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { FeedCard } from './FeedCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useFeedStore } from '../../store/feedStore';

export function FeedSection() {
  const { feedItems, loading, error, fetchFeedItems } = useFeedStore();
  const { profile, fetchProfile } = useProfileStore();
  const { initialize } = useSubscriptionStore();

  useEffect(() => {
    async function initializeData() {
      try {
        await Promise.all([
          fetchProfile(),
          initialize()
        ]);
        await fetchFeedItems();
      } catch (error) {
        console.error('Error initializing feed:', error);
      }
    }

    initializeData();
  }, [fetchProfile, initialize, fetchFeedItems]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
        <p className="text-gray-600">Please complete your profile to see feed items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
          <p className="text-gray-600">Be the first to share something!</p>
        </div>
      ) : (
        feedItems.map(item => (
          <FeedCard 
            key={item.id} 
            item={item}
            currentUserId={profile?.id}
          />
        ))
      )}
    </div>
  );
}