import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('shortly_auth_token');
      if (token) {
        setIsAuthenticated(true);
        setUser(null);
        
        // TODO: GET /api/auth/me integration goes here to fetch fresh user profile data
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setAuthLoading(false);
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { token, user: backendUser } = response.data;
      
      // Persist ONLY token in localStorage
      localStorage.setItem('shortly_auth_token', token);
      
      setUser(backendUser);
      setIsAuthenticated(true);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    // Call registration endpoint (does not return token/session)
    const response = await authService.register({ fullName, email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('shortly_auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
