import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ icon: Icon, title, children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}