// Import React, router redirects, and session hooks.
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import ChatbotPanel from './ChatbotPanel';

// ProtectedRoute checks authentication status and renders the app layout with assistant panel.
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  if (loading) {
    return <LoadingSpinner text="Restoring session..." />;
  }

  if (!user) {
    return <Navigate to="/login/user" replace />;
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="w-full px-3 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_320px] gap-6">
          <div className="space-y-6">
            <Outlet />
          </div>
          {chatOpen && (
            <div className="hidden xl:block">
              <div className="sticky top-20">
                <ChatbotPanel onClose={() => setChatOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="hidden xl:inline-flex fixed right-4 top-32 z-50 rounded-full bg-accent-primary px-4 py-3 text-white font-semibold shadow-xl shadow-black/15 hover:bg-purple-700 transition"
        >
          Show Assistant
        </button>
      )}

      <button
        type="button"
        onClick={() => setMobileChatOpen(true)}
        className="xl:hidden fixed bottom-4 right-4 z-50 rounded-full bg-accent-primary px-4 py-3 text-white font-semibold shadow-xl shadow-black/10 hover:bg-purple-700 transition"
      >
        Practice Assistant
      </button>

      {mobileChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4">
          <div className="relative mx-auto h-full max-w-md rounded-3xl bg-background-primary p-4 shadow-2xl shadow-black/20">
            <button
              onClick={() => setMobileChatOpen(false)}
              className="absolute right-4 top-4 text-xs uppercase tracking-wide text-text-secondary hover:text-text-primary"
            >
              Close
            </button>
            <ChatbotPanel />
          </div>
        </div>
      )}
    </div>
  );
};

// Export ProtectedRoute component.
export default ProtectedRoute;
