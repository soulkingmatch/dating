import React, { useEffect, useState } from 'react';
import { Crown, Loader } from 'lucide-react';
import { PotentialMatch as PotentialMatchCard } from './PotentialMatch';
import { MatchesList } from './MatchesList';
import { DashboardTabs } from './DashboardTabs';
import { SubscriptionStatus } from '../subscription/SubscriptionStatus';
import { useMatchStore } from '../../store/matchStore';
import { getPotentialMatches } from '../../services/matchService';
import type { PotentialMatch } from '../../types/match';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { matches, likeProfile, respondToMatchRequest } = useMatchStore();

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  async function loadPotentialMatches() {
    try {
      const matches = await getPotentialMatches();
      setPotentialMatches(matches);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(profile: PotentialMatch) {
    try {
      await likeProfile(profile.id);
      setPotentialMatches(current => current.filter(p => p.id !== profile.id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function handlePass(profile: PotentialMatch) {
    setPotentialMatches(current => current.filter(p => p.id !== profile.id));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Crown className="text-yellow-400 w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">Soul King Match</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <SubscriptionStatus />
        
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'discover' ? (
          potentialMatches.length > 0 ? (
            <PotentialMatchCard
              profile={potentialMatches[0]}
              onLike={() => handleLike(potentialMatches[0])}
              onPass={() => handlePass(potentialMatches[0])}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No More Matches</h2>
              <p className="text-gray-600">Check back later for new potential matches!</p>
            </div>
          )
        ) : (
          <MatchesList
            matches={matches}
            onAccept={(matchId) => respondToMatchRequest(matchId, true)}
            onReject={(matchId) => respondToMatchRequest(matchId, false)}
          />
        )}
      </div>
    </div>
  );
}