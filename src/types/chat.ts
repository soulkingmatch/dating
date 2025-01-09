export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface ChatRoom {
  match_id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar: string | null;
  last_message?: Message;
  unread_count: number;
}