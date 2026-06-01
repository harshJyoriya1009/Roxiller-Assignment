import React, { useState } from 'react';
import { authApi } from '../../api/auth.api';
import { validators, getErrorMessage } from '../../utils/validators';
import { RegisterRequest } from '../../types';

interface RegisterPageProps {
  onGoLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onGoLogin }) => {
  const [form, setForm] = useState<RegisterRequest>({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof RegisterRequest, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const nameError = validators.name(form.name);
    const emailError = validators.email(form.email);
    const passwordError = validators.password(form.password);
    const addressError = validators.address(form.address);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (!form.address) nextErrors.address = 'Address is required';
    if (addressError) nextErrors.address = addressError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await authApi.register(form);
      setSuccess(true);
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1>Account Created!</h1>
        <p className="subtitle">Your account has been created successfully. You can now log in.</p>
        <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={onGoLogin}>Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2>RateStore</h2>
        </div>
        <h1>Create account</h1>
        <p className="subtitle">Join to start rating stores</p>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name <span style={{ color: 'var(--text3)', fontSize: 11 }}>(2–60 chars)</span></label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
              className={errors.name ? 'error' : ''} placeholder="Enter your full name" />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
              className={errors.email ? 'error' : ''} placeholder="you@example.com" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password <span style={{ color: 'var(--text3)', fontSize: 11 }}>(8–16 chars, 1 uppercase, 1 special)</span></label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)}
              className={errors.password ? 'error' : ''} placeholder="Choose a strong password" />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)}
              className={errors.address ? 'error' : ''} placeholder="Your address" />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating account...</> : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
          Already have an account?{' '}
          <button onClick={onGoLogin} style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
