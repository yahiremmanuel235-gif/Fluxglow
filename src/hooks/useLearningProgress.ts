import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { DEMO_GUIDES_CATALOG } from '../data/guidesData';
import { useMissions } from './useMissions';

const DEFAULT_INITIAL_READ_GUIDES = ['guide-stress-1'];

export function getStoredReadGuides(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.READ_GUIDES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading read guides from storage:', e);
  }
  return DEFAULT_INITIAL_READ_GUIDES;
}

export function saveStoredReadGuides(guides: string[]): void {
  try {
    const safe = Array.from(new Set(guides));
    localStorage.setItem(STORAGE_KEYS.READ_GUIDES, JSON.stringify(safe));
    window.dispatchEvent(new CustomEvent('fluxglow_read_guides_updated', { detail: safe }));
  } catch (e) {
    console.error('Error saving read guides to storage:', e);
  }
}

export function useLearningProgress() {
  const [readGuides, setReadGuides] = useState<string[]>(getStoredReadGuides);
  const { missions } = useMissions();

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setReadGuides(e.detail);
      } else {
        setReadGuides(getStoredReadGuides());
      }
    };

    window.addEventListener('fluxglow_read_guides_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fluxglow_read_guides_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalCatalogGuides = DEMO_GUIDES_CATALOG.length;

  const completedGuidesCount = useMemo(() => {
    return DEMO_GUIDES_CATALOG.filter(g => readGuides.includes(g.id)).length;
  }, [readGuides]);

  const completedMissionsCount = useMemo(() => {
    return missions.filter(m => m && m.status === 'completed').length;
  }, [missions]);

  const totalCompleted = useMemo(() => {
    return completedGuidesCount + completedMissionsCount;
  }, [completedGuidesCount, completedMissionsCount]);

  const completionPercentage = useMemo(() => {
    if (totalCatalogGuides === 0) return 0;
    return Math.round((completedGuidesCount / totalCatalogGuides) * 100);
  }, [completedGuidesCount, totalCatalogGuides]);

  const markGuideAsRead = useCallback((guideId: string) => {
    setReadGuides((prev) => {
      if (prev.includes(guideId)) return prev;
      const updated = [...prev, guideId];
      saveStoredReadGuides(updated);
      return updated;
    });
  }, []);

  const isGuideRead = useCallback((guideId: string) => {
    return readGuides.includes(guideId);
  }, [readGuides]);

  return {
    readGuides,
    completedGuidesCount,
    totalCatalogGuides,
    completedMissionsCount,
    totalCompleted,
    completionPercentage,
    markGuideAsRead,
    isGuideRead
  };
}
