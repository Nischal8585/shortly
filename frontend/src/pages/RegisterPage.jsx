import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import '../components/auth/AuthCard.css';

/* ============================================================
   Validation helpers
   ============================================================ */

const VALIDATORS = {
  fullName: (v) => {
    if (!v.trim()) return 'Full name is required.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    return '';
  },
  confirmPassword: (v, password) => {
    if (!v) return 'Please confirm your password.';
    if (v !== password) return 'Passwords do not match.';
    return '';
  },
};

/* ============================================================
   RegisterPage
   ============================================================ */
function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const nextError =
        name === 'confirmPassword'
          ? VALIDATORS.confirmPassword(value, fields.password)
          : VALIDATORS[name](value);
      setErrors((prev) => ({ ...prev, [name]: nextError }));
    }

    // Re-validate confirmPassword live when password changes
    if (name === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: VALIDATORS.confirmPassword(fields.confirmPassword, value),
      }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextError =
      name === 'confirmPassword'
        ? VALIDATORS.confirmPassword(value, fields.password)
        : VALIDATORS[name](value);
    setErrors((prev) => ({ ...prev, [name]: nextError }));
  }

  function validate() {
    const nextErrors = {
      fullName: VALIDATORS.fullName(fields.fullName),
      email: VALIDATORS.email(fields.email),
      password: VALIDATORS.password(fields.password),
      confirmPassword: VALIDATORS.confirmPassword(fields.confirmPassword, fields.password),
    };
    setErrors(nextErrors);
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    return Object.values(nextErrors).every((e) => !e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmitError('');
    try {
      await register(fields.fullName, fields.email, fields.password);
      setIsLoading(false);
      navigate('/login');
    } catch (err) {
      setSubmitError(err.message || 'Registration failed.');
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout pageTitle="Create Account">
      <AuthCard
        heading="Create your account."
        subheading="Start managing links with precision. No credit card required."
      >
        <form onSubmit={handleSubmit} noValidate aria-label="Create account form">
          {submitError && (
            <div className="auth-alert" role="alert" style={{ marginBottom: '1.25rem' }}>
              {submitError}
            </div>
          )}
          {/* Full Name */}
          <div className="auth-field-group">
            <Input
              label="Full name"
              id="register-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Appleseed"
              value={fields.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName ? errors.fullName : ''}
              disabled={isLoading}
              required
            />
          </div>

          {/* Email */}
          <div className="auth-field-group">
            <Input
              label="Email address"
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              disabled={isLoading}
              required
            />
          </div>

          {/* Password fields grouped side-by-side on desktop */}
          <div className="auth-row-fields">
            {/* Password with strength meter */}
            <div className="auth-field-group">
              <PasswordInput
                label="Password"
                id="register-password"
                name="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ''}
                disabled={isLoading}
                showStrength
                required
                hint="Use 8+ characters with letters, numbers, and symbols."
              />
            </div>

            {/* Confirm Password */}
            <div className="auth-field-group">
              <PasswordInput
                label="Confirm password"
                id="register-confirm-password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={fields.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-divider" role="separator">
          <div className="auth-divider__line" />
          <span className="auth-divider__text">or</span>
          <div className="auth-divider__line" />
        </div>

        <p className="auth-footer-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default RegisterPage;
