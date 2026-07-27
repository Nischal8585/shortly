import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import linkService from '../services/linkService';
import userService from '../services/userService';
import { getShortUrl } from '../utils/linkUtils';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { formatPhoneNumber, isValidPhoneNumber } from '../utils/phoneUtils';
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
  const { user, isAuthenticated, setUser } = useAuth();
  const [recentLinks, setRecentLinks] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  // Profile Edit State Hooks
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({ fullName: '', phoneNumber: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  useEffect(() => {
    async function fetchActivity() {
      if (!isAuthenticated) return;
      try {
        const response = await linkService.getLinks();
        const linksList = response.data || [];
        // Take the 5 most recent links
        setRecentLinks(linksList.slice(0, 5));
      } catch (err) {
        console.error('Failed to load recent activity:', err);
      } finally {
        setIsLoadingActivity(false);
      }
    }
    fetchActivity();
  }, [isAuthenticated]);

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

  const formatActivityDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => prev.message === message ? { message: '', type: '' } : prev);
    }, 3000);
  };

  const handleCancel = () => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditPhoneNumber(user.phoneNumber || '');
    }
    setErrors({ fullName: '', phoneNumber: '' });
    setIsEditing(false);
  };

  const isPhoneInvalid = editPhoneNumber && editPhoneNumber.trim() !== '' && !isValidPhoneNumber(editPhoneNumber);
  const isSaveDisabled = isSaving || !editFullName.trim() || isPhoneInvalid;

  const handleSave = async () => {
    if (isSaveDisabled) return;

    setIsSaving(true);
    setErrors({ fullName: '', phoneNumber: '' });
    try {
      const response = await userService.updateProfile({
        fullName: editFullName.trim(),
        phoneNumber: editPhoneNumber ? editPhoneNumber.trim() : null
      });

      setUser(response.data);
      triggerNotification('Your profile has been updated successfully.', 'success');
      setIsEditing(false);
    } catch (err) {
      triggerNotification(err.message || 'Profile update failed.', 'error');
    } finally {
      setIsSaving(false);
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
        {notification.message && (
          <div className={`form-alert form-alert-${notification.type}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
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
              {/* Full Name */}
              <div className="profile-detail-item">
                <span className="profile-detail-item__label">Full Name</span>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      className="form-input"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Full Name"
                      disabled={isSaving}
                      style={{ marginTop: '0.25rem' }}
                    />
                    {errors.fullName && (
                      <span className="error-text" style={{ color: '#c84b31', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 500 }}>
                        {errors.fullName}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="profile-detail-item__value">{fullNameVal}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="profile-detail-item">
                <span className="profile-detail-item__label">Email Address</span>
                <span className="profile-detail-item__value">{emailVal}</span>
              </div>

              {/* Phone Number */}
              <div className="profile-detail-item">
                <span className="profile-detail-item__label">Phone Number</span>
                {isEditing ? (
                  <>
                    <PhoneInput
                      placeholder="Phone Number (optional)"
                      value={editPhoneNumber}
                      onChange={setEditPhoneNumber}
                      defaultCountry="IN"
                      disabled={isSaving}
                      style={{ marginTop: '0.25rem' }}
                    />
                    {isPhoneInvalid && (
                      <span className="error-text" style={{ color: '#c84b31', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 500 }}>
                        Please enter a valid international phone number
                      </span>
                    )}
                    {errors.phoneNumber && !isPhoneInvalid && (
                      <span className="error-text" style={{ color: '#c84b31', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 500 }}>
                        {errors.phoneNumber}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="profile-detail-item__value">
                    {user?.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'Not provided'}
                  </span>
                )}
              </div>

              {/* Member Since */}
              {shouldRenderMemberSince && (
                <div className="profile-detail-item">
                  <span className="profile-detail-item__label">Member Since</span>
                  <span className="profile-detail-item__value">{memberSinceVal}</span>
                </div>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    style={{ flex: 1 }}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                  style={{ width: '100%' }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Recent activity section */}
          <div className="card profile-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="profile-card__title" style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            {isLoadingActivity ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                Loading activity...
              </div>
            ) : recentLinks.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <EmptyState
                  icon={ActivityIcon}
                  title="No activity yet."
                  description="Create your first short link to get started."
                />
              </div>
            ) : (
              <div className="profile-activity-list">
                {recentLinks.map((link) => (
                  <div className="profile-activity-item" key={link._id}>
                    <div className="profile-activity-item__meta">
                      <span className="profile-activity-item__action">Link Created</span>
                      <span className="profile-activity-item__time">
                        {formatActivityDate(link.createdAt)}
                      </span>
                    </div>
                    <div className="profile-activity-item__detail">
                      Created short link <strong>{getShortUrl(link.shortCode).replace(/^https?:\/\//, '')}</strong> pointing to {link.originalUrl}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

      </main>
    </div>
  );
}

export default ProfilePage;
