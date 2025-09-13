/**
 * Nextcloud Talk Service
 * Handles integration with Nextcloud Talk API
 */

class NextcloudTalkService {
    constructor() {
        this.baseUrl = window.location.origin + '/index.php/apps/spreed/api/v1';
        this.websocketUrl = null;
        this.websocket = null;
        this.currentConversation = null;
        this.messageHandlers = [];
        this.connectionStatus = 'disconnected';
    }

    /**
     * Initialize the service and establish connection
     */
    async initialize() {
        try {
            // Get user info and available conversations
            const userInfo = await this.getUserInfo();
            const conversations = await this.getConversations();
            
            console.log('Nextcloud Talk Service initialized:', { userInfo, conversations });
            return { userInfo, conversations };
        } catch (error) {
            console.error('Failed to initialize Nextcloud Talk Service:', error);
            throw error;
        }
    }

    /**
     * Get current user information
     */
    async getUserInfo() {
        try {
            const response = await fetch('/index.php/apps/dashboardtalk/api/talk/conversations', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { user: 'current_user', conversations: data.conversations || [] };
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    }

    /**
     * Get all available conversations
     */
    async getConversations() {
        try {
            const response = await fetch('/index.php/apps/dashboardtalk/api/talk/conversations', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.conversations || [];
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return [];
        }
    }

    /**
     * Get messages for a specific conversation
     */
    async getMessages(conversationToken, limit = 50) {
        try {
            const response = await fetch(`/index.php/apps/dashboardtalk/api/talk/messages?conversationToken=${conversationToken}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.messages || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }

    /**
     * Send a message to a conversation
     */
    async sendMessage(conversationToken, message, replyTo = null) {
        try {
            const payload = {
                conversationToken: conversationToken,
                message: message,
                replyTo: replyTo
            };

            const response = await fetch('/index.php/apps/dashboardtalk/api/talk/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    /**
     * Join a conversation
     */
    async joinConversation(conversationToken) {
        try {
            const response = await fetch(`/index.php/apps/spreed/api/v1/room/${conversationToken}/participants/active`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.currentConversation = conversationToken;
            return true;
        } catch (error) {
            console.error('Error joining conversation:', error);
            throw error;
        }
    }

    /**
     * Establish WebSocket connection for real-time updates
     */
    async establishWebSocketConnection(conversationToken) {
        try {
            // Get WebSocket URL from Nextcloud
            const wsUrl = await this.getWebSocketUrl();
            
            if (this.websocket) {
                this.websocket.close();
            }

            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket connected');
                this.connectionStatus = 'connected';
                this.joinConversation(conversationToken);
            };

            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.websocket.onclose = () => {
                console.log('WebSocket disconnected');
                this.connectionStatus = 'disconnected';
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (conversationToken) {
                        this.establishWebSocketConnection(conversationToken);
                    }
                }, 5000);
            };

            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.connectionStatus = 'error';
            };

        } catch (error) {
            console.error('Error establishing WebSocket connection:', error);
            throw error;
        }
    }

    /**
     * Get WebSocket URL from Nextcloud
     */
    async getWebSocketUrl() {
        try {
            const response = await fetch('/index.php/apps/spreed/api/v1/signaling/settings', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.ocs.data.websocket;
        } catch (error) {
            console.error('Error getting WebSocket URL:', error);
            // Fallback to polling if WebSocket is not available
            return null;
        }
    }

    /**
     * Handle incoming WebSocket messages
     */
    handleWebSocketMessage(data) {
        if (data.type === 'message' && data.payload) {
            const message = data.payload;
            this.notifyMessageHandlers(message);
        }
    }

    /**
     * Add message handler
     */
    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    /**
     * Remove message handler
     */
    removeMessageHandler(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
        }
    }

    /**
     * Notify all message handlers
     */
    notifyMessageHandlers(message) {
        this.messageHandlers.forEach(handler => {
            try {
                handler(message);
            } catch (error) {
                console.error('Error in message handler:', error);
            }
        });
    }

    /**
     * Start polling for messages (fallback when WebSocket is not available)
     */
    startPolling(conversationToken, interval = 2000) {
        this.stopPolling();
        
        this.pollingInterval = setInterval(async () => {
            try {
                const messages = await this.getMessages(conversationToken, 10);
                if (messages.length > 0) {
                    messages.forEach(message => {
                        this.notifyMessageHandlers(message);
                    });
                }
            } catch (error) {
                console.error('Error polling messages:', error);
            }
        }, interval);
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    /**
     * Disconnect and cleanup
     */
    disconnect() {
        this.stopPolling();
        
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        
        this.currentConversation = null;
        this.connectionStatus = 'disconnected';
    }
}

// Export for global use
window.NextcloudTalkService = NextcloudTalkService;
