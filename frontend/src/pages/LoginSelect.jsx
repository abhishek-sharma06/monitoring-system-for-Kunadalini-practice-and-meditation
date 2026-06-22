// Login Role Selector — presents User vs Admin portal choice.
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

const LoginSelect = () => {
  return (
    <div className="min-h-screen gradient-kundalini flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative background orbs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #6B4FA0, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #2D9596, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #C0392B, transparent 60%)' }}
      />

      {/* Brand Header */}
      <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0s' }}>
        <div className="relative inline-block mb-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto animate-chakra-glow"
            style={{ background: 'rgba(107, 79, 160, 0.3)', border: '2px solid rgba(107, 79, 160, 0.5)' }}
          >
            🧘
          </div>
          {/* Spinning ring */}
          <div
            className="absolute inset-0 w-20 h-20 rounded-full border-2 border-dashed mx-auto animate-spin-slow"
            style={{ borderColor: 'rgba(107, 79, 160, 0.4)' }}
          />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Kundalini Tracker
        </h1>
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Awaken your inner energy — choose your portal
        </p>
      </div>

      {/* Role Cards Container */}
      <div
        className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in"
        style={{ animationDelay: '0.15s' }}
      >
        {/* User Card */}
        <Link to="/login/user" className="role-card role-card-user group">
          {/* Icon circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #6B4FA0, #2D9596)', boxShadow: '0 8px 24px rgba(107,79,160,0.3)' }}
          >
            <User className="w-9 h-9 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold mb-1" style={{ color: '#1A1A2E' }}>
              Practitioner Portal
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Track sessions, explore chakras, log your daily Kundalini practice & meditation.
            </p>
          </div>

          {/* Features list */}
          <ul className="w-full text-left space-y-1.5">
            {['Log practice sessions', 'Track chakra progress', 'View analytics & streaks', 'Pose detection (coming soon)'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs font-medium" style={{ color: '#4B5563' }}>
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6B4FA0' }} />
                {f}
              </li>
            ))}
          </ul>

          <div
            className="flex items-center gap-1.5 text-sm font-bold mt-2 group-hover:gap-2.5 transition-all"
            style={{ color: '#6B4FA0' }}
          >
            Enter as User <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Admin Card */}
        <Link to="/login/admin" className="role-card role-card-admin group">
          {/* Icon circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #C0392B, #8B0000)', boxShadow: '0 8px 24px rgba(192,57,43,0.3)' }}
          >
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold mb-1" style={{ color: '#1A1A2E' }}>
              Admin Control Center
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Manage users, add exercises & chakra content, review platform metrics.
            </p>
          </div>

          {/* Features list */}
          <ul className="w-full text-left space-y-1.5">
            {['User account management', 'Add chakra exercises', 'Platform-wide analytics', 'Content & curriculum control'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs font-medium" style={{ color: '#4B5563' }}>
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C0392B' }} />
                {f}
              </li>
            ))}
          </ul>

          <div
            className="flex items-center gap-1.5 text-sm font-bold mt-2 group-hover:gap-2.5 transition-all"
            style={{ color: '#C0392B' }}
          >
            Enter as Admin <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Footer note */}
      <p
        className="mt-10 text-xs text-center animate-fade-in"
        style={{ color: 'rgba(255,255,255,0.45)', animationDelay: '0.3s' }}
      >
        Don't have an account?{' '}
        <Link to="/register" className="font-bold underline hover:text-white transition" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginSelect;
