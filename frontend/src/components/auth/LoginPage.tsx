import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import { validators, getErrorMessage } from '../../utils/validators';
import { LoginRequest } from '../../types';

interface LoginPageProps {
  onGoRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoRegister }) => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginRequest>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof LoginRequest, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const emailError = validators.email(credentials.email);
    if (emailError) nextErrors.email = emailError;
    if (!credentials.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await authApi.login(credentials);
      login(res.data.access_token, res.data.user);
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to your account to continue</p>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email" value={credentials.email} onChange={(e) => updateField('email', e.target.value)}
              className={errors.email ? 'error' : ''} placeholder="you@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" value={credentials.password} onChange={(e) => updateField('password', e.target.value)}
              className={errors.password ? 'error' : ''} placeholder="Enter your password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
          Don't have an account?{' '}
          <button onClick={onGoRegister} style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
