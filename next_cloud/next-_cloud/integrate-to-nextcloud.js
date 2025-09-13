/**
 * Integration Script for Nextcloud
 * Add this to your Nextcloud to get the floating widget on ALL pages
 */

// Inject the floating widget into your Nextcloud instance
(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.nextcloudFloatingWidgetActive) {
        return;
    }
    window.nextcloudFloatingWidgetActive = true;

    console.log('🚀 Initializing Nextcloud Floating Widget...');

    // Create the floating widget
    function createFloatingWidget() {
        // Create floating button
        const button = document.createElement('div');
        button.id = 'nextcloud-ios-widget';
        button.innerHTML = `
            <div class="widget-button-content">
                <div class="widget-chat-icon">💬</div>
                <div class="widget-badge" style="display: none;">0</div>
            </div>
        `;
        
        // Style the button with iOS design
        Object.assign(button.style, {
            position: 'fixed',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
            boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: '9999',
            userSelect: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            right: '20px',
            bottom: '20px',
            color: 'white',
            fontSize: '24px'
        });

        // Create widget panel
        const panel = document.createElement('div');
        panel.id = 'nextcloud-widget-panel';
        panel.innerHTML = `
            <div class="widget-header">
                <div class="widget-header-content">
                    <div class="widget-title-section">
                        <h3 class="widget-title">NextBot Assistant</h3>
                        <div class="widget-status">
                            <span class="widget-status-dot"></span>
                            <span class="widget-status-text">Online</span>
                        </div>
                    </div>
                    <button class="widget-close-btn">
                        <span class="widget-close-icon">×</span>
                    </button>
                </div>
            </div>
            
            <div class="widget-actions">
                <button class="widget-action-btn" onclick="window.open('/apps/spreed/', '_blank')">
                    <span class="widget-action-icon">💬</span>
                    <span class="widget-action-text">Open Talk</span>
                </button>
                <button class="widget-action-btn" onclick="window.open('/apps/spreed/', '_blank')">
                    <span class="widget-action-icon">👥</span>
                    <span class="widget-action-text">New Group</span>
                </button>
                <button class="widget-action-btn" onclick="window.open('/apps/spreed/', '_blank')">
                    <span class="widget-action-icon">👤</span>
                    <span class="widget-action-text">Add User</span>
                </button>
            </div>
            
            <div class="widget-chat-area">
                <div class="widget-messages" id="nextcloud-widget-messages">
                    <div class="widget-message">
                        <div class="widget-message-avatar bot">🤖</div>
                        <div class="widget-message-content">
                            <div class="widget-message-text">Hello! I'm NextBot, your AI assistant. I can help you with Nextcloud Talk features!</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="widget-input-area">
                <div class="widget-input-container">
                    <input type="text" class="widget-message-input" placeholder="Ask NextBot anything..." id="nextcloud-widget-input">
                    <button class="widget-send-btn" id="nextcloud-widget-send">📤</button>
                </div>
                <div class="widget-suggestions">
                    <span class="widget-suggestion" onclick="sendNextBotSuggestion('Create a group')">Create a group</span>
                    <span class="widget-suggestion" onclick="sendNextBotSuggestion('Add users')">Add users</span>
                    <span class="widget-suggestion" onclick="sendNextBotSuggestion('How to call?')">How to call?</span>
                    <span class="widget-suggestion" onclick="sendNextBotSuggestion('Show features')">Show features</span>
                </div>
            </div>
        `;

        // Style the panel with iOS glassmorphism
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '380px',
            height: '500px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(40px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            transform: 'scale(0.1) translateY(100px)',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
            zIndex: '9998',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        });

        // Add iOS-style CSS
        addIOSWidgetStyles();

        // Add event listeners
        let isExpanded = false;
        
        button.addEventListener('click', function() {
            isExpanded = !isExpanded;
            if (isExpanded) {
                panel.style.transform = 'scale(1) translateY(0)';
                panel.style.opacity = '1';
                // Auto-minimize after 30 seconds
                setTimeout(() => {
                    if (isExpanded) {
                        isExpanded = false;
                        panel.style.transform = 'scale(0.1) translateY(100px)';
                        panel.style.opacity = '0';
                    }
                }, 30000);
            } else {
                panel.style.transform = 'scale(0.1) translateY(100px)';
                panel.style.opacity = '0';
            }
        });

        panel.querySelector('.widget-close-btn').addEventListener('click', function() {
            isExpanded = false;
            panel.style.transform = 'scale(0.1) translateY(100px)';
            panel.style.opacity = '0';
        });

        // Send message functionality
        function sendMessage() {
            const input = document.getElementById('nextcloud-widget-input');
            const message = input.value.trim();
            if (!message) return;
            
            addMessage(message, false);
            input.value = '';
            
            setTimeout(() => {
                const responses = [
                    "Great question! Let me help you with that.",
                    "I can assist you with group creation and user management in Nextcloud Talk.",
                    "Here's how you can do that in Nextcloud Talk...",
                    "That's a common question! Here's the solution:",
                    "I'm here to help! Let me provide you with the information.",
                    "To create a group: Go to Talk app, click the '+' button, enter a group name, select members, and create!",
                    "To add users: Use the Talk app to add people to your conversations.",
                    "For video calls: Click the phone icon in any Talk conversation to start a call."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, true);
            }, 1500);
        }

        panel.querySelector('#nextcloud-widget-send').addEventListener('click', sendMessage);
        panel.querySelector('#nextcloud-widget-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function addMessage(text, isBot) {
            const messagesContainer = document.getElementById('nextcloud-widget-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'widget-message';
            
            messageDiv.innerHTML = `
                <div class="widget-message-avatar ${isBot ? 'bot' : 'user'}">${isBot ? '🤖' : 'A'}</div>
                <div class="widget-message-content">
                    <div class="widget-message-text">${text}</div>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Global function for suggestions
        window.sendNextBotSuggestion = function(suggestion) {
            addMessage(suggestion, false);
            setTimeout(() => {
                addMessage("Perfect! I can help you with that. Let me guide you through the process.", true);
            }, 1500);
        };

        // Add to DOM
        document.body.appendChild(button);
        document.body.appendChild(panel);

        // Simulate new messages
        setInterval(() => {
            if (!isExpanded && Math.random() > 0.7) {
                const badge = button.querySelector('.widget-badge');
                const currentCount = parseInt(badge.textContent) || 0;
                badge.textContent = currentCount + 1;
                badge.style.display = 'flex';
            }
        }, 15000);

        console.log('✅ Nextcloud Floating Widget created successfully!');
    }

    function addIOSWidgetStyles() {
        if (document.getElementById('nextcloud-ios-widget-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'nextcloud-ios-widget-styles';
        styles.textContent = `
            #nextcloud-ios-widget:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
            }

            #nextcloud-widget-panel.visible {
                transform: scale(1) translateY(0) !important;
                opacity: 1 !important;
            }

            .widget-header {
                padding: 20px;
                background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
                color: white;
            }

            .widget-header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .widget-title {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .widget-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                opacity: 0.9;
                margin-top: 4px;
            }

            .widget-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #34C759;
            }

            .widget-close-btn {
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

            .widget-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .widget-close-icon {
                font-size: 18px;
                font-weight: 300;
            }

            .widget-actions {
                display: flex;
                padding: 16px 20px;
                gap: 12px;
                background: rgba(255, 255, 255, 0.8);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .widget-action-btn {
                flex: 1;
                background: white;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                padding: 12px 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                min-height: 44px;
            }

            .widget-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .widget-action-icon {
                font-size: 20px;
            }

            .widget-action-text {
                font-size: 11px;
                font-weight: 500;
                color: #333;
            }

            .widget-chat-area {
                flex: 1;
                overflow-y: auto;
                padding: 16px 20px;
                background: rgba(248, 248, 248, 0.8);
                max-height: 250px;
            }

            .widget-messages {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .widget-message {
                display: flex;
                gap: 12px;
            }

            .widget-message-avatar {
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

            .widget-message-avatar.bot {
                background: #34C759;
            }

            .widget-message-content {
                flex: 1;
                background: white;
                border-radius: 16px;
                padding: 12px 16px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                max-width: 280px;
            }

            .widget-message-text {
                font-size: 14px;
                line-height: 1.4;
                color: #333;
                word-wrap: break-word;
            }

            .widget-input-area {
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.9);
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }

            .widget-input-container {
                display: flex;
                gap: 12px;
                margin-bottom: 12px;
            }

            .widget-message-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 20px;
                font-size: 14px;
                outline: none;
                background: white;
                transition: all 0.2s ease;
            }

            .widget-message-input:focus {
                border-color: #007AFF;
                box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            }

            .widget-send-btn {
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

            .widget-send-btn:hover:not(:disabled) {
                background: #0056CC;
                transform: scale(1.05);
            }

            .widget-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .widget-suggestions {
                display: flex;
                gap: 8px;
                overflow-x: auto;
                padding-bottom: 4px;
            }

            .widget-suggestion {
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

            .widget-suggestion:hover {
                background: rgba(0, 122, 255, 0.2);
                transform: translateY(-1px);
            }

            .widget-badge {
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

            /* Responsive */
            @media (max-width: 480px) {
                #nextcloud-widget-panel {
                    width: calc(100vw - 40px) !important;
                    height: calc(100vh - 120px) !important;
                    bottom: 80px !important;
                    left: 20px !important;
                    right: 20px !important;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWidget);
    } else {
        createFloatingWidget();
    }

})();

