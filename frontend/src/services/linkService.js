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
    const message = error.response.data?.message || 'Link service request failed.';
    return new Error(message);
  } else if (error.request) {
    return new Error('No response from links server. Please check your network connection.');
  } else {
    return new Error(error.message || 'An unexpected error occurred in the link service.');
  }
}

export const linkService = {
  /**
   * Creates a shortened link.
   *
   * @param {object} linkData
   * @param {string} linkData.originalUrl
   * @param {string} [linkData.customAlias]
   * @returns {Promise<any>} Response payload data
   */
  async createLink(linkData) {
    try {
      const response = await api.post('/links', linkData);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Retrieves all links owned by the authenticated user.
   *
   * @returns {Promise<any>} Response payload data
   */
  async getLinks() {
    try {
      const response = await api.get('/links');
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Updates an existing link's settings.
   *
   * @param {string} id - The link database ID
   * @param {object} updateData
   * @param {string} [updateData.originalUrl]
   * @param {boolean} [updateData.isActive]
   * @param {string} [updateData.customAlias]
   * @returns {Promise<any>} Response payload data
   */
  async updateLink(id, updateData) {
    try {
      const response = await api.patch(`/links/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  /**
   * Soft deletes a link, disabling redirection routes.
   *
   * @param {string} id - The link database ID
   * @returns {Promise<any>} Response payload data
   */
  async deleteLink(id) {
    try {
      const response = await api.delete(`/links/${id}`);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  }
};

export default linkService;
