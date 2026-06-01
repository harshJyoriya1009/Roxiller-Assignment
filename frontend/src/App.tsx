import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AdminLayout from './components/admin/AdminLayout';
import UserLayout from './components/user/UserLayout';
import StoreOwnerLayout from './components/store-owner/StoreOwnerLayout';
import './index.css';

type AuthPage = 'login' | 'register';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>('login');

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <span style={{ color: 'var(--text2)', fontSize: 14 }}>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return authPage === 'register'
      ? <RegisterPage onGoLogin={() => setAuthPage('login')} />
      : <LoginPage onGoRegister={() => setAuthPage('register')} />;
  }

  if (user.role === 'admin') return <AdminLayout />;
  if (user.role === 'store_owner') return <StoreOwnerLayout />;
  return <UserLayout />;
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
