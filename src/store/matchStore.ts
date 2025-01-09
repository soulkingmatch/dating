import { create } from 'zustand';
import type { Match } from '../types/match';
import { createMatch, respondToMatch } from '../services/matchService';

interface MatchState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  likeProfile: (userId: string) => Promise<void>;
  respondToMatchRequest: (matchId: string, accept: boolean) => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  loading: false,
  error: null,

  likeProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const match = await createMatch(userId);
      set(state => ({
        matches: [...state.matches, match]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  respondToMatchRequest: async (matchId: string, accept: boolean) => {
    set({ loading: true, error: null });
    try {
      const updatedMatch = await respondToMatch(matchId, accept);
      set(state => ({
        matches: state.matches.map(match =>
          match.id === matchId ? updatedMatch : match
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));