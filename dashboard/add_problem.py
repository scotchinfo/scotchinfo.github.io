# Quick Problem Creator for Scotch Informatics Club
# Run this script to easily add new problems

import json
import os

def create_problem():
    print("\n=== Quick Problem Creator ===\n")
    
    # Get problem details
    problem_id = input("Problem ID (e.g., w2p1, c1p3): ").strip()
    title = input("Problem Title: ").strip()
    
    print("\nDifficulty:")
    print("1. easy")
    print("2. medium")
    print("3. hard")
    difficulty = ["easy", "medium", "hard"][int(input("Choose (1-3): ")) - 1]
    
    points = int(input("Points (e.g., 10, 15, 20): "))
    
    print("\nProblem Description (type 'END' on a new line when done):")
    print("Tip: Use Markdown and LaTeX! ($x^2$, ## Heading, **bold**, etc.)")
    description_lines = []
    while True:
        line = input()
        if line == "END":
            break
        description_lines.append(line)
    description = "\n".join(description_lines)
    
    sample_input = input("\nSample Input (or press Enter for no input): ").strip()
    sample_output = input("Sample Output: ").strip()
    
    # Get test cases (file-based only)
    print("\n--- File-Based Test Cases ---")
    testcase_dir = f"problems/testcases/{problem_id}"
    os.makedirs(testcase_dir, exist_ok=True)
    print(f"✓ Created directory: {testcase_dir}")
    
    # Ask for number of test cases
    num_tests = int(input("\nHow many test cases? "))
    
    # Automatically generate test case file references
    test_case_files = []
    for i in range(1, num_tests + 1):
        test_case_files.append({
            "inputFile": f"{testcase_dir}/input{i}.txt",
            "outputFile": f"{testcase_dir}/output{i}.txt",
            "name": f"Test Case {i}"
        })
    
    print(f"\n✓ Generated {num_tests} test case reference(s)")
    print(f"\n📁 Now create these files in: {testcase_dir}/")
    for i in range(1, num_tests + 1):
        print(f"   - input{i}.txt")
        print(f"   - output{i}.txt")
    
    # Create problem object
    problem = {
        "id": problem_id,
        "title": title,
        "difficulty": difficulty,
        "points": points,
        "description": description,
        "sampleInput": sample_input,
        "sampleOutput": sample_output
    }
    
    if test_case_files:
        problem["testCaseFiles"] = test_case_files
    
    # Load existing problems
    problems_file = "problems/problems.json"
    if os.path.exists(problems_file):
        with open(problems_file, 'r') as f:
            data = json.load(f)
    else:
        data = {"problems": []}
    
    # Add new problem
    data["problems"].append(problem)
    
    # Save
    with open(problems_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✅ Problem '{title}' added successfully!")
    print(f"📝 Problem ID: {problem_id}")
    print(f"📁 Test case directory: {testcase_dir}/")
    print(f"🔗 View at: problem.html?id={problem_id}")

if __name__ == "__main__":
    create_problem()
