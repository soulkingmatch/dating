import type { Profile } from './profile';

export interface FeedItem {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  interests?: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  user: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
  liked_by_user?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
}