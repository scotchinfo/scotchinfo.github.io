# 📝 Markdown & LaTeX Quick Reference

## ✨ Features Added

Your problem descriptions now support:
- ✅ **Markdown** formatting (headings, lists, bold, italic, code)
- ✅ **LaTeX** math expressions (inline and display mode)
- ✅ Clean, professional rendering

---

## 📐 LaTeX Math Syntax

### Inline Math (within text)
Use single `$` signs:
```
The time complexity is $O(n \log n)$ where $n \leq 10^6$.
```
**Renders as:** The time complexity is O(n log n) where n ≤ 10⁶.

### Display Math (centered on its own line)
Use double `$$` signs:
```
$$\sum_{i=1}^{n} a_i = \frac{n(n+1)}{2}$$
```
**Renders as:** (centered equation)

### Common LaTeX Symbols

| Symbol | LaTeX | Example |
|--------|-------|---------|
| ≤ | `\leq` or `\le` | `$n \leq 10^6$` |
| ≥ | `\geq` or `\ge` | `$a_i \geq 0$` |
| × | `\times` | `$O(n \times m)$` |
| ÷ | `\div` | `$a \div b$` |
| ∑ | `\sum` | `$\sum_{i=1}^{n} a_i$` |
| ∏ | `\prod` | `$\prod_{i=1}^{n} a_i$` |
| √ | `\sqrt{x}` | `$\sqrt{n}$` |
| ⁿ | `^n` | `$2^n$`, `$10^{-9}$` |
| ₙ | `_n` | `$a_i$`, `$x_{max}$` |
| / | `\frac{a}{b}` | `$\frac{n}{2}$` |
| ∞ | `\infty` | `$n \to \infty$` |
| ∈ | `\in` | `$x \in S$` |
| ∀ | `\forall` | `$\forall i$` |
| ∃ | `\exists` | `$\exists x$` |
| ⌊ ⌋ | `\lfloor \rfloor` | `$\lfloor \frac{n}{2} \rfloor$` |
| ⌈ ⌉ | `\lceil \rceil` | `$\lceil \frac{n}{2} \rceil$` |
| ≠ | `\neq` | `$a \neq b$` |
| ≈ | `\approx` | `$\pi \approx 3.14$` |

### Subscripts and Superscripts
```latex
$a_i$           → aᵢ (subscript)
$2^n$           → 2ⁿ (superscript)
$a_{max}$       → aₘₐₓ (multi-char subscript)
$10^{-9}$       → 10⁻⁹ (negative exponent)
```

### Fractions
```latex
$\frac{n}{2}$               → n/2
$\frac{a + b}{c - d}$       → (a+b)/(c-d)
```

### Summations and Products
```latex
$\sum_{i=1}^{n} a_i$        → sum from i=1 to n of aᵢ
$\prod_{i=1}^{n} a_i$       → product from i=1 to n of aᵢ
```

### Greek Letters
```latex
$\alpha, \beta, \gamma$    → α, β, γ
$\theta, \pi, \omega$      → θ, π, ω
$\Delta, \Sigma, \Omega$   → Δ, Σ, Ω
```

### Big O Notation
```latex
$O(n)$                      → O(n)
$O(n \log n)$               → O(n log n)
$O(n^2)$                    → O(n²)
$\Theta(n)$                 → Θ(n)
$\Omega(n)$                 → Ω(n)
```

---

## 📝 Markdown Syntax

### Headings
```markdown
## Input Format
### Constraints
#### Notes
```

### Emphasis
```markdown
**Bold text** for important terms
*Italic text* for variables or emphasis
`code` for variable names, functions
```

### Lists
```markdown
Unordered:
- Item 1
- Item 2
- Item 3

Ordered:
1. First step
2. Second step
3. Third step
```

### Code Blocks
```markdown
Inline: Use `input()` to read data

Block:
​```python
n = int(input())
print(n * 2)
​```
```

### Blockquotes
```markdown
> **Important:** This problem requires efficient algorithms.
```

### Links
```markdown
[Link text](https://example.com)
```

---

## 📋 Example Problem Descriptions

### Example 1: Simple Problem
```markdown
Write a program that calculates the sum of two numbers.

## Input Format
Two integers $a$ and $b$ where $-10^9 \leq a, b \leq 10^9$

## Output Format
A single integer representing $a + b$

## Constraints
- $-10^9 \leq a, b \leq 10^9$
- Time limit: 1 second
```

### Example 2: Array Problem
```markdown
Given an array of $N$ integers, find the maximum sum.

## Input Format
- First line: integer $N$ ($1 \leq N \leq 10^6$)
- Second line: $N$ space-separated integers $a_i$ ($-10^9 \leq a_i \leq 10^9$)

## Output Format
A single integer: $\max_{1 \leq i \leq N} a_i$

## Constraints
- $1 \leq N \leq 10^6$
- $-10^9 \leq a_i \leq 10^9$
- Time limit: 1 second
- Memory limit: 256 MB
```

### Example 3: Graph Problem
```markdown
Find the shortest path between two nodes in a weighted graph.

## Input Format
- First line: $N$ (nodes) and $M$ (edges) where $1 \leq N \leq 10^5$, $0 \leq M \leq 5 \times 10^5$
- Next $M$ lines: three integers $u$, $v$, $w$ representing an edge from node $u$ to node $v$ with weight $w$
- Last line: two integers $s$ and $t$ (start and end nodes)

## Output Format
Single integer: minimum distance from $s$ to $t$, or `-1` if no path exists

## Constraints
- $1 \leq N \leq 10^5$
- $0 \leq M \leq 5 \times 10^5$
- $1 \leq u, v \leq N$
- $1 \leq w \leq 10^6$
- Graphs may contain cycles

## Algorithm Hint
This problem can be solved using **Dijkstra's algorithm** in $O((N + M) \log N)$ time.
```

### Example 4: DP Problem
```markdown
Calculate the $n$-th Fibonacci number modulo $10^9 + 7$.

## Problem Statement
The Fibonacci sequence is defined as:

$$F_0 = 0, \quad F_1 = 1, \quad F_n = F_{n-1} + F_{n-2} \text{ for } n \geq 2$$

## Input Format
A single integer $N$ ($0 \leq N \leq 10^6$)

## Output Format
$F_N \mod (10^9 + 7)$

## Constraints
- $0 \leq N \leq 10^6$
- Answer must be computed modulo $10^9 + 7$
- Time limit: 1 second

> **Note:** A naive recursive solution will be too slow. Use dynamic programming or matrix exponentiation.
```

---

## 🎨 Styling Tips

### 1. Use Headings for Structure
```markdown
## Input Format
## Output Format
## Constraints
## Examples
```

### 2. Use Math for All Numbers/Variables
```markdown
❌ Bad: "where 1 <= n <= 1000000"
✅ Good: "where $1 \leq n \leq 10^6$"

❌ Bad: "Calculate a[i] + b[i]"
✅ Good: "Calculate $a_i + b_i$"
```

### 3. Use Lists for Multiple Items
```markdown
## Constraints
- $1 \leq N \leq 10^6$
- $-10^9 \leq a_i \leq 10^9$
- Time limit: 1 second
```

### 4. Use Bold for Important Terms
```markdown
**Important:** Use a fast I/O method for large inputs.
```

### 5. Use Code Formatting
```markdown
Use the `input()` function to read data.
Variables like `n` and `result` should be integers.
```

---

## 🔧 Implementation Notes

### In problems.json:
```json
{
  "description": "Calculate sum.\n\n## Input Format\n- First line: $N$ where $1 \\leq N \\leq 10^6$\n\n## Output\nSum of all numbers"
}
```

**Important:** 
- Use `\n\n` for paragraph breaks
- Escape backslashes in LaTeX: `\\leq` instead of `\leq`
- Use raw strings in Python: `r"$1 \leq N \leq 10^6$"`

### Testing:
Open `problem.html?id=YOUR_ID` to see rendered output.

---

## 📚 Resources

- **LaTeX Math Symbols:** https://katex.org/docs/supported.html
- **Markdown Syntax:** https://www.markdownguide.org/basic-syntax/
- **KaTeX Documentation:** https://katex.org/docs/support_table.html

---

**Ready to write beautiful problem statements!** 🎉
