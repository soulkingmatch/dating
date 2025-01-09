import { supabase } from '../lib/supabase';
import type { Message, ChatRoom } from '../types/chat';
import { getCurrentUser } from './profileService';

export async function getChatRooms(): Promise<ChatRoom[]> {
  const user = await getCurrentUser();
  
  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      id,
      user1:profiles!matches_user1_id_fkey(id, full_name, avatar_url),
      user2:profiles!matches_user2_id_fkey(id, full_name, avatar_url),
      messages:messages(
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

  return matches.map(match => {
    const partner = match.user1.id === user.id ? match.user2 : match.user1;
    const lastMessage = match.messages[0];
    const unreadCount = match.messages.filter(
      m => m.sender_id !== user.id && !m.read_at
    ).length;

    return {
      match_id: match.id,
      partner_id: partner.id,
      partner_name: partner.full_name,
      partner_avatar: partner.avatar_url,
      last_message: lastMessage,
      unread_count: unreadCount
    };
  });
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendMessage(matchId: string, content: string): Promise<Message> {
  const user = await getCurrentUser();
  
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

export async function markMessagesAsRead(matchId: string): Promise<void> {
  const user = await getCurrentUser();
  
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .eq('sender_id', user.id)
    .is('read_at', null);

  if (error) throw error;
}