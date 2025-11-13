// Get DOM elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loggedInView = document.getElementById('loggedInView');
const authMessage = document.getElementById('authMessage');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');

const signupUsername = document.getElementById('signupUsername');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupButton = document.getElementById('signupButton');

const logoutButton = document.getElementById('logoutButton');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');

// Show message
function showMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.className = 'auth-message ' + (isError ? 'error' : 'success');
    authMessage.style.display = 'block';
    
    // Flash red border for errors
    if (isError) {
        const loginBox = document.querySelector('.login-box');
        loginBox.classList.add('error-flash');
        setTimeout(() => {
            loginBox.classList.remove('error-flash');
        }, 500);
    }
    
    setTimeout(() => {
        authMessage.style.display = 'none';
    }, 5000);
}

// Toggle between login and signup forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    authMessage.style.display = 'none';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    authMessage.style.display = 'none';
});

// Update navbar login link
function updateNavbarLoginLink(user) {
    const loginLink = document.querySelector('.nav-link.login-link');
    if (loginLink) {
        if (user) {
            loginLink.textContent = user.displayName || 'User';
            loginLink.style.color = '#00ff99';
        } else {
            loginLink.textContent = 'Login';
        }
    }
}

// Wait for Firebase Auth to be available
function waitForAuth() {
    return new Promise((resolve) => {
        const checkAuth = setInterval(() => {
            if (window.firebaseAuth) {
                clearInterval(checkAuth);
                resolve(window.firebaseAuth);
            }
        }, 100);
    });
}

// Check auth state on page load
waitForAuth().then((auth) => {
    // Import Firebase Auth functions dynamically
    const authStateChanged = (user) => {
        if (user) {
            // User is logged in
            loginForm.style.display = 'none';
            signupForm.style.display = 'none';
            loggedInView.style.display = 'block';
            
            userName.textContent = user.displayName || 'User';
            userEmail.textContent = user.email;
            
            // Update navbar
            updateNavbarLoginLink(user);
        } else {
            // User is logged out
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            loggedInView.style.display = 'none';
            
            // Update navbar
            updateNavbarLoginLink(null);
        }
    };

    // Listen for auth state changes
    import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js').then((authModule) => {
        authModule.onAuthStateChanged(auth, authStateChanged);
    });
});

// Login handler
loginButton.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        showMessage('Please fill in all fields', true);
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    try {
        const auth = window.firebaseAuth;
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        
        await signInWithEmailAndPassword(auth, email, password);
        showMessage('Login successful!');
        
        // Clear form
        loginEmail.value = '';
        loginPassword.value = '';
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage += 'Too many failed attempts. Try again later.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showMessage(errorMessage, true);
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

// Signup handler
signupButton.addEventListener('click', async () => {
    const username = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (!username || !email || !password) {
        showMessage('Please fill in all fields', true);
        return;
    }

    // Validate username
    if (username.length > 15) {
        showMessage('Username must be 15 characters or less', true);
        return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        showMessage('Username can only contain letters, numbers, underscore (_), and hyphen (-)', true);
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', true);
        return;
    }

    signupButton.disabled = true;
    signupButton.textContent = 'Signing up...';

    try {
        const auth = window.firebaseAuth;
        const authModule = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        
        const userCredential = await authModule.createUserWithEmailAndPassword(auth, email, password);
        
        // Set username as display name
        await authModule.updateProfile(userCredential.user, {
            displayName: username
        });
        
        showMessage('Account created successfully!');
        
        // Clear form
        signupUsername.value = '';
        signupEmail.value = '';
        signupPassword.value = '';
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = '';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please use a different email or login.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address. Please check and try again.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
                break;
            default:
                errorMessage = 'Signup failed: ' + error.message;
        }
        
        showMessage(errorMessage, true);
    } finally {
        signupButton.disabled = false;
        signupButton.textContent = 'Sign Up';
    }
});

// Logout handler
logoutButton.addEventListener('click', async () => {
    try {
        const auth = window.firebaseAuth;
        const { signOut } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        
        await signOut(auth);
        showMessage('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Logout failed: ' + error.message, true);
    }
});

// Allow Enter key to submit forms
loginEmail.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginButton.click();
});

loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginButton.click();
});

signupPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') signupButton.click();
});
