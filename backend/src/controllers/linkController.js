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
 * PATCH /api/links/:id/status
 * Updates only the isActive status of the link.
 */
const updateLinkStatus = async (req, res, next) => {
  try {
    const linkId = req.params.id;
    const { isActive } = req.body;
    const userId = req.user._id;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      const error = new Error('isActive status is required and must be a boolean');
      error.statusCode = 400;
      throw error;
    }

    const link = await linkService.updateLinkStatus(userId, linkId, isActive);

    return res.status(200).json({
      success: true,
      message: `Link ${isActive ? 'resumed' : 'paused'} successfully`,
      data: link
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
    if (error.statusCode === 404 && error.isLinkNotFound) {
      if (req.accepts('html')) {
        return res.status(404).sendFile(path.join(__dirname, '../../public/errors/404.html'));
      }
    }
    if (error.statusCode === 410 && error.isLinkInactive) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      if (req.accepts('html')) {
        return res.status(410).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Disabled — Shortly</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #faf8f5;
                color: #2b2b2b;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                text-align: center;
                padding: 1.5rem;
              }
              .container {
                max-width: 480px;
                padding: 2.5rem;
                background: #ffffff;
                border: 1px solid #e6e4e0;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
              }
              .brand {
                font-size: 0.9rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #b7a99a;
                margin-bottom: 1rem;
              }
              h1 {
                font-size: 1.8rem;
                margin-top: 0;
                color: #e53e3e;
                font-weight: 700;
              }
              p {
                font-size: 1rem;
                color: #616161;
                line-height: 1.5;
                margin-bottom: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="brand">Shortly</div>
              <h1>Link Disabled</h1>
              <p>This short link has been disabled by its owner.</p>
            </div>
          </body>
          </html>
        `);
      }
      return res.status(410).send('This short link has been disabled.');
    }
    // All other errors pass to existing error middleware
    return next(error);
  }
};

module.exports = {
  createLink,
  getUserLinks,
  updateLink,
  updateLinkStatus,
  deleteLink,
  redirectToOriginalUrl
};
