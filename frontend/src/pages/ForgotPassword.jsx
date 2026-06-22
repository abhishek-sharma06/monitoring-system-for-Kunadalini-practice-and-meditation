// Import React hooks, routing, API client, and icons.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, CheckCircle } from 'lucide-react';

// ForgotPassword page component.
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(''); // success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage(typeof err === 'string' ? err : 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Recover Password</h2>
          <p className="text-xs text-text-secondary">Request a reset link for your account</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-accent-primary mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
              {message || 'If an account exists for that email, we have sent instructions to reset your password.'}
            </p>
            <Link
              to="/login/user"
              className="w-full inline-block py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm"
            >
              Back to Login
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
                <label className="text-xs font-bold text-text-secondary" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-secondary">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary transition bg-background-primary/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-medium">
              <Link to="/login/user" className="text-text-secondary hover:text-text-primary transition">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Export ForgotPassword.
export default ForgotPassword;
