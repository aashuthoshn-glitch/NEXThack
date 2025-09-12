/**
 * Authentication utility for Nextcloud Talk widget
 * This is a stub implementation that assumes authentication is already handled
 * by the Nextcloud dashboard environment.
 */

// Mock token storage - in a real implementation, this would come from
// the Nextcloud session or OAuth flow
let mockToken = null

/**
 * Get the current authentication token
 * In a real Nextcloud environment, this would retrieve the token from:
 * - Nextcloud session storage
 * - OAuth token from the dashboard
 * - CSRF token for same-origin requests
 * 
 * @returns {string} Bearer token for API authentication
 */
export function getAuthToken() {
  // In a real implementation, you might get this from:
  // - window.OC.currentUser (Nextcloud global)
  // - localStorage.getItem('nextcloud_token')
  // - document.querySelector('meta[name="csrf-token"]').content
  // - OAuth token from the dashboard context
  
  if (mockToken) {
    return mockToken
  }
  
  // For development/testing purposes, return a mock token
  // In production, this should be replaced with actual token retrieval
  console.warn('Using mock authentication token. Replace with real token in production.')
  return 'mock-bearer-token-12345'
}

/**
 * Set a mock token for testing purposes
 * @param {string} token - The token to use for API calls
 */
export function setMockToken(token) {
  mockToken = token
}

/**
 * Clear the stored token
 */
export function clearToken() {
  mockToken = null
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  const token = getAuthToken()
  return token && token !== 'mock-bearer-token-12345'
}

/**
 * Get current user information
 * In a real implementation, this would fetch user data from Nextcloud
 * @returns {Object} User information object
 */
export function getCurrentUser() {
  // In a real Nextcloud environment, you might get this from:
  // - window.OC.currentUser
  // - API call to /ocs/v2.php/cloud/user
  // - Dashboard context data
  
  return {
    id: 'current-user',
    displayName: 'Current User',
    email: 'user@example.com'
  }
}

/**
 * Real-world implementation examples for different Nextcloud setups:
 */

// Example 1: Using Nextcloud's global OC object
/*
export function getAuthToken() {
  if (typeof window !== 'undefined' && window.OC) {
    // For same-origin requests, you might use the CSRF token
    return window.OC.requestToken
  }
  return null
}
*/

// Example 2: Using OAuth token from dashboard
/*
export function getAuthToken() {
  // If the widget is embedded in a Nextcloud dashboard that provides OAuth
  const dashboardToken = window.dashboardContext?.oauthToken
  if (dashboardToken) {
    return dashboardToken
  }
  
  // Fallback to session-based authentication
  return window.OC?.requestToken
}
*/

// Example 3: Using fetch with credentials for same-origin requests
/*
export function getAuthToken() {
  // For same-origin requests, you might not need a bearer token
  // Instead, you'd rely on session cookies
  return null
}

// Then modify the API calls to include credentials
const response = await fetch(url, {
  ...options,
  credentials: 'same-origin'
})
*/

/**
 * Configuration for different authentication methods
 */
export const authConfig = {
  // Method 1: Bearer token (OAuth)
  useBearerToken: true,
  
  // Method 2: Session-based (same-origin)
  useSessionAuth: false,
  
  // Method 3: CSRF token (Nextcloud internal)
  useCSRFToken: false,
  
  // Token refresh interval (in milliseconds)
  tokenRefreshInterval: 30 * 60 * 1000, // 30 minutes
}

/**
 * Initialize authentication
 * This would be called when the widget is first loaded
 */
export function initializeAuth() {
  // In a real implementation, this might:
  // - Check for existing valid tokens
  // - Set up token refresh mechanisms
  // - Validate current authentication state
  
  console.log('Auth initialized for Nextcloud Talk widget')
  
  // Example: Set up token refresh
  if (authConfig.useBearerToken) {
    setInterval(() => {
      // Refresh token logic would go here
      console.log('Token refresh check...')
    }, authConfig.tokenRefreshInterval)
  }
}
