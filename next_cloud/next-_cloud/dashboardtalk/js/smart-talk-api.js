/**
 * Smart Talk API Client
 * Handles communication with the backend API
 */

class SmartTalkAPI {
    constructor() {
        this.baseUrl = window.location.origin + '/index.php/apps/dashboardtalk/api';
        this.currentConversation = 'general';
    }

    async sendMessage(message, conversationId = null) {
        try {
            const response = await fetch(`${this.baseUrl}/smart-talk/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: conversationId || this.currentConversation
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            return {
                success: false,
                error: 'Failed to send message. Please try again.'
            };
        }
    }

    async getMessages(conversationId = null, limit = 50) {
        try {
            const url = new URL(`${this.baseUrl}/smart-talk/messages`);
            url.searchParams.append('conversationId', conversationId || this.currentConversation);
            url.searchParams.append('limit', limit);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return {
                messages: [],
                error: 'Failed to load messages. Please try again.'
            };
        }
    }

    async createGroup(name, members = []) {
        try {
            const response = await fetch(`${this.baseUrl}/smart-talk/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    name: name,
                    members: members
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating group:', error);
            return {
                success: false,
                error: 'Failed to create group. Please try again.'
            };
        }
    }

    async getGroups() {
        try {
            const response = await fetch(`${this.baseUrl}/smart-talk/groups`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching groups:', error);
            return {
                groups: [],
                error: 'Failed to load groups. Please try again.'
            };
        }
    }

    setConversation(conversationId) {
        this.currentConversation = conversationId;
    }
}

// Export for global use
window.SmartTalkAPI = SmartTalkAPI;


