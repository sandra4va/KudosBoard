import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (index.html, assets, etc.) from the project root
app.use(express.static(path.resolve(__dirname, '..')));

// Supabase client using the **service‑role** key (kept server‑side only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// -------------------------------------------------------------------
// API endpoint: create a new kudos post
// -------------------------------------------------------------------
app.post('/api/createPost', async (req, res) => {
  const {
    board_id,
    author_name,
    message,
    color_id = 'lemon',
    accent_emoji = '🎉',
    sticker_id = 'none',
    photo_url = null,
  } = req.body;

  const { data, error } = await supabase
    .from('kudos_posts')
    .insert([
      {
        board_id,
        author_name,
        message,
        color_id,
        accent_emoji,
        sticker_id,
        photo_url,
      },
    ])
    .single();

  if (error) {
    console.error('Create post error:', error);
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// -------------------------------------------------------------------
// API endpoint: add a reaction (example – you can extend similarly)
// -------------------------------------------------------------------
app.post('/api/addReaction', async (req, res) => {
  const { post_id, board_id, emoji, session_fingerprint } = req.body;
  const { data, error } = await supabase
    .from('kudos_reactions')
    .insert([
      { post_id, board_id, emoji, session_fingerprint },
    ])
    .single();

  if (error) {
    console.error('Add reaction error:', error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// -------------------------------------------------------------------
// Health check (used by the root page to show Connected/Disconnected)
// -------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ connected: !!supabaseUrl && !!supabaseServiceKey });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`KudosBoard server listening on http://0.0.0.0:${port}`);
});
