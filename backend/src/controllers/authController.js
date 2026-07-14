const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await authService.registerUser({ fullName, email, password });
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login
};
