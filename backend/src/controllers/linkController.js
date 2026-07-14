const linkService = require('../services/linkService');

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

const getMyLinks = async (req, res, next) => {
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

const updateLink = async (req, res, next) => {
  try {
    const linkId = req.params.id;
    const updateData = req.body;
    const userId = req.user._id;

    const link = await linkService.updateUserLink(userId, linkId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Link updated successfully',
      data: link
    });
  } catch (error) {
    return next(error);
  }
};

const deleteLink = async (req, res, next) => {
  try {
    const linkId = req.params.id;
    const userId = req.user._id;

    await linkService.deleteUserLink(userId, linkId);

    return res.status(200).json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
};

const redirectLink = async (req, res, next) => {
  try {
    const shortCode = req.params.shortCode;
    const originalUrl = await linkService.redirectToOriginalUrl(shortCode);

    return res.redirect(302, originalUrl);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createLink,
  getMyLinks,
  updateLink,
  deleteLink,
  redirectLink
};
