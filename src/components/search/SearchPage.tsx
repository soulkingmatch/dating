import React, { useState } from 'react';
import { Search as SearchIcon, UserX } from 'lucide-react';
import { UserSearchBar } from './UserSearchBar';
import { SearchFilters } from './SearchFilters';
import { UserGrid } from './UserGrid';
import { useSearch } from '../../hooks/useSearch';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function SearchPage() {
  const { results, loading, error, search } = useSearch();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string, isUsername?: boolean) => {
    if (isUsername) {
      search({ username: query });
    } else {
      search({ query });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <SearchIcon className="text-white w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">Find Your Match</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <UserSearchBar onSearch={handleSearch} />
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 text-white hover:text-purple-200"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="mt-4">
            <SearchFilters onFiltersChange={search} />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : results.length === 0 ? (
          <div className="mt-8 bg-white rounded-lg shadow-xl p-8 text-center">
            <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more matches.
            </p>
          </div>
        ) : (
          <UserGrid users={results} />
        )}
      </div>
    </div>
  );
}