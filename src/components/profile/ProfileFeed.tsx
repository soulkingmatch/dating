import React, { useEffect } from 'react';
import { useFeedStore } from '../../store/feedStore';
import { FeedCard } from '../explore/FeedCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Props {
  userId: string;
}

export function ProfileFeed({ userId }: Props) {
  const { feedItems, loading, error, fetchFeedItems } = useFeedStore();

  useEffect(() => {
    fetchFeedItems(userId);
  }, [userId, fetchFeedItems]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      {feedItems.length === 0 ? (
        <div className="text-center text-gray-500 bg-white rounded-lg shadow-xl p-8">
          No posts yet. Share something with your matches!
        </div>
      ) : (
        feedItems.map(item => (
          <FeedCard 
            key={item.id} 
            item={item}
            currentUserId={userId}
          />
        ))
      )}
    </div>
  );
}