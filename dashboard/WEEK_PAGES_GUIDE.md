# Week Pages Guide

## Overview
Each week now has its own dedicated page that lists all problems for that week. Users click on a week card from the Content page to see the week's overview and problem list.

## Navigation Flow
```
Content (index.html)
  ↓ Click "Week 1"
Week 1 Page (week1.html)
  ↓ Click a problem
Problem Page (problem.html?id=w1p1)
```

## Files Created

### Week 1 - Intro to Python
- **File**: `week1.html`
- **Description**: "Welcome to your first week! Learn the basics of Python programming including variables, data types, input/output, and writing your first programs."
- **Problem Filter**: `w1` (shows all problems with IDs starting with "w1")
- **Status**: ✅ Complete and linked

### Week 2 - Loops and Control
- **File**: `week2.html`
- **Description**: "Master control flow in Python with if-statements, for loops, and while loops. Learn how to make decisions in your code and repeat actions efficiently."
- **Problem Filter**: `w2` (shows all problems with IDs starting with "w2")
- **Status**: ✅ Complete and linked

## Features of Week Pages

### 1. Hero Section
- Beautiful purple gradient header
- Week number and title
- Descriptive paragraph about what students will learn

### 2. Problems List
- Automatically loads all problems for that week from `problems.json`
- Shows problem number, title, short description
- Displays difficulty badge (easy/medium/hard)
- Shows points for each problem
- Status icon (placeholder for now - can be enhanced later)
- Click any problem card to go to that problem

### 3. Progress Tracking
- Shows "X/Y completed" badge
- Currently shows "0/X" - can be enhanced with Firestore tracking

### 4. Navigation
- Back button to return to Content page
- Standard dashboard navigation bar at top

## How to Create More Week Pages

To create pages for weeks 3-8, follow this template:

1. **Copy** `week2.html` to `week3.html`

2. **Update the following in the new file:**
   - Page title: `<title>Week 3 - scotchinfo</title>`
   - Week hero number: `<div class="week-hero-number">Week 3</div>`
   - Week hero title: `<h1 class="week-hero-title">Functions</h1>`
   - Week description: Update the `<p class="week-hero-description">` text
   - Problem filter: Change `p.id.startsWith('w2')` to `p.id.startsWith('w3')`

3. **Update `index.html`:**
   - Change `onclick="handleWeekClick(3)"` to `onclick="window.location.href='week3.html'"`

## Week Descriptions (Suggested)

### Week 3 - Functions
"Learn to write reusable code with functions. Understand parameters, return values, and how to organize your code into modular, maintainable pieces."

### Week 4 - Brute Force
"Explore brute force algorithms and learn when to use them. Practice solving problems by systematically trying all possible solutions."

### Week 5 - Greedy Algorithms
"Master the greedy approach to problem-solving. Learn to make locally optimal choices that lead to globally optimal solutions."

### Week 6 - Prefix Sums
"Understand prefix sums and cumulative arrays. Learn this powerful technique for efficiently answering range queries."

### Week 7 - Two Pointers
"Learn the two-pointer technique for efficiently solving array and string problems. Master this essential competitive programming pattern."

### Week 8 - Binary Search
"Master binary search and its applications. Learn to efficiently search sorted data and solve optimization problems."

## Customization Options

### Add Week-Specific Content
You can enhance each week page with:
- **Learning objectives** list
- **Key concepts** section
- **Video tutorials** or resources
- **Estimated time** to complete
- **Prerequisites** from previous weeks

### Example Enhancement
```html
<div class="learning-objectives">
  <h2>What You'll Learn</h2>
  <ul>
    <li>How to define and call functions</li>
    <li>Working with parameters and return values</li>
    <li>Understanding scope and namespaces</li>
  </ul>
</div>
```

## Problem Naming Convention

For the system to work automatically:
- Week 1 problems: `w1p1`, `w1p2`, `w1p3`, etc.
- Week 2 problems: `w2p1`, `w2p2`, `w2p3`, etc.
- Week 3 problems: `w3p1`, `w3p2`, `w3p3`, etc.
- And so on...

## Future Enhancements

Possible improvements:
1. **Track completion** - Use Firestore to store which problems each user has solved
2. **Show solved status** - Change the status icon to ✓ for solved problems
3. **Lock weeks** - Require previous week completion before unlocking next week
4. **Week progress** - Show overall week completion percentage
5. **Leaderboard** - Show top solvers for each week
6. **Time estimates** - Show estimated time for each problem
7. **Tags** - Add topic tags to problems (arrays, strings, math, etc.)

## Testing

To test the week pages:
1. Navigate to the dashboard
2. Click on "Week 1 - Intro to Python"
3. Should see the week1.html page with problem list
4. Click on "Hello, World!" problem
5. Should navigate to problem.html?id=w1p1
6. Use back button to return to week page
7. Use "Back to Content" to return to main dashboard

## Notes

- Week pages automatically filter problems from `problems.json`
- If no problems exist for a week, shows "No Problems Yet" message
- Each week page is independent - you can customize them individually
- The template is fully responsive and matches the dashboard styling
