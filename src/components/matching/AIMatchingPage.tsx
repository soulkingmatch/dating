import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { AIMatchCard } from './AIMatchCard';
import { SwipeControls } from './SwipeControls';
import { useProfileStore } from '../../store/profileStore';
import { useMatchStore } from '../../store/matchStore';
import { calculateAIMatchScore } from '../../utils/matchingAlgorithm';
import { getPotentialMatches } from '../../services/matchService';
import type { PotentialMatch } from '../../types/match';

export function AIMatchingPage() {
  const { profile } = useProfileStore();
  const { matches, likeProfile } = useMatchStore();
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  async function loadPotentialMatches() {
    if (!profile) return;
    
    try {
      const matches = await getPotentialMatches();
      const matchesWithScores = matches
        .map(p => ({
          ...p,
          match_percentage: calculateAIMatchScore(profile, p)
        }))
        .sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

      setPotentialMatches(matchesWithScores);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async () => {
    if (!potentialMatches.length) return;
    
    const match = potentialMatches[0];
    try {
      await likeProfile(match.id);
      setPotentialMatches(current => current.slice(1));
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = () => {
    setPotentialMatches(current => current.slice(1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Sparkles className="text-purple-600 w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">AI Matches</h1>
      </div>

      {potentialMatches.length > 0 ? (
        <div className="max-w-lg mx-auto">
          <AIMatchCard
            profile={potentialMatches[0]}
            aiMatchScore={potentialMatches[0].match_percentage || 0}
          />
          <SwipeControls
            onLike={handleLike}
            onPass={handlePass}
          />
        </div>
      ) : (
        <div className="text-center bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No More Matches</h2>
          <p className="text-gray-600">Check back later for new AI enthusiasts!</p>
        </div>
      )}
    </div>
  );
}