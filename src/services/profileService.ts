import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';
import { uploadMedia } from './uploadService';

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Not authenticated');
  return user;
}

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function initializeProfile(): Promise<Profile> {
  const user = await getCurrentUser();
  const existingProfile = await fetchUserProfile(user.id);
  
  if (existingProfile) {
    return existingProfile;
  }

  // Create initial profile
  const newProfile: Partial<Profile> = {
    id: user.id,
    username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
    full_name: '',
    bio: '',
    birth_date: null,
    gender: null,
    looking_for: [],
    location: null,
    avatar_url: null,
    cover_url: null,
    education: null,
    occupation: null,
    verified: false,
    last_active: new Date().toISOString(),
    profile_completion: 0,
    social_links: {},
    profile_prompts: [],
    privacy_settings: {
      show_online_status: true,
      show_profile_visitors: true,
      show_photos: true,
      incognito_mode: false
    },
    favorite_llms: [],
    ai_tools: [],
    ai_interests: [],
    ai_use_case: null
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert([newProfile])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const user = await getCurrentUser();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function uploadProfileImage(file: File, type: 'avatar' | 'cover'): Promise<string> {
  try {
    const bucket = type === 'avatar' ? 'avatars' : 'covers';
    const url = await uploadMedia(file, bucket);
    
    const user = await getCurrentUser();
    await updateProfile({
      [type === 'avatar' ? 'avatar_url' : 'cover_url']: url
    });

    return url;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    throw error;
  }
}

export async function updateLastActive(): Promise<void> {
  try {
    const user = await getCurrentUser();
    await updateProfile({
      last_active: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating last active:', error);
  }
}