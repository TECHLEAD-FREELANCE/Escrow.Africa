// Deals Page - Lists all user deals with filtering
class Deals {
    constructor() {
        this.deals = [];
        this.users = [];
        this.currentUser = null;
        this.currentTab = 'active';
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        await this.loadData();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            const [dealsResponse, usersResponse] = await Promise.all([
                fetch('../data/deals.json'),
                fetch('../data/users.json')
            ]);

            const dealsData = await dealsResponse.json();
            const usersData = await usersResponse.json();

            // Handle both array and object with deals property
            let allDeals = Array.isArray(dealsData) ? dealsData : (dealsData.deals || []);
            const usersArray = Array.isArray(usersData) ? usersData : (usersData.users || []);
            this.users = usersArray;

            // Load deals from localStorage and merge with JSON deals
            const localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            allDeals = [...localDeals, ...allDeals];

            // Filter deals where current user is involved
            this.deals = allDeals.filter(deal => 
                deal.buyerId === this.currentUser.id || deal.sellerId === this.currentUser.id
            );

            this.renderDeals();
        } catch (error) {
            console.error('Error loading deals:', error);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.renderDeals();
            });
        });
    }

    renderDeals() {
        const container = document.getElementById('dealsContainer');
        let filteredDeals = this.deals;

        if (this.currentTab === 'active') {
            filteredDeals = this.deals.filter(d => 
                d.status !== 'completed' && d.status !== 'disputed'
            );
        } else if (this.currentTab === 'completed') {
            filteredDeals = this.deals.filter(d => d.status === 'completed');
        }

        if (filteredDeals.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 60px 20px; text-align: center;">
                    <p style="font-size: 64px; margin-bottom: 16px;">📄</p>
                    <h3>No ${this.currentTab} deals</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">
                        ${this.currentTab === 'active' ? 'Create a new deal to get started!' : 'Your completed deals will appear here'}
                    </p>
                    ${this.currentTab === 'active' ? '<a href="deal-create.html" class="btn-primary" style="display: inline-block; margin-top: 20px; text-decoration: none;">Create Deal</a>' : ''}
                </div>
            `;
            return;
        }

        container.innerHTML = filteredDeals.map(deal => {
            const dealId = deal.id || deal.dealId;
            const otherPartyId = deal.buyerId === this.currentUser.id ? deal.sellerId : deal.buyerId;
            const otherParty = this.users.find(u => u.id === otherPartyId);
            const role = deal.buyerId === this.currentUser.id ? 'Buyer' : 'Seller';

            return `
                <a href="deal-detail.html?id=${dealId}" class="deal-card" style="display: block; text-decoration: none; color: inherit; background: white; padding: 16px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div style="flex: 1;">
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${deal.title}</h3>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">${deal.description}</p>
                        </div>
                        <span class="status-badge status-${deal.status}" style="white-space: nowrap; margin-left: 12px;">
                            ${this.getStatusIcon(deal.status)} ${this.getStatusText(deal.status)}
                        </span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600;">
                                ${otherParty ? otherParty.fullName.charAt(0) : '?'}
                            </div>
                            <div>
                                <div style="font-size: 14px; font-weight: 500;">${otherParty ? otherParty.fullName : 'Unknown'}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">You are ${role}</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 18px; font-weight: 700; color: var(--primary-color);">KES ${deal.amount.toLocaleString()}</div>
                            <div style="font-size: 12px; color: var(--text-secondary);">${new Date(deal.createdDate || deal.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    getStatusIcon(status) {
        const icons = {
            'pending-acceptance': '⏳',
            'pending-payment': '💳',
            'in-progress': '🔄',
            'completed': '✅',
            'disputed': '⚠️'
        };
        return icons[status] || '📄';
    }

    getStatusText(status) {
        const texts = {
            'pending-acceptance': 'Pending',
            'pending-payment': 'Payment Due',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'disputed': 'Disputed'
        };
        return texts[status] || status;
    }
}

new Deals();
