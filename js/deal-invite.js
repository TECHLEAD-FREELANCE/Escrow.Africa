// Deal Invite Page - Handle new user signup from deal invitation
class DealInvite {
    constructor() {
        this.dealId = null;
        this.deal = null;
        this.init();
    }

    async init() {
        // Get deal data from URL
        const urlParams = new URLSearchParams(window.location.search);
        const dealData = urlParams.get('data');
        const dealId = urlParams.get('id');

        if (dealData) {
            // Decode deal data from URL (new format)
            try {
                this.deal = JSON.parse(atob(dealData));
                this.dealId = this.deal.dealId;
            } catch (error) {
                console.error('Error decoding deal data:', error);
                this.renderError();
                return;
            }
        } else if (dealId) {
            // Legacy format - try to load from storage
            this.dealId = dealId;
            await this.loadDeal();
            return;
        } else {
            window.location.href = '../index.html';
            return;
        }

        // Check if user is logged in
        const currentUser = Auth.getCurrentUser(false);
        if (currentUser) {
            // User already logged in, redirect to deal detail
            // But first save the deal to their localStorage
            const localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            const exists = localDeals.find(d => d.dealId === this.deal.dealId);
            if (!exists) {
                localDeals.unshift(this.deal);
                localStorage.setItem('userDeals', JSON.stringify(localDeals));
            }
            window.location.href = `deal-detail.html?id=${this.dealId}`;
        } else {
            this.renderInvite();
        }
    }

    async loadDeal() {
        try {
            // Load from localStorage first (newly created deals)
            const localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            this.deal = localDeals.find(d => d.dealId === this.dealId);

            // If not found, load from JSON
            if (!this.deal) {
                const response = await fetch('../data/deals.json');
                const dealsData = await response.json();
                const allDeals = Array.isArray(dealsData) ? dealsData : (dealsData.deals || []);
                this.deal = allDeals.find(d => (d.dealId === this.dealId || d.id === this.dealId));
            }

            if (!this.deal) {
                this.renderError();
                return;
            }

            // Check if user is logged in
            const currentUser = Auth.getCurrentUser(false);
            if (currentUser) {
                // User already logged in, redirect to deal detail
                window.location.href = `deal-detail.html?id=${this.dealId}`;
            } else {
                this.renderInvite();
            }
        } catch (error) {
            console.error('Error loading deal:', error);
            this.renderError();
        }
    }

    renderInvite() {
        const container = document.getElementById('inviteContainer');
        container.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #0D9488, #14B8A6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 16px rgba(13, 148, 136, 0.3);">
                        <span style="font-size: 40px;">🤝</span>
                    </div>
                    <h1 style="font-size: 28px; margin-bottom: 8px; color: var(--text-primary);">You're Invited!</h1>
                    <p style="color: var(--text-secondary); font-size: 16px;">${this.deal.buyerName} wants to create an escrow deal with you</p>
                </div>

                <div style="background: var(--bg-secondary); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                    <h3 style="font-size: 18px; margin-bottom: 12px; color: var(--primary-color);">📋 Deal Details</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-secondary);">Title:</span>
                        <span style="font-weight: 600;">${this.deal.title}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-secondary);">Amount:</span>
                        <span style="font-weight: 700; color: var(--primary-color); font-size: 18px;">KES ${this.deal.amount.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-secondary);">Timeline:</span>
                        <span style="font-weight: 600;">${this.deal.timeline}</span>
                    </div>
                    ${this.deal.description ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">${this.deal.description}</p>
                        </div>
                    ` : ''}
                </div>

                <div style="background: #e0f2f1; padding: 16px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid var(--primary-color);">
                    <div style="display: flex; align-items: start; gap: 12px;">
                        <span style="font-size: 24px;">🔒</span>
                        <div>
                            <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">Secure Escrow Protection</h4>
                            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">Your money is held safely until both parties fulfill their obligations</p>
                        </div>
                    </div>
                </div>

                <div id="signupForm">
                    <h3 style="font-size: 18px; margin-bottom: 16px;">Join Escrow Africa</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" id="fullName" class="form-input" placeholder="Enter your full name">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Username *</label>
                        <input type="text" id="username" class="form-input" placeholder="Choose a username">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" id="phone" class="form-input" placeholder="07XXXXXXXX">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Password *</label>
                        <input type="password" id="password" class="form-input" placeholder="Create a password">
                    </div>

                    <button class="btn-primary" style="width: 100%; padding: 16px; font-size: 16px; margin-top: 8px;" onclick="dealInvite.signup()">
                        Accept & Join Deal
                    </button>

                    <p style="text-align: center; margin-top: 16px; font-size: 13px; color: var(--text-secondary);">
                        Already have an account? <a href="../index.html" style="color: var(--primary-color); font-weight: 600;">Login</a>
                    </p>
                </div>
            </div>
        `;
    }

    signup() {
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;

        if (!fullName || !username || !phone || !password) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            fullName: fullName,
            username: username,
            phone: phone,
            email: username + '@escrow.africa',
            password: password,
            walletBalance: 0,
            verified: false,
            rating: 0,
            completedDeals: 0,
            avatar: fullName.charAt(0).toUpperCase()
        };

        // Save user to localStorage
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        // Update deal with new seller ID
        this.deal.sellerId = newUser.id;
        this.deal.sellerName = fullName;
        this.deal.status = 'pending-payment';

        // Save updated deal
        const localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
        const dealIndex = localDeals.findIndex(d => d.dealId === this.dealId);
        if (dealIndex !== -1) {
            localDeals[dealIndex] = this.deal;
        } else {
            localDeals.unshift(this.deal);
        }
        localStorage.setItem('userDeals', JSON.stringify(localDeals));

        // Login the new user
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));

        this.showSuccess();
    }

    showSuccess() {
        const container = document.getElementById('inviteContainer');
        container.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; animation: scaleIn 0.5s ease;">
                    <span style="font-size: 56px; color: white;">✓</span>
                </div>
                <h2 style="font-size: 28px; margin-bottom: 12px; color: var(--success-color);">Welcome to Escrow Africa!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 32px; font-size: 16px;">Your account has been created and you've joined the deal</p>
                
                <div style="background: var(--bg-secondary); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">You're now part of:</p>
                    <h3 style="font-size: 20px; color: var(--primary-color); margin-bottom: 8px;">${this.deal.title}</h3>
                    <p style="font-size: 24px; font-weight: 700;">KES ${this.deal.amount.toLocaleString()}</p>
                </div>

                <button class="btn-primary" style="width: 100%; padding: 16px; font-size: 16px;" onclick="window.location.href='deal-detail.html?id=${this.dealId}'">
                    View Deal Details
                </button>
            </div>
        `;
    }

    renderError() {
        const container = document.getElementById('inviteContainer');
        container.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">❌</div>
                <h2 style="margin-bottom: 12px;">Deal Not Found</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">This deal link is invalid or has expired</p>
                <a href="../index.html" class="btn-primary" style="display: inline-block; text-decoration: none; padding: 12px 32px;">
                    Go to Home
                </a>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

const dealInvite = new DealInvite();
