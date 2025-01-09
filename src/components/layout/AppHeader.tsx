import React from 'react';
import { Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';

export function AppHeader() {
  const { profile } = useProfileStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transform transition-transform hover:scale-105"
          >
            <Crown className="w-8 h-8 text-pink-500" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Soul King
              </span>
              <span className="text-xs text-gray-500 -mt-1">Match</span>
            </div>
          </Link>

          {profile?.avatar_url && (
            <Link to="/profile">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-500 ring-offset-2 transition-transform hover:scale-110">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || ''} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}