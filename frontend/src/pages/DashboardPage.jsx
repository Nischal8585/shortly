import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import linkService from '../services/linkService';
import { getShortUrl } from '../utils/linkUtils';
import './DashboardPage.css';

const LinkIcon = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

/**
 * DashboardPage — Renders user metrics, shortener form, and link table fetched from linkService.
 */
function DashboardPage() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shortener form state
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Copy tracking states
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [copyErrorLinkId, setCopyErrorLinkId] = useState(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await linkService.getLinks();
      const linksData = response.data || [];
      setLinks(linksData);
    } catch (err) {
      setError(err.message || 'Failed to retrieve links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Compute metrics
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  // Copy action handler
  const handleCopy = async (link) => {
    const fullUrl = getShortUrl(link.shortCode);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLinkId(link._id);
      setCopyErrorLinkId(null);
      setTimeout(() => setCopiedLinkId(null), 2500);
    } catch (err) {
      setCopyErrorLinkId(link._id);
      setCopiedLinkId(null);
      setTimeout(() => setCopyErrorLinkId(null), 2500);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      // Pass clean trimmed parameters
      await linkService.createLink({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined
      });

      // Clear input fields
      setOriginalUrl('');
      setCustomAlias('');
      setFormSuccess('Short URL generated successfully.');

      // Auto dismiss success toast
      setTimeout(() => setFormSuccess(null), 5000);

      // Re-fetch listing data
      await fetchLinks();
    } catch (err) {
      setFormError(err.message || 'An error occurred during link generation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="container">
        {/* Hero Section (Asymmetrical) */}
        <section className="hero">
          <div className="hero-content">
            <span className="badge">Phase 1 Foundation</span>
            <h1>Deliberately designed short links.</h1>
            <p>
              Shortly provides robust redirection and deep link insights without the generic
              templates. Keep control of your traffic with clean, responsive composition.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => document.getElementById('url-input')?.focus()}
            >
              Create Link
            </button>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Shorten a link</h2>
            
            {formSuccess && (
              <div className="form-alert form-alert-success">
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="form-alert form-alert-error">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="url-input">
                  Destination URL
                </label>
                <input
                  className="form-input"
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/very-long-link-path"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="custom-alias">
                  Custom Alias (Optional)
                </label>
                <input
                  className="form-input"
                  id="custom-alias"
                  type="text"
                  placeholder="custom-short-slug"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                {submitting ? 'Generating...' : 'Shorten'}
              </button>
            </form>
          </div>
        </section>

        {/* Dynamic List Section */}
        <section style={{ marginBottom: '4rem' }}>
          {error && (
            <div className="error-banner">
              <span>Error: {error}</span>
              <button onClick={fetchLinks}>Try Again</button>
            </div>
          )}

          {loading ? (
            <div className="skeleton-loader">
              <div className="skeleton-row" style={{ height: '80px', marginBottom: '1.5rem' }}></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          ) : links.length === 0 ? (
            <EmptyState
              icon={LinkIcon}
              title="You haven't created any short links yet."
              description="Create your first link using the form above to start redirecting traffic and tracking insights."
              action={{
                label: "Create your first link",
                onClick: () => document.getElementById('url-input')?.focus()
              }}
            />
          ) : (
            <>
              {/* Metrics Overview */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-value">{totalLinks}</span>
                  <span className="metric-label">Total Links</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{totalClicks}</span>
                  <span className="metric-label">Total Clicks</span>
                </div>
              </div>

              {/* Links Table */}
              <div className="table-container">
                <table className="links-table">
                  <thead>
                    <tr>
                      <th>Original URL</th>
                      <th>Short URL</th>
                      <th>Clicks</th>
                      <th>Created Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr key={link._id}>
                        <td>
                          <div className="url-cell" title={link.originalUrl}>
                            {link.originalUrl}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <a
                              className="short-url-link"
                              href={getShortUrl(link.shortCode)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {getShortUrl(link.shortCode).replace(/^https?:\/\//, '')}
                            </a>
                            <button
                              className={`btn-copy ${copiedLinkId === link._id ? 'copied' : ''}`}
                              onClick={() => handleCopy(link)}
                              aria-label="Copy short URL to clipboard"
                              title={copiedLinkId === link._id ? "Copied!" : "Copy URL"}
                            >
                              {copiedLinkId === link._id ? (
                                <span className="copy-feedback-text">✓ Copied</span>
                              ) : copyErrorLinkId === link._id ? (
                                <span className="copy-feedback-error">Failed</span>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                        <td>{link.clicks || 0}</td>
                        <td>
                          {new Date(link.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td>
                          <span className={`status-badge ${link.isActive ? 'active' : 'inactive'}`}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
