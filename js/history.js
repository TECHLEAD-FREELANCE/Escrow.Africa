// History Page - View completed deals and transactions
class History {
    constructor() {
        this.currentUser = null;
        this.deals = [];
        this.transactions = [];
        this.users = [];
        this.currentFilter = 'all';
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
            const [dealsResponse, transactionsResponse, usersResponse] = await Promise.all([
                fetch('../data/deals.json'),
                fetch('../data/transactions.json'),
                fetch('../data/users.json')
            ]);

            const dealsData = await dealsResponse.json();
            const transactionsData = await transactionsResponse.json();
            const usersData = await usersResponse.json();

            // Ensure data is in array format
            let allDeals = Array.isArray(dealsData) ? dealsData : (dealsData.deals || []);
            const transactionsArray = Array.isArray(transactionsData) ? transactionsData : (transactionsData.transactions || []);
            const usersArray = Array.isArray(usersData) ? usersData : (usersData.users || []);
            this.users = usersArray;

            // Load deals from localStorage and merge
            let localDeals = [];
            try {
                localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            } catch (error) {
                console.error('Error parsing userDeals:', error);
                localStorage.removeItem('userDeals');
            }
            allDeals = [...localDeals, ...allDeals];

            // Filter completed deals and user transactions
            this.deals = allDeals.filter(deal => 
                deal.status === 'completed' && 
                (deal.buyerId == this.currentUser.id || deal.sellerId == this.currentUser.id)
            );

            this.transactions = transactionsArray.filter(t => 
                t.userId == this.currentUser.id
            );

            this.renderHistory();
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.renderHistory();
            });
        });
    }

    renderHistory() {
        const container = document.getElementById('historyContainer');

        if (this.currentFilter === 'all') {
            this.renderAll(container);
        } else if (this.currentFilter === 'deals') {
            this.renderDeals(container);
        } else if (this.currentFilter === 'transactions') {
            this.renderTransactions(container);
        }
    }

    renderAll(container) {
        const totalDeals = this.deals.length;
        const totalAmount = this.deals.reduce((sum, deal) => sum + deal.amount, 0);

        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                <h3 style="margin-bottom: 16px;">Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 28px; font-weight: 700; color: var(--primary-color); margin-bottom: 4px;">${totalDeals}</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">Completed Deals</div>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 28px; font-weight: 700; color: var(--success-color); margin-bottom: 4px;">${this.transactions.length}</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">Transactions</div>
                    </div>
                </div>
                <div style="background: linear-gradient(135deg, #0D9488, #14B8A6); color: white; padding: 20px; border-radius: 8px; margin-top: 16px; text-align: center;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Total Deal Value</div>
                    <div style="font-size: 32px; font-weight: 700;">KES ${totalAmount.toLocaleString()}</div>
                </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                <h3 style="margin-bottom: 16px;">Recent Activity</h3>
                ${this.renderMixedHistory()}
            </div>
        `;
    }

    renderMixedHistory() {
        const combined = [
            ...this.deals.map(d => ({ ...d, type: 'deal', timestamp: d.createdAt })),
            ...this.transactions.map(t => ({ ...t, type: 'transaction' }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

        if (combined.length === 0) {
            return `
                <div style="padding: 40px 20px; text-align: center;">
                    <p style="font-size: 48px; margin-bottom: 16px;">📋</p>
                    <p style="color: var(--text-secondary);">No history yet</p>
                </div>
            `;
        }

        return combined.map(item => {
            if (item.type === 'deal') {
                const otherPartyId = item.buyerId == this.currentUser.id ? item.sellerId : item.buyerId;
                const otherParty = this.users.find(u => u.id == otherPartyId);

                return `
                    <a href="deal-detail.html?id=${item.id}" style="display: block; padding: 16px 0; border-bottom: 1px solid var(--border-color); text-decoration: none; color: inherit;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--success-light); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                    ✅
                                </div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">${item.title}</div>
                                    <div style="font-size: 13px; color: var(--text-secondary);">
                                        with ${otherParty ? otherParty.fullName : 'Unknown'}
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                                        ${new Date(item.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 700; color: var(--success-color);">KES ${item.amount.toLocaleString()}</div>
                            </div>
                        </div>
                    </a>
                `;
            } else {
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${this.getTransactionColor(item.type)}20; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                ${this.getTransactionIcon(item.type)}
                            </div>
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">${this.getTransactionText(item.type)}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">
                                    ${item.method}
                                </div>
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                                    ${new Date(item.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div style="font-weight: 700; color: ${item.type === 'withdrawal' ? 'var(--error-color)' : 'var(--success-color)'};">
                            ${item.type === 'withdrawal' ? '-' : '+'}KES ${item.amount.toLocaleString()}
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    renderDeals(container) {
        if (this.deals.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 60px 20px; text-align: center;">
                    <p style="font-size: 64px; margin-bottom: 16px;">📦</p>
                    <h3>No Completed Deals</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Your completed deals will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 12px;">
                <h3 style="margin-bottom: 16px;">Completed Deals</h3>
                ${this.deals.map(deal => {
                    const otherPartyId = deal.buyerId == this.currentUser.id ? deal.sellerId : deal.buyerId;
                    const otherParty = this.users.find(u => u.id == otherPartyId);

                    return `
                        <a href="deal-detail.html?id=${deal.id}" style="display: block; padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 12px; text-decoration: none; color: inherit;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h4 style="font-size: 16px; font-weight: 600;">${deal.title}</h4>
                                <span style="color: var(--success-color); font-weight: 600;">✅ Completed</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 14px; color: var(--text-secondary);">
                                    with ${otherParty ? otherParty.fullName : 'Unknown'}
                                </span>
                                <span style="font-weight: 700; font-size: 18px; color: var(--primary-color);">
                                    KES ${deal.amount.toLocaleString()}
                                </span>
                            </div>
                        </a>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderTransactions(container) {
        if (this.transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 60px 20px; text-align: center;">
                    <p style="font-size: 64px; margin-bottom: 16px;">💳</p>
                    <h3>No Transactions</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Your transaction history will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 12px;">
                <h3 style="margin-bottom: 16px;">Transaction History</h3>
                ${this.transactions.map(transaction => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${this.getTransactionColor(transaction.type)}20; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                ${this.getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">${this.getTransactionText(transaction.type)}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">
                                    ${transaction.method} ${transaction.phoneNumber ? '• ' + transaction.phoneNumber : ''}
                                </div>
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                                    ${new Date(transaction.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: ${transaction.type === 'withdrawal' ? 'var(--error-color)' : 'var(--success-color)'};">
                                ${transaction.type === 'withdrawal' ? '-' : '+'}KES ${transaction.amount.toLocaleString()}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getTransactionIcon(type) {
        const icons = {
            payment: '💳',
            withdrawal: '💸',
            deposit: '💰'
        };
        return icons[type] || '📄';
    }

    getTransactionText(type) {
        const texts = {
            payment: 'Payment',
            withdrawal: 'Withdrawal',
            deposit: 'Deposit'
        };
        return texts[type] || type;
    }

    getTransactionColor(type) {
        const colors = {
            payment: '#0D9488',
            withdrawal: '#EF4444',
            deposit: '#10B981'
        };
        return colors[type] || '#666';
    }
}

new History();
