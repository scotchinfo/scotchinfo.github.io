# Custom Input Feature Guide

## Overview
Added a "Custom Input" tab to the IDE on problem pages, allowing users to provide custom input that will be piped to their Python code when running.

## What Was Added

### New Tab in IDE
The IDE now has 3 tabs:
1. **Code** - Write your Python code
2. **Custom Input** - Enter custom input for testing
3. **Test Results** - View test case results

### How It Works

**For Students:**
1. Click the "Custom Input" tab
2. Enter input values, one per line
3. Switch back to "Code" tab
4. Click "Run Code"
5. The program will read from the custom input using `input()` calls

**Example:**
```
Custom Input:
5
10
Alice

Code:
num1 = int(input())
num2 = int(input())
name = input()
print(f"{name}, the sum is {num1 + num2}")

Output:
Alice, the sum is 15
```

## Technical Implementation

### HTML Changes (`problem.html`)
- Added "Custom Input" tab button
- Added `inputTab` content section with:
  - `customInput` textarea for entering input
  - Helper text explaining how to use it
  - Clear button to reset input

### CSS Changes (`problem-style.css`)
- `.custom-input-section` - Container styling
- `.custom-input-editor` - Textarea with monospace font
- `.input-helper` - Info box with blue background
- Focus states and styling

### JavaScript Changes (`problem.js`)

1. **Updated `switchTab()` function**
   - Now handles 3 tabs: code, input, test
   - Tab indices updated (input is now tab 1)

2. **Updated `runCode()` function**
   - Reads value from `customInput` textarea
   - Splits input by newlines into array
   - Overrides Python's `input()` function to read from array
   - Each `input()` call gets the next line
   - If input runs out, returns empty string

3. **Added clear input button handler**
   - Clears the custom input textarea

### Python Input Handling
When code runs, this Python setup is injected:
```python
# Set up input lines
__stdin_lines__ = ["5", "10", "Alice"]  # From custom input
__stdin_index__ = 0

# Custom input function
def custom_input(prompt=''):
    global __stdin_index__
    if __stdin_index__ < len(__stdin_lines__):
        line = __stdin_lines__[__stdin_index__]
        __stdin_index__ += 1
        return line
    return ''

# Override built-in input
__builtins__.input = custom_input
```

## User Experience

### Empty Custom Input
- If no custom input is provided, `input()` calls return empty strings
- Code still runs normally

### Multiple Input Calls
```
Custom Input:
Line 1
Line 2
Line 3

Code:
a = input()  # Gets "Line 1"
b = input()  # Gets "Line 2"
c = input()  # Gets "Line 3"
d = input()  # Gets "" (empty, no more input)
```

### Input with Spaces
```
Custom Input:
Hello World
10 20 30

Code:
text = input()        # "Hello World"
numbers = input()     # "10 20 30"
parts = numbers.split()  # ["10", "20", "30"]
```

## Features

✅ **Persistent Across Runs** - Custom input stays when you run code multiple times
✅ **Clear Button** - Quick way to reset input
✅ **Monospace Font** - Easy to read and align input
✅ **Helper Text** - Built-in instructions with example
✅ **Auto-switching** - Stays on Code tab when you run
✅ **No Prompts** - Input lines are consumed silently (no prompt display)

## Testing the Feature

### Test Case 1: Simple Input
```
Custom Input:
42

Code:
x = int(input())
print(f"The answer is {x}")

Expected Output:
The answer is 42
```

### Test Case 2: Multiple Inputs
```
Custom Input:
5
3

Code:
a = int(input())
b = int(input())
print(a + b)

Expected Output:
8
```

### Test Case 3: String Input
```
Custom Input:
Alice
Bob
Charlie

Code:
names = []
for _ in range(3):
    names.append(input())
print(", ".join(names))

Expected Output:
Alice, Bob, Charlie
```

### Test Case 4: Empty Input
```
Custom Input:
(empty)

Code:
name = input()
if not name:
    print("No name provided")
else:
    print(f"Hello, {name}")

Expected Output:
No name provided
```

## Differences from Test Cases

| Feature | Custom Input | Test Cases |
|---------|-------------|-----------|
| **Purpose** | User testing/debugging | Automated grading |
| **Visibility** | User provides | Hidden/predefined |
| **Access** | Editable textarea | Files on server |
| **Result** | Output tab | Test Results tab |
| **Clearing** | Manual (Clear button) | N/A (read-only) |

## Future Enhancements

Possible improvements:
- **Save Input** - Remember custom input per problem in localStorage
- **Input Templates** - Pre-fill with sample input from problem
- **Input/Output Side-by-Side** - Split view showing input and output
- **Line Numbers** - Show line numbers for multi-line input
- **Interactive Input** - Show prompts and type input interactively
- **Input Validation** - Warn if input format doesn't match expected
- **Copy Sample Input** - Button to copy sample input to custom input

## Notes

- Custom input is only used when clicking "Run Code"
- "Run Tests" uses predefined test case inputs (not custom input)
- Input is escaped properly to prevent code injection
- Supports any number of lines (no limit)
- Works with all data types (strings, numbers, etc.)
- Empty lines are preserved and count as empty string input

## Example Problem Use Cases

### 1. Testing Edge Cases
```
Problem: Sum of two numbers

Custom Inputs to Test:
- Normal: 5 and 10
- Zero: 0 and 0
- Negative: -5 and 3
- Large: 1000000 and 999999
```

### 2. Debugging
```
Problem: Process N names

Custom Input:
3
Alice
Bob
Charlie

Use this to debug your loop logic before submitting.
```

### 3. Interactive Testing
```
Problem: Calculator

Custom Input:
5
3
+

Test different operations quickly by changing the last line.
```
