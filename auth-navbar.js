// Shared authentication state handler for all pages
// This script updates the navbar login link to show username when logged in

// Update navbar login link
function updateNavbarLoginLink(user) {
    const loginLink = document.querySelector('.nav-link.login-link');
    if (loginLink) {
        if (user) {
            loginLink.textContent = user.displayName || 'User';
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
        
        // Timeout after 5 seconds if Firebase not loaded
        setTimeout(() => {
            clearInterval(checkAuth);
            resolve(null);
        }, 5000);
    });
}

// Initialize Firebase for navbar updates
async function initNavbarAuth() {
    // Only run if not on login page (which has its own Firebase initialization)
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isLoginPage) {
        // Import Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js');
        const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        
        const firebaseConfig = {
            apiKey: "AIzaSyDQqNwN2thrYfR9LsOYr9p_-GHJ7Qr8NU0",
            authDomain: "scotch-informatics-club.firebaseapp.com",
            projectId: "scotch-informatics-club",
            storageBucket: "scotch-informatics-club.firebasestorage.app",
            messagingSenderId: "925756955037",
            appId: "1:925756955037:web:df9ca311b0e488f0f57774",
            measurementId: "G-LM0XYTWGJ3"
        };
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            updateNavbarLoginLink(user);
        });
    } else {
        // On login page, wait for auth to be initialized
        const auth = await waitForAuth();
        if (auth) {
            const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
            onAuthStateChanged(auth, (user) => {
                updateNavbarLoginLink(user);
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarAuth);
} else {
    initNavbarAuth();
}
