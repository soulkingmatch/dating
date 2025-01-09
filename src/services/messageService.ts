import { supabase } from '../lib/supabase';
import type { Message, ChatRoom } from '../types/chat';

export async function getChatRooms(): Promise<ChatRoom[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      user1:profiles!matches_user1_id_fkey(id, full_name, avatar_url),
      user2:profiles!matches_user2_id_fkey(id, full_name, avatar_url),
      last_message:messages(
        id,
        content,
        created_at,
        sender_id,
        read_at
      )
    `)
    .eq('status', 'accepted')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('created_at', { foreignTable: 'messages', ascending: false });

  if (error) throw error;
  return data.map(match => formatChatRoom(match, user.id));
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function sendMessage(matchId: string, content: string): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAsRead(matchId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .is('read_at', null);

  if (error) throw error;
}

export function subscribeToMessages(matchId: string, onMessage: (message: Message) => void) {
  return supabase
    .channel(`match:${matchId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `match_id=eq.${matchId}`
    }, payload => {
      onMessage(payload.new as Message);
    })
    .subscribe();
}