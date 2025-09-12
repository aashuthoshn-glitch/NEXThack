import axios from '@nextcloud/axios'
import { AuthService } from './auth.js'

/**
 * Nextcloud Talk API service
 */
export class TalkApiService {
  /**
   * Get the base URL for Talk API requests
   * @returns {string} The base URL
   */
  static getBaseUrl() {
    // Replace with your actual Nextcloud instance URL
    return window.location.origin + '/ocs/v2.php/apps/spreed/api/v4'
  }

  /**
   * Get all conversations for the current user
   * @returns {Promise<Array>} Array of conversations
   */
  static async getConversations() {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/room`)
      return response.data.ocs.data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  /**
   * Get messages from a specific conversation
   * @param {string} token - The conversation token
   * @param {number} limit - Maximum number of messages to fetch
   * @returns {Promise<Array>} Array of messages
   */
  static async getMessages(token, limit = 20) {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/chat/${token}`, {
        params: {
          limit,
          lookIntoFuture: 0
        }
      })
      return response.data.ocs.data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  /**
   * Get conversation details
   * @param {string} token - The conversation token
   * @returns {Promise<Object|null>} Conversation details or null if error
   */
  static async getConversationDetails(token) {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/room/${token}`)
      return response.data.ocs.data || null
    } catch (error) {
      console.error('Error fetching conversation details:', error)
      return null
    }
  }

  /**
   * Send a message to a conversation
   * @param {string} token - The conversation token
   * @param {string} message - The message to send
   * @returns {Promise<Object|null>} The sent message or null if error
   */
  static async sendMessage(token, message) {
    try {
      const response = await axios.post(`${this.getBaseUrl()}/chat/${token}`, {
        message,
        replyTo: null
      })
      return response.data.ocs.data || null
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  /**
   * Get recent messages from all conversations
   * @param {number} limit - Maximum number of messages per conversation
   * @returns {Promise<Array>} Array of recent messages with conversation info
   */
  static async getRecentMessages(limit = 5) {
    try {
      const conversations = await this.getConversations()
      const recentMessages = []

      for (const conversation of conversations.slice(0, 5)) { // Limit to 5 conversations
        const messages = await this.getMessages(conversation.token, limit)
        const conversationDetails = await this.getConversationDetails(conversation.token)
        
        messages.forEach(message => {
          recentMessages.push({
            ...message,
            conversation: {
              token: conversation.token,
              displayName: conversationDetails?.displayName || conversation.name,
              type: conversation.type
            }
          })
        })
      }

      // Sort by timestamp (newest first)
      return recentMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Error fetching recent messages:', error)
      return []
    }
  }
}
