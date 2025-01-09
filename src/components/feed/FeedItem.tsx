```tsx
import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { timeSince } from '../../utils/dateUtils';
import type { FeedItem as FeedItemType } from '../../types/feed';

interface Props {
  item: FeedItemType;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export function FeedItem({ item, onLike, onComment, onShare }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
      <div className="px-4 py-2">
        <p className="text-gray-800">{item.content}</p>
      </div>

      {/* Image if exists */}
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt="Post content"
          className="w-full h-64 object-cover"
        />
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <button 
          onClick={onLike}
          className={`flex items-center space-x-1 ${
            item.liked_by_user ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={item.liked_by_user ? 'fill-current' : ''} size={20} />
          <span>{item.likes_count}</span>
        </button>

        <button 
          onClick={onComment}
          className="flex items-center space-x-1 text-gray-600"
        >
          <MessageCircle size={20} />
          <span>{item.comments_count}</span>
        </button>

        <button 
          onClick={onShare}
          className="text-gray-600"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
```