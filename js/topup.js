// Top Up Page - Handle wallet top up with M-Pesa, Airtel, MTN
class TopUp {
    constructor() {
        this.currentUser = null;
        this.selectedOperator = null;
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        this.render();
    }

    render() {
        const container = document.getElementById('topupContainer');
        this.renderTopUpForm(container);
    }

    renderTopUpForm(container) {
        container.innerHTML = `
            <div class="withdraw-balance-card">
                <p>Current Balance</p>
                <h2>KES ${this.currentUser.walletBalance.toLocaleString()}</h2>
            </div>

            <div style="background: white; padding: 24px; border-radius: 12px;">
                <div class="form-section">
                    <h3>Top Up Details</h3>
                    
                    <div style="margin-bottom: 16px;">
                        <label class="form-label">Select Payment Method</label>
                        <div class="operator-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px;">
                            <button class="operator-btn" data-operator="mpesa">
                                <div class="operator-icon" style="background: #00a651;">M</div>
                                <div class="operator-name">M-Pesa</div>
                            </button>
                            <button class="operator-btn" data-operator="airtel">
                                <div class="operator-icon" style="background: #ed1c24;">A</div>
                                <div class="operator-name">Airtel</div>
                            </button>
                            <button class="operator-btn" data-operator="mtn">
                                <div class="operator-icon" style="background: #ffcb05; color: #000;">M</div>
                                <div class="operator-name">MTN</div>
                            </button>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" id="phoneNumber" class="form-input" placeholder="07XXXXXXXX" value="${this.currentUser.phone || ''}">
                        <small style="font-size: 12px; color: var(--text-secondary); margin-top: 4px; display: block;">
                            You will receive an STK push to this number
                        </small>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label">Amount (KES)</label>
                        <input type="number" id="amount" class="form-input" placeholder="Enter amount" min="100">
                        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                            Minimum: KES 100 • Maximum: KES 1,000,000
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
                        <button class="quick-amount-btn" onclick="topup.setAmount(500)">KES 500</button>
                        <button class="quick-amount-btn" onclick="topup.setAmount(1000)">KES 1,000</button>
                        <button class="quick-amount-btn" onclick="topup.setAmount(5000)">KES 5,000</button>
                    </div>

                    <button class="btn-primary" style="width: 100%; margin-top: 24px;" onclick="topup.processTopUp()">
                        Send STK Push
                    </button>
                </div>
            </div>
        `;

        // Setup operator selection
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.operator-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedOperator = btn.dataset.operator;
            });
        });

        // Auto-select M-Pesa
        document.querySelector('.operator-btn[data-operator="mpesa"]').click();
    }

    setAmount(amount) {
        document.getElementById('amount').value = amount;
    }

    processTopUp() {
        const phoneNumber = document.getElementById('phoneNumber').value;
        const amount = document.getElementById('amount').value;

        if (!phoneNumber || !amount || !this.selectedOperator) {
            this.showToast('Please fill all fields and select payment method', 'error');
            return;
        }

        if (amount < 100) {
            this.showToast('Minimum amount is KES 100', 'error');
            return;
        }

        // Store amount and show processing
        this.topupAmount = parseInt(amount);
        this.showProcessing();
    }

    showProcessing() {
        const container = document.getElementById('topupContainer');
        container.innerHTML = `
            <div style="background: white; padding: 40px 24px; border-radius: 12px; text-align: center;">
                <div class="loading-spinner" style="width: 60px; height: 60px; border: 4px solid var(--bg-secondary); border-top-color: var(--primary-color); border-radius: 50%; margin: 0 auto 24px; animation: spin 1s linear infinite;"></div>
                <h2 style="margin-bottom: 12px;">Processing Payment</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Please enter your PIN on your phone to complete the payment</p>
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">Amount</p>
                    <p style="font-size: 24px; font-weight: 700; color: var(--primary-color);">KES ${this.topupAmount.toLocaleString()}</p>
                </div>
                <p style="font-size: 13px; color: var(--text-secondary);">Waiting for payment confirmation...</p>
            </div>
        `;

        // Simulate STK push processing
        setTimeout(() => {
            this.showSuccess();
        }, 4000);
    }

    showSuccess() {
        const amount = this.topupAmount;
        const newBalance = this.currentUser.walletBalance + amount;
        
        const container = document.getElementById('topupContainer');
        container.innerHTML = `
            <div style="background: white; padding: 40px 24px; border-radius: 12px; text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; animation: scaleIn 0.5s ease;">
                    <span style="font-size: 48px; color: white;">✓</span>
                </div>
                <h2 style="margin-bottom: 12px; color: var(--success-color);">Top Up Successful!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 32px;">Your wallet has been topped up successfully</p>
                
                <div style="background: var(--bg-secondary); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: var(--text-secondary);">Amount Added</span>
                        <span style="font-weight: 600;">KES ${parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary);">New Balance</span>
                        <span style="font-weight: 700; color: var(--primary-color); font-size: 18px;">KES ${newBalance.toLocaleString()}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 12px;">
                    <a href="wallet.html" class="btn-primary" style="flex: 1; text-decoration: none; text-align: center; padding: 14px;">
                        Back to Wallet
                    </a>
                    <button class="btn-secondary" style="flex: 1; padding: 14px;" onclick="topup.topUpAgain()">
                        Top Up Again
                    </button>
                </div>
            </div>
        `;

        // Update user balance in session storage
        this.currentUser.walletBalance = newBalance;
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    topUpAgain() {
        this.render();
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

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
    }
    .operator-btn {
        padding: 16px;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    .operator-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .operator-btn.active {
        border-color: var(--primary-color);
        background: rgba(13, 148, 136, 0.05);
    }
    .operator-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin: 0 auto 8px;
    }
    .operator-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
    }
    .quick-amount-btn {
        padding: 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .quick-amount-btn:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
`;
document.head.appendChild(style);

const topup = new TopUp();
