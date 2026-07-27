import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import linkService from '../services/linkService';
import { getShortUrl } from '../utils/linkUtils';
import GlobalAnalytics from './GlobalAnalytics';
import LinkAnalytics from './LinkAnalytics';
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
 * AnalyticsPage — Wrapper controller deciding whether to render GlobalAnalytics or LinkAnalytics.
 */
function AnalyticsPage() {
  const { linkId } = useParams();
  const [links, setLinks] = useState([]);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchLinksAndDetails = async () => {
      setLoading(true);
      try {
        const response = await linkService.getLinks();
        if (cancelled) return;
        const linksList = response.data || [];
        setLinks(linksList);

        if (linkId) {
          const linkData = linksList.find(l => l._id === linkId);
          if (!linkData) {
            setError('Link not found');
          } else {
            setLink(linkData);
            setError(null);
          }
        } else {
          setLink(null);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Analytics fetch failed:', err);
        setError(err.message || 'Failed to load analytics information');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLinksAndDetails();

    return () => {
      cancelled = true;
    };
  }, [linkId]);

  const handleCopy = async () => {
    if (!link) return;
    const fullUrl = getShortUrl(link.shortCode);
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable (requires HTTPS or localhost)');
      }
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Could not copy the short URL. Copy it manually instead.');
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

return (
  <div className="analytics-page">
    <Navbar />

    <main className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
      {linkId ? (
        error || !link ? (
          <div className="link-information link-information__empty">
            <div className="link-information__empty-icon">
              {AnalyticsIcon}
            </div>
            <h2 className="link-information__empty-title">Link not found</h2>
            <p className="link-information__empty-description">
              {error || 'The link you are looking for does not exist or has been deleted.'}
            </p>
          </div>
        ) : (
          <LinkAnalytics
            link={link}
            copied={copied}
            handleCopy={handleCopy}
            checkIcon={CheckIcon}
            copyIcon={CopyIcon}
          />
        )
      ) : (
        <GlobalAnalytics
          links={links}
          analyticsIcon={AnalyticsIcon}
        />
      )}
    </main>
  </div>
);
}

export default AnalyticsPage;
