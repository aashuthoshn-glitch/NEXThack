/**
 * Nextcloud Talk API utility functions
 * Handles communication with Nextcloud Talk REST API
 */

// Base configuration
const API_BASE_URL = '/ocs/v2.php/apps/spreed/api/v4'
const DEFAULT_LIMIT = 10

/**
 * Make authenticated API request to Nextcloud Talk
 * @param {string} endpoint - API endpoint path
 * @param {string} token - Bearer token for authentication
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} API response
 */
async function makeApiRequest(endpoint, token, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'OCS-APIRequest': 'true'
    }
  }

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, requestOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Nextcloud API wraps responses in ocs.data
    if (data.ocs && data.ocs.data !== undefined) {
      return {
        success: true,
        data: data.ocs.data,
        meta: data.ocs.meta
      }
    }
    
    return {
      success: true,
      data: data
    }
  } catch (error) {
    console.error('API Request failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Fetch the last N messages from a Talk room
 * @param {string} roomId - The room identifier
 * @param {string} token - Bearer token for authentication
 * @param {number} limit - Number of messages to fetch (default: 10)
 * @returns {Promise<Object>} Response with messages array
 */
export async function fetchMessages(roomId, token, limit = DEFAULT_LIMIT) {
  if (!roomId || !token) {
    return {
      success: false,
      error: 'Room ID and token are required'
    }
  }

  const endpoint = `/room/${roomId}/messages?limit=${limit}&includeStatus=true`
  
  const response = await makeApiRequest(endpoint, token)
  
  if (response.success) {
    // Transform the messages to a more usable format
    const transformedMessages = response.data.map(msg => ({
      id: msg.id,
      message: msg.message,
      actorId: msg.actorId,
      actorDisplayName: msg.actorDisplayName,
      timestamp: msg.timestamp,
      reactions: msg.reactions || [],
      messageType: msg.messageType || 'comment',
      isSystemMessage: msg.messageType === 'system'
    }))

    return {
      success: true,
      data: transformedMessages,
      roomName: response.meta?.roomName || `Room ${roomId}`
    }
  }
  
  return response
}

/**
 * Send a message to a Talk room
 * @param {string} roomId - The room identifier
 * @param {string} messageText - The message content
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} Response with sent message data
 */
export async function sendMessage(roomId, messageText, token) {
  if (!roomId || !messageText || !token) {
    return {
      success: false,
      error: 'Room ID, message text, and token are required'
    }
  }

  const endpoint = `/room/${roomId}/message`
  
  const options = {
    method: 'POST',
    body: JSON.stringify({
      message: messageText,
      replyTo: null // Could be extended to support replies
    })
  }

  const response = await makeApiRequest(endpoint, token, options)
  
  if (response.success) {
    // Transform the response to match our message format
    const transformedMessage = {
      id: response.data.id,
      message: response.data.message,
      actorId: response.data.actorId,
      actorDisplayName: response.data.actorDisplayName,
      timestamp: response.data.timestamp,
      reactions: [],
      messageType: 'comment'
    }

    return {
      success: true,
      data: transformedMessage
    }
  }
  
  return response
}

/**
 * Send a reaction (emoji) to a message
 * @param {string} messageId - The message identifier
 * @param {string} emoji - The emoji to react with
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} Response indicating success/failure
 */
export async function sendReaction(messageId, emoji, token) {
  if (!messageId || !emoji || !token) {
    return {
      success: false,
      error: 'Message ID, emoji, and token are required'
    }
  }

  const endpoint = `/reaction/${messageId}`
  
  const options = {
    method: 'POST',
    body: JSON.stringify({
      reaction: emoji
    })
  }

  const response = await makeApiRequest(endpoint, token, options)
  
  if (response.success) {
    return {
      success: true,
      data: response.data
    }
  }
  
  return response
}

/**
 * Get list of available rooms for the current user
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} Response with rooms array
 */
export async function fetchRooms(token) {
  if (!token) {
    return {
      success: false,
      error: 'Token is required'
    }
  }

  const endpoint = '/room'
  
  const response = await makeApiRequest(endpoint, token)
  
  if (response.success) {
    // Transform rooms to a more usable format
    const transformedRooms = response.data.map(room => ({
      id: room.token,
      name: room.displayName,
      type: room.type,
      participantCount: room.participantCount,
      lastActivity: room.lastActivity,
      isUnread: room.unreadMessages > 0,
      unreadCount: room.unreadMessages
    }))

    return {
      success: true,
      data: transformedRooms
    }
  }
  
  return response
}

/**
 * Get room details
 * @param {string} roomId - The room identifier
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} Response with room details
 */
export async function fetchRoomDetails(roomId, token) {
  if (!roomId || !token) {
    return {
      success: false,
      error: 'Room ID and token are required'
    }
  }

  const endpoint = `/room/${roomId}`
  
  const response = await makeApiRequest(endpoint, token)
  
  if (response.success) {
    return {
      success: true,
      data: {
        id: response.data.token,
        name: response.data.displayName,
        type: response.data.type,
        participantCount: response.data.participantCount,
        lastActivity: response.data.lastActivity,
        description: response.data.description
      }
    }
  }
  
  return response
}

/**
 * Remove a reaction from a message
 * @param {string} messageId - The message identifier
 * @param {string} emoji - The emoji to remove
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} Response indicating success/failure
 */
export async function removeReaction(messageId, emoji, token) {
  if (!messageId || !emoji || !token) {
    return {
      success: false,
      error: 'Message ID, emoji, and token are required'
    }
  }

  const endpoint = `/reaction/${messageId}`
  
  const options = {
    method: 'DELETE',
    body: JSON.stringify({
      reaction: emoji
    })
  }

  const response = await makeApiRequest(endpoint, token, options)
  
  if (response.success) {
    return {
      success: true,
      data: response.data
    }
  }
  
  return response
}
