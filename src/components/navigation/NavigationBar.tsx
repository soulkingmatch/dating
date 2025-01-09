import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Search, MessageCircle, User } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';

export function NavigationBar() {
  const { profile } = useProfileStore();

  const navItems = [
    { to: '/', icon: Flame, label: 'Discover' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex flex-col items-center transition-colors
                ${isActive ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}
              `}
            >
              {to === '/profile' && profile?.avatar_url ? (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || ''} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Icon className="w-6 h-6" />
              )}
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}