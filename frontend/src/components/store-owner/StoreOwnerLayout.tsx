import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import StoreOwnerDashboard from './StoreOwnerDashboard';
import UpdatePassword from '../user/UpdatePassword';

const StoreOwnerLayout: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const navItems = [
    {
      page: 'dashboard',
      label: 'My Store',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
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
        {activePage === 'password' ? <UpdatePassword /> : <StoreOwnerDashboard />}
      </main>
    </div>
  );
};

export default StoreOwnerLayout;
