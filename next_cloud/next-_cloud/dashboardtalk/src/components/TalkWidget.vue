<template>
  <div class="talk-widget">
    <div class="talk-widget__header">
      <h3 class="talk-widget__title">
        <span class="icon icon-talk"></span>
        Nextcloud Talk
        <span class="online-indicator" v-if="onlineUsers.length > 0">
          {{ onlineUsers.length }} online
        </span>
      </h3>
      <div class="talk-widget__actions">
        <button 
          class="talk-widget__refresh" 
          @click="refreshMessages"
          :disabled="loading"
          title="Refresh messages"
        >
          <span class="icon icon-refresh" :class="{ 'icon-loading': loading }"></span>
        </button>
        <button 
          class="talk-widget__new-group" 
          @click="showCreateGroup = true"
          title="Create new group"
        >
          <span class="icon icon-add"></span>
        </button>
        <button 
          class="talk-widget__bot-toggle" 
          @click="toggleChatbot"
          :class="{ 'active': chatbotEnabled }"
          title="Toggle AI Chatbot"
        >
          🤖
        </button>
      </div>
    </div>

    <!-- Group Creation Modal -->
    <div v-if="showCreateGroup" class="modal-overlay" @click="showCreateGroup = false">
      <div class="modal-content" @click.stop>
        <h3>Create New Group</h3>
        <div class="form-group">
          <input 
            v-model="newGroupName" 
            type="text" 
            placeholder="Group name"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>Select Members:</label>
          <div class="user-list">
            <label v-for="user in availableUsers" :key="user.id" class="user-checkbox">
              <input 
                type="checkbox" 
                :value="user.id" 
                v-model="selectedMembers"
              />
              <span class="user-name">
                {{ user.displayName }}
                <span class="user-status" :class="{ 'online': user.online }">
                  {{ user.online ? '🟢' : '🔴' }}
                </span>
              </span>
            </label>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="createGroup" class="btn-primary" :disabled="!newGroupName || selectedMembers.length === 0">
            Create Group
          </button>
          <button @click="showCreateGroup = false" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="talk-widget__content">
      <div v-if="loading && messages.length === 0" class="talk-widget__loading">
        <span class="icon icon-loading"></span>
        Loading messages...
      </div>

      <div v-else-if="error" class="talk-widget__error">
        <span class="icon icon-error"></span>
        {{ error }}
        <button @click="refreshMessages" class="talk-widget__retry">Retry</button>
      </div>

      <div v-else-if="messages.length === 0" class="talk-widget__empty">
        <span class="icon icon-talk"></span>
        No messages found
        <button @click="showCreateGroup = true" class="btn-primary">Create your first group!</button>
        
        <!-- Chatbot Quick Questions -->
        <div v-if="chatbotEnabled" class="bot-quick-questions">
          <h4>Ask NextBot anything:</h4>
          <div class="quick-questions">
            <button @click="askBot('How do I create a group?')" class="quick-question-btn">
              How do I create a group?
            </button>
            <button @click="askBot('How do I start a video call?')" class="quick-question-btn">
              How do I start a video call?
            </button>
            <button @click="askBot('What features are available?')" class="quick-question-btn">
              What features are available?
            </button>
            <button @click="askBot('Who are the users?')" class="quick-question-btn">
              Who are the users?
            </button>
          </div>
        </div>
      </div>

      <div v-else class="talk-widget__messages">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="talk-widget__message"
          :class="{ 'is-bot': message.isBot }"
          @click="openConversation(message.conversation.token)"
        >
          <div class="talk-widget__message-header">
            <div class="conversation-info">
              <span class="talk-widget__conversation-name">
                {{ message.conversation.displayName }}
                <span v-if="message.conversation.type === 'group'" class="group-badge">Group</span>
              </span>
              <div class="participants-status">
                <span v-for="participant in getConversationParticipants(message.conversation.token)" 
                      :key="participant.id" 
                      class="participant-avatar"
                      :class="{ 'online': participant.online }"
                      :title="participant.displayName + (participant.online ? ' (online)' : ' (offline)')"
                >
                  {{ participant.displayName.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <span class="talk-widget__message-time">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
          <div class="talk-widget__message-content">
            <div class="message-sender">
              <span class="sender-avatar" :class="{ 'online': isUserOnline(message.actorId) }">
                {{ message.actorDisplayName.charAt(0).toUpperCase() }}
              </span>
              <strong>{{ message.actorDisplayName }}:</strong>
            </div>
            <div class="message-text">{{ message.message }}</div>
            <div v-if="message.reactions && message.reactions.length > 0" class="message-reactions">
              <span v-for="reaction in message.reactions" :key="reaction.emoji" class="reaction">
                {{ reaction.emoji }} {{ reaction.count }}
              </span>
            </div>
          </div>
          <div class="message-actions">
            <button @click.stop="addReaction(message.id, '👍')" class="action-btn" title="Like">
              👍
            </button>
            <button @click.stop="addReaction(message.id, '❤️')" class="action-btn" title="Love">
              ❤️
            </button>
            <button @click.stop="addReaction(message.id, '😂')" class="action-btn" title="Laugh">
              😂
            </button>
            <button @click.stop="startCall(message.conversation.token)" class="action-btn call-btn" title="Start Call">
              📞
            </button>
            <button v-if="message.isBot" @click.stop="askBot('Thanks!')" class="action-btn bot-btn" title="Reply to Bot">
              💬
            </button>
          </div>
        </div>
      </div>
      
      <!-- Bot Typing Indicator -->
      <div v-if="botTyping" class="bot-typing">
        <div class="typing-indicator">
          <span class="bot-avatar">🤖</span>
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="typing-text">NextBot is typing...</span>
        </div>
      </div>
    </div>

    <!-- Chatbot Input Area -->
    <div v-if="chatbotEnabled" class="chatbot-input-area">
      <div class="input-container">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Ask NextBot anything..."
          class="chatbot-input"
          :disabled="botTyping"
        />
        <button 
          @click="sendMessage"
          :disabled="!newMessage.trim() || botTyping"
          class="send-btn"
        >
          <span v-if="botTyping">⏳</span>
          <span v-else>📤</span>
        </button>
      </div>
      <div class="bot-status">
        <span class="bot-indicator">🤖 NextBot is online</span>
        <button @click="toggleChatbot" class="bot-toggle-btn">Disable</button>
      </div>
    </div>

    <div class="talk-widget__footer">
      <button 
        class="talk-widget__compose" 
        @click="showCreateGroup = true"
        title="Create new group"
      >
        <span class="icon icon-add"></span>
        New Group
      </button>
      <button 
        class="talk-widget__compose" 
        @click="openTalkApp"
        title="Open Talk app"
      >
        <span class="icon icon-talk"></span>
        Open Talk
      </button>
    </div>
  </div>
</template>

<script>
import { TalkApiService } from '../services/talkApi.js'
import { AuthService } from '../services/auth.js'
import { chatbotService } from '../services/chatbot.js'

export default {
  name: 'TalkWidget',
  props: {
    selectedRoomId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      messages: [],
      loading: false,
      error: null,
      refreshInterval: null,
      onlineUsers: [],
      showCreateGroup: false,
      newGroupName: '',
      selectedMembers: [],
      availableUsers: [
        { id: 'aashu', displayName: 'Aashu', online: true },
        { id: 'admin', displayName: 'Admin', online: true },
        { id: 'adithya', displayName: 'Adithya', online: false },
        { id: 'dhanush', displayName: 'Dhanush', online: true }
      ],
      conversations: [],
      callInProgress: false,
      notifications: [],
      chatbotEnabled: true,
      botTyping: false,
      newMessage: '',
      showBotSettings: false
    }
  },
  mounted() {
    this.loadMessages()
    this.loadOnlineUsers()
    this.loadConversations()
    
    // Refresh messages every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadMessages()
      this.loadOnlineUsers()
    }, 30000)
    
    // Simulate real-time updates
    this.startRealTimeUpdates()
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async loadMessages() {
      if (!AuthService.isAuthenticated()) {
        this.error = 'User not authenticated'
        return
      }

      this.loading = true
      this.error = null

      try {
        const recentMessages = await TalkApiService.getRecentMessages(5)
        this.messages = recentMessages.slice(0, 10) // Show max 10 messages
      } catch (error) {
        console.error('Error loading messages:', error)
        this.error = 'Failed to load messages'
      } finally {
        this.loading = false
      }
    },
    
    async loadOnlineUsers() {
      // Simulate online status checking
      this.availableUsers.forEach(user => {
        user.online = Math.random() > 0.3 // 70% chance of being online
      })
      this.onlineUsers = this.availableUsers.filter(user => user.online)
    },
    
    async loadConversations() {
      // Load conversations with participant info
      this.conversations = [
        {
          token: 'conv1',
          displayName: 'General Discussion',
          type: 'group',
          participants: ['aashu', 'admin', 'adithya', 'dhanush']
        },
        {
          token: 'conv2', 
          displayName: 'Project Updates',
          type: 'group',
          participants: ['aashu', 'admin']
        }
      ]
    },
    
    startRealTimeUpdates() {
      // Simulate real-time message updates
      setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance of new message
          this.addRandomMessage()
        }
      }, 10000)
    },
    
    addRandomMessage() {
      const users = this.availableUsers
      const conversations = this.conversations
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomConv = conversations[Math.floor(Math.random() * conversations.length)]
      
      const messages = [
        "Hey everyone! 👋",
        "How's the project going?",
        "Great work on the latest update! 🎉",
        "Can we schedule a meeting?",
        "I'll be online in a few minutes",
        "Thanks for the help! 🙏",
        "Let's discuss this in detail",
        "Perfect! That's exactly what we needed"
      ]
      
      const newMessage = {
        id: Date.now().toString(),
        message: messages[Math.floor(Math.random() * messages.length)],
        actorDisplayName: randomUser.displayName,
        actorId: randomUser.id,
        timestamp: Math.floor(Date.now() / 1000),
        conversation: randomConv,
        reactions: []
      }
      
      this.messages.unshift(newMessage)
      if (this.messages.length > 10) {
        this.messages = this.messages.slice(0, 10)
      }
      
      // Show notification
      this.showNotification(`${randomUser.displayName} sent a message`)
    },
    
    showNotification(message) {
      const notification = {
        id: Date.now(),
        message: message,
        timestamp: Date.now()
      }
      this.notifications.push(notification)
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id)
      }, 3000)
    },
    
    async createGroup() {
      if (!this.newGroupName || this.selectedMembers.length === 0) {
        return
      }
      
      try {
        const groupData = {
          name: this.newGroupName,
          members: this.selectedMembers,
          type: 'group'
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newConversation = {
          token: `group_${Date.now()}`,
          displayName: this.newGroupName,
          type: 'group',
          participants: this.selectedMembers
        }
        
        this.conversations.push(newConversation)
        this.showCreateGroup = false
        this.newGroupName = ''
        this.selectedMembers = []
        
        this.showNotification(`Group "${this.newGroupName}" created successfully!`)
      } catch (error) {
        console.error('Error creating group:', error)
        this.showNotification('Failed to create group')
      }
    },
    
    getConversationParticipants(token) {
      const conversation = this.conversations.find(c => c.token === token)
      if (!conversation) return []
      
      return conversation.participants.map(participantId => {
        const user = this.availableUsers.find(u => u.id === participantId)
        return user || { id: participantId, displayName: participantId, online: false }
      })
    },
    
    isUserOnline(userId) {
      const user = this.availableUsers.find(u => u.id === userId)
      return user ? user.online : false
    },
    
    addReaction(messageId, emoji) {
      const message = this.messages.find(m => m.id === messageId)
      if (!message) return
      
      if (!message.reactions) {
        message.reactions = []
      }
      
      const existingReaction = message.reactions.find(r => r.emoji === emoji)
      if (existingReaction) {
        existingReaction.count++
      } else {
        message.reactions.push({ emoji, count: 1 })
      }
      
      this.showNotification(`Added ${emoji} reaction`)
    },
    
    startCall(conversationToken) {
      if (this.callInProgress) {
        this.showNotification('Call already in progress')
        return
      }
      
      this.callInProgress = true
      this.showNotification('Starting call...')
      
      // Simulate call setup
      setTimeout(() => {
        window.open(`/apps/spreed/#/call/${conversationToken}`, '_blank')
        this.callInProgress = false
      }, 2000)
    },
    
    async refreshMessages() {
      await this.loadMessages()
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp * 1000)
      const now = new Date()
      const diff = now - date

      // Less than 1 minute
      if (diff < 60000) {
        return 'Just now'
      }
      // Less than 1 hour
      if (diff < 3600000) {
        return Math.floor(diff / 60000) + 'm ago'
      }
      // Less than 24 hours
      if (diff < 86400000) {
        return Math.floor(diff / 3600000) + 'h ago'
      }
      // More than 24 hours
      return date.toLocaleDateString()
    },
    
    openConversation(token) {
      // Open the conversation in a new tab
      window.open(`/apps/spreed/#/call/${token}`, '_blank')
    },
    
    openTalkApp() {
      // Open the Talk app
      window.open('/apps/spreed/', '_blank')
    },
    
    // Chatbot methods
    async sendMessage() {
      if (!this.newMessage.trim()) return
      
      const messageText = this.newMessage.trim()
      this.newMessage = ''
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        message: messageText,
        actorDisplayName: 'You',
        actorId: 'current-user',
        timestamp: Math.floor(Date.now() / 1000),
        conversation: { token: 'current', displayName: 'Chat', type: 'direct' },
        reactions: []
      }
      
      this.messages.unshift(userMessage)
      
      // Show bot typing indicator
      if (this.chatbotEnabled) {
        this.botTyping = true
        this.showNotification('NextBot is typing...')
        
        // Simulate bot thinking time
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Get bot response
        const botResponse = await chatbotService.processMessage(messageText)
        if (botResponse) {
          const botMessage = chatbotService.generateBotMessage(botResponse)
          this.messages.unshift(botMessage)
          this.showNotification('NextBot replied!')
        }
        
        this.botTyping = false
      }
    },
    
    toggleChatbot() {
      this.chatbotEnabled = chatbotService.toggle()
      this.showNotification(`NextBot ${this.chatbotEnabled ? 'enabled' : 'disabled'}`)
    },
    
    askBot(question) {
      this.newMessage = question
      this.sendMessage()
    },
    
    getBotStatus() {
      return chatbotService.getStatus()
    }
  }
}
</script>

<style>
.talk-widget {
  background: var(--color-background-plain);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.talk-widget__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: white;
  border-bottom: 1px solid var(--color-border);
}

.talk-widget__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.online-indicator {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.talk-widget__actions {
  display: flex;
  gap: 8px;
}

.talk-widget__refresh,
.talk-widget__new-group,
.talk-widget__bot-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: var(--border-radius);
  color: white;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.talk-widget__bot-toggle.active {
  background: rgba(76, 175, 80, 0.8);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.talk-widget__refresh:hover,
.talk-widget__new-group:hover,
.talk-widget__bot-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.talk-widget__refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-background-plain);
  border-radius: var(--border-radius);
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: var(--color-text);
  font-size: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 14px;
  background: var(--color-background-plain);
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.user-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 8px;
}

.user-checkbox {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
}

.user-checkbox:hover {
  background: var(--color-background-hover);
}

.user-name {
  margin-left: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text);
}

.user-status {
  font-size: 12px;
}

.user-status.online {
  color: #4CAF50;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--color-background-hover);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-border);
}

.talk-widget__content {
  max-height: 500px;
  overflow-y: auto;
}

.talk-widget__loading,
.talk-widget__error,
.talk-widget__empty {
  padding: 20px;
  text-align: center;
  color: var(--color-text-lighter);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.talk-widget__error {
  color: var(--color-error);
}

.talk-widget__retry {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.talk-widget__retry:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.talk-widget__messages {
  padding: 8px;
}

.talk-widget__message {
  padding: 16px;
  border-radius: var(--border-radius);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background: var(--color-background-plain);
  position: relative;
}

.talk-widget__message:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.talk-widget__message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.conversation-info {
  flex: 1;
}

.talk-widget__conversation-name {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-badge {
  background: var(--color-primary);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.participants-status {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.participant-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-background-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text);
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.participant-avatar.online {
  border-color: #4CAF50;
  background: #E8F5E8;
}

.talk-widget__message-time {
  font-size: 11px;
  color: var(--color-text-lighter);
  white-space: nowrap;
}

.talk-widget__message-content {
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-text);
  word-wrap: break-word;
}

.message-sender {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.sender-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid transparent;
}

.sender-avatar.online {
  border-color: #4CAF50;
}

.message-text {
  margin-bottom: 8px;
}

.message-reactions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.reaction {
  background: var(--color-background-hover);
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  border: 1px solid var(--color-border);
}

.message-actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.talk-widget__message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: var(--color-background-hover);
  border: 1px solid var(--color-border);
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  color: var(--color-text);
}

.action-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.call-btn {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.call-btn:hover {
  background: #45a049;
  transform: scale(1.1);
}

.talk-widget__footer {
  padding: 12px 16px;
  background: var(--color-background-hover);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 8px;
}

.talk-widget__compose {
  flex: 1;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.talk-widget__compose:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.talk-widget__compose:active {
  transform: translateY(0);
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--color-primary);
  color: white;
  padding: 12px 16px;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.icon-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 16px;
  }
  
  .talk-widget__footer {
    flex-direction: column;
  }
  
  .message-actions {
    opacity: 1;
  }
}

/* Chatbot Styles */
.bot-quick-questions {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--border-radius);
  color: white;
}

.bot-quick-questions h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.quick-questions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-question-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.quick-question-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.bot-typing {
  padding: 12px 16px;
  background: var(--color-background-hover);
  border-top: 1px solid var(--color-border);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-lighter);
  font-size: 14px;
}

.bot-avatar {
  font-size: 20px;
  animation: pulse 2s infinite;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chatbot-input-area {
  background: var(--color-background-hover);
  border-top: 1px solid var(--color-border);
  padding: 12px 16px;
}

.input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.chatbot-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-background-plain);
  color: var(--color-text);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.chatbot-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.chatbot-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn {
  background: var(--color-primary);
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  min-width: 44px;
}

.send-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.bot-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-lighter);
}

.bot-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bot-toggle-btn {
  background: none;
  border: 1px solid var(--color-border);
  padding: 4px 8px;
  border-radius: 12px;
  color: var(--color-text-lighter);
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;
}

.bot-toggle-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text);
}

.bot-btn {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.bot-btn:hover {
  background: #45a049;
  transform: scale(1.1);
}

/* Bot message styling */
.talk-widget__message.is-bot {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #4CAF50;
}

.talk-widget__message.is-bot .sender-avatar {
  background: #4CAF50;
  font-size: 12px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .talk-widget {
    background: #1a1a1a;
    color: #ffffff;
  }
  
  .modal-content {
    background: #1a1a1a;
    color: #ffffff;
  }
  
  .form-input {
    background: #2a2a2a;
    color: #ffffff;
    border-color: #444;
  }
  
  .bot-quick-questions {
    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  }
  
  .chatbot-input {
    background: #2a2a2a;
    color: #ffffff;
    border-color: #444;
  }
}
</style>
