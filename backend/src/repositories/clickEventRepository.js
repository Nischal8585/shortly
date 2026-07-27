const mongoose = require('mongoose');
const ClickEvent = require('../models/ClickEvent');

/**
 * Persists a new ClickEvent in the database.
 *
 * @param {object} eventData - The fields to populate the ClickEvent document with
 * @returns {Promise<object>} The saved ClickEvent document
 */
const createClickEvent = async (eventData) => {
  const event = new ClickEvent(eventData);
  return await event.save();
};

/**
 * Aggregates overview click statistics for a specific link.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<object>} Overview statistics containing total, today, week, month click counts
 */
const getOverview = async (linkId) => {
  // All analytics are aggregated in UTC for consistency and future timezone support
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
    {
      $facet: {
        totalClicks: [{ $count: "count" }],
        todayClicks: [
          { $match: { clickedAt: { $gte: startOfToday } } },
          { $count: "count" }
        ],
        thisWeekClicks: [
          { $match: { clickedAt: { $gte: startOfWeek } } },
          { $count: "count" }
        ],
        thisMonthClicks: [
          { $match: { clickedAt: { $gte: startOfMonth } } },
          { $count: "count" }
        ]
      }
    }
  ]);

  const getCount = (facetResult) => (facetResult[0] ? facetResult[0].count : 0);

  return {
    totalClicks: getCount(stats[0].totalClicks),
    todayClicks: getCount(stats[0].todayClicks),
    thisWeekClicks: getCount(stats[0].thisWeekClicks),
    thisMonthClicks: getCount(stats[0].thisMonthClicks)
  };
};

/**
 * Groups clicks from the last 24 hours by hour.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<Array>} List of click counts grouped by hour index
 */
const getHourlyTrend = async (linkId) => {
  // All hourly trends are aggregated in UTC for consistency and future timezone support
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await ClickEvent.aggregate([
    {
      $match: {
        linkId: new mongoose.Types.ObjectId(linkId),
        clickedAt: { $gte: cutoff }
      }
    },
    {
      $group: {
        _id: { $hour: "$clickedAt" },
        count: { $sum: 1 }
      }
    }
  ]);
};

/**
 * Groups clicks from the last N days by date.
 *
 * @param {string} linkId - The link ID
 * @param {number} daysLimit - Number of days to look back
 * @returns {Promise<Array>} List of click counts grouped by date string (YYYY-MM-DD)
 */
const getDailyTrend = async (linkId, daysLimit) => {
  // All daily trends are aggregated in UTC for consistency and future timezone support
  const cutoff = new Date(Date.now() - daysLimit * 24 * 60 * 60 * 1000);
  return await ClickEvent.aggregate([
    {
      $match: {
        linkId: new mongoose.Types.ObjectId(linkId),
        clickedAt: { $gte: cutoff }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

/**
 * Groups clicks by device type.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<Array>} Click counts grouped by device type
 */
const getDeviceBreakdown = async (linkId) => {
  return await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
    { $group: { _id: "$device", count: { $sum: 1 } } }
  ]);
};

/**
 * Groups clicks by browser type.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<Array>} Click counts grouped by browser type
 */
const getBrowserBreakdown = async (linkId) => {
  return await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
    { $group: { _id: "$browser", count: { $sum: 1 } } }
  ]);
};

/**
 * Groups clicks by operating system.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<Array>} Click counts grouped by OS name
 */
const getOSBreakdown = async (linkId) => {
  return await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
    { $group: { _id: "$operatingSystem", count: { $sum: 1 } } }
  ]);
};

/**
 * Groups clicks by country name and country code.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<Array>} Click counts grouped by country details, sorted descending
 */
const getCountryBreakdown = async (linkId) => {
  return await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
    {
      $group: {
        _id: { country: "$country", countryCode: "$countryCode" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

/**
 * Groups clicks by referrer string.
 *
 * @param {string} linkId - The link ID
 * @returns {Promise<Array>} Click counts grouped by referrer
 */
const getReferrerBreakdown = async (linkId) => {
  return await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
    { $group: { _id: "$referrer", count: { $sum: 1 } } }
  ]);
};

module.exports = {
  createClickEvent,
  getOverview,
  getHourlyTrend,
  getDailyTrend,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getOSBreakdown,
  getCountryBreakdown,
  getReferrerBreakdown
};
