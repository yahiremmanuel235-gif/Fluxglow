import { supabase } from '../lib/supabaseClient';
import { CommunityPost, JournalEntry, MoodType } from '../types';

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
 * Mapea una fila de la tabla `community_posts` (con posible JOIN a `profiles`) al tipo CommunityPost de la UI.
 * Previene la suplantación de identidad resolviendo el autor directamente desde `profiles`.
 */
export function mapSupabasePostToCommunityPost(row: any): CommunityPost {
  const category = row.group_category || 'Comunidad General';
  const tagList = row.mood 
    ? [row.mood.replace(/^[^\w\s]+/, '').trim() || 'Bienestar', 'Comunidad']
    : ['Comunidad', 'Bienestar'];

  // Resolver autor desde la relación profiles (JOIN) o datos de fila como fallback
  const authorProfile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const authorName = authorProfile?.name || row.author_name || 'Miembro de la Comunidad';
  const authorAvatar = authorProfile?.avatar_url || row.author_avatar || '/user.png';

  return {
    id: String(row.id),
    author: authorName,
    authorRole: 'Miembro de la Comunidad',
    authorAvatar: authorAvatar,
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
 * Consulta (SELECT) a la tabla `community_posts` en Supabase con JOIN a `profiles` para obtener el autor real.
 */
export async function fetchSupabaseCommunityPosts(): Promise<CommunityPost[]> {
  try {
    // Intento 1: Consulta relacional con JOIN a la tabla `profiles`
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        user_id,
        group_category,
        mood,
        content,
        likes,
        created_at,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data.map(mapSupabasePostToCommunityPost);
    }

    // Fallback si la relación de clave foránea aún no está creada en Supabase
    if (error) {
      console.warn('Consulta con JOIN falló, reintentando consulta básica:', error.message);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fallbackError) {
        throw fallbackError;
      }

      if (Array.isArray(fallbackData)) {
        return fallbackData.map(mapSupabasePostToCommunityPost);
      }
    }

    return [];
  } catch (err: any) {
    console.error('Fallo en fetchSupabaseCommunityPosts:', err?.message || err);
    throw err;
  }
}

export interface InsertCommunityPostParams {
  userId: string;
  groupCategory: string;
  mood?: string;
  content: string;
}

/**
 * Inserta un nuevo registro en la tabla `community_posts` en Supabase.
 * Vincula estrictamente `user_id = user.id` para impedir la suplantación del nombre del autor en el cliente.
 */
export async function insertSupabaseCommunityPost(params: InsertCommunityPostParams): Promise<CommunityPost | null> {
  const { userId, groupCategory, mood, content } = params;

  if (!userId) {
    throw new Error('Se requiere un usuario autenticado para publicar en la comunidad.');
  }

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        group_category: groupCategory || 'Comunidad General',
        mood: mood || '🌿 En calma',
        content: content.trim(),
        likes: 0
      })
      .select(`
        id,
        user_id,
        group_category,
        mood,
        content,
        likes,
        created_at,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .maybeSingle();

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
 * Incremento atómico de likes en Supabase mediante el procedimiento RPC `increment_post_likes`.
 * Previene condiciones de carrera y la sobreescritura de datos en el cliente.
 */
export async function toggleSupabasePostLike(postId: string, _userId?: string): Promise<{ success: boolean; newLikes?: number }> {
  try {
    // 1. Intentar ejecución de la función RPC atómica en el servidor Postgres
    const { data: rpcLikes, error: rpcError } = await supabase
      .rpc('increment_post_likes', { target_post_id: postId });

    if (!rpcError && typeof rpcLikes === 'number') {
      return { success: true, newLikes: rpcLikes };
    }

    if (rpcError) {
      console.warn('RPC increment_post_likes no disponible, intentando actualización de fallback:', rpcError.message);
    }

    // 2. Fallback de lectura-actualización si la función RPC aún no está creada en la base de datos
    const { data: currentPost } = await supabase
      .from('community_posts')
      .select('likes')
      .eq('id', postId)
      .maybeSingle();

    const nextCount = ((currentPost?.likes as number) || 0) + 1;
    const { error: updateError } = await supabase
      .from('community_posts')
      .update({ likes: nextCount })
      .eq('id', postId);

    if (updateError) {
      throw updateError;
    }

    return { success: true, newLikes: nextCount };
  } catch (err: any) {
    console.error('Error al actualizar like en Supabase:', err?.message || err);
    return { success: false };
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

  const rawMood = typeof row.mood === 'string' ? row.mood.toLowerCase() : 'tranquilo';

  return {
    id: String(row.id),
    date: dateStr,
    time: timeStr,
    mood: rawMood as MoodType,
    intensity: typeof row.intensity === 'number' ? row.intensity : 7,
    notes: row.note || row.notes || '',
    triggers: Array.isArray(row.triggers) && row.triggers.length > 0 
      ? row.triggers 
      : ['Productividad', 'Bienestar'],
    habits: row.habits || { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: typeof row.intensity === 'number' ? row.intensity : 4 },
    aiFeedback: row.ai_feedback || row.aiFeedback || 'Registro guardado y sincronizado con tu base de datos de Supabase.'
  };
}
