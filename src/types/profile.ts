export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export interface BaseProfile {
  username: string | null;
  full_name: string | null;
  bio: string | null;
  birth_date: string | null;
  gender: Gender | null;
  looking_for: Gender[] | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  education: string | null;
  occupation: string | null;
  verified: boolean;
  last_active: string | null;
  profile_completion: number;
  social_links: Record<string, string>;
  profile_prompts: Array<{
    question: string;
    answer: string;
  }>;
  privacy_settings: {
    show_online_status: boolean;
    show_profile_visitors: boolean;
    show_photos: boolean;
    incognito_mode: boolean;
  };
}

export interface AIPreferences {
  favorite_llms: string[];
  ai_tools: string[];
  ai_interests: string[];
  ai_use_case: string | null;
}

export interface Profile extends BaseProfile, AIPreferences {
  id: string;
  created_at: string;
  updated_at: string;
}