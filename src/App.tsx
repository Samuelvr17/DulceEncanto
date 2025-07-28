import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderForm } from './components/OrderForm';
import { ClientDashboard } from './components/ClientDashboard';

type View = 'home' | 'order' | 'login' | 'register' | 'admin' | 'client';

function AppContent() {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState<View>('home');

  // Handle navigation from hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'order') setCurrentView('order');
      else if (hash === 'login') setCurrentView('login');
      else if (hash === 'register') setCurrentView('register');
      else if (hash === 'admin') setCurrentView('admin');
      else if (hash === 'client') setCurrentView('client');
      else setCurrentView('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-redirect users to their respective dashboards when logged in
  React.useEffect(() => {
    if (state.currentUser && currentView === 'home') {
      if (state.currentUser.isAdmin) {
        setCurrentView('admin');
        window.location.hash = '#admin';
      } else {
        setCurrentView('client');
        window.location.hash = '#client';
      }
    }
  }, [state.currentUser, currentView]);

  const renderContent = () => {
    if (currentView === 'login') {
      return <LoginForm />;
    }
    
    if (currentView === 'register') {
      return <RegisterForm />;
    }
    
    if (currentView === 'admin') {
      return state.isAdminLoggedIn ? <AdminDashboard /> : <LoginForm />;
    }
    
    if (currentView === 'client') {
      return state.currentUser && !state.currentUser.isAdmin ? <ClientDashboard /> : <LoginForm />;
    }
    
    if (currentView === 'order') {
      return <OrderForm />;
    }
    
    return <HomeScreen />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderContent()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;