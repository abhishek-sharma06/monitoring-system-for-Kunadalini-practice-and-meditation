// Import React hooks, router tools, icons, and API client.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

// Register page component.
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [verifyLink, setVerifyLink] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  // Evaluate password strength: returns 'Weak', 'Medium', or 'Strong'.
  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/register', formData);
      if (res.data.success) {
        setRegistered(true);
        if (res.data.verifyLink) setVerifyLink(res.data.verifyLink);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('');
    try {
      const res = await api.post('/api/auth/resend-verification', { email: formData.email });
      if (res.data.success) {
        setResendStatus(res.data.message || 'Verification link resent successfully!');
        if (res.data.verifyLink) setVerifyLink(res.data.verifyLink);
      }
    } catch (err) {
      setResendStatus(typeof err === 'string' ? err : 'Failed to resend verification.');
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full shadow-sm text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-accent-primary mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Check Your Inbox</h2>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            We have sent a verification link to <strong className="text-text-primary">{formData.email}</strong>. Please click the link to verify your account.
          </p>

          {/* Show verification link directly if email couldn't be delivered */}
          {verifyLink && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-left">
              <p className="text-xs font-bold text-yellow-700 mb-2">Email could not be delivered. Use this link to verify:</p>
              <a
                href={verifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-primary font-semibold break-all underline"
              >
                {verifyLink}
              </a>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-accent-primary hover:underline"
            >
              Didn't receive an email? Resend
            </button>
            {resendStatus && <p className="text-xs font-semibold text-success">{resendStatus}</p>}
            <Link
              to="/login/user"
              className="px-6 py-2.5 bg-background-secondary text-accent-primary font-bold rounded-full hover:bg-opacity-95 transition"
            >
              Proceed to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Create Your Account</h2>
          <p className="text-xs text-text-secondary">Begin your journey of spiritual practice tracking</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary" htmlFor="name">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-secondary">
                <User className="w-4 h-4" />
              </span>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Abhishek Sharma"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary transition bg-background-primary/50"
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-text-secondary" htmlFor="password">Password</label>
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
                placeholder="Minimum 8 chars (1 upper, 1 number)"
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
            {/* Password strength bar */}
            {formData.password && (
              <div className="mt-1 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-text-secondary">Password Strength:</span>
                  <span className={
                    strength === 'Weak' ? 'text-red-500' : strength === 'Medium' ? 'text-yellow-500' : 'text-success'
                  }>{strength}</span>
                </div>
                <div className="w-full h-1 bg-background-secondary rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    strength === 'Weak' ? 'bg-red-500 w-1/3' : strength === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-success w-full'
                  }`}></div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-secondary font-medium">
          Already have an account?{' '}
          <Link to="/login/user" className="text-accent-primary font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export Register.
export default Register;
