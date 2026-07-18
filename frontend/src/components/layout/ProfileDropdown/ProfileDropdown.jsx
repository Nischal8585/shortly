import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './ProfileDropdown.css';

/**
 * ProfileDropdown — Dropdown revealed by clicking user avatar.
 *
 * @param {object}   props
 * @param {function} props.onClose - Triggered to close the dropdown
 */
function ProfileDropdown({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Esc closes dropdown
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside closes dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  function handleLogout() {
    logout();
    onClose();
    navigate('/');
  }

  return (
    <div
      className="profile-dropdown"
      ref={dropdownRef}
      role="menu"
      aria-label="User profile options"
    >
      <div className="profile-dropdown__header">
        {user ? (
          <>
            <span className="profile-dropdown__name">{user.fullName || user.name}</span>
            <span className="profile-dropdown__email">{user.email}</span>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', padding: '0.2rem 0' }}>
            <div className="skeleton-text" style={{ width: '70%', height: '0.85rem' }} />
            <div className="skeleton-text" style={{ width: '90%', height: '0.7rem' }} />
          </div>
        )}
      </div>

      <div className="profile-dropdown__divider" role="separator" />

      <Link
        to="/profile"
        className="profile-dropdown__item"
        role="menuitem"
        onClick={onClose}
      >
        My Profile
      </Link>

      <Link
        to="/dashboard"
        className="profile-dropdown__item"
        role="menuitem"
        onClick={onClose}
      >
        Dashboard
      </Link>

      <div className="profile-dropdown__divider" role="separator" />

      <button
        className="profile-dropdown__item profile-dropdown__item--logout"
        role="menuitem"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileDropdown;
