// Import React hooks, API client, Recharts, and spinner.
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const PlatformAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Custom colors for popularity charts.
  const COLORS = ['#6B4FA0', '#2D9596', '#3498db', '#4CAF87', '#f1c40f', '#e67e22', '#e74c3c'];

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const res = await api.get('/api/admin/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch platform metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlatformData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating platform datasets..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">Platform Wide Metrics</h1>
        <p className="text-sm text-text-secondary">Track account volumes, session frequencies, and chakra interest trends.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: New Users Last 30 Days */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">New Signups (Last 30 Days)</h4>
          <div className="h-64">
            {data?.new_users_last_30_days?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.new_users_last_30_days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1F5" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                  <YAxis stroke="#6B7280" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Line type="monotone" dataKey="count" stroke="#6B4FA0" strokeWidth={3} activeDot={{ r: 6 }} name="Signups" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-secondary italic">Awaiting more platform traffic...</div>
            )}
          </div>
        </div>

        {/* Chart 2: Sessions Last 30 Days */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">Practice Session Counts (Last 30 Days)</h4>
          <div className="h-64">
            {data?.sessions_last_30_days?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sessions_last_30_days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1F5" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                  <YAxis stroke="#6B7280" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Bar dataKey="count" fill="#2D9596" radius={[4, 4, 0, 0]} name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-secondary italic">Awaiting more platform traffic...</div>
            )}
          </div>
        </div>

        {/* Chart 3: Chakra Popularity */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3 md:col-span-2 max-w-3xl mx-auto w-full">
          <h4 className="text-sm font-bold text-text-primary text-center">Chakra Practice Popularity Breakdown</h4>
          <div className="h-64 flex items-center justify-center">
            {data?.chakra_popularity?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.chakra_popularity}
                    dataKey="count"
                    nameKey="chakra_focus"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name.replace(' CHAKRA', '')} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={true}
                  >
                    {data.chakra_popularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-text-secondary italic">Awaiting sessions logs...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export PlatformAnalytics.
export default PlatformAnalytics;
