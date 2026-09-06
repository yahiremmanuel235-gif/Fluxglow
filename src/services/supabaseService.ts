import { supabase } from '../lib/supabaseClient';
import { CommunityPost, JournalEntry, MoodType } from '../types';

/**
 * Retorna o genera un UUID v4 persistente para identificar al usuario en Supabase.
 */
export function getOrCreateUserId(): string {
  try {
    let id = localStorage.getItem('fluxglow_supabase_user_id');
    if (!id || id.length < 10) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      localStorage.setItem('fluxglow_supabase_user_id', id);
    }
    return id;
  } catch {
    return '11111111-1111-4111-8111-111111111111';
  }
}

/**
 * Convierte un timestamp a una representación legible en español ('Hace 5 min', 'Hace 2 h', etc.)
 */
export function formatTimeAgo(dateStr?: string | null): string {
  if (!dateStr) return 'Hace un momento';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));
    if (diffSec < 60) return 'Hace un momento';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Hace ${diffDays} d`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  } catch {
    return 'Reciente';
  }
}

/**
 * Mapea una fila de la tabla `community_posts` de Supabase al tipo CommunityPost de la UI.
 */
export function mapSupabasePostToCommunityPost(row: any): CommunityPost {
  const category = row.group_category || 'Comunidad General';
  const tagList = row.mood 
    ? [row.mood.replace(/^[^\w\s]+/, '').trim() || 'Bienestar', 'Comunidad']
    : ['Comunidad', 'Bienestar'];

  return {
    id: String(row.id),
    author: row.author_name || 'Miembro de la Comunidad',
    authorRole: 'Miembro de la Comunidad',
    authorAvatar: '/user.png',
    avatarColor: '#548c71',
    timeAgo: formatTimeAgo(row.created_at),
    content: row.content || '',
    category: category,
    tags: tagList,
    likes: typeof row.likes === 'number' ? row.likes : 0,
    hugs: 0,
    commentsCount: 0,
    comments: []
  };
}

/**
 * Consulta (SELECT) a la tabla `community_posts` en Supabase ordenada por fecha de creación descendente.
 */
export async function fetchSupabaseCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error al consultar community_posts en Supabase:', error.message);
      return [];
    }

    if (Array.isArray(data)) {
      return data.map(mapSupabasePostToCommunityPost);
    }
    return [];
  } catch (err) {
    console.error('Fallo de red o cliente en fetchSupabaseCommunityPosts:', err);
    return [];
  }
}

/**
 * Inserta un nuevo registro en la tabla `community_posts` en Supabase.
 */
export async function insertSupabaseCommunityPost(params: {
  authorName: string;
  groupCategory: string;
  mood?: string;
  content: string;
  likes?: number;
}): Promise<CommunityPost | null> {
  const { authorName, groupCategory, mood, content, likes = 0 } = params;

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        author_name: authorName || 'Usuario FluxGlow',
        group_category: groupCategory || 'Comunidad General',
        mood: mood || '🌿 En calma',
        content: content.trim(),
        likes: likes
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar community_post en Supabase:', error);
      throw error;
    }

    if (data) {
      return mapSupabasePostToCommunityPost(data);
    }
    return null;
  } catch (err) {
    console.error('Fallo en insertSupabaseCommunityPost:', err);
    throw err;
  }
}

/**
 * Actualiza el conteo de likes en la tabla `community_posts` de Supabase.
 */
export async function updateSupabasePostLikes(postId: string, newLikes: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('community_posts')
      .update({ likes: newLikes })
      .eq('id', postId);

    if (error) {
      console.warn('Error actualizando likes en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Fallo en updateSupabasePostLikes:', err);
    return false;
  }
}

/**
 * Suscripción en tiempo real (Supabase Realtime) a la tabla `community_posts`.
 */
export function subscribeToCommunityPostsRealtime(onPayload: (payload: any) => void) {
  const channel = supabase
    .channel('community_posts_realtime_feed')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'community_posts' },
      (payload) => {
        onPayload(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Mapea una fila de la tabla `journal_entries` de Supabase al tipo JournalEntry de la UI.
 */
export function mapSupabaseJournalEntry(row: any): JournalEntry {
  const dateObj = row.created_at ? new Date(row.created_at) : new Date();
  const dateStr = dateObj.toISOString().split('T')[0];
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    id: String(row.id),
    date: dateStr,
    time: timeStr,
    mood: (row.mood?.toLowerCase() || 'tranquilo') as MoodType,
    intensity: 7,
    notes: row.note || '',
    triggers: ['Productividad', 'Bienestar'],
    habits: { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: 4 },
    aiFeedback: 'Registro guardado y sincronizado con tu base de datos de Supabase.'
  };
}

/**
 * Consulta (SELECT) las entradas de `journal_entries` en Supabase ordenadas por fecha.
 */
export async function fetchSupabaseJournalEntries(): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error al consultar journal_entries en Supabase:', error.message);
      return [];
    }

    if (Array.isArray(data)) {
      return data.map(mapSupabaseJournalEntry);
    }
    return [];
  } catch (err) {
    console.error('Fallo en fetchSupabaseJournalEntries:', err);
    return [];
  }
}

/**
 * Inserta un nuevo registro en la tabla `journal_entries` en Supabase.
 */
export async function insertSupabaseJournalEntry(params: {
  mood: string;
  note: string;
}): Promise<JournalEntry | null> {
  const { mood, note } = params;
  const userId = getOrCreateUserId();

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        mood: mood,
        note: note.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar en journal_entries en Supabase:', error);
      throw error;
    }

    if (data) {
      return mapSupabaseJournalEntry(data);
    }
    return null;
  } catch (err) {
    console.error('Fallo en insertSupabaseJournalEntry:', err);
    throw err;
  }
}

/**
 * Elimina una entrada de la tabla `journal_entries` en Supabase.
 */
export async function deleteSupabaseJournalEntry(entryId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.warn('Error eliminando entrada de Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Fallo en deleteSupabaseJournalEntry:', err);
    return false;
  }
}
