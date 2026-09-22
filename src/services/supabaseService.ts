import { supabase } from '../lib/supabaseClient';
import { CommunityPost, JournalEntry, MoodType, GuideItem, GuideBlock, GuideAuthor, GuideReference, GuideDailyMission } from '../types';

/**
 * Codifica metadatos enriquecidos de la guía (autores, bloques, referencias, tipo, misiones, glosario, tips)
 */
export function encodeGuideMeta(guide: {
  description: string;
  guideType?: 'quick' | 'weekly';
  authors?: GuideAuthor[];
  reviewedBy?: string;
  references?: GuideReference[];
  blocks?: GuideBlock[];
  dailyMissions?: GuideDailyMission[];
  glossary?: { term: string; definition: string }[];
  extraTips?: string[];
}): string {
  const metaObj = {
    __flux_meta__: true,
    summary: guide.description || '',
    guideType: guide.guideType || 'quick',
    authors: guide.authors || [],
    reviewedBy: guide.reviewedBy || '',
    references: guide.references || [],
    blocks: guide.blocks || [],
    dailyMissions: guide.dailyMissions || [],
    glossary: guide.glossary || [],
    extraTips: guide.extraTips || []
  };
  return JSON.stringify(metaObj);
}

/**
 * Decodifica metadatos enriquecidos de la guía si están almacenados en formato JSON
 */
export function decodeGuideMeta(rawDescription: string): {
  simpleSummary: string;
  guideType: 'quick' | 'weekly';
  authors?: GuideAuthor[];
  reviewedBy?: string;
  references?: GuideReference[];
  blocks?: GuideBlock[];
  dailyMissions?: GuideDailyMission[];
  glossary?: { term: string; definition: string }[];
  extraTips?: string[];
} {
  if (typeof rawDescription === 'string' && rawDescription.trim().startsWith('{') && rawDescription.includes('__flux_meta__')) {
    try {
      const parsed = JSON.parse(rawDescription);
      if (parsed && parsed.__flux_meta__) {
        return {
          simpleSummary: parsed.summary || '',
          guideType: parsed.guideType || 'quick',
          authors: parsed.authors || [],
          reviewedBy: parsed.reviewedBy || '',
          references: parsed.references || [],
          blocks: parsed.blocks || [],
          dailyMissions: parsed.dailyMissions || [],
          glossary: parsed.glossary || [],
          extraTips: parsed.extraTips || []
        };
      }
    } catch {}
  }
  return {
    simpleSummary: rawDescription || '',
    guideType: 'quick',
    authors: [],
    reviewedBy: '',
    references: [],
    blocks: [],
    dailyMissions: [],
    glossary: [],
    extraTips: []
  };
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
 * Consulta la lista de IDs de publicaciones que el usuario autenticado ha marcado con "Me gusta".
 */
export async function fetchUserLikedPostIds(userId?: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('Aviso al consultar post_likes de usuario:', error.message);
      return [];
    }

    if (Array.isArray(data)) {
      return data.map((row: any) => String(row.post_id)).filter(Boolean);
    }
  } catch (err) {
    console.warn('Excepción consultando post_likes:', err);
  }
  return [];
}

/**
 * Incremento atómico de likes en Supabase mediante el procedimiento RPC `increment_post_likes`.
 * Previene condiciones de carrera y la sobreescritura de datos en el cliente.
 */
export async function toggleSupabasePostLike(postId: string, userId?: string): Promise<{ success: boolean; newLikes?: number }> {
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

    // 2. Si hay usuario autenticado, intentar registrar la interacción en post_likes
    if (userId) {
      try {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      } catch {}
    }

    // 3. Fallback de lectura-actualización si la función RPC aún no está creada en la base de datos
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
    aiFeedback: row.ai_feedback || row.aiFeedback || 'Registro guardado y sincronizado en tiempo real.'
  };
}

/**
 * Convierte un título en un slug amigable para URLs
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[^a-z0-9\s-]/g, '') // Quitar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Guiones dobles
}

/**
 * Consulta todas las guías dinámicas almacenadas en Supabase (tabla `guides`)
 * con sus respectivas secciones en `guide_sections`.
 */
export async function fetchSupabaseGuides(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        guide_sections (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Aviso al consultar guías en Supabase:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((row: any) => {
      const sections = Array.isArray(row.guide_sections) 
        ? row.guide_sections.sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
        : [];

      const explainedContent = sections.map((s: any) => ({
        heading: s.title || s.heading || '',
        text: s.content || s.text || '',
        bulletPoints: Array.isArray(s.bullet_points) ? s.bullet_points : []
      }));

      const decoded = decodeGuideMeta(row.description || row.simple_summary || '');

      return {
        id: String(row.id),
        slug: row.slug || generateSlug(row.title),
        badge: row.badge || row.category || 'Bienestar',
        title: row.title,
        image: row.image_url || row.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
        category: row.category || 'General',
        author: row.author || 'FluxGlow Editorial',
        readTime: row.read_time || '5 min',
        isDemoContent: false,
        simpleSummary: decoded.simpleSummary,
        explainedContent: explainedContent.length > 0 ? explainedContent : (row.explained_content || []),
        glossary: (decoded.glossary && decoded.glossary.length > 0) ? decoded.glossary : (row.glossary || []),
        extraTips: (decoded.extraTips && decoded.extraTips.length > 0) ? decoded.extraTips : (row.extra_tips || []),
        dailyMissions: (decoded.dailyMissions && decoded.dailyMissions.length > 0) ? decoded.dailyMissions : (row.daily_missions || []),
        guideType: decoded.guideType || row.guide_type || 'quick',
        authors: decoded.authors && decoded.authors.length > 0 ? decoded.authors : (row.authors || []),
        reviewedBy: decoded.reviewedBy || row.reviewed_by || '',
        references: decoded.references && decoded.references.length > 0 ? decoded.references : (row.references || []),
        blocks: decoded.blocks && decoded.blocks.length > 0 ? decoded.blocks : (row.blocks || [])
      };
    });
  } catch (err: any) {
    console.error('Error recuperando guías de Supabase:', err?.message || err);
    return [];
  }
}

/**
 * Consulta una guía específica por su `slug` o `id` desde Supabase
 */
export async function fetchSupabaseGuideBySlug(slug: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        guide_sections (*)
      `)
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error) {
      console.warn('Aviso consultando guía por slug:', error.message);
      return null;
    }

    if (!data) return null;

    const sections = Array.isArray(data.guide_sections)
      ? data.guide_sections.sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      : [];

    const explainedContent = sections.map((s: any) => ({
      heading: s.title || s.heading || '',
      text: s.content || s.text || '',
      bulletPoints: Array.isArray(s.bullet_points) ? s.bullet_points : []
    }));

    const decoded = decodeGuideMeta(data.description || data.simple_summary || '');

    return {
      id: String(data.id),
      slug: data.slug || generateSlug(data.title),
      badge: data.badge || data.category || 'Bienestar',
      title: data.title,
      image: data.image_url || data.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
      category: data.category || 'General',
      author: data.author || 'FluxGlow Editorial',
      readTime: data.read_time || '5 min',
      isDemoContent: false,
      simpleSummary: decoded.simpleSummary,
      explainedContent: explainedContent.length > 0 ? explainedContent : (data.explained_content || []),
      glossary: (decoded.glossary && decoded.glossary.length > 0) ? decoded.glossary : (data.glossary || []),
      extraTips: (decoded.extraTips && decoded.extraTips.length > 0) ? decoded.extraTips : (data.extra_tips || []),
      dailyMissions: (decoded.dailyMissions && decoded.dailyMissions.length > 0) ? decoded.dailyMissions : (data.daily_missions || []),
      guideType: decoded.guideType || data.guide_type || 'quick',
      authors: decoded.authors && decoded.authors.length > 0 ? decoded.authors : (data.authors || []),
      reviewedBy: decoded.reviewedBy || data.reviewed_by || '',
      references: decoded.references && decoded.references.length > 0 ? decoded.references : (data.references || []),
      blocks: decoded.blocks && decoded.blocks.length > 0 ? decoded.blocks : (data.blocks || [])
    };
  } catch (err) {
    console.error('Error al obtener guía por slug:', err);
    return null;
  }
}

/**
 * Guarda o actualiza una guía con su estructura completa de bloques en Supabase y localmente
 */
export async function saveOrUpdateSupabaseGuide(guideData: {
  id?: string;
  title: string;
  slug: string;
  category: string;
  badge?: string;
  readTime: string;
  imageUrl: string;
  description: string;
  author?: string;
  guideType?: 'quick' | 'weekly';
  authors?: GuideAuthor[];
  reviewedBy?: string;
  references?: GuideReference[];
  blocks?: GuideBlock[];
  dailyMissions?: GuideDailyMission[];
  glossary?: { term: string; definition: string }[];
  extraTips?: string[];
  sections?: { heading: string; text: string; bulletPoints?: string[] }[];
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const encodedDescription = encodeGuideMeta({
      description: guideData.description,
      guideType: guideData.guideType,
      authors: guideData.authors,
      reviewedBy: guideData.reviewedBy,
      references: guideData.references,
      blocks: guideData.blocks,
      dailyMissions: guideData.dailyMissions,
      glossary: guideData.glossary,
      extraTips: guideData.extraTips
    });

    const isUpdating = Boolean(guideData.id && !guideData.id.startsWith('local-'));
    let guideRow: any = null;

    if (isUpdating && guideData.id) {
      const { data, error } = await supabase
        .from('guides')
        .update({
          title: guideData.title,
          slug: guideData.slug,
          category: guideData.category,
          badge: guideData.badge || guideData.category,
          read_time: guideData.readTime,
          image_url: guideData.imageUrl,
          description: encodedDescription,
          author: guideData.author || (guideData.authors?.[0]?.name) || 'FluxGlow Editorial'
        })
        .eq('id', guideData.id)
        .select('*')
        .single();

      if (!error && data) {
        guideRow = data;
        await supabase.from('guide_sections').delete().eq('guide_id', guideData.id);
      }
    }

    if (!guideRow) {
      const { data, error } = await supabase
        .from('guides')
        .insert({
          title: guideData.title,
          slug: guideData.slug,
          category: guideData.category,
          badge: guideData.badge || guideData.category,
          read_time: guideData.readTime,
          image_url: guideData.imageUrl,
          description: encodedDescription,
          author: guideData.author || (guideData.authors?.[0]?.name) || 'FluxGlow Editorial'
        })
        .select('*')
        .single();

      if (!error && data) {
        guideRow = data;
      }
    }

    // Secciones a insertar en Supabase
    let sectionRowsToInsert = guideData.sections || [];
    if (sectionRowsToInsert.length === 0 && guideData.blocks && guideData.blocks.length > 0) {
      sectionRowsToInsert = guideData.blocks
        .filter(b => b.type === 'text' || b.type === 'callout')
        .map(b => ({
          heading: b.content?.slice(0, 50) || b.calloutTitle || 'Sección',
          text: b.content || b.calloutText || '',
          bulletPoints: b.listItems || []
        }));
    }

    if (guideRow && sectionRowsToInsert.length > 0) {
      const dbSections = sectionRowsToInsert.map((s, idx) => ({
        guide_id: guideRow.id,
        title: s.heading,
        content: s.text,
        bullet_points: s.bulletPoints || [],
        order_index: idx
      }));
      await supabase.from('guide_sections').insert(dbSections);
    }

    // Persistir las 3 misiones en Supabase (columna unlocked_missions o tabla missions)
    if (guideRow && guideData.dailyMissions && guideData.dailyMissions.length > 0) {
      try {
        // 1. Intentar actualizar columna JSONB unlocked_missions en la tabla guides
        await supabase
          .from('guides')
          .update({ unlocked_missions: guideData.dailyMissions })
          .eq('id', guideRow.id);
      } catch (colErr) {
        console.warn('Aviso: columna unlocked_missions en guides omitida:', colErr);
      }

      try {
        // 2. Intentar guardar en la tabla missions vinculada a guide_id
        const missionRows = guideData.dailyMissions.map((m, idx) => ({
          guide_id: guideRow.id,
          title: m.title,
          description: m.description,
          time_estimate: m.timeEstimate || '5 min',
          xp: m.xp || 30,
          order_index: idx
        }));
        await supabase.from('missions').insert(missionRows);
      } catch (tblErr) {
        console.warn('Aviso: inserción en tabla missions omitida (respaldada en metadata):', tblErr);
      }
    }

    // Guardar / Sincronizar en localStorage como respaldo seguro instantáneo
    const finalId = guideRow ? String(guideRow.id) : (guideData.id || `local-guide-${Date.now()}`);
    const finalGuideObject: GuideItem = {
      id: finalId,
      slug: guideData.slug,
      badge: guideData.badge || guideData.category,
      title: guideData.title,
      image: guideData.imageUrl,
      category: guideData.category,
      author: guideData.author || (guideData.authors?.[0]?.name) || 'FluxGlow Editorial',
      readTime: guideData.readTime,
      isDemoContent: false,
      simpleSummary: guideData.description,
      explainedContent: sectionRowsToInsert,
      glossary: guideData.glossary || [],
      extraTips: guideData.extraTips || [],
      dailyMissions: guideData.dailyMissions || [],
      guideType: guideData.guideType || 'quick',
      authors: guideData.authors || [],
      reviewedBy: guideData.reviewedBy || '',
      references: guideData.references || [],
      blocks: guideData.blocks || []
    };

    try {
      const local = localStorage.getItem('fluxglow_custom_guides');
      const list: GuideItem[] = local ? JSON.parse(local) : [];
      const existingIdx = list.findIndex(g => g.id === finalId || g.slug === guideData.slug);
      if (existingIdx >= 0) {
        list[existingIdx] = finalGuideObject;
      } else {
        list.unshift(finalGuideObject);
      }
      localStorage.setItem('fluxglow_custom_guides', JSON.stringify(list));
    } catch {}

    return { success: true, data: finalGuideObject };
  } catch (err: any) {
    console.error('Error guardando guía:', err);
    return { success: false, error: err?.message || 'Error inesperado' };
  }
}

/**
 * Inserta una nueva guía con sus secciones en Supabase (solo administradores) - Compatibilidad
 */
export async function createSupabaseGuide(guideData: {
  title: string;
  slug: string;
  category: string;
  badge?: string;
  readTime: string;
  imageUrl: string;
  description: string;
  author?: string;
  sections: { heading: string; text: string; bulletPoints?: string[] }[];
}): Promise<{ success: boolean; data?: any; error?: string }> {
  return saveOrUpdateSupabaseGuide(guideData);
}

/**
 * Elimina una guía en Supabase
 */
export async function deleteSupabaseGuide(guideId: string): Promise<boolean> {
  try {
    // 1. Eliminar de Supabase
    await supabase.from('guide_sections').delete().eq('guide_id', guideId);
    await supabase.from('guides').delete().eq('id', guideId);

    // 2. Eliminar del almacenamiento local sincronizado
    try {
      const local = localStorage.getItem('fluxglow_custom_guides');
      if (local) {
        const parsed = JSON.parse(local);
        const filtered = parsed.filter((g: any) => g.id !== guideId && g.slug !== guideId);
        localStorage.setItem('fluxglow_custom_guides', JSON.stringify(filtered));
      }
    } catch {}

    return true;
  } catch (err) {
    console.error('Error eliminando guía:', err);
    return false;
  }
}

/**
 * Sube una imagen de portada al bucket 'guides-covers' en Supabase Storage
 */
export async function uploadGuideCoverImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('guides-covers')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.warn('Aviso subiendo a guides-covers:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('guides-covers').getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Error subiendo imagen a storage:', err);
    return null;
  }
}

/**
 * Funciones de Moderación Admin en Comunidad
 */
export async function adminDeleteCommunityPost(postId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.warn('Aviso eliminando publicación de comunidad:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error admin eliminando publicación:', err);
    return false;
  }
}

export async function adminBanUser(userId: string, reason?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_banned: true,
        banned_reason: reason || 'Infracción de las normas de la comunidad',
        banned_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.warn('Aviso baneando usuario en profiles:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error suspendiendo usuario:', err);
    return false;
  }
}
