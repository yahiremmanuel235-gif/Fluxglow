import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    old_import = "import { UserDailyMissionRecord, GuideItem } from '../types';"
    new_import = "import { UserDailyMissionRecord, GuideItem, GuideDailyMission } from '../types';"
    content = content.replace(old_import, new_import)

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/utils/missionsManager.ts')
