-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_post_likes_count ON post_likes;
DROP TRIGGER IF EXISTS update_post_comments_count ON post_comments;

-- Drop existing tables to recreate with proper relationships
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS feed_items;

-- Recreate feed_items table
CREATE TABLE feed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  interests text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recreate post_likes table with explicit foreign key name
CREATE TABLE post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT post_likes_post_id_user_id_key UNIQUE(post_id, user_id)
);

-- Recreate post_comments table with explicit foreign key name
CREATE TABLE post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view feed items"
  ON feed_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own feed items"
  ON feed_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feed items"
  ON feed_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for likes
CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only paid users can comment"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    has_paid_subscription(auth.uid())
  );

-- Recreate triggers
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'post_likes' THEN
      UPDATE feed_items 
      SET likes_count = likes_count + 1
      WHERE id = NEW.post_id;
    ELSE
      UPDATE feed_items 
      SET comments_count = comments_count + 1
      WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'post_likes' THEN
      UPDATE feed_items 
      SET likes_count = GREATEST(likes_count - 1, 0)
      WHERE id = OLD.post_id;
    ELSE
      UPDATE feed_items 
      SET comments_count = GREATEST(comments_count - 1, 0)
      WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER update_post_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_counts();

-- Add indexes for better performance
CREATE INDEX idx_feed_items_user_id ON feed_items(user_id);
CREATE INDEX idx_feed_items_created_at ON feed_items(created_at DESC);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);