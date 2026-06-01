import React, { useEffect, useState } from 'react';
import { storeOwnerApi } from '../../api/stores.api';
import { StoreOwnerDashboard as DashboardType } from '../../types';
import { getErrorMessage } from '../../utils/validators';
import StarRating from '../common/StarRating';
import SortableHeader from '../common/SortableHeader';

const StoreOwnerDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    storeOwnerApi.getDashboard()
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text2)' }}>Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!dashboard) return null;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((current) => (current === 'ASC' ? 'DESC' : 'ASC'));
      return;
    }

    setSortBy(field);
    setSortOrder('ASC');
  };

  const sortedRaters = [...(dashboard.raters || [])].sort((a, b) => {
    const direction = sortOrder === 'ASC' ? 1 : -1;
    if (sortBy === 'value') return (a.value - b.value) * direction;
    if (sortBy === 'userName') return (a.userName || '').localeCompare(b.userName || '') * direction;
    return (new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime()) * direction;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Store Dashboard</h1>
        <p>Overview of your store performance</p>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 600 }}>
        <div className="stat-card">
          <div className="stat-label">Average Rating</div>
          <div className="stat-value">{dashboard.averageRating.toFixed(1)}</div>
          <div style={{ marginTop: 8 }}>
            <StarRating value={Math.round(dashboard.averageRating)} readonly size={16} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Ratings</div>
          <div className="stat-value">{dashboard.totalRatings}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4 }}>{dashboard.store.name}</h3>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>{dashboard.store.address || 'No address set'}</p>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>{dashboard.store.email}</p>
      </div>

      <div className="page-header" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20 }}>Ratings Submitted</h2>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          {sortedRaters.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <h3>No ratings yet</h3>
              <p>Your store hasn't received any ratings yet</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <SortableHeader label="Customer Name" field="userName" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th>Email</th>
                  <SortableHeader label="Rating" field="value" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Date" field="submittedAt" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedRaters.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.userName}</td>
                    <td style={{ color: 'var(--text2)' }}>{r.userEmail}</td>
                    <td>
                      <div className="rating-display">
                        <StarRating value={r.value} readonly size={14} />
                        <span style={{ fontWeight: 600 }}>{r.value}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text2)', fontSize: 13 }}>
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
