import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PlatformAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#6B4FA0', '#2D9596', '#3498db', '#4CAF87', '#f1c40f', '#e67e22', '#e74c3c'];

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlatformData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  const stats = data?.stats || {};
  const levelData = (data?.level_distribution || []).map(d => ({ name: d.level || 'unknown', value: Number(d.count) }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">Platform Analytics</h1>
        <p className="text-sm text-text-secondary">User growth, level distribution, and account verification trends.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">{error}</div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total_users || 0, color: 'bg-purple-50 text-accent-primary' },
          { label: 'Verified', value: stats.verified_users || 0, color: 'bg-green-50 text-green-600' },
          { label: 'Unverified', value: stats.unverified_users || 0, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Admins', value: stats.admin_count || 0, color: 'bg-red-50 text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white p-4 border border-border rounded-2xl shadow-sm text-center">
            <p className="text-xs font-bold text-text-secondary mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color.split(' ')[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Signups Trend */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">New User Signups (Last 30 Days)</h4>
          <div className="h-64">
            {data?.new_users_last_30_days?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.new_users_last_30_days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1F5" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                  <YAxis stroke="#6B7280" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Line type="monotone" dataKey="count" stroke="#6B4FA0" strokeWidth={3} activeDot={{ r: 6 }} name="Signups" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-secondary italic">No signup data yet.</div>
            )}
          </div>
        </div>

        {/* Level Distribution Pie */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">User Level Distribution</h4>
          <div className="h-64 flex items-center justify-center">
            {levelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={levelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-text-secondary italic">No user data yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
