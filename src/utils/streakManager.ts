export const getFluxStreak = (): number => {
  try {
    const saved = localStorage.getItem('fluxglow_flux_streak');
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
    localStorage.setItem('fluxglow_flux_streak', next.toString());
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
    localStorage.setItem('fluxglow_flux_streak', next.toString());
    window.dispatchEvent(new CustomEvent('fluxglow_flux_streak_updated', { detail: next }));
  } catch (e) {
    console.error(e);
  }
  return next;
};

export const getLastFluxDate = (): string | null => {
  return localStorage.getItem('fluxglow_last_flux_date');
};

export const setLastFluxDate = (): void => {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('fluxglow_last_flux_date', today);
};

export const canStartFluxToday = (): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = getLastFluxDate();
  return lastDate !== today;
};
