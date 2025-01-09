import React from 'react';
import { Clock } from 'lucide-react';

interface Props {
  lastActive: string | null;
  className?: string;
}

export function LastActive({ lastActive, className = '' }: Props) {
  if (!lastActive) return null;

  const getLastActiveText = (date: string) => {
    const lastActiveDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / 1000 / 60);

    if (diffMinutes < 1) return 'Online now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return lastActiveDate.toLocaleDateString();
  };

  return (
    <div className={`flex items-center text-sm text-gray-500 ${className}`}>
      <Clock className="w-4 h-4 mr-1" />
      <span>{getLastActiveText(lastActive)}</span>
    </div>
  );
}