import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}