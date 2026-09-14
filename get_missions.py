import sys
with open(sys.argv[1], 'r') as f:
    lines = f.readlines()
for i in range(500, 650):
    if i < len(lines): print(lines[i], end='')
