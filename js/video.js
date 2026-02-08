// Video Demo Script - Automated Timeline with Realistic Timing
class VideoDemo {
    constructor() {
        this.currentStep = 0;
        this.totalDuration = 150000; // 2:30 minutes
        this.startTime = 0;
        this.isPaused = false;
        this.animationFrame = null;
        
        // Timeline with proper duration distribution
        this.timeline = [
            { step: 1, name: 'Sign Up', duration: 18000, action: () => this.step1_SignUp() },
            { step: 2, name: 'Dashboard', duration: 15000, action: () => this.step2_Dashboard() },
            { step: 3, name: 'Create Deal', duration: 20000, action: () => this.step3_CreateDeal() },
            { step: 4, name: 'Invite Party', duration: 16000, action: () => this.step4_InviteParty() },
            { step: 5, name: 'Review & Accept', duration: 18000, action: () => this.step5_ReviewAccept() },
            { step: 6, name: 'Pay & Escrow', duration: 25000, action: () => this.step6_PayEscrow() },
            { step: 7, name: 'Complete Deal', duration: 20000, action: () => this.step7_CompleteDeal() },
            { step: 8, name: 'Withdraw Funds', duration: 18000, action: () => this.step8_Withdraw() },
            { step: 9, name: 'Dispute', duration: 15000, action: () => this.step9_Dispute() }
        ];
        
        this.init();
    }
    
    init() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }
    
    start() {
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('controls').style.opacity = '0.3';
        
        this.startTime = Date.now();
        this.runTimeline();
        this.updateProgress();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '▶ Resume' : '⏸ Pause';
    }
    
    restart() {
        window.location.reload();
    }
    
    async runTimeline() {
        for (let i = 0; i < this.timeline.length; i++) {
            const step = this.timeline[i];
            this.currentStep = i;
            
            this.updateStepIndicator(step.step, step.name);
            
            await step.action();
            
            // Transition wait before next step
            await this.wait(800);
        }
        
        await this.showCompletion();
    }
    
    updateStepIndicator(stepNumber, stepTitle) {
        const indicator = document.getElementById('stepIndicator');
        indicator.querySelector('.step-number').textContent = stepNumber;
        indicator.querySelector('.step-title').textContent = stepTitle;
        indicator.style.animation = 'none';
        setTimeout(() => indicator.style.animation = 'slideDown 0.5s ease', 10);
    }
    
    updateProgress() {
        const update = () => {
            if (!this.isPaused) {
                const elapsed = Date.now() - this.startTime;
                const progress = Math.min((elapsed / this.totalDuration) * 100, 100);
                document.getElementById('progressFill').style.width = progress + '%';
                
                const currentSeconds = Math.floor(elapsed / 1000);
                const minutes = Math.floor(currentSeconds / 60);
                const seconds = currentSeconds % 60;
                document.getElementById('currentTime').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (Date.now() - this.startTime < this.totalDuration + 5000) {
                this.animationFrame = requestAnimationFrame(update);
            }
        };
        update();
    }
    
    wait(ms) {
        return new Promise(resolve => {
            const startWait = Date.now();
            const checkPause = () => {
                if (!this.isPaused) {
                    const elapsed = Date.now() - startWait;
                    if (elapsed >= ms) {
                        resolve();
                    } else {
                        requestAnimationFrame(checkPause);
                    }
                } else {
                    requestAnimationFrame(checkPause);
                }
            };
            checkPause();
        });
    }
    
    clearScene() {
        const container = document.getElementById('sceneContainer');
        const currentScene = container.querySelector('.scene');
        if (currentScene) {
            currentScene.classList.add('exit');
            return this.wait(400);
        }
        return Promise.resolve();
    }
    
    createScene(html) {
        const container = document.getElementById('sceneContainer');
        container.innerHTML = `<div class="scene">${html}</div>`;
    }
    
    showToast(message, icon = '✅') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
    
    // Realistic character-by-character typing
    async typeText(element, text, delayPerChar = 80) {
        element.value = '';
        element.classList.add('typing');
        
        for (let i = 0; i < text.length; i++) {
            while (this.isPaused) {
                await this.wait(100);
            }
            element.value = text.substring(0, i + 1);
            await this.wait(delayPerChar);
        }
        
        element.classList.remove('typing');
        element.classList.add('filled');
    }
    
    // STEP 1: Sign Up (18 seconds - well distributed)
    async step1_SignUp() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">✨</div>
                <h1 class="scene-title">Create Account</h1>
                <p class="scene-subtitle">Join Escrow Africa in seconds</p>
            </div>
            
            <div class="form-group" style="animation-delay: 0.5s">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="fullName" placeholder="Enter your full name" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.6s">
                <label class="form-label">Username</label>
                <input type="text" class="form-input" id="username" placeholder="Choose a username" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.7s">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="email" placeholder="you@example.com" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.8s">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" id="phone" placeholder="+254 712 345 678" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.9s">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" id="password" placeholder="Create a strong password" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 1s">
                <label class="form-label">Confirm Password</label>
                <input type="password" class="form-input" id="confirmPassword" placeholder="Re-enter password" readonly>
            </div>
            
            <button class="btn" id="signupBtn" style="animation-delay: 1.1s">Create Account</button>
        `);
        
        await this.wait(1200);
        
        // Type name character by character
        await this.typeText(document.getElementById('fullName'), 'John Mutua', 85);
        await this.wait(600);
        
        // Type username
        await this.typeText(document.getElementById('username'), 'john_mutua', 80);
        await this.wait(600);
        
        // Type email
        await this.typeText(document.getElementById('email'), 'john.mutua@example.com', 70);
        await this.wait(600);
        
        // Type phone
        await this.typeText(document.getElementById('phone'), '+254 712 345 678', 75);
        await this.wait(600);
        
        // Type password (show dots)
        await this.typeText(document.getElementById('password'), '••••••••', 100);
        await this.wait(500);
        
        // Type confirm password
        await this.typeText(document.getElementById('confirmPassword'), '••••••••', 100);
        await this.wait(800);
        
        // Click signup
        const btn = document.getElementById('signupBtn');
        btn.classList.add('loading');
        btn.textContent = 'Creating Account...';
        await this.wait(2500);
        
        // Show OTP verification
        await this.clearScene();
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">📧</div>
                <h1 class="scene-title">Verify Email</h1>
                <p class="scene-subtitle">Enter the code sent to your email</p>
            </div>
            
            <div class="otp-container">
                <input type="text" class="otp-input" maxlength="1" readonly id="otp1">
                <input type="text" class="otp-input" maxlength="1" readonly id="otp2">
                <input type="text" class="otp-input" maxlength="1" readonly id="otp3">
                <input type="text" class="otp-input" maxlength="1" readonly id="otp4">
            </div>
            
            <button class="btn" style="animation-delay: 0.3s">Verify & Continue</button>
        `);
        
        await this.wait(1500);
        
        // Auto-fill OTP with animation
        const otpValues = ['1', '2', '3', '4'];
        for (let i = 0; i < 4; i++) {
            const input = document.getElementById(`otp${i + 1}`);
            input.value = otpValues[i];
            input.classList.add('filled');
            await this.wait(500);
        }
        
        await this.wait(1000);
        this.showToast('Email verified!', '✅');
        await this.wait(1200);
        
        // Show Mobile OTP verification
        await this.clearScene();
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">📱</div>
                <h1 class="scene-title">Verify Mobile Number</h1>
                <p class="scene-subtitle">Enter the code sent to +254 712 345 678</p>
            </div>
            
            <div class="otp-container">
                <input type="text" class="otp-input" maxlength="1" readonly id="motp1">
                <input type="text" class="otp-input" maxlength="1" readonly id="motp2">
                <input type="text" class="otp-input" maxlength="1" readonly id="motp3">
                <input type="text" class="otp-input" maxlength="1" readonly id="motp4">
            </div>
            
            <button class="btn" style="animation-delay: 0.3s">Verify & Continue</button>
        `);
        
        await this.wait(1500);
        
        // Auto-fill Mobile OTP with animation
        const mobileOtpValues = ['5', '6', '7', '8'];
        for (let i = 0; i < 4; i++) {
            const input = document.getElementById(`motp${i + 1}`);
            input.value = mobileOtpValues[i];
            input.classList.add('filled');
            await this.wait(500);
        }
        
        await this.wait(1200);
        this.showToast('Account created successfully!', '✅');
        await this.wait(1500);
    }
    
    // STEP 2: Dashboard (15 seconds)
    async step2_Dashboard() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">🏠</div>
                <h1 class="scene-title">Dashboard</h1>
                <p class="scene-subtitle">Welcome back, John Mutua</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #0D9488, #14B8A6); padding: 20px; border-radius: 16px; margin-bottom: 24px; color: white; animation: fadeIn 0.4s ease 0.5s both;">
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Wallet Balance</div>
                <div style="font-size: 32px; font-weight: 700;">KES 125,000</div>
            </div>
            
            <div style="margin-bottom: 16px; font-weight: 600; color: #1f2937; animation: fadeIn 0.4s ease 0.6s both;">Quick Services</div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                <div class="dashboard-service" style="animation-delay: 0.7s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🤝</div>
                    <div style="font-size: 13px; font-weight: 600;">Create Deal</div>
                </div>
                <div class="dashboard-service" style="animation-delay: 0.8s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">💬</div>
                    <div style="font-size: 13px; font-weight: 600;">Escrow Chat</div>
                </div>
                <div class="dashboard-service" style="animation-delay: 0.9s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">💰</div>
                    <div style="font-size: 13px; font-weight: 600;">Withdraw</div>
                </div>
                <div class="dashboard-service" style="animation-delay: 1s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
                    <div style="font-size: 13px; font-weight: 600;">Search User</div>
                </div>
                <div class="dashboard-service" style="animation-delay: 1.1s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
                    <div style="font-size: 13px; font-weight: 600;">Active Deals</div>
                </div>
                <div class="dashboard-service" style="animation-delay: 1.2s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">⚠️</div>
                    <div style="font-size: 13px; font-weight: 600;">Disputes</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div class="dashboard-service" style="animation-delay: 1.3s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">💳</div>
                    <div style="font-size: 13px; font-weight: 600;">Wallet Balance</div>
                </div>
                <div class="dashboard-service" style="animation-delay: 1.4s;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🕐</div>
                    <div style="font-size: 13px; font-weight: 600;">History</div>
                </div>
            </div>
        `);
        
        await this.wait(7000);
        
        // Highlight Create Deal
        const createDealBtn = document.querySelector('.dashboard-service');
        if (createDealBtn) {
            createDealBtn.style.transform = 'scale(1.1)';
            createDealBtn.style.boxShadow = '0 8px 24px rgba(0, 137, 123, 0.3)';
            createDealBtn.style.borderColor = '#00897b';
        }
        
        await this.wait(2000);
        this.showToast('Let\'s create a new deal', '🤝');
        await this.wait(1500);
    }
    
    // STEP 3: Create Deal (20 seconds)
    async step3_CreateDeal() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">🤝</div>
                <h1 class="scene-title">Create New Deal</h1>
                <p class="scene-subtitle">Set up your escrow transaction</p>
            </div>
            
            <div class="form-group" style="animation-delay: 0.5s">
                <label class="form-label">Deal Title</label>
                <input type="text" class="form-input" id="dealTitle" placeholder="e.g., Website Development" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.6s">
                <label class="form-label">Description</label>
                <input type="text" class="form-input" id="dealDesc" placeholder="Describe the work or item" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.7s">
                <label class="form-label">Amount (KES)</label>
                <input type="text" class="form-input" id="dealAmount" placeholder="50,000" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.8s">
                <label class="form-label">Timeline (days)</label>
                <input type="text" class="form-input" id="dealTimeline" placeholder="7" readonly>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.9s">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Deal Amount</span>
                    <span style="font-weight: 600;" id="amountDisplay">KES 0</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Platform Fee (2%)</span>
                    <span style="font-weight: 600;" id="feeDisplay">KES 0</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #e5e7eb;">
                    <span style="font-weight: 700;">Total</span>
                    <span style="font-weight: 700; color: #00897b;" id="totalDisplay">KES 0</span>
                </div>
            </div>
            
            <button class="btn" style="animation-delay: 1s">Create Deal</button>
        `);
        
        await this.wait(1200);
        
        await this.typeText(document.getElementById('dealTitle'), 'Website Development Project', 70);
        await this.wait(1000);
        
        await this.typeText(document.getElementById('dealDesc'), 'E-commerce website with payment integration', 65);
        await this.wait(1000);
        
        // Type amount with live calculation
        const amountInput = document.getElementById('dealAmount');
        const amount = '50000';
        amountInput.classList.add('typing');
        
        for (let i = 0; i <= amount.length; i++) {
            while (this.isPaused) await this.wait(100);
            
            const currentAmount = amount.substring(0, i);
            amountInput.value = currentAmount;
            
            if (currentAmount) {
                const num = parseFloat(currentAmount);
                const fee = num * 0.02;
                const total = num + fee;
                document.getElementById('amountDisplay').textContent = `KES ${num.toLocaleString()}`;
                document.getElementById('feeDisplay').textContent = `KES ${fee.toLocaleString()}`;
                document.getElementById('totalDisplay').textContent = `KES ${total.toLocaleString()}`;
            }
            await this.wait(120);
        }
        amountInput.classList.remove('typing');
        amountInput.classList.add('filled');
        
        await this.wait(1000);
        await this.typeText(document.getElementById('dealTimeline'), '7', 100);
        await this.wait(2000);
        
        this.showToast('Deal created successfully!', '✅');
        await this.wait(2000);
    }
    
    // STEP 4: Invite Other Party (16 seconds)
    async step4_InviteParty() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">📨</div>
                <h1 class="scene-title">Invite Other Party</h1>
                <p class="scene-subtitle">Share deal with buyer or seller</p>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.5s">
                <div class="deal-header">
                    <div>
                        <div class="deal-title">Website Development Project</div>
                        <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Deal ID: ESC789456</div>
                    </div>
                    <span class="status-badge status-pending">⏳ Pending</span>
                </div>
                <div class="deal-amount">KES 50,000</div>
            </div>
            
            <div style="margin: 24px 0; animation: fadeIn 0.4s ease 0.6s both;">
                <label class="form-label">Choose invitation method</label>
            </div>
            
            <button class="btn" id="inviteByUsername" style="animation-delay: 0.7s; margin-bottom: 12px;">
                👤 Invite by Username
            </button>
            
            <button class="btn btn-secondary" id="shareLink" style="animation-delay: 0.8s;">
                🔗 Generate Share Link
            </button>
        `);
        
        await this.wait(2000);
        
        // Show username selection first
        const btn = document.getElementById('inviteByUsername');
        btn.style.background = '#4db6ac';
        btn.textContent = 'Searching users...';
        await this.wait(1800);
        
        // Show user selection
        await this.clearScene();
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">👥</div>
                <h1 class="scene-title">Invite by Username</h1>
                <p class="scene-subtitle">Choose who to invite</p>
            </div>
            
            <div class="form-group" style="animation-delay: 0.5s">
                <input type="text" class="form-input" id="searchUser" placeholder="Search by username..." readonly>
            </div>
            
            <div style="margin-top: 24px; animation: fadeIn 0.4s ease 0.7s both;">
                <div style="padding: 16px; background: #f3f4f6; border-radius: 12px; margin-bottom: 12px; cursor: pointer; border: 2px solid transparent; transition: all 0.3s;" id="userCard">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: #00897b; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px;">
                            SK
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 4px;">Sarah Kimani</div>
                            <div style="font-size: 13px; color: #6b7280;">@sarah_k • Verified ✓</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <button class="btn" id="sendInviteBtn" style="animation-delay: 0.9s;">Send Invitation</button>
        `);
        
        await this.wait(1000);
        await this.typeText(document.getElementById('searchUser'), 'sarah', 100);
        await this.wait(1200);
        
        // Select user
        const userCard = document.getElementById('userCard');
        userCard.style.borderColor = '#00897b';
        userCard.style.background = '#e0f2f1';
        await this.wait(1500);
        
        // Click send invitation
        const sendBtn = document.getElementById('sendInviteBtn');
        sendBtn.textContent = 'Sending...';
        sendBtn.style.background = '#4db6ac';
        await this.wait(1500);
        
        this.showToast('Invitation sent to Sarah Kimani', '📧');
        await this.wait(1500);
        
        // Now show share link option
        await this.clearScene();
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">🔗</div>
                <h1 class="scene-title">Share Link Method</h1>
                <p class="scene-subtitle">Alternative: Share deal with anyone</p>
            </div>
            
            <div style="background: #e0f2f1; padding: 20px; border-radius: 12px; margin: 20px 0; animation: fadeIn 0.4s ease 0.5s both;">
                <div style="font-weight: 600; margin-bottom: 12px;">🔗 Deal Invitation Link</div>
                <div style="font-size: 13px; color: #00695c; background: white; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace;">
                    https://escrow.africa/invite/deal/ESC789456
                </div>
            </div>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin-bottom: 20px; animation: fadeIn 0.4s ease 0.7s both;">
                <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">📤 Share via</div>
                <div style="font-size: 14px; color: #78350f; line-height: 1.6;">
                    WhatsApp, Email, SMS, or any messaging app
                </div>
            </div>
            
            <button class="btn" style="animation-delay: 0.9s;" id="copyLinkBtn">
                📋 Copy Link to Clipboard
            </button>
        `);
        
        await this.wait(2000);
        
        // Copy link action
        const copyBtn = document.getElementById('copyLinkBtn');
        copyBtn.textContent = '✓ Link Copied!';
        copyBtn.style.background = '#4caf50';
        await this.wait(1200);
        
        this.showToast('Link copied! Share with anyone', '🔗');
        await this.wait(1000);
    }
    
    // STEP 5: Review & Accept (18 seconds)
    async step5_ReviewAccept() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">📋</div>
                <h1 class="scene-title">Review Deal</h1>
                <p class="scene-subtitle">Received from John Mutua</p>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.5s">
                <div class="deal-header">
                    <div>
                        <div class="deal-title">Website Development Project</div>
                        <div class="deal-description">E-commerce website with payment integration</div>
                    </div>
                </div>
                <div class="deal-amount">KES 50,000</div>
                <div class="deal-meta">
                    <span>⏱ 7 days</span>
                    <span>💰 Fee: KES 1,000</span>
                </div>
            </div>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin: 20px 0; animation: fadeIn 0.4s ease 0.7s both;">
                <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">📌 Deal Terms</div>
                <ul style="font-size: 14px; color: #78350f; margin-left: 20px; line-height: 1.8;">
                    <li>Buyer pays KES 51,000 (including fee)</li>
                    <li>Funds locked in escrow</li>
                    <li>7-day delivery timeline</li>
                    <li>Release funds after confirmation</li>
                </ul>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; animation: fadeIn 0.4s ease 0.9s both;">
                <button class="btn btn-secondary">Decline</button>
                <button class="btn btn-success" id="acceptBtn">Accept Deal</button>
            </div>
        `);
        
        await this.wait(6500);
        
        const acceptBtn = document.getElementById('acceptBtn');
        acceptBtn.textContent = 'Accepting...';
        acceptBtn.style.background = '#388e3c';
        await this.wait(2500);
        
        this.showToast('Deal accepted! Waiting for payment...', '✅');
        await this.wait(2000);
    }
    
    // STEP 6: Pay & Escrow (25 seconds - longest, most important)
    async step6_PayEscrow() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">💳</div>
                <h1 class="scene-title">Make Payment</h1>
                <p class="scene-subtitle">Choose your payment method</p>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.5s">
                <div style="text-align: center;">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Amount to Pay</div>
                    <div class="deal-amount">KES 51,000</div>
                    <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Includes KES 1,000 platform fee</div>
                </div>
            </div>
            
            <div class="payment-methods">
                <div class="payment-method" style="animation-delay: 0.7s;" id="mpesa">
                    <div class="payment-icon">📱</div>
                    <div class="payment-name">M-Pesa</div>
                </div>
                <div class="payment-method" style="animation-delay: 0.8s;">
                    <div class="payment-icon">�</div>
                    <div class="payment-name">Airtel Money</div>
                </div>
            </div>
            
            <button class="btn" style="animation-delay: 1.1s;">Continue</button>
        `);
        
        await this.wait(3000);
        
        document.getElementById('mpesa').classList.add('selected');
        await this.wait(2000);
        
        // Show M-Pesa interface
        await this.clearScene();
        this.createScene(`
            <div class="mpesa-interface">
                <div class="mpesa-header">
                    <div class="mpesa-logo">📱</div>
                    <div class="mpesa-title">M-Pesa Payment</div>
                </div>
                
                <div class="mpesa-amount">KES 51,000</div>
                
                <div style="margin: 20px 0;">
                    <input type="tel" class="mpesa-input" id="mpesaPhone" placeholder="Enter M-Pesa number" readonly>
                </div>
                
                <button class="btn btn-success" id="sendPushBtn" style="margin-top: 12px;">
                    Send Payment Request
                </button>
            </div>
        `);
        
        await this.wait(1500);
        await this.typeText(document.getElementById('mpesaPhone'), '0712345678', 90);
        await this.wait(2000);
        
        const pushBtn = document.getElementById('sendPushBtn');
        pushBtn.textContent = 'Sending STK Push...';
        pushBtn.style.background = '#4caf50';
        await this.wait(2500);
        
        this.showToast('Check your phone to complete payment', '📲');
        await this.wait(1500);
        
        // Show M-Pesa OTP/PIN entry
        await this.clearScene();
        this.createScene(`
            <div class="mpesa-interface">
                <div class="mpesa-header">
                    <div class="mpesa-logo">📱</div>
                    <div class="mpesa-title">M-Pesa Confirmation</div>
                </div>
                
                <div class="scene-subtitle" style="text-align: center; margin: 16px 0; color: white; font-weight: 600; font-size: 15px;">Enter your M-Pesa PIN</div>
                
                <div class="otp-container">
                    <input type="password" class="otp-input" maxlength="1" readonly id="pin1">
                    <input type="password" class="otp-input" maxlength="1" readonly id="pin2">
                    <input type="password" class="otp-input" maxlength="1" readonly id="pin3">
                    <input type="password" class="otp-input" maxlength="1" readonly id="pin4">
                </div>
                
                <button class="btn btn-success" style="margin-top: 20px;">Confirm Payment</button>
            </div>
        `);
        
        await this.wait(1500);
        
        // Auto-fill PIN with animation (show dots)
        const pinValues = ['•', '•', '•', '•'];
        for (let i = 0; i < 4; i++) {
            const input = document.getElementById(`pin${i + 1}`);
            input.value = pinValues[i];
            input.classList.add('filled');
            await this.wait(600);
        }
        
        await this.wait(1500);
        
        // Show processing
        await this.clearScene();
        this.createScene(`
            <div class="success-message">
                <div class="success-icon">⏳</div>
                <div class="success-text">Processing Payment...</div>
                <div class="success-subtext">Confirming with M-Pesa</div>
            </div>
        `);
        
        await this.wait(3000);
        
        // Payment success
        await this.clearScene();
        this.createScene(`
            <div class="success-message">
                <div class="success-icon">✅</div>
                <div class="success-text">Payment Successful!</div>
                <div class="success-subtext">Funds secured in escrow</div>
            </div>
            
            <div class="deal-card" style="margin-top: 24px;">
                <div style="text-align: center;">
                    <span class="status-badge status-in-progress" style="font-size: 15px;">
                        🔒 In Progress
                    </span>
                    <div style="margin-top: 16px; font-size: 14px; color: #6b7280;">
                        Deal is now active. Seller can start working.
                    </div>
                </div>
            </div>
        `);
        
        this.showToast('Deal status: In Progress', '🔒');
        await this.wait(2500);
    }
    
    // STEP 7: Complete Deal (20 seconds)
    async step7_CompleteDeal() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">📦</div>
                <h1 class="scene-title">Delivery Complete</h1>
                <p class="scene-subtitle">Seller has delivered the work</p>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.5s">
                <div class="deal-header">
                    <div>
                        <div class="deal-title">Website Development Project</div>
                        <span class="status-badge status-in-progress">🔒 In Progress</span>
                    </div>
                </div>
                <div class="deal-amount">KES 50,000</div>
            </div>
            
            <div style="background: #e0f2f1; padding: 20px; border-radius: 12px; margin: 20px 0; animation: fadeIn 0.4s ease 0.7s both;">
                <div style="font-weight: 600; margin-bottom: 12px;">📨 Message from Seller</div>
                <div style="font-size: 14px; color: #00695c; background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; line-height: 1.6;">
                    "Hi! Website is complete and deployed. Please review and confirm."
                </div>
                <div style="font-size: 13px; color: #6b7280;">
                    📎 website-preview.png<br>
                    📎 admin-credentials.pdf
                </div>
            </div>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin-bottom: 20px; animation: fadeIn 0.4s ease 0.9s both;">
                <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">⚠️ Before Confirming</div>
                <div style="font-size: 14px; color: #78350f; line-height: 1.6;">
                    Verify the work meets your requirements. Once confirmed, funds will be released.
                </div>
            </div>
            
            <button class="btn btn-success" id="confirmBtn" style="animation-delay: 1.1s;">
                ✓ Confirm & Release Funds
            </button>
        `);
        
        await this.wait(7000);
        
        const confirmBtn = document.getElementById('confirmBtn');
        confirmBtn.textContent = 'Processing...';
        confirmBtn.style.background = '#388e3c';
        await this.wait(2500);
        
        // Show success
        await this.clearScene();
        this.createScene(`
            <div class="success-message">
                <div class="success-icon">🎉</div>
                <div class="success-text">Deal Completed!</div>
                <div class="success-subtext">Funds released to seller</div>
            </div>
            
            <div class="deal-card" style="margin-top: 24px;">
                <div style="text-align: center;">
                    <span class="status-badge status-completed" style="font-size: 15px;">
                        ✅ Completed
                    </span>
                    <div style="margin-top: 16px;">
                        <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Seller Received</div>
                        <div style="font-size: 24px; font-weight: 700; color: #00897b;">KES 49,000</div>
                        <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">
                            (KES 50,000 - KES 1,000 fee)
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        this.showToast('Transaction completed successfully!', '🎉');
        await this.wait(3000);
    }
    
    // STEP 8: Withdraw Funds (18 seconds)
    async step8_Withdraw() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">💰</div>
                <h1 class="scene-title">Withdraw Earnings</h1>
                <p class="scene-subtitle">Transfer to Mobile Money</p>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.5s">
                <div style="text-align: center;">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Available Balance</div>
                    <div class="deal-amount">KES 49,000</div>
                </div>
            </div>
            
            <div class="form-group" style="animation-delay: 0.7s">
                <label class="form-label">Withdrawal Amount</label>
                <input type="text" class="form-input" id="withdrawAmount" placeholder="Enter amount" readonly>
            </div>
            
            <div class="form-group" style="animation-delay: 0.8s">
                <label class="form-label">M-Pesa Number</label>
                <input type="tel" class="form-input" id="withdrawPhone" placeholder="+254 712 345 678" readonly>
            </div>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin: 20px 0; animation: fadeIn 0.4s ease 0.9s both;">
                <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">🔒 First-Time Verification</div>
                <div style="font-size: 14px; color: #78350f;">
                    For security, first withdrawal requires ID verification.
                </div>
            </div>
            
            <button class="btn" id="verifyBtn" style="animation-delay: 1s;">
                Verify Identity
            </button>
        `);
        
        await this.wait(1800);
        await this.typeText(document.getElementById('withdrawAmount'), '49000', 90);
        await this.wait(1200);
        await this.typeText(document.getElementById('withdrawPhone'), '+254712345678', 75);
        await this.wait(2000);
        
        const verifyBtn = document.getElementById('verifyBtn');
        verifyBtn.textContent = 'Verifying...';
        verifyBtn.style.background = '#ff9800';
        await this.wait(2500);
        
        // Show verification success
        await this.clearScene();
        this.createScene(`
            <div class="success-message">
                <div class="success-icon">✅</div>
                <div class="success-text">Verification Complete</div>
                <div class="success-subtext">Processing withdrawal...</div>
            </div>
        `);
        
        await this.wait(2500);
        
        // Withdrawal success
        await this.clearScene();
        this.createScene(`
            <div class="success-message">
                <div class="success-icon">💸</div>
                <div class="success-text">Withdrawal Successful!</div>
                <div class="success-subtext">KES 49,000 sent to M-Pesa</div>
            </div>
            
            <div class="deal-card" style="margin-top: 24px;">
                <div style="padding: 16px; text-align: center;">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
                        Transaction Reference
                    </div>
                    <div style="font-family: monospace; font-size: 16px; font-weight: 700; color: #00897b;">
                        MP89XYZ123456
                    </div>
                </div>
            </div>
        `);
        
        this.showToast('Funds sent to your M-Pesa account', '💸');
        await this.wait(2500);
    }
    
    // STEP 9: Dispute (15 seconds)
    async step9_Dispute() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">⚠️</div>
                <h1 class="scene-title">Dispute Resolution</h1>
                <p class="scene-subtitle">When issues arise</p>
            </div>
            
            <div class="deal-card" style="animation-delay: 0.5s">
                <div class="deal-header">
                    <div>
                        <div class="deal-title">Incomplete Work</div>
                        <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Deal ID: ESC456123</div>
                    </div>
                    <span class="status-badge status-disputed">⚠️ Disputed</span>
                </div>
                <div class="deal-amount">KES 30,000</div>
            </div>
            
            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin: 20px 0; animation: fadeIn 0.4s ease 0.7s both;">
                <div style="font-weight: 600; color: #991b1b; margin-bottom: 12px;">📋 Dispute Reason</div>
                <div style="font-size: 14px; color: #7f1d1d; background: white; padding: 12px; border-radius: 8px; line-height: 1.6;">
                    "Product doesn't match description. Missing key features."
                </div>
            </div>
            
            <div style="background: #dbeafe; padding: 16px; border-radius: 12px; animation: fadeIn 0.4s ease 0.9s both;">
                <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">🔍 Resolution Process</div>
                <div style="font-size: 14px; color: #1e3a8a; line-height: 1.6;">
                    Team reviews evidence from both parties for a fair decision.
                </div>
            </div>
        `);
        
        await this.wait(6000);
        
        // Show resolution
        await this.clearScene();
        this.createScene(`
            <div class="success-message">
                <div class="success-icon">⚖️</div>
                <div class="success-text">Dispute Resolved</div>
                <div class="success-subtext">Decision: Partial refund approved</div>
            </div>
            
            <div class="deal-card" style="margin-top: 24px;">
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 14px; color: #1f2937; background: #f3f4f6; padding: 16px; border-radius: 8px; line-height: 1.8;">
                        60% of work completed satisfactorily.<br><br>
                        <strong>Buyer receives:</strong> KES 12,000<br>
                        <strong>Seller keeps:</strong> KES 18,000
                    </div>
                </div>
            </div>
        `);
        
        this.showToast('Dispute resolved fairly', '✅');
        await this.wait(2500);
    }
    
    async showCompletion() {
        await this.clearScene();
        
        this.createScene(`
            <div class="scene-header">
                <div class="scene-icon">🎬</div>
                <h1 class="scene-title">Demo Complete!</h1>
                <p class="scene-subtitle">Escrow Africa - Safe Transactions</p>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
                <div style="font-size: 18px; font-weight: 600; color: #00897b; margin-bottom: 24px; line-height: 2;">
                    ✓ Secure Escrow<br>
                    ✓ Mobile Money Integration<br>
                    ✓ Dispute Resolution<br>
                    ✓ 2% Platform Fee
                </div>
                
                <div style="font-size: 32px; margin: 32px 0;">
                    🇰🇪
                </div>
                
                <div style="font-size: 24px; font-weight: 700; color: #1f2937;">
                    Escrow Africa
                </div>
                <div style="font-size: 16px; color: #6b7280; margin-top: 8px;">
                    Your trusted escrow partner
                </div>
            </div>
        `);
        
        document.getElementById('controls').style.opacity = '1';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('startBtn').textContent = '↻ Replay Demo';
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    new VideoDemo();
});
