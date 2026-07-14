const crypto = require('crypto');
const linkRepository = require('../repositories/linkRepository');

const createShortLink = async (userId, linkData) => {
  const { originalUrl, customAlias } = linkData;

  let shortCode;

  if (customAlias) {
    const existingAlias = await linkRepository.findByCustomAlias(customAlias);
    const existingCode = await linkRepository.findByShortCode(customAlias);
    if (existingAlias || existingCode) {
      const error = new Error('Custom alias is already in use');
      error.statusCode = 409;
      throw error;
    }
    shortCode = customAlias;
  } else {
    let existingLink;
    let attempts = 0;

    do {
      shortCode = crypto.randomBytes(3).toString('hex');
      existingLink = await linkRepository.findByShortCode(shortCode);
      attempts++;
    } while (existingLink && attempts < 10);

    if (existingLink) {
      const error = new Error('Unable to generate a unique short code');
      error.statusCode = 500;
      throw error;
    }
  }

  return linkRepository.createLink({

    originalUrl,

    shortCode,

    customAlias: customAlias || undefined,

    user: userId

  });
};

const getUserLinks = async (userId) => {
  return linkRepository.findLinksByUser(userId);
};

const updateUserLink = async (userId, linkId, updateData) => {
  const link = await linkRepository.findLinkById(linkId);
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
  if (updateData.originalUrl !== undefined) allowedUpdates.originalUrl = updateData.originalUrl;
  if (updateData.isActive !== undefined) allowedUpdates.isActive = updateData.isActive;

  if (updateData.customAlias !== undefined) {
    const newAlias = updateData.customAlias.trim();

    if (!newAlias) {
      const error = new Error('Removing a custom alias is not supported');
      error.statusCode = 400;
      throw error;
    }

    const existingAlias = await linkRepository.findByCustomAlias(newAlias);
    const existingCode = await linkRepository.findByShortCode(newAlias);

    if (
      (existingAlias && existingAlias._id.toString() !== linkId.toString()) ||
      (existingCode && existingCode._id.toString() !== linkId.toString())
    ) {
      const error = new Error('Custom alias is already in use');
      error.statusCode = 409;
      throw error;
    }

    allowedUpdates.customAlias = newAlias;
    allowedUpdates.shortCode = newAlias;
  }

  return linkRepository.updateLink(linkId, allowedUpdates);
};

const deleteUserLink = async (userId, linkId) => {
  const link = await linkRepository.findLinkById(linkId);
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

  return linkRepository.deleteLink(linkId);
};

const redirectToOriginalUrl = async (shortCode) => {
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

  await linkRepository.incrementClicks(link._id);

  return link.originalUrl;
};

module.exports = {
  createShortLink,
  getUserLinks,
  updateUserLink,
  deleteUserLink,
  redirectToOriginalUrl
};
