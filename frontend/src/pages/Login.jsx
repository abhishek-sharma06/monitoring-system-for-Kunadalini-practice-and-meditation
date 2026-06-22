// Import React hooks, navigation tools, API clients, and auth contexts.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Login page component.
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setResendMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', formData);
      if (res.data.success) {
        const { token, user } = res.data.data;
        login(token, user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err && err.includes('verify your email')) {
        setShowResend(true);
      }
      setError(typeof err === 'string' ? err : 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    try {
      const res = await api.post('/api/auth/resend-verification', { email: formData.email });
      if (res.data.success) {
        setResendMessage('Verification link resent. Check your inbox.');
      }
    } catch (err) {
      setResendMessage(typeof err === 'string' ? err : 'Resend request failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Welcome Back</h2>
          <p className="text-xs text-text-secondary">Sign in to resume your practice tracking</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100 mb-6 flex flex-col gap-2">
            <span>{error}</span>
            {showResend && (
              <button
                onClick={handleResend}
                className="text-left font-bold underline hover:text-red-800 focus:outline-none"
              >
                Click here to resend verification link
              </button>
            )}
          </div>
        )}

        {resendMessage && (
          <div className="bg-success/10 text-success text-xs font-semibold p-3.5 rounded-xl border border-success/20 mb-6">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-secondary">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary transition bg-background-primary/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-text-secondary" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-accent-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-secondary">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary transition bg-background-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-secondary font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-primary font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export Login.
export default Login;
