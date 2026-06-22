// Admin Login page — control center portal with dark red theme.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Shield } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', formData);
      if (res.data.success) {
        const { token, user } = res.data.data;
        // Only allow admin role through this portal.
        if (user.role !== 'admin') {
          setError('Access denied. This portal is for administrators only.');
          setLoading(false);
          return;
        }
        login(token, user);
        navigate('/admin');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D0D0D 0%, #1a0505 40%, #3B0000 100%)' }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C0392B, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #8B0000, transparent 70%)' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(192,57,43,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(192,57,43,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8 transition hover:gap-2.5"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <ArrowLeft className="w-4 h-4" /> Back to portal selection
        </Link>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(192,57,43,0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 60px rgba(192,57,43,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            {/* Shield icon with pulse ring */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <div className="absolute w-20 h-20 rounded-full animate-pulse-ring"
                style={{ background: 'rgba(192,57,43,0.3)' }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C0392B, #8B0000)', boxShadow: '0 8px 24px rgba(192,57,43,0.4)' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">Admin Control Center</h1>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Restricted access · Authorized personnel only
            </p>
          </div>

          {/* Security notice banner */}
          <div
            className="flex items-center gap-3 p-3.5 rounded-xl mb-6"
            style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)' }}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#F87171' }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              All admin actions are <strong className="text-white">logged and audited</strong>. Unauthorized access attempts are recorded.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 p-4 rounded-xl"
              style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.5)' }}
            >
              <p className="text-xs font-semibold" style={{ color: '#F87171' }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@kundalini.com"
                  className="form-input-admin"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Admin Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter admin password"
                  className="form-input-admin"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-admin mt-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Access Admin Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Default admin:{' '}
              <code className="font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>admin@kundalini.com</code>
              {' '}· Password: <code className="font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin@123</code>
            </p>
          </div>
        </div>

        {/* User portal link */}
        <p className="mt-5 text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Not an admin?{' '}
          <Link to="/login/user" className="font-bold hover:underline" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Go to User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
