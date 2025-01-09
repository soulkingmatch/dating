import React, { useState } from 'react';
import { Send, Lock } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { useSubscriptionStatus } from '../../hooks/useSubscriptionStatus';
import { timeSince } from '../../utils/dateUtils';
import type { Comment } from '../../types/feed';

interface Props {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
}

export function CommentSection({ postId, comments, onAddComment }: Props) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useProfileStore();
  const { hasPaidSubscription, loading: checkingSubscription } = useSubscriptionStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting || !hasPaidSubscription) return;

    try {
      setSubmitting(true);
      await onAddComment(content);
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      {/* Comment Form */}
      {hasPaidSubscription ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || ''} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm text-purple-600 font-bold">
                  {profile?.full_name?.[0]}
                </span>
              </div>
            )}
          </div>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-1 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg mb-4">
          <Lock className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-600">
            Subscribe to unlock commenting
          </p>
          <a 
            href="/subscription" 
            className="text-sm text-purple-600 font-medium hover:text-purple-700"
          >
            Upgrade Now
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0">
              {comment.user.avatar_url ? (
                <img 
                  src={comment.user.avatar_url} 
                  alt={comment.user.full_name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm text-purple-600 font-bold">
                    {comment.user.full_name[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <span className="font-semibold text-sm">{comment.user.full_name}</span>
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {timeSince(new Date(comment.created_at))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}