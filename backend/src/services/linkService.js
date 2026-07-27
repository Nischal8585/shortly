const crypto = require('crypto');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const linkRepository = require('../repositories/linkRepository');
const clickEventRepository = require('../repositories/clickEventRepository');
const RESERVED_ALIASES = require('../constants/reservedAliases');

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a random Base62 short code of specified length.
 */
function generateRandomBase62(length = 6) {
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % 62];
  }
  return result;
}

/**
 * Validates and normalizes the destination URL using JavaScript native URL API.
 * Returns the canonical URL string.
 */
function validateOriginalUrl(url) {
  if (!url || typeof url !== 'string') {
    const error = new Error('Original URL is required');
    error.statusCode = 400;
    throw error;
  }

  const trimmedUrl = url.trim();
  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      const error = new Error('URL protocol must be HTTP or HTTPS');
      error.statusCode = 400;
      throw error;
    }

    return parsedUrl.href; // Returns normalized canonical URL string
  } catch (err) {
    const error = new Error('Please provide a valid URL');
    error.statusCode = 400;
    throw error;
  }
}

/**
 * Validates custom alias matches length, character, and blacklist constraints.
 * Returns the normalized custom alias.
 */
function validateCustomAlias(alias) {
  if (!alias || typeof alias !== 'string') return undefined;

  const trimmed = alias.trim();
  if (trimmed.length < 5 || trimmed.length > 20) {
    const error = new Error('Custom alias must be between 5 and 20 characters long');
    error.statusCode = 400;
    throw error;
  }

  const aliasRegex = /^[a-zA-Z0-9-_]+$/;
  if (!aliasRegex.test(trimmed)) {
    const error = new Error('Custom alias can only contain alphanumeric characters, dashes, and underscores');
    error.statusCode = 400;
    throw error;
  }

  if (RESERVED_ALIASES.includes(trimmed.toLowerCase())) {
    const error = new Error('Custom alias is a reserved system path and cannot be used');
    error.statusCode = 400;
    throw error;
  }

  return trimmed;
}

/**
 * Generates a unique 6-character short code, retrying on index collisions.
 */
async function generateUniqueShortCode() {
  let shortCode;
  let existingLink;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    shortCode = generateRandomBase62(6);
    const codeExists = await linkRepository.findByShortCode(shortCode);
    const aliasExists = await linkRepository.findByCustomAlias(shortCode);
    existingLink = codeExists || aliasExists;
    attempts++;
  } while (existingLink && attempts < maxAttempts);

  if (existingLink) {
    const error = new Error(
      'Namespace collision. Could not generate a unique short URL identifier after multiple attempts.'
    );
    error.statusCode = 500;
    throw error;
  }

  return shortCode;
}

/**
 * Creates a shortened link document.
 */
const createShortLink = async (userId, linkData) => {
  const normalizedUrl = validateOriginalUrl(linkData.originalUrl);
  const normalizedAlias = validateCustomAlias(linkData.customAlias);

  let shortCode;

  if (normalizedAlias) {
    // Collision check: verify alias is not in use as custom alias or shortCode
    const existingAlias = await linkRepository.findByCustomAlias(normalizedAlias);
    const existingCode = await linkRepository.findByShortCode(normalizedAlias);
    if (existingAlias || existingCode) {
      const error = new Error('Custom alias is already in use');
      error.statusCode = 409;
      throw error;
    }
    shortCode = normalizedAlias;
  } else {
    shortCode = await generateUniqueShortCode();
  }

  return linkRepository.createLink({
    originalUrl: normalizedUrl,
    shortCode,
    customAlias: normalizedAlias,
    user: userId
  });
};

/**
 * Fetches all links owned by the specified user.
 */
const getUserLinks = async (userId) => {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }
  return linkRepository.findByUser(userId);
};

/**
 * Updates an existing link's settings, validating permissions and constraints.
 */
const updateLink = async (userId, linkId, updateData) => {
  const link = await linkRepository.findById(linkId);
  if (!link) {
    const error = new Error('Link not found');
    error.statusCode = 404;
    throw error;
  }

  if (link.user.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this link.');
    error.statusCode = 403;
    throw error;
  }

  const allowedUpdates = {};

  if (updateData.originalUrl !== undefined) {
    allowedUpdates.originalUrl = validateOriginalUrl(updateData.originalUrl);
  }

  if (updateData.isActive !== undefined) {
    allowedUpdates.isActive = Boolean(updateData.isActive);
  }

  if (updateData.customAlias !== undefined) {
    const normalizedAlias = validateCustomAlias(updateData.customAlias);

    if (normalizedAlias) {
      // Collision check: verify the new alias does not collide with other records
      const existingAlias = await linkRepository.findByCustomAlias(normalizedAlias);
      const existingCode = await linkRepository.findByShortCode(normalizedAlias);

      if (
        (existingAlias && existingAlias._id.toString() !== linkId.toString()) ||
        (existingCode && existingCode._id.toString() !== linkId.toString())
      ) {
        const error = new Error('Custom alias is already in use');
        error.statusCode = 409;
        throw error;
      }

      allowedUpdates.customAlias = normalizedAlias;
      allowedUpdates.shortCode = normalizedAlias; // Sync shortCode with customAlias
    }
  }

  return linkRepository.updateLink(linkId, allowedUpdates);
};

/**
 * Updates the isActive status of a link, validating ownership.
 */
const updateLinkStatus = async (userId, linkId, isActive) => {
  if (typeof isActive !== 'boolean') {
    const error = new Error('isActive must be a boolean value');
    error.statusCode = 400;
    throw error;
  }

  const link = await linkRepository.findById(linkId);
  if (!link) {
    const error = new Error('Link not found');
    error.statusCode = 404;
    throw error;
  }

  if (link.user.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this link.');
    error.statusCode = 403;
    throw error;
  }

  return linkRepository.updateLink(linkId, { isActive });
};

/**
 * Deletes a link, validating permissions and constraints.
 */
const deleteLink = async (userId, linkId) => {
  const link = await linkRepository.findById(linkId);
  if (!link) {
    const error = new Error('Link not found');
    error.statusCode = 404;
    throw error;
  }

  if (link.user.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this link.');
    error.statusCode = 403;
    throw error;
  }

  return linkRepository.deleteById(linkId);
};

/**
 * Resolves a shortCode to its original URL, logging redirect clicks if active.
 */
const resolveShortCode = async (shortCode, clientInfo) => {
  const link = await linkRepository.findByShortCode(shortCode);
  if (!link) {
    const error = new Error('Link not found');
    error.statusCode = 404;
    error.isLinkNotFound = true;
    throw error;
  }

  if (!link.isActive) {
    const error = new Error('This short link has been disabled.');
    error.statusCode = 410;
    error.isLinkInactive = true;
    throw error;
  }

  // Record click
  await linkRepository.incrementClickCount(link._id);

  // Parse analytics and log click event asynchronously
  try {
    let country = 'Unknown';
    let countryCode = 'Unknown';
    let device = 'Unknown';
    let browser = 'Unknown';
    let operatingSystem = 'Unknown';
    let referrer = 'Direct';

    if (clientInfo) {
      // 1. Resolve Country & Country Code using geoip-lite
      if (clientInfo.ip) {
        const geo = geoip.lookup(clientInfo.ip);
        if (geo) {
          countryCode = geo.country || 'Unknown';
          const countryNames = {
            IN: 'India',
            US: 'United States',
            GB: 'United Kingdom',
            CA: 'Canada',
            AU: 'Australia',
            SG: 'Singapore',
            DE: 'Germany',
            FR: 'France',
            JP: 'Japan',
            AE: 'United Arab Emirates'
          };
          country = countryNames[countryCode] || countryCode;
        }
      }

      // 2. Parse User-Agent using ua-parser-js
      if (clientInfo.userAgent) {
        const parser = new UAParser(clientInfo.userAgent);
        const browserResult = parser.getBrowser();
        const osResult = parser.getOS();
        const deviceResult = parser.getDevice();

        const rawBrowser = browserResult.name || '';
        if (rawBrowser.includes('Chrome')) browser = 'Chrome';
        else if (rawBrowser.includes('Safari')) browser = 'Safari';
        else if (rawBrowser.includes('Firefox')) browser = 'Firefox';
        else if (rawBrowser.includes('Edge')) browser = 'Edge';
        else browser = 'Other';

        const rawOS = osResult.name || '';
        if (rawOS.includes('Windows')) operatingSystem = 'Windows';
        else if (rawOS.includes('Mac OS') || rawOS.includes('macOS')) operatingSystem = 'macOS';
        else if (rawOS.includes('Linux')) operatingSystem = 'Linux';
        else if (rawOS.includes('Android')) operatingSystem = 'Android';
        else if (rawOS.includes('iOS')) operatingSystem = 'iOS';
        else operatingSystem = 'Other';

        const deviceType = deviceResult.type;
        if (!deviceType) {
          device = 'Desktop';
        } else if (deviceType === 'mobile') {
          device = 'Mobile';
        } else if (deviceType === 'tablet') {
          device = 'Tablet';
        } else {
          device = 'Unknown';
        }
      }

      // 3. Classify Referrer
      if (clientInfo.referrer) {
        const ref = clientInfo.referrer.toLowerCase().trim();
        if (ref !== '') {
          if (ref.includes('google.com') || ref.includes('google.')) {
            referrer = 'Google';
          } else if (ref.includes('linkedin.com')) {
            referrer = 'LinkedIn';
          } else if (ref.includes('facebook.com') || ref.includes('fb.me')) {
            referrer = 'Facebook';
          } else if (ref.includes('instagram.com')) {
            referrer = 'Instagram';
          } else if (ref.includes('twitter.com') || ref.includes('t.co') || ref.includes('x.com')) {
            referrer = 'X (Twitter)';
          } else {
            referrer = 'Other';
          }
        }
      }
    }

    // Save ClickEvent to database
    await clickEventRepository.createClickEvent({
      linkId: link._id,
      country,
      countryCode,
      device,
      browser,
      operatingSystem,
      referrer
    });
  } catch (err) {
    console.error('Failed to log click event analytics:', err);
    // Ignore error so redirection continues
  }

  return link.originalUrl;
};

module.exports = {
  createShortLink,
  getUserLinks,
  updateLink,
  updateLinkStatus,
  deleteLink,
  resolveShortCode
};
