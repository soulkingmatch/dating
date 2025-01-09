import React from 'react';
import { Heart, X } from 'lucide-react';
import type { PotentialMatch } from '../../types/match';

interface Props {
  profile: PotentialMatch;
  onLike: () => void;
  onPass: () => void;
}

export function PotentialMatch({ profile, onLike, onPass }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div 
        className="h-96 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80)`
        }}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{profile.full_name}, {new Date().getFullYear() - new Date(profile.birth_date).getFullYear()}</h2>
          {profile.match_percentage && (
            <span className="text-purple-600 font-semibold">{profile.match_percentage}% Match</span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{profile.bio}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onPass}
            className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
          <button
            onClick={onLike}
            className="p-4 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
          >
            <Heart className="w-8 h-8 text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  );
}