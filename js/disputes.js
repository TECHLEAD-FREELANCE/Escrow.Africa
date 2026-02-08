// Disputes Page - View and manage disputed deals
class Disputes {
    constructor() {
        this.currentUser = null;
        this.disputes = [];
        this.users = [];
        this.init();
    }

    async init() {
        Auth.requireAuth();
        this.currentUser = Auth.getCurrentUser();
        await this.loadData();
    }

    async loadData() {
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
            let localDeals = [];
            try {
                localDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
            } catch (error) {
                console.error('Error parsing userDeals:', error);
                localStorage.removeItem('userDeals');
            }
            allDeals = [...localDeals, ...allDeals];
            
            // Filter disputed deals where current user is involved
            this.disputes = allDeals.filter(deal => 
                deal.status === 'disputed' && 
                (deal.buyerId == this.currentUser.id || deal.sellerId == this.currentUser.id)
            );

            this.renderDisputes();
        } catch (error) {
            console.error('Error loading disputes:', error);
        }
    }

    renderDisputes() {
        const container = document.getElementById('disputesContainer');

        if (this.disputes.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 60px 20px; text-align: center;">
                    <p style="font-size: 64px; margin-bottom: 16px;">✅</p>
                    <h3>No Active Disputes</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">
                        You don't have any disputed deals at the moment
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.disputes.map(dispute => {
            const otherPartyId = dispute.buyerId == this.currentUser.id ? dispute.sellerId : dispute.buyerId;
            const otherParty = this.users.find(u => u.id == otherPartyId);

            return `
                <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px; border-left: 4px solid var(--error-color);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                        <div>
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${dispute.title}</h3>
                            <p style="font-size: 14px; color: var(--text-secondary);">Deal ID: ${dispute.id}</p>
                        </div>
                        <span class="status-badge" style="background: var(--error-light); color: var(--error-color);">
                            ⚠️ Disputed
                        </span>
                    </div>

                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Amount</span>
                            <span style="font-weight: 700; font-size: 18px; color: var(--primary-color);">KES ${dispute.amount.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary);">Other Party</span>
                            <span style="font-weight: 600;">${otherParty ? otherParty.fullName : 'Unknown'}</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <div style="font-weight: 600; margin-bottom: 12px;">Dispute Timeline</div>
                        <div class="deal-timeline">
                            <div class="timeline-item completed">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">Dispute Raised</div>
                                    <div class="timeline-date">${new Date(dispute.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div class="timeline-item completed">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">Under Review</div>
                                    <div class="timeline-date">Support team is investigating</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">Resolution</div>
                                    <div class="timeline-date">Pending</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px;">
                        <button class="btn-secondary" style="flex: 1;" onclick="disputes.uploadEvidence('${dispute.id}')">
                            📎 Upload Evidence
                        </button>
                        <button class="btn-primary" style="flex: 1;" onclick="disputes.contactSupport('${dispute.id}')">
                            💬 Contact Support
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    uploadEvidence(disputeId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,.pdf,.doc,.docx';
        
        input.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.showToast(`${files.length} file(s) uploaded successfully`, 'success');
            }
        });
        
        input.click();
    }

    contactSupport(disputeId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 24px; max-width: 500px; width: 90%; margin: auto; position: relative; top: 50%; transform: translateY(-50%);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Contact Support</h3>
                    <button class="modal-close" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label class="form-label">Message</label>
                    <textarea class="form-input" rows="5" placeholder="Describe your issue..." style="width: 100%; resize: vertical;"></textarea>
                </div>

                <div style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                    <div style="color: var(--text-secondary); margin-bottom: 4px;">Support will respond within:</div>
                    <div style="font-weight: 600; color: var(--primary-color);">24 hours</div>
                </div>

                <button class="btn-primary" style="width: 100%;" onclick="disputes.sendSupportMessage()">
                    Send Message
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    sendSupportMessage() {
        document.querySelector('.modal-overlay').remove();
        this.showToast('Message sent to support team', 'success');
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

const disputes = new Disputes();
