import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import linkService from '../services/linkService';
import { getShortUrl } from '../utils/linkUtils';
import './AnalyticsPage.css';

const AnalyticsIcon = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const CopyIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

/**
 * AnalyticsPage — Detailed click statistics dashboard with link information.
 */
function AnalyticsPage() {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const fetchLink = async () => {
      if (!linkId) {
        setLoading(false);
        return;
      }
      try {
        const response = await linkService.getLinks();

        const links = response.data || [];
        const linkData = links.find(link => link._id === linkId);
        if (!linkData) {
          setError('Link not found');
          return;
        }
        setLink(linkData);
      } catch (err) {
        console.error('Analytics fetch failed:', err);
        setError(err.message || 'Failed to load link information');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [linkId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' •');
  };



  const handleCopy = async () => {
    if (!link) return;
    const fullUrl = getShortUrl(link.shortCode);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <Navbar />
        <main className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            Loading...
          </div>
        </main>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="analytics-page">
        <Navbar />
        <main className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
          <div className="link-information link-information__empty">
            <div className="link-information__empty-icon">
              {AnalyticsIcon}
            </div>
            <h2 className="link-information__empty-title">Link not found</h2>
            <p className="link-information__empty-description">
              {error || 'The link you are looking for does not exist or has been deleted.'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Navbar />

      <main className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
        <div className="link-information">
          <h2 className="link-information__header">Link Information</h2>
          
          <div className="link-information__grid">
            <div className="link-information__field">
              <label className="link-information__label">Original URL</label>
              <div className="link-information__url" title={link.originalUrl}>
                {link.originalUrl}
              </div>
            </div>

            <div className="link-information__field">
              <label className="link-information__label">Short URL</label>
              <div className="link-information__short-url">
                <a 
                  href={getShortUrl(link.shortCode)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-information__short-url-link"
                  title={getShortUrl(link.shortCode)}
                >
                  {getShortUrl(link.shortCode)}
                </a>
                <button
                  className="link-information__copy-button"
                  onClick={handleCopy}
                  aria-label="Copy short URL"
                  title="Copy short URL"
                >
                  {copied ? CheckIcon : CopyIcon}
                </button>
              </div>
            </div>

            <div className="link-information__field">
              <label className="link-information__label">Created Date & Time</label>
              <div className="link-information__value">
                {formatDate(link.createdAt)}
              </div>
            </div>

            <div className="link-information__field">
              <label className="link-information__label">Total Clicks</label>
              <div className="link-information__value">
                {link.clicks.toLocaleString()}
              </div>
            </div>

            <div className="link-information__field">
              <label className="link-information__label">Current Status</label>
              <span className={`link-information__status link-information__status--${link.isActive ? 'active' : 'deleted'}`}>
                {link.isActive ? 'Active' : 'Deleted'}
              </span>
            </div>

            {/* Future fields can be added here without layout changes */}
            {/* Examples: First Click, Last Click, QR Code, Expiry, etc. */}
          </div>
        </div>

        {/* 
          FUTURE ENHANCEMENTS
          ===================
          
          The following features are planned for future implementation but are not included in Phase 1:
          
          1. First Click
             - Display timestamp of first click
             - Requires: firstClickedAt field in Link model
          
          2. Last Click
             - Display timestamp of most recent click
             - Already available: lastClickedAt field exists in Link model
             - Implementation: Add field to Link Information section
          
          3. Click Timeline
             - Visual chart showing clicks over time
             - Requires: Click history collection or aggregation
             - Implementation: Chart component (e.g., Chart.js, Recharts)
          
          4. Device Breakdown
             - Percentage breakdown by device type (mobile, tablet, desktop)
             - Requires: User agent tracking on click
             - Implementation: Pie chart or progress bars
          
          5. Browser Breakdown
             - Percentage breakdown by browser (Chrome, Firefox, Safari, etc.)
             - Requires: User agent tracking on click
             - Implementation: Pie chart or progress bars
          
          6. Referrer Statistics
             - Top referrers driving traffic to the link
             - Requires: Referrer tracking on click
             - Implementation: List of top referrers with click counts
          
          7. Country Analytics
             - Geographic distribution of clicks by country
             - Requires: IP geolocation on click
             - Implementation: Map visualization or country list
          
          8. QR Code
             - Generate and display QR code for the short URL
             - Requires: QR code generation library (e.g., qrcode.react)
             - Implementation: QR code component with download option
          
          9. Expiry Date
             - Display link expiry date if set
             - Requires: expiryDate field in Link model
             - Implementation: Add field to Link Information section
          
          10. Click Heatmap
              - Visual representation of click activity by time of day/day of week
              - Requires: Click history with timestamps
              - Implementation: Heatmap chart component
          
          11. UTM Parameter Tracking
              - Display UTM parameters from referrers
              - Requires: UTM parameter parsing and storage
              - Implementation: UTM parameter breakdown table
          
          12. A/B Testing
              - Compare performance of multiple short URLs
              - Requires: A/B test configuration and tracking
              - Implementation: Comparison metrics and charts
          
          ARCHITECTURAL NOTES:
          - All future enhancements should follow the existing grid layout pattern
          - New fields can be added to link-information__grid without layout changes
          - Chart components should be added below Link Information section
          - Backend changes required for tracking features (user agent, referrer, geolocation)
          - Consider pagination for large datasets (click history)
          - Maintain editorial minimal design language
        */}

        <EmptyState
          icon={AnalyticsIcon}
          title="No analytics yet."
          description="Analytics will appear after your first link receives clicks."
        />
      </main>
    </div>
  );
}

export default AnalyticsPage;
