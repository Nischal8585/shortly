const analyticsService = require('../services/analyticsService');

/**
 * GET /api/links/:id/analytics
 * Retrieves aggregated click analytics datasets for a specific link.
 */
const getLinkAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const linkId = req.params.id;

    const analytics = await analyticsService.getLinkAnalytics(userId, linkId);

    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getLinkAnalytics
};
