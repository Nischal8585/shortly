import React, { useId } from 'react';
import './Input.css';

/**
 * Reusable Input field with label, error, and hint support.
 *
 * @param {object}  props
 * @param {string}  props.label          - Visible label text
 * @param {string}  [props.error]        - Validation error message
 * @param {string}  [props.hint]         - Helper text below input
 * @param {string}  [props.id]           - Optional explicit id (auto-generated if omitted)
 * @param {boolean} [props.required]
 */
const Input = React.forwardRef(function Input(
  { label, error, hint, id: idProp, required = false, className = '', ...rest },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;

  return (
    <div className={`ui-input-group ${error ? 'ui-input-group--error' : ''} ${className}`}>
      {label && (
        <label className="ui-input-label" htmlFor={id}>
          {label}
          {required && <span className="ui-input-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className="ui-input"
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        required={required}
        {...rest}
      />
      <div className="ui-input-message-slot">
        {error ? (
          <p id={`${id}-error`} className="ui-input-message ui-input-message--error" role="alert">
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

export default Input;
