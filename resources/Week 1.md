# Week 1 - Basics of Python

## Printing

In Python we can output a "string" through `print("this is my string")`

## Inputting

Similarly, we can get input with `x = input()`

To convert x to an integer, we can simply use `x = int(input())` instead

## Fancy input

The `input()` command reads everything in one line, so if we have several numbers it will not work.

If we want to read 4 integers, we can do `a, b, c, d = map(int, input().split())`

## If statements

We can run some statements only when a condition is true
```py
if x > y:
    print("x is bigger")
```

## Basic looping

We can use `for` loops in python to run code for a set amount of times.

If we want to run a certain command exactly `x` times, we can do

```py
for i in range(x):
    # Do something here
    print(i)
```

Note that in Python it loops from `0, 1, 2, ... x-1`