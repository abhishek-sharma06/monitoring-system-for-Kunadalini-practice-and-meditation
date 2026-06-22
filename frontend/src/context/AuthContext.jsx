import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          sessionStorage.removeItem('token');
        }
      } catch (error) {
        // If the server is unreachable or returns an error, clear the stale token
        sessionStorage.removeItem('token');
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = (token, userData) => {
    sessionStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
