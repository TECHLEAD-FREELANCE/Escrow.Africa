// Dashboard Module
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.deals = [];
        this.notifications = [];
        this.init();
    }

    async init() {
        // Require authentication
        this.currentUser = Auth.requireAuth();
        
        // Load data
        await this.loadData();
        
        // Initialize UI
        this.initializeUI();
        this.loadRecentActivity();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            // Load deals
            const dealsResponse = await fetch('../data/deals.json');
            const dealsData = await dealsResponse.json();
            let allDeals = Array.isArray(dealsData) ? dealsData : (dealsData.deals || []);
            
            // Load deals from localStorage and merge
            const localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            allDeals = [...localDeals, ...allDeals];
            
            this.deals = allDeals;

            // Load notifications
            const notificationsResponse = await fetch('../data/notifications.json');
            const notificationsData = await notificationsResponse.json();
            const notificationsArray = Array.isArray(notificationsData) ? notificationsData : (notificationsData.notifications || []);
            this.notifications = notificationsArray.filter(
                n => n.userId === this.currentUser.id
            );
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    initializeUI() {
        // Set user avatar
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.textContent = this.currentUser.avatar;
        }

        // Update notification badge
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            if (unreadCount > 0) {
                notificationBadge.textContent = unreadCount;
                notificationBadge.style.display = 'flex';
            } else {
                notificationBadge.style.display = 'none';
            }
        }

        // Set search input handler
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('click', () => {
                window.location.href = 'search.html';
            });
            searchInput.addEventListener('focus', () => {
                window.location.href = 'search.html';
            });
        }
    }

    loadRecentActivity() {
        const container = document.getElementById('recentActivityContainer');
        if (!container) return;

        // Get user's recent deals
        const userDeals = this.deals.filter(deal => 
            deal.buyerId === this.currentUser.id || deal.sellerId === this.currentUser.id
        ).slice(0, 5);

        if (userDeals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No recent activity</p>
                    <a href="deal-create.html" class="btn-primary">Create Your First Deal</a>
                </div>
            `;
            return;
        }

        container.innerHTML = userDeals.map(deal => {
            const statusClass = this.getStatusClass(deal.status);
            const statusText = this.getStatusText(deal.status);
            const isBuyer = deal.buyerId === this.currentUser.id;
            const otherParty = isBuyer ? deal.sellerName : deal.buyerName;

            return `
                <a href="deal-detail.html?id=${deal.dealId}" class="activity-item">
                    <div class="activity-icon ${statusClass}">
                        ${this.getStatusIcon(deal.status)}
                    </div>
                    <div class="activity-content">
                        <h3 class="activity-title">${deal.title}</h3>
                        <p class="activity-meta">
                            ${isBuyer ? 'Buying from' : 'Selling to'} ${otherParty}
                        </p>
                        <div class="activity-footer">
                            <span class="activity-amount">KES ${deal.amount.toLocaleString()}</span>
                            <span class="activity-status ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                    <span class="activity-arrow">›</span>
                </a>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Menu button
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.toggleMenu());
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // User avatar click
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }
    }

    toggleMenu() {
        // Create overlay menu
        const existingMenu = document.querySelector('.side-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'side-menu';
        menu.innerHTML = `
            <div class="menu-overlay"></div>
            <div class="menu-content">
                <div class="menu-header">
                    <div class="menu-user-info">
                        <div class="menu-avatar">${this.currentUser.avatar}</div>
                        <div class="menu-user-details">
                            <h3>${this.currentUser.fullName}</h3>
                            <p>@${this.currentUser.username}</p>
                        </div>
                    </div>
                    <button class="menu-close">✕</button>
                </div>
                <nav class="menu-nav">
                    <a href="dashboard.html" class="menu-link">🏠 Home</a>
                    <a href="deals.html" class="menu-link">📄 My Deals</a>
                    <a href="wallet.html" class="menu-link">💰 Wallet</a>
                    <a href="history.html" class="menu-link">📜 History</a>
                    <a href="profile.html" class="menu-link">👤 Profile</a>
                    <a href="#" class="menu-link">⚙️ Settings</a>
                    <a href="#" class="menu-link" id="logoutBtn">🚪 Logout</a>
                </nav>
            </div>
        `;
        document.body.appendChild(menu);

        setTimeout(() => menu.classList.add('show'), 10);

        // Close menu handlers
        menu.querySelector('.menu-overlay').addEventListener('click', () => {
            menu.classList.remove('show');
            setTimeout(() => menu.remove(), 300);
        });
        menu.querySelector('.menu-close').addEventListener('click', () => {
            menu.classList.remove('show');
            setTimeout(() => menu.remove(), 300);
        });

        // Logout handler
        menu.querySelector('#logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    showNotifications() {
        const modal = document.createElement('div');
        modal.className = 'notification-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Notifications</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="notification-list">
                    ${this.notifications.length === 0 ? 
                        '<p class="empty-state">No notifications</p>' :
                        this.notifications.map(n => `
                            <div class="notification-item ${n.read ? 'read' : 'unread'}">
                                <div class="notification-icon">${this.getNotificationIcon(n.type)}</div>
                                <div class="notification-content">
                                    <h4>${n.title}</h4>
                                    <p>${n.message}</p>
                                    <span class="notification-time">${this.formatTime(n.timestamp)}</span>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 10);

        // Close handlers
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    getStatusClass(status) {
        const statusMap = {
            'pending-acceptance': 'status-pending',
            'pending-payment': 'status-pending',
            'in-progress': 'status-progress',
            'completed': 'status-completed',
            'disputed': 'status-disputed'
        };
        return statusMap[status] || 'status-default';
    }

    getStatusText(status) {
        const textMap = {
            'pending-acceptance': 'Pending',
            'pending-payment': 'Awaiting Payment',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'disputed': 'Disputed'
        };
        return textMap[status] || status;
    }

    getStatusIcon(status) {
        const iconMap = {
            'pending-acceptance': '⏳',
            'pending-payment': '💳',
            'in-progress': '🔄',
            'completed': '✅',
            'disputed': '⚠️'
        };
        return iconMap[status] || '📄';
    }

    getNotificationIcon(type) {
        const iconMap = {
            'deal-created': '📄',
            'deal-paid': '💰',
            'deal-accepted': '✅',
            'message': '💬',
            'dispute-raised': '⚠️'
        };
        return iconMap[type] || '🔔';
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }
}

// Initialize dashboard
const dashboard = new Dashboard();
