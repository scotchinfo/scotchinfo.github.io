n = int(input().strip())

seq = []
while True:
    seq.append(n)
    if n == 1:
        break
    if n % 2 == 0:
        n //= 2
    else:
        n = 3 * n + 1

print(" ".join(map(str, seq)))
