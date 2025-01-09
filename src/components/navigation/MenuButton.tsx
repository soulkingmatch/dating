import React, { useState } from 'react';
import { Menu, Settings, User, Shield, Bell, HelpCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuthStore();
  const menuRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const menuItems = [
    { icon: User, label: 'Account Settings', to: '/settings' },
    { icon: Bell, label: 'Notifications', to: '/settings/notifications' },
    { icon: Shield, label: 'Privacy', to: '/settings/privacy' },
    { icon: HelpCircle, label: 'Help & Support', to: '/help' },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Link>
          ))}
          
          <hr className="my-2" />
          
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}