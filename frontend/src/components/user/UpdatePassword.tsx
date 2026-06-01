import React, { useState } from 'react';
import { usersApi } from '../../api/stores.api';
import { validators, getErrorMessage } from '../../utils/validators';

const UpdatePassword: React.FC = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const newPasswordError = validators.password(form.newPassword);

    if (!form.currentPassword) nextErrors.currentPassword = 'Current password is required';
    if (newPasswordError) nextErrors.newPassword = newPasswordError;
    if (form.newPassword !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    setSuccess('');
    try {
      await usersApi.updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setApiError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Update Password</h1>
        <p>Change your account password</p>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        {success && <div className="alert alert-success">{success}</div>}
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              className={errors.currentPassword ? 'error' : ''} />
            {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
          </div>
          <div className="form-group">
            <label>New Password <span style={{ color: 'var(--text3)', fontSize: 11 }}>(8–16 chars, uppercase + special char)</span></label>
            <input type="password" value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className={errors.newPassword ? 'error' : ''} />
            {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className={errors.confirmPassword ? 'error' : ''} />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
