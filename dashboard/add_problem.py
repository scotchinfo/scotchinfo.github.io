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
    description_lines = []
    while True:
        line = input()
        if line == "END":
            break
        description_lines.append(line)
    description = "\n".join(description_lines)
    
    sample_input = input("\nSample Input (or press Enter for no input): ").strip()
    sample_output = input("Sample Output: ").strip()
    
    # Get test cases
    print("\n--- Test Cases ---")
    print("Choose test case type:")
    print("1. Inline (type input/output directly)")
    print("2. File-based (for large test cases)")
    test_type = input("Choose (1-2): ").strip()
    
    test_cases = []
    test_case_files = []
    
    if test_type == "1":
        # Inline test cases
        while True:
            print(f"\nInline Test Case {len(test_cases) + 1}:")
            test_input = input("Input (or type 'DONE' to finish): ")
            if test_input == "DONE":
                break
            test_output = input("Expected Output: ")
            test_cases.append({
                "input": test_input,
                "expectedOutput": test_output
            })
    else:
        # File-based test cases
        testcase_dir = f"problems/testcases/{problem_id}"
        os.makedirs(testcase_dir, exist_ok=True)
        print(f"\nCreated directory: {testcase_dir}")
        
        while True:
            print(f"\nFile-based Test Case {len(test_case_files) + 1}:")
            test_name = input("Test name (or type 'DONE' to finish): ")
            if test_name == "DONE":
                break
            
            input_file_path = input("Path to input file (or type content): ").strip()
            output_file_path = input("Path to output file (or type content): ").strip()
            
            # Save input
            input_filename = f"input{len(test_case_files) + 1}.txt"
            if os.path.exists(input_file_path):
                with open(input_file_path, 'r') as f:
                    input_content = f.read()
            else:
                input_content = input_file_path
            
            with open(f"{testcase_dir}/{input_filename}", 'w') as f:
                f.write(input_content)
            
            # Save output
            output_filename = f"output{len(test_case_files) + 1}.txt"
            if os.path.exists(output_file_path):
                with open(output_file_path, 'r') as f:
                    output_content = f.read()
            else:
                output_content = output_file_path
            
            with open(f"{testcase_dir}/{output_filename}", 'w') as f:
                f.write(output_content)
            
            test_case_files.append({
                "inputFile": f"{testcase_dir}/{input_filename}",
                "outputFile": f"{testcase_dir}/{output_filename}",
                "name": test_name
            })
            
            print(f"✓ Saved test case files: {input_filename}, {output_filename}")
    

    
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
    
    if test_cases:
        problem["testCases"] = test_cases
    
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
    print(f"🔗 Link: problem.html?id={problem_id}")

if __name__ == "__main__":
    create_problem()
