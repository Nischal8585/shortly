/**
 * Generates the absolute redirection URL for a given short code.
 *
 * @param {string} shortCode
 * @returns {string} The fully qualified short URL
 */
export const getShortUrl = (shortCode) => {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const redirectBase = apiBase.replace('/api', '');
  return `${redirectBase}/${shortCode}`;
};
