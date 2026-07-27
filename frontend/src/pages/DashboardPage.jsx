import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import Modal from "../components/ui/Modal";
import QRCodeModal from "../components/ui/QRCodeModal";
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

  // Edit tracking states
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editAliasValue, setEditAliasValue] = useState('');
  const [savingLinkId, setSavingLinkId] = useState(null);
  const [editError, setEditError] = useState(null);
  const [editSuccessLinkId, setEditSuccessLinkId] = useState(null);

  // Delete tracking states
  const [deletingLinkId, setDeletingLinkId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  // QR tracking states
  const [selectedQrLink, setSelectedQrLink] = useState(null);

  // Status toggle states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalLink, setStatusModalLink] = useState(null);
  const [updatingStatusLinkId, setUpdatingStatusLinkId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Search & Filter state hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const editingLink =
    links.find((link) => link._id === editingLinkId) ?? null;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const lastFetchTimeRef = React.useRef(0);

  const fetchLinks = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 1000) {
      return;
    }
    lastFetchTimeRef.current = now;

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
    fetchLinks(true);
  }, []);

  useEffect(() => {
    const handleSync = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        fetchLinks();
      }
    };

    document.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      document.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Polling: Auto-refresh click parameters every 15 seconds when active
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchLinks();
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  // Compute filtered dataset
  const filteredLinks = React.useMemo(() => {
    return links
      .filter((link) => {
        if (statusFilter === 'active') return link.isActive === true;
        if (statusFilter === 'inactive') return link.isActive === false;
        return true;
      })
      .filter((link) => {
        const query = debouncedSearchQuery.trim().toLowerCase();
        if (!query) return true;

        const originalUrlMatch = link.originalUrl?.toLowerCase().includes(query);
        const shortCodeMatch = link.shortCode?.toLowerCase().includes(query);
        const customAliasMatch = link.customAlias?.toLowerCase().includes(query);

        return originalUrlMatch || shortCodeMatch || customAliasMatch;
      });
  }, [links, statusFilter, debouncedSearchQuery]);

  // Compute metrics (derived from the full dataset for global visibility)
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  // Filter reset handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Notification trigger helper
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => prev.message === message ? { message: '', type: '' } : prev);
    }, 3000);
  };

  // Status toggle modal actions
  const handleToggleStatusClick = (link) => {
    setStatusModalLink(link);
    setShowStatusModal(true);
  };

  const handleToggleStatusConfirm = async () => {
    if (!statusModalLink) return;
    const targetStatus = !statusModalLink.isActive;
    const linkId = statusModalLink._id;

    setUpdatingStatusLinkId(linkId);
    setShowStatusModal(false);

    try {
      await linkService.updateLinkStatus(linkId, targetStatus);
      triggerNotification(
        `Link ${targetStatus ? 'resumed' : 'paused'} successfully.`,
        'success'
      );
      await fetchLinks(true); // Refetches using standard sync flow
    } catch (err) {
      triggerNotification(
        err.message || 'Unable to update link status.',
        'error'
      );
    } finally {
      setUpdatingStatusLinkId(null);
      setStatusModalLink(null);
    }
  };

  const handleToggleStatusCancel = () => {
    setShowStatusModal(false);
    setStatusModalLink(null);
  };

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

  // Edit action handlers
  const handleStartEdit = (link) => {
    setEditingLinkId(link._id);
    setEditAliasValue(link.customAlias || '');
    setEditError(null);
    setEditSuccessLinkId(null);
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditAliasValue('');
    setEditError(null);
  };

  const handleSaveEdit = async (link) => {
    setSavingLinkId(link._id);
    setEditError(null);
    try {
      await linkService.updateLink(link._id, { customAlias: editAliasValue.trim() || undefined });
      setEditSuccessLinkId(link._id);
      setEditingLinkId(null);
      setEditAliasValue('');
      setTimeout(() => setEditSuccessLinkId(null), 3000);
      await fetchLinks(true);
    } catch (err) {
      setEditError(err.message || 'Failed to update alias');
    } finally {
      setSavingLinkId(null);
    }
  };

  // Delete action handlers
  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    setDeletingLinkId(linkToDelete._id);
    try {
      await linkService.deleteLink(linkToDelete._id);
      setShowDeleteModal(false);
      setLinkToDelete(null);
      await fetchLinks(true);
    } catch (err) {
      setShowDeleteModal(false);
      setLinkToDelete(null);
      triggerNotification(err.message || 'Unable to delete link.', 'error');
    } finally {
      setDeletingLinkId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setLinkToDelete(null);
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
      await fetchLinks(true);
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

          {notification.message && (
            <div className={`form-alert form-alert-${notification.type}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <span>{notification.message}</span>
              <button
                type="button"
                onClick={() => setNotification({ message: '', type: '' })}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold', fontSize: '1rem' }}
              >
                ✕
              </button>
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
              {/* Search & Filter Toolbar */}
              <div className="search-filter-toolbar">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by URL or short code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search short links"
                  />
                  <svg
                    className="search-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <div className="filter-group">
                  <button
                    type="button"
                    className={`btn-filter ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`btn-filter ${statusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={`btn-filter ${statusFilter === 'inactive' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('inactive')}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {filteredLinks.length === 0 ? (
                <EmptyState
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  }
                  title="No search results found"
                  description="We couldn't find any links matching your search query or status filter criteria."
                  action={{
                    label: "Reset search and filters",
                    onClick: handleResetFilters
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
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLinks.map((link) => (
                          <tr key={link._id}>
                            <td>
                              <div className="url-cell" title={link.originalUrl}>
                                {link.originalUrl}
                              </div>
                            </td>
                            <td>
                              <a
                                className="short-url-link"
                                href={getShortUrl(link.shortCode)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {getShortUrl(link.shortCode).replace(/^https?:\/\//, '')}
                              </a>
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
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                  className={`btn-copy ${copiedLinkId === link._id ? 'copied' : ''}`}
                                  onClick={() => handleCopy(link)}
                                  aria-label="Copy short URL to clipboard"
                                  title={copiedLinkId === link._id ? "Copied!" : "Copy URL"}
                                >
                                  {copiedLinkId === link._id ? (
                                    <span className="copy-feedback-text">✓</span>
                                  ) : copyErrorLinkId === link._id ? (
                                    <span className="copy-feedback-error">✗</span>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  className="btn-copy"
                                  onClick={() => handleStartEdit(link)}
                                  aria-label="Edit custom alias"
                                  title="Edit custom alias"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                  </svg>
                                </button>
                                <button
                                  className="btn-copy"
                                  onClick={() => handleToggleStatusClick(link)}
                                  aria-label={link.isActive ? "Pause link" : "Resume link"}
                                  title={link.isActive ? "Pause link" : "Resume link"}
                                >
                                  {link.isActive ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="14" y="4" width="4" height="16" rx="1" />
                                      <rect x="6" y="4" width="4" height="16" rx="1" />
                                    </svg>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="6 3 20 12 6 21 6 3" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  className="btn-copy"
                                  onClick={() => window.location.href = `/analytics/${link._id}`}
                                  aria-label="View analytics"
                                  title="View analytics"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                  </svg>
                                </button>
                                <button
                                  className="btn-copy"
                                  onClick={() => setSelectedQrLink(link)}
                                  aria-label="View QR Code"
                                  title="View QR Code"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="5" height="5" x="3" y="3" rx="1" />
                                    <rect width="5" height="5" x="16" y="3" rx="1" />
                                    <rect width="5" height="5" x="3" y="16" rx="1" />
                                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                                    <path d="M21 21v.01" />
                                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                                    <path d="M12 12v.01" />
                                  </svg>
                                </button>
                                <button
                                  className="btn-copy"
                                  onClick={() => handleDeleteClick(link)}
                                  disabled={deletingLinkId === link._id}
                                  aria-label="Delete link"
                                  title="Delete link"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Link"
        size="small"
      >
        <p style={{ marginBottom: '1.5rem' }}>
          Are you sure you want to delete this link? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={handleDeleteCancel}
            disabled={deletingLinkId !== null}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDeleteConfirm}
            disabled={deletingLinkId !== null}
            style={{ backgroundColor: '#f44336', borderColor: '#f44336' }}
          >
            {deletingLinkId ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      {/* Edit Alias Modal */}
      <Modal
        isOpen={editingLinkId !== null}
        onClose={handleCancelEdit}
        title="Edit Custom Alias"
        size="small"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" htmlFor="edit-alias-input">
            Custom Alias
          </label>
          <input
            id="edit-alias-input"
            className="form-input"
            type="text"
            value={editAliasValue}
            onChange={(e) => setEditAliasValue(e.target.value)}
            placeholder="custom-alias"
            disabled={savingLinkId !== null}
          />
          {editError && (
            <div style={{ color: '#f44336', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {editError}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={handleCancelEdit}
            disabled={savingLinkId !== null}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => editingLink && handleSaveEdit(editingLink)}
            disabled={savingLinkId !== null || !editingLink}
          >
            {savingLinkId ? 'Saving...' : 'Save'}
          </button>
        </div>
      </Modal>

      {/* Status Toggle Confirmation Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={handleToggleStatusCancel}
        title={statusModalLink?.isActive ? "Pause Link?" : "Resume Link?"}
        size="small"
      >
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {statusModalLink?.isActive
            ? "Users will no longer be able to access this short URL until it is resumed."
            : "This short URL will become publicly accessible again."}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={handleToggleStatusCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleToggleStatusConfirm}
            style={{
              backgroundColor: statusModalLink?.isActive ? '#e53e3e' : 'var(--color-accent)',
              borderColor: statusModalLink?.isActive ? '#e53e3e' : 'var(--color-accent)'
            }}
          >
            {statusModalLink?.isActive ? 'Pause Link' : 'Resume Link'}
          </button>
        </div>
      </Modal>

      {/* QR Code Preview Modal */}
      <QRCodeModal
        isOpen={selectedQrLink !== null}
        onClose={() => setSelectedQrLink(null)}
        link={selectedQrLink}
      />
    </div>
  );
}

export default DashboardPage;
