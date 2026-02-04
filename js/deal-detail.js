// Deal Detail Page - Displays individual deal information and actions
class DealDetail {
    constructor() {
        this.deal = null;
        this.currentUser = null;
        this.users = [];
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        await this.loadDeal();
    }

    async loadDeal() {
        const urlParams = new URLSearchParams(window.location.search);
        const dealId = urlParams.get('id');

        if (!dealId) {
            window.location.href = 'deals.html';
            return;
        }

        try {
            const [dealsResponse, usersResponse] = await Promise.all([
                fetch('../data/deals.json'),
                fetch('../data/users.json')
            ]);

            const dealsData = await dealsResponse.json();
            const usersData = await usersResponse.json();
            
            // Handle both array and object formats
            let allDeals = Array.isArray(dealsData) ? dealsData : (dealsData.deals || []);
            const usersArray = Array.isArray(usersData) ? usersData : (usersData.users || []);
            this.users = usersArray;
            
            // Load deals from localStorage and merge
            const localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            allDeals = [...localDeals, ...allDeals];
            
            this.deal = allDeals.find(d => (d.id === dealId || d.dealId === dealId));

            if (!this.deal) {
                window.location.href = 'deals.html';
                return;
            }

            this.renderDeal();
        } catch (error) {
            console.error('Error loading deal:', error);
        }
    }

    renderDeal() {
        const container = document.getElementById('dealContainer');
        const otherPartyId = this.deal.buyerId === this.currentUser.id ? this.deal.sellerId : this.deal.buyerId;
        const otherParty = this.users.find(u => u.id === otherPartyId);
        const role = this.deal.buyerId === this.currentUser.id ? 'Buyer' : 'Seller';

        container.innerHTML = `
            <div class="deal-header">
                <div class="deal-status-badge status-${this.deal.status}">
                    ${this.getStatusIcon(this.deal.status)} ${this.getStatusText(this.deal.status)}
                </div>
                <h1>${this.deal.title}</h1>
                <p>${this.deal.description}</p>
            </div>

            <div class="deal-amount-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span>Deal Amount</span>
                    <h2 style="font-size: 32px; font-weight: 700; color: white;">KES ${this.deal.amount.toLocaleString()}</h2>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; opacity: 0.9;">
                    <span>Platform Fee (2%)</span>
                    <span>KES ${(this.deal.amount * 0.02).toLocaleString()}</span>
                </div>
                <div style="border-top: 1px solid rgba(255,255,255,0.3); margin: 12px 0; padding-top: 12px; display: flex; justify-content: space-between; font-weight: 600;">
                    <span>Total</span>
                    <span>KES ${(this.deal.amount * 1.02).toLocaleString()}</span>
                </div>
            </div>

            <div class="deal-info-section">
                <h3>Deal Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Deal ID</span>
                        <span class="info-value">${this.deal.dealId || this.deal.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Category</span>
                        <span class="info-value">${this.deal.category || 'General'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Created</span>
                        <span class="info-value">${new Date(this.deal.createdDate || this.deal.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Your Role</span>
                        <span class="info-value">${role}</span>
                    </div>
                </div>
            </div>

            ${otherParty ? `
            <div class="deal-info-section">
                <h3>${role === 'Buyer' ? 'Seller' : 'Buyer'} Information</h3>
                <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600;">
                        ${otherParty.fullName.charAt(0)}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">${otherParty.fullName}</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">@${otherParty.username}</div>
                        <div style="font-size: 14px; color: var(--accent-color); margin-top: 4px;">⭐ ${otherParty.rating} • ${otherParty.completedDeals} deals</div>
                    </div>
                    <a href="chat.html?userId=${otherParty.id}" style="padding: 8px 16px; background: var(--primary-color); color: white; border-radius: 6px; text-decoration: none; font-size: 14px;">
                        Chat
                    </a>
                </div>
            </div>
            ` : ''}

            <div class="deal-info-section">
                <h3>Timeline</h3>
                <div class="deal-timeline">
                    <div class="timeline-item ${this.deal.status === 'pending-acceptance' || this.deal.status === 'pending-payment' || this.deal.status === 'in-progress' || this.deal.status === 'completed' ? 'completed' : ''}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">Deal Created</div>
                            <div class="timeline-date">${new Date(this.deal.createdDate || this.deal.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="timeline-item ${this.deal.status === 'pending-payment' || this.deal.status === 'in-progress' || this.deal.status === 'completed' ? 'completed' : ''}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">Deal Accepted</div>
                            <div class="timeline-date">${this.deal.status !== 'pending-acceptance' ? 'Completed' : 'Pending'}</div>
                        </div>
                    </div>
                    <div class="timeline-item ${this.deal.status === 'in-progress' || this.deal.status === 'completed' ? 'completed' : ''}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">Payment Made</div>
                            <div class="timeline-date">${this.deal.status === 'in-progress' || this.deal.status === 'completed' ? 'Completed' : 'Pending'}</div>
                        </div>
                    </div>
                    <div class="timeline-item ${this.deal.status === 'completed' ? 'completed' : ''}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">Deal Completed</div>
                            <div class="timeline-date">${this.deal.status === 'completed' ? 'Completed' : 'Pending'}</div>
                        </div>
                    </div>
                </div>
            </div>

            ${this.getActionButtons()}
        `;

        this.setupEventListeners();
    }

    getActionButtons() {
        const role = this.deal.buyerId === this.currentUser.id ? 'Buyer' : 'Seller';

        if (this.deal.status === 'pending-acceptance' && role === 'Seller') {
            return `
                <div class="form-actions-sticky">
                    <button class="btn-secondary" onclick="dealDetail.rejectDeal()">Reject</button>
                    <button class="btn-primary" onclick="dealDetail.acceptDeal()">Accept Deal</button>
                </div>
            `;
        } else if (this.deal.status === 'pending-payment' && role === 'Buyer') {
            return `
                <div class="form-actions-sticky">
                    <button class="btn-primary" style="width: 100%;" onclick="dealDetail.showPaymentModal()">Make Payment</button>
                </div>
            `;
        } else if (this.deal.status === 'in-progress') {
            if (role === 'Seller') {
                return `
                    <div class="form-actions-sticky">
                        <button class="btn-secondary" onclick="dealDetail.raiseDispute()">Raise Dispute</button>
                        <button class="btn-primary" onclick="dealDetail.completeDeal()">Mark as Complete</button>
                    </div>
                `;
            } else {
                return `
                    <div class="form-actions-sticky">
                        <button class="btn-secondary" style="width: 100%;" onclick="dealDetail.raiseDispute()">Raise Dispute</button>
                    </div>
                `;
            }
        } else if (this.deal.status === 'completed') {
            return `
                <div style="padding: 20px; background: var(--success-light); border-radius: 12px; text-align: center; margin-top: 20px;">
                    <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
                    <h3 style="color: var(--success-color);">Deal Completed Successfully!</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Funds have been released to the seller.</p>
                </div>
            `;
        }

        return '';
    }

    setupEventListeners() {
        const moreBtn = document.getElementById('moreBtn');
        if (moreBtn) {
            moreBtn.addEventListener('click', () => this.showMoreOptions());
        }
    }

    showMoreOptions() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="bottom-sheet">
                <div class="bottom-sheet-handle"></div>
                <div class="bottom-sheet-content">
                    <button class="bottom-sheet-option">
                        <span>📋</span> Copy Deal Link
                    </button>
                    <button class="bottom-sheet-option">
                        <span>📤</span> Share Deal
                    </button>
                    <button class="bottom-sheet-option" style="color: var(--error-color);">
                        <span>🚫</span> Report Issue
                    </button>
                    <button class="bottom-sheet-option-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('bottom-sheet-option-cancel')) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    acceptDeal() {
        this.showToast('Deal accepted! Waiting for payment...', 'success');
        setTimeout(() => {
            this.deal.status = 'pending-payment';
            this.renderDeal();
        }, 1000);
    }

    rejectDeal() {
        if (confirm('Are you sure you want to reject this deal?')) {
            this.showToast('Deal rejected', 'error');
            setTimeout(() => window.location.href = 'deals.html', 1500);
        }
    }

    showPaymentModal() {
        const total = this.deal.amount * 1.02;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="payment-modal">
                <div class="modal-header">
                    <h3>Make Payment</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                        <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">Total Amount</div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary-color);">KES ${total.toLocaleString()}</div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Select Payment Method</label>
                        <div class="operator-grid">
                            <button class="operator-btn" data-operator="mpesa">
                                <div class="operator-icon" style="background: #00a651;">M</div>
                                <div class="operator-name">M-Pesa</div>
                            </button>
                            <button class="operator-btn" data-operator="airtel">
                                <div class="operator-icon" style="background: #ed1c24;">A</div>
                                <div class="operator-name">Airtel Money</div>
                            </button>
                            <button class="operator-btn" data-operator="mtn">
                                <div class="operator-icon" style="background: #ffcb05; color: #000;">M</div>
                                <div class="operator-name">MTN Mobile</div>
                            </button>
                        </div>
                    </div>

                    <div id="phoneNumberSection" style="display: none;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone Number</label>
                        <input type="tel" id="phoneNumber" class="form-input" placeholder="07XXXXXXXX" style="width: 100%; margin-bottom: 20px;">
                        <button class="btn-primary" style="width: 100%;" onclick="dealDetail.processPayment()">Confirm Payment</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        modal.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.operator-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                modal.querySelector('#phoneNumberSection').style.display = 'block';
            });
        });
    }

    processPayment() {
        const phoneNumber = document.getElementById('phoneNumber').value;
        if (!phoneNumber) {
            this.showToast('Please enter phone number', 'error');
            return;
        }

        document.querySelector('.modal-overlay').remove();
        this.showToast('Payment processing... Check your phone', 'success');

        setTimeout(() => {
            this.showToast('Payment successful! Deal in progress', 'success');
            this.deal.status = 'in-progress';
            this.renderDeal();
        }, 3000);
    }

    completeDeal() {
        if (confirm('Are you sure you want to mark this deal as complete? Funds will be released to the seller.')) {
            this.showToast('Deal completed successfully!', 'success');
            setTimeout(() => {
                this.deal.status = 'completed';
                this.renderDeal();
            }, 1000);
        }
    }

    raiseDispute() {
        if (confirm('Are you sure you want to raise a dispute? Our support team will review this case.')) {
            this.showToast('Dispute raised. Support team notified.', 'error');
            setTimeout(() => {
                this.deal.status = 'disputed';
                window.location.href = 'disputes.html';
            }, 1500);
        }
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
            'pending-acceptance': 'Pending Acceptance',
            'pending-payment': 'Awaiting Payment',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'disputed': 'Disputed'
        };
        return texts[status] || status;
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

const dealDetail = new DealDetail();
