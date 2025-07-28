import React from 'react';
import { Cookie, LogOut, LogIn, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Header() {
  const { state, logout } = useApp();

  const handleLoginClick = () => {
    window.location.hash = '#login';
  };

  return (
    <header className="bg-amber-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Cookie className="h-8 w-8 text-amber-200" />
            <h1 className="text-2xl font-bold">DulceEncanto</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {state.currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-amber-200 text-sm">
                  <User className="h-4 w-4" />
                  <span>Hola, {state.currentUser.fullName}</span>
                  {state.currentUser.isAdmin && (
                    <span className="bg-amber-700 px-2 py-1 rounded text-xs">Admin</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 bg-amber-800 hover:bg-amber-700 px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-2 bg-amber-800 hover:bg-amber-700 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}