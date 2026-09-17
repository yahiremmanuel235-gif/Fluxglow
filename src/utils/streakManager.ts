import { STORAGE_KEYS } from '../constants/storageKeys';

export const getFluxStreak = (): number => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FLUX_STREAK);
    return saved ? parseInt(saved, 10) : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const incrementFluxStreak = (): number => {
  const current = getFluxStreak();
  const next = current + 1;
  try {
    localStorage.setItem(STORAGE_KEYS.FLUX_STREAK, next.toString());
    window.dispatchEvent(new CustomEvent('fluxglow_flux_streak_updated', { detail: next }));
  } catch (e) {
    console.error(e);
  }
  return next;
};

export const decrementFluxStreak = (points: number = 30): number => {
  const current = getFluxStreak();
  const next = Math.max(0, current - points);
  try {
    localStorage.setItem(STORAGE_KEYS.FLUX_STREAK, next.toString());
    window.dispatchEvent(new CustomEvent('fluxglow_flux_streak_updated', { detail: next }));
  } catch (e) {
    console.error(e);
  }
  return next;
};

export const getLastFluxDate = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_FLUX_DATE);
};

export const setLastFluxDate = (): void => {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(STORAGE_KEYS.LAST_FLUX_DATE, today);
};

export const canStartFluxToday = (): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = getLastFluxDate();
  return lastDate !== today;
};

export const recordAppActivity = (): number => {
  if (canStartFluxToday()) {
    const newStreak = incrementFluxStreak();
    setLastFluxDate();
    return newStreak;
  }
  return getFluxStreak();
};
