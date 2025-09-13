/**
 * Global iOS-Style Floating Chatbot Widget for Nextcloud
 * This widget will appear on ALL Nextcloud pages
 */

class GlobalFloatingWidget {
  constructor() {
    this.isExpanded = false
    this.isDragging = false
    this.isTyping = false
    this.hasUnreadMessages = false
    this.unreadCount = 0
    this.position = { x: 0, y: 0 }
    this.dragStart = { x: 0, y: 0 }
    this.messages = []
    this.autoMinimizeDelay = 30
    this.hapticFeedback = true
    
    // Initialize position
    this.position = {
      x: window.innerWidth - 80,
      y: window.innerHeight - 80
    }
    
    this.init()
  }

  init() {
    this.createFloatingButton()
    this.createWidgetPanel()
    this.loadMessages()
    this.startAutoUpdates()
    
    // Add some demo messages
    this.addMessage("Hello! I'm NextBot, your AI assistant. I can help you with Nextcloud Talk features!", true)
  }

  createFloatingButton() {
    // Remove existing button if any
    const existingButton = document.getElementById('global-floating-button')
    if (existingButton) {
      existingButton.remove()
    }

    const button = document.createElement('div')
    button.id = 'global-floating-button'
    button.className = 'global-floating-button'
    if (this.hasUnreadMessages) button.classList.add('pulse')
    
    button.innerHTML = `
      <div class="button-content">
        <div class="chat-icon">
          <span>💬</span>
        </div>
        <div class="badge" style="display: ${this.unreadCount > 0 ? 'flex' : 'none'}">${this.unreadCount}</div>
      </div>
    `
    
    button.style.cssText = `
      position: fixed;
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
      z-index: 9999;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      right: ${this.position.x - window.innerWidth + 80}px;
      bottom: ${window.innerHeight - this.position.y - 80}px;
    `
    
    button.addEventListener('click', () => this.toggleWidget())
    button.addEventListener('mousedown', (e) => this.startDrag(e))
    button.addEventListener('touchstart', (e) => this.startDrag(e))
    
    document.body.appendChild(button)
    this.floatingButton = button
  }

  createWidgetPanel() {
    // Remove existing panel if any
    const existingPanel = document.getElementById('global-widget-panel')
    if (existingPanel) {
      existingPanel.remove()
    }

    const panel = document.createElement('div')
    panel.id = 'global-widget-panel'
    panel.className = 'global-widget-panel'
    
    panel.innerHTML = `
      <div class="widget-header">
        <div class="header-content">
          <div class="title-section">
            <h3 class="widget-title">NextBot Assistant</h3>
            <div class="status-indicator">
              <span class="status-dot online"></span>
              <span class="status-text">Online</span>
            </div>
          </div>
          <button class="close-btn">
            <span class="close-icon">×</span>
          </button>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn" data-action="create-group">
          <span class="action-icon">👥</span>
          <span class="action-text">New Group</span>
        </button>
        <button class="action-btn" data-action="add-user">
          <span class="action-icon">👤</span>
          <span class="action-text">Add User</span>
        </button>
        <button class="action-btn" data-action="open-talk">
          <span class="action-icon">💬</span>
          <span class="action-text">Open Talk</span>
        </button>
      </div>

      <div class="chat-area">
        <div class="messages-container" id="global-messages-container">
          <!-- Messages will be added here -->
        </div>
      </div>

      <div class="input-area">
        <div class="input-container">
          <input type="text" class="message-input" placeholder="Ask NextBot anything..." id="global-message-input">
          <button class="send-btn" id="global-send-btn">
            <span class="send-icon">📤</span>
          </button>
        </div>
        
        <div class="quick-suggestions">
          <span class="suggestion-chip" data-suggestion="Create a group">Create a group</span>
          <span class="suggestion-chip" data-suggestion="Add users">Add users</span>
          <span class="suggestion-chip" data-suggestion="How to call?">How to call?</span>
          <span class="suggestion-chip" data-suggestion="Show features">Show features</span>
        </div>
      </div>
    `
    
    panel.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
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
      z-index: 9998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `
    
    // Add event listeners
    panel.querySelector('.close-btn').addEventListener('click', () => this.minimizeWidget())
    panel.querySelector('#global-send-btn').addEventListener('click', () => this.sendMessage())
    panel.querySelector('#global-message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage()
    })
    
    // Quick action buttons
    panel.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action
        this.handleQuickAction(action)
      })
    })
    
    // Suggestion chips
    panel.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const suggestion = e.currentTarget.dataset.suggestion
        this.sendSuggestion(suggestion)
      })
    })
    
    document.body.appendChild(panel)
    this.widgetPanel = panel
    
    // Add CSS styles
    this.addStyles()
  }

  addStyles() {
    if (document.getElementById('global-widget-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'global-widget-styles'
    styles.textContent = `
      .global-floating-button:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
      }

      .global-floating-button.pulse {
        animation: global-pulse 2s infinite;
      }

      @keyframes global-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .global-widget-panel.visible {
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      .global-widget-panel .widget-header {
        padding: 20px;
        background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
        color: white;
      }

      .global-widget-panel .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .global-widget-panel .widget-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .global-widget-panel .status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        opacity: 0.9;
        margin-top: 4px;
      }

      .global-widget-panel .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34C759;
      }

      .global-widget-panel .close-btn {
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

      .global-widget-panel .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      .global-widget-panel .close-icon {
        font-size: 18px;
        font-weight: 300;
      }

      .global-widget-panel .quick-actions {
        display: flex;
        padding: 16px 20px;
        gap: 12px;
        background: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .global-widget-panel .action-btn {
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

      .global-widget-panel .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .global-widget-panel .action-icon {
        font-size: 20px;
      }

      .global-widget-panel .action-text {
        font-size: 11px;
        font-weight: 500;
        color: #333;
      }

      .global-widget-panel .chat-area {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
        background: rgba(248, 248, 248, 0.8);
        max-height: 250px;
      }

      .global-widget-panel .messages-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .global-widget-panel .message-bubble {
        display: flex;
        gap: 12px;
        animation: global-slideInUp 0.3s ease;
      }

      .global-widget-panel .message-avatar {
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

      .global-widget-panel .bot-message .message-avatar {
        background: #34C759;
      }

      .global-widget-panel .message-content {
        flex: 1;
        background: white;
        border-radius: 16px;
        padding: 12px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        max-width: 280px;
      }

      .global-widget-panel .message-text {
        font-size: 14px;
        line-height: 1.4;
        color: #333;
        word-wrap: break-word;
      }

      .global-widget-panel .input-area {
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.9);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }

      .global-widget-panel .input-container {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
      }

      .global-widget-panel .message-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        font-size: 14px;
        outline: none;
        background: white;
        transition: all 0.2s ease;
      }

      .global-widget-panel .message-input:focus {
        border-color: #007AFF;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
      }

      .global-widget-panel .send-btn {
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

      .global-widget-panel .send-btn:hover:not(:disabled) {
        background: #0056CC;
        transform: scale(1.05);
      }

      .global-widget-panel .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .global-widget-panel .quick-suggestions {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .global-widget-panel .suggestion-chip {
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

      .global-widget-panel .suggestion-chip:hover {
        background: rgba(0, 122, 255, 0.2);
        transform: translateY(-1px);
      }

      @keyframes global-slideInUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .global-widget-panel {
          background: rgba(28, 28, 30, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .global-widget-panel .chat-area {
          background: rgba(44, 44, 46, 0.8);
        }
        
        .global-widget-panel .message-content {
          background: #2C2C2E;
          color: white;
        }
        
        .global-widget-panel .input-area {
          background: rgba(28, 28, 30, 0.9);
        }
        
        .global-widget-panel .message-input {
          background: #2C2C2E;
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .global-widget-panel .action-btn {
          background: #2C2C2E;
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .global-widget-panel .quick-actions {
          background: rgba(44, 44, 46, 0.8);
          border-color: rgba(255, 255, 255, 0.1);
        }
      }

      /* Responsive */
      @media (max-width: 480px) {
        .global-widget-panel {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
          bottom: 80px;
          left: 20px;
          right: 20px;
        }
      }
    `
    
    document.head.appendChild(styles)
  }

  toggleWidget() {
    if (this.hapticFeedback) {
      navigator.vibrate?.(50)
    }
    
    this.isExpanded = !this.isExpanded
    
    if (this.isExpanded) {
      this.widgetPanel.classList.add('visible')
      this.floatingButton.classList.remove('pulse')
      this.unreadCount = 0
      this.hasUnreadMessages = false
      this.updateBadge()
      this.startAutoMinimize()
    } else {
      this.widgetPanel.classList.remove('visible')
    }
  }

  minimizeWidget() {
    this.isExpanded = false
    this.widgetPanel.classList.remove('visible')
  }

  startAutoMinimize() {
    if (this.autoMinimizeDelay > 0) {
      setTimeout(() => {
        if (this.isExpanded) {
          this.minimizeWidget()
        }
      }, this.autoMinimizeDelay * 1000)
    }
  }

  startDrag(e) {
    if (this.isExpanded) return
    
    this.isDragging = true
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY
    
    this.dragStart = { x: clientX - this.position.x, y: clientY - this.position.y }
    
    document.addEventListener('mousemove', this.onDrag.bind(this))
    document.addEventListener('mouseup', this.stopDrag.bind(this))
    document.addEventListener('touchmove', this.onDrag.bind(this))
    document.addEventListener('touchend', this.stopDrag.bind(this))
  }

  onDrag(e) {
    if (!this.isDragging) return
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
    
    this.position = {
      x: clientX - this.dragStart.x,
      y: clientY - this.dragStart.y
    }
    
    // Snap to edges
    if (this.position.x < 20) this.position.x = 20
    if (this.position.x > window.innerWidth - 80) this.position.x = window.innerWidth - 80
    if (this.position.y < 20) this.position.y = 20
    if (this.position.y > window.innerHeight - 80) this.position.y = window.innerHeight - 80
    
    this.floatingButton.style.right = `${window.innerWidth - this.position.x - 80}px`
    this.floatingButton.style.bottom = `${window.innerHeight - this.position.y - 80}px`
  }

  stopDrag() {
    this.isDragging = false
    document.removeEventListener('mousemove', this.onDrag.bind(this))
    document.removeEventListener('mouseup', this.stopDrag.bind(this))
    document.removeEventListener('touchmove', this.onDrag.bind(this))
    document.removeEventListener('touchend', this.stopDrag.bind(this))
  }

  sendMessage() {
    const input = document.getElementById('global-message-input')
    const message = input.value.trim()
    
    if (!message) return
    
    this.addMessage(message, false)
    input.value = ''
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Great question! Let me help you with that.",
        "I can assist you with group creation and user management in Nextcloud Talk.",
        "Here's how you can do that in Nextcloud Talk...",
        "That's a common question! Here's the solution:",
        "I'm here to help! Let me provide you with the information.",
        "To create a group: Click the 'New Group' button, enter a name, select members, and create!",
        "To add users: Use the 'Add User' button to search and add people to your chat.",
        "For video calls: Click the phone icon next to any message to start a call."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      this.addMessage(randomResponse, true)
    }, 1500)
  }

  sendSuggestion(suggestion) {
    this.addMessage(suggestion, false)
    
    setTimeout(() => {
      this.addMessage("Perfect! I can help you with that. Let me guide you through the process.", true)
    }, 1500)
  }

  addMessage(text, isBot) {
    const container = document.getElementById('global-messages-container')
    const messageDiv = document.createElement('div')
    messageDiv.className = 'message-bubble'
    
    const avatar = document.createElement('div')
    avatar.className = 'message-avatar'
    if (isBot) avatar.classList.add('bot-avatar')
    avatar.textContent = isBot ? '🤖' : 'A'
    
    const content = document.createElement('div')
    content.className = 'message-content'
    
    const messageText = document.createElement('div')
    messageText.className = 'message-text'
    messageText.textContent = text
    
    content.appendChild(messageText)
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(content)
    container.appendChild(messageDiv)
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight
    
    // Add to messages array
    this.messages.push({
      id: Date.now(),
      text: text,
      sender: isBot ? 'NextBot' : 'You',
      timestamp: Date.now(),
      isBot: isBot
    })
  }

  handleQuickAction(action) {
    switch (action) {
      case 'create-group':
        this.addMessage("Let me help you create a new group! Click the 'New Group' button in Nextcloud Talk or use the Talk app directly.", true)
        this.showNotification('Opening group creation...')
        // Open Talk app in new tab
        window.open('/apps/spreed/', '_blank')
        break
      case 'add-user':
        this.addMessage("To add users to a chat, go to the Talk app and select the conversation you want to add people to.", true)
        this.showNotification('Opening user management...')
        window.open('/apps/spreed/', '_blank')
        break
      case 'open-talk':
        this.addMessage("Opening Nextcloud Talk for you...", true)
        this.showNotification('Opening Talk app...')
        window.open('/apps/spreed/', '_blank')
        break
    }
  }

  loadMessages() {
    // Load any existing messages from localStorage
    const savedMessages = localStorage.getItem('nextbot-messages')
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages)
      this.renderMessages()
    }
  }

  renderMessages() {
    const container = document.getElementById('global-messages-container')
    if (!container) return
    
    container.innerHTML = ''
    this.messages.forEach(message => {
      this.addMessage(message.text, message.isBot)
    })
  }

  updateBadge() {
    const badge = this.floatingButton.querySelector('.badge')
    if (badge) {
      badge.textContent = this.unreadCount
      badge.style.display = this.unreadCount > 0 ? 'flex' : 'none'
    }
  }

  showNotification(message) {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007AFF;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
      z-index: 10000;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
      notification.style.opacity = '1'
    }, 100)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      notification.style.opacity = '0'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }

  startAutoUpdates() {
    // Simulate new messages
    setInterval(() => {
      if (!this.isExpanded && Math.random() > 0.8) {
        this.unreadCount++
        this.hasUnreadMessages = true
        this.floatingButton.classList.add('pulse')
        this.updateBadge()
      }
    }, 15000)
    
    // Save messages periodically
    setInterval(() => {
      localStorage.setItem('nextbot-messages', JSON.stringify(this.messages))
    }, 30000)
  }
}

// Initialize the global widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if not already present
  if (!document.getElementById('global-floating-button')) {
    window.globalFloatingWidget = new GlobalFloatingWidget()
  }
})

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('global-floating-button')) {
      window.globalFloatingWidget = new GlobalFloatingWidget()
    }
  })
} else {
  if (!document.getElementById('global-floating-button')) {
    window.globalFloatingWidget = new GlobalFloatingWidget()
  }
}

// Export for use in Nextcloud
window.GlobalFloatingWidget = GlobalFloatingWidget

