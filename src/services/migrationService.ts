import { supabase } from '../lib/supabaseClient';

/**
 * Migración silenciosa y transparente de datos creados en modo invitado hacia Supabase.
 * - Sincroniza entradas del diario local (`fluxglow_journal_entries`).
 * - Sincroniza misiones completadas en almacenamiento local (`fluxglow_daily_missions`).
 * - Una vez transferidos a la nube, limpia o respalda las claves de localStorage para
 *   evitar duplicaciones o estados huérfanos.
 */
export async function migrateGuestDataToSupabase(userId: string): Promise<{
  journalMigrated: number;
  missionsMigrated: number;
}> {
  if (!userId) return { journalMigrated: 0, missionsMigrated: 0 };

  let journalMigrated = 0;
  let missionsMigrated = 0;

  try {
    // 1. Migración de Entradas de Diario Local (Modo Invitado)
    const rawJournal = localStorage.getItem('fluxglow_journal_entries');
    if (rawJournal) {
      try {
        const parsed = JSON.parse(rawJournal);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Tomar todas las entradas locales (las que tienen prefijo 'guest-' o id temporal)
          for (const entry of parsed) {
            if (!entry) continue;

            const noteContent = (entry.notes || entry.note || '').trim();
            const mood = entry.mood || 'neutral';
            const intensity = typeof entry.intensity === 'number' ? entry.intensity : 7;
            const triggers = Array.isArray(entry.triggers) ? entry.triggers : [];
            const habits = entry.habits || null;
            const aiFeedback = entry.aiFeedback || entry.ai_feedback || null;
            let createdAt = new Date().toISOString();

            if (entry.date) {
              const parsedDate = new Date(entry.date);
              if (!isNaN(parsedDate.getTime())) {
                createdAt = parsedDate.toISOString();
              }
            }

            const { error: insertError } = await supabase.from('journal_entries').insert({
              user_id: userId,
              mood,
              intensity,
              note: noteContent,
              triggers,
              habits,
              ai_feedback: aiFeedback,
              created_at: createdAt
            });

            if (!insertError) {
              journalMigrated++;
            } else {
              console.warn('Aviso insertando entrada de diario migrada:', insertError.message);
            }
          }

          // Respaldar y remover la clave huérfana de invitado para evitar duplicados
          try {
            localStorage.setItem(`fluxglow_journal_migrated_${userId}`, rawJournal);
            localStorage.removeItem('fluxglow_journal_entries');
          } catch {}

          // Notificar a la UI
          window.dispatchEvent(new CustomEvent('fluxglow_journal_updated', { detail: [] }));
        }
      } catch (parseErr) {
        console.warn('Error parseando diario de invitado para migración:', parseErr);
      }
    }

    // 2. Migración de Misiones y Micro-Hábitos Completados en Modo Invitado
    const rawMissions = localStorage.getItem('fluxglow_daily_missions');
    if (rawMissions) {
      try {
        const parsedMissions = JSON.parse(rawMissions);
        if (Array.isArray(parsedMissions) && parsedMissions.length > 0) {
          const completedMissions = parsedMissions.filter(
            (m) => m && (m.status === 'completed' || m.completed === true)
          );

          for (const m of completedMissions) {
            const missionIdentifier = m.missionId || m.id;
            if (!missionIdentifier) continue;

            const { error: missionError } = await supabase.from('user_missions').upsert(
              {
                user_id: userId,
                mission_id: missionIdentifier,
                completed: true,
                status: 'completed',
                completed_at: m.completedAt || new Date().toISOString()
              },
              { onConflict: 'user_id,mission_id' }
            );

            if (!missionError) {
              missionsMigrated++;
            } else {
              console.warn('Aviso insertando misión migrada:', missionError.message);
            }
          }

          // Respaldar y limpiar la clave de misiones local de invitado
          try {
            localStorage.setItem(`fluxglow_missions_migrated_${userId}`, rawMissions);
            localStorage.removeItem('fluxglow_daily_missions');
          } catch {}

          // Notificar a la UI
          window.dispatchEvent(new CustomEvent('fluxglow_missions_updated', { detail: [] }));
        }
      } catch (missionParseErr) {
        console.warn('Error parseando misiones de invitado para migración:', missionParseErr);
      }
    }
  } catch (globalMigrationErr) {
    console.warn('Excepción no crítica en migrateGuestDataToSupabase:', globalMigrationErr);
  }

  return { journalMigrated, missionsMigrated };
}
