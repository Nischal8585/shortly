const crypto = require('crypto');
const linkRepository = require('../repositories/linkRepository');
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

  const aliasRegex = /^[a-zA-Z0-9-]+$/;
  if (!aliasRegex.test(trimmed)) {
    const error = new Error('Custom alias can only contain alphanumeric characters and dashes');
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
 * Soft deletes a link by toggling its active status to false.
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

  return linkRepository.softDelete(linkId);
};

/**
 * Resolves a shortCode to its original URL, logging redirect clicks.
 */
const resolveShortCode = async (shortCode) => {
  const link = await linkRepository.findByShortCode(shortCode);
  if (!link) {
    const error = new Error('Link not found');
    error.statusCode = 404;
    throw error;
  }

  if (!link.isActive) {
    const error = new Error('Link is inactive');
    error.statusCode = 403;
    throw error;
  }

  // Record click (single repository operation updating both clicks and timestamp)
  await linkRepository.incrementClickCount(link._id);

  return link.originalUrl;
};

module.exports = {
  createShortLink,
  getUserLinks,
  updateLink,
  deleteLink,
  resolveShortCode
};
