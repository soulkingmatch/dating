import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { FeedItem, Comment } from '../types/feed';

interface FeedState {
  feedItems: FeedItem[];
  loading: boolean;
  error: string | null;
  fetchFeedItems: (userId?: string) => Promise<void>;
  addFeedItem: (content: string, imageUrl?: string, interests?: string[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<Comment[]>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  feedItems: [],
  loading: false,
  error: null,

  fetchFeedItems: async (userId?: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('feed_items')
        .select(`
          *,
          user:profiles!feed_items_user_id_fkey(id, full_name, avatar_url),
          likes:post_likes!post_likes_post_id_fkey(user_id)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const feedItems = data.map(item => ({
        ...item,
        liked_by_user: item.likes?.some(like => like.user_id === user.id) || false,
        user: item.user
      }));

      set({ feedItems });
    } catch (error) {
      console.error('Error fetching feed:', error);
      set({ error: 'Failed to load feed items' });
    } finally {
      set({ loading: false });
    }
  },

  addFeedItem: async (content, imageUrl, interests) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('feed_items')
        .insert({
          user_id: user.id,
          content,
          image_url: imageUrl,
          interests: interests || []
        })
        .select(`
          *,
          user:profiles!feed_items_user_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      const newItem = {
        ...data,
        liked_by_user: false,
        likes_count: 0,
        comments_count: 0,
        user: data.user
      };

      set(state => ({ feedItems: [newItem, ...state.feedItems] }));
    } catch (error) {
      console.error('Error adding feed item:', error);
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;

      set(state => ({
        feedItems: state.feedItems.map(item =>
          item.id === postId
            ? { ...item, liked_by_user: true, likes_count: item.likes_count + 1 }
            : item
        )
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  unlikePost: async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .match({ post_id: postId, user_id: user.id });

      if (error) throw error;

      set(state => ({
        feedItems: state.feedItems.map(item =>
          item.id === postId
            ? { ...item, liked_by_user: false, likes_count: Math.max(0, item.likes_count - 1) }
            : item
        )
      }));
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  },

  addComment: async (postId, content) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: user.id, content });

      if (error) throw error;

      set(state => ({
        feedItems: state.feedItems.map(item =>
          item.id === postId
            ? { ...item, comments_count: item.comments_count + 1 }
            : item
        )
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  fetchComments: async (postId) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          user:profiles!post_comments_user_id_fkey(id, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
}));