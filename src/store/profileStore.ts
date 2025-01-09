import { create } from 'zustand';
import type { Profile } from '../types/profile';
import { getCurrentUser, fetchUserProfile, updateProfile, initializeProfile, updateLastActive } from '../services/profileService';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getCurrentUser();
      const profile = await initializeProfile();
      set({ profile });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: message });
      console.error('Error fetching profile:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const profile = await updateProfile(data);
      set({ profile });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: message });
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

// Update last active status periodically
setInterval(updateLastActive, 5 * 60 * 1000); // Every 5 minutes