// Signup Module
class Signup {
    constructor() {
        this.users = [];
        this.emailVerified = false;
        this.phoneVerified = false;
        this.init();
    }

    async init() {
        await this.loadUsers();
        this.setupSignupForm();
        this.setupVerification();
    }

    async loadUsers() {
        try {
            const response = await fetch('data/users.json');
            const data = await response.json();
            this.users = Array.isArray(data) ? data : (data.users || []);
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = [];
        }
    }

    setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });
    }

    setupVerification() {
        // Email verification
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        if (verifyEmailBtn) {
            verifyEmailBtn.addEventListener('click', () => this.verifyEmail());
        }

        // Phone verification
        const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
        if (verifyPhoneBtn) {
            verifyPhoneBtn.addEventListener('click', () => this.verifyPhone());
        }
    }

    async verifyEmail() {
        const email = document.getElementById('email').value.trim();
        if (!email) {
            this.showError('Please enter your email first!');
            return;
        }

        const emailInput = document.getElementById('email');
        const verifyBtn = document.getElementById('verifyEmailBtn');
        const verificationDiv = document.getElementById('emailVerification');
        const verifiedDiv = document.getElementById('emailVerified');

        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Sending OTP...';

        // Simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show OTP input
        verificationDiv.style.display = 'block';
        verifyBtn.style.display = 'none';

        // Auto-fill OTP with animation
        const otpInputs = verificationDiv.querySelectorAll('.otp-input');
        const otp = '1234'; // Simulated OTP

        for (let i = 0; i < otpInputs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            otpInputs[i].value = otp[i];
            otpInputs[i].classList.add('filled');
        }

        // Show verified after all digits filled
        await new Promise(resolve => setTimeout(resolve, 500));
        verificationDiv.style.display = 'none';
        verifiedDiv.style.display = 'block';
        emailInput.readOnly = true;
        emailInput.style.background = '#f3f4f6';
        this.emailVerified = true;
    }

    async verifyPhone() {
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            this.showError('Please enter your phone number first!');
            return;
        }

        const phoneInput = document.getElementById('phone');
        const verifyBtn = document.getElementById('verifyPhoneBtn');
        const verificationDiv = document.getElementById('phoneVerification');
        const verifiedDiv = document.getElementById('phoneVerified');

        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Sending OTP...';

        // Simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show OTP input
        verificationDiv.style.display = 'block';
        verifyBtn.style.display = 'none';

        // Auto-fill OTP with animation
        const otpInputs = verificationDiv.querySelectorAll('.otp-input');
        const otp = '5678'; // Simulated OTP

        for (let i = 0; i < otpInputs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            otpInputs[i].value = otp[i];
            otpInputs[i].classList.add('filled');
        }

        // Show verified after all digits filled
        await new Promise(resolve => setTimeout(resolve, 500));
        verificationDiv.style.display = 'none';
        verifiedDiv.style.display = 'block';
        phoneInput.readOnly = true;
        phoneInput.style.background = '#f3f4f6';
        this.phoneVerified = true;
    }

    async handleSignup() {
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim().toLowerCase();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        const signupBtn = document.getElementById('signupBtn');
        const btnText = signupBtn.querySelector('.btn-text');
        const btnLoader = signupBtn.querySelector('.btn-loader');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        // Hide previous messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Check verification status
        if (!this.emailVerified) {
            this.showError('Please verify your email first!');
            return;
        }

        if (!this.phoneVerified) {
            this.showError('Please verify your phone number first!');
            return;
        }

        // Validation
        if (password !== confirmPassword) {
            this.showError('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long!');
            return;
        }

        if (username.length < 3) {
            this.showError('Username must be at least 3 characters long!');
            return;
        }

        // Check if username already exists
        if (this.users.some(u => u.username === username)) {
            this.showError('Username already exists! Please choose another.');
            return;
        }

        // Check if email already exists
        if (this.users.some(u => u.email === email)) {
            this.showError('Email already registered! Please sign in.');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        signupBtn.disabled = true;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create new user
        const newUser = {
            id: Date.now(),
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            phone: phone,
            avatar: fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
            userType: 'user',
            walletBalance: 0,
            verified: true, // Both email and phone are verified
            emailVerified: true,
            phoneVerified: true,
            createdAt: new Date().toISOString()
        };

        // Add to users array
        this.users.push(newUser);

        // Save to localStorage and update JSON file
        await this.saveUser(newUser);

        // Create user session (auto-login)
        const userSession = {
            id: newUser.id,
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone,
            avatar: newUser.avatar,
            userType: newUser.userType,
            walletBalance: newUser.walletBalance,
            verified: newUser.verified
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));

        // Reset button state
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        signupBtn.disabled = false;

        // Show success message
        successMessage.textContent = '✅ Account created successfully! Redirecting to dashboard...';
        successMessage.style.display = 'block';

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'pages/dashboard.html';
        }, 1500);
    }

    async saveUser(user) {
        // Save to localStorage first
        let registeredUsers = [];
        try {
            registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        } catch (error) {
            console.error('Error parsing registeredUsers, starting fresh:', error);
            localStorage.removeItem('registeredUsers');
        }
        registeredUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Try to save to server (if backend is available)
        try {
            const response = await fetch('/api/save-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ User saved to server:', result);
            } else {
                console.log('⚠️ Server save failed, saved to localStorage only');
            }
        } catch (error) {
            console.log('⚠️ No backend available, saved to localStorage only');
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        const signupBtn = document.getElementById('signupBtn');
        signupBtn.classList.add('shake');
        setTimeout(() => signupBtn.classList.remove('shake'), 500);
    }
}

// Initialize signup
const signup = new Signup();
