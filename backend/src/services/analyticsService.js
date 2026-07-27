const linkRepository = require('../repositories/linkRepository');
const clickEventRepository = require('../repositories/clickEventRepository');

/**
 * Validates link ownership and retrieves aggregated click analytics datasets.
 *
 * @param {string} userId - The requester's user ID
 * @param {string} linkId - The link ID to fetch analytics for
 * @returns {Promise<object>} Unified analytics payload formatted to standards
 */
const getLinkAnalytics = async (userId, linkId) => {
  const link = await linkRepository.findById(linkId);
  if (!link) {
    const error = new Error('Link not found');
    error.statusCode = 404;
    throw error;
  }

  if (link.user.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this link.');
    error.statusCode = 403;
    throw error;
  }

  // 1. Fetch Overview stats
  const overview = await clickEventRepository.getOverview(linkId);
  const totalClicks = overview.totalClicks;

  // Empty State: if totalClicks is 0, return overview as 0, complete trends with 0, and breakdowns as empty arrays
  if (totalClicks === 0) {
    return {
      overview: {
        totalClicks: 0,
        todayClicks: 0,
        thisWeekClicks: 0,
        thisMonthClicks: 0
      },
      trend: {
        today: generateEmptyHourlyTrend(),
        last7Days: generateEmptyDailyTrend(7),
        last30Days: generateEmptyDailyTrend(30)
      },
      devices: [],
      browsers: [],
      operatingSystems: [],
      countries: [],
      referrers: []
    };
  }

  // 2. Fetch Aggregation Results
  const [
    hourlyTrendRaw,
    daily7TrendRaw,
    daily30TrendRaw,
    deviceRaw,
    browserRaw,
    osRaw,
    countryRaw,
    referrerRaw
  ] = await Promise.all([
    clickEventRepository.getHourlyTrend(linkId),
    clickEventRepository.getDailyTrend(linkId, 7),
    clickEventRepository.getDailyTrend(linkId, 30),
    clickEventRepository.getDeviceBreakdown(linkId),
    clickEventRepository.getBrowserBreakdown(linkId),
    clickEventRepository.getOSBreakdown(linkId),
    clickEventRepository.getCountryBreakdown(linkId),
    clickEventRepository.getReferrerBreakdown(linkId)
  ]);

  // 3. Process Trends
  const today = formatHourlyTrend(hourlyTrendRaw);
  const last7Days = formatDaily7Trend(daily7TrendRaw);
  const last30Days = formatDaily30Trend(daily30TrendRaw);

  // 4. Process Breakdowns
  const devices = formatDeviceBreakdown(deviceRaw, totalClicks);
  const browsers = formatBrowserBreakdown(browserRaw, totalClicks);
  const operatingSystems = formatOSBreakdown(osRaw, totalClicks);
  const referrers = formatReferrerBreakdown(referrerRaw, totalClicks);
  const countries = formatCountryBreakdown(countryRaw, totalClicks);

  return {
    overview,
    trend: {
      today,
      last7Days,
      last30Days
    },
    devices,
    browsers,
    operatingSystems,
    countries,
    referrers
  };
};

// --- Helpers for trends ---

const generateEmptyHourlyTrend = () => {
  const trend = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = `${String(d.getUTCHours()).padStart(2, '0')}:00`;
    trend.push({ label, count: 0 });
  }
  return trend;
};

const generateEmptyDailyTrend = (daysLimit) => {
  const trend = [];
  const now = new Date();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = daysLimit - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = daysLimit === 7 ? dayLabels[d.getUTCDay()] : d.toISOString().split('T')[0];
    trend.push({ label, count: 0 });
  }
  return trend;
};

const formatHourlyTrend = (results) => {
  const trend = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourInt = d.getUTCHours();
    const label = `${String(hourInt).padStart(2, '0')}:00`;
    trend.push({ label, hourInt, count: 0 });
  }
  results.forEach(res => {
    const item = trend.find(t => t.hourInt === res._id);
    if (item) {
      item.count = res.count;
    }
  });
  return trend.map(({ label, count }) => ({ label, count }));
};

const formatDaily7Trend = (results) => {
  const trend = [];
  const now = new Date();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = dayLabels[d.getUTCDay()];
    const dateStr = d.toISOString().split('T')[0];
    trend.push({ label, dateStr, count: 0 });
  }
  results.forEach(res => {
    const item = trend.find(t => t.dateStr === res._id);
    if (item) {
      item.count = res.count;
    }
  });
  return trend.map(({ label, count }) => ({ label, count }));
};

const formatDaily30Trend = (results) => {
  const trend = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = d.toISOString().split('T')[0];
    trend.push({ label, count: 0 });
  }
  results.forEach(res => {
    const item = trend.find(t => t.label === res._id);
    if (item) {
      item.count = res.count;
    }
  });
  return trend;
};

// --- Helpers for breakdowns ---

const formatDeviceBreakdown = (results, totalClicks) => {
  const order = ['Desktop', 'Mobile', 'Tablet', 'Unknown'];
  return order.map(name => {
    const match = results.find(r => r._id === name);
    const count = match ? match.count : 0;
    const percentage = totalClicks > 0 ? Number(((count / totalClicks) * 100).toFixed(1)) : 0;
    return { name, count, percentage };
  });
};

const formatBrowserBreakdown = (results, totalClicks) => {
  const order = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'];
  return order.map(name => {
    const match = results.find(r => r._id === name);
    const count = match ? match.count : 0;
    const percentage = totalClicks > 0 ? Number(((count / totalClicks) * 100).toFixed(1)) : 0;
    return { name, count, percentage };
  });
};

const formatOSBreakdown = (results, totalClicks) => {
  const order = ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'Other'];
  return order.map(name => {
    const match = results.find(r => r._id === name);
    const count = match ? match.count : 0;
    const percentage = totalClicks > 0 ? Number(((count / totalClicks) * 100).toFixed(1)) : 0;
    return { name, count, percentage };
  });
};

const formatReferrerBreakdown = (results, totalClicks) => {
  const order = ['Google', 'Direct', 'LinkedIn', 'Facebook', 'Instagram', 'X (Twitter)', 'Other'];
  return order.map(name => {
    const match = results.find(r => r._id === name);
    const count = match ? match.count : 0;
    const percentage = totalClicks > 0 ? Number(((count / totalClicks) * 100).toFixed(1)) : 0;
    return { name, count, percentage };
  });
};

const formatCountryBreakdown = (results, totalClicks) => {
  let countries = results.map(res => ({
    name: res._id.country || 'Unknown',
    code: res._id.countryCode || 'Unknown',
    count: res.count,
    percentage: totalClicks > 0 ? Number(((res.count / totalClicks) * 100).toFixed(1)) : 0
  }));

  if (countries.length > 10) {
    const top9 = countries.slice(0, 9);
    const rest = countries.slice(9);
    const otherCount = rest.reduce((sum, c) => sum + c.count, 0);
    const otherPercentage = totalClicks > 0 ? Number(((otherCount / totalClicks) * 100).toFixed(1)) : 0;
    top9.push({
      name: 'Other',
      code: 'Other',
      count: otherCount,
      percentage: otherPercentage
    });
    countries = top9;
  }
  return countries;
};

module.exports = {
  getLinkAnalytics
};
