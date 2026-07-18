import React from 'react';
import './EmptyState.css';

/**
 * EmptyState — A reusable component representing clean, solid-bordered empty panels.
 *
 * @param {object}   props
 * @param {ReactNode} props.icon - SVG React icon
 * @param {string}   props.title - Primary alert title
 * @param {string}   props.description - Explanatory message
 * @param {object}   [props.action] - Optional action block { label, onClick }
 */
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state" role="status" aria-label={title}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && (
        <button
          className="btn btn-secondary empty-state__action"
          type="button"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
