// Import React hooks, navigation tools, and auth hooks.
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Menu, X, LogOut, LayoutDashboard, Sparkles, LineChart, History, Shield, MessageCircle, BookOpen } from 'lucide-react';

// Responsive Navbar component.
const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If user is not authenticated, do not show navigation header elements.
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Practice', path: '/practice', icon: Sparkles },
    { label: 'Programs', path: '/programs', icon: BookOpen },
    { label: 'Assistant', path: '/assistant', icon: MessageCircle },
    { label: 'Analytics', path: '/analytics', icon: LineChart },
    { label: 'History', path: '/history', icon: History }
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="yoga">🧘</span>
              <span className="font-semibold text-lg text-accent-primary tracking-tight">Kundalini Tracker</span>
            </Link>
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4 items-center">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive(link.path)
                        ? 'bg-background-secondary text-accent-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive('/admin')
                      ? 'bg-red-50 text-red-600'
                      : 'text-text-secondary hover:text-red-600 hover:bg-red-50/30'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex md:items-center md:ml-6 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex text-sm rounded-full bg-accent-primary text-white w-9 h-9 items-center justify-center font-bold focus:outline-none hover:scale-105 transition"
            >
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </button>
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 top-12 mt-2 w-48 rounded-2xl shadow-lg py-1 bg-white border border-border ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-xs text-text-secondary font-medium">Signed in as</p>
                  <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-background-secondary text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          {user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium ${
                isActive('/admin') ? 'bg-red-50 text-red-600' : 'text-text-secondary hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              <Shield className="w-5 h-5" />
              Admin Area
            </Link>
          )}
          <div className="border-t border-border mt-3 pt-3 px-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-accent-primary text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{user.name}</p>
                <p className="text-xs text-text-secondary">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Export Navbar.
export default Navbar;
