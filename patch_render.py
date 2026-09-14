import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Filter out rejected missions in filteredMissions
    old_filtered = """  // Filtered list
  const filteredMissions = useMemo(() => {
    return missions.filter(item => {"""
    new_filtered = """  // Filtered list
  const filteredMissions = useMemo(() => {
    return missions.filter(item => {
      if (rejected.includes(item.id) || rejected.includes(item.missionId)) return false;"""
    content = content.replace(old_filtered, new_filtered)

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/MissionsModule.tsx')
