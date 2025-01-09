import React from 'react';
import { X, Heart } from 'lucide-react';

interface Props {
  onLike: () => void;
  onPass: () => void;
  disabled?: boolean;
}

export function SwipeControls({ onLike, onPass, disabled }: Props) {
  return (
    <div className="flex justify-center gap-6 mt-6">
      <button
        onClick={onPass}
        disabled={disabled}
        className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        <X className="w-8 h-8 text-gray-600" />
      </button>
      <button
        onClick={onLike}
        disabled={disabled}
        className="p-4 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors disabled:opacity-50"
      >
        <Heart className="w-8 h-8 text-purple-600" />
      </button>
    </div>
  );
}