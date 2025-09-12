<template>
  <div class="talk-widget">
    <div class="talk-widget__header">
      <h3 class="talk-widget__title">
        <span class="icon icon-talk"></span>
        Talk Messages
      </h3>
      <button 
        class="talk-widget__refresh" 
        @click="refreshMessages"
        :disabled="loading"
        title="Refresh messages"
      >
        <span class="icon icon-refresh" :class="{ 'icon-loading': loading }"></span>
      </button>
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
      </div>

      <div v-else class="talk-widget__messages">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="talk-widget__message"
          @click="openConversation(message.conversation.token)"
        >
          <div class="talk-widget__message-header">
            <span class="talk-widget__conversation-name">
              {{ message.conversation.displayName }}
            </span>
            <span class="talk-widget__message-time">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
          <div class="talk-widget__message-content">
            <strong>{{ message.actorDisplayName }}:</strong>
            {{ message.message }}
          </div>
        </div>
      </div>
    </div>

    <div class="talk-widget__footer">
      <button 
        class="talk-widget__compose" 
        @click="openTalkApp"
        title="Open Talk app"
      >
        <span class="icon icon-add"></span>
        New Message
      </button>
    </div>
  </div>
</template>

<script>
import { TalkApiService } from '../services/talkApi.js'
import { AuthService } from '../services/auth.js'

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
      refreshInterval: null
    }
  },
  mounted() {
    this.loadMessages()
    // Refresh messages every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadMessages()
    }, 30000)
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
}

.talk-widget__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-background-hover);
  border-bottom: 1px solid var(--color-border);
}

.talk-widget__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.talk-widget__refresh {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: var(--border-radius);
  color: var(--color-text-lighter);
  transition: all 0.2s ease;
}

.talk-widget__refresh:hover {
  background: var(--color-background-hover);
  color: var(--color-text);
}

.talk-widget__refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.talk-widget__content {
  max-height: 400px;
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
  gap: 8px;
}

.talk-widget__error {
  color: var(--color-error);
}

.talk-widget__retry {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 12px;
}

.talk-widget__retry:hover {
  background: var(--color-primary-hover);
}

.talk-widget__messages {
  padding: 8px;
}

.talk-widget__message {
  padding: 12px;
  border-radius: var(--border-radius);
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid transparent;
}

.talk-widget__message:hover {
  background: var(--color-background-hover);
  border-color: var(--color-border);
}

.talk-widget__message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.talk-widget__conversation-name {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 12px;
}

.talk-widget__message-time {
  font-size: 11px;
  color: var(--color-text-lighter);
}

.talk-widget__message-content {
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-text);
  word-wrap: break-word;
}

.talk-widget__footer {
  padding: 12px 16px;
  background: var(--color-background-hover);
  border-top: 1px solid var(--color-border);
}

.talk-widget__compose {
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background-color 0.2s ease;
}

.talk-widget__compose:hover {
  background: var(--color-primary-hover);
}

.icon-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
