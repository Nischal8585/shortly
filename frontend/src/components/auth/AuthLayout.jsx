import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AuthLayout.css';

/**
 * AuthLayout — Redesigned Two-Column layout.
 *
 * @param {object}          props
 * @param {React.ReactNode} props.children
 * @param {string}          props.pageTitle  - Used for document <title>
 */
function AuthLayout({ children, pageTitle }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    document.title = `${pageTitle} — Shortly`;
    return () => {
      document.title = 'Shortly — High Performance Link Management';
    };
  }, [pageTitle]);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navItems = [
    { label: 'Back to Home', href: '/' },
    { label: 'Documentation', href: '#docs' },
  ];

  return (
    <div className="auth-layout">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="auth-layout__header" role="banner">
        <div className="auth-layout__header-inner">

          <Link
            to="/"
            className="auth-layout__logo logo"
            aria-label="Shortly — go to homepage"
          >
            Shortly
            <div className="logo-dot" aria-hidden="true" />
          </Link>

          {/* Desktop nav */}
          <nav className="auth-layout__nav" aria-label="Site navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="auth-layout__nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="auth-layout__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="auth-mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="auth-layout__menu-icon" aria-hidden="true">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <nav
            id="auth-mobile-nav"
            className="auth-layout__mobile-nav"
            aria-label="Mobile site navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="auth-layout__mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* ── Body: two columns ──────────────────────────────────── */}
      <div className="auth-layout__body">

        {/* LEFT — Brand panel */}
        <aside className="auth-panel" aria-label="Shortly platform features">
          <div className="auth-panel__inner">

            <p className="auth-panel__eyebrow">SECURE INFRASTRUCTURE</p>

            <h2 className="auth-panel__heading">
              Scale your routing pipeline.
            </h2>

            <p className="auth-panel__body">
              A high-performance link management platform engineered for latency-sensitive applications.
            </p>

            {/* Redesigned Features Grid with Custom SVG Icons */}
            <div className="auth-panel__features" role="list">
              
              {/* Feature 1 */}
              <div className="auth-feature-row" role="listitem">
                <div className="auth-feature-row__icon-container" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="auth-feature-row__content">
                  <h3 className="auth-feature-row__title">Domain Isolation</h3>
                  <p className="auth-feature-row__desc">Deploy custom short domains to increase authority.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="auth-feature-row" role="listitem">
                <div className="auth-feature-row__icon-container" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="auth-feature-row__content">
                  <h3 className="auth-feature-row__title">Instant Telemetry</h3>
                  <p className="auth-feature-row__desc">Audit click details and referrers in real time.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="auth-feature-row" role="listitem">
                <div className="auth-feature-row__icon-container" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="auth-feature-row__content">
                  <h3 className="auth-feature-row__title">Developer APIs</h3>
                  <p className="auth-feature-row__desc">Integrate link orchestration into existing workflows.</p>
                </div>
              </div>

            </div>

            {/* Redesigned Compact Trust Section (Stats) */}
            <div className="auth-trust">
              <div className="auth-trust-item">
                <span className="auth-trust-item__value">99.99%</span>
                <span className="auth-trust-item__label">Uptime SLA</span>
              </div>
              <div className="auth-trust-item">
                <span className="auth-trust-item__value">&lt; 10ms</span>
                <span className="auth-trust-item__label">Redirection Latency</span>
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT — Form area */}
        <main
          className="auth-layout__main"
          id="main-content"
          aria-label="Authentication"
        >
          {children}
        </main>
      </div>

    </div>
  );
}

export default AuthLayout;
