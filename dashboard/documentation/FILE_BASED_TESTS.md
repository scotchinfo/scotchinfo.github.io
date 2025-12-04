# 📦 File-Based Test Cases - Quick Guide

## ✅ Yes! You can upload files for larger test cases!

The system now supports **both inline and file-based test cases**. This is perfect for:
- Large inputs (10,000+ lines)
- Performance testing
- Real AIO-style competition problems
- Binary/non-text data

---

## 🚀 Quick Start

### Option 1: Use the Test Case Generator
```bash
cd dashboard
python3 generate_testcases.py
```

Choose from:
1. **Array Sum** - Generate N random numbers
2. **Sorting** - Generate N numbers to sort
3. **Fibonacci** - Calculate large fibonacci numbers
4. **String Pattern** - Generate text and pattern matching
5. **Custom** - Create your own

### Option 2: Manual File Creation

1. **Create directory structure:**
```bash
mkdir -p dashboard/problems/testcases/w2p1
```

2. **Create test files:**
```bash
# Input file
echo "10000" > dashboard/problems/testcases/w2p1/input1.txt
# Add more data...

# Output file  
echo "50005000" > dashboard/problems/testcases/w2p1/output1.txt
```

3. **Add to problems.json:**
```json
{
  "id": "w2p1",
  "title": "Large Array Sum",
  "testCaseFiles": [
    {
      "inputFile": "problems/testcases/w2p1/input1.txt",
      "outputFile": "problems/testcases/w2p1/output1.txt",
      "name": "Large Test (10000 numbers)"
    }
  ]
}
```

---

## 📋 Example: Problem with File-based Tests

```json
{
  "id": "w1p3",
  "title": "Large Array Sum",
  "difficulty": "medium",
  "points": 25,
  "description": "Calculate the sum of a large array...",
  "sampleInput": "3\n100\n200\n300",
  "sampleOutput": "600",
  "testCases": [
    {
      "input": "3\n100\n200\n300",
      "expectedOutput": "600"
    }
  ],
  "testCaseFiles": [
    {
      "inputFile": "problems/testcases/w1p3/input1.txt",
      "outputFile": "problems/testcases/w1p3/output1.txt",
      "name": "Small Test (5 numbers)"
    },
    {
      "inputFile": "problems/testcases/w1p3/input2.txt",
      "outputFile": "problems/testcases/w1p3/output2.txt",
      "name": "Large Test (10000 numbers)"
    }
  ]
}
```

---

## 💡 Key Features

### Automatic File Loading
- System fetches input/output files from your server
- No manual copy-pasting needed
- Works seamlessly with GitHub Pages

### Smart Display
- Large inputs/outputs are truncated in UI
- Shows "(X lines, Y characters)" instead of full content
- Still runs full comparison for correctness

### Combined Tests
- Use both inline AND file-based tests in same problem
- Inline for small examples
- Files for large/performance tests

---

## 📊 Real Example (w1p3)

I've created a working example for you:

**Files created:**
- `problems/testcases/w1p3/input1.txt` - 5 numbers (small test)
- `problems/testcases/w1p3/output1.txt` - Expected: 150
- `problems/testcases/w1p3/input2.txt` - 10,000 numbers (large test)
- `problems/testcases/w1p3/output2.txt` - Expected: 50,005,000

**Test it:**
```
http://your-site.com/dashboard/problem.html?id=w1p3
```

---

## 🎯 When to Use File-Based Tests

### ✅ Use Files When:
- Input/output > 1000 characters
- Testing with 1000+ data points
- Performance is important
- You want to hide test data from students
- Real competition-style problems

### ❌ Use Inline When:
- Simple, small inputs
- Students should see test data
- Quick testing during development
- Input < 100 characters

---

## 🔧 File Structure

```
dashboard/
└── problems/
    ├── problems.json
    └── testcases/
        ├── w1p3/
        │   ├── input1.txt
        │   ├── output1.txt
        │   ├── input2.txt
        │   └── output2.txt
        ├── w2p1/
        │   └── ...
        └── c1p1/
            └── ...
```

---

## 🎨 Best Practices

1. **Name files sequentially:** `input1.txt`, `input2.txt`, etc.
2. **Use descriptive test names:** "Large Test (10k elements)" not "Test 2"
3. **Include both small and large tests**
4. **One test case per file pair**
5. **Commit files to git** (required for GitHub Pages)

---

## 🚨 Troubleshooting

### Files not loading?
```bash
# Check files exist
ls dashboard/problems/testcases/w1p3/

# Verify paths in problems.json are correct
# Path should be relative to dashboard/

# Commit to git
git add dashboard/problems/testcases/
git commit -m "Add test case files"
git push
```

### Tests failing?
- Remove trailing newlines from output files
- Check for extra spaces
- Verify encoding (should be UTF-8)

---

## 📚 Full Documentation

See `HOW_TO_ADD_PROBLEMS.md` for complete guide!

---

**Ready to use!** 🎉

Try the example problem (w1p3) or generate your own test cases with `generate_testcases.py`!
