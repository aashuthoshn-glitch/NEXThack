import { getCurrentUser } from '@nextcloud/auth'

/**
 * Authentication service for Nextcloud Talk API
 */
export class AuthService {
  /**
   * Get the current user's authentication token
   * @returns {string|null} The user's token or null if not authenticated
   */
  static getAuthToken() {
    const user = getCurrentUser()
    return user ? user.uid : null
  }

  /**
   * Check if the user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  static isAuthenticated() {
    return getCurrentUser() !== null
  }

  /**
   * Get the current user's display name
   * @returns {string|null} The user's display name or null if not authenticated
   */
  static getCurrentUserDisplayName() {
    const user = getCurrentUser()
    return user ? user.displayName : null
  }

  /**
   * Get the current user's UID
   * @returns {string|null} The user's UID or null if not authenticated
   */
  static getCurrentUserUID() {
    const user = getCurrentUser()
    return user ? user.uid : null
  }
}
