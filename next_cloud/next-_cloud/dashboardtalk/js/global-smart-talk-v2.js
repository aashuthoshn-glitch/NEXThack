/**
 * Global Smart Talk Widget v2
 * AI-Powered Chat & Group Management with Real API Integration
 */

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.smartTalkGlobalV2Loaded) {
        return;
    }
    window.smartTalkGlobalV2Loaded = true;
    
    console.log('Initializing Global Smart Talk Widget v2...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartTalkV2);
    } else {
        initSmartTalkV2();
    }
    
    function initSmartTalkV2() {
        // Load API client first
        loadAPIClient().then(() => {
            // Create the floating widget container
            createFloatingWidget();
            
            // Add global styles
            addGlobalStyles();
            
            // Initialize functionality
            initializeGlobalWidget();
        });
    }
    
    function loadAPIClient() {
        return new Promise((resolve) => {
            // Check if API client is already loaded
            if (window.SmartTalkAPI) {
                resolve();
                return;
            }
            
            // Load the API client script
            const script = document.createElement('script');
            script.src = '/custom_apps/dashboardtalk/js/smart-talk-api.js';
            script.onload = () => resolve();
            script.onerror = () => {
                console.warn('Failed to load API client, using fallback mode');
                resolve();
            };
            document.head.appendChild(script);
        });
    }
    
    function createFloatingWidget() {
        // Remove existing widget if any
        const existingWidget = document.getElementById('global-smart-talk-widget-v2');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        // Create floating widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'global-smart-talk-widget-v2';
        widgetContainer.innerHTML = createWidgetHTML();
        
        // Add to body
        document.body.appendChild(widgetContainer);
    }
    
    function createWidgetHTML() {
        return `
            <div class="smart-talk-floating-widget-v2" id="smart-talk-floating-v2">
                <div class="floating-header-v2">
                    <div class="floating-title-v2">
                        <span class="bot-icon-v2">🤖</span>
                        <span class="title-text-v2">Smart Talk</span>
                        <span class="status-indicator-v2" id="status-indicator">●</span>
                    </div>
                    <div class="floating-actions-v2">
                        <button id="groups-btn" class="floating-btn-v2" title="Groups">👥</button>
                        <button id="minimize-btn-v2" class="floating-btn-v2" title="Minimize">−</button>
                        <button id="close-btn-v2" class="floating-btn-v2" title="Close">×</button>
                    </div>
                </div>
                
                <div class="floating-content-v2" id="floating-content-v2">
                    <div class="conversation-tabs-v2" id="conversation-tabs">
                        <button class="tab-btn-v2 active" data-conversation="general">General</button>
                        <button class="tab-btn-v2" data-conversation="groups">Groups</button>
                    </div>
                    
                    <div class="floating-messages-v2" id="floating-messages-v2">
                        <div class="welcome-msg-v2">
                            <h4>🚀 Smart Talk v2</h4>
                            <p>AI-powered chat with real backend integration!</p>
                            <div class="quick-buttons-v2">
                                <button class="quick-action-v2" onclick="askGlobalBotV2('Hello!')">👋 Hello</button>
                                <button class="quick-action-v2" onclick="askGlobalBotV2('Help me')">❓ Help</button>
                                <button class="quick-action-v2" onclick="askGlobalBotV2('Create group')">👥 Group</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="floating-typing-v2" id="floating-typing-v2" style="display: none;">
                        <div class="typing-indicator-v2">
                            <span class="typing-avatar-v2">🤖</span>
                            <div class="typing-dots-v2">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="floating-input-area-v2">
                        <input type="text" id="floating-input-v2" placeholder="Ask me anything..." />
                        <button id="floating-send-v2" class="floating-send-btn-v2">Send</button>
                    </div>
                </div>
            </div>
            
            <!-- Floating Toggle Button -->
            <div class="smart-talk-toggle-v2" id="smart-talk-toggle-v2">
                <button class="toggle-btn-v2" title="Open Smart Talk">
                    <span class="toggle-icon-v2">💬</span>
                </button>
            </div>
        `;
    }
    
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = getGlobalStylesV2();
        document.head.appendChild(style);
    }
    
    function getGlobalStylesV2() {
        return `
            /* Global Smart Talk Widget v2 Styles */
            #global-smart-talk-widget-v2 {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .smart-talk-floating-widget-v2 {
                width: 380px;
                height: 550px;
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

            .smart-talk-floating-widget-v2.show {
                transform: translateY(0);
                opacity: 1;
            }

            .floating-header-v2 {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .floating-title-v2 {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .bot-icon-v2 {
                font-size: 18px;
            }

            .title-text-v2 {
                font-weight: 600;
                font-size: 14px;
            }

            .status-indicator-v2 {
                font-size: 8px;
                color: #4ade80;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .floating-actions-v2 {
                display: flex;
                gap: 4px;
            }

            .floating-btn-v2 {
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

            .floating-btn-v2:hover {
                background: rgba(255,255,255,0.3);
            }

            .conversation-tabs-v2 {
                display: flex;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .tab-btn-v2 {
                flex: 1;
                padding: 8px 12px;
                border: none;
                background: transparent;
                cursor: pointer;
                font-size: 12px;
                color: #666;
                transition: all 0.2s;
            }

            .tab-btn-v2.active {
                background: white;
                color: #667eea;
                border-bottom: 2px solid #667eea;
            }

            .tab-btn-v2:hover {
                background: #e9ecef;
            }

            .floating-content-v2 {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .floating-messages-v2 {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }

            .welcome-msg-v2 {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .welcome-msg-v2 h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }

            .welcome-msg-v2 p {
                margin: 0 0 16px 0;
                color: #666;
                font-size: 13px;
            }

            .quick-buttons-v2 {
                display: flex;
                gap: 6px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .quick-action-v2 {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .quick-action-v2:hover {
                background: #5a6fd8;
            }

            .floating-message-v2 {
                margin: 8px 0;
                padding: 10px;
                border-radius: 8px;
                max-width: 85%;
                word-wrap: break-word;
                font-size: 13px;
            }

            .floating-message-v2.user {
                background: #667eea;
                color: white;
                margin-left: auto;
                text-align: right;
            }

            .floating-message-v2.bot {
                background: #e9ecef;
                color: #333;
                margin-right: auto;
            }

            .message-header-v2 {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 4px;
            }

            .message-time-v2 {
                font-size: 10px;
                opacity: 0.6;
                margin-top: 4px;
            }

            .floating-typing-v2 {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }

            .typing-indicator-v2 {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .typing-avatar-v2 {
                font-size: 14px;
            }

            .typing-dots-v2 {
                display: flex;
                gap: 2px;
            }

            .typing-dots-v2 span {
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }

            .typing-dots-v2 span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots-v2 span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }

            .floating-input-area-v2 {
                display: flex;
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #e9ecef;
                gap: 8px;
            }

            #floating-input-v2 {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 13px;
                outline: none;
            }

            #floating-input-v2:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }

            .floating-send-btn-v2 {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .floating-send-btn-v2:hover {
                background: #5a6fd8;
            }

            .floating-send-btn-v2:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .smart-talk-toggle-v2 {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            }

            .toggle-btn-v2 {
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

            .toggle-btn-v2:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .smart-talk-floating-widget-v2.hidden + .smart-talk-toggle-v2 .toggle-btn-v2 {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            }

            /* Hide toggle when widget is open */
            .smart-talk-floating-widget-v2.show ~ .smart-talk-toggle-v2 {
                display: none;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .smart-talk-floating-widget-v2 {
                    width: 320px;
                    height: 450px;
                }
                
                .smart-talk-toggle-v2 {
                    bottom: 15px;
                    right: 15px;
                }
                
                .toggle-btn-v2 {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }
        `;
    }
    
    function initializeGlobalWidget() {
        const floatingWidget = document.getElementById('smart-talk-floating-v2');
        const toggleBtn = document.querySelector('.toggle-btn-v2');
        const closeBtn = document.getElementById('close-btn-v2');
        const minimizeBtn = document.getElementById('minimize-btn-v2');
        const groupsBtn = document.getElementById('groups-btn');
        const floatingInput = document.getElementById('floating-input-v2');
        const floatingSend = document.getElementById('floating-send-v2');
        const floatingMessages = document.getElementById('floating-messages-v2');
        const floatingTyping = document.getElementById('floating-typing-v2');
        const statusIndicator = document.getElementById('status-indicator');

        let isOpen = false;
        let botEnabled = true;
        let api = null;
        let currentConversation = 'general';

        // Initialize API
        if (window.SmartTalkAPI) {
            api = new window.SmartTalkAPI();
            statusIndicator.style.color = '#4ade80';
        } else {
            statusIndicator.style.color = '#f59e0b';
            console.warn('API client not available, using fallback mode');
        }

        // Toggle widget visibility
        toggleBtn.addEventListener('click', () => {
            if (isOpen) {
                hideWidget();
            } else {
                showWidget();
            }
        });

        closeBtn.addEventListener('click', hideWidget);
        minimizeBtn.addEventListener('click', hideWidget);
        groupsBtn.addEventListener('click', () => {
            // Switch to groups tab
            switchTab('groups');
        });

        // Send message
        floatingSend.addEventListener('click', sendFloatingMessage);
        floatingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendFloatingMessage();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-btn-v2').forEach(btn => {
            btn.addEventListener('click', () => {
                const conversation = btn.dataset.conversation;
                switchTab(conversation);
            });
        });

        // Global functions
        window.askGlobalBotV2 = askGlobalBotV2;

        function showWidget() {
            floatingWidget.classList.add('show');
            isOpen = true;
            floatingInput.focus();
            loadMessages();
        }

        function hideWidget() {
            floatingWidget.classList.remove('show');
            isOpen = false;
        }

        function switchTab(conversation) {
            // Update active tab
            document.querySelectorAll('.tab-btn-v2').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-conversation="${conversation}"]`).classList.add('active');
            
            currentConversation = conversation;
            if (api) {
                api.setConversation(conversation);
            }
            
            loadMessages();
        }

        async function loadMessages() {
            if (!api) {
                console.log('API not available, using fallback');
                return;
            }

            try {
                const response = await api.getMessages(currentConversation);
                if (response.messages && response.messages.length > 0) {
                    displayMessages(response.messages);
                }
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        }

        function displayMessages(messages) {
            floatingMessages.innerHTML = '';
            messages.forEach(msg => {
                addFloatingMessage(msg.message, msg.isBot ? 'bot' : 'user', msg.user, msg.timestamp);
            });
        }

        async function sendFloatingMessage() {
            const message = floatingInput.value.trim();
            if (!message) return;

            // Add user message immediately
            addFloatingMessage(message, 'user', 'You', Date.now());
            floatingInput.value = '';
            floatingSend.disabled = true;

            if (api) {
                try {
                    // Send to API
                    const response = await api.sendMessage(message, currentConversation);
                    
                    if (response.success) {
                        // Show bot response
                        if (response.botResponse) {
                            showFloatingTyping();
                            setTimeout(() => {
                                hideFloatingTyping();
                                addFloatingMessage(
                                    response.botResponse.message, 
                                    'bot', 
                                    response.botResponse.user, 
                                    response.botResponse.timestamp
                                );
                            }, 1500);
                        }
                    } else {
                        addFloatingMessage('Sorry, I encountered an error. Please try again.', 'bot', 'System', Date.now());
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                    addFloatingMessage('Sorry, I encountered an error. Please try again.', 'bot', 'System', Date.now());
                }
            } else {
                // Fallback mode
                showFloatingTyping();
                setTimeout(() => {
                    hideFloatingTyping();
                    const response = getBotResponse(message);
                    addFloatingMessage(response, 'bot', 'NextBot', Date.now());
                }, 1500);
            }

            floatingSend.disabled = false;
        }

        function addFloatingMessage(text, type, sender, timestamp) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `floating-message-v2 ${type}`;
            
            const time = new Date(timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageDiv.innerHTML = `
                <div class="message-header-v2">${sender}</div>
                <div>${text}</div>
                <div class="message-time-v2">${time}</div>
            `;
            floatingMessages.appendChild(messageDiv);
            floatingMessages.scrollTop = floatingMessages.scrollHeight;
        }

        function askGlobalBotV2(question) {
            if (isOpen) {
                addFloatingMessage(question, 'user', 'You', Date.now());
                if (api) {
                    sendFloatingMessage();
                } else {
                    showFloatingTyping();
                    setTimeout(() => {
                        hideFloatingTyping();
                        const response = getBotResponse(question);
                        addFloatingMessage(response, 'bot', 'NextBot', Date.now());
                    }, 1500);
                }
            } else {
                showWidget();
                setTimeout(() => {
                    addFloatingMessage(question, 'user', 'You', Date.now());
                    if (api) {
                        sendFloatingMessage();
                    } else {
                        showFloatingTyping();
                        setTimeout(() => {
                            hideFloatingTyping();
                            const response = getBotResponse(question);
                            addFloatingMessage(response, 'bot', 'NextBot', Date.now());
                        }, 1500);
                    }
                }, 300);
            }
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

        function showFloatingTyping() {
            floatingTyping.style.display = 'block';
        }

        function hideFloatingTyping() {
            floatingTyping.style.display = 'none';
        }

        console.log('Global Smart Talk Widget v2 initialized successfully!');
    }
})();
