import sys
with open(sys.argv[1], 'r') as f:
    lines = f.readlines()
for i in range(250, min(500, len(lines))):
    print(lines[i], end='')
