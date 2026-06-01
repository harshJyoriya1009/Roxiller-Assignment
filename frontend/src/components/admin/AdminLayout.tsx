import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminStores from './AdminStores';
import UpdatePassword from '../user/UpdatePassword';

const AdminLayout: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const navItems = [
    {
      page: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      page: 'users',
      label: 'Users',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      page: 'stores',
      label: 'Stores',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      page: 'password',
      label: 'Change Password',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} navItems={navItems} />
      <main className="main-content">
        {activePage === 'users' && <AdminUsers />}
        {activePage === 'stores' && <AdminStores />}
        {activePage === 'password' && <UpdatePassword />}
        {activePage === 'dashboard' && <AdminDashboard />}
      </main>
    </div>
  );
};

export default AdminLayout;
