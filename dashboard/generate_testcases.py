#!/usr/bin/env python3
"""
Test Case Generator for Scotch Informatics Club

This script helps you generate large test case files programmatically.
Useful for problems that need performance testing with large inputs.
"""

import os
import random

def generate_array_sum():
    """Generate test case for array sum problem"""
    n = int(input("How many numbers? "))
    problem_id = input("Problem ID (e.g., w2p1): ")
    
    # Create directory
    testcase_dir = f"problems/testcases/{problem_id}"
    os.makedirs(testcase_dir, exist_ok=True)
    
    # Generate numbers
    numbers = [random.randint(1, 1000) for _ in range(n)]
    total = sum(numbers)
    
    # Write input file
    input_num = len([f for f in os.listdir(testcase_dir) if f.startswith('input')]) + 1
    with open(f"{testcase_dir}/input{input_num}.txt", 'w') as f:
        f.write(f"{n}\n")
        for num in numbers:
            f.write(f"{num}\n")
    
    # Write output file
    with open(f"{testcase_dir}/output{input_num}.txt", 'w') as f:
        f.write(f"{total}\n")
    
    print(f"✅ Generated test case: {n} numbers, sum = {total}")
    print(f"📁 Files: {testcase_dir}/input{input_num}.txt, output{input_num}.txt")

def generate_sorting():
    """Generate test case for sorting problem"""
    n = int(input("How many numbers to sort? "))
    problem_id = input("Problem ID (e.g., w3p1): ")
    
    # Create directory
    testcase_dir = f"problems/testcases/{problem_id}"
    os.makedirs(testcase_dir, exist_ok=True)
    
    # Generate random numbers
    numbers = [random.randint(-1000, 1000) for _ in range(n)]
    sorted_numbers = sorted(numbers)
    
    # Write input file
    input_num = len([f for f in os.listdir(testcase_dir) if f.startswith('input')]) + 1
    with open(f"{testcase_dir}/input{input_num}.txt", 'w') as f:
        f.write(f"{n}\n")
        for num in numbers:
            f.write(f"{num}\n")
    
    # Write output file
    with open(f"{testcase_dir}/output{input_num}.txt", 'w') as f:
        for num in sorted_numbers:
            f.write(f"{num}\n")
    
    print(f"✅ Generated sorting test case: {n} numbers")
    print(f"📁 Files: {testcase_dir}/input{input_num}.txt, output{input_num}.txt")

def generate_fibonacci():
    """Generate test case for fibonacci problem"""
    n = int(input("Calculate Fibonacci up to which number? "))
    problem_id = input("Problem ID (e.g., w2p3): ")
    
    # Create directory
    testcase_dir = f"problems/testcases/{problem_id}"
    os.makedirs(testcase_dir, exist_ok=True)
    
    # Calculate fibonacci
    if n <= 0:
        fib = 0
    elif n == 1:
        fib = 1
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        fib = b
    
    # Write files
    input_num = len([f for f in os.listdir(testcase_dir) if f.startswith('input')]) + 1
    with open(f"{testcase_dir}/input{input_num}.txt", 'w') as f:
        f.write(f"{n}\n")
    
    with open(f"{testcase_dir}/output{input_num}.txt", 'w') as f:
        f.write(f"{fib}\n")
    
    print(f"✅ Generated fibonacci test case: n={n}, fib={fib}")
    print(f"📁 Files: {testcase_dir}/input{input_num}.txt, output{input_num}.txt")

def generate_string_pattern():
    """Generate test case for string matching/pattern problems"""
    text_length = int(input("Length of text string? "))
    pattern_length = int(input("Length of pattern to find? "))
    problem_id = input("Problem ID (e.g., w4p1): ")
    
    # Create directory
    testcase_dir = f"problems/testcases/{problem_id}"
    os.makedirs(testcase_dir, exist_ok=True)
    
    # Generate random strings
    chars = 'abcdefghijklmnopqrstuvwxyz'
    pattern = ''.join(random.choice(chars) for _ in range(pattern_length))
    
    # Insert pattern at random position in text
    position = random.randint(0, text_length - pattern_length)
    text = (''.join(random.choice(chars) for _ in range(position)) + 
            pattern + 
            ''.join(random.choice(chars) for _ in range(text_length - position - pattern_length)))
    
    # Write files
    input_num = len([f for f in os.listdir(testcase_dir) if f.startswith('input')]) + 1
    with open(f"{testcase_dir}/input{input_num}.txt", 'w') as f:
        f.write(f"{text}\n{pattern}\n")
    
    with open(f"{testcase_dir}/output{input_num}.txt", 'w') as f:
        f.write(f"{position}\n")
    
    print(f"✅ Generated string matching test case")
    print(f"📁 Files: {testcase_dir}/input{input_num}.txt, output{input_num}.txt")

def generate_custom():
    """Let user write custom generator code"""
    print("\n⚠️  Custom generator - You'll need to write the logic yourself")
    problem_id = input("Problem ID (e.g., w5p1): ")
    
    # Create directory
    testcase_dir = f"problems/testcases/{problem_id}"
    os.makedirs(testcase_dir, exist_ok=True)
    
    print(f"\nDirectory created: {testcase_dir}")
    print("Now manually create your test files:")
    print(f"  - {testcase_dir}/input1.txt")
    print(f"  - {testcase_dir}/output1.txt")
    print("\nOr use Python to generate them programmatically!")

def main():
    print("═══════════════════════════════════════")
    print("   Test Case Generator")
    print("   Scotch Informatics Club")
    print("═══════════════════════════════════════\n")
    
    print("Choose test case type:")
    print("1. Array Sum (sum of N numbers)")
    print("2. Sorting (sort N numbers)")
    print("3. Fibonacci (calculate nth fibonacci)")
    print("4. String Pattern (find pattern in text)")
    print("5. Custom (create directory only)")
    
    choice = input("\nChoice (1-5): ").strip()
    print()
    
    generators = {
        '1': generate_array_sum,
        '2': generate_sorting,
        '3': generate_fibonacci,
        '4': generate_string_pattern,
        '5': generate_custom
    }
    
    if choice in generators:
        generators[choice]()
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()
