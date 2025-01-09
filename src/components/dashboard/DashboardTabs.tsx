import React from 'react';
import { Users, Heart } from 'lucide-react';

interface Props {
  activeTab: 'discover' | 'matches';
  onTabChange: (tab: 'discover' | 'matches') => void;
}

export function DashboardTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onTabChange('discover')}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          activeTab === 'discover'
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Users className="w-5 h-5 mr-2" />
        Discover
      </button>
      <button
        onClick={() => onTabChange('matches')}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          activeTab === 'matches'
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Heart className="w-5 h-5 mr-2" />
        Matches
      </button>
    </div>
  );
}