const linkService = require('../services/linkService');
const path = require('path');

/**
 * POST /api/links
 * Creates a shortened link.
 */
const createLink = async (req, res, next) => {
  try {
    const { originalUrl, customAlias } = req.body;
    const userId = req.user._id;

    const link = await linkService.createShortLink(userId, { originalUrl, customAlias });

    return res.status(201).json({
      success: true,
      message: 'Short link created successfully',
      data: link
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/links
 * Retrieves all links owned by the authenticated user.
 */
const getUserLinks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const links = await linkService.getUserLinks(userId);

    return res.status(200).json({
      success: true,
      data: links
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * PATCH /api/links/:id
 * Modifies an existing link's settings (URL, isActive status, custom alias).
 */
const updateLink = async (req, res, next) => {
  try {
    const linkId = req.params.id;
    const updateData = req.body;
    const userId = req.user._id;

    const link = await linkService.updateLink(userId, linkId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Link updated successfully',
      data: link
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /api/links/:id
 * Soft deletes a link, disabling redirection routes.
 */
const deleteLink = async (req, res, next) => {
  try {
    const linkId = req.params.id;
    const userId = req.user._id;

    await linkService.deleteLink(userId, linkId);

    return res.status(200).json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /:shortCode
 * Resolves a short slug and redirects the visitor to the destination.
 */
const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const shortCode = req.params.shortCode;
    const originalUrl = await linkService.resolveShortCode(shortCode);

    return res.redirect(302, originalUrl);
  } catch (error) {
    // Only handle Link Not Found errors for browsers
    if (error.statusCode === 404 && error.isLinkNotFound) {
      if (req.accepts('html')) {
        return res.status(404).sendFile(path.join(__dirname, '../../public/errors/404.html'));
      }
    }
    // All other errors pass to existing error middleware
    return next(error);
  }
};

module.exports = {
  createLink,
  getUserLinks,
  updateLink,
  deleteLink,
  redirectToOriginalUrl
};
