// Wallet Page - Display wallet balance and transaction history
class Wallet {
    constructor() {
        this.currentUser = null;
        this.transactions = [];
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
            const response = await fetch('../data/transactions.json');
            const allTransactions = await response.json();
            
            // Ensure allTransactions is an array
            const transactionsArray = Array.isArray(allTransactions) ? allTransactions : [];
            
            // Filter transactions for current user
            this.transactions = transactionsArray.filter(t => 
                t.userId == this.currentUser.id
            );

            this.renderWallet();
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    setupEventListeners() {
        const filterSelect = document.getElementById('filterType');
        filterSelect.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderTransactions();
        });
    }

    renderWallet() {
        // Display wallet balance
        document.getElementById('walletBalance').textContent = 
            `KES ${this.currentUser.walletBalance.toLocaleString()}`;
        
        this.renderTransactions();
    }

    renderTransactions() {
        const container = document.getElementById('transactionsContainer');
        let filtered = this.transactions;

        if (this.currentFilter !== 'all') {
            filtered = this.transactions.filter(t => t.type === this.currentFilter);
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px; text-align: center;">
                    <p style="font-size: 48px; margin-bottom: 16px;">💰</p>
                    <h3>No transactions</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Your transaction history will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(transaction => `
            <div class="transaction-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${this.getTypeColor(transaction.type)}20; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        ${this.getTypeIcon(transaction.type)}
                    </div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">${this.getTypeText(transaction.type)}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">
                            ${transaction.method} ${transaction.phoneNumber ? '• ' + transaction.phoneNumber : ''}
                        </div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                            ${new Date(transaction.timestamp).toLocaleString()}
                        </div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 16px; font-weight: 700; color: ${transaction.type === 'withdrawal' ? 'var(--error-color)' : 'var(--success-color)'};">
                        ${transaction.type === 'withdrawal' ? '-' : '+'}KES ${transaction.amount.toLocaleString()}
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                        ${transaction.dealId || 'N/A'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getTypeIcon(type) {
        const icons = {
            payment: '💳',
            withdrawal: '💸',
            deposit: '💰'
        };
        return icons[type] || '📄';
    }

    getTypeText(type) {
        const texts = {
            payment: 'Payment Sent',
            withdrawal: 'Withdrawal',
            deposit: 'Deposit Received'
        };
        return texts[type] || type;
    }

    getTypeColor(type) {
        const colors = {
            payment: '#0D9488',
            withdrawal: '#EF4444',
            deposit: '#10B981'
        };
        return colors[type] || '#666';
    }
}

new Wallet();
