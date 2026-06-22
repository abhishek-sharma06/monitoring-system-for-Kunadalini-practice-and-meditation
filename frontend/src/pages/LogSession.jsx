// Import React hooks, navigation, and API client.
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MoodPicker from '../components/MoodPicker';
import FiveDPreview from '../components/FiveDPreview';
import FiveDHistory from '../components/FiveDHistory';
import InsightScreen from '../components/InsightScreen';
import { addFiveDEntry } from '../utils/localHistory';
import { FileText, CheckCircle, Clock, Award, Compass } from 'lucide-react';

// LogSession page component.
const LogSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state parameters passed from Practice page.
  const {
    duration = 10,
    score = 7.5,
    poses_detected = 0,
    chakra_focus = 'General Meditation',
    mood_before = 3
  } = location.state || {};

  // optional metrics passed from Practice
  const { breath_cycles = 0, breath_completed = false, mantra_played = false, five_d_score = null, five_d = null, before_metrics = null, after_metrics = null } = location.state || {};

  const [moodAfter, setMoodAfter] = useState(4);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      duration_minutes: duration,
      score,
      poses_detected,
      chakra_focus,
      mood_before,
      mood_after: moodAfter,
      notes,
      breath_cycles,
      breath_completed,
      mantra_played,
      five_d_score,
      five_d: five_d ? JSON.stringify(five_d) : null
    };

    try {
      const res = await api.post('/api/sessions', payload);
      if (res.data.success) {
        // store lightweight fiveD snapshot locally for quick history
        if (five_d) {
          addFiveDEntry({ five_d_score, ...five_d });
        }
        alert('Practice session logged successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to save session data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col gap-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-purple-50 text-accent-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Practice reflections</h2>
        <p className="text-xs text-text-secondary">Save your metrics and reflections</p>
      </div>

      {/* 5D preview visualization (if available) */}
      {five_d && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FiveDPreview fiveD={five_d} />
          <FiveDHistory />
        </div>
      )}

      {/* Full InsightScreen with before/after comparison (if metrics available) */}
      {before_metrics && after_metrics && (
        <InsightScreen
          sessionData={{
            ...after_metrics,
            mood_before: moodBefore,
            mood_after: moodAfter,
            duration_minutes: duration
          }}
          beforeMetrics={before_metrics}
        />
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Session stats summaries */}
      <div className="grid grid-cols-3 gap-3 bg-background-primary/60 border border-border/40 p-4 rounded-2xl">
        <div className="flex flex-col items-center text-center">
          <Clock className="w-4 h-4 text-text-secondary mb-1" />
          <span className="text-[10px] font-bold text-text-secondary uppercase">Duration</span>
          <span className="text-sm font-extrabold text-accent-primary">{duration}m</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Award className="w-4 h-4 text-text-secondary mb-1" />
          <span className="text-[10px] font-bold text-text-secondary uppercase">AI Score</span>
          <span className="text-sm font-extrabold text-accent-primary">{score}/10</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Compass className="w-4 h-4 text-text-secondary mb-1" />
          <span className="text-[10px] font-bold text-text-secondary uppercase">Focus</span>
          <span className="text-xs font-extrabold text-accent-primary truncate max-w-[80px]" title={chakra_focus}>
            {chakra_focus}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Mood After */}
        <MoodPicker value={moodAfter} onChange={setMoodAfter} label="How do you feel after practicing?" />

        {/* Reflections Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-text-secondary" htmlFor="notes">Reflections / Sensations</label>
          <textarea
            id="notes"
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any reflections from today's practice... What sensations did you feel in your spine or chakras?"
            className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary bg-background-primary/30 resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition shadow-sm disabled:opacity-50"
        >
          {loading ? 'Saving reflections...' : 'Save Practice Log'}
        </button>
      </form>
    </div>
  );
};

// Export LogSession.
export default LogSession;
