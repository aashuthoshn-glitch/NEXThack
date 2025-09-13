/**
 * Direct Injection Script for Main Nextcloud Dashboard
 * This script injects the iOS widget directly into the main Nextcloud interface
 * Run this in the browser console on http://localhost:8080
 */

(function() {
    'use strict';
    
    console.log('🚀 Injecting iOS Widget into Main Nextcloud Dashboard...');

    // Create and inject the widget HTML
    const widgetHTML = `
        <div id="nextcloud-ios-widget" style="position: fixed !important; bottom: 20px !important; right: 20px !important; z-index: 99999 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
            <div id="floating-btn" style="width: 60px !important; height: 60px !important; border-radius: 50% !important; background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%) !important; box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3) !important; cursor: pointer !important; transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; display: flex !important; align-items: center !important; justify-content: center !important; backdrop-filter: blur(20px) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important;">
                <span style="font-size: 24px !important; color: white !important;">💬</span>
            </div>
            
            <div id="widget-panel" style="position: absolute !important; bottom: 80px !important; right: 20px !important; width: 400px !important; height: 600px !important; background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(40px) !important; border-radius: 20px !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important; transform: scale(0.1) translateY(100px) !important; opacity: 0 !important; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important; overflow: hidden !important; display: none !important;">
                <div style="padding: 20px !important; background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%) !important; color: white !important;">
                    <div style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                        <div>
                            <h3 style="margin: 0 !important; font-size: 18px !important; font-weight: 600 !important;">NextBot Assistant</h3>
                            <div style="display: flex !important; align-items: center !important; gap: 6px !important; font-size: 12px !important; opacity: 0.9 !important; margin-top: 4px !important;">
                                <span style="width: 8px !important; height: 8px !important; border-radius: 50% !important; background: #34C759 !important;"></span>
                                <span>Connected to Nextcloud</span>
                            </div>
                        </div>
                        <button id="close-btn" style="background: rgba(255, 255, 255, 0.2) !important; border: none !important; border-radius: 50% !important; width: 32px !important; height: 32px !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; color: white !important;">×</button>
                    </div>
                </div>

                <div style="display: flex !important; background: rgba(255, 255, 255, 0.8) !important; border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;">
                    <button class="tab-btn active" data-tab="chat" style="flex: 1 !important; padding: 12px 8px !important; border: none !important; background: rgba(0, 122, 255, 0.1) !important; cursor: pointer !important; font-size: 12px !important; font-weight: 500 !important; color: #007AFF !important; border-bottom: 2px solid #007AFF !important;">💬 Chat</button>
                    <button class="tab-btn" data-tab="conversations" style="flex: 1 !important; padding: 12px 8px !important; border: none !important; background: transparent !important; cursor: pointer !important; font-size: 12px !important; font-weight: 500 !important; color: #666 !important; border-bottom: 2px solid transparent !important;">👥 Conversations</button>
                    <button class="tab-btn" data-tab="actions" style="flex: 1 !important; padding: 12px 8px !important; border: none !important; background: transparent !important; cursor: pointer !important; font-size: 12px !important; font-weight: 500 !important; color: #666 !important; border-bottom: 2px solid transparent !important;">⚡ Actions</button>
                </div>

                <div id="widget-content" style="flex: 1 !important; overflow: hidden !important; display: flex !important; flex-direction: column !important;">
                    <div id="tab-chat" class="tab-content active" style="display: flex !important; flex: 1 !important; overflow: hidden !important; flex-direction: column !important;">
                        <div style="flex: 1 !important; overflow-y: auto !important; padding: 16px 20px !important; background: rgba(248, 248, 248, 0.8) !important;">
                            <div id="messages-container" style="display: flex !important; flex-direction: column !important; gap: 12px !important;">
                                <div style="display: flex !important; gap: 12px !important;">
                                    <div style="width: 32px !important; height: 32px !important; border-radius: 50% !important; background: #34C759 !important; color: white !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 14px !important; font-weight: 600 !important; flex-shrink: 0 !important;">🤖</div>
                                    <div style="flex: 1 !important; background: white !important; border-radius: 16px !important; padding: 12px 16px !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important; max-width: 280px !important;">
                                        <div style="font-size: 14px !important; line-height: 1.4 !important; color: #333 !important;">Hello! I'm NextBot, integrated into your main Nextcloud dashboard. I can help you with Talk, Files, Calendar, and more!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px 20px !important; background: rgba(255, 255, 255, 0.9) !important; border-top: 1px solid rgba(0, 0, 0, 0.1) !important;">
                            <div style="display: flex !important; gap: 12px !important; margin-bottom: 12px !important;">
                                <input type="text" id="message-input" placeholder="Ask me about Nextcloud features..." style="flex: 1 !important; padding: 12px 16px !important; border: 1px solid rgba(0, 0, 0, 0.2) !important; border-radius: 20px !important; font-size: 14px !important; outline: none !important; background: white !important;">
                                <button id="send-btn" style="width: 44px !important; height: 44px !important; border-radius: 50% !important; background: #007AFF !important; border: none !important; color: white !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 16px !important;">📤</button>
                            </div>
                            <div style="display: flex !important; gap: 8px !important; overflow-x: auto !important; padding-bottom: 4px !important;">
                                <span class="suggestion-chip" data-suggestion="Show my conversations" style="background: rgba(0, 122, 255, 0.1) !important; border: 1px solid rgba(0, 122, 255, 0.2) !important; border-radius: 16px !important; padding: 6px 12px !important; font-size: 12px !important; color: #007AFF !important; cursor: pointer !important; white-space: nowrap !important; flex-shrink: 0 !important;">Show my conversations</span>
                                <span class="suggestion-chip" data-suggestion="Open files" style="background: rgba(0, 122, 255, 0.1) !important; border: 1px solid rgba(0, 122, 255, 0.2) !important; border-radius: 16px !important; padding: 6px 12px !important; font-size: 12px !important; color: #007AFF !important; cursor: pointer !important; white-space: nowrap !important; flex-shrink: 0 !important;">Open files</span>
                            </div>
                        </div>
                    </div>

                    <div id="tab-conversations" class="tab-content" style="display: none !important; flex: 1 !important; overflow: hidden !important; flex-direction: column !important;">
                        <div style="padding: 16px 20px !important; background: rgba(255, 255, 255, 0.8) !important; border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important; display: flex !important; gap: 12px !important;">
                            <button id="create-group-btn" style="padding: 8px 16px !important; border: none !important; border-radius: 12px !important; background: #007AFF !important; color: white !important; cursor: pointer !important; display: flex !important; align-items: center !important; gap: 6px !important; font-size: 12px !important; font-weight: 500 !important;">
                                <span>👥</span>
                                <span>New Group</span>
                            </button>
                        </div>
                        <div id="conversations-list" style="flex: 1 !important; overflow-y: auto !important; padding: 16px 20px !important;">
                            <div style="padding: 12px !important; border-radius: 12px !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; margin-bottom: 8px !important;">
                                <div style="font-weight: 600 !important; color: #333 !important; margin-bottom: 4px !important;">General Discussion</div>
                                <div style="font-size: 12px !important; color: #666 !important;">4 members 👥</div>
                            </div>
                            <div style="padding: 12px !important; border-radius: 12px !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; margin-bottom: 8px !important;">
                                <div style="font-weight: 600 !important; color: #333 !important; margin-bottom: 4px !important;">Project Updates</div>
                                <div style="font-size: 12px !important; color: #666 !important;">2 members 👥</div>
                            </div>
                        </div>
                    </div>

                    <div id="tab-actions" class="tab-content" style="display: none !important; flex: 1 !important; overflow: hidden !important; flex-direction: column !important;">
                        <div style="padding: 20px !important; display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important;">
                            <button onclick="window.location.href='/apps/spreed/'" style="padding: 16px !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; border-radius: 12px !important; background: white !important; cursor: pointer !important; text-align: center !important;">
                                <div style="font-size: 24px !important; margin-bottom: 8px !important;">💬</div>
                                <div style="font-weight: 600 !important; color: #333 !important; margin-bottom: 4px !important; font-size: 14px !important;">Talk</div>
                                <div style="font-size: 11px !important; color: #666 !important;">Access Talk</div>
                            </button>
                            <button onclick="window.location.href='/apps/files/'" style="padding: 16px !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; border-radius: 12px !important; background: white !important; cursor: pointer !important; text-align: center !important;">
                                <div style="font-size: 24px !important; margin-bottom: 8px !important;">📁</div>
                                <div style="font-weight: 600 !important; color: #333 !important; margin-bottom: 4px !important; font-size: 14px !important;">Files</div>
                                <div style="font-size: 11px !important; color: #666 !important;">Access Files</div>
                            </button>
                            <button onclick="window.location.href='/apps/calendar/'" style="padding: 16px !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; border-radius: 12px !important; background: white !important; cursor: pointer !important; text-align: center !important;">
                                <div style="font-size: 24px !important; margin-bottom: 8px !important;">📅</div>
                                <div style="font-weight: 600 !important; color: #333 !important; margin-bottom: 4px !important; font-size: 14px !important;">Calendar</div>
                                <div style="font-size: 11px !important; color: #666 !important;">Schedule Events</div>
                            </button>
                            <button onclick="window.location.href='/apps/mail/'" style="padding: 16px !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; border-radius: 12px !important; background: white !important; cursor: pointer !important; text-align: center !important;">
                                <div style="font-size: 24px !important; margin-bottom: 8px !important;">📧</div>
                                <div style="font-weight: 600 !important; color: #333 !important; margin-bottom: 4px !important; font-size: 14px !important;">Mail</div>
                                <div style="font-size: 11px !important; color: #666 !important;">Check Email</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject the widget HTML
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Widget functionality
    let isExpanded = false;
    let unreadCount = 0;

    // Toggle widget
    function toggleWidget() {
        isExpanded = !isExpanded;
        const panel = document.getElementById('widget-panel');
        const btn = document.getElementById('floating-btn');
        
        if (isExpanded) {
            panel.style.display = 'block';
            panel.style.transform = 'scale(1) translateY(0)';
            panel.style.opacity = '1';
            unreadCount = 0;
            updateBadge();
        } else {
            panel.style.transform = 'scale(0.1) translateY(100px)';
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }
    }

    function minimizeWidget() {
        isExpanded = false;
        const panel = document.getElementById('widget-panel');
        panel.style.transform = 'scale(0.1) translateY(100px)';
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }

    function updateBadge() {
        // Badge functionality can be added here
    }

    function switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = '#666';
            btn.style.borderBottomColor = 'transparent';
        });
        
        // Show selected tab
        document.getElementById(`tab-${tabName}`).style.display = 'flex';
        
        // Activate selected button
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        activeBtn.classList.add('active');
        activeBtn.style.background = tabName === 'chat' ? 'rgba(0, 122, 255, 0.1)' : 'transparent';
        activeBtn.style.color = '#007AFF';
        activeBtn.style.borderBottomColor = '#007AFF';
    }

    function sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (!message) return;

        addMessage(message, false);
        input.value = '';

        // Process with AI
        setTimeout(() => {
            let response = '';
            if (message.toLowerCase().includes('conversation')) {
                response = "Here are your conversations! Click the Conversations tab to see more details.";
                switchTab('conversations');
            } else if (message.toLowerCase().includes('file')) {
                response = "I'll open the Files app for you!";
                window.location.href = '/apps/files/';
            } else if (message.toLowerCase().includes('talk')) {
                response = "I'll open the Talk app for you!";
                window.location.href = '/apps/spreed/';
            } else {
                response = "I'm your Nextcloud assistant! I can help you navigate to Talk, Files, Calendar, and more. What would you like to do?";
            }
            addMessage(response, true);
        }, 1500);
    }

    function addMessage(text, isBot) {
        const container = document.getElementById('messages-container');
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'display: flex !important; gap: 12px !important; margin-bottom: 12px !important;';
        
        messageDiv.innerHTML = `
            <div style="width: 32px !important; height: 32px !important; border-radius: 50% !important; background: ${isBot ? '#34C759' : '#007AFF'} !important; color: white !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 14px !important; font-weight: 600 !important; flex-shrink: 0 !important;">${isBot ? '🤖' : 'A'}</div>
            <div style="flex: 1 !important; background: white !important; border-radius: 16px !important; padding: 12px 16px !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important; max-width: 280px !important;">
                <div style="font-size: 14px !important; line-height: 1.4 !important; color: #333 !important; white-space: pre-line !important;">${text}</div>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    // Event listeners
    document.getElementById('floating-btn').addEventListener('click', toggleWidget);
    document.getElementById('close-btn').addEventListener('click', minimizeWidget);
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.getElementById('message-input').value = chip.dataset.suggestion;
            sendMessage();
        });
    });

    // Create group button
    document.getElementById('create-group-btn').addEventListener('click', () => {
        window.location.href = '/apps/spreed/#/room/new';
    });

    console.log('✅ iOS Widget successfully injected into main Nextcloud dashboard!');
    console.log('💬 Look for the floating button in the bottom-right corner!');

})();

