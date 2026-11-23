// ====================================================================
// KudosBoard — Supabase Client & Realtime Subscription Adapter
// ====================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof window !== 'undefined' && window.KUDOSBOARD_ENV?.SUPABASE_URL) || '';
const supabaseAnonKey = (typeof window !== 'undefined' && window.KUDOSBOARD_ENV?.SUPABASE_ANON_KEY) || '';
// Fallback for local development using environment variables (if bundled)
const supabaseAnonKeyEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAnonKeyFinal = supabaseAnonKey || supabaseAnonKeyEnv;


export const supabase = (supabaseUrl && supabaseAnonKeyFinal)
  ? createClient(supabaseUrl, supabaseAnonKeyFinal)
  : null;

/**
 * Hook or helper to subscribe to Postgres Changes for a board
 * When Supabase environment variables are provided, this establishes
 * live WebSocket replication directly to PostgreSQL.
 */
export function subscribeToSupabaseBoard(boardId: string, onEvent: (payload: any) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`board-room:${boardId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'boards', filter: `id=eq.${boardId}` },
      (payload) => onEvent({ type: 'BOARD_UPDATE', payload: payload.new, board_id: boardId })
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'kudos_posts', filter: `board_id=eq.${boardId}` },
      (payload) => {
        if (payload.eventType === 'INSERT') onEvent({ type: 'POST_INSERT', payload: payload.new, board_id: boardId });
        if (payload.eventType === 'DELETE') onEvent({ type: 'POST_DELETE', payload: payload.old, board_id: boardId });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'kudos_reactions', filter: `board_id=eq.${boardId}` },
      (payload) => onEvent({ type: 'REACTION_CHANGE', payload, board_id: boardId })
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'kudos_replies', filter: `board_id=eq.${boardId}` },
      (payload) => onEvent({ type: 'REPLY_CHANGE', payload, board_id: boardId })
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
