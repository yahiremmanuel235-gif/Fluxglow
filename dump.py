import sys
with open(sys.argv[1], 'r') as f:
    lines = f.readlines()
for i in range(800, 830):
    if i < len(lines):
        print(f"{i}: {lines[i]}", end='')
