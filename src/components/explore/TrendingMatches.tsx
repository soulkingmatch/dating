import React from 'react';
import { Flame } from 'lucide-react';
import { useTrendingMatches } from '../../hooks/useTrendingMatches';

export function TrendingMatches() {
  const { trending, loading } = useTrendingMatches();

  return (
    <div className="bg-white rounded-lg shadow-xl p-4">
      <div className="flex items-center mb-4">
        <Flame className="w-5 h-5 text-orange-500 mr-2" />
        <h2 className="font-semibold text-gray-900">Trending Matches</h2>
      </div>

      <div className="space-y-4">
        {trending.map(profile => (
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
              <p className="text-sm text-gray-500">{profile.match_percentage}% Match</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}