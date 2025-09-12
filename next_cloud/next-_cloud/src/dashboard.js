/**
 * Dashboard Talk Widget - Basic JavaScript Version
 */

class TalkWidget {
  constructor(containerId) {
    this.containerId = containerId;
    this.messages = [];
    this.loading = false;
    this.error = null;
    this.refreshInterval = null;
  }

  async init() {
    this.render();
    await this.loadMessages();
    
    // Refresh messages every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadMessages();
    }, 30000);
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
            Talk Messages
          </h3>
          <button class="talk-widget__refresh" onclick="talkWidget.refreshMessages()" title="Refresh messages">
            <span class="icon icon-refresh"></span>
          </button>
        </div>

        <div class="talk-widget__content" id="talk-widget-content">
          <div class="talk-widget__loading">
            <span class="icon icon-loading"></span>
            Loading messages...
          </div>
        </div>

        <div class="talk-widget__footer">
          <button class="talk-widget__compose" onclick="talkWidget.openTalkApp()" title="Open Talk app">
            <span class="icon icon-add"></span>
            New Message
          </button>
        </div>
      </div>
    `;

    this.addStyles();
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
      }

      .talk-widget__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--color-background-hover, #f5f5f5);
        border-bottom: 1px solid var(--color-border, #e0e0e0);
      }

      .talk-widget__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text, #333);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .talk-widget__refresh {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        border-radius: var(--border-radius, 8px);
        color: var(--color-text-lighter, #666);
        transition: all 0.2s ease;
      }

      .talk-widget__refresh:hover {
        background: var(--color-background-hover, #f0f0f0);
        color: var(--color-text, #333);
      }

      .talk-widget__content {
        max-height: 400px;
        overflow-y: auto;
        padding: 8px;
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
        gap: 8px;
      }

      .talk-widget__error {
        color: var(--color-error, #e74c3c);
      }

      .talk-widget__retry {
        background: var(--color-primary, #0082c9);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
        font-size: 12px;
      }

      .talk-widget__retry:hover {
        background: var(--color-primary-hover, #006ba3);
      }

      .talk-widget__message {
        padding: 12px;
        border-radius: var(--border-radius, 8px);
        margin-bottom: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        border: 1px solid transparent;
      }

      .talk-widget__message:hover {
        background: var(--color-background-hover, #f5f5f5);
        border-color: var(--color-border, #e0e0e0);
      }

      .talk-widget__message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      .talk-widget__conversation-name {
        font-weight: 600;
        color: var(--color-primary, #0082c9);
        font-size: 12px;
      }

      .talk-widget__message-time {
        font-size: 11px;
        color: var(--color-text-lighter, #666);
      }

      .talk-widget__message-content {
        font-size: 13px;
        line-height: 1.4;
        color: var(--color-text, #333);
        word-wrap: break-word;
      }

      .talk-widget__footer {
        padding: 12px 16px;
        background: var(--color-background-hover, #f5f5f5);
        border-top: 1px solid var(--color-border, #e0e0e0);
      }

      .talk-widget__compose {
        width: 100%;
        background: var(--color-primary, #0082c9);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: background-color 0.2s ease;
      }

      .talk-widget__compose:hover {
        background: var(--color-primary-hover, #006ba3);
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
        </div>
      `;
    } else {
      const messagesHtml = this.messages.map(message => `
        <div class="talk-widget__message" onclick="talkWidget.openConversation('${message.conversation.token}')">
          <div class="talk-widget__message-header">
            <span class="talk-widget__conversation-name">
              ${message.conversation.displayName}
            </span>
            <span class="talk-widget__message-time">
              ${this.formatTime(message.timestamp)}
            </span>
          </div>
          <div class="talk-widget__message-content">
            <strong>${message.actorDisplayName}:</strong>
            ${message.message}
          </div>
        </div>
      `).join('');

      content.innerHTML = `<div class="talk-widget__messages">${messagesHtml}</div>`;
    }
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
