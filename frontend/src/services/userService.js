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
    const message = error.response.data?.message || 'Profile update failed.';
    return new Error(message);
  } else if (error.request) {
    return new Error('No response from profile server. Please check your network connection.');
  } else {
    return new Error(error.message || 'An unexpected error occurred during profile update.');
  }
}

export const userService = {
  /**
   * Updates user profile info (fullName and optional phoneNumber).
   *
   * @param {object} profileData
   * @param {string} profileData.fullName
   * @param {string} [profileData.phoneNumber]
   * @returns {Promise<any>} Response payload data
   */
  async updateProfile(profileData) {
    try {
      const response = await api.patch('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  }
};

export default userService;
