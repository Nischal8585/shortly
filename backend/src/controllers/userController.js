const userService = require('../services/userService');

/**
 * PATCH /api/users/profile
 * Updates user profile details (fullName and optional phoneNumber).
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const updatedUser = await userService.updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Your profile has been updated successfully.',
      data: updatedUser
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateProfile
};
