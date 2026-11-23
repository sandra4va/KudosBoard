-- ====================================================================
-- KudosBoard — 001_init_kudos_schema.sql
-- Real-Time Collaborative Celebration & Appreciation Wall Schema
-- Enforcing Authenticated Creator Ownership & Frictionless Guest Access
-- ====================================================================

-- 1. Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BOARDS TABLE (Strictly Owned by Authenticated Creators)
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Celebration Kudos Board 🎉',
  subtitle TEXT DEFAULT 'Leave a note, photo, or sticker below!',
  theme TEXT NOT NULL DEFAULT 'corkboard' CHECK (theme IN ('corkboard', 'birthday', 'milestone', 'farewell', 'classroom')),
  default_layout TEXT NOT NULL DEFAULT 'grid' CHECK (default_layout IN ('grid', 'timeline')),
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant lookup by share_slug
CREATE INDEX IF NOT EXISTS idx_boards_share_slug ON public.boards(share_slug);
CREATE INDEX IF NOT EXISTS idx_boards_creator_id ON public.boards(creator_id);

-- 3. KUDOS POSTS TABLE (Creator Managed; Guest Append-Only)
CREATE TABLE IF NOT EXISTS public.kudos_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
  color_id TEXT NOT NULL DEFAULT 'lemon' CHECK (color_id IN ('lemon', 'blush', 'sky', 'mint', 'lavender', 'peach')),
  accent_emoji TEXT NOT NULL DEFAULT '🎉',
  sticker_id TEXT DEFAULT 'none',
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kudos_posts_board_id ON public.kudos_posts(board_id);

-- 4. EMOJI REACTIONS TABLE (Atomic Counts + Guest Session Deduplication)
CREATE TABLE IF NOT EXISTS public.kudos_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.kudos_posts(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('❤️', '🎉', '👏', '😂', '🙌', '🔥')),
  guest_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, emoji, guest_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_kudos_reactions_post_id ON public.kudos_reactions(post_id);

-- 5. KUDOS REPLIES TABLE (Guest & Creator Sub-Threads)
CREATE TABLE IF NOT EXISTS public.kudos_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.kudos_posts(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anonymous Guest',
  is_creator BOOLEAN NOT NULL DEFAULT FALSE,
  reply_text TEXT NOT NULL CHECK (char_length(reply_text) BETWEEN 1 AND 300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kudos_replies_post_id ON public.kudos_replies(post_id);

-- 6. REALTIME REPLICATION CONFIGURATION
-- Add tables to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'boards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.boards;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'kudos_posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kudos_posts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'kudos_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kudos_reactions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'kudos_replies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kudos_replies;
  END IF;
END $$;

-- 7. ENABLE ROW-LEVEL SECURITY
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos_replies ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES FOR BOARDS
DROP POLICY IF EXISTS "Creators full access to own boards" ON public.boards;
CREATE POLICY "Creators full access to own boards"
  ON public.boards FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Public read access to boards" ON public.boards;
CREATE POLICY "Public read access to boards"
  ON public.boards FOR SELECT
  TO public
  USING (true);

-- 9. RLS POLICIES FOR KUDOS POSTS
DROP POLICY IF EXISTS "Public read posts" ON public.kudos_posts;
CREATE POLICY "Public read posts"
  ON public.kudos_posts FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Guests can insert posts to unlocked boards" ON public.kudos_posts;
CREATE POLICY "Guests can insert posts to unlocked boards"
  ON public.kudos_posts FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id AND is_locked = FALSE
    )
  );

DROP POLICY IF EXISTS "Only board creator can delete posts" ON public.kudos_posts;
CREATE POLICY "Only board creator can delete posts"
  ON public.kudos_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id AND creator_id = auth.uid()
    )
  );

-- 10. RLS POLICIES FOR REACTIONS
DROP POLICY IF EXISTS "Public read reactions" ON public.kudos_reactions;
CREATE POLICY "Public read reactions"
  ON public.kudos_reactions FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can add reaction" ON public.kudos_reactions;
CREATE POLICY "Anyone can add reaction"
  ON public.kudos_reactions FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can remove their own reaction fingerprint" ON public.kudos_reactions;
CREATE POLICY "Users can remove their own reaction fingerprint"
  ON public.kudos_reactions FOR DELETE
  TO public
  USING (true);

-- 11. RLS POLICIES FOR REPLIES
DROP POLICY IF EXISTS "Public read replies" ON public.kudos_replies;
CREATE POLICY "Public read replies"
  ON public.kudos_replies FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert reply to unlocked board" ON public.kudos_replies;
CREATE POLICY "Anyone can insert reply to unlocked board"
  ON public.kudos_replies FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id AND is_locked = FALSE
    )
  );

DROP POLICY IF EXISTS "Only board creator can delete replies" ON public.kudos_replies;
CREATE POLICY "Only board creator can delete replies"
  ON public.kudos_replies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id AND creator_id = auth.uid()
    )
  );

-- 12. HELPER FUNCTION: ATOMIC REACTION TOGGLE
CREATE OR REPLACE FUNCTION public.toggle_kudos_reaction(
  p_post_id UUID,
  p_board_id UUID,
  p_emoji TEXT,
  p_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists BOOLEAN;
  v_action TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.kudos_reactions
    WHERE post_id = p_post_id AND emoji = p_emoji AND guest_fingerprint = p_fingerprint
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.kudos_reactions
    WHERE post_id = p_post_id AND emoji = p_emoji AND guest_fingerprint = p_fingerprint;
    v_action := 'removed';
  ELSE
    INSERT INTO public.kudos_reactions (post_id, board_id, emoji, guest_fingerprint)
    VALUES (p_post_id, p_board_id, p_emoji, p_fingerprint);
    v_action := 'added';
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'action', v_action);
END;
$$;
