import React from 'react';
import { Heart, X, MapPin } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface Props {
  results: Profile[];
  onLike?: (profile: Profile) => void;
  onPass?: (profile: Profile) => void;
}

export function SearchResults({ results, onLike, onPass }: Props) {
  if (!results.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No matches found with current filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map(profile => (
        <div key={profile.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div 
            className="h-48 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${profile.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'})`
            }}
          />
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {profile.full_name}, {new Date().getFullYear() - new Date(profile.birth_date).getFullYear()}
                </h3>
                <p className="text-sm text-gray-600">{profile.gender}</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{profile.bio}</p>
            
            {profile.interests?.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {onLike && onPass && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => onPass(profile)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={() => onLike(profile)}
                  className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <Heart className="w-6 h-6 text-purple-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}