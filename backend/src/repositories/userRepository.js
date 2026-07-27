const User = require('../models/User');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email, includePassword = false) => {
  let query = User.findOne({ email });
  if (includePassword) {
    query = query.select('+password');
  }
  return await query.exec();
};

const findUserById = async (userId) => {
  return await User.findById(userId).exec();
};

const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).exec();
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser
};
