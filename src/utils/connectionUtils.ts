import { supabase } from '../lib/supabase';

export async function hasConnection(userId1: string, userId2: string): Promise<boolean> {
  // Check if users have a mutual match
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .or(`and(user1_id.eq.${userId1},user2_id.eq.${userId2}),and(user1_id.eq.${userId2},user2_id.eq.${userId1})`)
    .eq('status', 'accepted')
    .limit(1);

  if (error) {
    console.error('Error checking connection:', error);
    return false;
  }

  return matches.length > 0;
}

export async function getConnectedUserIds(userId: string): Promise<string[]> {
  const { data: matches, error } = await supabase
    .from('matches')
    .select('user1_id, user2_id')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (error) {
    console.error('Error getting connected users:', error);
    return [];
  }

  return matches.reduce((acc: string[], match) => {
    const connectedUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
    return [...acc, connectedUserId];
  }, []);
}