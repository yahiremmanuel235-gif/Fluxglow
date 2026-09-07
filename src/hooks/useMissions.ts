import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { UserDailyMissionRecord, UserProfileData } from '../types';
import { 
  getStoredMissions, 
  saveStoredMissions, 
  calculateMissionStreak,
  completeDailyMission 
} from '../utils/missionsManager';

// Catálogo predeterminado de misiones prácticas vinculadas a los temas de bienestar
export const DEFAULT_CATALOG_MISSIONS: UserDailyMissionRecord[] = [
  {
    id: 'mission-stress-1',
    missionId: 'mission-stress-1',
    guideId: 'guide-stress-1',
    guideTitle: '5 estrategias para regular el estrés antes de que te controle',
    title: 'Suspiro Fisiológico Guiado',
    description: 'Realiza 3 ciclos de doble inhalación nasal y exhalación larga al mediodía para reiniciar tu sistema nervioso autónomo.',
    category: 'Estrés',
    xp: 35,
    timeEstimate: '3 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mission-stress-2',
    missionId: 'mission-stress-2',
    guideId: 'guide-stress-1',
    guideTitle: '5 estrategias para regular el estrés antes de que te controle',
    title: 'Descarga mental en 3 columnas',
    description: 'Escribe en una hoja o nota digital tus preocupaciones del día y clasifícalas en lo que controlas vs lo que no depende de ti.',
    category: 'Estrés',
    xp: 40,
    timeEstimate: '5 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mission-anxiety-1',
    missionId: 'mission-anxiety-1',
    guideId: 'guide-anxiety-2',
    guideTitle: 'Cómo transformar la ansiedad en tu mayor motor de enfoque',
    title: 'Nombrar la emoción en voz alta',
    description: 'Etiqueta en voz audible o por escrito la emoción presente ("Siento agobio por esta tarea") para desactivar la reactividad amigdalina.',
    category: 'Ansiedad',
    xp: 30,
    timeEstimate: '2 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mission-anxiety-2',
    missionId: 'mission-anxiety-2',
    guideId: 'guide-anxiety-2',
    guideTitle: 'Cómo transformar la ansiedad en tu mayor motor de enfoque',
    title: 'Técnica de anclaje sensorial 5-4-3-2-1',
    description: 'Observa 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que agradeces para regresar al instante presente.',
    category: 'Ansiedad',
    xp: 35,
    timeEstimate: '5 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mission-sleep-1',
    missionId: 'mission-sleep-1',
    guideId: 'guide-sleep-3',
    guideTitle: 'Higiene del sueño para mentes activas y universitarias',
    title: 'Filtro de luz cálida nocturno',
    description: 'Apaga luces frías de techo 60 minutos antes de dormir y coloca tus dispositivos en modo luz nocturna o escala de grises.',
    category: 'Sueño',
    xp: 25,
    timeEstimate: '2 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mission-focus-1',
    missionId: 'mission-focus-1',
    guideId: 'guide-focus-4',
    guideTitle: 'Concentración profunda sin distracciones digitales',
    title: 'Bloque Pomodoro Monotarea',
    description: 'Dedica 25 minutos seguidos a una sola actividad prioritaria con notificaciones apagadas y temporizador activo.',
    category: 'Productividad',
    xp: 45,
    timeEstimate: '25 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export function useMissions(userProfile?: UserProfileData, onUpdateProfile?: (updated: Partial<UserProfileData>) => void) {
  const { user, authLoading } = useAuth();
  const [missions, setMissions] = useState<UserDailyMissionRecord[]>(() => {
    const stored = getStoredMissions();
    return stored.length > 0 ? stored : DEFAULT_CATALOG_MISSIONS;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState<boolean>(false);
  const [userPoints, setUserPoints] = useState<number>(userProfile?.points || 0);
  const [userLevel, setUserLevel] = useState<number>(userProfile?.level || 1);

  // Mantener sincronizado el perfil si cambia desde afuera
  useEffect(() => {
    if (userProfile?.points !== undefined) {
      setUserPoints(userProfile.points);
    }
    if (userProfile?.level !== undefined) {
      setUserLevel(userProfile.level);
    }
  }, [userProfile?.points, userProfile?.level]);

  // Carga inicial y sincronización con Supabase / localStorage
  const fetchMissionsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (user) {
        // 1. USUARIO AUTENTICADO: Consultar Supabase
        
        // A. Consultar catálogo general de misiones en la tabla 'missions'
        let baseMissions: UserDailyMissionRecord[] = [];
        try {
          const { data: dbMissions, error: missionsErr } = await supabase
            .from('missions')
            .select('*');

          if (!missionsErr && dbMissions && dbMissions.length > 0) {
            baseMissions = dbMissions.map((m: any) => ({
              id: String(m.id),
              missionId: String(m.mission_id || m.id),
              guideId: m.guide_id || m.guideId || 'general',
              guideTitle: m.guide_title || m.guideTitle || 'Guía de Bienestar',
              title: m.title || 'Misión Diaria',
              description: m.description || '',
              category: m.category || 'General',
              xp: typeof m.xp === 'number' ? m.xp : 30,
              timeEstimate: m.time_estimate || m.timeEstimate || '5 min',
              status: 'pending',
              createdAt: m.created_at || new Date().toISOString()
            }));
          }
        } catch (e) {
          console.warn('Aviso: Tabla missions no disponible o vacía en Supabase. Usando catálogo predeterminado.', e);
        }

        // Si no hay misiones en la tabla remota, combinar catálogo predeterminado con las activadas localmente
        if (baseMissions.length === 0) {
          const stored = getStoredMissions();
          const mergedSet = new Map<string, UserDailyMissionRecord>();
          DEFAULT_CATALOG_MISSIONS.forEach(m => mergedSet.set(m.missionId, m));
          stored.forEach(m => mergedSet.set(m.missionId, m));
          baseMissions = Array.from(mergedSet.values());
        }

        // B. Consultar el progreso del usuario en 'user_missions' filtrando por user_id
        let userMissionsMap = new Map<string, any>();
        try {
          const { data: userProgress, error: progressErr } = await supabase
            .from('user_missions')
            .select('*')
            .eq('user_id', user.id);

          if (!progressErr && userProgress) {
            userProgress.forEach((p: any) => {
              const mKey = String(p.mission_id || p.id);
              userMissionsMap.set(mKey, p);
            });
          }
        } catch (e) {
          console.warn('Aviso: Error consultando progreso en user_missions:', e);
        }

        // C. Sincronizar puntos y nivel desde 'profiles'
        try {
          const { data: profileRow } = await supabase
            .from('profiles')
            .select('points, level')
            .eq('id', user.id)
            .maybeSingle();

          if (profileRow) {
            const pts = typeof profileRow.points === 'number' ? profileRow.points : 0;
            const lvl = typeof profileRow.level === 'number' ? profileRow.level : Math.max(1, Math.floor(pts / 100) + 1);
            setUserPoints(pts);
            setUserLevel(lvl);
            if (onUpdateProfile) {
              onUpdateProfile({ points: pts, level: lvl });
            }
          }
        } catch (e) {
          console.warn('Aviso: Error al leer points de profiles:', e);
        }

        // D. Combinar catálogo base con el progreso de user_missions
        const consolidatedMissions: UserDailyMissionRecord[] = baseMissions.map((m) => {
          const progress = userMissionsMap.get(m.missionId) || userMissionsMap.get(m.id);
          if (progress) {
            const isCompleted = progress.completed === true || progress.status === 'completed';
            return {
              ...m,
              status: isCompleted ? ('completed' as const) : ('pending' as const),
              completedAt: progress.completed_at || (isCompleted ? new Date().toISOString() : undefined)
            };
          }
          return m;
        });

        setMissions(consolidatedMissions);
        saveStoredMissions(consolidatedMissions);
        setIsUsingLocalFallback(false);
      } else {
        // 2. MODO INVITADO: Cargar desde localStorage
        setIsUsingLocalFallback(false);
        const stored = getStoredMissions();
        if (stored.length > 0) {
          setMissions(stored);
        } else {
          setMissions(DEFAULT_CATALOG_MISSIONS);
          saveStoredMissions(DEFAULT_CATALOG_MISSIONS);
        }
      }
    } catch (err: any) {
      console.error('Error general en fetchMissionsData:', err);
      setError(err?.message || 'Error al sincronizar misiones');
      if (user) {
        setIsUsingLocalFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, [user, onUpdateProfile]);

  // Ejecutar al montar o al cambiar el estado de autenticación
  useEffect(() => {
    if (!authLoading) {
      fetchMissionsData();
    }
  }, [authLoading, user, fetchMissionsData]);

  // Escuchar eventos de activación desde guías o cursos
  useEffect(() => {
    const handleMissionsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setMissions(e.detail);
      }
    };
    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    return () => window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
  }, []);

  // Función para alternar el estado de completado (Marcar / Desmarcar)
  const toggleCompleteMission = async (
    recordId: string, 
    currentStatus: string
  ): Promise<{ success: boolean; mission?: UserDailyMissionRecord; xpEarned: number; streakDays: number }> => {
    setActionLoadingId(recordId);
    setError(null);

    const target = missions.find(m => m.id === recordId || m.missionId === recordId);
    if (!target) {
      setActionLoadingId(null);
      return { success: false, xpEarned: 0, streakDays: 0 };
    }

    const isCompleting = currentStatus === 'pending';
    const missionXP = target.xp || 30;
    const nowIso = new Date().toISOString();

    try {
      if (user) {
        // USUARIO AUTENTICADO: Sincronizar en Supabase (user_missions & profiles)
        const missionIdentifier = target.missionId || target.id;

        // 1. Insertar o actualizar registro en 'user_missions'
        try {
          const { data: existingRecord } = await supabase
            .from('user_missions')
            .select('id')
            .eq('user_id', user.id)
            .eq('mission_id', missionIdentifier)
            .maybeSingle();

          if (existingRecord?.id) {
            await supabase
              .from('user_missions')
              .update({
                completed: isCompleting,
                completed_at: isCompleting ? nowIso : null,
                status: isCompleting ? 'completed' : 'pending'
              })
              .eq('id', existingRecord.id);
          } else {
            await supabase
              .from('user_missions')
              .insert({
                user_id: user.id,
                mission_id: missionIdentifier,
                completed: isCompleting,
                completed_at: isCompleting ? nowIso : null,
                status: isCompleting ? 'completed' : 'pending'
              });
          }
        } catch (e) {
          console.warn('Aviso guardando en user_missions de Supabase:', e);
        }

        // 2. Sincronizar puntos y nivel del usuario delegando en la función RPC 'add_user_xp' en PostgreSQL
        const xpDelta = isCompleting ? missionXP : -missionXP;
        let syncedPoints = userPoints + xpDelta;
        let syncedLevel = Math.max(1, Math.floor(syncedPoints / 100) + 1);

        try {
          // Intento de incremento atómico mediante la función RPC segura en Supabase
          const { data: rpcResult, error: rpcError } = await supabase.rpc('add_user_xp', {
            xp_delta: xpDelta
          });

          if (!rpcError && rpcResult && typeof rpcResult.points === 'number') {
            syncedPoints = rpcResult.points;
            syncedLevel = typeof rpcResult.level === 'number' ? rpcResult.level : Math.max(1, Math.floor(syncedPoints / 100) + 1);
          } else {
            if (rpcError) {
              console.warn('Nota: RPC add_user_xp no disponible aún, usando actualización directa:', rpcError.message);
            }
            // Fallback directo a la tabla profiles si la función RPC aún no ha sido aplicada
            syncedPoints = Math.max(0, userPoints + xpDelta);
            syncedLevel = Math.max(1, Math.floor(syncedPoints / 100) + 1);
            await supabase
              .from('profiles')
              .update({
                points: syncedPoints,
                level: syncedLevel
              })
              .eq('id', user.id);
          }
        } catch (e) {
          console.warn('Aviso sincronizando puntos en profiles:', e);
        }

        setUserPoints(syncedPoints);
        setUserLevel(syncedLevel);
        if (onUpdateProfile) {
          onUpdateProfile({ points: syncedPoints, level: syncedLevel });
        }

        // 3. Actualizar estado local
        const updatedMissions = missions.map(m => {
          if (m.id === recordId || m.missionId === recordId) {
            return {
              ...m,
              status: (isCompleting ? 'completed' : 'pending') as 'completed' | 'pending',
              completedAt: isCompleting ? nowIso : undefined
            };
          }
          return m;
        });

        setMissions(updatedMissions);
        saveStoredMissions(updatedMissions);

        const streak = calculateMissionStreak(updatedMissions);
        return {
          success: true,
          mission: target,
          xpEarned: isCompleting ? missionXP : -missionXP,
          streakDays: streak
        };

      } else {
        // MODO INVITADO: Gestión en localStorage
        let updatedMissions: UserDailyMissionRecord[];
        if (isCompleting) {
          const res = completeDailyMission(recordId);
          updatedMissions = getStoredMissions();
          const nextPoints = userPoints + missionXP;
          const nextLevel = Math.max(1, Math.floor(nextPoints / 100) + 1);
          setUserPoints(nextPoints);
          setUserLevel(nextLevel);
          if (onUpdateProfile) {
            onUpdateProfile({ points: nextPoints, level: nextLevel });
          }
          return {
            success: res.success,
            mission: res.mission || target,
            xpEarned: missionXP,
            streakDays: res.streakDays
          };
        } else {
          updatedMissions = missions.map(m => {
            if (m.id === recordId || m.missionId === recordId) {
              return {
                ...m,
                status: 'pending' as const,
                completedAt: undefined
              };
            }
            return m;
          });
          saveStoredMissions(updatedMissions);
          setMissions(updatedMissions);
          const nextPoints = Math.max(0, userPoints - missionXP);
          const nextLevel = Math.max(1, Math.floor(nextPoints / 100) + 1);
          setUserPoints(nextPoints);
          setUserLevel(nextLevel);
          if (onUpdateProfile) {
            onUpdateProfile({ points: nextPoints, level: nextLevel });
          }
          const streak = calculateMissionStreak(updatedMissions);
          return {
            success: true,
            mission: target,
            xpEarned: -missionXP,
            streakDays: streak
          };
        }
      }
    } catch (err: any) {
      console.error('Error completando misión:', err);
      setError(err?.message || 'Error al actualizar el estado de la misión');
      return { success: false, xpEarned: 0, streakDays: 0 };
    } finally {
      setActionLoadingId(null);
    }
  };

  const streakDays = useMemo(() => calculateMissionStreak(missions), [missions]);

  return {
    missions,
    loading,
    actionLoadingId,
    error,
    isUsingLocalFallback,
    userPoints,
    userLevel,
    streakDays,
    toggleCompleteMission,
    refreshMissions: fetchMissionsData,
    isGuest: !user,
    user
  };
}
