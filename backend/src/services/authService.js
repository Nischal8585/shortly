const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const SALT_ROUNDS = 10;

const registerUser = async (userData) => {
  const { fullName, email, password } = userData;

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const savedUser = await userRepository.createUser({
    fullName,
    email,
    password: passwordHash
  });

  const createdUser = await userRepository.findUserById(savedUser._id);

  return createdUser;
};

const loginUser = async (email, password) => {
  const user = await userRepository.findUserByEmail(email, true);

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured');
    error.statusCode = 500;
    throw error;
  }

  const payload = {
    userId: user._id,
    email: user.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });

  const safeUser = await userRepository.findUserById(user._id);

  return {
    token,
    user: safeUser
  };
};

module.exports = {
  registerUser,
  loginUser
};