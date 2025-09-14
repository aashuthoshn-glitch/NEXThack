/**
 * Global Smart Talk Widget
 * Floating AI Chat Widget for All Nextcloud Pages
 */

(function() {
    'use strict';

    // Prevent multiple initializations
    if (window.smartTalkInitialized) {
        return;
    }
    window.smartTalkInitialized = true;

    console.log('Initializing Global Smart Talk Widget...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalSmartTalk);
    } else {
        initGlobalSmartTalk();
    }

    function initGlobalSmartTalk() {
        // Create the floating widget container
        createFloatingWidget();
        
        // Add global styles
        addGlobalStyles();
        
        // Initialize functionality
        initializeGlobalWidget();
    }

    function createFloatingWidget() {
        // Remove existing widget if any
        const existingWidget = document.getElementById('global-smart-talk-widget');
        if (existingWidget) {
            existingWidget.remove();
        }

        // Create floating widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'global-smart-talk-widget';
        widgetContainer.innerHTML = createWidgetHTML();
        
        // Add to body
        document.body.appendChild(widgetContainer);
    }

    function createWidgetHTML() {
        return `
            <div class="smart-talk-floating-widget" id="smart-talk-floating">
                <div class="floating-header">
                    <div class="floating-title">
                        <span class="bot-icon">🤖</span>
                        <span class="title-text">Smart Talk</span>
                    </div>
                    <div class="floating-actions">
                        <button id="minimize-btn" class="floating-btn" title="Minimize">−</button>
                        <button id="close-btn" class="floating-btn" title="Close">×</button>
                    </div>
                </div>
                
                <div class="floating-content" id="floating-content">
                    <div class="floating-messages" id="floating-messages">
                        <div class="welcome-msg">
                            <h4>🚀 Smart Talk</h4>
                            <p>Your AI assistant is ready!</p>
                            <div class="quick-buttons">
                                <button class="quick-action" onclick="askGlobalBot('Hello!')">👋 Hello</button>
                                <button class="quick-action" onclick="askGlobalBot('Help me')">❓ Help</button>
                                <button class="quick-action" onclick="askGlobalBot('Create group')">👥 Group</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="floating-typing" id="floating-typing" style="display: none;">
                        <div class="typing-indicator">
                            <span class="typing-avatar">🤖</span>
                            <div class="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="floating-input-area">
                        <input type="text" id="floating-input" placeholder="Ask me anything..." />
                        <button id="floating-send" class="floating-send-btn">Send</button>
                    </div>
                </div>
            </div>
            
            <!-- Floating Toggle Button -->
            <div class="smart-talk-toggle" id="smart-talk-toggle">
                <button class="toggle-btn" title="Open Smart Talk">
                    <span class="toggle-icon">💬</span>
                </button>
            </div>
        `;
    }

    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = getGlobalStyles();
        document.head.appendChild(style);
    }

    function getGlobalStyles() {
        return `
            /* Global Smart Talk Widget Styles */
            #global-smart-talk-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .smart-talk-floating-widget {
                width: 350px;
                height: 500px;
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

            .smart-talk-floating-widget.show {
                transform: translateY(0);
                opacity: 1;
            }

            .floating-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .floating-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .bot-icon {
                font-size: 18px;
            }

            .title-text {
                font-weight: 600;
                font-size: 14px;
            }

            .floating-actions {
                display: flex;
                gap: 4px;
            }

            .floating-btn {
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

            .floating-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .floating-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .floating-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }

            .welcome-msg {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .welcome-msg h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }

            .welcome-msg p {
                margin: 0 0 16px 0;
                color: #666;
                font-size: 13px;
            }

            .quick-buttons {
                display: flex;
                gap: 6px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .quick-action {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .quick-action:hover {
                background: #5a6fd8;
            }

            .floating-message {
                margin: 8px 0;
                padding: 10px;
                border-radius: 8px;
                max-width: 85%;
                word-wrap: break-word;
                font-size: 13px;
            }

            .floating-message.user {
                background: #667eea;
                color: white;
                margin-left: auto;
                text-align: right;
            }

            .floating-message.bot {
                background: #e9ecef;
                color: #333;
                margin-right: auto;
            }

            .floating-typing {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .typing-avatar {
                font-size: 14px;
            }

            .typing-dots {
                display: flex;
                gap: 2px;
            }

            .typing-dots span {
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }

            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }

            .floating-input-area {
                display: flex;
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #e9ecef;
                gap: 8px;
            }

            #floating-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 13px;
                outline: none;
            }

            #floating-input:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }

            .floating-send-btn {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .floating-send-btn:hover {
                background: #5a6fd8;
            }

            .smart-talk-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            }

            .toggle-btn {
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

            .toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .smart-talk-floating-widget.hidden + .smart-talk-toggle .toggle-btn {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            }

            /* Hide toggle when widget is open */
            .smart-talk-floating-widget.show ~ .smart-talk-toggle {
                display: none;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .smart-talk-floating-widget {
                    width: 300px;
                    height: 400px;
                }
                
                .smart-talk-toggle {
                    bottom: 15px;
                    right: 15px;
                }
                
                .toggle-btn {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }
        `;
    }

    function initializeGlobalWidget() {
        const floatingWidget = document.getElementById('smart-talk-floating');
        const toggleBtn = document.querySelector('.toggle-btn');
        const closeBtn = document.getElementById('close-btn');
        const minimizeBtn = document.getElementById('minimize-btn');
        const floatingInput = document.getElementById('floating-input');
        const floatingSend = document.getElementById('floating-send');
        const floatingMessages = document.getElementById('floating-messages');
        const floatingTyping = document.getElementById('floating-typing');

        let isOpen = false;
        let botEnabled = true;

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

        // Send message
        floatingSend.addEventListener('click', sendFloatingMessage);
        floatingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendFloatingMessage();
            }
        });

        // Global functions
        window.askGlobalBot = askGlobalBot;

        function showWidget() {
            floatingWidget.classList.add('show');
            isOpen = true;
            floatingInput.focus();
        }

        function hideWidget() {
            floatingWidget.classList.remove('show');
            isOpen = false;
        }

        function sendFloatingMessage() {
            const message = floatingInput.value.trim();
            if (!message) return;

            addFloatingMessage(message, 'user', 'You');
            floatingInput.value = '';

            if (botEnabled) {
                showFloatingTyping();
                setTimeout(() => {
                    hideFloatingTyping();
                    const response = getBotResponse(message);
                    addFloatingMessage(response, 'bot', 'NextBot');
                }, 1500);
            }
        }

        function addFloatingMessage(text, type, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `floating-message ${type}`;
            messageDiv.innerHTML = `
                <div style="font-size: 11px; opacity: 0.7; margin-bottom: 4px;">${sender}</div>
                <div>${text}</div>
            `;
            floatingMessages.appendChild(messageDiv);
            floatingMessages.scrollTop = floatingMessages.scrollHeight;
        }

        function askGlobalBot(question) {
            if (isOpen) {
                addFloatingMessage(question, 'user', 'You');
                showFloatingTyping();
                setTimeout(() => {
                    hideFloatingTyping();
                    const response = getBotResponse(question);
                    addFloatingMessage(response, 'bot', 'NextBot');
                }, 1500);
            } else {
                showWidget();
                setTimeout(() => {
                    addFloatingMessage(question, 'user', 'You');
                    showFloatingTyping();
                    setTimeout(() => {
                        hideFloatingTyping();
                        const response = getBotResponse(question);
                        addFloatingMessage(response, 'bot', 'NextBot');
                    }, 1500);
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

        console.log('Global Smart Talk Widget initialized successfully!');
    }
})();


