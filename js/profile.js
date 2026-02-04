// Profile Page - Display and edit user profile
class Profile {
    constructor() {
        this.currentUser = null;
        this.viewingUser = null;
        this.isEditMode = false;
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        
        // Check if viewing another user's profile
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        
        if (userId && userId !== this.currentUser.id) {
            await this.loadUserProfile(userId);
        } else {
            this.viewingUser = this.currentUser;
        }
        
        this.renderProfile();
    }

    async loadUserProfile(userId) {
        try {
            const response = await fetch('../data/users.json');
            const users = await response.json();
            this.viewingUser = users.find(u => u.id === userId);
            
            if (!this.viewingUser) {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    renderProfile() {
        const container = document.getElementById('profileContainer');
        const isOwnProfile = this.viewingUser.id === this.currentUser.id;

        container.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: 600; margin: 0 auto 16px;">
                        ${this.viewingUser.fullName.charAt(0)}
                    </div>
                    <h2 style="margin-bottom: 4px;">${this.viewingUser.fullName}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 8px;">@${this.viewingUser.username}</p>
                    ${this.viewingUser.verified ? '<span style="background: var(--success-light); color: var(--success-color); padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">✓ Verified</span>' : ''}
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--accent-color); margin-bottom: 4px;">⭐ ${this.viewingUser.rating}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">Rating</div>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--primary-color); margin-bottom: 4px;">${this.viewingUser.completedDeals}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">Deals</div>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--success-color); margin-bottom: 4px;">2y</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">Member</div>
                    </div>
                </div>

                ${isOwnProfile ? this.renderOwnProfile() : this.renderOtherProfile()}
            </div>
        `;

        this.setupEventListeners();
    }

    renderOwnProfile() {
        return `
            <div class="form-section" style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3>Personal Information</h3>
                    <button class="btn-secondary" id="editBtn" style="padding: 8px 16px; font-size: 14px;">
                        ${this.isEditMode ? 'Cancel' : '✏️ Edit'}
                    </button>
                </div>

                <div style="margin-bottom: 16px;">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="fullName" class="form-input" value="${this.viewingUser.fullName}" ${this.isEditMode ? '' : 'disabled'}>
                </div>

                <div style="margin-bottom: 16px;">
                    <label class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" value="${this.viewingUser.email || 'john.kamau@example.com'}" ${this.isEditMode ? '' : 'disabled'}>
                </div>

                <div style="margin-bottom: 16px;">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" id="phone" class="form-input" value="${this.viewingUser.phone || '+254712345678'}" ${this.isEditMode ? '' : 'disabled'}>
                </div>

                ${this.isEditMode ? `
                    <button class="btn-primary" style="width: 100%;" onclick="profile.saveProfile()">
                        Save Changes
                    </button>
                ` : ''}
            </div>

            <div class="form-section" style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 16px;">Settings</h3>
                
                <button class="setting-item" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-secondary); border: none; border-radius: 8px; margin-bottom: 12px; cursor: pointer; text-align: left;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">🔒 Change Password</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">Update your password</div>
                    </div>
                    <span>›</span>
                </button>

                <button class="setting-item" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-secondary); border: none; border-radius: 8px; margin-bottom: 12px; cursor: pointer; text-align: left;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">🔔 Notifications</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">Manage notification preferences</div>
                    </div>
                    <span>›</span>
                </button>

                <button class="setting-item" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-secondary); border: none; border-radius: 8px; margin-bottom: 12px; cursor: pointer; text-align: left;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">🌐 Language</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">English</div>
                    </div>
                    <span>›</span>
                </button>
            </div>

            <button class="btn-secondary" style="width: 100%; background: var(--error-light); color: var(--error-color); border: none;" onclick="profile.logout()">
                🚪 Logout
            </button>
        `;
    }

    renderOtherProfile() {
        return `
            <div style="display: flex; gap: 12px;">
                <a href="chat.html?userId=${this.viewingUser.id}" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none;">
                    💬 Send Message
                </a>
                <a href="deal-create.html?userId=${this.viewingUser.id}" class="btn-secondary" style="flex: 1; text-align: center; text-decoration: none;">
                    📄 Create Deal
                </a>
            </div>
        `;
    }

    setupEventListeners() {
        const editBtn = document.getElementById('editBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.isEditMode = !this.isEditMode;
                this.renderProfile();
            });
        }
    }

    saveProfile() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (!fullName || !email || !phone) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        // Simulate saving
        this.viewingUser.fullName = fullName;
        this.viewingUser.email = email;
        this.viewingUser.phone = phone;

        this.showToast('Profile updated successfully', 'success');
        this.isEditMode = false;
        this.renderProfile();
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            Auth.logout();
        }
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

const profile = new Profile();
