// Deal Create Module
class DealCreate {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.selectedUser = null;
        this.init();
    }

    async init() {
        this.currentUser = Auth.requireAuth();
        await this.loadUsers();
        this.setupEventListeners();
    }

    async loadUsers() {
        try {
            const response = await fetch('../data/users.json');
            const data = await response.json();
            // Handle both array and object with users property
            let usersArray = Array.isArray(data) ? data : (data.users || []);
            
            // Load registered users from localStorage
            let registeredUsers = [];
            try {
                registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            } catch (error) {
                console.error('Error parsing registeredUsers from localStorage:', error);
                localStorage.removeItem('registeredUsers');
            }
            usersArray = [...usersArray, ...registeredUsers];
            
            this.users = usersArray.filter(u => u.id != this.currentUser.id); // Use != for loose comparison
        } catch (error) {
            console.error('Error loading users:', error);
            // Load only from localStorage if JSON fails
            let registeredUsers = [];
            try {
                registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            } catch (error) {
                console.error('Error parsing registeredUsers from localStorage:', error);
                localStorage.removeItem('registeredUsers');
            }
            this.users = registeredUsers.filter(u => u.id != this.currentUser.id);
        }
    }

    setupEventListeners() {
        // Amount input for fee calculation
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => this.calculateFees(e.target.value));
        }

        // File upload
        const fileUploadArea = document.getElementById('fileUploadArea');
        const photoInput = document.getElementById('photo');
        if (fileUploadArea && photoInput) {
            fileUploadArea.addEventListener('click', () => photoInput.click());
            photoInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Invite options
        document.getElementById('inviteByUsername')?.addEventListener('click', () => this.openUserSelectionModal());
        document.getElementById('shareLink')?.addEventListener('click', () => this.generateShareLink());

        // Remove selected user
        document.getElementById('removeSelectedUser')?.addEventListener('click', () => this.removeSelectedUser());

        // Form submission
        const form = document.getElementById('createDealForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createDeal();
            });
        }

        // User modal
        document.getElementById('closeUserModal')?.addEventListener('click', () => this.closeUserModal());
        document.getElementById('userSearchInput')?.addEventListener('input', (e) => this.searchUsers(e.target.value));
    }

    calculateFees(amount) {
        const amountNum = parseFloat(amount) || 0;
        const platformFee = amountNum * 0.02;
        const total = amountNum + platformFee;

        document.getElementById('dealAmountDisplay').textContent = `KES ${amountNum.toLocaleString()}`;
        document.getElementById('platformFee').textContent = `KES ${platformFee.toLocaleString()}`;
        document.getElementById('totalAmount').textContent = `KES ${total.toLocaleString()}`;
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const placeholder = document.querySelector('.upload-placeholder');
        const preview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                placeholder.style.display = 'none';
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        document.getElementById('removeUpload')?.addEventListener('click', (e) => {
            e.stopPropagation();
            placeholder.style.display = 'flex';
            preview.style.display = 'none';
            document.getElementById('photo').value = '';
        });
    }

    openUserSelectionModal() {
        const modal = document.getElementById('userSelectionModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);

        this.displayUsers(this.users);

        modal.querySelector('.modal-overlay').onclick = () => this.closeUserModal();
    }

    closeUserModal() {
        const modal = document.getElementById('userSelectionModal');
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    searchUsers(query) {
        const filtered = this.users.filter(u => 
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.fullName.toLowerCase().includes(query.toLowerCase())
        );
        this.displayUsers(filtered);
    }

    displayUsers(users) {
        const container = document.getElementById('userListContainer');
        if (!container) return;

        container.innerHTML = users.map(user => `
            <div class="user-list-item" data-user-id="${user.id}">
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-info">
                    <strong>${user.fullName}</strong>
                    <span>@${user.username}</span>
                    <small>${user.rating} ⭐ • ${user.completedDeals} deals</small>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.user-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = parseInt(item.dataset.userId);
                this.selectUser(userId);
            });
        });
    }

    selectUser(userId) {
        this.selectedUser = this.users.find(u => u.id === userId);
        if (!this.selectedUser) return;

        this.selectedUserId = userId;

        const display = document.getElementById('selectedUserDisplay');
        document.getElementById('selectedUserAvatar').textContent = this.selectedUser.avatar;
        document.getElementById('selectedUserName').textContent = this.selectedUser.fullName;
        document.getElementById('selectedUserUsername').textContent = `@${this.selectedUser.username}`;
        display.style.display = 'block';

        this.closeUserModal();
    }

    removeSelectedUser() {
        this.selectedUser = null;
        this.selectedUserId = null;
        document.getElementById('selectedUserDisplay').style.display = 'none';
    }

    generateShareLink() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const timeline = document.getElementById('timeline').value;
        const category = document.getElementById('category').value;

        if (!title || !description || !amount || !timeline) {
            alert('Please fill all required fields (Title, Description, Amount, Timeline)');
            return;
        }

        // Create deal object for invitation
        const dealId = 'ESC' + String(Date.now()).slice(-6);
        const newDeal = {
            dealId: dealId,
            title: title,
            description: description,
            amount: parseFloat(amount),
            platformFee: parseFloat(amount) * 0.02,
            totalAmount: parseFloat(amount) * 1.02,
            timeline: timeline + ' days',
            deadline: new Date(Date.now() + parseInt(timeline) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            buyerId: this.currentUser.id,
            sellerId: null, // Will be set when invitee joins
            buyerName: this.currentUser.fullName,
            sellerName: 'Pending',
            status: 'pending-acceptance',
            createdDate: new Date().toISOString().split('T')[0],
            category: category || 'General'
        };

        // Save deal to localStorage
        let existingDeals = [];
        try {
            existingDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
        } catch (error) {
            console.error('Error parsing userDeals, starting fresh:', error);
            localStorage.removeItem('userDeals');
        }
        existingDeals.unshift(newDeal);
        localStorage.setItem('userDeals', JSON.stringify(existingDeals));

        // Encode deal data in URL for cross-session sharing
        const dealData = btoa(JSON.stringify(newDeal));
        const link = `${window.location.origin}/pages/deal-invite.html?data=${dealData}`;

        // Create share sheet
        const sheet = document.createElement('div');
        sheet.className = 'bottom-sheet';
        sheet.innerHTML = `
            <div class="sheet-overlay"></div>
            <div class="sheet-content">
                <div class="sheet-header">
                    <h3>Share Deal Invitation</h3>
                    <button class="sheet-close">✕</button>
                </div>
                <div class="sheet-options">
                    <div style="padding: 16px; background: #e0f2f1; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--primary-color);">
                        <p style="font-size: 14px; margin-bottom: 8px; color: var(--text-primary); font-weight: 600;">🔗 Deal Created Successfully!</p>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">Share this link with someone not on the platform. They'll be able to sign up and join this deal.</p>
                    </div>
                    <div style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 16px;">
                        <small style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-weight: 600;">Invitation Link:</small>
                        <code id="inviteLink" style="font-size: 11px; word-break: break-all; display: block; padding: 8px; background: white; border-radius: 6px;">${link}</code>
                    </div>
                    <button class="sheet-option" onclick="navigator.clipboard.writeText(document.getElementById('inviteLink').textContent); alert('Invitation link copied! Share it with the other party.')">
                        <span class="option-icon">📋</span>
                        <span class="option-label">Copy Invitation Link</span>
                    </button>
                    <button class="sheet-option" onclick="window.open('https://wa.me/?text=${encodeURIComponent('Join me in this secure escrow deal on Escrow Africa: ')}' + encodeURIComponent(document.getElementById('inviteLink').textContent), '_blank')">
                        <span class="option-icon">📱</span>
                        <span class="option-label">Share on WhatsApp</span>
                    </button>
                    <button class="sheet-option" onclick="window.location.href='deal-detail.html?id=${dealId}'">
                        <span class="option-icon">📄</span>
                        <span class="option-label">View Deal Details</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(sheet);

        setTimeout(() => sheet.classList.add('show'), 10);

        const close = () => {
            sheet.classList.remove('show');
            setTimeout(() => sheet.remove(), 300);
        };

        sheet.querySelector('.sheet-overlay').onclick = close;
        sheet.querySelector('.sheet-close').onclick = close;
    }

    createDeal() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const timeline = document.getElementById('timeline').value;
        const category = document.getElementById('category').value;

        if (!title || !description || !amount || !timeline) {
            alert('Please fill all required fields (Title, Description, Amount, Timeline)');
            return;
        }

        // If no user selected, create shareable deal link for non-platform users
        if (!this.selectedUserId) {
            this.generateShareLink();
            return;
        }

        // Create deal with selected platform user
        const newDeal = {
            dealId: 'ESC' + String(Date.now()).slice(-6),
            title: title,
            description: description,
            amount: parseFloat(amount),
            platformFee: parseFloat(amount) * 0.02,
            totalAmount: parseFloat(amount) * 1.02,
            timeline: timeline + ' days',
            deadline: new Date(Date.now() + parseInt(timeline) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            buyerId: this.currentUser.id,
            sellerId: this.selectedUserId,
            buyerName: this.currentUser.fullName,
            sellerName: this.users.find(u => u.id === this.selectedUserId)?.fullName || 'Unknown',
            status: 'pending-acceptance',
            createdDate: new Date().toISOString().split('T')[0],
            category: category || 'General'
        };

        // Save to localStorage
        let existingDeals = [];
        try {
            existingDeals = JSON.parse(localStorage.getItem('userDeals') || '[]');
        } catch (error) {
            console.error('Error parsing userDeals, starting fresh:', error);
            localStorage.removeItem('userDeals');
        }
        existingDeals.unshift(newDeal);
        localStorage.setItem('userDeals', JSON.stringify(existingDeals));

        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast toast-success show';
        toast.textContent = 'Deal created successfully!';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
            // Redirect to deal detail
            window.location.href = `deal-detail.html?id=${newDeal.dealId}`;
        }, 1500);
    }
}

// Add CSS for user list
const style = document.createElement('style');
style.textContent = `
    .user-list-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: background 150ms ease;
    }
    .user-list-item:hover {
        background: var(--bg-tertiary);
    }
    .user-list-item .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 16px;
    }
    .user-list-item .user-info {
        flex: 1;
    }
    .user-list-item .user-info strong {
        display: block;
        font-size: 15px;
        margin-bottom: 2px;
    }
    .user-list-item .user-info span {
        display: block;
        font-size: 13px;
        color: var(--text-secondary);
        margin-bottom: 4px;
    }
    .user-list-item .user-info small {
        font-size: 12px;
        color: var(--text-tertiary);
    }
    .search-input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 16px;
    }
    .modal-body {
        padding: 16px;
        max-height: 60vh;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);

// Initialize
const dealCreate = new DealCreate();
