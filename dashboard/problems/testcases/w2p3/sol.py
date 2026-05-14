import sys

data = sys.stdin.read().strip().split()
if not data:
    raise SystemExit(0)

n = int(data[0])
a = list(map(int, data[1:1 + n]))

best = 1
current = 1
for i in range(1, n):
    if a[i] > a[i - 1]:
        current += 1
    else:
        current = 1
    if current > best:
        best = current

print(best)
