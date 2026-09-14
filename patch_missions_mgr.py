import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    new_funcs = """export function addSingleMissionFromGuide(targetMission: GuideDailyMission, guide: GuideItem): UserDailyMissionRecord {
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
"""
    if "addSingleMissionFromGuide" not in content:
        content += "\n" + new_funcs

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/utils/missionsManager.ts')
