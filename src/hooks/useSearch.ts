import { useState, useCallback } from 'react';
import { searchProfiles, type SearchFilters } from '../services/searchService';
import type { Profile } from '../types/profile';

export function useSearch() {
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchProfiles(filters);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}