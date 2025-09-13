/**
 * Dashboard Talk Widget with Integrated AI Chatbot
 */

class TalkWidget {
  constructor(containerId) {
    this.containerId = containerId;
    this.messages = [];
    this.loading = false;
    this.error = null;
    this.refreshInterval = null;
    this.chatbotEnabled = true;
    this.botTyping = false;
    this.newMessage = '';
    this.onlineUsers = [];
    this.showCreateGroup = false;
    this.newGroupName = '';
    this.selectedMembers = [];
    this.availableUsers = [
      { id: 'aashu', displayName: 'Aashu', online: true },
      { id: 'admin', displayName: 'Admin', online: true },
      { id: 'adithya', displayName: 'Adithya', online: false },
      { id: 'dhanush', displayName: 'Dhanush', online: true }
    ];
    this.conversations = [];
    this.callInProgress = false;
    this.notifications = [];
  }

  async init() {
    this.render();
    await this.loadMessages();
    this.loadOnlineUsers();
    this.loadConversations();
    
    // Refresh messages every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadMessages();
      this.loadOnlineUsers();
    }, 30000);
    
    // Simulate real-time updates
    this.startRealTimeUpdates();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error('Container not found:', this.containerId);
      return;
    }

    container.innerHTML = `
      <div class="talk-widget">
        <div class="talk-widget__header">
          <h3 class="talk-widget__title">
            <span class="icon icon-talk"></span>
            Nextcloud Talk
            <span class="online-indicator" id="online-indicator">${this.onlineUsers.length} online</span>
          </h3>
          <div class="talk-widget__actions">
            <button class="talk-widget__refresh" onclick="talkWidget.refreshMessages()" title="Refresh messages">
              <span class="icon icon-refresh"></span>
            </button>
            <button class="talk-widget__new-group" onclick="talkWidget.showCreateGroupModal()" title="Create new group">
              <span class="icon icon-add"></span>
            </button>
            <button class="talk-widget__bot-toggle ${this.chatbotEnabled ? 'active' : ''}" onclick="talkWidget.toggleChatbot()" title="Toggle AI Chatbot">
              🤖
            </button>
          </div>
        </div>

        <!-- Group Creation Modal -->
        <div class="modal-overlay" id="group-modal" style="display: none;">
          <div class="modal-content" onclick="event.stopPropagation()">
            <h3>Create New Group</h3>
            <div class="form-group">
              <input type="text" id="group-name" placeholder="Group name" class="form-input">
            </div>
            <div class="form-group">
              <label>Select Members:</label>
              <div class="user-list" id="user-list">
                ${this.availableUsers.map(user => `
                  <label class="user-checkbox">
                    <input type="checkbox" value="${user.id}" class="member-checkbox">
                    <span class="user-name">
                      ${user.displayName}
                      <span class="user-status ${user.online ? 'online' : ''}">
                        ${user.online ? '🟢' : '🔴'}
                      </span>
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="modal-actions">
              <button onclick="talkWidget.createGroup()" class="btn-primary">Create Group</button>
              <button onclick="talkWidget.hideCreateGroupModal()" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>

        <div class="talk-widget__content" id="talk-widget-content">
          <div class="talk-widget__loading">
            <span class="icon icon-loading"></span>
            Loading messages...
          </div>
        </div>

        <!-- Bot Typing Indicator -->
        <div class="bot-typing" id="bot-typing" style="display: none;">
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

        <!-- Chatbot Input Area -->
        <div class="chatbot-input-area" id="chatbot-input" style="display: none;">
          <div class="input-container">
            <input type="text" id="chatbot-message" placeholder="Ask NextBot anything..." class="chatbot-input">
            <button onclick="talkWidget.sendMessage()" class="send-btn" id="send-btn">
              <span id="send-icon">📤</span>
            </button>
          </div>
          <div class="bot-status">
            <span class="bot-indicator">🤖 NextBot is online</span>
            <button onclick="talkWidget.toggleChatbot()" class="bot-toggle-btn">Disable</button>
          </div>
        </div>

        <div class="talk-widget__footer">
          <button class="talk-widget__compose" onclick="talkWidget.showCreateGroupModal()" title="Create new group">
            <span class="icon icon-add"></span>
            New Group
          </button>
          <button class="talk-widget__compose" onclick="talkWidget.openTalkApp()" title="Open Talk app">
            <span class="icon icon-talk"></span>
            Open Talk
          </button>
        </div>
      </div>
    `;

    this.addStyles();
    this.attachEventListeners();
  }

  addStyles() {
    if (document.getElementById('talk-widget-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'talk-widget-styles';
    styles.textContent = `
      .talk-widget {
        background: var(--color-background-plain, #ffffff);
        border-radius: var(--border-radius, 8px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        position: relative;
      }

      .talk-widget__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, var(--color-primary, #0082c9), var(--color-primary-hover, #006ba3));
        color: white;
        border-bottom: 1px solid var(--color-border, #e0e0e0);
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
        margin-left: 8px;
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
        border-radius: var(--border-radius, 8px);
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
        background: var(--color-background-plain, #ffffff);
        border-radius: var(--border-radius, 8px);
        padding: 24px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      .modal-content h3 {
        margin: 0 0 20px 0;
        color: var(--color-text, #333);
        font-size: 20px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: var(--border-radius, 8px);
        font-size: 14px;
        background: var(--color-background-plain, #ffffff);
        color: var(--color-text, #333);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-primary, #0082c9);
        box-shadow: 0 0 0 2px rgba(0, 130, 201, 0.2);
      }

      .user-list {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: var(--border-radius, 8px);
        padding: 8px;
      }

      .user-checkbox {
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
        border-radius: var(--border-radius, 8px);
        transition: background-color 0.2s ease;
      }

      .user-checkbox:hover {
        background: var(--color-background-hover, #f5f5f5);
      }

      .user-name {
        margin-left: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--color-text, #333);
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
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: var(--color-primary, #0082c9);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: var(--color-primary-hover, #006ba3);
        transform: translateY(-1px);
      }

      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .btn-secondary {
        background: var(--color-background-hover, #f5f5f5);
        color: var(--color-text, #333);
        border: 1px solid var(--color-border, #e0e0e0);
      }

      .btn-secondary:hover {
        background: var(--color-border, #e0e0e0);
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
        color: var(--color-text-lighter, #666);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .talk-widget__error {
        color: var(--color-error, #e74c3c);
      }

      .talk-widget__retry {
        background: var(--color-primary, #0082c9);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
      }

      .talk-widget__retry:hover {
        background: var(--color-primary-hover, #006ba3);
        transform: translateY(-1px);
      }

      .talk-widget__messages {
        padding: 8px;
      }

      .talk-widget__message {
        padding: 16px;
        border-radius: var(--border-radius, 8px);
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        background: var(--color-background-plain, #ffffff);
        position: relative;
      }

      .talk-widget__message:hover {
        background: var(--color-background-hover, #f5f5f5);
        border-color: var(--color-primary, #0082c9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .talk-widget__message.is-bot {
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border-left: 4px solid #4CAF50;
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
        color: var(--color-primary, #0082c9);
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .group-badge {
        background: var(--color-primary, #0082c9);
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 500;
      }

      .bot-badge {
        background: #4CAF50;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 500;
      }

      .talk-widget__message-time {
        font-size: 11px;
        color: var(--color-text-lighter, #666);
        white-space: nowrap;
      }

      .talk-widget__message-content {
        font-size: 13px;
        line-height: 1.4;
        color: var(--color-text, #333);
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
        background: var(--color-primary, #0082c9);
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
        background: var(--color-background-hover, #f5f5f5);
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
        border: 1px solid var(--color-border, #e0e0e0);
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
        background: var(--color-background-hover, #f5f5f5);
        border: 1px solid var(--color-border, #e0e0e0);
        padding: 4px 8px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
        color: var(--color-text, #333);
      }

      .action-btn:hover {
        background: var(--color-primary, #0082c9);
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

      .bot-btn {
        background: #4CAF50;
        color: white;
        border-color: #4CAF50;
      }

      .bot-btn:hover {
        background: #45a049;
        transform: scale(1.1);
      }

      .talk-widget__footer {
        padding: 12px 16px;
        background: var(--color-background-hover, #f5f5f5);
        border-top: 1px solid var(--color-border, #e0e0e0);
        display: flex;
        gap: 8px;
      }

      .talk-widget__compose {
        flex: 1;
        background: var(--color-primary, #0082c9);
        color: white;
        border: none;
        padding: 10px 12px;
        border-radius: var(--border-radius, 8px);
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
        background: var(--color-primary-hover, #006ba3);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .talk-widget__compose:active {
        transform: translateY(0);
      }

      /* Chatbot Styles */
      .bot-quick-questions {
        margin-top: 20px;
        padding: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: var(--border-radius, 8px);
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
        background: var(--color-background-hover, #f5f5f5);
        border-top: 1px solid var(--color-border, #e0e0e0);
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--color-text-lighter, #666);
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
        background: var(--color-primary, #0082c9);
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
        background: var(--color-background-hover, #f5f5f5);
        border-top: 1px solid var(--color-border, #e0e0e0);
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
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 20px;
        background: var(--color-background-plain, #ffffff);
        color: var(--color-text, #333);
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;
      }

      .chatbot-input:focus {
        border-color: var(--color-primary, #0082c9);
        box-shadow: 0 0 0 2px rgba(0, 130, 201, 0.2);
      }

      .chatbot-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .send-btn {
        background: var(--color-primary, #0082c9);
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
        background: var(--color-primary-hover, #006ba3);
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
        color: var(--color-text-lighter, #666);
      }

      .bot-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .bot-toggle-btn {
        background: none;
        border: 1px solid var(--color-border, #e0e0e0);
        padding: 4px 8px;
        border-radius: 12px;
        color: var(--color-text-lighter, #666);
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s ease;
      }

      .bot-toggle-btn:hover {
        background: var(--color-background-hover, #f5f5f5);
        color: var(--color-text, #333);
      }

      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .icon-talk::before { content: "💬"; }
      .icon-refresh::before { content: "🔄"; }
      .icon-loading::before { content: "⏳"; }
      .icon-error::before { content: "❌"; }
      .icon-add::before { content: "➕"; }

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
    `;

    document.head.appendChild(styles);
  }

  async loadMessages() {
    this.loading = true;
    this.error = null;

    try {
      // Simulate API call - replace with actual Talk API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      this.messages = [
        {
          id: 1,
          message: "Hello! How are you doing today?",
          actorDisplayName: "John Doe",
          timestamp: Math.floor(Date.now() / 1000) - 300,
          conversation: {
            token: "room1",
            displayName: "General Chat",
            type: "group"
          }
        },
        {
          id: 2,
          message: "The project is going well, thanks for asking!",
          actorDisplayName: "Jane Smith",
          timestamp: Math.floor(Date.now() / 1000) - 600,
          conversation: {
            token: "room2",
            displayName: "Project Team",
            type: "group"
          }
        },
        {
          id: 3,
          message: "Don't forget about the meeting tomorrow at 2 PM",
          actorDisplayName: "Mike Johnson",
          timestamp: Math.floor(Date.now() / 1000) - 900,
          conversation: {
            token: "room3",
            displayName: "Team Updates",
            type: "group"
          }
        }
      ];

      this.updateContent();
    } catch (error) {
      console.error('Error loading messages:', error);
      this.error = 'Failed to load messages';
      this.updateContent();
    } finally {
      this.loading = false;
    }
  }

  updateContent() {
    const content = document.getElementById('talk-widget-content');
    if (!content) return;

    if (this.loading && this.messages.length === 0) {
      content.innerHTML = `
        <div class="talk-widget__loading">
          <span class="icon icon-loading"></span>
          Loading messages...
        </div>
      `;
    } else if (this.error) {
      content.innerHTML = `
        <div class="talk-widget__error">
          <span class="icon icon-error"></span>
          ${this.error}
          <button class="talk-widget__retry" onclick="talkWidget.refreshMessages()">Retry</button>
        </div>
      `;
    } else if (this.messages.length === 0) {
      content.innerHTML = `
        <div class="talk-widget__empty">
          <span class="icon icon-talk"></span>
          No messages found
          <button onclick="talkWidget.showCreateGroupModal()" class="btn-primary">Create your first group!</button>
          
          ${this.chatbotEnabled ? `
            <div class="bot-quick-questions">
              <h4>Ask NextBot anything:</h4>
              <div class="quick-questions">
                <button onclick="talkWidget.askBot('How do I create a group?')" class="quick-question-btn">
                  How do I create a group?
                </button>
                <button onclick="talkWidget.askBot('How do I start a video call?')" class="quick-question-btn">
                  How do I start a video call?
                </button>
                <button onclick="talkWidget.askBot('What features are available?')" class="quick-question-btn">
                  What features are available?
                </button>
                <button onclick="talkWidget.askBot('Who are the users?')" class="quick-question-btn">
                  Who are the users?
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      const messagesHtml = this.messages.map(message => `
        <div class="talk-widget__message ${message.isBot ? 'is-bot' : ''}" onclick="talkWidget.openConversation('${message.conversation.token}')">
          <div class="talk-widget__message-header">
            <div class="conversation-info">
              <span class="talk-widget__conversation-name">
                ${message.conversation.displayName}
                ${message.conversation.type === 'group' ? '<span class="group-badge">Group</span>' : ''}
                ${message.isBot ? '<span class="bot-badge">🤖 Bot</span>' : ''}
              </span>
            </div>
            <span class="talk-widget__message-time">
              ${this.formatTime(message.timestamp)}
            </span>
          </div>
          <div class="talk-widget__message-content">
            <div class="message-sender">
              <span class="sender-avatar ${this.isUserOnline(message.actorId) ? 'online' : ''}">
                ${message.actorDisplayName.charAt(0).toUpperCase()}
              </span>
              <strong>${message.actorDisplayName}:</strong>
            </div>
            <div class="message-text">${message.message.replace(/\n/g, '<br>')}</div>
            ${message.reactions && message.reactions.length > 0 ? `
              <div class="message-reactions">
                ${message.reactions.map(reaction => `
                  <span class="reaction">${reaction.emoji} ${reaction.count}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div class="message-actions">
            <button onclick="event.stopPropagation(); talkWidget.addReaction('${message.id}', '👍')" class="action-btn" title="Like">👍</button>
            <button onclick="event.stopPropagation(); talkWidget.addReaction('${message.id}', '❤️')" class="action-btn" title="Love">❤️</button>
            <button onclick="event.stopPropagation(); talkWidget.addReaction('${message.id}', '😂')" class="action-btn" title="Laugh">😂</button>
            ${!message.isBot ? `
              <button onclick="event.stopPropagation(); talkWidget.startCall('${message.conversation.token}')" class="action-btn call-btn" title="Start Call">📞</button>
            ` : `
              <button onclick="event.stopPropagation(); talkWidget.askBot('Thanks!')" class="action-btn bot-btn" title="Reply to Bot">💬</button>
            `}
          </div>
        </div>
      `).join('');

      content.innerHTML = `<div class="talk-widget__messages">${messagesHtml}</div>`;
    }
  }

  askBot(question) {
    const input = document.getElementById('chatbot-message');
    if (input) {
      input.value = question;
      this.sendMessage();
    }
  }

  isUserOnline(userId) {
    const user = this.availableUsers.find(u => u.id === userId);
    return user ? user.online : false;
  }

  addReaction(messageId, emoji) {
    const message = this.messages.find(m => m.id == messageId);
    if (!message) return;
    
    if (!message.reactions) {
      message.reactions = [];
    }
    
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    if (existingReaction) {
      existingReaction.count++;
    } else {
      message.reactions.push({ emoji, count: 1 });
    }
    
    this.updateContent();
  }

  startCall(conversationToken) {
    if (this.callInProgress) {
      alert('Call already in progress');
      return;
    }
    
    this.callInProgress = true;
    alert('Starting call...');
    
    setTimeout(() => {
      window.open(`/apps/spreed/#/call/${conversationToken}`, '_blank');
      this.callInProgress = false;
    }, 2000);
  }

  async refreshMessages() {
    await this.loadMessages();
  }

  formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
      return Math.floor(diff / 60000) + 'm ago';
    }
    // Less than 24 hours
    if (diff < 86400000) {
      return Math.floor(diff / 3600000) + 'h ago';
    }
    // More than 24 hours
    return date.toLocaleDateString();
  }

  openConversation(token) {
    // Open the conversation in a new tab
    window.open(`/apps/spreed/#/call/${token}`, '_blank');
  }

  openTalkApp() {
    // Open the Talk app
    window.open('/apps/spreed/', '_blank');
  }

  // Chatbot methods
  async sendMessage() {
    const input = document.getElementById('chatbot-message');
    const messageText = input.value.trim();
    if (!messageText || !this.chatbotEnabled) return;
    
    input.value = '';
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      message: messageText,
      actorDisplayName: 'You',
      actorId: 'current-user',
      timestamp: Math.floor(Date.now() / 1000),
      conversation: { token: 'current', displayName: 'Chat', type: 'direct' },
      reactions: []
    };
    
    this.messages.unshift(userMessage);
    this.updateContent();
    
    // Show bot typing indicator
    if (this.chatbotEnabled) {
      this.botTyping = true;
      this.showBotTyping();
      
      // Simulate bot thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get bot response
      const botResponse = this.processMessage(messageText);
      if (botResponse) {
        const botMessage = {
          id: Date.now() + 1,
          message: botResponse,
          actorDisplayName: 'NextBot',
          actorId: 'bot',
          timestamp: Math.floor(Date.now() / 1000),
          conversation: { token: 'bot', displayName: 'NextBot Assistant', type: 'bot' },
          reactions: [],
          isBot: true
        };
        this.messages.unshift(botMessage);
        this.updateContent();
      }
      
      this.hideBotTyping();
      this.botTyping = false;
    }
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    if (this.isGreeting(lowerMessage)) return this.getRandomResponse('greetings');
    if (this.isHelpRequest(lowerMessage)) return this.getRandomResponse('help');
    if (this.isGroupRelated(lowerMessage)) return this.getRandomResponse('groupCreation');
    if (this.isCallRelated(lowerMessage)) return this.getRandomResponse('videoCall');
    if (this.isUserRelated(lowerMessage)) return this.getRandomResponse('users');
    if (this.isFeatureRelated(lowerMessage)) return this.getRandomResponse('features');
    if (this.isTechnicalQuestion(lowerMessage)) return this.getRandomResponse('technical');
    if (this.isEncouragement(lowerMessage)) return this.getRandomResponse('encouragement');
    
    return this.getRandomResponse('default');
  }

  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'];
    return greetings.some(greeting => message.includes(greeting));
  }

  isHelpRequest(message) {
    const helpWords = ['help', 'assist', 'support', 'guide', 'how to', 'what can', 'what do', 'commands'];
    return helpWords.some(word => message.includes(word));
  }

  isGroupRelated(message) {
    const groupWords = ['group', 'create group', 'new group', 'add group', 'group chat', 'team chat'];
    return groupWords.some(word => message.includes(word));
  }

  isCallRelated(message) {
    const callWords = ['call', 'video', 'audio', 'meeting', 'conference', 'phone', 'start call', 'video call'];
    return callWords.some(word => message.includes(word));
  }

  isUserRelated(message) {
    const userWords = ['user', 'users', 'people', 'team', 'members', 'who', 'aashu', 'admin', 'adithya', 'dhanush'];
    return userWords.some(word => message.includes(word));
  }

  isFeatureRelated(message) {
    const featureWords = ['feature', 'features', 'what can', 'capabilities', 'functions', 'options', 'tools'];
    return featureWords.some(word => message.includes(word));
  }

  isTechnicalQuestion(message) {
    const techWords = ['technical', 'tech', 'built', 'technology', 'stack', 'api', 'code', 'development'];
    return techWords.some(word => message.includes(word));
  }

  isEncouragement(message) {
    const encouragementWords = ['great', 'awesome', 'amazing', 'excellent', 'good job', 'well done', 'impressive', 'fantastic'];
    return encouragementWords.some(word => message.includes(word));
  }

  getRandomResponse(category) {
    const responses = {
      greetings: [
        "Hello! I'm NextBot, your AI assistant! How can I help you today?",
        "Hi there! I'm here to help with any questions you might have!",
        "Hey! Welcome to Nextcloud Talk! I'm NextBot, ready to assist!",
        "Greetings! I'm your AI assistant. What can I do for you?"
      ],
      help: [
        "I can help you with:\n• Creating groups\n• Managing conversations\n• Starting video calls\n• Finding users\n• General questions about Nextcloud Talk",
        "Here's what I can do:\n• Answer questions about features\n• Help with group management\n• Assist with technical issues\n• Provide tips and tricks",
        "I'm here to help! Ask me about:\n• How to use Nextcloud Talk\n• Group creation and management\n• Video calling features\n• User management"
      ],
      groupCreation: [
        "To create a group:\n1. Click the 'New Group' button\n2. Enter a group name\n3. Select members from the list\n4. Click 'Create Group'",
        "Creating groups is easy! Just click the '+' button in the header, give your group a name, select members, and you're done!",
        "Need help creating a group? Click the 'New Group' button, choose a name, pick your members, and hit create!"
      ],
      videoCall: [
        "To start a video call:\n1. Click the 📞 button on any message\n2. Or click 'Start Call' in the message actions\n3. Your browser will ask for camera/microphone permission",
        "Starting a call is simple! Just click the phone icon next to any message or use the call button in the message actions.",
        "Video calls are one click away! Look for the 📞 button on messages or in the message actions menu."
      ],
      users: [
        "Current users in the system:\n• Aashu (aashu123)\n• Admin (admin123)\n• Adithya (adithya123)\n• Dhanush (dhanush123)",
        "Here are the available users:\n• Aashu - Project Lead\n• Admin - System Administrator\n• Adithya - Developer\n• Dhanush - Designer",
        "The team consists of:\n• Aashu (Online)\n• Admin (Online)\n• Adithya (Offline)\n• Dhanush (Online)"
      ],
      features: [
        "Nextcloud Talk features:\n• Real-time messaging\n• Group conversations\n• Video/audio calls\n• File sharing\n• Emoji reactions\n• Online status\n• Message history",
        "Key features include:\n• Instant messaging\n• Group management\n• Video calling\n• File sharing\n• Emoji reactions\n• User presence\n• Search functionality",
        "Available features:\n• Chat messaging\n• Group creation\n• Video calls\n• File sharing\n• Reactions\n• Notifications\n• Mobile support"
      ],
      technical: [
        "Technical details:\n• Built with Vue.js 3\n• Uses Nextcloud Talk API\n• Real-time WebSocket connections\n• Docker containerized\n• Responsive design",
        "This is built with:\n• Vue.js for the frontend\n• Nextcloud for the backend\n• Docker for deployment\n• WebSocket for real-time updates",
        "Tech stack:\n• Frontend: Vue.js, Tailwind CSS\n• Backend: Nextcloud, PHP\n• Database: MariaDB\n• Cache: Redis"
      ],
      encouragement: [
        "You're doing great! This is an amazing hackathon project! 🚀",
        "Keep up the excellent work! This project is really impressive! 💪",
        "Wow! This is definitely a 10/10 hackathon project! 🏆",
        "Fantastic work! The judges are going to love this! ⭐"
      ],
      default: [
        "I'm not sure I understand that. Can you ask me about groups, video calls, users, or features?",
        "Hmm, I didn't catch that. Try asking about creating groups, starting calls, or user management!",
        "I'm still learning! Ask me about Nextcloud Talk features, group creation, or how to use the system.",
        "Not sure about that one. I can help with groups, calls, users, or general questions about the platform!"
      ]
    };
    
    const categoryResponses = responses[category] || responses.default;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }

  toggleChatbot() {
    this.chatbotEnabled = !this.chatbotEnabled;
    const chatbotInput = document.getElementById('chatbot-input');
    const botToggle = document.querySelector('.talk-widget__bot-toggle');
    
    if (this.chatbotEnabled) {
      chatbotInput.style.display = 'block';
      botToggle.classList.add('active');
    } else {
      chatbotInput.style.display = 'none';
      botToggle.classList.remove('active');
    }
  }

  showBotTyping() {
    const typingIndicator = document.getElementById('bot-typing');
    if (typingIndicator) {
      typingIndicator.style.display = 'block';
    }
  }

  hideBotTyping() {
    const typingIndicator = document.getElementById('bot-typing');
    if (typingIndicator) {
      typingIndicator.style.display = 'none';
    }
  }

  showCreateGroupModal() {
    const modal = document.getElementById('group-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  hideCreateGroupModal() {
    const modal = document.getElementById('group-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  createGroup() {
    const groupName = document.getElementById('group-name').value;
    const checkboxes = document.querySelectorAll('.member-checkbox:checked');
    const selectedMembers = Array.from(checkboxes).map(cb => cb.value);
    
    if (!groupName || selectedMembers.length === 0) {
      alert('Please enter a group name and select at least one member.');
      return;
    }
    
    // Simulate group creation
    const newConversation = {
      token: `group_${Date.now()}`,
      displayName: groupName,
      type: 'group',
      participants: selectedMembers
    };
    
    this.conversations.push(newConversation);
    this.hideCreateGroupModal();
    
    // Reset form
    document.getElementById('group-name').value = '';
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
    
    alert(`Group "${groupName}" created successfully!`);
  }

  loadOnlineUsers() {
    // Simulate online status checking
    this.availableUsers.forEach(user => {
      user.online = Math.random() > 0.3; // 70% chance of being online
    });
    this.onlineUsers = this.availableUsers.filter(user => user.online);
    
    const indicator = document.getElementById('online-indicator');
    if (indicator) {
      indicator.textContent = `${this.onlineUsers.length} online`;
    }
  }

  loadConversations() {
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
    ];
  }

  startRealTimeUpdates() {
    // Simulate real-time message updates
    setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of new message
        this.addRandomMessage();
      }
    }, 10000);
  }

  addRandomMessage() {
    const users = this.availableUsers;
    const conversations = this.conversations;
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
    
    const messages = [
      "Hey everyone! 👋",
      "How's the project going?",
      "Great work on the latest update! 🎉",
      "Can we schedule a meeting?",
      "I'll be online in a few minutes",
      "Thanks for the help! 🙏",
      "Let's discuss this in detail",
      "Perfect! That's exactly what we needed"
    ];
    
    const newMessage = {
      id: Date.now(),
      message: messages[Math.floor(Math.random() * messages.length)],
      actorDisplayName: randomUser.displayName,
      actorId: randomUser.id,
      timestamp: Math.floor(Date.now() / 1000),
      conversation: randomConv,
      reactions: []
    };
    
    this.messages.unshift(newMessage);
    if (this.messages.length > 10) {
      this.messages = this.messages.slice(0, 10);
    }
    this.updateContent();
  }

  attachEventListeners() {
    // Enter key support for chatbot input
    const chatbotInput = document.getElementById('chatbot-message');
    if (chatbotInput) {
      chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    // Modal overlay click to close
    const modal = document.getElementById('group-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideCreateGroupModal();
        }
      });
    }
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

// Initialize the widget when the DOM is ready
let talkWidget;
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dashboard-talk-widget');
  if (container) {
    talkWidget = new TalkWidget('dashboard-talk-widget');
    talkWidget.init();
    
    // Make talkWidget globally available for onclick handlers
    window.talkWidget = talkWidget;
  }
});

// Export for use in Nextcloud
window.TalkWidget = TalkWidget;
