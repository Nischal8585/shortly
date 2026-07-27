import React from 'react';
import './Modal.css';

/**
 * Reusable Modal component for confirmations and dialogs.
 *
 * @param {object}  props
 * @param {boolean}           props.isOpen
 * @param {Function}          props.onClose
 * @param {string}            props.title
 * @param {React.ReactNode}   props.children
 * @param {string}            [props.size='md']
 */
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const titleId = React.useId();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={`modal-content modal-content--${size}`}>
        <div className="modal-header">
          <h2 className="modal-title" id={titleId}>{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
