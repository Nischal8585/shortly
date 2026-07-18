import React, { useState, useId } from 'react';
import './PasswordInput.css';

/**
 * Password input with show/hide toggle and optional strength indicator.
 *
 * @param {object}  props
 * @param {string}  props.label
 * @param {string}  [props.error]
 * @param {string}  [props.hint]
 * @param {string}  [props.id]
 * @param {boolean} [props.showStrength=false] - Render password strength meter
 * @param {boolean} [props.required=false]
 * @param {string}  [props.value]              - Controlled value for strength calculation
 */
const PasswordInput = React.forwardRef(function PasswordInput(
  {
    label,
    error,
    hint,
    id: idProp,
    showStrength = false,
    required = false,
    className = '',
    value = '',
    ...rest
  },
  ref
) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const id = idProp || autoId;

  // -- Password strength calculation --
  const strength = React.useMemo(() => {
    if (!showStrength || !value) return { score: 0, label: '', bars: 0 };

    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++; 
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = [
      { min: 0, bars: 0, label: '' },
      { min: 1, bars: 1, label: 'Weak' },
      { min: 2, bars: 2, label: 'Fair' },
      { min: 3, bars: 3, label: 'Good' },
      { min: 5, bars: 4, label: 'Strong' },
    ];

    const level = [...levels].reverse().find((l) => score >= l.min) || levels[0];
    return { score, bars: level.bars, label: level.label };
  }, [value, showStrength]);

  const strengthClass = ['', 'weak', 'fair', 'good', 'strong'][strength.bars] || '';

  // Determine what message to show in the reserved slot below the field.
  // Priority: error > (strength meter if showStrength) > hint
  const showMessage = error || hint;
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div
      className={`ui-input-group ui-pw-group ${
        error ? 'ui-input-group--error' : ''
      } ${className}`}
    >
      {label && (
        <label className="ui-input-label" htmlFor={id}>
          {label}
          {required && (
            <span className="ui-input-required" aria-hidden="true"> *</span>
          )}
        </label>
      )}

      {/* Input + Toggle wrapper */}
      <div className="ui-pw-wrapper">
        <input
          ref={ref}
          id={id}
          type={visible ? 'text' : 'password'}
          className="ui-input ui-pw-input"
          aria-invalid={!!error}
          aria-describedby={messageId}
          required={required}
          value={value}
          {...rest}
        />
        <button
          type="button"
          className="ui-pw-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {/* Strength meter — always rendered when showStrength, uses visibility
          so the reserved height never collapses and causes layout shifts. */}
      {showStrength && (
        <div
          id={!error && !hint ? `${id}-strength` : undefined}
          className={`ui-pw-strength ${!value ? 'ui-pw-strength--empty' : ''}`}
          aria-live="polite"
          aria-label={value ? `Password strength: ${strength.label || 'very weak'}` : undefined}
        >
          <div className={`ui-pw-bars ui-pw-bars--${strengthClass}`}>
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`ui-pw-bar ${strength.bars >= bar ? 'ui-pw-bar--filled' : ''}`}
              />
            ))}
          </div>
          <span
            className={`ui-pw-strength-label ui-pw-strength-label--${strengthClass}`}
            aria-hidden="true"
          >
            {strength.label}
          </span>
        </div>
      )}

      {/* Error or hint — reserved slot with min-height to prevent layout shift */}
      <div className="ui-pw-message-slot">
        {error ? (
          <p
            id={`${id}-error`}
            className="ui-input-message ui-input-message--error"
            role="alert"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="ui-input-message ui-input-message--hint">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
});

/* -- SVG icon helpers --------------------------------------- */
function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default PasswordInput;
