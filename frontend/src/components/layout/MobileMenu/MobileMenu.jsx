import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './MobileMenu.css';

/**
 * MobileMenu — Slide overlay navigation for mobile screen widths.
 *
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {function} props.onClose
 */
function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  function handleLogout() {
    logout();
    onClose();
    navigate('/');
  }

  return (
    <div className="mobile-menu" id="auth-mobile-nav" role="dialog" aria-label="Mobile navigation menu">
      <div className="mobile-menu__backdrop" onClick={onClose} />
      <div className="mobile-menu__content">
        <div className="mobile-menu__links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
            }
            onClick={onClose}
          >
            Dashboard
          </NavLink>
          
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
            }
            onClick={onClose}
          >
            Analytics
          </NavLink>

          <a href="#docs" className="mobile-menu__link" onClick={onClose}>
            Documentation
          </a>

          <div className="mobile-menu__divider" />

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="mobile-menu__link mobile-menu__link--auth"
                onClick={onClose}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="mobile-menu__link mobile-menu__link--cta"
                onClick={onClose}
              >
                Create Account
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
                }
                onClick={onClose}
              >
                My Profile
              </NavLink>
              <button
                className="mobile-menu__link mobile-menu__link--logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
