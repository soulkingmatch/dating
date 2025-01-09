import { supabase } from '../lib/supabase';
import { getCurrentUser } from './profileService';
import { getConnectedUserIds } from '../utils/connectionUtils';
import type { Profile } from '../types/profile';

export interface SearchFilters {
  query?: string;
  username?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: string[];
  aiInterests?: string[];
  aiTools?: string[];
}

export async function searchProfiles(filters: SearchFilters): Promise<Profile[]> {
  const user = await getCurrentUser();
  let query = supabase.from('profiles').select('*');

  // If searching by exact username, prioritize that
  if (filters.username) {
    query = query.eq('username', filters.username);
  }
  // Otherwise, apply regular search filters
  else if (filters.query) {
    query = query.or(
      `username.ilike.%${filters.query}%,` +
      `full_name.ilike.%${filters.query}%,` +
      `ai_interests.cs.{${filters.query}},` +
      `ai_tools.cs.{${filters.query}},` +
      `favorite_llms.cs.{${filters.query}}`
    );
  }

  // Apply other filters
  if (filters.ageRange) {
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - filters.ageRange.max);
    maxDate.setFullYear(maxDate.getFullYear() - filters.ageRange.min);
    
    query = query
      .gte('birth_date', minDate.toISOString())
      .lte('birth_date', maxDate.toISOString());
  }

  if (filters.gender?.length) {
    query = query.in('gender', filters.gender);
  }

  // Don't include current user in results
  query = query.neq('id', user.id);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}