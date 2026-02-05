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
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${this.viewingUser.fullName.charAt(0)}
                    </div>
                    <h2 class="profile-name">${this.viewingUser.fullName}</h2>
                    <p class="profile-username">@${this.viewingUser.username}</p>
                    ${this.viewingUser.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                </div>

                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-value rating">⭐ ${this.viewingUser.rating || 'undefined'}</div>
                        <div class="stat-label">Rating</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value deals">${this.viewingUser.completedDeals || 'undefined'}</div>
                        <div class="stat-label">Deals</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value member">2y</div>
                        <div class="stat-label">Member</div>
                    </div>
                </div>

                ${isOwnProfile ? this.renderOwnProfile() : this.renderOtherProfile()}
            </div>
        `;

        this.setupEventListeners();
    }

    renderOwnProfile() {
        return `
            <div class="profile-section">
                <div class="section-header">
                    <h3>Personal Information</h3>
                    <button class="btn-edit" id="editBtn">
                        ${this.isEditMode ? 'Cancel' : '✏️ Edit'}
                    </button>
                </div>

                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="fullName" class="form-input" value="${this.viewingUser.fullName}" ${this.isEditMode ? '' : 'disabled'}>
                </div>

                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" value="${this.viewingUser.email || 'john.kamau@example.com'}" ${this.isEditMode ? '' : 'disabled'}>
                </div>

                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" id="phone" class="form-input" value="${this.viewingUser.phone || '+254712345678'}" ${this.isEditMode ? '' : 'disabled'}>
                </div>

                ${this.isEditMode ? `
                    <button class="btn-primary" style="width: 100%; margin-top: 16px;" onclick="profile.saveProfile()">
                        Save Changes
                    </button>
                ` : ''}
            </div>

            <div class="profile-section">
                <h3 style="margin-bottom: 16px;">Settings</h3>
                
                <button class="setting-item">
                    <div class="setting-content">
                        <div class="setting-title">🔒 Change Password</div>
                        <div class="setting-desc">Update your password</div>
                    </div>
                    <span class="setting-arrow">›</span>
                </button>

                <button class="setting-item">
                    <div class="setting-content">
                        <div class="setting-title">🔔 Notifications</div>
                        <div class="setting-desc">Manage notification preferences</div>
                    </div>
                    <span class="setting-arrow">›</span>
                </button>

                <button class="setting-item">
                    <div class="setting-content">
                        <div class="setting-title">🌐 Language</div>
                        <div class="setting-desc">English</div>
                    </div>
                    <span class="setting-arrow">›</span>
                </button>
            </div>

            <button class="btn-logout" onclick="profile.logout()">
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
