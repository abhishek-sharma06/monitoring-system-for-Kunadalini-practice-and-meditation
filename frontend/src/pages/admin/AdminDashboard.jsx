// Import React hooks, navigation tools, API clients, and icons.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, Calendar, Award, AlertCircle, ShieldAlert, BarChart2, List } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        if (res.data.success) {
          setStats(res.data.data.stats);
          setTopUsers(res.data.data.top_5_active_users);
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch platform metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Connecting to admin console..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Admin Warning Banner */}
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <span className="font-bold text-sm">Administrator Area</span>
          <p className="text-xs text-red-700">Audit logs are active for all modifications and account removals performed.</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Platform Control Center</h1>
          <p className="text-sm text-text-secondary">Monitor user lists, registration flows, and aggregate practice trends.</p>
        </div>
      </div>

      {/* Aggregate metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 text-accent-primary rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Total Registered</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.total_users || 0} Users</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 text-accent-secondary rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Practices Today</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.total_sessions_today || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Platform Avg Score</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.avg_score_platform || 0}/10</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Unverified Email Accounts</p>
            <p className="text-xl font-extrabold text-text-primary">{stats?.unverified_users || 0}</p>
          </div>
        </div>
      </div>

      {/* Action links */}
      <div className="flex gap-4 flex-wrap">
        <Link
          to="/admin/users"
          className="flex items-center gap-2 px-5 py-3 bg-accent-primary text-white text-sm font-bold rounded-2xl hover:bg-opacity-95 transition shadow-sm"
        >
          <List className="w-4 h-4" />
          Manage Users List
        </Link>
        <Link
          to="/admin/analytics"
          className="flex items-center gap-2 px-5 py-3 bg-white text-accent-primary border border-border text-sm font-bold rounded-2xl hover:bg-background-secondary/40 transition"
        >
          <BarChart2 className="w-4 h-4" />
          Platform Analytics
        </Link>
      </div>

      {/* Main Grid: Top 5 Active Users list */}
      <div className="bg-white p-6 border border-border rounded-2xl shadow-sm flex flex-col gap-4 max-w-3xl">
        <h2 className="text-sm font-bold text-text-primary">Top 5 Active Practitioners</h2>
        {topUsers.length === 0 ? (
          <p className="text-xs text-text-secondary italic">Awaiting session logging data.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {topUsers.map((u, i) => (
              <div key={u.id} className="flex justify-between items-center p-3.5 bg-background-primary/40 border border-border/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-accent-primary w-5 h-5 bg-purple-50 rounded-full flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{u.name}</p>
                    <p className="text-xs text-text-secondary">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-text-primary">{u.session_count} practices</p>
                  <p className="text-xs text-text-secondary">Avg Score: {Number(u.avg_score).toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Export AdminDashboard.
export default AdminDashboard;
