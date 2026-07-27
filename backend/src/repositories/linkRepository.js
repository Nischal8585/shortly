const Link = require('../models/Link');

/**
 * Creates a new link document.
 */
const createLink = async (data) => {
  const link = new Link(data);
  return link.save();
};

/**
 * Retrieves a link document by its primary key.
 */
const findById = async (id) => {
  return Link.findById(id).exec();
};

/**
 * Retrieves a link document by its unique shortCode.
 */
const findByShortCode = async (shortCode) => {
  return Link.findOne({ shortCode }).exec();
};

/**
 * Retrieves an active link document by its unique shortCode.
 */
const findActiveByShortCode = async (shortCode) => {
  return Link.findOne({ shortCode, isActive: true }).exec();
};

/**
 * Retrieves a link document by its customAlias.
 */
const findByCustomAlias = async (alias) => {
  return Link.findOne({ customAlias: alias }).exec();
};

/**
 * Retrieves all link documents owned by the specified user, sorted by creation date descending.
 */
const findByUser = async (userId) => {
  return Link.find({ user: userId }).sort({ createdAt: -1 }).exec();
};

/**
 * Updates a link document with the specified modifications.
 */
const updateLink = async (id, updates) => {
  return Link.findByIdAndUpdate(id, updates, { new: true }).exec();
};

/**
 * Deletes a link document by its primary key.
 */
const deleteById = async (id) => {
  return Link.findByIdAndDelete(id).exec();
};

/**
 * Increments the click tracker tally for a link by 1 and updates lastClickedAt.
 */
const incrementClickCount = async (id) => {
  return Link.findByIdAndUpdate(
    id,
    {
      $inc: { clicks: 1 },
      $set: { lastClickedAt: new Date() }
    },
    { new: true }
  ).exec();
};

/**
 * Updates the lastClickedAt timestamp value of a link to the current date and time.
 */
const updateLastClicked = async (id) => {
  return Link.findByIdAndUpdate(id, { $set: { lastClickedAt: new Date() } }, { new: true }).exec();
};

module.exports = {
  createLink,
  findById,
  findByShortCode,
  findActiveByShortCode,
  findByCustomAlias,
  findByUser,
  updateLink,
  deleteById,
  incrementClickCount,
  updateLastClicked
};
