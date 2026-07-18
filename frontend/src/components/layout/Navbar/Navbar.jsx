import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import MobileMenu from '../MobileMenu/MobileMenu';
import './Navbar.css';

/**
 * Reusable Navbar Component for public & authenticated pages.
 */
function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="global-navbar" role="navigation" aria-label="Main Navigation">
      <div className="global-navbar__container">
        
        {/* Left Side: Logo */}
        <Link to="/" className="global-navbar__logo logo" aria-label="Shortly Home">
          Shortly
          <div className="logo-dot" aria-hidden="true" />
        </Link>

        {/* Middle Navigation (Visible on Desktop / Tablets Landscape) */}
        <div className="global-navbar__mid">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `global-navbar__link ${isActive ? 'global-navbar__link--active' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `global-navbar__link ${isActive ? 'global-navbar__link--active' : ''}`
            }
          >
            Analytics
          </NavLink>
          <a href="#docs" className="global-navbar__link">
            Documentation
          </a>
        </div>

        {/* Right Side: Auth States */}
        <div className="global-navbar__right">
          {!isAuthenticated ? (
            <div className="global-navbar__guest-actions">
              <NavLink to="/login" className="global-navbar__link global-navbar__link--bold">
                Sign In
              </NavLink>
              <NavLink to="/register" className="btn btn-secondary global-navbar__btn-cta">
                Create Account
              </NavLink>
            </div>
          ) : (
            <div className="global-navbar__user-actions">
              
              {/* Avatar trigger */}
              <div className="global-navbar__avatar-container">
                <button
                  className="global-navbar__avatar"
                  aria-label="Open user profile options"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {user?.fullName || user?.name ? (
                    (user.fullName || user.name).charAt(0).toUpperCase()
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </button>
                {dropdownOpen && (
                  <ProfileDropdown onClose={() => setDropdownOpen(false)} />
                )}
              </div>

            </div>
          )}

          {/* Hamburger trigger for mobile menu */}
          <button
            className="global-navbar__menu-btn"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </nav>
  );
}

export default Navbar;
