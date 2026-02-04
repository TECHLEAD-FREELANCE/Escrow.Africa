// Withdraw Page - Handle withdrawal with ID verification
class Withdraw {
    constructor() {
        this.currentUser = null;
        this.isVerified = false;
        this.step = 'check'; // check, verify, withdraw, success
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        
        // Simulate checking if user is verified (for demo, randomize based on username)
        this.isVerified = this.currentUser.verified || false;
        
        if (this.isVerified) {
            this.step = 'withdraw';
        }
        
        this.render();
    }

    render() {
        const container = document.getElementById('withdrawContainer');

        if (this.step === 'verify') {
            this.renderVerification(container);
        } else if (this.step === 'withdraw') {
            this.renderWithdrawForm(container);
        } else if (this.step === 'success') {
            this.renderSuccess(container);
        }
    }

    renderVerification(container) {
        container.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🆔</div>
                    <h2 style="margin-bottom: 8px;">Verify Your Identity</h2>
                    <p style="color: var(--text-secondary);">To withdraw funds, we need to verify your identity first</p>
                </div>

                <div class="form-section" style="margin-bottom: 20px;">
                    <h3>Upload ID Documents</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">
                        <div class="file-upload-area" style="padding: 40px 20px; cursor: pointer;" onclick="document.getElementById('idFront').click()">
                            <input type="file" id="idFront" accept="image/*" style="display: none;">
                            <div style="text-align: center;">
                                <div style="font-size: 32px; margin-bottom: 8px;">📄</div>
                                <div style="font-size: 14px; font-weight: 500;">ID Front</div>
                            </div>
                        </div>
                        <div class="file-upload-area" style="padding: 40px 20px; cursor: pointer;" onclick="document.getElementById('idBack').click()">
                            <input type="file" id="idBack" accept="image/*" style="display: none;">
                            <div style="text-align: center;">
                                <div style="font-size: 32px; margin-bottom: 8px;">📄</div>
                                <div style="font-size: 14px; font-weight: 500;">ID Back</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Face Verification</h3>
                    <div class="file-upload-area" style="margin-top: 16px; padding: 60px 20px; text-align: center; cursor: pointer;" onclick="withdraw.startFaceVerification()">
                        <div style="font-size: 48px; margin-bottom: 12px;">📸</div>
                        <div style="font-weight: 500; margin-bottom: 4px;">Take Selfie</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">Click to start camera</div>
                    </div>
                </div>

                <button class="btn-primary" style="width: 100%; margin-top: 24px;" onclick="withdraw.submitVerification()">
                    Submit Verification
                </button>
            </div>
        `;

        // Setup file upload previews
        document.getElementById('idFront').addEventListener('change', (e) => this.handleFileUpload(e, 'idFront'));
        document.getElementById('idBack').addEventListener('change', (e) => this.handleFileUpload(e, 'idBack'));
    }

    handleFileUpload(event, inputId) {
        const file = event.target.files[0];
        if (file) {
            const parent = event.target.parentElement;
            parent.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
                    <div style="font-size: 14px; font-weight: 500; color: var(--success-color);">Uploaded</div>
                </div>
            `;
        }
    }

    startFaceVerification() {
        const container = event.target.closest('.file-upload-area');
        container.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 12px;">📹</div>
            <div style="font-weight: 500; margin-bottom: 8px;">Capturing...</div>
            <div class="spinner" style="margin: 0 auto;"></div>
        `;

        setTimeout(() => {
            container.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
                <div style="font-weight: 500; color: var(--success-color);">Face Captured</div>
            `;
        }, 2000);
    }

    submitVerification() {
        this.showToast('Verifying your documents...', 'info');
        
        setTimeout(() => {
            this.showToast('Verification successful!', 'success');
            this.isVerified = true;
            this.step = 'withdraw';
            this.render();
        }, 3000);
    }

    renderWithdrawForm(container) {
        container.innerHTML = `
            <div class="withdraw-balance-card">
                <p>Available Balance</p>
                <h2>KES ${this.currentUser.walletBalance.toLocaleString()}</h2>
            </div>

            <div style="background: white; padding: 24px; border-radius: 12px;">
                <div class="form-section">
                    <h3>Withdrawal Details</h3>
                    
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
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label">Amount (KES)</label>
                        <input type="number" id="amount" class="form-input" placeholder="Enter amount" min="100" max="${this.currentUser.walletBalance}">
                        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                            Minimum: KES 100 • Maximum: KES ${this.currentUser.walletBalance.toLocaleString()}
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label class="form-label">PIN</label>
                        <input type="password" id="pin" class="form-input" placeholder="Enter your 4-digit PIN" maxlength="4">
                    </div>

                    <button class="btn-primary" style="width: 100%; margin-top: 24px;" onclick="withdraw.processWithdrawal()">
                        Withdraw Funds
                    </button>
                </div>
            </div>
        `;

        // Setup operator selection
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.operator-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    }

    processWithdrawal() {
        const amount = document.getElementById('amount').value;
        const phone = document.getElementById('phoneNumber').value;
        const pin = document.getElementById('pin').value;
        const selectedOperator = document.querySelector('.operator-btn.selected');

        if (!selectedOperator) {
            this.showToast('Please select a payment method', 'error');
            return;
        }

        if (!phone) {
            this.showToast('Please enter phone number', 'error');
            return;
        }

        if (!amount || parseFloat(amount) < 100) {
            this.showToast('Minimum withdrawal is KES 100', 'error');
            return;
        }

        if (parseFloat(amount) > this.currentUser.walletBalance) {
            this.showToast('Insufficient balance', 'error');
            return;
        }

        if (!pin || pin.length !== 4) {
            this.showToast('Please enter a valid 4-digit PIN', 'error');
            return;
        }

        this.showToast('Processing withdrawal...', 'info');

        setTimeout(() => {
            this.step = 'success';
            this.render();
        }, 2500);
    }

    renderSuccess(container) {
        container.innerHTML = `
            <div style="background: white; padding: 40px 24px; border-radius: 12px; text-align: center;">
                <div style="width: 80px; height: 80px; background: var(--success-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 40px;">
                    ✅
                </div>
                <h2 style="color: var(--success-color); margin-bottom: 12px;">Withdrawal Successful!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 32px;">
                    Your funds have been sent to your mobile money account. You should receive them within a few minutes.
                </p>
                <div style="background: var(--bg-secondary); padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">Amount Withdrawn</div>
                    <div style="font-size: 32px; font-weight: 700; color: var(--primary-color);">KES ${(Math.random() * 5000 + 1000).toFixed(0)}</div>
                </div>
                <a href="wallet.html" class="btn-primary" style="display: inline-block; text-decoration: none; padding: 12px 32px;">
                    Back to Wallet
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

const withdraw = new Withdraw();
