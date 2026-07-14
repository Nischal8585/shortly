const Link = require('../models/Link');

const createLink = async (linkData) => {
  const link = new Link(linkData);
  return link.save();
};

const findByShortCode = async (shortCode) => {
  return Link.findOne({ shortCode }).exec();
};

const findByCustomAlias = async (customAlias) => {
  return Link.findOne({ customAlias }).exec();
};

const findLinksByUser = async (userId) => {
  return Link.find({ user: userId }).sort({ createdAt: -1 }).exec();
};

const findLinkById = async (linkId) => {
  return Link.findById(linkId).exec();
};

const updateLink = async (linkId, updateData) => {
  return Link.findByIdAndUpdate(linkId, updateData, { new: true }).exec();
};

const deleteLink = async (linkId) => {
  return Link.findByIdAndDelete(linkId).exec();
};

const incrementClicks = async (linkId) => {
  return Link.findByIdAndUpdate(
    linkId,
    {
      $inc: { clicks: 1 },
      $set: { lastClickedAt: new Date() }
    },
    { new: true }
  ).exec();
};

module.exports = {
  createLink,
  findByShortCode,
  findByCustomAlias,
  findLinksByUser,
  findLinkById,
  updateLink,
  deleteLink,
  incrementClicks
};
