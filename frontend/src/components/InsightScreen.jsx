import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, Smile } from 'lucide-react';

// InsightScreen: Step 9 - Show 5D scores before/after with radar chart and mood comparison
const InsightScreen = ({ sessionData, beforeMetrics = null }) => {
  const deriveScores = (data) => {
    const physical = data.pose_confidence || 0;
    const prana = data.breath_cycles_assigned
      ? Math.min(100, Math.round((data.breath_cycles_completed / data.breath_cycles_assigned) * 100))
      : 0;
    const mind = Math.max(0, 100 - (data.distraction_count || 0) * 5);
    const emotion = data.total_frames > 0
      ? Math.min(100, Math.round((data.positive_expression_frames / data.total_frames) * 100))
      : 50;
    const spiritual = Math.min(
      100,
      (data.mantra_played ? 50 : 0) +
      (data.breath_cycles_assigned
        ? (Math.min(data.breath_cycles_completed, data.breath_cycles_assigned) / data.breath_cycles_assigned) * 50
        : 0)
    );

    return {
      Physical: physical,
      Prana: prana,
      Mind: mind,
      Emotion: emotion,
      Spiritual: spiritual
    };
  };

  const beforeScores = beforeMetrics ? deriveScores(beforeMetrics) : deriveScores(sessionData);
  const afterScores = deriveScores(sessionData);

  const scoresData = Object.keys(beforeScores).map((name) => ({
    name,
    before: beforeScores[name],
    after: afterScores[name]
  }));

  const radarData = Object.keys(afterScores).map((category) => ({
    category,
    score: afterScores[category]
  }));

  const avgBefore = Math.round(
    scoresData.reduce((sum, s) => sum + s.before, 0) / scoresData.length
  );
  const avgAfter = Math.round(
    scoresData.reduce((sum, s) => sum + s.after, 0) / scoresData.length
  );

  const moodEmojis = ['😢', '😕', '😊', '😄', '🤩'];
  const moodLabels = ['Struggling', 'Neutral', 'Good', 'Great', 'Amazing'];
  const beforeMood = sessionData.mood_before || 3;
  const afterMood = sessionData.mood_after || 3;
  const moodChange = afterMood - beforeMood;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Award className="w-8 h-8 text-yellow-500" />
          Your Practice Summary
        </h2>
        <p className="text-slate-600">
          Here's how you progressed during this session.
        </p>
      </div>

      {/* Mood comparison */}
      <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Smile className="w-5 h-5" />
          Mood Change
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-sm text-slate-600 mb-2">Before</p>
            <p className="text-5xl mb-1">
              {moodEmojis[beforeMood - 1] || '😊'}
            </p>
            <p className="text-xs font-semibold text-slate-700">
              {moodLabels[beforeMood - 1] || 'Unknown'}
            </p>
          </div>

          <div className="px-6 text-2xl text-gray-400">→</div>

          <div className="text-center flex-1">
            <p className="text-sm text-slate-600 mb-2">After</p>
            <p className="text-5xl mb-1">
              {moodEmojis[afterMood - 1] || '😊'}
            </p>
            <p className="text-xs font-semibold text-slate-700">
              {moodLabels[afterMood - 1] || 'Unknown'}
            </p>
          </div>
        </div>

        {moodChange > 0 && (
          <p className="text-center mt-4 text-green-700 font-semibold">
            ✨ Mood improved by {moodChange} level{moodChange === 1 ? '' : 's'}!
          </p>
        )}
      </div>

      {/* 5D Scores comparison */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">
          5-Dimension Progression
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoresData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="before" fill="#94a3b8" name="Before" />
            <Bar dataKey="after" fill="#8b5cf6" name="After" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart - After state */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">
          Current Practice Profile
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-xs text-blue-700 mb-1">Duration</p>
          <p className="text-2xl font-bold text-blue-900">
            {sessionData.duration_minutes || 0}m
          </p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
          <p className="text-xs text-purple-700 mb-1">Before Score</p>
          <p className="text-2xl font-bold text-purple-900">{avgBefore}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-xs text-green-700 mb-1">After Score</p>
          <p className="text-2xl font-bold text-green-900">{avgAfter}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightScreen;
