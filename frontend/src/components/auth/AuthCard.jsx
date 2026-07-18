import React from 'react';
import './AuthCard.css';

/**
 * AuthCard — White card surface with consistent padding.
 * Renders the heading block + form slot.
 *
 * @param {object}          props
 * @param {string}          props.heading       - Primary heading ("Welcome Back")
 * @param {string}          [props.subheading]  - Supporting text below heading
 * @param {React.ReactNode} props.children      - Form content
 */
function AuthCard({ heading, subheading, children }) {
  return (
    <div className="auth-card">
      <div className="auth-card__identity">
        <h1 className="auth-card__heading">{heading}</h1>
        {subheading && <p className="auth-card__subheading">{subheading}</p>}
      </div>

      <div className="auth-card__body">{children}</div>
    </div>
  );
}

export default AuthCard;
