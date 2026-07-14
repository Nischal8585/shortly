import React, { useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-container">
          <div className="logo">
            Shortly
            <div className="logo-dot"></div>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${currentView === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentView('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        {currentView === 'dashboard' ? (
          <div>
            {/* Hero Section (Asymmetrical) */}
            <section className="hero">
              <div className="hero-content">
                <span className="badge">Phase 1 Foundation</span>
                <h1>Deliberately designed short links.</h1>
                <p>
                  Shortly provides robust redirection and deep link insights without 
                  the generic templates. Keep control of your traffic with clean, responsive composition.
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
                    <label className="form-label" htmlFor="url-input">Destination URL</label>
                    <input 
                      className="form-input" 
                      id="url-input" 
                      type="url" 
                      placeholder="https://example.com/very-long-link-path" 
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="custom-alias">Custom Alias (Optional)</label>
                    <input 
                      className="form-input" 
                      id="custom-alias" 
                      type="text" 
                      placeholder="custom-short-slug" 
                      disabled
                    />
                  </div>
                  <button className="btn btn-primary" type="button" style={{ width: '100%' }} disabled>
                    Shorten
                  </button>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.8rem', textAlign: 'center' }}>
                    Note: Backend integration and shortening logic will be unlocked in later phases.
                  </p>
                </form>
              </div>
            </section>

            {/* List & Analytics Overview Container (Placeholders) */}
            <section style={{ marginBottom: '4rem' }}>
              <div className="placeholder-section">
                <h3>Your shortened links will appear here</h3>
                <p style={{ marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 0' }}>
                  A neat list of your active short codes, click count statistics, and easy copy actions will render in this grid.
                </p>
              </div>
            </section>
          </div>
        ) : (
          /* Analytics Placeholder Page */
          <div style={{ padding: 'var(--spacing-xl) 0' }}>
            <span className="badge">Future Module</span>
            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Detailed Analytics Overview</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '600px' }}>
              Deep-dive metrics including referrers, browser breakdown, and traffic trends will be built in the analytics phase.
            </p>
            <div className="placeholder-section">
              <h3>Analytics Dashboard Locked</h3>
              <p style={{ marginTop: '0.5rem' }}>
                This panel is a placeholder. Click data tracking and logging logic is reserved for Phase 2.
              </p>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '1.5rem' }}
                onClick={() => setCurrentView('dashboard')}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
