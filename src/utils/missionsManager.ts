import { UserDailyMissionRecord, GuideItem } from '../types';

const MISSIONS_STORAGE_KEY = 'fluxglow_daily_missions';
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
  const streakDays = calculateMissionStreak(updated);

  return {
    success: !!found,
    mission: found,
    streakDays
  };
}

export function calculateMissionStreak(missions: UserDailyMissionRecord[]): number {
  if (!Array.isArray(missions)) return 0;
  const completedMissions = missions.filter(m => m && m.status === 'completed' && m.completedAt);
  if (completedMissions.length === 0) return 0;

  // Group valid completed dates (YYYY-MM-DD)
  const validDates: string[] = [];
  completedMissions.forEach(m => {
    try {
      if (m.completedAt) {
        const d = new Date(m.completedAt);
        if (!isNaN(d.getTime())) {
          validDates.push(d.toISOString().split('T')[0]);
        }
      }
    } catch {
      // ignore invalid dates safely
    }
  });

  if (validDates.length === 0) return 0;

  const daysSet = new Set(validDates);
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  let streak = 0;
  let checkDate = new Date();

  // If completed today or yesterday, count backwards
  if (daysSet.has(todayStr)) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (daysSet.has(yesterdayStr)) {
    streak = 1;
    checkDate = yesterdayDate;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    return 0;
  }

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (daysSet.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
