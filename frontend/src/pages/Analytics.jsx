// Import React hooks, API clients, Recharts elements, and subcomponents.
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import GoalProgress from '../components/GoalProgress';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, Award, Compass, Heart, Settings } from 'lucide-react';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for user target customization
  const [newTarget, setNewTarget] = useState(5);
  const [showGoalInput, setShowGoalInput] = useState(false);

  // Define colors corresponding to each energy chakra.
  const CHAKRA_COLORS = {
    'Root': '#e74c3c',         // Red
    'Sacral': '#e67e22',       // Orange
    'Solar Plexus': '#f1c40f', // Yellow
    'Heart': '#2ecc71',        // Green
    'Throat': '#3498db',       // Blue
    'Third Eye': '#8e44ad',    // Indigo
    'Crown': '#9b59b6',        // Violet
    'Muladhara': '#e74c3c',
    'Swadhistana': '#e67e22',
    'Manipura': '#f1c40f',
    'Anahata': '#2ecc71',
    'Vishuddha': '#3498db',
    'Ajna': '#8e44ad',
    'Sahasarara': '#9b59b6',
    'SAHASARARA': '#9b59b6',
    'ANJA': '#8e44ad',
    'VISHUDDHA': '#3498db',
    'ANAHATA': '#2ecc71',
    'MANIPURA': '#f1c40f',
    'SWADISHTANA': '#e67e22',
    'MULADHARA': '#e74c3c'
  };

  const getChakraColor = (name) => {
    return CHAKRA_COLORS[name] || '#6B4FA0'; // Default purple
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [summaryRes, trendsRes, goalRes] = await Promise.all([
        api.get('/api/analytics/summary'),
        api.get('/api/analytics/trends'),
        api.get('/api/analytics/goals')
      ]);

      setSummary(summaryRes.data.data);
      setTrends(trendsRes.data.data);
      setGoal(goalRes.data.data);
      setNewTarget(goalRes.data.data.weekly_target);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch analytics metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/analytics/goals', { weekly_sessions_target: newTarget });
      setShowGoalInput(false);
      fetchAnalyticsData();
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to update goal settings.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Compiling your practice history..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">Practice Insights</h1>
        <p className="text-sm text-text-secondary">Track your spiritual growth, chakra activation rates, and mood trends.</p>
      </div>

      {/* Summary statistics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 text-accent-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Total Practices</p>
            <p className="text-xl font-extrabold text-text-primary">{summary?.total_sessions || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 text-accent-secondary rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Average Score</p>
            <p className="text-xl font-extrabold text-text-primary">{summary?.avg_score || 0}/10</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Primary Focus</p>
            <p className="text-base font-extrabold text-text-primary truncate max-w-[150px]" title={summary?.most_practiced_chakra}>
              {summary?.most_practiced_chakra || 'None'}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 text-success rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Average Mood Up</p>
            <p className="text-xl font-extrabold text-text-primary">
              {summary?.avg_mood_improvement > 0 ? `+${summary.avg_mood_improvement}` : summary?.avg_mood_improvement || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Goal configuration block */}
      {goal && (
        <div className="flex flex-col gap-3.5 bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-text-primary">Target Goal Status</h3>
            <button
              onClick={() => setShowGoalInput(!showGoalInput)}
              className="text-xs font-bold text-accent-primary flex items-center gap-1 hover:underline"
            >
              <Settings className="w-3.5 h-3.5" />
              Adjust Goal
            </button>
          </div>
          {showGoalInput && (
            <form onSubmit={handleUpdateGoal} className="flex gap-2 items-center bg-background-primary p-3 rounded-xl border border-border max-w-sm">
              <span className="text-xs font-bold text-text-secondary">Target:</span>
              <input
                type="number"
                min="1"
                max="21"
                required
                value={newTarget}
                onChange={(e) => setNewTarget(parseInt(e.target.value))}
                className="w-16 px-2 py-1 border border-border rounded-lg text-sm bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-accent-primary text-white text-xs font-bold rounded-lg hover:bg-opacity-95"
              >
                Save
              </button>
            </form>
          )}
          <GoalProgress current={goal.sessions_this_week} target={goal.weekly_target} />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Practice Score Over Time */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">Practice Score Over Time</h4>
          <div className="h-64">
            {trends?.score_over_time?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends.score_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1F5" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                  <YAxis domain={[0, 10]} stroke="#6B7280" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Line type="monotone" dataKey="avg_score" stroke="#6B4FA0" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} name="Avg Score" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-secondary italic">Awaiting more sessions logs...</div>
            )}
          </div>
        </div>

        {/* Chart 2: Weekly session logs */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">Weekly Session Frequency</h4>
          <div className="h-64">
            {trends?.sessions_per_week?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends.sessions_per_week} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1F5" />
                  <XAxis dataKey="week" stroke="#6B7280" fontSize={10} />
                  <YAxis stroke="#6B7280" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Bar dataKey="count" fill="#2D9596" radius={[4, 4, 0, 0]} name="Sessions Logged" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-secondary italic">Awaiting more sessions logs...</div>
            )}
          </div>
        </div>

        {/* Chart 3: Chakra distribution */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">Energy Focus Distribution</h4>
          <div className="h-64 flex items-center justify-center">
            {trends?.chakra_distribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trends.chakra_distribution}
                    dataKey="count"
                    nameKey="chakra_focus"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ name, percent }) => `${name.replace(' CHAKRA', '')} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={true}
                  >
                    {trends.chakra_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getChakraColor(entry.chakra_focus.replace(' CHAKRA', ''))} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-text-secondary italic">Awaiting more sessions logs...</div>
            )}
          </div>
        </div>

        {/* Chart 4: Mood before vs after */}
        <div className="bg-white p-5 border border-border rounded-2xl shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-bold text-text-primary">Mood Progression Trend</h4>
          <div className="h-64">
            {trends?.mood_trend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.mood_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1F5" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#6B7280" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E5E1F5' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="avg_before" stroke="#A78BFA" fillOpacity={0.15} fill="#A78BFA" name="Mood Before" />
                  <Area type="monotone" dataKey="avg_after" stroke="#4CAF87" fillOpacity={0.15} fill="#4CAF87" name="Mood After" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-secondary italic">Awaiting more sessions logs...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export Analytics.
export default Analytics;
