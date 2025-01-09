import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (query: string, isUsername?: boolean) => void;
}

export function UserSearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [searchByUsername, setSearchByUsername] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, searchByUsername);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchByUsername ? "Enter exact username..." : "Search by name, interests, or AI tools..."}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center">
        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            checked={searchByUsername}
            onChange={(e) => setSearchByUsername(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span>Search by exact username</span>
        </label>
      </div>
    </form>
  );
}