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
