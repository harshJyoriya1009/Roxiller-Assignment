import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  page: string;
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navItems: NavItem[];
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  store_owner: 'Store Owner',
  user: 'User Portal',
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, navItems }) => {
  const { user, logout } = useAuth();
  const roleLabel = user ? roleLabels[user.role] : 'Portal';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>RateStore</h2>
        <span>{roleLabel}</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.page}
            className={`nav-item ${activePage === item.page ? 'active' : ''}`}
            onClick={() => onNavigate(item.page)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Signed in user'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || 'No email'}
          </div>
        </div>
        <button className="btn btn-secondary btn-full btn-sm" onClick={logout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
