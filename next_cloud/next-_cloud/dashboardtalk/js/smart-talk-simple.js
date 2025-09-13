/**
 * Smart Talk Simple Widget
 * Simplified version with mock data for immediate functionality
 */

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.smartTalkSimpleLoaded) {
        return;
    }
    window.smartTalkSimpleLoaded = true;
    
    console.log('Initializing Smart Talk Simple Widget...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartTalkSimple);
    } else {
        initSmartTalkSimple();
    }
    
    function initSmartTalkSimple() {
        // Create the floating widget container
        createFloatingWidget();
        
        // Add global styles
        addGlobalStyles();
        
        // Initialize functionality
        initializeGlobalWidget();
    }
    
    function createFloatingWidget() {
        // Remove existing widget if any
        const existingWidget = document.getElementById('smart-talk-simple-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        // Create floating widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'smart-talk-simple-widget';
        widgetContainer.innerHTML = createWidgetHTML();
        
        // Add to body
        document.body.appendChild(widgetContainer);
    }
    
    function createWidgetHTML() {
        return `
            <div class="smart-talk-simple-widget" id="smart-talk-floating-simple">
                <div class="floating-header-simple">
                    <div class="floating-title-simple">
                        <span class="bot-icon-simple">🤖</span>
                        <span class="title-text-simple">Smart Talk</span>
                        <span class="status-indicator-simple" id="status-indicator-simple">●</span>
                    </div>
                    <div class="floating-actions-simple">
                        <button id="conversation-btn-simple" class="floating-btn-simple" title="Conversations">💬</button>
                        <button id="ai-btn-simple" class="floating-btn-simple" title="AI Assistant">🤖</button>
                        <button id="minimize-btn-simple" class="floating-btn-simple" title="Minimize">−</button>
                        <button id="close-btn-simple" class="floating-btn-simple" title="Close">×</button>
                    </div>
                </div>
                
                <div class="floating-content-simple" id="floating-content-simple">
                    <!-- Conversation Selection -->
                    <div class="conversation-selector-simple" id="conversation-selector-simple">
                        <div class="selector-header-simple">
                            <h4>💬 Nextcloud Talk Conversations</h4>
                            <button id="refresh-conversations-simple" class="refresh-btn-simple">🔄</button>
                        </div>
                        <div class="conversation-list-simple" id="conversation-list-simple">
                            <div class="loading-conversations-simple">Loading conversations...</div>
                        </div>
                    </div>
                    
                    <!-- Chat Interface -->
                    <div class="chat-interface-simple" id="chat-interface-simple" style="display: none;">
                        <div class="chat-header-simple">
                            <div class="conversation-info-simple" id="conversation-info-simple">
                                <span class="conversation-name-simple">Select a conversation</span>
                                <span class="conversation-type-simple" id="conversation-type-simple"></span>
                            </div>
                            <div class="chat-actions-simple">
                                <button id="switch-mode-simple" class="mode-btn-simple" title="Switch to AI Mode">🤖</button>
                            </div>
                        </div>
                        
                        <div class="floating-messages-simple" id="floating-messages-simple">
                            <div class="welcome-msg-simple">
                                <h4>🚀 Smart Talk Integrated</h4>
                                <p>Select a Nextcloud Talk conversation or use AI assistant</p>
                                <div class="quick-buttons-simple">
                                    <button class="quick-action-simple" onclick="askSimpleBot('Hello!')">👋 Hello</button>
                                    <button class="quick-action-simple" onclick="askSimpleBot('Help me')">❓ Help</button>
                                    <button class="quick-action-simple" onclick="showConversationSelectorSimple()">💬 Conversations</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="floating-typing-simple" id="floating-typing-simple" style="display: none;">
                            <div class="typing-indicator-simple">
                                <span class="typing-avatar-simple">🤖</span>
                                <div class="typing-dots-simple">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="floating-input-area-simple">
                            <input type="text" id="floating-input-simple" placeholder="Type a message..." />
                            <button id="floating-send-simple" class="floating-send-btn-simple">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Floating Toggle Button -->
            <div class="smart-talk-toggle-simple" id="smart-talk-toggle-simple">
                <button class="toggle-btn-simple" title="Open Smart Talk">
                    <span class="toggle-icon-simple">💬</span>
                </button>
            </div>
        `;
    }
    
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = getSimpleStyles();
        document.head.appendChild(style);
    }
    
    function getSimpleStyles() {
        return `
            /* Smart Talk Simple Widget Styles */
            #smart-talk-simple-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .smart-talk-simple-widget {
                width: 400px;
                height: 600px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e1e5e9;
                transform: translateY(100%);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .smart-talk-simple-widget.show {
                transform: translateY(0);
                opacity: 1;
            }

            .floating-header-simple {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .floating-title-simple {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .bot-icon-simple {
                font-size: 18px;
            }

            .title-text-simple {
                font-weight: 600;
                font-size: 14px;
            }

            .status-indicator-simple {
                font-size: 8px;
                color: #4ade80;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .floating-actions-simple {
                display: flex;
                gap: 4px;
            }

            .floating-btn-simple {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 4px;
                color: white;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }

            .floating-btn-simple:hover {
                background: rgba(255,255,255,0.3);
            }

            .floating-btn-simple.active {
                background: rgba(255,255,255,0.4);
            }

            .floating-content-simple {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            /* Conversation Selector Styles */
            .conversation-selector-simple {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .selector-header-simple {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .selector-header-simple h4 {
                margin: 0;
                color: #333;
                font-size: 16px;
            }

            .refresh-btn-simple {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 8px;
                cursor: pointer;
                font-size: 12px;
            }

            .conversation-list-simple {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            .conversation-item-simple {
                display: flex;
                align-items: center;
                padding: 12px;
                margin: 4px 0;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
                border: 1px solid #e9ecef;
            }

            .conversation-item-simple:hover {
                background: #f8f9fa;
            }

            .conversation-item-simple.selected {
                background: #e3f2fd;
                border-color: #667eea;
            }

            .conversation-avatar-simple {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #667eea;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                margin-right: 12px;
            }

            .conversation-details-simple {
                flex: 1;
            }

            .conversation-name-simple {
                font-weight: 600;
                color: #333;
                display: block;
                margin-bottom: 4px;
            }

            .conversation-type-simple {
                font-size: 12px;
                color: #666;
            }

            .conversation-status-simple {
                font-size: 10px;
                color: #4ade80;
            }

            /* Chat Interface Styles */
            .chat-interface-simple {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-header-simple {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .conversation-info-simple {
                flex: 1;
            }

            .conversation-name-simple {
                font-weight: 600;
                color: #333;
                display: block;
            }

            .conversation-type-simple {
                font-size: 12px;
                color: #666;
            }

            .chat-actions-simple {
                display: flex;
                gap: 8px;
            }

            .mode-btn-simple {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 8px;
                cursor: pointer;
                font-size: 12px;
            }

            .floating-messages-simple {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }

            .welcome-msg-simple {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .welcome-msg-simple h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }

            .welcome-msg-simple p {
                margin: 0 0 16px 0;
                color: #666;
                font-size: 13px;
            }

            .quick-buttons-simple {
                display: flex;
                gap: 6px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .quick-action-simple {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .quick-action-simple:hover {
                background: #5a6fd8;
            }

            .floating-message-simple {
                margin: 8px 0;
                padding: 10px;
                border-radius: 8px;
                max-width: 85%;
                word-wrap: break-word;
                font-size: 13px;
            }

            .floating-message-simple.user {
                background: #667eea;
                color: white;
                margin-left: auto;
                text-align: right;
            }

            .floating-message-simple.bot {
                background: #e9ecef;
                color: #333;
                margin-right: auto;
            }

            .floating-message-simple.talk {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
                margin-right: auto;
            }

            .message-header-simple {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 4px;
            }

            .message-time-simple {
                font-size: 10px;
                opacity: 0.6;
                margin-top: 4px;
            }

            .floating-typing-simple {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }

            .typing-indicator-simple {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .typing-avatar-simple {
                font-size: 14px;
            }

            .typing-dots-simple {
                display: flex;
                gap: 2px;
            }

            .typing-dots-simple span {
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }

            .typing-dots-simple span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots-simple span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }

            .floating-input-area-simple {
                display: flex;
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #e9ecef;
                gap: 8px;
            }

            #floating-input-simple {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 13px;
                outline: none;
            }

            #floating-input-simple:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }

            .floating-send-btn-simple {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .floating-send-btn-simple:hover {
                background: #5a6fd8;
            }

            .floating-send-btn-simple:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .smart-talk-toggle-simple {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            }

            .toggle-btn-simple {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }

            .toggle-btn-simple:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .smart-talk-simple-widget.hidden + .smart-talk-toggle-simple .toggle-btn-simple {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            }

            .smart-talk-simple-widget.show ~ .smart-talk-toggle-simple {
                display: none;
            }

            .loading-conversations-simple {
                text-align: center;
                padding: 20px;
                color: #666;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .smart-talk-simple-widget {
                    width: 350px;
                    height: 500px;
                }
                
                .smart-talk-toggle-simple {
                    bottom: 15px;
                    right: 15px;
                }
                
                .toggle-btn-simple {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }
        `;
    }
    
    function initializeGlobalWidget() {
        const floatingWidget = document.getElementById('smart-talk-floating-simple');
        const toggleBtn = document.querySelector('.toggle-btn-simple');
        const closeBtn = document.getElementById('close-btn-simple');
        const minimizeBtn = document.getElementById('minimize-btn-simple');
        const conversationBtn = document.getElementById('conversation-btn-simple');
        const aiBtn = document.getElementById('ai-btn-simple');
        const refreshBtn = document.getElementById('refresh-conversations-simple');
        const switchModeBtn = document.getElementById('switch-mode-simple');
        const floatingInput = document.getElementById('floating-input-simple');
        const floatingSend = document.getElementById('floating-send-simple');
        const floatingMessages = document.getElementById('floating-messages-simple');
        const floatingTyping = document.getElementById('floating-typing-simple');
        const statusIndicator = document.getElementById('status-indicator-simple');
        const conversationSelector = document.getElementById('conversation-selector-simple');
        const chatInterface = document.getElementById('chat-interface-simple');
        const conversationList = document.getElementById('conversation-list-simple');
        const conversationInfo = document.getElementById('conversation-info-simple');

        let isOpen = false;
        let currentMode = 'conversations'; // 'conversations' or 'ai'
        let currentConversation = null;
        let conversations = [];

        // Mock conversation data
        const mockConversations = [
            {
                token: 'general_chat',
                name: 'General Chat',
                displayName: 'General Discussion',
                type: 2,
                participantType: 'users',
                lastActivity: Date.now() - 86400000,
                unreadMessages: 2,
                isFavorite: true
            },
            {
                token: 'project_alpha',
                name: 'Project Alpha',
                displayName: 'Project Alpha Team',
                type: 2,
                participantType: 'users',
                lastActivity: Date.now() - 3600000,
                unreadMessages: 1,
                isFavorite: false
            },
            {
                token: 'admin_direct',
                name: 'admin',
                displayName: 'admin',
                type: 1,
                participantType: 'users',
                lastActivity: Date.now() - 1800000,
                unreadMessages: 0,
                isFavorite: false
            }
        ];

        // Mock messages data
        const mockMessages = {
            'general_chat': [
                {
                    id: 1,
                    message: 'Welcome to the general chat! This is where we discuss everything.',
                    actorId: 'admin',
                    actorDisplayName: 'admin',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 86400
                },
                {
                    id: 2,
                    message: 'Thanks for setting this up! Looking forward to collaborating.',
                    actorId: 'aashu',
                    actorDisplayName: 'Aashu',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 82800
                },
                {
                    id: 3,
                    message: 'This is great! I can see the integration is working.',
                    actorId: 'adithya',
                    actorDisplayName: 'Adithya',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 7200
                }
            ],
            'project_alpha': [
                {
                    id: 4,
                    message: 'Project Alpha is our main focus. Let\'s discuss the roadmap.',
                    actorId: 'admin',
                    actorDisplayName: 'admin',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 172800
                },
                {
                    id: 5,
                    message: 'I\'ve completed the initial design mockups. Ready for review.',
                    actorId: 'adithya',
                    actorDisplayName: 'Adithya',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 165600
                },
                {
                    id: 6,
                    message: 'The backend integration looks solid. Great work!',
                    actorId: 'aashu',
                    actorDisplayName: 'Aashu',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 14400
                }
            ],
            'admin_direct': [
                {
                    id: 7,
                    message: 'This is a direct message between admin and other users.',
                    actorId: 'admin',
                    actorDisplayName: 'admin',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 259200
                },
                {
                    id: 8,
                    message: 'Got it! The direct messaging is working perfectly.',
                    actorId: 'aashu',
                    actorDisplayName: 'Aashu',
                    actorType: 'users',
                    timestamp: Math.floor(Date.now() / 1000) - 252000
                }
            ]
        };

        // Event listeners
        toggleBtn.addEventListener('click', () => {
            if (isOpen) {
                hideWidget();
            } else {
                showWidget();
            }
        });

        closeBtn.addEventListener('click', hideWidget);
        minimizeBtn.addEventListener('click', hideWidget);
        conversationBtn.addEventListener('click', () => switchMode('conversations'));
        aiBtn.addEventListener('click', () => switchMode('ai'));
        refreshBtn.addEventListener('click', loadConversations);
        switchModeBtn.addEventListener('click', () => switchMode('conversations'));

        // Send message
        floatingSend.addEventListener('click', sendMessage);
        floatingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Global functions
        window.askSimpleBot = askSimpleBot;
        window.showConversationSelectorSimple = () => switchMode('conversations');

        function showWidget() {
            floatingWidget.classList.add('show');
            isOpen = true;
            
            if (currentMode === 'conversations') {
                loadConversations();
            }
        }

        function hideWidget() {
            floatingWidget.classList.remove('show');
            isOpen = false;
        }

        function switchMode(mode) {
            currentMode = mode;
            
            // Update button states
            conversationBtn.classList.toggle('active', mode === 'conversations');
            aiBtn.classList.toggle('active', mode === 'ai');
            
            if (mode === 'conversations') {
                conversationSelector.style.display = 'flex';
                chatInterface.style.display = 'none';
                loadConversations();
            } else {
                conversationSelector.style.display = 'none';
                chatInterface.style.display = 'flex';
                showWelcomeMessage();
            }
        }

        function loadConversations() {
            conversations = mockConversations;
            displayConversations();
        }

        function displayConversations() {
            if (conversations.length === 0) {
                conversationList.innerHTML = '<div class="loading-conversations-simple">No conversations found</div>';
                return;
            }

            conversationList.innerHTML = conversations.map(conv => `
                <div class="conversation-item-simple" data-token="${conv.token}">
                    <div class="conversation-avatar-simple">
                        ${conv.displayName ? conv.displayName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div class="conversation-details-simple">
                        <span class="conversation-name-simple">${conv.displayName || conv.name}</span>
                        <span class="conversation-type-simple">${conv.type === 1 ? 'One-to-One' : 'Group'}</span>
                        ${conv.unreadMessages > 0 ? `<span class="conversation-status-simple">${conv.unreadMessages} unread</span>` : ''}
                    </div>
                </div>
            `).join('');

            // Add click handlers
            conversationList.querySelectorAll('.conversation-item-simple').forEach(item => {
                item.addEventListener('click', () => {
                    const token = item.dataset.token;
                    selectConversation(token);
                });
            });
        }

        function selectConversation(token) {
            // Update UI
            conversationList.querySelectorAll('.conversation-item-simple').forEach(item => {
                item.classList.remove('selected');
            });
            conversationList.querySelector(`[data-token="${token}"]`).classList.add('selected');

            // Switch to chat interface
            conversationSelector.style.display = 'none';
            chatInterface.style.display = 'flex';

            // Update conversation info
            const conversation = conversations.find(c => c.token === token);
            conversationInfo.innerHTML = `
                <span class="conversation-name-simple">${conversation.displayName || conversation.name}</span>
                <span class="conversation-type-simple">${conversation.type === 1 ? 'One-to-One' : 'Group'}</span>
            `;

            // Load existing messages
            const messages = mockMessages[token] || [];
            displayMessages(messages);

            currentConversation = token;
            currentMode = 'chat';
        }

        function displayMessages(messages) {
            floatingMessages.innerHTML = '';
            messages.forEach(msg => {
                addMessage(msg.message, msg.actorType === 'bots' ? 'bot' : 'talk', msg.actorDisplayName, msg.timestamp);
            });
        }

        function sendMessage() {
            const message = floatingInput.value.trim();
            if (!message) return;

            if (currentMode === 'ai' || !currentConversation) {
                // AI mode
                addMessage(message, 'user', 'You', Date.now());
                floatingInput.value = '';
                
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    const response = getBotResponse(message);
                    addMessage(response, 'bot', 'NextBot', Date.now());
                }, 1500);
            } else {
                // Nextcloud Talk mode
                addMessage(message, 'user', 'You', Date.now());
                floatingInput.value = '';
                
                // Simulate sending to Nextcloud Talk
                setTimeout(() => {
                    const response = `Message sent to ${currentConversation}`;
                    addMessage(response, 'bot', 'System', Date.now());
                }, 500);
            }
        }

        function addMessage(text, type, sender, timestamp) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `floating-message-simple ${type}`;
            
            const time = new Date(timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageDiv.innerHTML = `
                <div class="message-header-simple">${sender}</div>
                <div>${text}</div>
                <div class="message-time-simple">${time}</div>
            `;
            floatingMessages.appendChild(messageDiv);
            floatingMessages.scrollTop = floatingMessages.scrollHeight;
        }

        function askSimpleBot(question) {
            if (currentMode === 'ai') {
                addMessage(question, 'user', 'You', Date.now());
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    const response = getBotResponse(question);
                    addMessage(response, 'bot', 'NextBot', Date.now());
                }, 1500);
            } else {
                showWidget();
                switchMode('ai');
                setTimeout(() => {
                    addMessage(question, 'user', 'You', Date.now());
                    showTyping();
                    setTimeout(() => {
                        hideTyping();
                        const response = getBotResponse(question);
                        addMessage(response, 'bot', 'NextBot', Date.now());
                    }, 1500);
                }, 300);
            }
        }

        function showWelcomeMessage() {
            floatingMessages.innerHTML = `
                <div class="welcome-msg-simple">
                    <h4>🚀 Smart Talk Integrated</h4>
                    <p>Select a Nextcloud Talk conversation or use AI assistant</p>
                    <div class="quick-buttons-simple">
                        <button class="quick-action-simple" onclick="askSimpleBot('Hello!')">👋 Hello</button>
                        <button class="quick-action-simple" onclick="askSimpleBot('Help me')">❓ Help</button>
                        <button class="quick-action-simple" onclick="showConversationSelectorSimple()">💬 Conversations</button>
                    </div>
                </div>
            `;
        }

        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                return "Hello! I'm NextBot, your AI assistant. I can help you with group management, answer questions, and provide information about Smart Talk features. How can I assist you today?";
            }
            
            if (lowerMessage.includes('group') || lowerMessage.includes('create')) {
                return "To create a new group, I can help you set that up! Group management allows you to organize team conversations with video/audio call support.";
            }
            
            if (lowerMessage.includes('feature') || lowerMessage.includes('help')) {
                return "Smart Talk features include: 🤖 AI Chat Assistant, 👥 Group Management, 📞 Video/Audio Calls, 🔄 Real-time Status, 😊 Message Reactions, and 📱 Mobile Support!";
            }
            
            if (lowerMessage.includes('call') || lowerMessage.includes('video')) {
                return "Video and audio calls are available in group chats! You can start conversations with your team members directly from the chat interface.";
            }
            
            if (lowerMessage.includes('status') || lowerMessage.includes('online')) {
                return "Real-time online/offline status is shown for all participants. Green indicators show online users, gray shows offline users.";
            }
            
            return "I'm here to help! You can ask me about creating groups, making calls, using features, or anything else about Smart Talk. What would you like to know?";
        }

        function showTyping() {
            floatingTyping.style.display = 'block';
        }

        function hideTyping() {
            floatingTyping.style.display = 'none';
        }

        console.log('Smart Talk Simple Widget initialized successfully!');
    }
})();
