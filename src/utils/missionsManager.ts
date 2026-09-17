import { STORAGE_KEYS, getDynamicStorageKey } from '../constants/storageKeys';
import { UserDailyMissionRecord, GuideItem, GuideDailyMission } from '../types';

const MISSIONS_STORAGE_KEY = STORAGE_KEYS.DAILY_MISSIONS;
const STREAK_STORAGE_KEY = 'fluxglow_missions_streak';

export const INITIAL_SEED_MISSIONS: UserDailyMissionRecord[] = [];

export function getStoredMissions(): UserDailyMissionRecord[] {
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && typeof item === 'object');
      }
    }
  } catch (e) {
    console.error('Error loading missions from localStorage:', e);
  }
  return [];
}

export function saveStoredMissions(missions: UserDailyMissionRecord[]): void {
  try {
    const safeList = Array.isArray(missions) ? missions : [];
    localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(safeList));
    window.dispatchEvent(new CustomEvent('fluxglow_missions_updated', { detail: safeList }));
  } catch (e) {
    console.error('Error saving missions to localStorage:', e);
  }
}

export function activateMissionFromGuide(guide: GuideItem, specificMissionId?: string): UserDailyMissionRecord {
  const missions = getStoredMissions();
  const targetMission = specificMissionId 
    ? guide.dailyMissions.find(m => m.id === specificMissionId) || guide.dailyMissions[0]
    : guide.dailyMissions[0];

  const existing = missions.find(m => m.missionId === targetMission.id && m.guideId === guide.id);
  if (existing) {
    return existing;
  }

  const newRecord: UserDailyMissionRecord = {
    id: `mission-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    missionId: targetMission.id,
    guideId: guide.id,
    guideTitle: guide.title,
    title: targetMission.title,
    description: targetMission.description,
    category: guide.category,
    xp: targetMission.xp || 30,
    timeEstimate: targetMission.timeEstimate || '5 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  missions.unshift(newRecord);
  saveStoredMissions(missions);
  return newRecord;
}


export function getProposedMissionsFromGuide(guide: GuideItem): UserDailyMissionRecord[] {
  return guide.dailyMissions.map(targetMission => ({
    id: `mission-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    missionId: targetMission.id,
    guideId: guide.id,
    guideTitle: guide.title,
    title: targetMission.title,
    description: targetMission.description,
    category: guide.category,
    xp: targetMission.xp || 30,
    timeEstimate: targetMission.timeEstimate || '5 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  }));
}

export function saveSingleMission(mission: UserDailyMissionRecord) {
  const missions = getStoredMissions();
  missions.unshift(mission);
  saveStoredMissions(missions);
  window.dispatchEvent(new CustomEvent('fluxglow_mission_accepted', { detail: mission }));
}

export function activateAllMissionsFromGuide(guide: GuideItem): UserDailyMissionRecord[] {
  const missions = getStoredMissions();
  const activatedList: UserDailyMissionRecord[] = [];

  guide.dailyMissions.forEach((targetMission) => {
    // Check if already active or completed today
    const existing = missions.find(m => m.missionId === targetMission.id && m.guideId === guide.id);
    if (existing) {
      activatedList.push(existing);
    } else {
      const newRecord: UserDailyMissionRecord = {
        id: `mission-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        missionId: targetMission.id,
        guideId: guide.id,
        guideTitle: guide.title,
        title: targetMission.title,
        description: targetMission.description,
        category: guide.category,
        xp: targetMission.xp || 30,
        timeEstimate: targetMission.timeEstimate || '5 min',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      missions.unshift(newRecord);
      activatedList.push(newRecord);
    }
  });

  saveStoredMissions(missions);
  return activatedList;
}

export function getPendingMissionsCount(): number {
  const missions = getStoredMissions();
  return missions.filter(m => m.status === 'pending').length;
}

export function getTotalMissionsXP(): number {
  const missions = getStoredMissions();
  return missions
    .filter(m => m.status === 'completed')
    .reduce((acc, curr) => acc + (curr.xp || 30), 0);
}


export function completeDailyMission(recordId: string): { success: boolean; mission?: UserDailyMissionRecord; streakDays: number } {
  const missions = getStoredMissions();
  let found: UserDailyMissionRecord | undefined;

  const updated = missions.map(m => {
    if (m.id === recordId || m.missionId === recordId) {
      found = {
        ...m,
        status: 'completed',
        completedAt: new Date().toISOString()
      };
      return found;
    }
    return m;
  });

  saveStoredMissions(updated);
  const streakDays = recordAppActivity();

  return {
    success: !!found,
    mission: found,
    streakDays
  };
}

import { getFluxStreak, recordAppActivity } from './streakManager';

export function calculateMissionStreak(missions: UserDailyMissionRecord[]): number {
  return getFluxStreak();
}

export function scheduleMission(recordId: string, scheduledTimeStr: string): boolean {
  const missions = getStoredMissions();
  let found = false;
  const updated = missions.map(m => {
    if (m.id === recordId) {
      found = true;
      return { ...m, status: 'scheduled' as const, scheduledTime: scheduledTimeStr };
    }
    return m;
  });
  if (found) saveStoredMissions(updated);
  return found;
}

export function rejectMission(recordId: string): boolean {
  const missions = getStoredMissions();
  let found = false;
  const updated = missions.map(m => {
    if (m.id === recordId) {
      found = true;
      return { ...m, status: 'rejected' as const };
    }
    return m;
  });
  if (found) saveStoredMissions(updated);
  return found;
}

export function failMission(recordId: string): boolean {
  const missions = getStoredMissions();
  let found = false;
  const updated = missions.map(m => {
    if (m.id === recordId) {
      found = true;
      return { ...m, status: 'failed' as const };
    }
    return m;
  });
  if (found) saveStoredMissions(updated);
  return found;
}

export function addSingleMissionFromGuide(targetMission: GuideDailyMission, guide: GuideItem): UserDailyMissionRecord {
  const missions = getStoredMissions();
  const existing = missions.find(m => m.missionId === targetMission.id && m.guideId === guide.id && m.status === 'pending');
  if (existing) {
    return existing;
  }
  const newRecord: UserDailyMissionRecord = {
    id: `mission-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    missionId: targetMission.id,
    guideId: guide.id,
    guideTitle: guide.title,
    title: targetMission.title,
    description: targetMission.description,
    category: guide.category,
    xp: targetMission.xp || 30,
    timeEstimate: targetMission.timeEstimate || '5 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  missions.unshift(newRecord);
  saveStoredMissions(missions);
  return newRecord;
}

export function addCustomMission(title: string, description: string, guideId: string, guideTitle: string, category: string): UserDailyMissionRecord {
  const missions = getStoredMissions();
  const newRecord: UserDailyMissionRecord = {
    id: `custom-mission-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    missionId: `custom-${Date.now()}`,
    guideId,
    guideTitle,
    title,
    description,
    category,
    xp: 50,
    timeEstimate: '10 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  missions.unshift(newRecord);
  saveStoredMissions(missions);
  return newRecord;
}
