# Updated add_problem.py Script

## Changes Made

### What Changed
The script now **automatically generates test case file references** instead of asking if you want to add them.

### Old Workflow
1. "Do you want to add test case file references now? (y/n)"
2. If yes, manually add each test case one by one
3. Type "DONE" when finished

### New Workflow
1. "How many test cases? **3**"
2. Automatically generates:
   - Test Case 1
   - Test Case 2
   - Test Case 3
3. Done! No need to enter names

## Example Usage

### Running the Script
```bash
cd dashboard
python3 add_problem.py
```

### Sample Session
```
=== Quick Problem Creator ===

Problem ID (e.g., w2p1, c1p3): w1p4
Problem Title: Sum of Two Numbers

Difficulty:
1. easy
2. medium
3. hard
Choose (1-3): 1

Points (e.g., 10, 15, 20): 5

Problem Description (type 'END' on a new line when done):
Read two integers and output their sum.
END

Sample Input (or press Enter for no input): 5 10
Sample Output: 15

--- File-Based Test Cases ---
✓ Created directory: problems/testcases/w1p4

How many test cases? 3

✓ Generated 3 test case reference(s)

📁 Now create these files in: problems/testcases/w1p4/
   - input1.txt
   - output1.txt
   - input2.txt
   - output2.txt
   - input3.txt
   - output3.txt

✅ Problem 'Sum of Two Numbers' added successfully!
📝 Problem ID: w1p4
📁 Test case directory: problems/testcases/w1p4/
🔗 View at: problem.html?id=w1p4
```

## Generated JSON Format

The script will add this to `problems.json`:

```json
{
  "problems": [
    {
      "id": "w1p4",
      "title": "Sum of Two Numbers",
      "difficulty": "easy",
      "points": 5,
      "description": "Read two integers and output their sum.",
      "sampleInput": "5 10",
      "sampleOutput": "15",
      "testCaseFiles": [
        {
          "inputFile": "problems/testcases/w1p4/input1.txt",
          "outputFile": "problems/testcases/w1p4/output1.txt",
          "name": "Test Case 1"
        },
        {
          "inputFile": "problems/testcases/w1p4/input2.txt",
          "outputFile": "problems/testcases/w1p4/output2.txt",
          "name": "Test Case 2"
        },
        {
          "inputFile": "problems/testcases/w1p4/input3.txt",
          "outputFile": "problems/testcases/w1p4/output3.txt",
          "name": "Test Case 3"
        }
      ]
    }
  ]
}
```

## File Structure Created

```
problems/
  testcases/
    w1p4/
      input1.txt    ← You create this
      output1.txt   ← You create this
      input2.txt    ← You create this
      output2.txt   ← You create this
      input3.txt    ← You create this
      output3.txt   ← You create this
  problems.json     ← Script updates this automatically
```

## Next Steps After Running Script

1. **Navigate to the test case directory:**
   ```bash
   cd problems/testcases/w1p4
   ```

2. **Create the input/output files:**
   ```bash
   # Test 1: Basic Test
   echo "5 10" > input1.txt
   echo "15" > output1.txt
   
   # Test 2: Zero Input
   echo "0 0" > input2.txt
   echo "0" > output2.txt
   
   # Test 3: Large Numbers
   echo "1000000 999999" > input3.txt
   echo "1999999" > output3.txt
   ```

3. **Test the problem:**
   - Go to `problem.html?id=w1p4`
   - Write your solution
   - Click "Run Tests"

## Benefits

✅ **Faster** - No need to enter names for each test case
✅ **Cleaner** - All test cases use consistent naming (Test Case 1, Test Case 2, etc.)
✅ **Predictable** - Always follows the same pattern
✅ **Automatic** - References are generated without any manual input

## Edge Cases

### Zero Test Cases
If you enter `0` for number of test cases:
- No `testCaseFiles` array is added to the problem
- Problem still gets created successfully
- You can manually add test cases later

### Large Number of Test Cases
If you enter `10` test cases:
- Script generates: input1.txt through input10.txt
- Script generates: output1.txt through output10.txt
- All references automatically added to problems.json

## Comparison

### Old Format (if you said "no")
```json
{
  "id": "w1p4",
  "title": "Sum of Two Numbers",
  "testCaseFiles": []  // Empty, had to add manually later
}
```

### New Format (always complete)
```json
{
  "id": "w1p4",
  "title": "Sum of Two Numbers",
  "testCaseFiles": [
    {
      "inputFile": "problems/testcases/w1p4/input1.txt",
      "outputFile": "problems/testcases/w1p4/output1.txt",
      "name": "Basic Test"
    }
    // ... more test cases
  ]
}
```

## Tips

1. **Plan ahead** - Decide how many test cases you need before running
2. **Standard naming** - Test cases are automatically named "Test Case 1", "Test Case 2", etc.
3. **Create files immediately** - Make the test files right after running the script
4. **Test locally** - Run `python3 -m http.server 8009` and test your problem

## Summary

The updated `add_problem.py` script:
- ✅ Asks "How many test cases?"
- ✅ Automatically generates references for input1.txt, output1.txt, input2.txt, output2.txt, etc.
- ✅ Asks for descriptive names for each test case
- ✅ No more "Do you want to add..." confirmation
- ✅ Cleaner, faster workflow
