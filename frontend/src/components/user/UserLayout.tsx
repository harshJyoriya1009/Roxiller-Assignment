import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import UserStores from './UserStores';
import UpdatePassword from './UpdatePassword';

const UserLayout = () => {
  const [activePage, setActivePage] = useState('stores');

  const menuItems = [
    {
      page: 'stores',
      label: 'Browse Stores',
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
      <Sidebar activePage={activePage} onNavigate={setActivePage} navItems={menuItems} />
      <main className="main-content">
        {activePage === 'password' ? <UpdatePassword /> : <UserStores />}
      </main>
    </div>
  );
};

export default UserLayout;
