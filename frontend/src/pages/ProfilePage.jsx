import React from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import './ProfilePage.css';

const ActivityIcon = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/**
 * ProfilePage — User Profile settings dashboard.
 */
function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  // Guest access check
  if (!isAuthenticated) {
    return (
      <div className="profile-page-guest">
        <Navbar />
        <main className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
          <span className="badge">Access Restricted</span>
          <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Please Sign In</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            You must be logged in to view your profile settings.
          </p>
        </main>
      </div>
    );
  }

  const formatMemberSince = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Determine initials / loading silhouette
  const initials = user?.fullName ? (
    user.fullName.charAt(0).toUpperCase()
  ) : (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const fullNameVal = user ? (
    user.fullName
  ) : (
    <span className="skeleton-text" style={{ width: '220px', height: '2.25rem' }} />
  );

  const emailVal = user ? (
    user.email
  ) : (
    <span className="skeleton-text" style={{ width: '180px', height: '1.1rem', marginTop: '0.2rem' }} />
  );

  // Render Member Since loader if user loading, hide entirely if loaded and no createdAt exists
  const shouldRenderMemberSince = !user || !!user.createdAt;
  const memberSinceVal = user ? (
    formatMemberSince(user.createdAt)
  ) : (
    <span className="skeleton-text" style={{ width: '120px', height: '1rem' }} />
  );

  return (
    <div className="profile-page">
      <Navbar />

      <main className="container profile-container">
        
        {/* Visual profile header */}
        <section className="profile-hero">
          <div className="profile-hero__avatar" style={!user ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : undefined}>
            {initials}
          </div>
          <div className="profile-hero__meta">
            <h1 className="profile-hero__name" style={!user ? { height: '2.5rem', margin: '0.4rem 0 0' } : undefined}>{fullNameVal}</h1>
            <p className="profile-hero__email">{emailVal}</p>
          </div>
        </section>

        {/* Details Grid */}
        <section className="profile-grid">
          
          {/* Account information */}
          <div className="card profile-card">
            <h2 className="profile-card__title">Account Information</h2>
            
            <div className="profile-details-list">
              <div className="profile-detail-item">
                <span className="profile-detail-item__label">Full Name</span>
                <span className="profile-detail-item__value">{fullNameVal}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-item__label">Email Address</span>
                <span className="profile-detail-item__value">{emailVal}</span>
              </div>
              {shouldRenderMemberSince && (
                <div className="profile-detail-item">
                  <span className="profile-detail-item__label">Member Since</span>
                  <span className="profile-detail-item__value">{memberSinceVal}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent activity empty state */}
          <div className="card profile-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="profile-card__title" style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <EmptyState
                icon={ActivityIcon}
                title="No activity yet."
                description="Create your first short link to get started."
              />
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default ProfilePage;
