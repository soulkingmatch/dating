```tsx
import React from 'react';
import { Filter, Sparkles } from 'lucide-react';

interface Props {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

export function FeedFilters({ onFilterChange, currentFilter }: Props) {
  const filters = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'trending', label: 'Trending', icon: Sparkles },
    { id: 'following', label: 'Following', icon: Sparkles },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            currentFilter === id
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
```