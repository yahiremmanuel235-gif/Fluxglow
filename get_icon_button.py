import sys
with open(sys.argv[1], 'r') as f:
    lines = f.readlines()
for i in range(len(lines)):
    if "className={`w-10 h-10 rounded-xl flex items-center" in lines[i]:
        for j in range(i-5, i+20):
            print(lines[j], end='')
        break
