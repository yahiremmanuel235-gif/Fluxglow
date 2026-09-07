import { useState, useEffect, useCallback } from 'react';
import { CommunityPost } from '../types';
import { INITIAL_FACEBOOK_STYLE_POSTS } from '../data/communityData';
import { 
  fetchSupabaseCommunityPosts, 
  insertSupabaseCommunityPost, 
  toggleSupabasePostLike,
  fetchUserLikedPostIds,
  subscribeToCommunityPostsRealtime,
  mapSupabasePostToCommunityPost
} from '../services/supabaseService';
import { useAuth } from './useAuth';

export function useCommunity() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_community_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FACEBOOK_STYLE_POSTS;
  });

  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_liked_posts_guest');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set();
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState<boolean>(false);

  // Consulta de likes del usuario autenticado
  const syncUserLikes = useCallback(async (userId?: string) => {
    if (!userId) {
      try {
        const guestLikes = localStorage.getItem('fluxglow_liked_posts_guest');
        if (guestLikes) setLikedPostIds(new Set(JSON.parse(guestLikes)));
      } catch {}
      return;
    }
    try {
      const ids = await fetchUserLikedPostIds(userId);
      setLikedPostIds(new Set(ids));
      try {
        localStorage.setItem(`fluxglow_liked_posts_${userId}`, JSON.stringify(ids));
      } catch {}
    } catch (err) {
      console.warn('Error sincronizando post_likes:', err);
    }
  }, []);

  // Carga inicial y recarga de posts desde Supabase
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const livePosts = await fetchSupabaseCommunityPosts();
      if (livePosts && livePosts.length > 0) {
        setPosts(livePosts);
        setIsUsingLocalFallback(false);
        try {
          localStorage.setItem('fluxglow_community_posts', JSON.stringify(livePosts));
        } catch {}
      } else {
        // Si no hay posts en la base de datos remota, mantener la cuadrícula con los iniciales
        setIsUsingLocalFallback(false);
      }
      if (user?.id) {
        await syncUserLikes(user.id);
      }
    } catch (err: any) {
      console.warn('Fallo al conectar con community_posts en Supabase:', err?.message || err);
      setError('No se pudo conectar en vivo con la comunidad de Supabase. Mostrando publicaciones almacenadas localmente.');
      setIsUsingLocalFallback(true);
      // El estado ya contiene el fallback de localStorage o los iniciales
    } finally {
      setLoading(false);
    }
  }, [user?.id, syncUserLikes]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Actualizar likes cuando cambia el usuario autenticado
  useEffect(() => {
    syncUserLikes(user?.id);
  }, [user?.id, syncUserLikes]);

  // Suscripción en tiempo real a nuevas publicaciones o likes
  useEffect(() => {
    const unsubscribe = subscribeToCommunityPostsRealtime((payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        const newPost = mapSupabasePostToCommunityPost(payload.new);
        setPosts((prev) => {
          if (prev.some((p) => p.id === newPost.id)) return prev;
          const updated = [newPost, ...prev];
          try {
            localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === String(payload.new.id)
              ? { ...p, likes: payload.new.likes ?? p.likes }
              : p
          )
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Crear una nueva publicación vinculada estrictamente al user.id autenticado
  const createPost = async (params: { groupCategory: string; mood?: string; content: string }): Promise<CommunityPost | null> => {
    setError(null);
    if (!user) {
      const errMessage = 'Debes iniciar sesión para publicar en la comunidad.';
      setError(errMessage);
      throw new Error(errMessage);
    }

    try {
      const savedPost = await insertSupabaseCommunityPost({
        userId: user.id,
        groupCategory: params.groupCategory,
        mood: params.mood,
        content: params.content
      });

      if (savedPost) {
        setPosts((prev) => {
          if (prev.some((p) => p.id === savedPost.id)) return prev;
          const updated = [savedPost, ...prev];
          try {
            localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        return savedPost;
      }
      return null;
    } catch (err: any) {
      console.error('Error creando post en Supabase:', err);
      const errMsg = err?.message || 'Error al publicar en la comunidad';
      setError(errMsg);
      throw err;
    }
  };

  // Manejo atómico de likes y prevención de doble clic
  const likePost = async (postId: string) => {
    // Si ya le dio like, prevenir petición duplicada innecesaria
    if (likedPostIds.has(postId)) {
      return;
    }

    // Registrar en estado local inmediatamente
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      next.add(postId);
      try {
        const storageKey = user ? `fluxglow_liked_posts_${user.id}` : 'fluxglow_liked_posts_guest';
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );

    const result = await toggleSupabasePostLike(postId, user?.id);
    if (result.success && typeof result.newLikes === 'number') {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: result.newLikes! } : p))
      );
    }
  };

  return {
    posts,
    likedPostIds,
    isPostLiked: (postId: string) => likedPostIds.has(postId),
    loading,
    error,
    isUsingLocalFallback,
    createPost,
    likePost,
    refreshPosts: loadPosts,
    setPosts
  };
}
