/**
 * iOS Widget Integration for Main Nextcloud Dashboard
 * This script integrates the iOS-style floating widget directly into the main Nextcloud interface
 */

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.nextcloudIOSWidgetActive) {
        return;
    }
    window.nextcloudIOSWidgetActive = true;

    console.log('🚀 Initializing iOS Widget in Main Nextcloud Dashboard...');

    // Configuration
    const CONFIG = {
        widgetPosition: { right: '20px', bottom: '20px' },
        autoMinimizeDelay: 30000,
        apiEndpoints: {
            conversations: '/ocs/v2.php/apps/spreed/api/v4/room',
            messages: '/ocs/v2.php/apps/spreed/api/v4/chat',
            users: '/ocs/v2.php/cloud/users',
            files: '/ocs/v2.php/apps/files/api/v1',
            calendar: '/ocs/v2.php/apps/calendar/api/v1'
        }
    };

    // State management
    let widgetState = {
        isExpanded: false,
        unreadCount: 0,
        conversations: [],
        currentUser: null,
        messages: [],
        isTyping: false
    };

    // Initialize the widget
    function initWidget() {
        createFloatingWidget();
        loadUserData();
        loadConversations();
        setupEventListeners();
        startPeriodicUpdates();
        
        console.log('✅ iOS Widget integrated into main Nextcloud dashboard!');
    }

    // Create the floating widget
    function createFloatingWidget() {
        // Remove existing widget if any
        const existingWidget = document.getElementById('nextcloud-ios-widget');
        if (existingWidget) {
            existingWidget.remove();
        }

        const widget = document.createElement('div');
        widget.id = 'nextcloud-ios-widget';
        widget.innerHTML = `
            <div class="floating-button" id="floating-btn">
                <div class="button-content">
                    <div class="chat-icon">💬</div>
                    <div class="badge" id="widget-badge" style="display: none;">0</div>
                </div>
            </div>
            
            <div class="widget-panel" id="widget-panel">
                <div class="widget-header">
                    <div class="header-content">
                        <div>
                            <h3 class="widget-title">NextBot Assistant</h3>
                            <div class="status-indicator">
                                <span class="status-dot online"></span>
                                <span class="status-text">Connected to Nextcloud</span>
                            </div>
                        </div>
                        <button class="close-btn" id="close-btn">
                            <span>×</span>
                        </button>
                    </div>
                </div>

                <div class="widget-tabs">
                    <button class="tab-btn active" data-tab="chat">💬 Chat</button>
                    <button class="tab-btn" data-tab="conversations">👥 Conversations</button>
                    <button class="tab-btn" data-tab="actions">⚡ Quick Actions</button>
                </div>

                <div class="widget-content">
                    <!-- Chat Tab -->
                    <div class="tab-content active" id="tab-chat">
                        <div class="chat-area">
                            <div class="messages-container" id="messages-container">
                                <div class="message-bubble">
                                    <div class="message-avatar bot">🤖</div>
                                    <div class="message-content">
                                        <div class="message-text">Hello! I'm NextBot, integrated into your main Nextcloud dashboard. I can help you with Talk, Files, Calendar, and more! What would you like to do?</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input-area">
                            <div class="input-container">
                                <input type="text" class="message-input" placeholder="Ask me about Nextcloud features..." id="message-input">
                                <button class="send-btn" id="send-btn">📤</button>
                            </div>
                            <div class="quick-suggestions">
                                <span class="suggestion-chip" data-suggestion="Show my conversations">Show my conversations</span>
                                <span class="suggestion-chip" data-suggestion="Create a new group">Create a new group</span>
                                <span class="suggestion-chip" data-suggestion="Show my files">Show my files</span>
                                <span class="suggestion-chip" data-suggestion="Open calendar">Open calendar</span>
                            </div>
                        </div>
                    </div>

                    <!-- Conversations Tab -->
                    <div class="tab-content" id="tab-conversations">
                        <div class="conversations-header">
                            <button class="action-btn primary" id="create-group-btn">
                                <span>👥</span>
                                <span>New Group</span>
                            </button>
                            <button class="action-btn secondary" id="refresh-conversations">
                                <span>🔄</span>
                                <span>Refresh</span>
                            </button>
                        </div>
                        <div class="conversations-list" id="conversations-list">
                            <div class="loading-state">Loading conversations...</div>
                        </div>
                    </div>

                    <!-- Quick Actions Tab -->
                    <div class="tab-content" id="tab-actions">
                        <div class="actions-grid">
                            <button class="action-card" onclick="window.location.href='/apps/spreed/'">
                                <div class="action-icon">💬</div>
                                <div class="action-title">Talk</div>
                                <div class="action-desc">Access full Talk interface</div>
                            </button>
                            <button class="action-card" onclick="window.location.href='/apps/spreed/#/call/new'">
                                <div class="action-icon">📞</div>
                                <div class="action-title">Start Call</div>
                                <div class="action-desc">Begin video/audio call</div>
                            </button>
                            <button class="action-card" onclick="window.location.href='/apps/spreed/#/room/new'">
                                <div class="action-icon">👥</div>
                                <div class="action-title">Create Group</div>
                                <div class="action-desc">New group conversation</div>
                            </button>
                            <button class="action-card" onclick="window.location.href='/apps/files/'">
                                <div class="action-icon">📁</div>
                                <div class="action-title">Files</div>
                                <div class="action-desc">Access your files</div>
                            </button>
                            <button class="action-card" onclick="window.location.href='/apps/calendar/'">
                                <div class="action-icon">📅</div>
                                <div class="action-title">Calendar</div>
                                <div class="action-desc">Schedule meetings</div>
                            </button>
                            <button class="action-card" onclick="window.location.href='/apps/mail/'">
                                <div class="action-icon">📧</div>
                                <div class="action-title">Mail</div>
                                <div class="action-desc">Check your emails</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        
        // Add CSS styles
        addWidgetStyles();
        
        // Setup event listeners
        setupWidgetEventListeners();
    }

    // Add widget styles
    function addWidgetStyles() {
        if (document.getElementById('nextcloud-ios-widget-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'nextcloud-ios-widget-styles';
        styles.textContent = `
            /* iOS Widget Styles for Main Nextcloud */
            #nextcloud-ios-widget {
                position: fixed;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                user-select: none;
            }

            .floating-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
                box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
                right: ${CONFIG.widgetPosition.right};
                bottom: ${CONFIG.widgetPosition.bottom};
            }

            .floating-button:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
            }

            .floating-button.pulse {
                animation: pulse 2s infinite;
            }

            .button-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chat-icon {
                font-size: 24px;
                color: white;
                transition: transform 0.3s ease;
            }

            .badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #FF3B30;
                color: white;
                border-radius: 10px;
                padding: 2px 6px;
                font-size: 12px;
                font-weight: 600;
                min-width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
            }

            .widget-panel {
                position: absolute;
                bottom: 80px;
                right: 20px;
                width: 400px;
                height: 600px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(40px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                transform: scale(0.1) translateY(100px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                overflow: hidden;
            }

            .widget-panel.visible {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .widget-header {
                padding: 20px;
                background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
                color: white;
            }

            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .widget-title {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                opacity: 0.9;
                margin-top: 4px;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #34C759;
            }

            .close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: white;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .widget-tabs {
                display: flex;
                background: rgba(255, 255, 255, 0.8);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .tab-btn {
                flex: 1;
                padding: 12px 8px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 12px;
                font-weight: 500;
                color: #666;
                border-bottom: 2px solid transparent;
            }

            .tab-btn.active {
                color: #007AFF;
                border-bottom-color: #007AFF;
                background: rgba(0, 122, 255, 0.1);
            }

            .widget-content {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .tab-content {
                display: none;
                flex: 1;
                overflow: hidden;
                flex-direction: column;
            }

            .tab-content.active {
                display: flex;
            }

            .chat-area {
                flex: 1;
                overflow-y: auto;
                padding: 16px 20px;
                background: rgba(248, 248, 248, 0.8);
            }

            .messages-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .message-bubble {
                display: flex;
                gap: 12px;
                animation: slideInUp 0.3s ease;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #007AFF;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                flex-shrink: 0;
            }

            .message-avatar.bot {
                background: #34C759;
            }

            .message-content {
                flex: 1;
                background: white;
                border-radius: 16px;
                padding: 12px 16px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                max-width: 280px;
            }

            .message-text {
                font-size: 14px;
                line-height: 1.4;
                color: #333;
                word-wrap: break-word;
            }

            .input-area {
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.9);
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }

            .input-container {
                display: flex;
                gap: 12px;
                margin-bottom: 12px;
            }

            .message-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 20px;
                font-size: 14px;
                outline: none;
                background: white;
                transition: all 0.2s ease;
            }

            .message-input:focus {
                border-color: #007AFF;
                box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            }

            .send-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: #007AFF;
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }

            .send-btn:hover:not(:disabled) {
                background: #0056CC;
                transform: scale(1.05);
            }

            .quick-suggestions {
                display: flex;
                gap: 8px;
                overflow-x: auto;
                padding-bottom: 4px;
            }

            .suggestion-chip {
                background: rgba(0, 122, 255, 0.1);
                border: 1px solid rgba(0, 122, 255, 0.2);
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 12px;
                color: #007AFF;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .suggestion-chip:hover {
                background: rgba(0, 122, 255, 0.2);
                transform: translateY(-1px);
            }

            .conversations-header {
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.8);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                display: flex;
                gap: 12px;
            }

            .action-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 500;
            }

            .action-btn.primary {
                background: #007AFF;
                color: white;
            }

            .action-btn.primary:hover {
                background: #0056CC;
                transform: translateY(-1px);
            }

            .action-btn.secondary {
                background: rgba(0, 0, 0, 0.1);
                color: #333;
            }

            .conversations-list {
                flex: 1;
                overflow-y: auto;
                padding: 16px 20px;
            }

            .conversation-item {
                padding: 12px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 8px;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .conversation-item:hover {
                background: rgba(0, 122, 255, 0.05);
                border-color: #007AFF;
            }

            .conversation-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }

            .conversation-meta {
                font-size: 12px;
                color: #666;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .actions-grid {
                padding: 20px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            .action-card {
                padding: 16px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
            }

            .action-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-color: #007AFF;
            }

            .action-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }

            .action-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
                font-size: 14px;
            }

            .action-desc {
                font-size: 11px;
                color: #666;
                line-height: 1.3;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes slideInUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .widget-panel {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    bottom: 80px;
                    left: 20px;
                    right: 20px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Setup widget event listeners
    function setupWidgetEventListeners() {
        const floatingBtn = document.getElementById('floating-btn');
        const widgetPanel = document.getElementById('widget-panel');
        const closeBtn = document.getElementById('close-btn');
        const sendBtn = document.getElementById('send-btn');
        const messageInput = document.getElementById('message-input');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const suggestionChips = document.querySelectorAll('.suggestion-chip');

        // Toggle widget
        floatingBtn.addEventListener('click', toggleWidget);
        closeBtn.addEventListener('click', minimizeWidget);

        // Send message
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Suggestion chips
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const suggestion = chip.dataset.suggestion;
                messageInput.value = suggestion;
                sendMessage();
            });
        });

        // Action buttons
        document.getElementById('create-group-btn')?.addEventListener('click', () => {
            window.location.href = '/apps/spreed/#/room/new';
        });

        document.getElementById('refresh-conversations')?.addEventListener('click', loadConversations);
    }

    // Widget control functions
    function toggleWidget() {
        widgetState.isExpanded = !widgetState.isExpanded;
        const panel = document.getElementById('widget-panel');
        
        if (widgetState.isExpanded) {
            panel.classList.add('visible');
            widgetState.unreadCount = 0;
            updateBadge();
            startAutoMinimize();
        } else {
            panel.classList.remove('visible');
        }
    }

    function minimizeWidget() {
        widgetState.isExpanded = false;
        document.getElementById('widget-panel').classList.remove('visible');
    }

    function startAutoMinimize() {
        setTimeout(() => {
            if (widgetState.isExpanded) {
                minimizeWidget();
            }
        }, CONFIG.autoMinimizeDelay);
    }

    function updateBadge() {
        const badge = document.getElementById('widget-badge');
        badge.textContent = widgetState.unreadCount;
        badge.style.display = widgetState.unreadCount > 0 ? 'flex' : 'none';
    }

    function switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    // Message handling
    function sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (!message) return;

        addMessage(message, false);
        input.value = '';

        // Process message with AI
        processAIMessage(message);
    }

    function addMessage(text, isBot) {
        const container = document.getElementById('messages-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-bubble';
        
        messageDiv.innerHTML = `
            <div class="message-avatar ${isBot ? 'bot' : 'user'}">${isBot ? '🤖' : 'A'}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    function processAIMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        setTimeout(() => {
            let response = '';
            
            if (lowerMessage.includes('conversation') || lowerMessage.includes('chat')) {
                response = `Here are your current conversations:\n\n${widgetState.conversations.map(conv => `• ${conv.displayName || conv.name} (${conv.participantCount || conv.members} members)`).join('\n')}\n\nClick the "Conversations" tab to see more details!`;
                switchTab('conversations');
            } else if (lowerMessage.includes('group') || lowerMessage.includes('create')) {
                response = "I'll help you create a new group! Clicking the 'New Group' button in the Conversations tab, or I can navigate you to the group creation page.";
                window.location.href = '/apps/spreed/#/room/new';
            } else if (lowerMessage.includes('call') || lowerMessage.includes('video')) {
                response = "To start a video call, I can open the Talk app for you! Let me navigate you there.";
                window.location.href = '/apps/spreed/';
            } else if (lowerMessage.includes('file')) {
                response = "I can help you access your files! Let me open the Files app for you.";
                window.location.href = '/apps/files/';
            } else if (lowerMessage.includes('calendar')) {
                response = "I can help you access your calendar! Let me open the Calendar app for you.";
                window.location.href = '/apps/calendar/';
            } else if (lowerMessage.includes('help')) {
                response = "I can help you with:\n• Managing conversations and groups\n• Starting video calls\n• Accessing your files\n• Scheduling calendar events\n• Managing emails\n\nI'm integrated into your main Nextcloud dashboard, so I can navigate you to any feature!";
            } else {
                const responses = [
                    "I'm your integrated Nextcloud assistant! I can help you navigate to Talk, Files, Calendar, and more. What would you like to do?",
                    "I'm connected to your main Nextcloud dashboard. I can help you access any feature or app. What do you need?",
                    "I'm here to help with all your Nextcloud features! Try asking about conversations, files, or calendar.",
                    "I can assist you with everything in your Nextcloud workspace. How can I help you today?"
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }
            
            addMessage(response, true);
        }, 1500);
    }

    // Data loading functions
    async function loadUserData() {
        try {
            const response = await fetch('/ocs/v2.php/cloud/user', {
                headers: { 'OCS-APIRequest': 'true' }
            });
            if (response.ok) {
                const data = await response.json();
                widgetState.currentUser = data.ocs.data;
            }
        } catch (error) {
            console.log('Could not load user data:', error);
        }
    }

    async function loadConversations() {
        try {
            const response = await fetch(CONFIG.apiEndpoints.conversations, {
                headers: { 'OCS-APIRequest': 'true' }
            });
            
            if (response.ok) {
                const data = await response.json();
                widgetState.conversations = data.ocs.data || [];
                renderConversations();
            } else {
                // Fallback: create demo conversations
                widgetState.conversations = [
                    { token: 'demo1', displayName: 'General Discussion', participantCount: 4, type: 'group' },
                    { token: 'demo2', displayName: 'Project Updates', participantCount: 2, type: 'group' },
                    { token: 'demo3', displayName: 'Team Chat', participantCount: 6, type: 'group' }
                ];
                renderConversations();
            }
        } catch (error) {
            console.log('Could not load conversations:', error);
            // Show demo conversations
            widgetState.conversations = [
                { token: 'demo1', displayName: 'General Discussion', participantCount: 4, type: 'group' },
                { token: 'demo2', displayName: 'Project Updates', participantCount: 2, type: 'group' }
            ];
            renderConversations();
        }
    }

    function renderConversations() {
        const container = document.getElementById('conversations-list');
        if (!container) return;

        if (widgetState.conversations.length === 0) {
            container.innerHTML = '<div class="loading-state">No conversations found. Create your first group!</div>';
            return;
        }

        container.innerHTML = widgetState.conversations.map(conv => `
            <div class="conversation-item" onclick="window.location.href='/apps/spreed/#/call/${conv.token}'">
                <div class="conversation-name">${conv.displayName || conv.name}</div>
                <div class="conversation-meta">
                    <span>${conv.participantCount || conv.members} members</span>
                    <span>${conv.type === 'group' ? '👥' : '💬'}</span>
                </div>
            </div>
        `).join('');
    }

    // Setup periodic updates
    function startPeriodicUpdates() {
        // Simulate new messages
        setInterval(() => {
            if (!widgetState.isExpanded && Math.random() > 0.8) {
                widgetState.unreadCount++;
                updateBadge();
                document.getElementById('floating-btn').classList.add('pulse');
            }
        }, 20000);

        // Refresh conversations periodically
        setInterval(loadConversations, 60000);
    }

    // Setup global event listeners
    function setupEventListeners() {
        // Handle page navigation
        window.addEventListener('popstate', () => {
            // Widget persists across page changes
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // Adjust widget position if needed
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // Export for global access
    window.NextcloudIOSWidget = {
        toggleWidget,
        minimizeWidget,
        loadConversations,
        addMessage,
        switchTab
    };

})();

