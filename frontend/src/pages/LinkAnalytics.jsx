import React from 'react';
import { Link } from 'react-router-dom';
import { getShortUrl } from '../utils/linkUtils';

/**
 * LinkAnalytics — Polished report sheet presenting individual link redirection statistics.
 */
function LinkAnalytics({ link, copied, handleCopy, checkIcon, copyIcon }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Unknown';
    const datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} • ${timePart}`;
  };

  return (
    <div className="analytics-editorial-report">
      {/* Breadcrumb Navigation */}
      <div className="report-header" style={{ paddingBottom: 'var(--spacing-xs)', borderBottom: 'none' }}>
        <nav className="analytics-breadcrumb">
          <Link to="/analytics" className="analytics-breadcrumb__link">Analytics</Link>
          <span className="analytics-breadcrumb__separator">/</span>
          <span className="analytics-breadcrumb__current">{link.customAlias || link.shortCode}</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="report-header" style={{ paddingTop: 0 }}>
        <div className="link-analytics-hero__title-group">
          <h1 className="report-title" style={{ margin: 0 }}>
            {link.customAlias || link.shortCode}
          </h1>
          <span className={`status-badge status-badge--${link.isActive ? 'active' : 'inactive'}`}>
            {link.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Primary KPI Section: One dominant KPI */}
      <div className="report-kpi-block">
        <span className="kpi-hero-value">{link.clicks || 0}</span>
        <span className="kpi-hero-label">Total Redirects</span>

        <div className="kpi-supporting-metadata">
          <span className="metadata-item">Last redirect was {formatDate(link.lastClickedAt)}</span>
        </div>
      </div>

      {/* Link Details Section */}
      <div className="report-narrative-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2 className="report-section-title">Link Details</h2>
        <div className="report-field-group">
          <div className="report-field">
            <span className="report-field__label">Short URL</span>
            <div className="report-field__short-url-group">
              <a
                href={getShortUrl(link.shortCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="report-field__short-url-link"
              >
                {getShortUrl(link.shortCode).replace(/^https?:\/\//, '')}
              </a>
              <button
                className="report-field__copy-button"
                onClick={handleCopy}
                title="Copy short URL"
                aria-label="Copy short URL"
              >
                {copied ? checkIcon : copyIcon}
              </button>
            </div>
          </div>

          <div className="report-field" style={{ marginTop: 'var(--spacing-md)' }}>
            <span className="report-field__label">Original Destination</span>
            <div className="report-field__url-wrapper" title={link.originalUrl}>
              {link.originalUrl}
            </div>
          </div>

          <div className="report-field" style={{ marginTop: 'var(--spacing-md)' }}>
            <span className="report-field__label">Created On</span>
            <span className="report-field__value">
              {formatDate(link.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkAnalytics;
