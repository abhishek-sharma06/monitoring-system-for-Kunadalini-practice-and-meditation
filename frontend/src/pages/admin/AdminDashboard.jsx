import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, ShieldCheck, AlertCircle, ShieldAlert, List, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        if (res.data.success) {
          setStats(res.data.data.stats);
          setRecentLogs(res.data.data.recent_admin_actions || []);
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch platform metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner text="Connecting to admin console..." />;

  const actionLabels = {
    DELETE_USER: 'Deleted user',
    CHANGE_ROLE: 'Changed user role',
    CREATE_USER: 'Created user',
    UPDATE_USER: 'Updated user',
    VERIFY_USER: 'Verified user email',
    UNVERIFY_USER: 'Unverified user email',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Admin Warning Banner */}
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <span className="font-bold text-sm">Administrator Area</span>
          <p className="text-xs text-red-700">All modifications and account actions are logged and audited.</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Admin Control Center</h1>
          <p className="text-sm text-text-secondary">Manage users, monitor registrations, and oversee platform access.</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 text-accent-primary rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Total Users</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.total_users || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Verified Users</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.verified_users || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Unverified Accounts</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.unverified_users || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Admin Accounts</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.admin_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 flex-wrap">
        <Link
          to="/admin/users"
          className="flex items-center gap-2 px-5 py-3 bg-accent-primary text-white text-sm font-bold rounded-2xl hover:bg-opacity-95 transition shadow-sm"
        >
          <List className="w-4 h-4" />
          Manage Users
        </Link>
      </div>

      {/* Recent admin activity */}
      <div className="bg-white p-6 border border-border rounded-2xl shadow-sm flex flex-col gap-4 max-w-3xl">
        <h2 className="text-sm font-bold text-text-primary">Recent Admin Activity</h2>
        {recentLogs.length === 0 ? (
          <p className="text-xs text-text-secondary italic">No admin actions recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center p-3.5 bg-background-primary/40 border border-border/40 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {actionLabels[log.action] || log.action}
                  </p>
                  <p className="text-xs text-text-secondary">
                    by {log.admin_name} ({log.admin_email})
                  </p>
                </div>
                <p className="text-xs text-text-secondary">
                  {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
