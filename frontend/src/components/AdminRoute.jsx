// Import React, navigation utilities, and authentication state.
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// AdminRoute restricts access to users with admin privileges.
const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating administrator access..." />;
  }

  // Redirect unauthenticated users to admin login portal.
  if (!user) {
    return <Navigate to="/login/admin" replace />;
  }

  // Redirect regular users to their dashboard.
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// Export AdminRoute component.
export default AdminRoute;
