// Import React and routing dependencies.
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Import Public Pages.
import Landing from './pages/Landing';
import Register from './pages/Register';
import LoginSelect from './pages/LoginSelect';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Import Protected User Pages.
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import LogSession from './pages/LogSession';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Chatbot from './pages/Chatbot';
import ProgramSelection from './pages/ProgramSelection';
import ProgramOverview from './pages/ProgramOverview';
import DayFlow from './pages/DayFlow';

// Import Admin Pages.
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';

// Main App component assembling layout structures.
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Landing />} />

              {/* Auth — Role Selector */}
              <Route path="/login" element={<LoginSelect />} />

              {/* Auth — Separate portals */}
              <Route path="/login/user"  element={<UserLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />

              {/* Auth — Registration & recovery */}
              <Route path="/register"        element={<Register />} />
              <Route path="/verify-email"    element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password"  element={<ResetPassword />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/practice"    element={<Practice />} />
                <Route path="/log-session" element={<LogSession />} />
                <Route path="/analytics"   element={<Analytics />} />
                <Route path="/history"     element={<History />} />
                <Route path="/assistant"   element={<Chatbot />} />
                <Route path="/programs"    element={<ProgramSelection />} />
                <Route path="/programs/:programId" element={<ProgramOverview />} />
                <Route path="/programs/:programId/day/:dayId" element={<DayFlow />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin"            element={<AdminDashboard />} />
                <Route path="/admin/users"      element={<UserList />} />
                <Route path="/admin/analytics"  element={<PlatformAnalytics />} />
              </Route>

              {/* Catch all — redirect to login selector */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Export App.
export default App;
