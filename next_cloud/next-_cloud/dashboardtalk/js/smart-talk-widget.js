/**
 * Smart Talk Dashboard Widget
 * AI-Powered Chat & Group Management for Nextcloud
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartTalk);
    } else {
        initSmartTalk();
    }

    function initSmartTalk() {
        // Check if widget container exists
        const widgetContainer = document.getElementById('smart-talk-widget');
        if (!widgetContainer) {
            console.log('Smart Talk widget container not found');
            return;
        }

        console.log('Initializing Smart Talk Dashboard Widget...');

        // Create the widget HTML
        widgetContainer.innerHTML = createWidgetHTML();
        
        // Add styles
        addStyles();

        // Initialize functionality
        initializeWidget();
    }

    function createWidgetHTML() {
        return `
            <div class="smart-talk-widget">
                <div class="widget-header">
                    <h3>🤖 Smart Talk</h3>
                    <div class="widget-actions">
                        <button id="refresh-btn" class="btn-icon" title="Refresh">🔄</button>
                        <button id="new-group-btn" class="btn-icon" title="New Group">➕</button>
                        <button id="bot-toggle-btn" class="btn-icon" title="Toggle AI Bot">🤖</button>
                    </div>
                </div>
                
                <div class="widget-content">
                    <div id="messages-container" class="messages-container">
                        <div class="welcome-message">
                            <h4>Welcome to Smart Talk! 🚀</h4>
                            <p>Your AI-powered communication hub</p>
                            <div class="quick-actions">
                                <button class="quick-btn" onclick="askBot('Hello, how can you help me?')">👋 Say Hello</button>
                                <button class="quick-btn" onclick="askBot('Create a new group')">👥 New Group</button>
                                <button class="quick-btn" onclick="askBot('Show me features')">✨ Features</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="bot-typing" class="bot-typing" style="display: none;">
                        <div class="typing-indicator">
                            <span class="bot-avatar">🤖</span>
                            <div class="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <input type="text" id="message-input" placeholder="Type a message or ask the AI..." />
                        <button id="send-btn" class="send-btn">Send</button>
                    </div>
                </div>
            </div>
        `;
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = getWidgetStyles();
        document.head.appendChild(style);
    }

    function getWidgetStyles() {
        return `
            .smart-talk-widget {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #fff;
                border-radius: 8px;
                overflow: hidden;
            }

            .widget-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .widget-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .widget-actions {
                display: flex;
                gap: 8px;
            }

            .btn-icon {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 4px;
                padding: 6px 8px;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }

            .btn-icon:hover {
                background: rgba(255,255,255,0.3);
            }

            .widget-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .messages-container {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }

            .welcome-message {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .welcome-message h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 18px;
            }

            .welcome-message p {
                margin: 0 0 16px 0;
                color: #666;
                font-size: 14px;
            }

            .quick-actions {
                display: flex;
                gap: 8px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .quick-btn {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .quick-btn:hover {
                background: #5a6fd8;
            }

            .message {
                margin: 8px 0;
                padding: 12px;
                border-radius: 8px;
                max-width: 80%;
                word-wrap: break-word;
            }

            .message.user {
                background: #667eea;
                color: white;
                margin-left: auto;
                text-align: right;
            }

            .message.bot {
                background: #e9ecef;
                color: #333;
                margin-right: auto;
            }

            .message-header {
                font-size: 12px;
                opacity: 0.7;
                margin-bottom: 4px;
            }

            .bot-typing {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .bot-avatar {
                font-size: 16px;
            }

            .typing-dots {
                display: flex;
                gap: 2px;
            }

            .typing-dots span {
                width: 6px;
                height: 6px;
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

            .chat-input-area {
                display: flex;
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #e9ecef;
                gap: 8px;
            }

            #message-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                outline: none;
            }

            #message-input:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }

            .send-btn {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .send-btn:hover {
                background: #5a6fd8;
            }

            .send-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        `;
    }

    function initializeWidget() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const newGroupBtn = document.getElementById('new-group-btn');
        const botToggleBtn = document.getElementById('bot-toggle-btn');
        const messagesContainer = document.getElementById('messages-container');
        const botTyping = document.getElementById('bot-typing');

        let botEnabled = true;

        // Event listeners
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        refreshBtn.addEventListener('click', refreshMessages);
        newGroupBtn.addEventListener('click', createNewGroup);
        botToggleBtn.addEventListener('click', toggleBot);

        // Global functions for quick actions
        window.askBot = askBot;

        function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user', 'You');
            messageInput.value = '';

            // Show bot typing if enabled
            if (botEnabled) {
                showBotTyping();
                setTimeout(() => {
                    hideBotTyping();
                    const botResponse = getBotResponse(message);
                    addMessage(botResponse, 'bot', 'NextBot');
                }, 1500);
            }
        }

        function addMessage(text, type, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = `
                <div class="message-header">${sender}</div>
                <div>${text}</div>
            `;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function askBot(question) {
            if (botEnabled) {
                addMessage(question, 'user', 'You');
                showBotTyping();
                setTimeout(() => {
                    hideBotTyping();
                    const response = getBotResponse(question);
                    addMessage(response, 'bot', 'NextBot');
                }, 1500);
            }
        }

        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                return "Hello! I'm NextBot, your AI assistant. I can help you with group management, answer questions, and provide information about Smart Talk features. How can I assist you today?";
            }
            
            if (lowerMessage.includes('group') || lowerMessage.includes('create')) {
                return "To create a new group, click the '+' button in the header. You can add multiple members and start group conversations with video/audio call support!";
            }
            
            if (lowerMessage.includes('feature') || lowerMessage.includes('help')) {
                return "Smart Talk features include: 🤖 AI Chat Assistant, 👥 Group Management, 📞 Video/Audio Calls, 🔄 Real-time Status, 😊 Message Reactions, and 📱 Mobile Support!";
            }
            
            if (lowerMessage.includes('call') || lowerMessage.includes('video')) {
                return "Video and audio calls are available in group chats! Click the call button next to any message to start a conversation with your team members.";
            }
            
            if (lowerMessage.includes('status') || lowerMessage.includes('online')) {
                return "Real-time online/offline status is shown for all participants. Green dots indicate online users, gray dots show offline users.";
            }
            
            return "I'm here to help! You can ask me about creating groups, making calls, using features, or anything else about Smart Talk. What would you like to know?";
        }

        function showBotTyping() {
            botTyping.style.display = 'block';
        }

        function hideBotTyping() {
            botTyping.style.display = 'none';
        }

        function refreshMessages() {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h4>Welcome to Smart Talk! 🚀</h4>
                    <p>Your AI-powered communication hub</p>
                    <div class="quick-actions">
                        <button class="quick-btn" onclick="askBot('Hello, how can you help me?')">👋 Say Hello</button>
                        <button class="quick-btn" onclick="askBot('Create a new group')">👥 New Group</button>
                        <button class="quick-btn" onclick="askBot('Show me features')">✨ Features</button>
                    </div>
                </div>
            `;
        }

        function createNewGroup() {
            const groupName = prompt('Enter group name:');
            if (groupName) {
                addMessage(`Creating group "${groupName}"...`, 'bot', 'NextBot');
                setTimeout(() => {
                    addMessage(`Group "${groupName}" created successfully! You can now add members and start chatting.`, 'bot', 'NextBot');
                }, 1000);
            }
        }

        function toggleBot() {
            botEnabled = !botEnabled;
            botToggleBtn.textContent = botEnabled ? '🤖' : '🤖';
            botToggleBtn.style.opacity = botEnabled ? '1' : '0.5';
            addMessage(botEnabled ? 'AI Bot enabled!' : 'AI Bot disabled', 'bot', 'System');
        }

        console.log('Smart Talk Dashboard Widget initialized successfully!');
    }
})();


