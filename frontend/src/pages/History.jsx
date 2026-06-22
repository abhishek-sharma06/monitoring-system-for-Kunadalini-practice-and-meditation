// Import React hooks, API client, and icons.
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trash2, AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state variables
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/sessions?page=${page}&limit=10`);
      if (res.data.success) {
        setSessions(res.data.data.sessions);
        setTotalPages(res.data.data.totalPages);
        setTotalCount(res.data.data.total);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch session history.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id) => {
    setSelectedSessionId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteDialog = () => {
    setSelectedSessionId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!selectedSessionId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/api/sessions/${selectedSessionId}`);
      if (res.data.success) {
        closeDeleteDialog();
        // If current page is empty now, go back one page if possible.
        if (sessions.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchHistory();
        }
      }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to delete practice entry.');
      closeDeleteDialog();
    } finally {
      setDeleting(false);
    }
  };

  const getMoodEmoji = (moodValue) => {
    const emojis = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };
    return emojis[moodValue] || '😐';
  };

  if (loading && sessions.length === 0) {
    return <LoadingSpinner text="Retrieving your spiritual logbook..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">Practice History</h1>
        <p className="text-sm text-text-secondary">Review previous kriya entries, notes, and metrics ({totalCount} total).</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* History Table Container */}
      <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-sm text-text-secondary italic">
            No practices logged yet. Access the Practice space to log your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background-primary/50 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Focus Chakra</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Mood (Before/After)</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Reflections</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-sm">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-background-secondary/10 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-text-primary font-medium">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-accent-primary">
                        {s.chakra_focus || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary font-semibold">
                      {s.duration_minutes} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-primary font-extrabold">
                      {Number(s.score).toFixed(1)}/10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary font-medium">
                      <span className="text-base" title={`Before: ${s.mood_before}`}>{getMoodEmoji(s.mood_before)}</span>
                      <span className="mx-1.5 text-text-secondary">→</span>
                      <span className="text-base" title={`After: ${s.mood_after}`}>{getMoodEmoji(s.mood_after)}</span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary max-w-xs truncate" title={s.notes}>
                      {s.notes || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openDeleteDialog(s.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Delete Session Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-border px-4 py-3 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-border rounded-xl text-text-secondary hover:bg-background-secondary/50 disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-border rounded-xl text-text-secondary hover:bg-background-secondary/50 disabled:opacity-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-3xl p-6 max-w-sm w-full shadow-lg relative flex flex-col gap-4">
            <button
              onClick={closeDeleteDialog}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Delete practice entry?</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                This action is irreversible. The log and all associated chakra metrics will be permanently erased.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={closeDeleteDialog}
                className="flex-1 py-2.5 bg-background-secondary text-text-primary font-bold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export History.
export default History;
