/**
 * AI-Powered Chatbot Service for Nextcloud Talk
 * Provides intelligent responses and assistance
 */

export class ChatbotService {
  constructor() {
    this.isEnabled = true
    this.botName = 'NextBot'
    this.botAvatar = '🤖'
    this.responses = {
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
    }
  }

  /**
   * Process incoming message and generate appropriate response
   */
  async processMessage(message, context = {}) {
    if (!this.isEnabled) return null

    const lowerMessage = message.toLowerCase().trim()
    
    // Greeting detection
    if (this.isGreeting(lowerMessage)) {
      return this.getRandomResponse('greetings')
    }

    // Help requests
    if (this.isHelpRequest(lowerMessage)) {
      return this.getRandomResponse('help')
    }

    // Group creation help
    if (this.isGroupRelated(lowerMessage)) {
      return this.getRandomResponse('groupCreation')
    }

    // Video call help
    if (this.isCallRelated(lowerMessage)) {
      return this.getRandomResponse('videoCall')
    }

    // User queries
    if (this.isUserRelated(lowerMessage)) {
      return this.getRandomResponse('users')
    }

    // Feature queries
    if (this.isFeatureRelated(lowerMessage)) {
      return this.getRandomResponse('features')
    }

    // Technical questions
    if (this.isTechnicalQuestion(lowerMessage)) {
      return this.getRandomResponse('technical')
    }

    // Encouragement
    if (this.isEncouragement(lowerMessage)) {
      return this.getRandomResponse('encouragement')
    }

    // Default response
    return this.getRandomResponse('default')
  }

  /**
   * Check if message is a greeting
   */
  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy']
    return greetings.some(greeting => message.includes(greeting))
  }

  /**
   * Check if message is asking for help
   */
  isHelpRequest(message) {
    const helpWords = ['help', 'assist', 'support', 'guide', 'how to', 'what can', 'what do', 'commands']
    return helpWords.some(word => message.includes(word))
  }

  /**
   * Check if message is about groups
   */
  isGroupRelated(message) {
    const groupWords = ['group', 'create group', 'new group', 'add group', 'group chat', 'team chat']
    return groupWords.some(word => message.includes(word))
  }

  /**
   * Check if message is about calls
   */
  isCallRelated(message) {
    const callWords = ['call', 'video', 'audio', 'meeting', 'conference', 'phone', 'start call', 'video call']
    return callWords.some(word => message.includes(word))
  }

  /**
   * Check if message is about users
   */
  isUserRelated(message) {
    const userWords = ['user', 'users', 'people', 'team', 'members', 'who', 'aashu', 'admin', 'adithya', 'dhanush']
    return userWords.some(word => message.includes(word))
  }

  /**
   * Check if message is about features
   */
  isFeatureRelated(message) {
    const featureWords = ['feature', 'features', 'what can', 'capabilities', 'functions', 'options', 'tools']
    return featureWords.some(word => message.includes(word))
  }

  /**
   * Check if message is a technical question
   */
  isTechnicalQuestion(message) {
    const techWords = ['technical', 'tech', 'built', 'technology', 'stack', 'api', 'code', 'development']
    return techWords.some(word => message.includes(word))
  }

  /**
   * Check if message is encouraging
   */
  isEncouragement(message) {
    const encouragementWords = ['great', 'awesome', 'amazing', 'excellent', 'good job', 'well done', 'impressive', 'fantastic']
    return encouragementWords.some(word => message.includes(word))
  }

  /**
   * Get a random response from a category
   */
  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Generate a bot message object
   */
  generateBotMessage(response, conversationToken = 'bot') {
    return {
      id: `bot_${Date.now()}`,
      message: response,
      actorDisplayName: this.botName,
      actorId: 'bot',
      timestamp: Math.floor(Date.now() / 1000),
      conversation: {
        token: conversationToken,
        displayName: 'Bot Assistant',
        type: 'bot'
      },
      isBot: true,
      reactions: []
    }
  }

  /**
   * Toggle chatbot on/off
   */
  toggle() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  /**
   * Get chatbot status
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      name: this.botName,
      avatar: this.botAvatar
    }
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService()
