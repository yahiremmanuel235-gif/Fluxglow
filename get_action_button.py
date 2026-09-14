import sys
with open(sys.argv[1], 'r') as f:
    lines = f.readlines()
for i in range(len(lines)):
    if "{/* Right: Action Button */}" in lines[i]:
        for j in range(i, i+50):
            print(lines[j], end='')
            if "</div>" in lines[j] and "</div>" in lines[j-1] and "</div>" in lines[j-2]:
                break
        break
