// Get problem ID from URL
const urlParams = new URLSearchParams(window.location.search);
const problemId = urlParams.get('id');

let currentProblem = null;
let pyodide = null;
let pyodideReady = false;

// Initialize Pyodide
async function initPyodide() {
    if (pyodideReady) return;
    
    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        pyodideReady = true;
        console.log("Pyodide loaded successfully!");
    } catch (error) {
        console.error("Failed to load Pyodide:", error);
        return false;
    }
    return true;
}

// Start loading Pyodide when page loads
initPyodide();

// Load problem data
async function loadProblem() {
    try {
        const response = await fetch('problems/problems.json');
        const data = await response.json();
        
        currentProblem = data.problems.find(p => p.id === problemId);
        
        if (!currentProblem) {
            alert('Problem not found!');
            window.location.href = 'index.html';
            return;
        }
        
        displayProblem(currentProblem);
    } catch (error) {
        console.error('Error loading problem:', error);
        alert('Failed to load problem data.');
    }
}

// Display problem on page
function displayProblem(problem) {
    document.getElementById('problemTitle').textContent = problem.title;
    
    const difficultyBadge = document.getElementById('difficultyBadge');
    difficultyBadge.textContent = problem.difficulty;
    difficultyBadge.className = `difficulty-badge ${problem.difficulty}`;
    
    document.getElementById('pointsBadge').textContent = `${problem.points} points`;
    
    // Render description with Markdown and LaTeX support
    const descriptionEl = document.getElementById('problemDescription');
    const markdownHtml = marked.parse(problem.description);
    descriptionEl.innerHTML = markdownHtml;
    
    // Render LaTeX math in description
    // Use $...$ for inline math and $$...$$ for display math
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(descriptionEl, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        });
    }
    
    document.getElementById('sampleInput').textContent = problem.sampleInput || '(no input)';
    document.getElementById('sampleOutput').textContent = problem.sampleOutput;
}

// Tab switching
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.ide-tab');
    const tabContents = document.querySelectorAll('.ide-tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    if (tabName === 'code') {
        tabs[0].classList.add('active');
        document.getElementById('codeTab').classList.add('active');
    } else if (tabName === 'input') {
        tabs[1].classList.add('active');
        document.getElementById('inputTab').classList.add('active');
    } else if (tabName === 'test') {
        tabs[2].classList.add('active');
        document.getElementById('testTab').classList.add('active');
    }
}

// Run code
async function runCode() {
    const codeEditor = document.getElementById('codeEditor');
    const outputBox = document.getElementById('outputBox');
    const customInput = document.getElementById('customInput');
    const code = codeEditor.value;
    
    if (!code.trim()) {
        outputBox.textContent = 'Error: No code to run.';
        return;
    }
    
    outputBox.textContent = 'Running...';
    
    if (!pyodideReady) {
        outputBox.textContent = 'Loading Python environment...';
        await initPyodide();
    }
    
    try {
        // Get custom input if provided
        const inputText = customInput.value || '';
        
        const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO

# Set up input lines
__stdin_lines__ = """${inputText.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}""".split('\\n')
__stdin_index__ = 0

# Custom input function
def custom_input(prompt=''):
    global __stdin_index__
    if __stdin_index__ < len(__stdin_lines__):
        line = __stdin_lines__[__stdin_index__]
        __stdin_index__ += 1
        return line
    return ''

# Override input and output
__builtins__.input = custom_input

output = StringIO()
sys.stdout = output
sys.stderr = output

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    output.write(traceback.format_exc())

output.getvalue()
`);
        
        outputBox.textContent = result || '(No output)';
    } catch (error) {
        outputBox.textContent = `Error: ${error.message}`;
    }
}

// Run test cases
async function runTests() {
    if (!currentProblem) {
        alert('No problem loaded.');
        return;
    }
    
    const hasInlineTests = currentProblem.testCases && currentProblem.testCases.length > 0;
    const hasFileTests = currentProblem.testCaseFiles && currentProblem.testCaseFiles.length > 0;
    
    if (!hasInlineTests && !hasFileTests) {
        alert('No test cases available for this problem.');
        return;
    }
    
    const codeEditor = document.getElementById('codeEditor');
    const code = codeEditor.value;
    
    if (!code.trim()) {
        alert('Please write some code first!');
        return;
    }
    
    if (!pyodideReady) {
        await initPyodide();
    }
    
    switchTab('test');
    const testResults = document.getElementById('testResults');
    testResults.innerHTML = '<p style="color: #6b7280;">Running tests...</p>';
    
    let passedCount = 0;
    const results = [];
    
    // Run inline test cases
    if (hasInlineTests) {
        for (let i = 0; i < currentProblem.testCases.length; i++) {
            const testCase = currentProblem.testCases[i];
            const result = await runSingleTest(code, testCase.input, testCase.expectedOutput, `Test Case ${i + 1}`, i + 1);
            results.push(result);
            if (result.passed) passedCount++;
        }
    }
    
    // Run file-based test cases
    if (hasFileTests) {
        for (let i = 0; i < currentProblem.testCaseFiles.length; i++) {
            const testFile = currentProblem.testCaseFiles[i];
            
            try {
                // Fetch input and output files
                const inputResponse = await fetch(testFile.inputFile);
                const outputResponse = await fetch(testFile.outputFile);
                
                if (!inputResponse.ok || !outputResponse.ok) {
                    results.push({
                        index: results.length + 1,
                        name: testFile.name || `File Test ${i + 1}`,
                        passed: false,
                        input: '(file not found)',
                        expected: '(file not found)',
                        actual: 'Error loading test case files'
                    });
                    continue;
                }
                
                const input = await inputResponse.text();
                const expectedOutput = await outputResponse.text();
                
                const result = await runSingleTest(
                    code, 
                    input.trim(), 
                    expectedOutput.trim(), 
                    testFile.name || `File Test ${i + 1}`,
                    results.length + 1
                );
                results.push(result);
                if (result.passed) passedCount++;
                
            } catch (error) {
                results.push({
                    index: results.length + 1,
                    name: testFile.name || `File Test ${i + 1}`,
                    passed: false,
                    input: '(error)',
                    expected: '(error)',
                    actual: `Error: ${error.message}`
                });
            }
        }
    }
    
    const totalTests = results.length;
    displayTestResults(results, passedCount, totalTests);
    
    // Save solved status if all tests passed
    if (passedCount === totalTests && totalTests > 0) {
        await saveProblemSolved(currentProblem.id);
    }
}

// Save problem solved status to Firestore
async function saveProblemSolved(problemId) {
    if (!window.firebaseAuth || !window.firebaseDB) return;
    
    const user = window.firebaseAuth.currentUser;
    if (!user) return;
    
    const testResults = document.getElementById('testResults');
    const statusDiv = document.createElement('div');
    statusDiv.style.padding = '1rem';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.marginTop = '1.5rem';
    
    try {
        const userRef = window.firestoreDoc(window.firebaseDB, 'users', user.uid);
        await window.firestoreSetDoc(userRef, {
            solvedProblems: {
                [problemId]: true
            },
            lastActive: new Date().toISOString()
        }, { merge: true });
        
        console.log("Problem marked as solved in Firestore!");
        statusDiv.style.background = '#d1fae5';
        statusDiv.innerHTML = '<h3 style="margin: 0 0 0.5rem 0; color: #065f46;">🎉 Progress Saved!</h3><p style="margin: 0; color: #065f46;">Your solution has been recorded in the database.</p>';
    } catch (error) {
        console.error("Error saving solved status:", error);
        statusDiv.style.background = '#fee2e2';
        statusDiv.innerHTML = `<h3 style="margin: 0 0 0.5rem 0; color: #991b1b;">Error Saving Progress</h3><p style="margin: 0; color: #991b1b;">${error.message}</p>`;
    }
    
    testResults.appendChild(statusDiv);
}

// Helper function to run a single test
async function runSingleTest(code, input, expectedOutput, name, index) {
    try {
        const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO

__stdin_lines__ = ${JSON.stringify(input.split('\n'))}
__stdin_index__ = 0
__output__ = StringIO()

def custom_input(prompt=''):
    global __stdin_index__
    if __stdin_index__ < len(__stdin_lines__):
        line = __stdin_lines__[__stdin_index__]
        __stdin_index__ += 1
        return line
    return ''

__builtins__.input = custom_input
sys.stdout = __output__
sys.stderr = __output__

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    __output__.write(traceback.format_exc())

__output__.getvalue().strip()
`);
        
        const expected = expectedOutput.trim();
        const actual = result.trim();
        const passed = actual === expected;
        
        return {
            index,
            name,
            passed,
            input: input.length > 50 ? '(Too long to show)' : input,
            expected: expected.length > 50 ? '(Too long to show)' : expected,
            actual: actual.length > 50 ? '(Too long to show)' : actual
        };
    } catch (error) {
        return {
            index,
            name,
            passed: false,
            input: input.length > 200 ? `(${input.split('\n').length} lines)` : input,
            expected: expectedOutput.trim().length > 200 ? `(${expectedOutput.trim().length} characters)` : expectedOutput.trim(),
            actual: `Error: ${error.message}`
        };
    }
}

// Display test results
function displayTestResults(results, passedCount, totalCount) {
    const testResults = document.getElementById('testResults');
    
    const summary = `
        <div style="padding: 1rem; background: ${passedCount === totalCount ? '#d1fae5' : '#fee2e2'}; border-radius: 8px; margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.5rem 0; color: #1a202c;">Test Results: ${passedCount}/${totalCount} Passed</h3>
            <p style="margin: 0; color: #4a5568;">${passedCount === totalCount ? '🎉 All tests passed!' : 'Some tests failed. Check the details below.'}</p>
        </div>
    `;
    
    const testCasesHtml = results.map(result => `
        <div class="test-case ${result.passed ? 'passed' : 'failed'}">
            <div class="test-case-header">
                <span class="test-case-title">${result.name || `Test Case ${result.index}`}</span>
                <span class="test-status ${result.passed ? 'passed' : 'failed'}">${result.passed ? '✓ Passed' : '✗ Failed'}</span>
            </div>
            <div class="test-case-details">
                <div style="margin-bottom: 0.5rem;"><strong>Input:</strong> ${result.input || '(empty)'}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Expected:</strong> ${result.expected}</div>
                <div><strong>Your Output:</strong> ${result.actual}</div>
            </div>
        </div>
    `).join('');
    
    testResults.innerHTML = summary + testCasesHtml;
}

// Auto-complete features for code editor
document.getElementById('codeEditor').addEventListener('keydown', (e) => {
    const codeEditor = document.getElementById('codeEditor');
    const { selectionStart, selectionEnd, value } = codeEditor;
    
    // Handle Ctrl+Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('runButton').click();
        return;
    }
    
    // Handle Tab key - add 4 spaces
    if (e.key === 'Tab') {
        e.preventDefault();
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        codeEditor.value = before + '    ' + after;
        codeEditor.selectionStart = codeEditor.selectionEnd = selectionStart + 4;
        return;
    }
    
    // Handle Backspace - delete 4 spaces if they exist before cursor
    if (e.key === 'Backspace') {
        const before = value.substring(0, selectionStart);
        const lineStart = before.lastIndexOf('\n') + 1;
        const currentLine = before.substring(lineStart);
        
        // Check if we're at the start of indentation (only spaces before cursor on this line)
        if (currentLine.match(/^    +$/) && currentLine.length % 4 === 0) {
            e.preventDefault();
            const newBefore = before.substring(0, before.length - 4);
            const after = value.substring(selectionEnd);
            codeEditor.value = newBefore + after;
            codeEditor.selectionStart = codeEditor.selectionEnd = selectionStart - 4;
            return;
        }
    }
    
    // Handle Enter key - auto-indent
    if (e.key === 'Enter') {
        e.preventDefault();
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        
        // Get current line
        const lineStart = before.lastIndexOf('\n') + 1;
        const currentLine = before.substring(lineStart);
        
        // Count leading spaces
        const match = currentLine.match(/^(\s*)/);
        let indent = match ? match[1] : '';
        
        // Check if line ends with : (for if, def, for, while, etc.)
        const trimmedLine = currentLine.trim();
        if (trimmedLine.endsWith(':')) {
            indent += '    '; // Add extra indentation
        }
        
        codeEditor.value = before + '\n' + indent + after;
        codeEditor.selectionStart = codeEditor.selectionEnd = selectionStart + 1 + indent.length;
        return;
    }
    
    // Handle closing brackets - skip over them if they're already there
    const closingChars = [')', ']', '}', '"', "'"];
    if (closingChars.includes(e.key) && value[selectionStart] === e.key) {
        e.preventDefault();
        codeEditor.selectionStart = codeEditor.selectionEnd = selectionStart + 1;
        return;
    }
    
    // Auto-close brackets, parentheses, quotes
    const pairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'"
    };
    
    if (pairs[e.key]) {
        // For quotes, check if we should skip instead of insert
        if ((e.key === '"' || e.key === "'") && value[selectionStart] === e.key) {
            e.preventDefault();
            codeEditor.selectionStart = codeEditor.selectionEnd = selectionStart + 1;
            return;
        }
        
        e.preventDefault();
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        const selected = value.substring(selectionStart, selectionEnd);
        
        if (selected) {
            // Wrap selection
            codeEditor.value = before + e.key + selected + pairs[e.key] + after;
            codeEditor.selectionStart = selectionStart + 1;
            codeEditor.selectionEnd = selectionEnd + 1;
        } else {
            // Insert pair
            codeEditor.value = before + e.key + pairs[e.key] + after;
            codeEditor.selectionStart = codeEditor.selectionEnd = selectionStart + 1;
        }
    }
});

// Event listeners
document.getElementById('runButton').addEventListener('click', runCode);
document.getElementById('testButton').addEventListener('click', runTests);
document.getElementById('clearButton').addEventListener('click', () => {
    document.getElementById('outputBox').innerHTML = '<span class="output-placeholder">Run your code to see output...</span>';
});
document.getElementById('clearInputButton').addEventListener('click', () => {
    document.getElementById('customInput').value = '';
});

// Load problem on page load
window.addEventListener('DOMContentLoaded', loadProblem);

// Make switchTab globally available
window.switchTab = switchTab;
