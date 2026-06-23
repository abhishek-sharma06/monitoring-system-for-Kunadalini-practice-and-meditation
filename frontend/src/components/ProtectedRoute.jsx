import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import ChatbotPanel from './ChatbotPanel';
import { MessageCircle, X } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner text="Restoring session..." />;
  }

  if (!user) {
    return <Navigate to="/login/user" replace />;
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="w-full px-3 py-6">
        <div className={`grid grid-cols-1 ${chatOpen ? 'xl:grid-cols-[minmax(0,1fr)_340px] gap-6' : 'gap-0'}`}>
          <div className="space-y-6 min-w-0">
            <Outlet />
          </div>
          {chatOpen && (
            <div className="hidden xl:block">
              <div className="sticky top-20 h-[calc(100vh-6rem)]">
                <ChatbotPanel onClose={() => setChatOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop toggle button */}
      <button
        type="button"
        onClick={() => setChatOpen(!chatOpen)}
        className="hidden xl:inline-flex fixed right-4 z-40 items-center gap-2 rounded-full bg-accent-primary px-4 py-2.5 text-white text-sm font-semibold shadow-lg shadow-black/15 hover:bg-purple-700 transition-all"
        style={{ top: chatOpen ? '5rem' : '5rem' }}
      >
        {chatOpen ? (
          <>
            <X className="w-4 h-4" />
            Hide
          </>
        ) : (
          <>
            <MessageCircle className="w-4 h-4" />
            Assistant
          </>
        )}
      </button>

      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setMobileChatOpen(true)}
        className="xl:hidden fixed bottom-4 right-4 z-40 rounded-full bg-accent-primary p-3 text-white shadow-lg shadow-black/15 hover:bg-purple-700 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4">
          <div className="relative mx-auto h-full max-w-md rounded-3xl bg-background-primary p-4 shadow-2xl shadow-black/20">
            <button
              onClick={() => setMobileChatOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-background-secondary p-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <ChatbotPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
