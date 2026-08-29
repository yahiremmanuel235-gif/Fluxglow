import { UserDailyMissionRecord, GuideItem } from '../types';

const MISSIONS_STORAGE_KEY = 'fluxglow_daily_missions';
const STREAK_STORAGE_KEY = 'fluxglow_missions_streak';

export const INITIAL_SEED_MISSIONS: UserDailyMissionRecord[] = [
  {
    id: 'mission-rec-1-seed',
    missionId: 'mission-stress-1',
    guideId: 'guide-stress-1',
    guideTitle: '5 estrategias infalibles para regular el estrés antes de que te controle',
    title: 'Práctica del Suspiro Fisiológico',
    description: 'Realiza 3 ciclos de doble inhalación nasal y exhalación lenta al mediodía para reiniciar tu ritmo cardíaco.',
    category: 'Estrés',
    xp: 30,
    timeEstimate: '3 min',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mission-rec-2-seed',
    missionId: 'mission-anxiety-1',
    guideId: 'guide-anxiety-2',
    guideTitle: 'Cómo transformar la ansiedad en tu mayor motor de enfoque y acción',
    title: 'Anclaje Sensorial 5-4-3-2-1',
    description: 'Detente en tu próxima pausa y nombra en voz baja 5 objetos, 4 texturas, 3 sonidos, 2 olores y 1 sabor.',
    category: 'Ansiedad',
    xp: 35,
    timeEstimate: '4 min',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export function getStoredMissions(): UserDailyMissionRecord[] {
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading missions from localStorage:', e);
  }
  // Initialize with initial seed missions
  saveStoredMissions(INITIAL_SEED_MISSIONS);
  return INITIAL_SEED_MISSIONS;
}

export function saveStoredMissions(missions: UserDailyMissionRecord[]): void {
  try {
    localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions));
    window.dispatchEvent(new CustomEvent('fluxglow_missions_updated', { detail: missions }));
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
  const completedMissions = missions.filter(m => m.status === 'completed' && m.completedAt);
  if (completedMissions.length === 0) return 0;

  // Group completed dates (YYYY-MM-DD)
  const daysSet = new Set(
    completedMissions.map(m => new Date(m.completedAt!).toISOString().split('T')[0])
  );

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

  // Cap with base mock streak for engaging demonstration (minimum 3 days if active)
  return Math.max(streak, completedMissions.length > 0 ? 3 : 0);
}
