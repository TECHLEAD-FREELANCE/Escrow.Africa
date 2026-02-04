// Authentication Module
class Auth {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.loadUsers();
        this.checkSession();
        this.setupLoginForm();
    }

    async loadUsers() {
        try {
            const response = await fetch('../data/users.json');
            const data = await response.json();
            // Handle both array and object with users property
            this.users = Array.isArray(data) ? data : (data.users || []);
        } catch (error) {
            console.error('Error loading users:', error);
            // Fallback demo user
            this.users = [
                { username: 'demo', password: 'demo123', fullName: 'Demo User', id: 1 }
            ];
        }
    }

    checkSession() {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        
        const sessionUser = sessionStorage.getItem('currentUser');
        
        if (sessionUser && isLoginPage) {
            // Redirect to dashboard if already logged in
            window.location.href = 'pages/dashboard.html';
        } else if (!sessionUser && !isLoginPage) {
            // Redirect to login if not logged in and trying to access protected pages
            window.location.href = '../index.html';
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        const errorMessage = document.getElementById('errorMessage');

        // Hide previous error
        errorMessage.style.display = 'none';

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        loginBtn.disabled = true;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Validate credentials
        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            // Success - store user session
            const userSession = {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                userType: user.userType,
                walletBalance: user.walletBalance,
                verified: user.verified
            };

            sessionStorage.setItem('currentUser', JSON.stringify(userSession));
            
            // Show success message briefly
            this.showToast('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 500);
        } else {
            // Failed login
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;

            errorMessage.textContent = 'Invalid username or password. Please try again.';
            errorMessage.style.display = 'block';
            
            // Shake animation
            loginBtn.classList.add('shake');
            setTimeout(() => loginBtn.classList.remove('shake'), 500);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static getCurrentUser() {
        const userSession = sessionStorage.getItem('currentUser');
        return userSession ? JSON.parse(userSession) : null;
    }

    static logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }

    static requireAuth() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            window.location.href = '../index.html';
        }
        return currentUser;
    }
}

// Initialize auth
const auth = new Auth();
