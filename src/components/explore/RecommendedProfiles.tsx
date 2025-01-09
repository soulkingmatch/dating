import React from 'react';
import { Sparkles } from 'lucide-react';
import { useRecommendedProfiles } from '../../hooks/useRecommendedProfiles';

export function RecommendedProfiles() {
  const { profiles, loading } = useRecommendedProfiles();

  return (
    <div className="bg-white rounded-lg shadow-xl p-4">
      <div className="flex items-center mb-4">
        <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
        <h2 className="font-semibold text-gray-900">Recommended for You</h2>
      </div>

      <div className="space-y-4">
        {profiles.map(profile => (
          <div key={profile.id} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 font-semibold">
                  {profile.full_name[0]}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{profile.full_name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.ai_interests.slice(0, 2).map(interest => (
                  <span 
                    key={interest}
                    className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}