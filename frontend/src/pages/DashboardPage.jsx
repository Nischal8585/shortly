import React from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState/EmptyState';

const LinkIcon = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

/**
 * DashboardPage — Renders the link shortening form and link listing placeholders.
 */
function DashboardPage() {
  const { user } = useAuth();

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
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label" htmlFor="url-input">
                  Destination URL
                </label>
                <input
                  className="form-input"
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/very-long-link-path"
                  disabled
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
                  disabled
                />
              </div>
              <button
                className="btn btn-primary"
                type="button"
                style={{ width: '100%' }}
                disabled
              >
                Shorten
              </button>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Note: Backend integration and shortening logic will be unlocked in later phases.
              </p>
            </form>
          </div>
        </section>

        {/* List & Analytics Overview Container */}
        <section style={{ marginBottom: '4rem' }}>
          <EmptyState
            icon={LinkIcon}
            title="You haven't created any short links yet."
            description="Create your first link using the form above to start redirecting traffic and tracking insights."
            action={{
              label: "Create your first link",
              onClick: () => document.getElementById('url-input')?.focus()
            }}
          />
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
