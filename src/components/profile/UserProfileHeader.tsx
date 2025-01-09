import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface Props {
  profile: Profile;
}

export function UserProfileHeader({ profile }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-purple-100">
        {profile.cover_url && (
          <img 
            src={profile.cover_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 py-4">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-100 overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || ''} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl text-purple-600 font-bold">
                  {profile.full_name?.[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="ml-40">
          <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
          <p className="text-gray-600 mt-1">{profile.bio}</p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            {profile.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.looking_for && profile.looking_for.length > 0 && (
              <div className="flex items-center text-gray-600">
                <Heart className="w-4 h-4 mr-1" />
                <span>Looking for: {profile.looking_for.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}