import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { DashboardStats } from '../../types';
import { getErrorMessage } from '../../utils/validators';

const readNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
};

const readCount = (value: unknown): number | null => {
  if (Array.isArray(value)) return value.length;
  return null;
};

const makeDashboardStats = (dashboardData: any, usersData: unknown, storesData: unknown): DashboardStats => {
  const totalUsers =
    readNumber(dashboardData?.totalUsers)
    ?? readNumber(dashboardData?.userCount)
    ?? readNumber(dashboardData?.usersCount)
    ?? readCount(dashboardData?.users)
    ?? readCount(usersData)
    ?? 0;

  const totalStores =
    readNumber(dashboardData?.totalStores)
    ?? readNumber(dashboardData?.storeCount)
    ?? readNumber(dashboardData?.storesCount)
    ?? readCount(dashboardData?.stores)
    ?? readCount(storesData)
    ?? 0;

  const totalRatings =
    readNumber(dashboardData?.totalRatings)
    ?? readNumber(dashboardData?.ratingCount)
    ?? readNumber(dashboardData?.ratingsCount)
    ?? readCount(dashboardData?.ratings)
    ?? 0;

  return {
    totalUsers,
    totalStores,
    totalRatings,
  };
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardRes, usersRes, storesRes] = await Promise.allSettled([
          adminApi.getDashboard(),
          adminApi.getUsers(),
          adminApi.getStores(),
        ]);

        if (dashboardRes.status === 'rejected' && usersRes.status === 'rejected' && storesRes.status === 'rejected') {
          throw dashboardRes.reason ?? usersRes.reason ?? storesRes.reason;
        }

        setStats(makeDashboardStats(
          dashboardRes.status === 'fulfilled' ? dashboardRes.value.data : null,
          usersRes.status === 'fulfilled' ? usersRes.value.data : null,
          storesRes.status === 'fulfilled' ? storesRes.value.data : null,
        ));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <div style={{ color: 'var(--text2)' }}>Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
    { label: 'Total Stores', value: stats.totalStores, icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )},
    { label: 'Total Ratings', value: stats.totalRatings, icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )},
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of the platform activity</p>
      </div>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value.toLocaleString()}</div>
            <div className="stat-icon">{c.icon}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Quick Actions</h3>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Use the sidebar to manage users, stores, and view platform data. As administrator, you have full access to all platform features.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
