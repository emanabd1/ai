
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { AdminPage } from './components/AdminPage';
import { AuthPage } from './components/AuthPage';
import { authService } from './services/authService';
import { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'admin' | 'auth' | 'monitor'>('landing');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const navigateTo = (page: 'landing' | 'admin' | 'auth' | 'monitor') => {
    setCurrentPage(page);
  };

  if (isInitializing) return null;

  if (!currentUser && currentPage !== 'landing') {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      onNavigate={navigateTo}
      currentPage={currentPage}
    >
      {currentPage === 'landing' && (
        <LandingPage 
          onNavigate={navigateTo} 
          openChat={() => {}} // Widget is always available or handled in Layout
        />
      )}
      {currentPage === 'admin' && <AdminPage />}
      {currentPage === 'auth' && <AuthPage onLoginSuccess={handleLoginSuccess} />}
    </Layout>
  );
};

export default App;
