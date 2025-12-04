# 📚 Quick Method for Adding Problems

This document explains how to quickly add new problems to your Informatics Club website.

## 🚀 Method 1: Using the Python Script (Recommended)

### Steps:

1. **Navigate to the dashboard folder:**
   ```bash
   cd /Users/philip/Desktop/Scotch\ Info\ Club/dashboard
   ```

2. **Run the problem creator script:**
   ```bash
   python3 add_problem.py
   ```

3. **Follow the prompts:**
   - Enter Problem ID (e.g., `w3p1` for Week 3 Problem 1, or `c1p1` for Challenge 1 Problem 1)
   - Enter title
   - Choose difficulty (1=easy, 2=medium, 3=hard)
   - Enter points
   - Type problem description (type `END` on a new line when done)
   - Enter sample input and output
   - **Choose test case type:**
     - **Option 1 (Inline):** Type input/output directly (good for small tests)
     - **Option 2 (File-based):** Upload or reference test case files (good for large inputs)
   - Add test cases (type `DONE` when finished)
   - Optionally add hints

4. **Done!** The problem is automatically added to `problems/problems.json`

### Example:
```
Problem ID: w3p1
Problem Title: Fizz Buzz
Difficulty: 1 (easy)
Points: 20
Description:
Write a program that prints numbers 1 to n.
For multiples of 3, print "Fizz" instead.
For multiples of 5, print "Buzz" instead.
For multiples of both, print "FizzBuzz".
END
Sample Input: 15
Sample Output: 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
```

## 📝 Method 2: Manual JSON Editing

### For Small Test Cases (Inline):

1. **Open the problems file:**
   ```bash
   code dashboard/problems/problems.json
   ```

2. **Add a new problem object to the `problems` array:**
   ```json
   {
     "id": "w3p1",
     "title": "Fizz Buzz",
     "difficulty": "easy",
     "points": 20,
     "description": "Write a program that prints numbers 1 to n...",
     "sampleInput": "15",
     "sampleOutput": "1 2 Fizz 4 Buzz...",
     "testCases": [
       {
         "input": "15",
         "expectedOutput": "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"
       },
       {
         "input": "5",
         "expectedOutput": "1 2 Fizz 4 Buzz"
       }
     ],
     "hints": [
       "Use the modulo operator (%) to check divisibility",
       "Check for both 3 and 5 first before checking individually"
     ]
   }
   ```

3. **Save the file** (Cmd+S)

### For Large Test Cases (File-based):

1. **Create test case directory:**
   ```bash
   mkdir -p dashboard/problems/testcases/w3p2
   ```

2. **Create your test files:**
   ```bash
   # Create input file
   echo "100000" > dashboard/problems/testcases/w3p2/input1.txt
   # Add more input data...
   
   # Create output file
   echo "5000050000" > dashboard/problems/testcases/w3p2/output1.txt
   ```

3. **Add problem to `problems.json`:**
   ```json
   {
     "id": "w3p2",
     "title": "Large Sum",
     "difficulty": "medium",
     "points": 30,
     "description": "Calculate sum of large array...",
     "sampleInput": "3\n1\n2\n3",
     "sampleOutput": "6",
     "testCases": [
       {
         "input": "3\n1\n2\n3",
         "expectedOutput": "6"
       }
     ],
     "testCaseFiles": [
       {
         "inputFile": "problems/testcases/w3p2/input1.txt",
         "outputFile": "problems/testcases/w3p2/output1.txt",
         "name": "Large Test (100k numbers)"
       }
     ]
   }
   ```

4. **Save the file** (Cmd+S)

## 🔗 Linking Problems to Your Pages

### From Content Page (Weekly Problems):

Edit `dashboard/index.html` and update the week card's onclick:

```html
<div class="week-card" onclick="window.location.href='problem.html?id=w1p1'">
```

### From Challenge Page:

Edit `dashboard/challenge.html` and update the challenge button:

```html
<button class="challenge-button" onclick="window.location.href='problem.html?id=c1p1'">Start Challenge</button>
```

## 📋 Problem Data Structure

Each problem should have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier (e.g., "w1p1", "c1p2") |
| `title` | string | ✅ Yes | Problem title |
| `difficulty` | string | ✅ Yes | "easy", "medium", or "hard" |
| `points` | number | ✅ Yes | Point value (10-100) |
| `description` | string | ✅ Yes | Problem statement with input/output format |
| `sampleInput` | string | ✅ Yes | Example input (use `\n` for newlines, empty string if none) |
| `sampleOutput` | string | ✅ Yes | Expected output for sample input |
| `testCases` | array | ❌ No* | Array of inline test case objects (see below) |
| `testCaseFiles` | array | ❌ No* | Array of file-based test cases (see below) |
| `week` | number | ❌ No | Optional week number for organization |

*Note: Either `testCases` OR `testCaseFiles` (or both) must be provided.

### Inline Test Case Structure:

```json
{
  "input": "5\n3",
  "expectedOutput": "8"
}
```

### File-based Test Case Structure:

```json
{
  "inputFile": "problems/testcases/w1p3/input1.txt",
  "outputFile": "problems/testcases/w1p3/output1.txt",
  "name": "Large Test (10000 numbers)"
}
```

## ✨ Markdown & LaTeX Support

Problem descriptions now support **Markdown** and **LaTeX math**!

### Markdown Features:

```markdown
## Headings
Use ## for sections like "Input Format" or "Constraints"

**Bold text** for emphasis
*Italic text* for variables

- Bullet lists
- For multiple items

1. Numbered lists
2. For steps

`inline code` for variables or short code

> Blockquotes for important notes
```

### LaTeX Math:

```markdown
Inline math: $n \leq 10^6$
Display math: $$\sum_{i=1}^{n} a_i$$

Common symbols:
- Less than or equal: $\leq$ or $\le$
- Greater than or equal: $\geq$ or $\ge$
- Summation: $\sum_{i=1}^{n}$
- Product: $\prod_{i=1}^{n}$
- Fractions: $\frac{a}{b}$
- Square root: $\sqrt{n}$
- Exponents: $2^n$, $10^{-9}$
```

### Example Problem Description:

```markdown
Calculate the sum of an array.

## Input Format
- First line: $N$ (number of integers, $1 \leq N \leq 10^6$)
- Next $N$ lines: one integer $a_i$ where $-10^9 \leq a_i \leq 10^9$

## Output Format
A single integer representing $\sum_{i=1}^{N} a_i$

## Constraints
- Time limit: 1 second
- Memory limit: 256 MB
- $1 \leq N \leq 10^6$

**Note:** Use efficient algorithms for large $N$.
```

## 🎯 Best Practices

### 1. **Problem IDs:**
   - Weekly problems: `w1p1`, `w1p2`, `w2p1`, etc.
   - Challenge problems: `c1p1`, `c1p2`, `c2p1`, etc.
   - Keep them unique and organized!

### 2. **Test Cases:**
   - Include at least 3-5 test cases
   - Cover edge cases (empty input, large numbers, negative values, etc.)
   - First test case should match your sample input/output
   - Use `\n` for multi-line inputs

### 3. **Descriptions:**
   - Be clear and specific about input/output format
   - Include constraints (e.g., "1 ≤ n ≤ 1000")
   - Provide examples if needed

### 4. **When to Use File-based Test Cases:**
   - ✅ Input/output > 1000 characters
   - ✅ Multiple large arrays or data structures
   - ✅ Real AIO-style problems with large datasets
   - ✅ Testing performance with 10k+ elements
   - ❌ Simple problems with small inputs
   - ❌ When you want students to see the test data

## 📁 File Structure

```
dashboard/
├── problems/
│   ├── problems.json          # All problem data
│   └── testcases/             # Test case files (for large inputs)
│       ├── w1p3/
│       │   ├── input1.txt
│       │   ├── output1.txt
│       │   ├── input2.txt
│       │   └── output2.txt
│       └── w2p1/
│           └── ...
├── problem.html               # Problem viewer/solver page
├── problem.js                 # Problem functionality
├── problem-style.css          # Problem page styling
├── add_problem.py             # Quick problem creator script
├── index.html                 # Content page (links to w1p1, w1p2, etc.)
└── challenge.html             # Challenge page (links to c1p1, c1p2, etc.)
```

## 🔍 Testing Your Problems

After adding a problem:

1. **Open the problem page:**
   ```
   http://localhost:8000/dashboard/problem.html?id=YOUR_PROBLEM_ID
   ```
   (Or use GitHub Pages URL)

2. **Check that:**
   - Title, difficulty, and points display correctly
   - Description is formatted properly
   - Sample input/output shows correctly
   - Test cases run and verify correctly

3. **Try solving it:**
   - Write code in the editor
   - Click "Run Tests" to verify test cases
   - Make sure all tests pass with correct solution
   - Verify it fails with incorrect solution

## 🎨 Customization Tips

### Change Point Values:
Edit the `points` field in the JSON. Typical ranges:
- Easy: 10-20 points
- Medium: 25-40 points
- Hard: 50-100 points

### Add Week Numbers:
Include a `"week": 1` field to organize by week.

### Add Topics/Tags:
Add a `"topics": ["arrays", "loops"]` field for categorization (you'd need to modify the display code).

## 🚨 Common Issues

### Problem not showing up?
- Check that `problems.json` has valid JSON syntax
- Verify the problem ID is unique
- Make sure you're using the correct link format: `problem.html?id=YOUR_ID`

### Tests failing incorrectly?
- Check for extra whitespace in expected output
- Use `.strip()` in test comparison (already implemented)
- Verify input format uses `\n` for newlines

### File-based tests not loading?
- Verify file paths are relative to the `dashboard/` folder
- Check that input/output files exist at the specified paths
- Make sure files are committed to git if using GitHub Pages
- Check browser console for 404 errors

### Pyodide not loading?
- Wait 5-10 seconds for first load (6-8MB download)
- Check browser console for errors
- Clear cache and reload

## 💡 Quick Reference

**Add a new problem:**
```bash
cd dashboard && python3 add_problem.py
```

**Link to a problem:**
```html
problem.html?id=w3p1
```

**Test a problem:**
Open the problem page and click "Run Tests"

---

**Need help?** Check the example problems in `problems.json` or ask Philip! 🚀
