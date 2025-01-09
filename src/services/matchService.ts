import { supabase } from '../config/supabase';
import type { Match, PotentialMatch } from '../types/match';
import { getCurrentUser } from '../config/supabase';

export async function getPotentialMatches(): Promise<PotentialMatch[]> {
  const user = await getCurrentUser();
  
  // Get existing matches
  const { data: matches } = await supabase
    .from('matches')
    .select('user2_id')
    .eq('user1_id', user.id);

  const matchedUserIds = matches?.map(m => m.user2_id) || [];

  // If no matches exist yet, just exclude the current user
  if (matchedUserIds.length === 0) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id);

    if (error) throw error;
    return profiles || [];
  }

  // Otherwise, exclude both the current user and matched users
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id)
    .not('id', `in.(${matchedUserIds.join(',')})`);

  if (error) throw error;
  return profiles || [];
}

export async function createMatch(targetUserId: string): Promise<Match> {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('matches')
    .insert({
      user1_id: user.id,
      user2_id: targetUserId,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function respondToMatch(matchId: string, accept: boolean): Promise<Match> {
  const { data, error } = await supabase
    .from('matches')
    .update({ status: accept ? 'accepted' : 'rejected' })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}