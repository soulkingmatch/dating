import { create } from 'zustand';
import type { SubscriptionPlan, Subscription } from '../types/subscription';
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createCheckoutSession,
} from '../services/subscriptionService';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchCurrentSubscription: () => Promise<void>;
  subscribe: (planId: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: [],
  currentSubscription: null,
  loading: false,
  error: null,

  initialize: async () => {
    try {
      set({ loading: true, error: null });
      await Promise.all([
        get().fetchPlans(),
        get().fetchCurrentSubscription()
      ]);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to initialize subscription' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPlans: async () => {
    try {
      const plans = await getSubscriptionPlans();
      set({ plans, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch plans' });
      throw error;
    }
  },

  fetchCurrentSubscription: async () => {
    try {
      const subscription = await getCurrentSubscription();
      set({ currentSubscription: subscription, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch subscription' });
      throw error;
    }
  },

  subscribe: async (planId: string) => {
    try {
      set({ loading: true, error: null });
      await createCheckoutSession(planId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create subscription';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));