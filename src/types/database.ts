// ====================================================================
// KudosBoard — Database & Entity TypeScript Types
// ====================================================================

export type BoardTheme = 'corkboard' | 'birthday' | 'milestone' | 'farewell' | 'classroom';
export type BoardLayout = 'grid' | 'timeline';
export type NoteColor = 'lemon' | 'blush' | 'sky' | 'mint' | 'lavender' | 'peach';
export type AllowedEmoji = '❤️' | '🎉' | '👏' | '😂' | '🙌' | '🔥';

export interface Board {
  id: string;
  creator_id: string;
  share_slug: string;
  title: string;
  subtitle: string;
  theme: BoardTheme;
  default_layout: BoardLayout;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface KudosPost {
  id: string;
  board_id: string;
  author_name: string;
  is_anonymous: boolean;
  message: string;
  color_id: NoteColor;
  accent_emoji: string;
  sticker_id: string;
  photo_url?: string | null;
  created_at: string;
  // Computed / aggregated fields on client
  reactions?: Record<AllowedEmoji, number>;
  user_reacted?: Record<AllowedEmoji, boolean>;
  replies?: KudosReply[];
}

export interface KudosReaction {
  id: string;
  post_id: string;
  board_id: string;
  emoji: AllowedEmoji;
  guest_fingerprint: string;
  created_at: string;
}

export interface KudosReply {
  id: string;
  post_id: string;
  board_id: string;
  author_name: string;
  is_creator: boolean;
  reply_text: string;
  created_at: string;
}

export interface CreatorSession {
  creator_id: string;
  email: string;
  token: string;
  logged_in_at: string;
}

export interface RealtimeSyncPayload {
  type: 'POST_INSERT' | 'POST_DELETE' | 'BOARD_UPDATE' | 'REACTION_TOGGLE' | 'REPLY_INSERT' | 'REPLY_DELETE' | 'PRESENCE_PING';
  board_id: string;
  payload: any;
  timestamp: number;
}
