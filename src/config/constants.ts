// Environment variables
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// App constants
export const APP_NAME = 'Soul King Match';
export const APP_DESCRIPTION = 'Find your AI soulmate';

// API endpoints
export const API_ENDPOINTS = {
  STRIPE_WEBHOOK: '/.netlify/functions/stripe-webhook',
  CREATE_CHECKOUT: '/.netlify/functions/create-checkout-session',
} as const;