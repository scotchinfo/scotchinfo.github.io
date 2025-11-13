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

// Get DOM elements
const runButton = document.getElementById('runButton');
const clearButton = document.getElementById('clearButton');
const codeEditor = document.getElementById('codeEditor');
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const buttonIcon = runButton.querySelector('.button-icon');

// Fix initial blank lines in output box
window.addEventListener('DOMContentLoaded', () => {
    outputBox.innerHTML = '<span class="output-placeholder">Run your code to see the output here...</span>';
});

// Auto-complete features for code editor
codeEditor.addEventListener('keydown', (e) => {
    const { selectionStart, selectionEnd, value } = codeEditor;
    
    // Handle Ctrl+Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runButton.click();
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

// Run button click handler
runButton.addEventListener('click', async () => {
    // Clear previous output
    outputBox.textContent = '';
    
    // Show loading state
    buttonIcon.classList.add('loading');
    runButton.disabled = true;
    
    // Ensure Pyodide is loaded
    if (!pyodideReady) {
        outputBox.textContent = 'Loading Python environment...\n';
        const success = await initPyodide();
        if (!success) {
            outputBox.textContent = 'Error: Failed to load Python environment.';
            buttonIcon.classList.remove('loading');
            runButton.disabled = false;
            return;
        }
    }
    
    // Get code and input
    const code = codeEditor.value;
    const userInput = inputBox.value;
    
    if (!code.trim()) {
        outputBox.textContent = 'Error: No code to run.';
        buttonIcon.classList.remove('loading');
        runButton.disabled = false;
        return;
    }
    
    try {
        // Prepare stdin mock
        const inputLines = userInput.split('\n');
        let inputIndex = 0;
        
        // Create a custom input function that reads from our input box
        pyodide.globals.set('__stdin_lines__', inputLines);
        pyodide.globals.set('__stdin_index__', 0);
        
        // Wrapper code to handle input() and print() with our custom handling
        const wrappedCode = `
import sys
from io import StringIO

__stdin_lines__ = ${JSON.stringify(inputLines)}
__stdin_index__ = 0
__output__ = StringIO()

def custom_input(prompt=''):
    global __stdin_index__
    if prompt:
        __output__.write(prompt)
    if __stdin_index__ < len(__stdin_lines__):
        line = __stdin_lines__[__stdin_index__]
        __stdin_index__ += 1
        return line
    return ''

# Override built-in input
__builtins__.input = custom_input

# Redirect stdout
sys.stdout = __output__
sys.stderr = __output__

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    __output__.write(traceback.format_exc())

__output__.getvalue()
`;
        
        // Run the code
        const output = await pyodide.runPythonAsync(wrappedCode);
        
        // Display output
        if (output) {
            outputBox.textContent = output;
        } else {
            outputBox.textContent = '(No output)';
        }
        
    } catch (error) {
        // Display error
        outputBox.textContent = `Error: ${error.message}`;
        console.error(error);
    } finally {
        // Remove loading state
        buttonIcon.classList.remove('loading');
        runButton.disabled = false;
    }
});

// Clear button click handler
clearButton.addEventListener('click', () => {
    outputBox.innerHTML = '<span class="output-placeholder">Run your code to see the output here...</span>';
});
