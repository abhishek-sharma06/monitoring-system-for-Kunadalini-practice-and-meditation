// Import React hooks, routing tools, API client, and icons.
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

// ResetPassword page component.
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(''); // success, error
  const [message, setMessage] = useState('');

  // Evaluate password strength.
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

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setMessage('');
    setLoading(true);

    if (!token) {
      setStatus('error');
      setMessage('Missing token. Cannot reset password.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/auth/reset-password', { token, newPassword });
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage(typeof err === 'string' ? err : 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Set New Password</h2>
          <p className="text-xs text-text-secondary">Enter your updated account credentials</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-success mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
              {message || 'Your password has been successfully reset.'}
            </p>
            <Link
              to="/login"
              className="w-full inline-block py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <>
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100 mb-6">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary" htmlFor="password">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-secondary">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                {newPassword && (
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// Export ResetPassword.
export default ResetPassword;
