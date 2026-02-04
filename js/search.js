// Search Page - Search for users by username
class Search {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        await this.loadUsers();
        this.setupEventListeners();
    }

    async loadUsers() {
        try {
            const response = await fetch('../data/users.json');
            const usersData = await response.json();
            // Ensure data is in array format
            const usersArray = Array.isArray(usersData) ? usersData : [];
            // Exclude current user from results
            this.users = usersArray.filter(u => u.id !== this.currentUser.id);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchUsers(e.target.value);
        });
    }

    searchUsers(query) {
        const container = document.getElementById('searchResults');

        if (!query || query.trim() === '') {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px; text-align: center;">
                    <p style="font-size: 48px; margin-bottom: 16px;">👥</p>
                    <h3>Search for Users</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Enter a username to find other users</p>
                </div>
            `;
            return;
        }

        const filtered = this.users.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.fullName.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px; text-align: center;">
                    <p style="font-size: 48px; margin-bottom: 16px;">🔍</p>
                    <h3>No users found</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Try a different search term</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(user => `
            <div class="user-result-card" style="background: white; padding: 16px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 600;">
                        ${user.fullName.charAt(0)}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 4px;">${user.fullName}</div>
                        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">@${user.username}</div>
                        <div style="display: flex; gap: 12px; font-size: 13px;">
                            <span style="color: var(--accent-color);">⭐ ${user.rating}</span>
                            <span style="color: var(--text-secondary);">📦 ${user.completedDeals} deals</span>
                            ${user.verified ? '<span style="color: var(--success-color);">✓ Verified</span>' : ''}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <a href="chat.html?userId=${user.id}" class="btn-primary" style="padding: 8px 16px; text-decoration: none; font-size: 14px; text-align: center; white-space: nowrap;">
                            Chat
                        </a>
                        <a href="profile.html?userId=${user.id}" class="btn-secondary" style="padding: 8px 16px; text-decoration: none; font-size: 14px; text-align: center; white-space: nowrap;">
                            View Profile
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

new Search();
