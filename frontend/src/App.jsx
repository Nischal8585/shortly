import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar/Navbar';

// -- Lazy-load pages (improves initial bundle sizes) ----------------
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

// -- Loading fallback (matches background so no flash) ---------------
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
      }}
      aria-label="Loading page"
    />
  );
}

// -- Protected Route Guard -------------------------------------------
function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) {
    return <PageLoader />;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// -- HomePage (Landing page with public hero, using reusable Navbar) --
function HomePage() {
  return (
    <div>
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
            <LinkToDashboardButton />
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

        {/* List & Analytics Overview Container (Placeholders) */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="placeholder-section">
            <h3>Your shortened links will appear here</h3>
            <p style={{ marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 0' }}>
              A neat list of your active short codes, click count statistics, and easy copy
              actions will render in this grid.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

// Small helper component to toggle CTA based on Auth status
function LinkToDashboardButton() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return (
      <NavigateToDashboardLink />
    );
  }
  return (
    <a
      href="#url-input"
      className="btn btn-secondary"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('url-input')?.focus();
      }}
    >
      Create Link
    </a>
  );
}

function NavigateToDashboardLink() {
  return (
    <Navigate to="/dashboard" replace />
  );
}

/* ============================================================
   App — Root Wrapper with React Router + AuthContext
   ============================================================ */
function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Authenticated Routes protected by guard */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
