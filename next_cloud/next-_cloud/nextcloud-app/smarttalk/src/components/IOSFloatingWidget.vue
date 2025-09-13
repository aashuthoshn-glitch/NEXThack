<template>
  <!-- iOS-Style Floating Chatbot Widget -->
  <div class="ios-floating-widget" :class="{ 'expanded': isExpanded, 'dragging': isDragging }">
    
    <!-- Floating Button (Collapsed State) -->
    <div 
      class="floating-button"
      :class="{ 'pulse': hasUnreadMessages }"
      @click="toggleWidget"
      @mousedown="startDrag"
      @touchstart="startDrag"
      ref="floatingButton"
    >
      <div class="button-content">
        <div class="chat-icon" :class="{ 'rotating': isTyping }">
          <span v-if="!isTyping">💬</span>
          <div v-else class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div v-if="unreadCount > 0" class="badge">{{ unreadCount }}</div>
      </div>
    </div>

    <!-- Expanded Widget Panel -->
    <div 
      class="widget-panel"
      :class="{ 'visible': isExpanded }"
      ref="widgetPanel"
    >
      <!-- Header -->
      <div class="widget-header">
        <div class="header-content">
          <div class="title-section">
            <h3 class="widget-title">NextBot Assistant</h3>
            <div class="status-indicator">
              <span class="status-dot online"></span>
              <span class="status-text">Online</span>
            </div>
          </div>
          <button class="close-btn" @click="minimizeWidget">
            <span class="close-icon">×</span>
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="action-btn" @click="showCreateGroup = true">
          <span class="action-icon">👥</span>
          <span class="action-text">New Group</span>
        </button>
        <button class="action-btn" @click="showAddUser = true">
          <span class="action-icon">👤</span>
          <span class="action-text">Add User</span>
        </button>
        <button class="action-btn" @click="showSettings = true">
          <span class="action-icon">⚙️</span>
          <span class="action-text">Settings</span>
        </button>
      </div>

      <!-- Chat Messages Area -->
      <div class="chat-area" ref="chatArea">
        <div class="messages-container">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-bubble"
            :class="{ 'bot-message': message.isBot, 'user-message': !message.isBot }"
          >
            <div class="message-avatar">
              <span v-if="message.isBot">🤖</span>
              <span v-else>{{ message.sender.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ message.sender }}</span>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-text">{{ message.text }}</div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-avatar">🤖</div>
            <div class="typing-content">
              <div class="typing-text">NextBot is typing</div>
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="input-container">
          <input 
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Ask NextBot anything..."
            class="message-input"
            :disabled="isTyping"
          />
          <button 
            @click="sendMessage"
            class="send-btn"
            :disabled="!newMessage.trim() || isTyping"
          >
            <span class="send-icon">📤</span>
          </button>
        </div>
        
        <!-- Quick Suggestions -->
        <div class="quick-suggestions">
          <button 
            v-for="suggestion in quickSuggestions"
            :key="suggestion"
            @click="sendSuggestion(suggestion)"
            class="suggestion-chip"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Group Creation Modal -->
    <div v-if="showCreateGroup" class="modal-overlay" @click="showCreateGroup = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Create New Group</h3>
          <button class="modal-close" @click="showCreateGroup = false">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Group Name</label>
            <input 
              v-model="newGroupName"
              type="text"
              placeholder="Enter group name..."
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Select Members</label>
            <div class="user-list">
              <div 
                v-for="user in availableUsers"
                :key="user.id"
                class="user-item"
                :class="{ 'selected': selectedMembers.includes(user.id) }"
                @click="toggleUserSelection(user.id)"
              >
                <div class="user-avatar" :class="{ 'online': user.online }">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-status">{{ user.online ? 'Online' : 'Offline' }}</span>
                </div>
                <div class="selection-indicator">
                  <span v-if="selectedMembers.includes(user.id)">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" @click="showCreateGroup = false">Cancel</button>
          <button 
            class="btn-primary" 
            @click="createGroup"
            :disabled="!newGroupName || selectedMembers.length === 0"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUser" class="modal-overlay" @click="showAddUser = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add User to Chat</h3>
          <button class="modal-close" @click="showAddUser = false">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Search Users</label>
            <input 
              v-model="userSearchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="form-input"
            />
          </div>
          
          <div class="search-results">
            <div 
              v-for="user in filteredUsers"
              :key="user.id"
              class="user-item"
              @click="addUserToChat(user)"
            >
              <div class="user-avatar" :class="{ 'online': user.online }">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
              <button class="add-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <div class="modal-content settings-modal" @click.stop>
        <div class="modal-header">
          <h3>Widget Settings</h3>
          <button class="modal-close" @click="showSettings = false">×</button>
        </div>
        
        <div class="modal-body">
          <div class="setting-item">
            <label>Auto-minimize after</label>
            <select v-model="autoMinimizeDelay" class="form-select">
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="0">Never</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label>Theme</label>
            <div class="theme-options">
              <button 
                class="theme-btn"
                :class="{ 'active': theme === 'light' }"
                @click="theme = 'light'"
              >
                ☀️ Light
              </button>
              <button 
                class="theme-btn"
                :class="{ 'active': theme === 'dark' }"
                @click="theme = 'dark'"
              >
                🌙 Dark
              </button>
              <button 
                class="theme-btn"
                :class="{ 'active': theme === 'auto' }"
                @click="theme = 'auto'"
              >
                🔄 Auto
              </button>
            </div>
          </div>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="hapticFeedback" />
              Haptic Feedback
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { chatbotService } from '../services/chatbot.js'

export default {
  name: 'IOSFloatingWidget',
  setup() {
    // Widget State
    const isExpanded = ref(false)
    const isDragging = ref(false)
    const isTyping = ref(false)
    const hasUnreadMessages = ref(false)
    const unreadCount = ref(0)
    
    // Position and Drag
    const position = ref({ x: 0, y: 0 })
    const dragStart = ref({ x: 0, y: 0 })
    const floatingButton = ref(null)
    const widgetPanel = ref(null)
    
    // Modals
    const showCreateGroup = ref(false)
    const showAddUser = ref(false)
    const showSettings = ref(false)
    
    // Form Data
    const newMessage = ref('')
    const newGroupName = ref('')
    const selectedMembers = ref([])
    const userSearchQuery = ref('')
    
    // Settings
    const autoMinimizeDelay = ref(30)
    const theme = ref('auto')
    const hapticFeedback = ref(true)
    
    // Messages
    const messages = ref([
      {
        id: 1,
        text: "Hello! I'm NextBot, your AI assistant. I can help you create groups, manage users, and answer questions about Nextcloud Talk!",
        sender: "NextBot",
        timestamp: Date.now() - 60000,
        isBot: true
      }
    ])
    
    // Users Data
    const availableUsers = ref([
      { id: 'aashu', name: 'Aashu', email: 'aashu@example.com', online: true },
      { id: 'admin', name: 'Admin', email: 'admin@example.com', online: true },
      { id: 'adithya', name: 'Adithya', email: 'adithya@example.com', online: false },
      { id: 'dhanush', name: 'Dhanush', email: 'dhanush@example.com', online: true },
      { id: 'sarah', name: 'Sarah', email: 'sarah@example.com', online: true },
      { id: 'john', name: 'John', email: 'john@example.com', online: false }
    ])
    
    // Quick Suggestions
    const quickSuggestions = ref([
      "Create a group",
      "Add users",
      "How to call?",
      "Show features"
    ])
    
    // Computed
    const filteredUsers = computed(() => {
      if (!userSearchQuery.value) return availableUsers.value
      return availableUsers.value.filter(user => 
        user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
      )
    })
    
    // Methods
    const toggleWidget = () => {
      if (hapticFeedback.value) {
        navigator.vibrate?.(50) // Haptic feedback simulation
      }
      
      isExpanded.value = !isExpanded.value
      
      if (isExpanded.value) {
        unreadCount.value = 0
        hasUnreadMessages.value = false
        startAutoMinimize()
      }
    }
    
    const minimizeWidget = () => {
      isExpanded.value = false
    }
    
    const startAutoMinimize = () => {
      if (autoMinimizeDelay.value > 0) {
        setTimeout(() => {
          if (isExpanded.value) {
            minimizeWidget()
          }
        }, autoMinimizeDelay.value * 1000)
      }
    }
    
    const startDrag = (e) => {
      if (isExpanded.value) return
      
      isDragging.value = true
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
      const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY
      
      dragStart.value = { x: clientX - position.value.x, y: clientY - position.value.y }
      
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('touchend', stopDrag)
    }
    
    const onDrag = (e) => {
      if (!isDragging.value) return
      
      const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
      const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
      
      position.value = {
        x: clientX - dragStart.value.x,
        y: clientY - dragStart.value.y
      }
      
      // Snap to edges
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      if (position.value.x < 20) position.value.x = 20
      if (position.value.x > windowWidth - 80) position.value.x = windowWidth - 80
      if (position.value.y < 20) position.value.y = 20
      if (position.value.y > windowHeight - 80) position.value.y = windowHeight - 80
    }
    
    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('touchend', stopDrag)
    }
    
    const sendMessage = async () => {
      if (!newMessage.value.trim() || isTyping.value) return
      
      const messageText = newMessage.value.trim()
      newMessage.value = ''
      
      // Add user message
      messages.value.push({
        id: Date.now(),
        text: messageText,
        sender: "You",
        timestamp: Date.now(),
        isBot: false
      })
      
      // Show typing indicator
      isTyping.value = true
      
      // Simulate bot thinking time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get bot response
      const botResponse = await chatbotService.processMessage(messageText)
      if (botResponse) {
        messages.value.push({
          id: Date.now() + 1,
          text: botResponse,
          sender: "NextBot",
          timestamp: Date.now(),
          isBot: true
        })
      }
      
      isTyping.value = false
      
      // Scroll to bottom
      await nextTick()
      const chatArea = document.querySelector('.messages-container')
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight
      }
    }
    
    const sendSuggestion = (suggestion) => {
      newMessage.value = suggestion
      sendMessage()
    }
    
    const createGroup = () => {
      if (!newGroupName.value || selectedMembers.value.length === 0) return
      
      // Simulate group creation
      const groupMembers = availableUsers.value.filter(user => 
        selectedMembers.value.includes(user.id)
      )
      
      const groupMessage = `Group "${newGroupName.value}" created successfully with ${groupMembers.length} members: ${groupMembers.map(m => m.name).join(', ')}`
      
      messages.value.push({
        id: Date.now(),
        text: groupMessage,
        sender: "NextBot",
        timestamp: Date.now(),
        isBot: true
      })
      
      // Reset form
      newGroupName.value = ''
      selectedMembers.value = []
      showCreateGroup.value = false
      
      // Show notification
      showNotification('Group created successfully!')
    }
    
    const toggleUserSelection = (userId) => {
      const index = selectedMembers.value.indexOf(userId)
      if (index > -1) {
        selectedMembers.value.splice(index, 1)
      } else {
        selectedMembers.value.push(userId)
      }
    }
    
    const addUserToChat = (user) => {
      const message = `${user.name} has been added to the chat!`
      
      messages.value.push({
        id: Date.now(),
        text: message,
        sender: "NextBot",
        timestamp: Date.now(),
        isBot: true
      })
      
      showAddUser.value = false
      userSearchQuery.value = ''
      showNotification(`${user.name} added to chat`)
    }
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    const showNotification = (message) => {
      // Create notification element
      const notification = document.createElement('div')
      notification.className = 'notification-toast'
      notification.textContent = message
      document.body.appendChild(notification)
      
      // Animate in
      setTimeout(() => notification.classList.add('show'), 100)
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => document.body.removeChild(notification), 300)
      }, 3000)
    }
    
    // Initialize position
    onMounted(() => {
      position.value = {
        x: window.innerWidth - 80,
        y: window.innerHeight - 80
      }
    })
    
    return {
      // State
      isExpanded,
      isDragging,
      isTyping,
      hasUnreadMessages,
      unreadCount,
      position,
      
      // Refs
      floatingButton,
      widgetPanel,
      
      // Modals
      showCreateGroup,
      showAddUser,
      showSettings,
      
      // Form Data
      newMessage,
      newGroupName,
      selectedMembers,
      userSearchQuery,
      
      // Settings
      autoMinimizeDelay,
      theme,
      hapticFeedback,
      
      // Data
      messages,
      availableUsers,
      quickSuggestions,
      filteredUsers,
      
      // Methods
      toggleWidget,
      minimizeWidget,
      startDrag,
      sendMessage,
      sendSuggestion,
      createGroup,
      toggleUserSelection,
      addUserToChat,
      formatTime
    }
  }
}
</script>

<style scoped>
/* iOS-Style Floating Widget Styles */
.ios-floating-widget {
  position: fixed;
  z-index: 9999;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Floating Button */
.floating-button {
  position: absolute;
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

.chat-icon.rotating {
  animation: rotate 1s linear infinite;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

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

/* Widget Panel */
.widget-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 500px;
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

/* Header */
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

.title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-icon {
  font-size: 18px;
  font-weight: 300;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  padding: 16px 20px;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.action-btn {
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

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 20px;
}

.action-text {
  font-size: 11px;
  font-weight: 500;
  color: #333;
}

/* Chat Area */
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
  min-height: 200px;
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

.bot-message .message-avatar {
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

.user-message .message-content {
  background: #007AFF;
  color: white;
  margin-left: auto;
  max-width: 240px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sender-name {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 12px;
  align-items: center;
  animation: slideInUp 0.3s ease;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #34C759;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.typing-content {
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.typing-text {
  font-size: 14px;
  color: #666;
}

/* Input Area */
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
}

.send-btn:hover:not(:disabled) {
  background: #0056CC;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  font-size: 16px;
}

/* Quick Suggestions */
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.user-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background: rgba(0, 122, 255, 0.05);
}

.user-item.selected {
  background: rgba(0, 122, 255, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007AFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  border: 2px solid transparent;
}

.user-avatar.online {
  border-color: #34C759;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-email {
  font-size: 12px;
  color: #666;
}

.user-status {
  font-size: 12px;
  color: #666;
}

.selection-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007AFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #007AFF;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.add-btn:hover {
  background: #0056CC;
  transform: scale(1.1);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn-primary {
  background: #007AFF;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: #0056CC;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #007AFF;
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(0, 122, 255, 0.05);
}

/* Settings Modal */
.settings-modal .modal-body {
  padding: 20px;
}

.setting-item {
  margin-bottom: 24px;
}

.setting-item label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  background: white;
  cursor: pointer;
}

.theme-options {
  display: flex;
  gap: 8px;
}

.theme-btn {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.theme-btn.active {
  background: #007AFF;
  color: white;
  border-color: #007AFF;
}

.theme-btn:hover {
  background: rgba(0, 122, 255, 0.1);
}

/* Animations */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #007AFF;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
  z-index: 10001;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.notification-toast.show {
  transform: translateX(0);
  opacity: 1;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .widget-panel {
    background: rgba(28, 28, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .chat-area {
    background: rgba(44, 44, 46, 0.8);
  }
  
  .message-content {
    background: #2C2C2E;
    color: white;
  }
  
  .user-message .message-content {
    background: #007AFF;
    color: white;
  }
  
  .input-area {
    background: rgba(28, 28, 30, 0.9);
  }
  
  .message-input {
    background: #2C2C2E;
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .modal-content {
    background: #1C1C1E;
    color: white;
  }
  
  .form-input {
    background: #2C2C2E;
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .action-btn {
    background: #2C2C2E;
    border-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .quick-actions {
    background: rgba(44, 44, 46, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .widget-panel {
    width: calc(100vw - 40px);
    height: calc(100vh - 120px);
    bottom: 80px;
    left: 20px;
    right: 20px;
  }
  
  .floating-button {
    right: 20px;
    bottom: 20px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for keyboard navigation */
.floating-button:focus,
.action-btn:focus,
.send-btn:focus,
.suggestion-chip:focus,
.modal-close:focus,
.btn-primary:focus,
.btn-secondary:focus {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .widget-panel {
    border: 2px solid #000;
  }
  
  .message-content {
    border: 1px solid #000;
  }
  
  .floating-button {
    border: 2px solid #000;
  }
}
</style>

