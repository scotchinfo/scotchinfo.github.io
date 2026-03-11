N = int(input())
m = 0
for i in range(N):
    t = int(input())
    if t > m:
        m = t;
print(m)