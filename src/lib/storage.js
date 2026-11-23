// ====================================================================
// KudosBoard — Real-Time Engine, Hybrid Access Control & Database Store
// Emulates Supabase PostgreSQL RLS, WebSockets & Realtime Broadcast
// ====================================================================

const DB_KEY = 'kudosboard_db_v1';
const CREATOR_SESSION_KEY = 'kudosboard_creator_session';
const GUEST_FINGERPRINT_KEY = 'kudosboard_guest_fingerprint';
const CHANNEL_NAME = 'kudosboard_realtime_bus';

// Generate or retrieve persistent guest fingerprint
export function getGuestFingerprint() {
  if (typeof window === 'undefined') return 'server-rendered';
  let fp = localStorage.getItem(GUEST_FINGERPRINT_KEY);
  if (!fp) {
    fp = 'guest_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(GUEST_FINGERPRINT_KEY, fp);
  }
  return fp;
}

// Creator Session Helpers
export function getCreatorSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CREATOR_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCreatorSession(session) {
  if (typeof window === 'undefined') return;
  if (!session) {
    localStorage.removeItem(CREATOR_SESSION_KEY);
  } else {
    localStorage.setItem(CREATOR_SESSION_KEY, JSON.stringify(session));
  }
  broadcastRealtimeEvent({ type: 'AUTH_STATE_CHANGED', payload: session });
}

// Initial Sample Seed Data
const INITIAL_SEED = {
  boards: [
    {
      id: 'b-birthday-maya',
      creator_id: 'creator-demo-1',
      share_slug: 'happy-birthday-maya',
      title: 'Happy 30th Birthday, Maya! 🎂✨',
      subtitle: 'Leave your favorite memories, birthday wishes, and celebration photos for Maya!',
      theme: 'birthday',
      default_layout: 'grid',
      is_locked: false,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'b-team-milestone',
      creator_id: 'creator-demo-1',
      share_slug: 'team-milestone-launch',
      title: 'Congratulations Team Phoenix on v2.0 Launch! 🚀',
      subtitle: 'A huge shout-out to all designers, engineers, and PMs who made this miracle happen!',
      theme: 'milestone',
      default_layout: 'grid',
      is_locked: false,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'b-farewell-alex',
      creator_id: 'creator-demo-2',
      share_slug: 'farewell-alex-good-luck',
      title: 'Farewell Alex — We Will Miss You! 🧡',
      subtitle: 'Thank you for 5 remarkable years of inspiration, mentorship, and laughs.',
      theme: 'corkboard',
      default_layout: 'grid',
      is_locked: false,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 14400000).toISOString()
    }
  ],
  kudos_posts: [
    {
      id: 'p-1',
      board_id: 'b-birthday-maya',
      author_name: 'Sophia Martinez',
      is_anonymous: false,
      message: 'Happy birthday to the most radiant human ever! Thank you for always bringing sunshine into the office. Have the happiest decade ahead! 🥳🎉',
      color_id: 'lemon',
      accent_emoji: '🎂',
      sticker_id: 'cake',
      photo_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'p-2',
      board_id: 'b-birthday-maya',
      author_name: 'David & Liam',
      is_anonymous: false,
      message: 'Maya, working alongside you has been pure joy. Cheers to another year of legendary coffee runs and big victories! ☕🍰',
      color_id: 'blush',
      accent_emoji: '💖',
      sticker_id: 'popper',
      photo_url: null,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'p-3',
      board_id: 'b-birthday-maya',
      author_name: 'A Secret Admirer',
      is_anonymous: true,
      message: 'You make every day at work 100x more fun. Keep shining bright, birthday girl! ✨🌟',
      color_id: 'sky',
      accent_emoji: '⭐',
      sticker_id: 'star',
      photo_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'p-4',
      board_id: 'b-birthday-maya',
      author_name: 'Marcus Vance',
      is_anonymous: false,
      message: 'Happy 30th Maya! May your year be filled with unforgettable travels, delicious food, and zero bugs in production! ✈️🍕',
      color_id: 'mint',
      accent_emoji: '🚀',
      sticker_id: 'rocket',
      photo_url: null,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'p-5',
      board_id: 'b-birthday-maya',
      author_name: 'Elena Rostova',
      is_anonymous: false,
      message: 'So grateful for your wisdom, patience, and contagious laughter. You are an inspiration to all of us! Cheers to 30! 🥂💫',
      color_id: 'lavender',
      accent_emoji: '🎉',
      sticker_id: 'sparkles',
      photo_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    },
    {
      id: 'p-6',
      board_id: 'b-birthday-maya',
      author_name: 'Team Design',
      is_anonymous: false,
      message: 'High fives all around for our favorite teammate! Enjoy your special day to the fullest! 🙌🎈',
      color_id: 'peach',
      accent_emoji: '🔥',
      sticker_id: 'applause',
      photo_url: null,
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  kudos_reactions: [
    { id: 'r-1', post_id: 'p-1', board_id: 'b-birthday-maya', emoji: '❤️', guest_fingerprint: 'guest_demo_1', created_at: new Date().toISOString() },
    { id: 'r-2', post_id: 'p-1', board_id: 'b-birthday-maya', emoji: '🎉', guest_fingerprint: 'guest_demo_2', created_at: new Date().toISOString() },
    { id: 'r-3', post_id: 'p-1', board_id: 'b-birthday-maya', emoji: '🔥', guest_fingerprint: 'guest_demo_3', created_at: new Date().toISOString() },
    { id: 'r-4', post_id: 'p-2', board_id: 'b-birthday-maya', emoji: '👏', guest_fingerprint: 'guest_demo_1', created_at: new Date().toISOString() },
    { id: 'r-5', post_id: 'p-2', board_id: 'b-birthday-maya', emoji: '❤️', guest_fingerprint: 'guest_demo_4', created_at: new Date().toISOString() },
    { id: 'r-6', post_id: 'p-3', board_id: 'b-birthday-maya', emoji: '😂', guest_fingerprint: 'guest_demo_2', created_at: new Date().toISOString() },
    { id: 'r-7', post_id: 'p-5', board_id: 'b-birthday-maya', emoji: '🙌', guest_fingerprint: 'guest_demo_3', created_at: new Date().toISOString() }
  ],
  kudos_replies: [
    {
      id: 'rep-1',
      post_id: 'p-1',
      board_id: 'b-birthday-maya',
      author_name: 'Maya (Board Creator)',
      is_creator: true,
      reply_text: 'Aww thank you Sophia! This means the world to me! ❤️',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'rep-2',
      post_id: 'p-1',
      board_id: 'b-birthday-maya',
      author_name: 'Lucas P.',
      is_creator: false,
      reply_text: 'Best colleague award goes to Maya without a doubt! 🥇',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]
};

// Database Access Layer
function getDB() {
  if (typeof window === 'undefined') return INITIAL_SEED;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_SEED));
      return INITIAL_SEED;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read KudosBoard database from localStorage', err);
    return INITIAL_SEED;
  }
}

function saveDB(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save KudosBoard database to localStorage', err);
  }
}

// Reset Database to Seed
export function resetDatabase() {
  saveDB(INITIAL_SEED);
  broadcastRealtimeEvent({ type: 'DATABASE_RESET', payload: null });
}

// ====================================================================
// Real-Time Broadcast Bus (Sub-150ms Instant Sync across Windows & Tabs)
// ====================================================================

let broadcastChannel = null;
const eventListeners = new Set();

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  broadcastChannel.onmessage = (event) => {
    if (event && event.data) {
      notifySubscribers(event.data);
    }
  };

  // Fallback via storage event for cross-origin or older contexts
  window.addEventListener('storage', (e) => {
    if (e.key === 'kudosboard_last_event' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        notifySubscribers(parsed);
      } catch (err) {}
    }
  });
}

function notifySubscribers(event) {
  eventListeners.forEach((callback) => {
    try {
      callback(event);
    } catch (err) {
      console.error('Error in realtime subscriber', err);
    }
  });
}

export function broadcastRealtimeEvent(event) {
  const envelope = {
    ...event,
    timestamp: Date.now()
  };

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(envelope);
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('kudosboard_last_event', JSON.stringify(envelope));
    } catch (e) {}
  }

  // Also trigger locally in current window
  notifySubscribers(envelope);
}

export function subscribeToRealtime(callback) {
  eventListeners.add(callback);
  return () => {
    eventListeners.delete(callback);
  };
}

// ====================================================================
// RLS & Hybrid Security Enforcement
// ====================================================================

// Check if current user is the authenticated creator of this board
export function isBoardCreator(board) {
  if (!board) return false;
  const session = getCreatorSession();
  if (!session) return false;
  return session.creator_id === board.creator_id;
}

// Query Board by Slug
export function getBoardBySlug(slug) {
  const db = getDB();
  return db.boards.find((b) => b.share_slug === slug) || null;
}

// Query Board by ID
export function getBoardById(id) {
  const db = getDB();
  return db.boards.find((b) => b.id === id) || null;
}

// Get All Boards for Creator Dashboard
export function getCreatorBoards() {
  const db = getDB();
  const session = getCreatorSession();
  if (!session) return [];
  return db.boards.filter((b) => b.creator_id === session.creator_id);
}

// Get All Public Boards (for explorer / demo)
export function getAllBoards() {
  const db = getDB();
  return db.boards;
}

// Fetch Posts with Aggregated Reactions and Replies for a Board
export function getBoardPosts(boardId) {
  const db = getDB();
  const fingerprint = getGuestFingerprint();

  const posts = db.kudos_posts.filter((p) => p.board_id === boardId);
  const reactions = db.kudos_reactions.filter((r) => r.board_id === boardId);
  const replies = db.kudos_replies.filter((rep) => rep.board_id === boardId);

  return posts.map((post) => {
    const postReactions = reactions.filter((r) => r.post_id === post.id);
    const postReplies = replies.filter((rep) => rep.post_id === post.id);

    const counts = { '❤️': 0, '🎉': 0, '👏': 0, '😂': 0, '🙌': 0, '🔥': 0 };
    const userReacted = { '❤️': false, '🎉': false, '👏': false, '😂': false, '🙌': false, '🔥': false };

    postReactions.forEach((r) => {
      if (counts[r.emoji] !== undefined) {
        counts[r.emoji] = (counts[r.emoji] || 0) + 1;
      }
      if (r.guest_fingerprint === fingerprint) {
        userReacted[r.emoji] = true;
      }
    });

    return {
      ...post,
      reactions: counts,
      user_reacted: userReacted,
      replies: postReplies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    };
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// ====================================================================
// Database Mutations (Enforcing Creator vs Guest Rules)
// ====================================================================

// 1. CREATE BOARD (Creator Only)
export function createBoard({ title, subtitle, theme, default_layout }) {
  const session = getCreatorSession();
  if (!session) {
    throw new Error('401 Unauthorized: Only authenticated Board Creators can create new boards.');
  }

  const slug = (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'kudos') + 
               '-' + Math.random().toString(36).substring(2, 6);

  const newBoard = {
    id: 'b-' + Math.random().toString(36).substring(2, 9),
    creator_id: session.creator_id,
    share_slug: slug,
    title: title || 'Celebration Kudos Board 🎉',
    subtitle: subtitle || 'Leave a note, photo, or sticker below!',
    theme: theme || 'corkboard',
    default_layout: default_layout || 'grid',
    is_locked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const db = getDB();
  db.boards.unshift(newBoard);
  saveDB(db);

  broadcastRealtimeEvent({ type: 'BOARD_CREATED', payload: newBoard, board_id: newBoard.id });
  return newBoard;
}

// 2. UPDATE BOARD (Creator Only)
export function updateBoard(boardId, updates) {
  const db = getDB();
  const boardIndex = db.boards.findIndex((b) => b.id === boardId);
  if (boardIndex === -1) throw new Error('Board not found');

  const board = db.boards[boardIndex];
  if (!isBoardCreator(board)) {
    throw new Error('403 Forbidden: Row-Level Security violation. Only the board creator can modify board settings.');
  }

  const updatedBoard = {
    ...board,
    ...updates,
    updated_at: new Date().toISOString()
  };

  db.boards[boardIndex] = updatedBoard;
  saveDB(db);

  broadcastRealtimeEvent({ type: 'BOARD_UPDATE', payload: updatedBoard, board_id: boardId });
  return updatedBoard;
}

// 3. DELETE BOARD (Creator Only)
export function deleteBoard(boardId) {
  const db = getDB();
  const board = db.boards.find((b) => b.id === boardId);
  if (!board) throw new Error('Board not found');

  if (!isBoardCreator(board)) {
    throw new Error('403 Forbidden: Row-Level Security violation. Only the board creator can delete this board.');
  }

  db.boards = db.boards.filter((b) => b.id !== boardId);
  db.kudos_posts = db.kudos_posts.filter((p) => p.board_id !== boardId);
  db.kudos_reactions = db.kudos_reactions.filter((r) => r.board_id !== boardId);
  db.kudos_replies = db.kudos_replies.filter((rep) => rep.board_id !== boardId);

  saveDB(db);
  broadcastRealtimeEvent({ type: 'BOARD_DELETED', payload: { id: boardId }, board_id: boardId });
  return true;
}

// 4. INSERT POST (Guests & Creators allowed, if board is not locked)
export function insertKudosPost({ board_id, author_name, is_anonymous, message, color_id, accent_emoji, sticker_id, photo_url }) {
  const db = getDB();
  const board = db.boards.find((b) => b.id === board_id);
  if (!board) throw new Error('Board not found');

  if (board.is_locked) {
    throw new Error('403 Forbidden: Board is currently locked by the creator. Submissions are closed.');
  }

  if (!message || message.trim().length === 0) {
    throw new Error('Message cannot be empty.');
  }

  const newPost = {
    id: 'p-' + Math.random().toString(36).substring(2, 9),
    board_id,
    author_name: is_anonymous ? 'Anonymous' : (author_name?.trim() || 'Friendly Guest'),
    is_anonymous: !!is_anonymous,
    message: message.trim(),
    color_id: color_id || 'lemon',
    accent_emoji: accent_emoji || '🎉',
    sticker_id: sticker_id || 'none',
    photo_url: photo_url || null,
    created_at: new Date().toISOString()
  };

  db.kudos_posts.unshift(newPost);
  saveDB(db);

  broadcastRealtimeEvent({ type: 'POST_INSERT', payload: newPost, board_id });
  return newPost;
}

// 5. DELETE POST (Creator Moderation Only)
export function deleteKudosPost(postId) {
  const db = getDB();
  const post = db.kudos_posts.find((p) => p.id === postId);
  if (!post) throw new Error('Post not found');

  const board = db.boards.find((b) => b.id === post.board_id);
  if (!isBoardCreator(board)) {
    throw new Error('403 Forbidden: Row-Level Security violation. Only the board creator has permission to moderate/delete posts.');
  }

  db.kudos_posts = db.kudos_posts.filter((p) => p.id !== postId);
  db.kudos_reactions = db.kudos_reactions.filter((r) => r.post_id !== postId);
  db.kudos_replies = db.kudos_replies.filter((rep) => rep.post_id !== postId);

  saveDB(db);
  broadcastRealtimeEvent({ type: 'POST_DELETE', payload: { id: postId }, board_id: post.board_id });
  return true;
}

// 6. TOGGLE EMOJI REACTION (Guest & Creator atomic toggle)
export function toggleReaction(postId, board_id, emoji) {
  const fingerprint = getGuestFingerprint();
  const db = getDB();

  const existingIdx = db.kudos_reactions.findIndex(
    (r) => r.post_id === postId && r.emoji === emoji && r.guest_fingerprint === fingerprint
  );

  let action = '';
  if (existingIdx !== -1) {
    // Remove reaction
    db.kudos_reactions.splice(existingIdx, 1);
    action = 'removed';
  } else {
    // Add reaction
    const newReaction = {
      id: 'r-' + Math.random().toString(36).substring(2, 9),
      post_id: postId,
      board_id,
      emoji,
      guest_fingerprint: fingerprint,
      created_at: new Date().toISOString()
    };
    db.kudos_reactions.push(newReaction);
    action = 'added';
  }

  saveDB(db);
  broadcastRealtimeEvent({
    type: 'REACTION_TOGGLE',
    payload: { post_id: postId, emoji, action, guest_fingerprint: fingerprint },
    board_id
  });

  return { action };
}

// 7. INSERT REPLY (Guest or Creator)
export function insertReply({ post_id, board_id, author_name, reply_text }) {
  const db = getDB();
  const board = db.boards.find((b) => b.id === board_id);
  if (!board) throw new Error('Board not found');

  if (board.is_locked) {
    throw new Error('403 Forbidden: Board is locked.');
  }

  const isCreator = isBoardCreator(board);
  const session = getCreatorSession();

  const newReply = {
    id: 'rep-' + Math.random().toString(36).substring(2, 9),
    post_id,
    board_id,
    author_name: isCreator ? (author_name || session?.email?.split('@')[0] || 'Board Creator 👑') : (author_name || 'Guest'),
    is_creator: isCreator,
    reply_text: reply_text.trim(),
    created_at: new Date().toISOString()
  };

  db.kudos_replies.push(newReply);
  saveDB(db);

  broadcastRealtimeEvent({ type: 'REPLY_INSERT', payload: newReply, board_id });
  return newReply;
}

// 8. DELETE REPLY (Creator Moderation Only)
export function deleteReply(replyId) {
  const db = getDB();
  const reply = db.kudos_replies.find((r) => r.id === replyId);
  if (!reply) throw new Error('Reply not found');

  const board = db.boards.find((b) => b.id === reply.board_id);
  if (!isBoardCreator(board)) {
    throw new Error('403 Forbidden: Only the board creator can delete replies.');
  }

  db.kudos_replies = db.kudos_replies.filter((r) => r.id !== replyId);
  saveDB(db);

  broadcastRealtimeEvent({ type: 'REPLY_DELETE', payload: { id: replyId, post_id: reply.post_id }, board_id: reply.board_id });
  return true;
}
