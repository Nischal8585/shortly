const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid or expired token.'
      });
    }

    const user = await userRepository.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = protect;
