import api from './api';

/**
 * Normalizes Axios errors into standard JavaScript Error instances.
 * Extracts clean message strings from backend responses so Axios config,
 * request, and response internals are never leaked to caller components.
 *
 * @param {any} error - The caught error object
 * @returns {Error} A normalized Error instance
 */
function normalizeError(error) {
  if (error.response) {
    // The server responded with a status code outside 2xx
    const message = error.response.data?.message || 'Authentication request failed.';
    return new Error(message);
  } else if (error.request) {
    // The request was made but no response was received
    return new Error('No response from authentication server. Please check your network connection.');
  } else {
    // Something occurred during request setup
    return new Error(error.message || 'An unexpected error occurred during authentication.');
  }
}

export const authService = {
  /**
   * Registers a new user.
   *
   * @param {object} data
   * @param {string} data.fullName
   * @param {string} data.email
   * @param {string} data.password
   * @returns {Promise<any>} Response payload data
   */
  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Logs in an existing user.
   *
   * @param {object} data
   * @param {string} data.email
   * @param {string} data.password
   * @returns {Promise<any>} Response payload data
   */
  async login(data) {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Logs out the user by clearing the auth token.
   */
  logout() {
    localStorage.removeItem('shortly_auth_token');
  }
};

export default authService;
