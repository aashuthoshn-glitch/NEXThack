<template>
  <div class="chat-widget">
    <!-- 🌟 Super Simple Header -->
    <div class="chat-header">
      <div class="header-icon">💬</div>
      <div class="header-text">
        <h2>Chat Room</h2>
        <p>{{ selectedRoomName || 'Choose a room below 👇' }}</p>
      </div>
      <div v-if="isLoading" class="loading-spinner">⏳</div>
    </div>

    <!-- 🚨 Error Message - Big and Clear -->
    <div v-if="error" class="error-box">
      <div class="error-icon">⚠️</div>
      <div class="error-text">{{ error }}</div>
    </div>

    <!-- 📱 Messages Area - Like a Phone -->
    <div class="messages-area" ref="messagesContainer">
      <!-- Empty State - Super Friendly -->
      <div v-if="messages.length === 0 && !isLoading" class="empty-state">
        <div class="empty-icon">👋</div>
        <h3>Hello! 👋</h3>
        <p>No messages yet.<br>Be the first to say something! 😊</p>
      </div>
      
      <!-- Messages - Like Text Messages -->
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-wrapper"
      >
        <!-- Message Bubble -->
        <div class="message-bubble">
          <div class="message-header">
            <div class="user-avatar">{{ getInitials(message.actorDisplayName) }}</div>
            <div class="user-info">
              <div class="user-name">{{ message.actorDisplayName }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          <div class="message-text">{{ message.message }}</div>
          
          <!-- Reaction Button - Big and Obvious -->
          <button
            @click="toggleReaction(message.id)"
            class="reaction-btn"
            :title="'Tap to react 😊'"
          >
            <span class="reaction-icon">😊</span>
            <span class="reaction-text">React</span>
          </button>
        </div>

        <!-- Reactions Display - Visual and Clear -->
        <div v-if="message.reactions && message.reactions.length > 0" class="reactions-display">
          <div
            v-for="reaction in message.reactions"
            :key="`${reaction.emoji}-${reaction.actorId}`"
            class="reaction-badge"
          >
            <span class="reaction-emoji">{{ reaction.emoji }}</span>
            <span class="reaction-count">{{ reaction.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ✍️ Message Input - Like a Phone Keyboard -->
    <div class="message-input-area">
      <div class="input-wrapper">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message here... ✍️"
          class="message-input"
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || isLoading"
          class="send-button"
          :class="{ 'disabled': !newMessage.trim() || isLoading }"
        >
          <span class="send-icon">📤</span>
          <span class="send-text">Send</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { fetchMessages, sendMessage as apiSendMessage, sendReaction } from './talkApi.js'
import { getAuthToken } from './auth.js'

// Props
const props = defineProps({
  selectedRoomId: {
    type: String,
    default: null
  }
})

// Reactive state
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const error = ref('')
const selectedRoomName = ref('')
const messagesContainer = ref(null)

// Fetch messages when room changes
watch(() => props.selectedRoomId, async (newRoomId) => {
  if (newRoomId) {
    await loadMessages()
  } else {
    messages.value = []
    selectedRoomName.value = ''
  }
}, { immediate: true })

// Load messages from API
const loadMessages = async () => {
  if (!props.selectedRoomId) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const token = getAuthToken()
    const response = await fetchMessages(props.selectedRoomId, token)
    
    if (response.success) {
      messages.value = response.data.reverse() // Show oldest first
      selectedRoomName.value = response.roomName || `Room ${props.selectedRoomId}`
      await scrollToBottom()
    } else {
      error.value = response.error || 'Failed to load messages'
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  } finally {
    isLoading.value = false
  }
}

// Send a new message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !props.selectedRoomId) return
  
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  
  isLoading.value = true
  error.value = ''
  
  try {
    const token = getAuthToken()
    const response = await apiSendMessage(props.selectedRoomId, messageText, token)
    
    if (response.success) {
      // Add the new message to the list
      messages.value.push(response.data)
      await scrollToBottom()
    } else {
      error.value = response.error || 'Failed to send message'
      newMessage.value = messageText // Restore the message
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
    newMessage.value = messageText // Restore the message
  } finally {
    isLoading.value = false
  }
}

// Toggle reaction on a message
const toggleReaction = async (messageId) => {
  if (!props.selectedRoomId) return
  
  try {
    const token = getAuthToken()
    const emoji = '👍' // Default emoji for now
    const response = await sendReaction(messageId, emoji, token)
    
    if (response.success) {
      // Reload messages to get updated reactions
      await loadMessages()
    } else {
      error.value = response.error || 'Failed to add reaction'
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  }
}

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Get user initials for avatar
const getInitials = (name) => {
  if (!name) return '?'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Format time in super simple way
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now - date
  
  // If less than 1 minute ago
  if (diff < 60000) {
    return 'Just now ⏰'
  }
  
  // If less than 1 hour ago
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} min ago ⏰`
  }
  
  // If today
  if (date.toDateString() === now.toDateString()) {
    return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ⏰`
  }
  
  // Otherwise show date
  return date.toLocaleDateString() + ' 📅'
}

// Load messages on component mount
onMounted(() => {
  if (props.selectedRoomId) {
    loadMessages()
  }
})
</script>

<style scoped>
.talk-widget {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom scrollbar for messages */
.talk-widget .overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.talk-widget .overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.talk-widget .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.talk-widget .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
