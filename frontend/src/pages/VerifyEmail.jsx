import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [resendLink, setResendLink] = useState('');

  useEffect(() => {
    const triggerVerify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }
      try {
        const res = await api.get(`/api/auth/verify?token=${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message);
        }
      } catch (err) {
        setStatus('error');
        setMessage(typeof err === 'string' ? err : 'Email verification failed.');
      }
    };
    triggerVerify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      setResendStatus('Please enter your email first.');
      return;
    }
    setResendStatus('');
    try {
      const res = await api.post('/api/auth/resend-verification', { email });
      if (res.data.success) {
        setResendStatus(res.data.message || 'Verification link resent successfully!');
        if (res.data.verifyLink) setResendLink(res.data.verifyLink);
      }
    } catch (err) {
      setResendStatus(typeof err === 'string' ? err : 'Resend request failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full shadow-sm text-center">
        {status === 'verifying' && (
          <div className="py-6">
            <LoadingSpinner text="Verifying your email address, please wait..." />
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-success mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Email Verified</h2>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
              {message || 'Your account has been successfully verified. You can now log in to the application.'}
            </p>
            <Link
              to="/login/user"
              className="w-full py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm text-center"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Verification Failed</h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              {message || 'The verification link is invalid or has expired.'}
            </p>

            <form onSubmit={handleResend} className="w-full flex flex-col gap-3 mt-4">
              <p className="text-xs text-text-secondary font-medium text-left">
                Enter your email address below to request a new verification link:
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary bg-background-primary/50"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-background-secondary text-accent-primary font-bold rounded-xl hover:bg-opacity-95 transition text-sm"
              >
                Resend Verification Link
              </button>
              {resendStatus && <p className="text-xs font-semibold mt-1 text-accent-primary">{resendStatus}</p>}
              {resendLink && (
                <div className="mt-2 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-left">
                  <p className="text-xs font-bold text-yellow-800 mb-2">Email could not be delivered. Click to verify:</p>
                  <a href={resendLink} target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition text-xs">
                    Verify My Email Now
                  </a>
                </div>
              )}
            </form>

            <Link to="/login/user" className="mt-6 text-xs font-bold text-text-secondary hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
