// User Login page — practitioner portal with purple theme.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, User } from 'lucide-react';

const UserLogin = () => {
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
        if (user.role === 'admin') {
          setError('This is the user portal. Please use the Admin Login instead.');
          setLoading(false);
          return;
        }
        login(token, user);
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : '';
      if (msg.toLowerCase().includes('verify your email')) {
        setShowResend(true);
      }
      setError(msg || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    try {
      const res = await api.post('/api/auth/resend-verification', { email: formData.email });
      if (res.data.success) setResendMessage('Verification link resent. Check your inbox.');
    } catch (err) {
      setResendMessage(typeof err === 'string' ? err : 'Resend request failed.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #2D1B4E 50%, #6B4FA0 100%)' }}
      >
        {/* Orbs */}
        <div className="absolute top-12 left-12 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #6B4FA0, transparent)' }} />
        <div className="absolute bottom-16 right-8 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2D9596, transparent)' }} />

        {/* Chakra circles decoration */}
        <div className="relative mb-10">
          {[...Array(7)].map((_, i) => {
            const colors = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#8B00FF'];
            const sizes = [24, 28, 32, 36, 32, 28, 24];
            return (
              <div
                key={i}
                className="rounded-full mx-auto mb-2 animate-chakra-glow"
                style={{
                  width: sizes[i],
                  height: sizes[i],
                  background: colors[i],
                  opacity: 0.8,
                  boxShadow: `0 0 12px ${colors[i]}60`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            );
          })}
        </div>

        <h2 className="text-2xl font-extrabold text-white text-center mb-3">
          Welcome Back, Practitioner
        </h2>
        <p className="text-sm text-center leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Continue your Kundalini journey. Track poses, log sessions, and awaken each chakra step by step.
        </p>

        <div className="space-y-3 w-full max-w-xs">
          {['Daily session tracking', 'Chakra energy monitoring', 'Mantra & breathwork guides', 'Progress analytics'].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(107,79,160,0.4)' }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8 transition hover:gap-2.5"
            style={{ color: '#6B7280' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to portal selection
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6B4FA0, #2D9596)' }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>User Sign In</h1>
                <p className="text-xs font-medium" style={{ color: '#6B7280' }}>Practitioner Portal</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Sign in to your account to resume your practice tracking journey.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-xl flex flex-col gap-2"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>{error}</p>
              {showResend && (
                <button onClick={handleResend}
                  className="text-left text-xs font-bold underline transition"
                  style={{ color: '#DC2626' }}>
                  Click here to resend verification email
                </button>
              )}
            </div>
          )}
          {resendMessage && (
            <div className="mb-5 p-4 rounded-xl text-xs font-semibold"
              style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A' }}>
              {resendMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-email" className="text-xs font-bold" style={{ color: '#6B7280' }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#9CA3AF' }}>
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="user-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="user-password" className="text-xs font-bold" style={{ color: '#6B7280' }}>
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold hover:underline" style={{ color: '#6B4FA0' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#9CA3AF' }}>
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="form-input"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Sign In to Practice Portal
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm" style={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#6B4FA0' }}>
              Register here
            </Link>
          </p>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#E5E1F5' }} />
            <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#E5E1F5' }} />
          </div>
          <p className="mt-4 text-center text-xs" style={{ color: '#9CA3AF' }}>
            Are you an admin?{' '}
            <Link to="/login/admin" className="font-bold hover:underline" style={{ color: '#C0392B' }}>
              Go to Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
