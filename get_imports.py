import sys
with open(sys.argv[1], 'r') as f:
    for i in range(150):
        print(f.readline(), end='')
