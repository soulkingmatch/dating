import React from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface Props {
  items: NavItem[];
}

export function MobileNav({ items }: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="grid grid-cols-4 h-16">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center text-xs font-medium
              ${isActive 
                ? 'text-purple-600' 
                : 'text-gray-500 hover:text-purple-600'}
            `}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}