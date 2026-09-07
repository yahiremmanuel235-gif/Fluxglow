import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { JournalEntry, MoodType } from '../types';
import { mapSupabaseJournalEntry } from '../services/supabaseService';
import { migrateGuestDataToSupabase } from '../services/migrationService';

export interface CreateJournalEntryParams {
  mood: MoodType;
  notes: string;
  intensity?: number;
  triggers?: string[];
  habits?: {
    sleepHours?: number;
    waterGlasses?: number;
    exercised?: boolean;
    energyLevel?: number;
  };
  aiFeedback?: string;
}

export function useJournal() {
  const { user, authLoading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState<boolean>(false);

  const sanitizeEntry = (raw: any): JournalEntry => ({
    id: String(raw?.id || `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
    date: typeof raw?.date === 'string' ? raw.date : new Date().toISOString().split('T')[0],
    time: raw?.time || raw?.timestamp || '12:00 PM',
    mood: (typeof raw?.mood === 'string' ? raw.mood.toLowerCase() : 'tranquilo') as MoodType,
    intensity: typeof raw?.intensity === 'number' ? raw.intensity : 7,
    notes: typeof raw?.notes === 'string' ? raw.notes : typeof raw?.note === 'string' ? raw.note : '',
    triggers: Array.isArray(raw?.triggers) && raw.triggers.length > 0 ? raw.triggers : ['Productividad', 'Bienestar'],
    habits: raw?.habits || { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: 4 },
    aiFeedback: raw?.aiFeedback || raw?.ai_feedback || 'Registro guardado.'
  });

  // Fetch entries according to auth state
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (user) {
      // 1. Usuario autenticado: Si existen entradas previas de invitado en localStorage, migrarlas a Supabase
      const pendingGuestEntries = localStorage.getItem('fluxglow_journal_entries');
      if (pendingGuestEntries) {
        try {
          await migrateGuestDataToSupabase(user.id);
        } catch (mErr) {
          console.warn('Aviso en migración automática de diario:', mErr);
        }
      }

      // Consultar tabla journal_entries filtrada por user_id y ordenada por created_at desc
      try {
        const { data, error: dbError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbError) {
          console.warn('Aviso al consultar journal_entries en Supabase:', dbError.message);
          setError(`Conexión con Supabase no disponible (${dbError.message}). Mostrando datos de respaldo.`);
          setIsUsingLocalFallback(true);
          // Fallback a almacenamiento local de respaldo para este usuario si existiera
          try {
            const cached = localStorage.getItem(`fluxglow_journal_${user.id}`);
            if (cached) {
              setEntries(JSON.parse(cached).map(sanitizeEntry));
            }
          } catch {}
        } else if (data) {
          setIsUsingLocalFallback(false);
          const mapped = data.map(mapSupabaseJournalEntry);
          setEntries(mapped);
          try {
            localStorage.setItem(`fluxglow_journal_${user.id}`, JSON.stringify(mapped));
          } catch {}
        }
      } catch (err: any) {
        console.error('Fallo de conexión en fetchEntries:', err);
        setError(err?.message || 'Error de conexión con Supabase');
        setIsUsingLocalFallback(true);
      } finally {
        setLoading(false);
      }
    } else {
      // 2. Modo Invitado / Exploración: Cargar desde localStorage
      setIsUsingLocalFallback(false);
      try {
        const saved = localStorage.getItem('fluxglow_journal_entries');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setEntries(parsed.map(sanitizeEntry));
          } else {
            setEntries([]);
          }
        } else {
          setEntries([]);
        }
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  // Sincronizar las entradas al cargar o al detectar cambio en la sesión
  useEffect(() => {
    if (!authLoading) {
      fetchEntries();
    }
  }, [user, authLoading, fetchEntries]);

  // Escuchar actualizaciones en tiempo real entre módulos (ej. Journal y Dashboard)
  useEffect(() => {
    const handleJournalUpdate = () => {
      fetchEntries();
    };
    window.addEventListener('fluxglow_journal_updated', handleJournalUpdate);
    return () => window.removeEventListener('fluxglow_journal_updated', handleJournalUpdate);
  }, [fetchEntries]);

  // Creación (Insert):
  const createEntry = async (params: CreateJournalEntryParams): Promise<JournalEntry | null> => {
    setIsSubmitting(true);
    setError(null);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      if (user) {
        // Usuario autenticado: Insertar en Supabase asociando user_id
        const { data, error: insertError } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            mood: params.mood,
            note: params.notes.trim()
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error insertando en journal_entries:', insertError);
          setError(insertError.message);
          throw insertError;
        }

        const newEntry: JournalEntry = data
          ? {
              ...mapSupabaseJournalEntry(data),
              intensity: params.intensity ?? 7,
              triggers: params.triggers ?? ['Productividad', 'Bienestar'],
              habits: params.habits ?? { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: params.intensity ?? 7 },
              aiFeedback: params.aiFeedback ?? 'Registro guardado y sincronizado con tu base de datos de Supabase.'
            }
          : {
              id: 'entry-' + Date.now(),
              date: dateStr,
              time: timeStr,
              mood: params.mood,
              intensity: params.intensity ?? 7,
              notes: params.notes,
              triggers: params.triggers ?? ['Productividad', 'Bienestar'],
              habits: params.habits,
              aiFeedback: params.aiFeedback
            };

        setEntries((prev) => {
          const updated = [newEntry, ...prev.filter((e) => e.id !== newEntry.id)];
          try {
            localStorage.setItem(`fluxglow_journal_${user.id}`, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        window.dispatchEvent(new CustomEvent('fluxglow_journal_updated', { detail: [newEntry] }));
        return newEntry;
      } else {
        // Modo Invitado: Guardar localmente
        const guestId = 'guest-' + Date.now();
        const newEntry: JournalEntry = {
          id: guestId,
          date: dateStr,
          time: timeStr,
          mood: params.mood,
          intensity: params.intensity ?? 7,
          notes: params.notes,
          triggers: params.triggers ?? ['Productividad', 'Bienestar'],
          habits: params.habits || { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: params.intensity ?? 7 },
          aiFeedback: params.aiFeedback || 'Registro guardado localmente en tu navegador.'
        };

        setEntries((prev) => {
          const updated = [newEntry, ...prev];
          try {
            localStorage.setItem('fluxglow_journal_entries', JSON.stringify(updated));
          } catch {}
          return updated;
        });

        window.dispatchEvent(new CustomEvent('fluxglow_journal_updated', { detail: [newEntry] }));
        return newEntry;
      }
    } catch (err: any) {
      console.error('Error creando entrada:', err);
      setError(err?.message || 'Error al guardar la entrada');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminación (Delete):
  const deleteEntry = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      if (user) {
        // Defensa en profundidad: eliminar garantizando que pertenezca al usuario autenticado
        const { error: deleteError } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error al eliminar en Supabase:', deleteError.message);
          setError(`No se pudo eliminar de la base de datos: ${deleteError.message}`);
          return false;
        }
      }

      setEntries((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        try {
          if (user) {
            localStorage.setItem(`fluxglow_journal_${user.id}`, JSON.stringify(updated));
          }
          localStorage.setItem('fluxglow_journal_entries', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      window.dispatchEvent(new CustomEvent('fluxglow_journal_updated', { detail: [] }));
      return true;
    } catch (err: any) {
      console.error('Error eliminando entrada:', err);
      setError(err?.message || 'Error al eliminar');
      return false;
    }
  };

  return {
    entries,
    loading,
    isSubmitting,
    error,
    isUsingLocalFallback,
    createEntry,
    deleteEntry,
    refreshEntries: fetchEntries,
    isGuest: !user,
    user
  };
}
