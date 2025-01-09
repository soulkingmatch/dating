import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileStore } from '../store/profileStore';
import { calculateAIMatchScore } from '../utils/matchingAlgorithm';
import type { Profile } from '../types/profile';

export function useRecommendedProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile: currentProfile } = useProfileStore();

  useEffect(() => {
    async function fetchRecommended() {
      if (!currentProfile) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentProfile.id)
          .limit(5);

        if (error) throw error;

        // Sort by AI match score
        const sortedProfiles = data
          .map(profile => ({
            ...profile,
            matchScore: calculateAIMatchScore(currentProfile, profile)
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .map(({ matchScore, ...profile }) => profile);

        setProfiles(sortedProfiles);
      } catch (error) {
        console.error('Error fetching recommended profiles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommended();
  }, [currentProfile]);

  return { profiles, loading };
}