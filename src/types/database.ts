import type { Profile } from './profile';
import type { Match } from './match';
import type { Subscription, SubscriptionPlan } from './subscription';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Profile>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at'>;
        Update: Partial<Match>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Subscription>;
      };
      subscription_plans: {
        Row: SubscriptionPlan;
        Insert: Omit<SubscriptionPlan, 'id' | 'created_at'>;
        Update: Partial<SubscriptionPlan>;
      };
    };
    Functions: {
      search_profiles_by_location: {
        Args: {
          search_location: [number, number];
          max_distance: number;
          p_gender?: string[];
          min_age?: number;
          max_age?: number;
        };
        Returns: Profile[];
      };
    };
  };
}