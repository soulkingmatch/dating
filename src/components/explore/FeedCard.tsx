import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { timeSince } from '../../utils/dateUtils';
import { CommentSection } from '../feed/CommentSection';
import { useFeedStore } from '../../store/feedStore';
import type { FeedItem, Comment } from '../../types/feed';

interface Props {
  item: FeedItem;
  currentUserId?: string;
}

export function FeedCard({ item, currentUserId }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { likePost, unlikePost, addComment, fetchComments } = useFeedStore();

  const toggleComments = async () => {
    if (!showComments && !comments.length) {
      setLoadingComments(true);
      try {
        const fetchedComments = await fetchComments(item.id);
        setComments(fetchedComments);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    try {
      if (item.liked_by_user) {
        await unlikePost(item.id);
      } else {
        await likePost(item.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      await addComment(item.id, content);
      const updatedComments = await fetchComments(item.id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* User Info */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          {item.user.avatar_url ? (
            <img 
              src={item.user.avatar_url} 
              alt={item.user.full_name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-purple-600 font-semibold">
              {item.user.full_name[0]}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{item.user.full_name}</h3>
          <p className="text-sm text-gray-500">{timeSince(new Date(item.created_at))}</p>
        </div>
      </div>

      {/* Content */}
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt="Post content"
          className="w-full aspect-video object-cover"
        />
      )}
      
      <div className="p-4">
        <p className="text-gray-800">{item.content}</p>
        
        {/* Interests/Tags */}
        {item.interests && item.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.interests.map(interest => (
              <span 
                key={interest}
                className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              item.liked_by_user ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${item.liked_by_user ? 'fill-current' : ''}`} />
            <span>{item.likes_count}</span>
          </button>
          <button 
            onClick={toggleComments}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{item.comments_count}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentSection
            postId={item.id}
            comments={comments}
            onAddComment={handleAddComment}
          />
        )}
      </div>
    </div>
  );
}