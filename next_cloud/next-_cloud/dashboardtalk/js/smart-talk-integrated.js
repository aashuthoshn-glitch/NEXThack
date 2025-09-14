/**
 * Smart Talk Integrated Widget
 * Combines AI bot functionality with Nextcloud Talk integration
 */

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.smartTalkIntegratedLoaded) {
        return;
    }
    window.smartTalkIntegratedLoaded = true;
    
    console.log('Initializing Smart Talk Integrated Widget...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartTalkIntegrated);
    } else {
        initSmartTalkIntegrated();
    }
    
    function initSmartTalkIntegrated() {
        // Load services first
        loadServices().then(() => {
            // Create the floating widget container
            createFloatingWidget();
            
            // Add global styles
            addGlobalStyles();
            
            // Initialize functionality
            initializeGlobalWidget();
        });
    }
    
    function loadServices() {
        return new Promise((resolve) => {
            // Load Nextcloud Talk service
            const talkScript = document.createElement('script');
            talkScript.src = '/custom_apps/dashboardtalk/js/nextcloud-talk-service.js';
            talkScript.onload = () => {
                console.log('Nextcloud Talk Service loaded');
                resolve();
            };
            talkScript.onerror = () => {
                console.warn('Failed to load Nextcloud Talk Service, using fallback mode');
                resolve();
            };
            document.head.appendChild(talkScript);
        });
    }
    
    function createFloatingWidget() {
        // Remove existing widget if any
        const existingWidget = document.getElementById('smart-talk-integrated-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        // Create floating widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'smart-talk-integrated-widget';
        widgetContainer.innerHTML = createWidgetHTML();
        
        // Add to body
        document.body.appendChild(widgetContainer);
    }
    
    function createWidgetHTML() {
        return `
            <div class="smart-talk-integrated-widget" id="smart-talk-floating-integrated">
                <div class="floating-header-integrated">
                    <div class="floating-title-integrated">
                        <span class="bot-icon-integrated">🤖</span>
                        <span class="title-text-integrated">Smart Talk</span>
                        <span class="status-indicator-integrated" id="status-indicator-integrated">●</span>
                    </div>
                    <div class="floating-actions-integrated">
                        <button id="conversation-btn" class="floating-btn-integrated" title="Conversations">💬</button>
                        <button id="ai-btn" class="floating-btn-integrated" title="AI Assistant">🤖</button>
                        <button id="minimize-btn-integrated" class="floating-btn-integrated" title="Minimize">−</button>
                        <button id="close-btn-integrated" class="floating-btn-integrated" title="Close">×</button>
                    </div>
                </div>
                
                <div class="floating-content-integrated" id="floating-content-integrated">
                    <!-- Conversation Selection -->
                    <div class="conversation-selector-integrated" id="conversation-selector">
                        <div class="selector-header">
                            <h4>💬 Nextcloud Talk Conversations</h4>
                            <button id="refresh-conversations" class="refresh-btn">🔄</button>
                        </div>
                        <div class="conversation-list" id="conversation-list">
                            <div class="loading-conversations">Loading conversations...</div>
                        </div>
                    </div>
                    
                    <!-- Chat Interface -->
                    <div class="chat-interface-integrated" id="chat-interface" style="display: none;">
                        <div class="chat-header-integrated">
                            <div class="conversation-info" id="conversation-info">
                                <span class="conversation-name">Select a conversation</span>
                                <span class="conversation-type" id="conversation-type"></span>
                            </div>
                            <div class="chat-actions">
                                <button id="switch-mode" class="mode-btn" title="Switch to AI Mode">🤖</button>
                            </div>
                        </div>
                        
                        <div class="floating-messages-integrated" id="floating-messages-integrated">
                            <div class="welcome-msg-integrated">
                                <h4>🚀 Smart Talk Integrated</h4>
                                <p>Select a Nextcloud Talk conversation or use AI assistant</p>
                                <div class="quick-buttons-integrated">
                                    <button class="quick-action-integrated" onclick="askIntegratedBot('Hello!')">👋 Hello</button>
                                    <button class="quick-action-integrated" onclick="askIntegratedBot('Help me')">❓ Help</button>
                                    <button class="quick-action-integrated" onclick="showConversationSelector()">💬 Conversations</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="floating-typing-integrated" id="floating-typing-integrated" style="display: none;">
                            <div class="typing-indicator-integrated">
                                <span class="typing-avatar-integrated">🤖</span>
                                <div class="typing-dots-integrated">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="floating-input-area-integrated">
                            <input type="text" id="floating-input-integrated" placeholder="Type a message..." />
                            <button id="floating-send-integrated" class="floating-send-btn-integrated">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Floating Toggle Button -->
            <div class="smart-talk-toggle-integrated" id="smart-talk-toggle-integrated">
                <button class="toggle-btn-integrated" title="Open Smart Talk">
                    <span class="toggle-icon-integrated">💬</span>
                </button>
            </div>
        `;
    }
    
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = getIntegratedStyles();
        document.head.appendChild(style);
    }
    
    function getIntegratedStyles() {
        return `
            /* Smart Talk Integrated Widget Styles */
            #smart-talk-integrated-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .smart-talk-integrated-widget {
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

            .smart-talk-integrated-widget.show {
                transform: translateY(0);
                opacity: 1;
            }

            .floating-header-integrated {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .floating-title-integrated {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .bot-icon-integrated {
                font-size: 18px;
            }

            .title-text-integrated {
                font-weight: 600;
                font-size: 14px;
            }

            .status-indicator-integrated {
                font-size: 8px;
                color: #4ade80;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .floating-actions-integrated {
                display: flex;
                gap: 4px;
            }

            .floating-btn-integrated {
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

            .floating-btn-integrated:hover {
                background: rgba(255,255,255,0.3);
            }

            .floating-btn-integrated.active {
                background: rgba(255,255,255,0.4);
            }

            .floating-content-integrated {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            /* Conversation Selector Styles */
            .conversation-selector-integrated {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .selector-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .selector-header h4 {
                margin: 0;
                color: #333;
                font-size: 16px;
            }

            .refresh-btn {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 8px;
                cursor: pointer;
                font-size: 12px;
            }

            .conversation-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            .conversation-item {
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

            .conversation-item:hover {
                background: #f8f9fa;
            }

            .conversation-item.selected {
                background: #e3f2fd;
                border-color: #667eea;
            }

            .conversation-avatar {
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

            .conversation-details {
                flex: 1;
            }

            .conversation-name {
                font-weight: 600;
                color: #333;
                display: block;
                margin-bottom: 4px;
            }

            .conversation-type {
                font-size: 12px;
                color: #666;
            }

            .conversation-status {
                font-size: 10px;
                color: #4ade80;
            }

            /* Chat Interface Styles */
            .chat-interface-integrated {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-header-integrated {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .conversation-info {
                flex: 1;
            }

            .conversation-name {
                font-weight: 600;
                color: #333;
                display: block;
            }

            .conversation-type {
                font-size: 12px;
                color: #666;
            }

            .chat-actions {
                display: flex;
                gap: 8px;
            }

            .mode-btn {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 8px;
                cursor: pointer;
                font-size: 12px;
            }

            .floating-messages-integrated {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }

            .welcome-msg-integrated {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .welcome-msg-integrated h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }

            .welcome-msg-integrated p {
                margin: 0 0 16px 0;
                color: #666;
                font-size: 13px;
            }

            .quick-buttons-integrated {
                display: flex;
                gap: 6px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .quick-action-integrated {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .quick-action-integrated:hover {
                background: #5a6fd8;
            }

            .floating-message-integrated {
                margin: 8px 0;
                padding: 10px;
                border-radius: 8px;
                max-width: 85%;
                word-wrap: break-word;
                font-size: 13px;
            }

            .floating-message-integrated.user {
                background: #667eea;
                color: white;
                margin-left: auto;
                text-align: right;
            }

            .floating-message-integrated.bot {
                background: #e9ecef;
                color: #333;
                margin-right: auto;
            }

            .floating-message-integrated.talk {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
                margin-right: auto;
            }

            .message-header-integrated {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 4px;
            }

            .message-time-integrated {
                font-size: 10px;
                opacity: 0.6;
                margin-top: 4px;
            }

            .floating-typing-integrated {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }

            .typing-indicator-integrated {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .typing-avatar-integrated {
                font-size: 14px;
            }

            .typing-dots-integrated {
                display: flex;
                gap: 2px;
            }

            .typing-dots-integrated span {
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }

            .typing-dots-integrated span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots-integrated span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }

            .floating-input-area-integrated {
                display: flex;
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #e9ecef;
                gap: 8px;
            }

            #floating-input-integrated {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 13px;
                outline: none;
            }

            #floating-input-integrated:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }

            .floating-send-btn-integrated {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .floating-send-btn-integrated:hover {
                background: #5a6fd8;
            }

            .floating-send-btn-integrated:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .smart-talk-toggle-integrated {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            }

            .toggle-btn-integrated {
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

            .toggle-btn-integrated:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .smart-talk-integrated-widget.hidden + .smart-talk-toggle-integrated .toggle-btn-integrated {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            }

            .smart-talk-integrated-widget.show ~ .smart-talk-toggle-integrated {
                display: none;
            }

            .loading-conversations {
                text-align: center;
                padding: 20px;
                color: #666;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .smart-talk-integrated-widget {
                    width: 350px;
                    height: 500px;
                }
                
                .smart-talk-toggle-integrated {
                    bottom: 15px;
                    right: 15px;
                }
                
                .toggle-btn-integrated {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }
        `;
    }
    
    function initializeGlobalWidget() {
        const floatingWidget = document.getElementById('smart-talk-floating-integrated');
        const toggleBtn = document.querySelector('.toggle-btn-integrated');
        const closeBtn = document.getElementById('close-btn-integrated');
        const minimizeBtn = document.getElementById('minimize-btn-integrated');
        const conversationBtn = document.getElementById('conversation-btn');
        const aiBtn = document.getElementById('ai-btn');
        const refreshBtn = document.getElementById('refresh-conversations');
        const switchModeBtn = document.getElementById('switch-mode');
        const floatingInput = document.getElementById('floating-input-integrated');
        const floatingSend = document.getElementById('floating-send-integrated');
        const floatingMessages = document.getElementById('floating-messages-integrated');
        const floatingTyping = document.getElementById('floating-typing-integrated');
        const statusIndicator = document.getElementById('status-indicator-integrated');
        const conversationSelector = document.getElementById('conversation-selector');
        const chatInterface = document.getElementById('chat-interface');
        const conversationList = document.getElementById('conversation-list');
        const conversationInfo = document.getElementById('conversation-info');

        let isOpen = false;
        let currentMode = 'conversations'; // 'conversations' or 'ai'
        let currentConversation = null;
        let talkService = null;
        let conversations = [];

        // Initialize services
        if (window.NextcloudTalkService) {
            talkService = new window.NextcloudTalkService();
            statusIndicator.style.color = '#4ade80';
        } else {
            statusIndicator.style.color = '#f59e0b';
            console.warn('Nextcloud Talk Service not available, using AI mode only');
        }

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
        window.askIntegratedBot = askIntegratedBot;
        window.showConversationSelector = () => switchMode('conversations');

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
            
            if (talkService) {
                talkService.disconnect();
            }
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

        async function loadConversations() {
            if (!talkService) {
                conversationList.innerHTML = '<div class="loading-conversations">Nextcloud Talk service not available</div>';
                return;
            }

            conversationList.innerHTML = '<div class="loading-conversations">Loading conversations...</div>';

            try {
                const data = await talkService.initialize();
                conversations = data.conversations;
                displayConversations();
            } catch (error) {
                console.error('Error loading conversations:', error);
                conversationList.innerHTML = '<div class="loading-conversations">Error loading conversations</div>';
            }
        }

        function displayConversations() {
            if (conversations.length === 0) {
                conversationList.innerHTML = '<div class="loading-conversations">No conversations found</div>';
                return;
            }

            conversationList.innerHTML = conversations.map(conv => `
                <div class="conversation-item" data-token="${conv.token}">
                    <div class="conversation-avatar">
                        ${conv.displayName ? conv.displayName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div class="conversation-details">
                        <span class="conversation-name">${conv.displayName || conv.name}</span>
                        <span class="conversation-type">${conv.type === 1 ? 'One-to-One' : 'Group'}</span>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            conversationList.querySelectorAll('.conversation-item').forEach(item => {
                item.addEventListener('click', () => {
                    const token = item.dataset.token;
                    selectConversation(token);
                });
            });
        }

        async function selectConversation(token) {
            if (!talkService) return;

            try {
                // Update UI
                conversationList.querySelectorAll('.conversation-item').forEach(item => {
                    item.classList.remove('selected');
                });
                conversationList.querySelector(`[data-token="${token}"]`).classList.add('selected');

                // Switch to chat interface
                conversationSelector.style.display = 'none';
                chatInterface.style.display = 'flex';

                // Update conversation info
                const conversation = conversations.find(c => c.token === token);
                conversationInfo.innerHTML = `
                    <span class="conversation-name">${conversation.displayName || conversation.name}</span>
                    <span class="conversation-type">${conversation.type === 1 ? 'One-to-One' : 'Group'}</span>
                `;

                // Join conversation and establish connection
                await talkService.joinConversation(token);
                await talkService.establishWebSocketConnection(token);
                
                // Add message handler
                talkService.addMessageHandler(handleIncomingMessage);
                
                // Load existing messages
                const messages = await talkService.getMessages(token);
                displayMessages(messages);

                currentConversation = token;
                currentMode = 'chat';

            } catch (error) {
                console.error('Error selecting conversation:', error);
                addMessage('Error joining conversation. Please try again.', 'bot', 'System');
            }
        }

        function handleIncomingMessage(message) {
            addMessage(message.message, 'talk', message.actorDisplayName || 'User', message.timestamp);
        }

        function displayMessages(messages) {
            floatingMessages.innerHTML = '';
            messages.forEach(msg => {
                addMessage(msg.message, msg.actorType === 'bots' ? 'bot' : 'talk', msg.actorDisplayName, msg.timestamp);
            });
        }

        async function sendMessage() {
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
                try {
                    addMessage(message, 'user', 'You', Date.now());
                    floatingInput.value = '';
                    floatingSend.disabled = true;

                    await talkService.sendMessage(currentConversation, message);
                    floatingSend.disabled = false;
                } catch (error) {
                    console.error('Error sending message:', error);
                    addMessage('Error sending message. Please try again.', 'bot', 'System', Date.now());
                    floatingSend.disabled = false;
                }
            }
        }

        function addMessage(text, type, sender, timestamp) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `floating-message-integrated ${type}`;
            
            const time = new Date(timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageDiv.innerHTML = `
                <div class="message-header-integrated">${sender}</div>
                <div>${text}</div>
                <div class="message-time-integrated">${time}</div>
            `;
            floatingMessages.appendChild(messageDiv);
            floatingMessages.scrollTop = floatingMessages.scrollHeight;
        }

        function askIntegratedBot(question) {
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
                <div class="welcome-msg-integrated">
                    <h4>🚀 Smart Talk Integrated</h4>
                    <p>Select a Nextcloud Talk conversation or use AI assistant</p>
                    <div class="quick-buttons-integrated">
                        <button class="quick-action-integrated" onclick="askIntegratedBot('Hello!')">👋 Hello</button>
                        <button class="quick-action-integrated" onclick="askIntegratedBot('Help me')">❓ Help</button>
                        <button class="quick-action-integrated" onclick="showConversationSelector()">💬 Conversations</button>
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

        console.log('Smart Talk Integrated Widget initialized successfully!');
    }
})();


