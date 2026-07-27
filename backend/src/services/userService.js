const userRepository = require('../repositories/userRepository');

/**
 * Updates user profile (fullName and optional phoneNumber).
 *
 * @param {string} userId - The user ID
 * @param {object} profileData - The fields to update
 * @returns {Promise<object>} The updated user document
 */
const updateProfile = async (userId, profileData) => {
  const allowedKeys = ['fullName', 'phoneNumber'];
  const incomingKeys = Object.keys(profileData);
  const extraKeys = incomingKeys.filter((key) => !allowedKeys.includes(key));

  if (extraKeys.length > 0) {
    const error = new Error('Only full name and phone number can be updated');
    error.statusCode = 400;
    throw error;
  }

  const { fullName, phoneNumber } = profileData;

  // Validate fullName (required)
  if (fullName === undefined || fullName === null) {
    const error = new Error('Full name is required');
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = typeof fullName === 'string' ? fullName.trim() : '';
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    const error = new Error('Full name must be between 2 and 50 characters');
    error.statusCode = 400;
    throw error;
  }

  const updateFields = { fullName: trimmedName };

  // Validate and normalize phoneNumber (optional)
  if (phoneNumber !== undefined && phoneNumber !== null) {
    const trimmedPhone = typeof phoneNumber === 'string' ? phoneNumber.trim() : '';
    if (trimmedPhone !== '') {
      const { parsePhoneNumberFromString } = require('libphonenumber-js');
      
      let phoneToParse = trimmedPhone;
      if (!phoneToParse.startsWith('+')) {
        phoneToParse = '+' + phoneToParse;
      }

      const parsed = parsePhoneNumberFromString(phoneToParse);
      if (!parsed || !parsed.isPossible() || !parsed.isValid()) {
        const error = new Error('Please provide a valid international phone number');
        error.statusCode = 400;
        throw error;
      }
      updateFields.phoneNumber = parsed.number; // Stores E.164 format (e.g. +919918727343)
    } else {
      updateFields.phoneNumber = null;
    }
  }

  const updatedUser = await userRepository.updateUser(userId, updateFields);
  if (!updatedUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};

module.exports = {
  updateProfile
};
