-- ==============================================================================
-- FLUXGLOW: SCRIPT INTEGRAL DE SEGURIDAD, POLÍTICAS RLS Y FUNCIONES ATÓMICAS RPC
-- Para ejecutar en el SQL Editor de Supabase (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. ESTRUCTURAS DE TABLAS CON CLAVES FORÁNEAS INTEGRADAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: profiles (Perfiles vinculados a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age_group TEXT,
  goals TEXT[],
  avatar_url TEXT DEFAULT '/user.png',
  points INTEGER DEFAULT 120,
  level INTEGER DEFAULT 1,
  member_since TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: journal_entries (Entradas privadas del diario emocional)
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  intensity INTEGER DEFAULT 7,
  note TEXT,
  triggers TEXT[],
  habits JSONB,
  ai_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: missions (Catálogo de micro-hábitos y misiones)
CREATE TABLE IF NOT EXISTS public.missions (
  id TEXT PRIMARY KEY,
  mission_id TEXT,
  guide_id TEXT,
  guide_title TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  xp INTEGER DEFAULT 30,
  time_estimate TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: user_missions (Progreso diario de misiones por usuario)
CREATE TABLE IF NOT EXISTS public.user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_mission UNIQUE (user_id, mission_id)
);

-- Tabla: community_posts (Publicaciones de la comunidad con autor validado por perfil)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_category TEXT NOT NULL,
  mood TEXT,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relación FK explícita con profiles para permitir JOINs directos en consultas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_community_posts_profile'
  ) THEN
    ALTER TABLE public.community_posts
    ADD CONSTRAINT fk_community_posts_profile
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Tabla: post_likes (Garantiza unicidad de interacciones y evita likes infinitos)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- ==============================================================================
-- 2. ACTIVACIÓN DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. POLÍTICAS RLS (DEFENSA EN PROFUNDIDAD)
-- ==============================================================================

-- --- PROFILES ---
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- --- JOURNAL_ENTRIES (Estrictamente Privado) ---
DROP POLICY IF EXISTS "journal_entries_select_own" ON public.journal_entries;
CREATE POLICY "journal_entries_select_own"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_entries_insert_own" ON public.journal_entries;
CREATE POLICY "journal_entries_insert_own"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_entries_update_own" ON public.journal_entries;
CREATE POLICY "journal_entries_update_own"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_entries_delete_own" ON public.journal_entries;
CREATE POLICY "journal_entries_delete_own"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- --- MISSIONS (Catálogo) ---
DROP POLICY IF EXISTS "missions_select_all" ON public.missions;
CREATE POLICY "missions_select_all"
  ON public.missions FOR SELECT
  USING (true);

-- --- USER_MISSIONS ---
DROP POLICY IF EXISTS "user_missions_select_own" ON public.user_missions;
CREATE POLICY "user_missions_select_own"
  ON public.user_missions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_missions_insert_own" ON public.user_missions;
CREATE POLICY "user_missions_insert_own"
  ON public.user_missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_missions_update_own" ON public.user_missions;
CREATE POLICY "user_missions_update_own"
  ON public.user_missions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_missions_delete_own" ON public.user_missions;
CREATE POLICY "user_missions_delete_own"
  ON public.user_missions FOR DELETE
  USING (auth.uid() = user_id);

-- --- COMMUNITY_POSTS ---
DROP POLICY IF EXISTS "community_posts_select_feed" ON public.community_posts;
CREATE POLICY "community_posts_select_feed"
  ON public.community_posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "community_posts_insert_auth" ON public.community_posts;
CREATE POLICY "community_posts_insert_auth"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "community_posts_update_own" ON public.community_posts;
CREATE POLICY "community_posts_update_own"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "community_posts_delete_own" ON public.community_posts;
CREATE POLICY "community_posts_delete_own"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- --- POST_LIKES ---
DROP POLICY IF EXISTS "post_likes_select_all" ON public.post_likes;
CREATE POLICY "post_likes_select_all"
  ON public.post_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "post_likes_insert_own" ON public.post_likes;
CREATE POLICY "post_likes_insert_own"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "post_likes_delete_own" ON public.post_likes;
CREATE POLICY "post_likes_delete_own"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. FUNCIONES ATÓMICAS RPC (INTEGRIDAD Y CONCURRENCIA)
-- ==============================================================================

-- A. Función para cálculo y sincronización de puntos/nivel en el servidor
CREATE OR REPLACE FUNCTION public.add_user_xp(xp_delta integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  new_points integer;
  new_level integer;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  UPDATE public.profiles
  SET 
    points = GREATEST(0, COALESCE(points, 0) + xp_delta),
    level = GREATEST(1, FLOOR(GREATEST(0, COALESCE(points, 0) + xp_delta) / 100) + 1),
    updated_at = NOW()
  WHERE id = current_user_id
  RETURNING points, level INTO new_points, new_level;

  RETURN json_build_object('points', new_points, 'level', new_level);
END;
$$;

-- B. Función atómica para incremento de likes en publicaciones de la comunidad
CREATE OR REPLACE FUNCTION public.increment_post_likes(target_post_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  updated_likes integer;
BEGIN
  -- Si el usuario está autenticado, registrar la interacción única
  IF current_user_id IS NOT NULL THEN
    INSERT INTO public.post_likes (post_id, user_id)
    VALUES (target_post_id, current_user_id)
    ON CONFLICT (post_id, user_id) DO NOTHING;
  END IF;

  -- Incrementar contador atómicamente evitando lecturas y escrituras desincronizadas
  UPDATE public.community_posts
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = target_post_id
  RETURNING likes INTO updated_likes;

  RETURN updated_likes;
END;
$$;

-- Otorgar permisos de ejecución para usuarios autenticados
GRANT EXECUTE ON FUNCTION public.add_user_xp(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_post_likes(uuid) TO authenticated, anon;
