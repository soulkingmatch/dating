import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';

interface TrendingProfile extends Profile {
  match_percentage: number;
}

export function useTrendingMatches() {
  const [trending, setTrending] = useState<TrendingProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(5);

        if (error) throw error;

        // Simulate match percentages for now
        const trendingWithMatches = data.map(profile => ({
          ...profile,
          match_percentage: Math.floor(Math.random() * 30) + 70 // 70-99%
        }));

        setTrending(trendingWithMatches);
      } catch (error) {
        console.error('Error fetching trending matches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return { trending, loading };
}