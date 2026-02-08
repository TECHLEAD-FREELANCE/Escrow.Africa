// Automated Demo Script for Escrow Africa
// Duration: ~150 seconds (2:30 minutes)

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', handleStartDemo);
    }
});

function handleStartDemo() {
    const btn = document.getElementById('startBtn');
    btn.disabled = true;
    btn.textContent = 'Preparing Demo...';
    
    const countdownDisplay = document.getElementById('countdownDisplay');
    const countdownEl = document.getElementById('countdown');
    countdownDisplay.style.display = 'block';
    
    let count = 3;
    countdownEl.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            startAutomatedDemo();
        }
    }, 1000);
}

const DEMO_CONFIG = {
    demoUser1: {
        username: 'john_buyer',
        fullName: 'John Buyer',
        phone: '+254712345678',
        balance: 100000
    },
    demoUser2: {
        username: 'jane_seller',
        fullName: 'Jane Seller',
        phone: '+254723456789',
        balance: 50000
    },
    demoDeal: {
        title: 'Website Development Project',
        description: 'Complete e-commerce website with payment integration and admin dashboard',
        amount: 50000,
        timeline: 14,
        platformFee: 2500
    }
};

let currentStep = 0;
const totalSteps = 8;

function startAutomatedDemo() {
    // Hide start screen, show demo container
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('demoContainer').classList.add('active');
    
    // Start the demo sequence
    setTimeout(() => step1_SignUp(), 500);
}

function updateProgress(step) {
    currentStep = step;
    const progress = (step / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function updateStepInfo(title, description) {
    document.getElementById('stepTitle').textContent = title;
    document.getElementById('stepDescription').textContent = description;
}

function updateUser(user) {
    document.getElementById('userAvatar').textContent = user.fullName.split(' ').map(n => n[0]).join('');
    document.getElementById('userName').textContent = user.fullName;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = 'toast toast-' + type + ' active';
    toastIcon.textContent = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    toastMessage.textContent = message;
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.classList.remove('active');
            toast.style.animation = '';
        }, 300);
    }, 3000);
}

function showModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = content;
    modal.classList.add('active');
}

function hideModal() {
    document.getElementById('modal').classList.remove('active');
}

function typeText(element, text, speed = 50) {
    return new promise((resolve) => {
        let i = 0;
        element.value = '';
        const interval = setInterval(() => {
            element.value += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// Step 1: Sign Up & Profile (15 seconds)
function step1_SignUp() {
    updateProgress(1);
    updateStepInfo('1️⃣ Sign Up & Create Profile', 'Creating new account with profile verification');
    updateUser(DEMO_CONFIG.demoUser1);
    
    const content = `
        <div class="fade-in">
            <h2>Create Account</h2>
            <div class="form-group">
                <label>Username</label>
                <input type="text" id="demoUsername" value="${DEMO_CONFIG.demoUser1.username}" readonly>
            </div>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="demoFullName" value="${DEMO_CONFIG.demoUser1.fullName}" readonly>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" id="demoPhone" value="${DEMO_CONFIG.demoUser1.phone}" readonly>
            </div>
            <div style="margin-top: 1.5rem; padding: 1rem; background: #d1fae5; border-radius: 8px; color: #065f46;">
                ✅ Account Verified
            </div>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Creating account...', 'info');
    
    setTimeout(() => {
        showToast('✅ Account created & verified!', 'success');
        setTimeout(() => step2_CreateDeal(), 5000);
    }, 8000);
}

// Step 2: Create Deal (20 seconds)
function step2_CreateDeal() {
    updateProgress(2);
    updateStepInfo('2️⃣ Create Deal', 'Setting up new escrow deal with details');
    
    const content = `
        <div class="fade-in">
            <h2>Create New Deal</h2>
            <div class="form-group">
                <label>Deal Title</label>
                <input type="text" id="dealTitle" value="${DEMO_CONFIG.demoDeal.title}" readonly>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="4" id="dealDescription" readonly>${DEMO_CONFIG.demoDeal.description}</textarea>
            </div>
            <div class="form-group">
                <label>Amount (KES)</label>
                <input type="text" value="${DEMO_CONFIG.demoDeal.amount.toLocaleString()}" readonly>
            </div>
            <div class="form-group">
                <label>Timeline (Days)</label>
                <input type="text" value="${DEMO_CONFIG.demoDeal.timeline}" readonly>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border-radius: 8px;">
                <strong>Platform Fee: KES ${DEMO_CONFIG.demoDeal.platformFee.toLocaleString()}</strong> (5%)
            </div>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Creating deal...', 'info');
    
    setTimeout(() => {
        showToast('✅ Deal created successfully!', 'success');
        setTimeout(() => step3_InviteParty(), 5000);
    }, 12000);
}

// Step 3: Invite Other Party (12 seconds)
function step3_InviteParty() {
    updateProgress(3);
    updateStepInfo('3️⃣ Invite Other Party', 'Sending deal invitation to seller');
    
    const content = `
        <div class="fade-in">
            <div class="deal-card">
                <div class="deal-header">
                    <div class="deal-title">${DEMO_CONFIG.demoDeal.title}</div>
                    <div class="deal-status status-pending">Pending Invite</div>
                </div>
                <p style="color: #666; margin: 1rem 0;">${DEMO_CONFIG.demoDeal.description}</p>
                <div class="deal-amount">KES ${DEMO_CONFIG.demoDeal.amount.toLocaleString()}</div>
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Invite Party</h3>
            <div class="form-group">
                <label>Username</label>
                <input type="text" value="@${DEMO_CONFIG.demoUser2.username}" readonly>
            </div>
            <button class="btn btn-primary" style="margin-top: 1rem; opacity: 0.6;">Sending Invitation...</button>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Sending invitation...', 'info');
    
    setTimeout(() => {
        showToast('✅ Invitation sent to @' + DEMO_CONFIG.demoUser2.username, 'success');
        setTimeout(() => step4_AcceptDeal(), 4000);
    }, 6000);
}

// Step 4: Review & Accept Deal (12 seconds)
function step4_AcceptDeal() {
    updateProgress(4);
    updateStepInfo('4️⃣ Review & Accept Deal', 'Seller reviewing and accepting the deal');
    updateUser(DEMO_CONFIG.demoUser2);
    
    const content = `
        <div class="fade-in">
            <div style="padding: 1rem; background: #dbeafe; border-radius: 8px; margin-bottom: 1.5rem;">
                <strong>📨 New Deal Invitation</strong>
            </div>
            
            <div class="deal-card">
                <div class="deal-header">
                    <div class="deal-title">${DEMO_CONFIG.demoDeal.title}</div>
                    <div class="deal-status status-pending">Review Required</div>
                </div>
                <p style="color: #666; margin: 1rem 0;">${DEMO_CONFIG.demoDeal.description}</p>
                <div class="deal-amount">KES ${DEMO_CONFIG.demoDeal.amount.toLocaleString()}</div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: #f3f4f6; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Timeline:</span>
                        <strong>${DEMO_CONFIG.demoDeal.timeline} days</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>You'll receive:</span>
                        <strong style="color: #10b981;">KES ${(DEMO_CONFIG.demoDeal.amount - DEMO_CONFIG.demoDeal.platformFee).toLocaleString()}</strong>
                    </div>
                </div>
            </div>
            
            <button class="btn btn-success" style="margin-top: 1.5rem; width: 100%;">Accept Deal</button>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Reviewing deal terms...', 'info');
    
    setTimeout(() => {
        showToast('✅ Deal accepted - Now locked!', 'success');
        setTimeout(() => step5_Payment(), 4000);
    }, 6000);
}

// Step 5: Mobile Money Payment (25 seconds)
function step5_Payment() {
    updateProgress(5);
    updateStepInfo('5️⃣ Mobile Money Payment', 'Buyer paying via M-Pesa, funds locked in escrow');
    updateUser(DEMO_CONFIG.demoUser1);
    
    const content = `
        <div class="fade-in">
            <div class="deal-card">
                <div class="deal-header">
                    <div class="deal-title">${DEMO_CONFIG.demoDeal.title}</div>
                    <div class="deal-status status-accepted">Accepted</div>
                </div>
                <div class="deal-amount">KES ${DEMO_CONFIG.demoDeal.amount.toLocaleString()}</div>
                <p style="color: #666; margin-top: 0.5rem;">Payment required to start deal</p>
            </div>
            
            <div class="balance-card" style="margin-top: 2rem;">
                <div class="balance-label">Your Balance</div>
                <div class="balance-amount">KES ${DEMO_CONFIG.demoUser1.balance.toLocaleString()}</div>
            </div>
            
            <button class="btn btn-primary" style="margin-top: 1.5rem; width: 100%;">Pay with Mobile Money</button>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Initiating payment...', 'info');
    
    setTimeout(() => {
        showModal(`
            <div class="modal-icon">📱</div>
            <h3>M-Pesa STK Push</h3>
            <p style="margin: 1rem 0;">Enter your M-Pesa PIN on your phone</p>
            <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <strong>${DEMO_CONFIG.demoUser1.phone}</strong>
            </div>
            <div style="color: #10b981; font-weight: 600;">✓ STK Push Sent</div>
        `);
        
        setTimeout(() => {
            hideModal();
            showToast('✅ Payment successful - Funds in escrow!', 'success');
            setTimeout(() => step6_CompleteDeal(), 3000);
        }, 10000);
    }, 8000);
}

// Step 6: Complete Deal (18 seconds)
function step6_CompleteDeal() {
    updateProgress(6);
    updateStepInfo('6️⃣ Complete Deal', 'Work delivered, buyer confirms completion');
    
    const content = `
        <div class="fade-in">
            <div class="deal-card">
                <div class="deal-header">
                    <div class="deal-title">${DEMO_CONFIG.demoDeal.title}</div>
                    <div class="deal-status status-in-progress">In Progress</div>
                </div>
                <div class="deal-amount">KES ${DEMO_CONFIG.demoDeal.amount.toLocaleString()}</div>
                <div style="margin-top: 1rem; padding: 1rem; background: #e0e7ff; border-radius: 8px;">
                    💰 <strong>Funds in Escrow</strong> - Protected until completion
                </div>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: #d1fae5; border-radius: 12px;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📦</div>
                <strong style="color: #065f46;">Seller has delivered the work</strong>
                <p style="color: #065f46; margin-top: 0.5rem; font-size: 0.9rem;">Review and mark as complete to release payment</p>
            </div>
            
            <button class="btn btn-success" style="margin-top: 1.5rem; width: 100%;">Mark as Completed</button>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Work delivered by seller...', 'info');
    
    setTimeout(() => {
        showToast('Buyer confirming completion...', 'info');
        setTimeout(() => {
            showToast('✅ Deal completed - Funds released!', 'success');
            setTimeout(() => step7_Withdraw(), 3000);
        }, 6000);
    }, 6000);
}

// Step 7: Withdraw Funds (22 seconds)
function step7_Withdraw() {
    updateProgress(7);
    updateStepInfo('7️⃣ Withdraw Funds', 'Seller withdrawing earnings to Mobile Money');
    updateUser(DEMO_CONFIG.demoUser2);
    
    const sellerEarnings = DEMO_CONFIG.demoDeal.amount - DEMO_CONFIG.demoDeal.platformFee;
    const newBalance = DEMO_CONFIG.demoUser2.balance + sellerEarnings;
    
    const content = `
        <div class="fade-in">
            <div class="balance-card">
                <div class="balance-label">Available Balance</div>
                <div class="balance-amount">KES ${newBalance.toLocaleString()}</div>
            </div>
            
            <h3 style="margin: 2rem 0 1rem;">Withdraw to Mobile Money</h3>
            
            <div class="form-group">
                <label>Amount</label>
                <input type="text" value="45,000" readonly>
            </div>
            
            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" value="${DEMO_CONFIG.demoUser2.phone}" readonly>
            </div>
            
            <div style="padding: 1rem; background: #fef3c7; border-radius: 8px; margin: 1rem 0;">
                🔐 <strong>First-time withdrawal requires ID verification</strong>
            </div>
            
            <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Withdraw Funds</button>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('Processing withdrawal...', 'info');
    
    setTimeout(() => {
        showModal(`
            <div class="modal-icon">🔐</div>
            <h3>Identity Verification</h3>
            <p>Verifying ID and face recognition...</p>
            <div style="margin: 1.5rem 0;">
                <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="width: 70%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); animation: progress 2s ease-in-out;"></div>
                </div>
            </div>
        `);
        
        setTimeout(() => {
            hideModal();
            showToast('✅ Identity verified!', 'success');
            setTimeout(() => {
                showToast('✅ KES 45,000 sent to Mobile Money', 'success');
                setTimeout(() => step8_Dispute(), 3000);
            }, 4000);
        }, 8000);
    }, 4000);
}

// Step 8: Dispute Scenario (18 seconds)
function step8_Dispute() {
    updateProgress(8);
    updateStepInfo('8️⃣ Dispute Resolution', 'Handling disputes fairly with support team');
    
    const content = `
        <div class="fade-in">
            <h2>Disputes</h2>
            
            <div class="deal-card">
                <div class="deal-header">
                    <div class="deal-title">Logo Design Service</div>
                    <div class="deal-status status-disputed">Disputed</div>
                </div>
                <div class="deal-amount">KES 15,000</div>
                <div style="margin-top: 1rem; padding: 1rem; background: #fee2e2; border-radius: 8px;">
                    <strong style="color: #991b1b;">Dispute Reason:</strong>
                    <p style="color: #991b1b; margin-top: 0.5rem; font-size: 0.95rem;">
                        Deliverable does not match agreed specifications
                    </p>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #e0e7ff; border-radius: 8px;">
                    <strong>👥 Support Team Assigned</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        Reviewing evidence from both parties...
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    showToast('⚠️ Dispute under review', 'warning');
    
    setTimeout(() => {
        showToast('Support team reviewing evidence...', 'info');
        setTimeout(() => {
            const resolvedContent = `
                <div class="fade-in">
                    <h2>Dispute Resolved</h2>
                    
                    <div class="deal-card">
                        <div class="deal-header">
                            <div class="deal-title">Logo Design Service</div>
                            <div class="deal-status status-completed">Resolved</div>
                        </div>
                        <div class="deal-amount">KES 15,000</div>
                        <div style="margin-top: 1rem; padding: 1.5rem; background: #d1fae5; border-radius: 8px;">
                            <strong style="color: #065f46;">✅ Resolution:</strong>
                            <p style="color: #065f46; margin-top: 0.5rem;">
                                Partial refund issued to buyer based on evidence review. 
                                Fair decision made by support team.
                            </p>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('contentArea').innerHTML = resolvedContent;
            showToast('✅ Dispute resolved fairly!', 'success');
            setTimeout(() => completeDemoSequence(), 4000);
        }, 8000);
    }, 4000);
}

function completeDemoSequence() {
    updateStepInfo('🎉 Demo Complete!', 'All features showcased successfully');
    
    const content = `
        <div class="fade-in" style="text-align: center; padding: 3rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="margin-bottom: 1rem;">Demo Complete!</h2>
            <p style="color: #666; margin-bottom: 2rem;">
                You've seen all the key features of Escrow Africa
            </p>
            
            <div style="background: #f3f4f6; padding: 2rem; border-radius: 15px; text-align: left; max-width: 400px; margin: 0 auto;">
                <strong style="display: block; margin-bottom: 1rem;">✨ Features Demonstrated:</strong>
                <div style="display: grid; gap: 0.75rem;">
                    <div>✅ Sign Up & Verification</div>
                    <div>✅ Deal Creation</div>
                    <div>✅ Party Invitation</div>
                    <div>✅ Deal Acceptance</div>
                    <div>✅ Mobile Money Payment</div>
                    <div>✅ Deal Completion</div>
                    <div>✅ Fund Withdrawal</div>
                    <div>✅ Dispute Resolution</div>
                </div>
            </div>
            
            <button class="btn btn-primary" style="margin-top: 2rem;" onclick="location.reload()">
                Restart Demo
            </button>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
    document.getElementById('progressFill').style.width = '100%';
    showToast('🎉 Thanks for watching the demo!', 'success');
}

// Step 1: Sign Up (15 seconds)
function step1_SignUp() {
    window.location.href = 'index.html?demo=signup';
    
    setTimeout(() => {
        // Register first user (buyer)
        const user1 = {
            id: 'user_' + Date.now(),
            ...DEMO_CONFIG.demoUser1,
            balance: 100000,
            verified: true,
            createdAt: new Date().toISOString()
        };
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(user1);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user1));
        
        // Show success message
        showDemoMessage('✅ Account Created & Verified', 'success');
        
        setTimeout(() => {
            // Register second user (seller)
            const user2 = {
                id: 'user_' + (Date.now() + 1),
                ...DEMO_CONFIG.demoUser2,
                balance: 50000,
                verified: true,
                createdAt: new Date().toISOString()
            };
            users.push(user2);
            localStorage.setItem('users', JSON.stringify(users));
            
            step2_CreateDeal();
        }, 8000);
    }, 2000);
}

// Step 2: Create Deal (18 seconds)
function step2_CreateDeal() {
    window.location.href = 'pages/deal-create.html?demo=create';
    
    setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const dealId = 'deal_' + Date.now();
        
        const deal = {
            id: dealId,
            ...DEMO_CONFIG.demoDeal,
            creatorId: currentUser.id,
            creatorRole: 'buyer',
            status: 'pending_invite',
            platformFee: DEMO_CONFIG.demoDeal.amount * 0.05,
            createdAt: new Date().toISOString(),
            participants: [currentUser.id]
        };
        
        let deals = JSON.parse(localStorage.getItem('deals') || '[]');
        deals.push(deal);
        localStorage.setItem('deals', JSON.stringify(deals));
        localStorage.setItem('currentDeal', dealId);
        
        // Animate form filling
        animateFormFilling();
        
        setTimeout(() => {
            showDemoMessage('✅ Deal Created Successfully', 'success');
            setTimeout(() => step3_InviteParty(), 3000);
        }, 12000);
    }, 2000);
}

// Step 3: Invite Other Party (12 seconds)
function step3_InviteParty() {
    window.location.href = 'pages/deal-invite.html?demo=invite';
    
    setTimeout(() => {
        const dealId = localStorage.getItem('currentDeal');
        const deals = JSON.parse(localStorage.getItem('deals') || '[]');
        const deal = deals.find(d => d.id === dealId);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const seller = users.find(u => u.username === DEMO_CONFIG.demoUser2.username);
        
        if (deal && seller) {
            deal.invitedUser = seller.id;
            deal.participants.push(seller.id);
            localStorage.setItem('deals', JSON.stringify(deals));
            
            // Add notification for invited user
            addNotification(seller.id, 'Deal Invitation', `You've been invited to: ${deal.title}`, 'info');
        }
        
        showDemoMessage('✅ Invitation Sent to @' + DEMO_CONFIG.demoUser2.username, 'success');
        setTimeout(() => step4_AcceptDeal(), 8000);
    }, 2000);
}

// Step 4: Review & Accept Deal (10 seconds)
function step4_AcceptDeal() {
    // Switch to seller account
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const seller = users.find(u => u.username === DEMO_CONFIG.demoUser2.username);
    localStorage.setItem('currentUser', JSON.stringify(seller));
    
    const dealId = localStorage.getItem('currentDeal');
    window.location.href = `pages/deal-detail.html?id=${dealId}&demo=accept`;
    
    setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem('deals') || '[]');
        const deal = deals.find(d => d.id === dealId);
        
        if (deal) {
            deal.status = 'accepted';
            deal.acceptedAt = new Date().toISOString();
            deal.sellerRole = 'seller';
            localStorage.setItem('deals', JSON.stringify(deals));
        }
        
        showDemoMessage('✅ Deal Accepted - Now Read-Only', 'success');
        setTimeout(() => step5_Payment(), 6000);
    }, 2000);
}

// Step 5: Payment & Escrow (25 seconds)
function step5_Payment() {
    // Switch back to buyer
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const buyer = users.find(u => u.username === DEMO_CONFIG.demoUser1.username);
    localStorage.setItem('currentUser', JSON.stringify(buyer));
    
    const dealId = localStorage.getItem('currentDeal');
    window.location.href = `pages/deal-detail.html?id=${dealId}&demo=payment`;
    
    setTimeout(() => {
        showDemoMessage('💳 Initiating Mobile Money Payment...', 'info');
        
        setTimeout(() => {
            // Simulate M-Pesa payment flow
            showMobileMoneyPrompt();
            
            setTimeout(() => {
                const deals = JSON.parse(localStorage.getItem('deals') || '[]');
                const deal = deals.find(d => d.id === dealId);
                
                if (deal) {
                    deal.status = 'in_progress';
                    deal.paidAt = new Date().toISOString();
                    deal.escrowAmount = deal.amount;
                    localStorage.setItem('deals', JSON.stringify(deals));
                    
                    // Create transaction
                    createTransaction({
                        type: 'escrow_deposit',
                        amount: deal.amount,
                        dealId: deal.id,
                        status: 'completed',
                        method: 'mobile_money'
                    });
                }
                
                showDemoMessage('✅ Payment Successful - Funds in Escrow', 'success');
                setTimeout(() => step6_CompleteDeal(), 5000);
            }, 12000);
        }, 5000);
    }, 2000);
}

// Step 6: Complete Deal (20 seconds)
function step6_CompleteDeal() {
    const dealId = localStorage.getItem('currentDeal');
    window.location.href = `pages/deal-detail.html?id=${dealId}&demo=complete`;
    
    setTimeout(() => {
        showDemoMessage('📦 Seller has delivered the work...', 'info');
        
        setTimeout(() => {
            showDemoMessage('✅ Buyer marking deal as complete...', 'info');
            
            setTimeout(() => {
                const deals = JSON.parse(localStorage.getItem('deals') || '[]');
                const deal = deals.find(d => d.id === dealId);
                
                if (deal) {
                    const platformFee = deal.amount * 0.05;
                    const sellerAmount = deal.amount - platformFee;
                    
                    deal.status = 'completed';
                    deal.completedAt = new Date().toISOString();
                    localStorage.setItem('deals', JSON.stringify(deals));
                    
                    // Update seller balance
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const seller = users.find(u => u.username === DEMO_CONFIG.demoUser2.username);
                    if (seller) {
                        seller.balance += sellerAmount;
                        localStorage.setItem('users', JSON.stringify(users));
                    }
                    
                    createTransaction({
                        type: 'escrow_release',
                        amount: sellerAmount,
                        dealId: deal.id,
                        status: 'completed',
                        fee: platformFee
                    });
                }
                
                showDemoMessage('✅ Deal Completed - Funds Released!', 'success');
                setTimeout(() => step7_Withdraw(), 5000);
            }, 6000);
        }, 6000);
    }, 2000);
}

// Step 7: Withdraw Funds (20 seconds)
function step7_Withdraw() {
    // Switch to seller
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const seller = users.find(u => u.username === DEMO_CONFIG.demoUser2.username);
    localStorage.setItem('currentUser', JSON.stringify(seller));
    
    window.location.href = 'pages/withdraw.html?demo=withdraw';
    
    setTimeout(() => {
        showDemoMessage('🔐 ID Verification Required (First Time)', 'info');
        
        setTimeout(() => {
            showDemoMessage('✅ Identity Verified', 'success');
            
            setTimeout(() => {
                const withdrawAmount = 45000;
                
                createTransaction({
                    type: 'withdrawal',
                    amount: withdrawAmount,
                    status: 'completed',
                    method: 'mobile_money',
                    phone: seller.phone
                });
                
                seller.balance -= withdrawAmount;
                const updatedUsers = users.map(u => u.id === seller.id ? seller : u);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                
                showDemoMessage('✅ KES 45,000 Sent to Mobile Money', 'success');
                setTimeout(() => step8_Dispute(), 4000);
            }, 6000);
        }, 6000);
    }, 2000);
}

// Step 8: Dispute Scenario (20 seconds)
function step8_Dispute() {
    window.location.href = 'pages/disputes.html?demo=dispute';
    
    setTimeout(() => {
        // Create a sample dispute
        const dealId = 'deal_dispute_' + Date.now();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const disputeDeal = {
            id: dealId,
            title: 'Logo Design Service',
            amount: 15000,
            status: 'disputed',
            disputeReason: 'Deliverable does not match agreed specifications',
            disputedAt: new Date().toISOString(),
            creatorId: currentUser.id
        };
        
        let deals = JSON.parse(localStorage.getItem('deals') || '[]');
        deals.push(disputeDeal);
        localStorage.setItem('deals', JSON.stringify(deals));
        
        showDemoMessage('⚠️ Dispute Raised - Under Review', 'warning');
        
        setTimeout(() => {
            showDemoMessage('👥 Support Team Reviewing Evidence...', 'info');
            
            setTimeout(() => {
                disputeDeal.status = 'resolved';
                disputeDeal.resolvedAt = new Date().toISOString();
                disputeDeal.resolution = 'Partial refund issued to buyer';
                localStorage.setItem('deals', JSON.stringify(deals));
                
                showDemoMessage('✅ Dispute Resolved Fairly', 'success');
                
                setTimeout(() => {
                    completeDemoSequence();
                }, 4000);
            }, 8000);
        }, 5000);
    }, 2000);
}

function completeDemoSequence() {
    window.location.href = 'pages/dashboard.html?demo=complete';
    
    setTimeout(() => {
        showDemoMessage('🎉 Demo Complete! All Features Showcased', 'success', 5000);
    }, 1000);
}

// Helper Functions
function showDemoMessage(message, type = 'info', duration = 3000) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    overlay.textContent = message;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    }, duration);
}

function showMobileMoneyPrompt() {
    const prompt = document.createElement('div');
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        z-index: 10000;
        text-align: center;
        min-width: 300px;
    `;
    prompt.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #333;">📱 M-Pesa Payment</h3>
        <p style="color: #666; margin-bottom: 1rem;">Enter your mobile number:</p>
        <input type="tel" value="${DEMO_CONFIG.demoUser1.phone}" 
               style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem; font-size: 1rem;" readonly>
        <p style="color: #10b981; font-weight: 600;">✓ STK Push Sent</p>
        <p style="color: #666; font-size: 0.9rem;">Confirm payment on your phone...</p>
    `;
    document.body.appendChild(prompt);
    
    setTimeout(() => {
        prompt.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => prompt.remove(), 300);
    }, 8000);
}

function animateFormFilling() {
    showDemoMessage('📝 Filling deal details...', 'info', 2000);
}

function createTransaction(data) {
    const transaction = {
        id: 'tx_' + Date.now(),
        userId: JSON.parse(localStorage.getItem('currentUser')).id,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addNotification(userId, title, message, type) {
    const notification = {
        id: 'notif_' + Date.now(),
        userId,
        title,
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
