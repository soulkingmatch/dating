import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, LogOut, Crown, Bell, Shield, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuthStore();
  const { profile } = useProfileStore();
  const { currentSubscription } = useSubscriptionStore();

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const isPremium = currentSubscription?.subscription_plans.price > 0;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-purple-600 font-semibold">
              {profile?.full_name?.[0] || 'U'}
            </span>
          )}
        </div>
        <span className="text-gray-900 font-medium hidden lg:block">
          {profile?.full_name?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              View Profile
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Link>

            <Link
              to="/settings/notifications"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </Link>

            <Link
              to="/settings/privacy"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-4 h-4 mr-3" />
              Privacy & Security
            </Link>
          </div>

          {!isPremium && (
            <div className="py-2 border-t border-gray-100">
              <Link
                to="/subscription"
                className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50"
                onClick={() => setIsOpen(false)}
              >
                <Crown className="w-4 h-4 mr-3" />
                Upgrade to Premium
              </Link>
            </div>
          )}

          <div className="py-2 border-t border-gray-100">
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}