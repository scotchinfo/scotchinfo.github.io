x, y = map(int, input().split())

sum = 0
for i in range(x, y+1):
    sum += i
print(sum)