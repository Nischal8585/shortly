import React from 'react';
import './Button.css';

/**
 * Reusable Button component.
 *
 * @param {object}  props
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'}               [props.size='md']
 * @param {boolean}                       [props.loading=false]
 * @param {boolean}                       [props.disabled=false]
 * @param {boolean}                       [props.fullWidth=false]
 * @param {'button'|'submit'|'reset'}     [props.type='button']
 * @param {React.ReactNode}               props.children
 */
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const isDisabled = disabled || loading;

  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--full' : '',
    loading ? 'ui-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="ui-btn__spinner" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="28"
              strokeDashoffset="10"
            />
          </svg>
        </span>
      )}
      <span className="ui-btn__label">{children}</span>
    </button>
  );
}

export default Button;
