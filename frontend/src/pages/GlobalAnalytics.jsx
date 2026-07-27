import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import { getShortUrl } from '../utils/linkUtils';

/**
 * GlobalAnalytics — Polished report sheet presenting aggregated click performance.
 */
function GlobalAnalytics({ links, analyticsIcon }) {
  const navigate = useNavigate();

  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter(link => link.isActive).length;
  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : '0';

  // Top Performing Link
  const topLink = totalLinks > 0 
    ? [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    : null;

  // Recent Links list (up to 5)
  const recentLinks = [...links].slice(0, 5);

  if (totalLinks === 0) {
    return (
      <EmptyState
        icon={analyticsIcon}
        title="No analytics yet."
        description="Create your first link on the dashboard to start tracking click statistics."
      />
    );
  }

  return (
    <div className="analytics-editorial-report">
      {/* Report Header */}
      <div className="report-header">
        <h1 className="report-title">Global Analytics</h1>
        <p className="report-subtitle">
          Monitor redirect performance across all shortened links.
        </p>
      </div>

      {/* Overview Section: One dominant KPI */}
      <div className="report-kpi-block">
        <span className="kpi-hero-value">{totalClicks}</span>
        <span className="kpi-hero-label">Total Redirects</span>
        
        <div className="kpi-supporting-metadata">
          <span className="metadata-item">{totalLinks} Links Created</span>
          <span className="metadata-separator">•</span>
          <span className="metadata-item">{activeLinks} Active</span>
          <span className="metadata-separator">•</span>
          <span className="metadata-item">Avg. {avgClicks} Clicks</span>
        </div>
      </div>

      {/* Top Performing Link Section: Structured & Anchored */}
      {topLink && topLink.clicks > 0 && (
        <div className="report-narrative-section">
          <h2 className="report-section-title">Top Performing Link</h2>
          <div className="top-performing-report-content">
            <div className="top-performing-report-details">
              <a
                href={getShortUrl(topLink.shortCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="top-performing-alias-anchor"
              >
                {topLink.customAlias || topLink.shortCode}
              </a>
              <div className="top-performing-destination-label" title={topLink.originalUrl}>
                {topLink.originalUrl}
              </div>
            </div>
            <div className="top-performing-clicks-group">
              <span className="top-performing-clicks-count">{topLink.clicks} clicks</span>
            </div>
          </div>
        </div>
      )}

      {/* Link Performance Section: Lightweight Scan List */}
      <div className="report-narrative-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2 className="report-section-title">Link Performance</h2>
        <div className="comparison-list">
          {recentLinks.map((link) => (
            <div className="comparison-row" key={link._id}>
              <div className="comparison-row__identity">
                <a
                  className="comparison-row__alias"
                  href={getShortUrl(link.shortCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.customAlias || link.shortCode}
                </a>
                <span className="comparison-row__destination" title={link.originalUrl}>
                  {link.originalUrl}
                </span>
              </div>
              <div className="comparison-row__metrics">
                <span className="comparison-row__clicks">{link.clicks || 0} clicks</span>
                <button
                  className="comparison-row__action-link"
                  onClick={() => navigate(`/analytics/${link._id}`)}
                >
                  Open →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GlobalAnalytics;
