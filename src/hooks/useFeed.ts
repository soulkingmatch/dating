```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { FeedItem } from '../types/feed';

export function useFeed(filter: string = 'all') {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('feed_items')
        .select(`
          *,
          user:profiles!feed_items_user_id_fkey(id, full_name, avatar_url),
          likes:post_likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'trending') {
        query = query.order('likes_count', { ascending: false });
      } else if (filter === 'following') {
        // Add following filter logic here when implemented
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const { data: { user } } = await supabase.auth.getUser();

      const feedItems = data.map(item => ({
        ...item,
        liked_by_user: item.likes?.some(like => like.user_id === user?.id) || false
      }));

      setItems(feedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const refreshFeed = () => {
    fetchFeed();
  };

  return { items, loading, error, refreshFeed };
}
```