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
};

/* ============================================================
   LoginPage
   ============================================================ */
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](value) }));
  }

  function validate() {
    const nextErrors = {
      email: VALIDATORS.email(fields.email),
      password: VALIDATORS.password(fields.password),
    };
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    return !nextErrors.email && !nextErrors.password;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmitError('');
    try {
      await login(fields.email, fields.password);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.message || 'Invalid email or password.');
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout pageTitle="Sign In">
      <AuthCard
        heading="Welcome back."
        subheading="Sign in to your Shortly account to manage your links."
      >
        <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
          {submitError && (
            <div className="auth-alert" role="alert" style={{ marginBottom: '1.25rem' }}>
              {submitError}
            </div>
          )}
          {/* Email */}
          <div className="auth-field-group">
            <Input
              label="Email address"
              id="login-email"
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

          {/* Password */}
          <div className="auth-field-group">
            <PasswordInput
              label="Password"
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={fields.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-divider" role="separator">
          <div className="auth-divider__line" />
          <span className="auth-divider__text">or</span>
          <div className="auth-divider__line" />
        </div>

        <p className="auth-footer-link">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create account</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;
