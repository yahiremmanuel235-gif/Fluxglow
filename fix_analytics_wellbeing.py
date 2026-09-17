import re

with open('src/components/modules/AnalyticsModule.tsx', 'r') as f:
    content = f.read()

# import emotionUtils
if "calculateWellbeingScore" not in content:
    content = content.replace("import { useState, useMemo, useEffect } from 'react';", "import { useState, useMemo, useEffect } from 'react';\nimport { calculateWellbeingScore } from '../../utils/emotionUtils';")

regex = re.compile(r"const total = journalEntries\.reduce\(\(acc, e\) => acc \+ \(typeof e\.intensity === 'number' \? e\.intensity : 5\), 0\);")
new_reduce = "const total = journalEntries.reduce((acc, e) => acc + calculateWellbeingScore(e.mood, typeof e.intensity === 'number' ? e.intensity : 5), 0);"
content = regex.sub(new_reduce, content)

with open('src/components/modules/AnalyticsModule.tsx', 'w') as f:
    f.write(content)

