// Chat Module with Semi-Automated Responses
class Chat {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.chatScripts = [];
        this.currentChatId = null;
        this.currentMessages = [];
        this.init();
    }

    async init() {
        // Require authentication
        this.currentUser = Auth.requireAuth();
        
        // Load data
        await this.loadData();
        
        // Initialize UI
        this.loadChatList();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            // Load users
            const usersResponse = await fetch('../data/users.json');
            const usersData = await usersResponse.json();
            this.users = Array.isArray(usersData) ? usersData : (usersData.users || []);

            // Load chat scripts
            const scriptsResponse = await fetch('../data/chat-scripts.json');
            const scriptsData = await scriptsResponse.json();
            this.chatScripts = scriptsData.chatScripts || [];
            this.defaultResponses = scriptsData.defaultResponses ? scriptsData.defaultResponses[0].responses : [];
        } catch (error) {
            console.error('Error loading chat data:', error);
        }
    }

    loadChatList() {
        const container = document.getElementById('chatListItems');
        if (!container) return;

        // Find chats where current user is participant
        const userChats = this.chatScripts.filter(chat => 
            chat.participants.includes(this.currentUser.id)
        );

        if (userChats.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: var(--spacing-xl);">
                    <p>No conversations yet</p>
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">
                        Start searching for users to chat
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = userChats.map(chat => {
            // Get other participant
            const otherParticipantId = chat.participants.find(id => id !== this.currentUser.id);
            const otherUser = this.users.find(u => u.id === otherParticipantId);
            
            if (!otherUser) return '';

            return `
                <div class="chat-list-item" data-chat-id="${chat.chatId}">
                    <div class="chat-item-avatar">
                        ${otherUser.avatar}
                        <span class="online-indicator"></span>
                    </div>
                    <div class="chat-item-content">
                        <div class="chat-item-header">
                            <span class="chat-item-name">${otherUser.fullName}</span>
                            <span class="chat-item-time">Online</span>
                        </div>
                        <p class="chat-item-preview">Tap to start conversation</p>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.chat-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const chatId = parseInt(item.dataset.chatId);
                this.openChat(chatId);
            });
        });
    }

    openChat(chatId) {
        this.currentChatId = chatId;
        this.currentMessages = [];

        // Find chat data
        const chat = this.chatScripts.find(c => c.chatId === chatId);
        if (!chat) return;

        // Get other participant
        const otherParticipantId = chat.participants.find(id => id !== this.currentUser.id);
        const otherUser = this.users.find(u => u.id === otherParticipantId);

        // Update active chat in list
        document.querySelectorAll('.chat-list-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (activeItem) activeItem.classList.add('active');

        // Update header
        const chatHeaderInfo = document.getElementById('chatHeaderInfo');
        if (chatHeaderInfo) {
            chatHeaderInfo.innerHTML = `
                <h3>${otherUser.fullName}</h3>
                <p>Online</p>
            `;
        }

        // Show chat main on mobile
        const chatList = document.getElementById('chatList');
        const chatMain = document.getElementById('chatMain');
        if (window.innerWidth < 768) {
            chatList.classList.add('hidden');
            chatMain.classList.add('active');
        }

        // Show messages container
        document.querySelector('.chat-empty-state').style.display = 'none';
        document.getElementById('chatMessagesContainer').style.display = 'flex';

        // Clear messages
        this.renderMessages();

        // Focus input
        document.getElementById('messageInput').focus();
    }

    setupEventListeners() {
        // Back button (mobile)
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                if (window.innerWidth < 768 && this.currentChatId) {
                    e.preventDefault();
                    this.closeChat();
                }
            });
        }

        // Send message
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');

        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Attach button
        const attachBtn = document.getElementById('attachBtn');
        if (attachBtn) {
            attachBtn.addEventListener('click', () => this.showAttachmentOptions());
        }

        // More button
        const moreBtn = document.getElementById('moreBtn');
        if (moreBtn) {
            moreBtn.addEventListener('click', () => this.showMoreOptions());
        }

        // Create deal button in chat
        this.addCreateDealButton();
    }

    closeChat() {
        const chatList = document.getElementById('chatList');
        const chatMain = document.getElementById('chatMain');
        
        chatList.classList.remove('hidden');
        chatMain.classList.remove('active');
        
        this.currentChatId = null;
    }

    async sendMessage() {
        if (!this.currentChatId) return;

        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput.value.trim();
        
        if (!messageText) return;

        // Clear input
        messageInput.value = '';

        // Add user message
        const userMessage = {
            sender: this.currentUser.id,
            message: messageText,
            timestamp: new Date()
        };
        this.currentMessages.push(userMessage);
        this.renderMessages();

        // Scroll to bottom
        this.scrollToBottom();

        // Find and trigger scripted response
        await this.triggerScriptedResponse(messageText);
    }

    async triggerScriptedResponse(userMessage) {
        const chat = this.chatScripts.find(c => c.chatId === this.currentChatId);
        if (!chat) return;

        // Find matching script
        const script = chat.scripts.find(s => 
            userMessage.toLowerCase().includes(s.trigger.toLowerCase()) ||
            s.trigger.toLowerCase().includes(userMessage.toLowerCase())
        );

        // Show typing indicator
        this.showTypingIndicator();

        // Wait for delay
        const delay = script ? script.response.delay : 1500;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Hide typing indicator
        this.hideTypingIndicator();

        // Add response message
        let responseMessage;
        if (script) {
            responseMessage = {
                sender: script.response.sender,
                message: script.response.message,
                timestamp: new Date(),
                attachment: script.response.attachment
            };
        } else {
            // Use random default response
            const randomResponse = this.defaultResponses[
                Math.floor(Math.random() * this.defaultResponses.length)
            ];
            const otherParticipantId = chat.participants.find(id => id !== this.currentUser.id);
            responseMessage = {
                sender: otherParticipantId,
                message: randomResponse,
                timestamp: new Date()
            };
        }

        this.currentMessages.push(responseMessage);
        this.renderMessages();
        this.scrollToBottom();

        // Check if response mentions creating a deal
        if (script && script.response.message.toLowerCase().includes('create') && 
            script.response.message.toLowerCase().includes('deal')) {
            // Show "Create Deal" button suggestion
            setTimeout(() => {
                this.showCreateDealPrompt();
            }, 2000);
        }
    }

    showTypingIndicator() {
        const chat = this.chatScripts.find(c => c.chatId === this.currentChatId);
        const otherParticipantId = chat.participants.find(id => id !== this.currentUser.id);
        const otherUser = this.users.find(u => u.id === otherParticipantId);

        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">${otherUser.avatar}</div>
            <div class="typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = this.currentMessages.map(msg => {
            const isSent = msg.sender === this.currentUser.id;
            const sender = this.users.find(u => u.id === msg.sender);
            const time = this.formatMessageTime(msg.timestamp);

            let attachmentHTML = '';
            if (msg.attachment) {
                if (msg.attachment.type === 'image') {
                    attachmentHTML = `
                        <div class="message-attachment">
                            <img src="https://via.placeholder.com/240x180/0D9488/FFFFFF?text=${msg.attachment.name}" alt="Attachment">
                        </div>
                    `;
                }
            }

            return `
                <div class="message ${isSent ? 'sent' : 'received'}">
                    ${!isSent ? `<div class="message-avatar">${sender.avatar}</div>` : ''}
                    <div class="message-content">
                        <div class="message-bubble">
                            ${msg.message}
                            ${attachmentHTML}
                        </div>
                        <span class="message-time">${time}</span>
                    </div>
                    ${isSent ? `<div class="message-avatar">${sender.avatar}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    showCreateDealPrompt() {
        const chatMessages = document.getElementById('chatMessages');
        const promptDiv = document.createElement('div');
        promptDiv.className = 'deal-notification';
        promptDiv.innerHTML = `
            <div class="deal-card">
                <div class="deal-card-header">
                    📋 Create Escrow Deal
                </div>
                <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                    Ready to formalize this agreement with an escrow deal?
                </p>
                <button class="btn-primary" style="width: 100%;" onclick="chat.openCreateDealModal()">
                    Create Deal Now
                </button>
            </div>
        `;
        chatMessages.appendChild(promptDiv);
        this.scrollToBottom();
    }

    addCreateDealButton() {
        // Add floating create deal button
        const createBtn = document.createElement('button');
        createBtn.className = 'create-deal-btn';
        createBtn.innerHTML = '📋';
        createBtn.title = 'Create Escrow Deal';
        createBtn.style.display = 'none';
        createBtn.addEventListener('click', () => this.openCreateDealModal());
        document.body.appendChild(createBtn);

        // Show button when chat is open
        const observer = new MutationObserver(() => {
            if (this.currentChatId) {
                createBtn.style.display = 'flex';
            } else {
                createBtn.style.display = 'none';
            }
        });
    }

    openCreateDealModal() {
        const modal = document.getElementById('createDealModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);

            // Setup modal handlers
            this.setupDealModalHandlers();
        }
    }

    setupDealModalHandlers() {
        const modal = document.getElementById('createDealModal');
        const closeBtn = document.getElementById('closeDealModal');
        const cancelBtn = document.getElementById('cancelDealBtn');
        const form = document.getElementById('inChatDealForm');
        const amountInput = document.getElementById('dealAmount');
        const feeDisplay = document.getElementById('platformFeeDisplay');

        // Close handlers
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                form.reset();
            }, 300);
        };

        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        modal.querySelector('.modal-overlay').onclick = closeModal;

        // Calculate fee
        amountInput.oninput = (e) => {
            const amount = parseFloat(e.target.value) || 0;
            const fee = amount * 0.02;
            feeDisplay.textContent = `KES ${fee.toLocaleString()}`;
        };

        // Form submit
        form.onsubmit = (e) => {
            e.preventDefault();
            this.createDealFromChat(form);
            closeModal();
        };
    }

    createDealFromChat(form) {
        const formData = new FormData(form);
        const dealTitle = document.getElementById('dealTitle').value;
        const dealAmount = document.getElementById('dealAmount').value;

        // Show success message
        const chatMessages = document.getElementById('chatMessages');
        const dealNotification = document.createElement('div');
        dealNotification.className = 'deal-notification';
        dealNotification.innerHTML = `
            <div class="deal-card">
                <div class="deal-card-header">
                    ✅ Deal Created Successfully
                </div>
                <div class="deal-card-title">${dealTitle}</div>
                <div class="deal-card-amount">KES ${parseInt(dealAmount).toLocaleString()}</div>
                <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
                    Waiting for other party to accept
                </p>
                <div class="deal-card-actions">
                    <button class="btn-view" onclick="window.location.href='deal-detail.html?id=ESC-NEW'">
                        View Deal
                    </button>
                </div>
            </div>
        `;
        chatMessages.appendChild(dealNotification);
        this.scrollToBottom();

        // Show toast
        this.showToast('Deal created successfully! Waiting for acceptance.', 'success');
    }

    showAttachmentOptions() {
        const options = [
            { icon: '📷', label: 'Photo', action: 'photo' },
            { icon: '🎥', label: 'Video', action: 'video' },
            { icon: '📄', label: 'Document', action: 'document' }
        ];

        // Create bottom sheet
        const sheet = document.createElement('div');
        sheet.className = 'bottom-sheet';
        sheet.innerHTML = `
            <div class="sheet-overlay"></div>
            <div class="sheet-content">
                <div class="sheet-header">
                    <h3>Send Attachment</h3>
                    <button class="sheet-close">✕</button>
                </div>
                <div class="sheet-options">
                    ${options.map(opt => `
                        <button class="sheet-option" data-action="${opt.action}">
                            <span class="option-icon">${opt.icon}</span>
                            <span class="option-label">${opt.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(sheet);

        setTimeout(() => sheet.classList.add('show'), 10);

        // Close handlers
        const closeSheet = () => {
            sheet.classList.remove('show');
            setTimeout(() => sheet.remove(), 300);
        };

        sheet.querySelector('.sheet-overlay').onclick = closeSheet;
        sheet.querySelector('.sheet-close').onclick = closeSheet;

        // Option handlers
        sheet.querySelectorAll('.sheet-option').forEach(btn => {
            btn.onclick = () => {
                this.showToast('Attachment sent!', 'success');
                closeSheet();
            };
        });
    }

    showMoreOptions() {
        this.showToast('More options coming soon!', 'info');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize chat
const chat = new Chat();
