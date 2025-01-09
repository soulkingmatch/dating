import React from 'react';
import { Users } from 'lucide-react';
import { FeedSection } from './FeedSection';
import { TrendingMatches } from './TrendingMatches';
import { RecommendedProfiles } from './RecommendedProfiles';

export function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Users className="text-white w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">Explore</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          <FeedSection />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <TrendingMatches />
          <RecommendedProfiles />
        </div>
      </div>
    </div>
  );
}