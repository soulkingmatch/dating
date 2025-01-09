```typescript
import { supabase } from '../lib/supabase';

export async function likePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: user.id });

  if (error) throw error;
}

export async function unlikePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .match({ post_id: postId, user_id: user.id });

  if (error) throw error;
}

export async function sharePost(postId: string): Promise<void> {
  // Implement sharing functionality
  // This could be copying to clipboard, opening a share dialog, etc.
  const postUrl = `${window.location.origin}/post/${postId}`;
  await navigator.clipboard.writeText(postUrl);
}
```