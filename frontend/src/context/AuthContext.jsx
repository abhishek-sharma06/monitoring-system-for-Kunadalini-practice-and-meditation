// Import React hooks, contexts, and axios client.
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-verify and restore session on application load.
  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          logout();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Save token, user data, and update context state.
  const login = (token, userData) => {
    sessionStorage.setItem('token', token);
    setUser(userData);
  };

  // Clear session storage and reset context state.
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
