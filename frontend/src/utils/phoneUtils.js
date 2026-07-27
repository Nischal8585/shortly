import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Formats an international phone number string for user-friendly display.
 *
 * @param {string} phone - The phone number string (typically E.164 format)
 * @returns {string} The formatted phone number (e.g. +91 99187 27343)
 */
export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  const clean = phone.trim();
  const parsed = parsePhoneNumberFromString(clean);
  if (parsed && parsed.isValid()) {
    return parsed.formatInternational();
  }

  return clean;
};

/**
 * Validates whether a phone number is a valid international number.
 *
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if the phone number is valid
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  const clean = phone.trim();
  const parsed = parsePhoneNumberFromString(clean);
  return !!(parsed && parsed.isPossible() && parsed.isValid());
};
