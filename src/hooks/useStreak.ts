import { useState, useEffect } from 'react';
import { getFluxStreak } from '../utils/streakManager';
import { useJournal } from './useJournal';

export function useStreak() {
  const [userStreak, setUserStreak] = useState(getFluxStreak());
  const { entries } = useJournal();

  useEffect(() => {
    let currentStreak = getFluxStreak();
    
    // Si hay un registro emocional hoy, la racha debe ser al menos 1
    const today = new Date().toISOString().split('T')[0];
    const hasEntryToday = entries.some(e => e.date.startsWith(today));
    
    if (hasEntryToday && currentStreak === 0) {
      currentStreak = 1;
      // Option: update localstorage if needed
    }
    
    setUserStreak(currentStreak);

    const handleUpdate = (e: Event) => {
      let streak = (e as CustomEvent).detail || getFluxStreak();
      if (hasEntryToday && streak === 0) {
        streak = 1;
      }
      setUserStreak(streak);
    };

    window.addEventListener('fluxglow_flux_streak_updated', handleUpdate);
    return () => window.removeEventListener('fluxglow_flux_streak_updated', handleUpdate);
  }, [entries]);

  return { userStreak };
}
