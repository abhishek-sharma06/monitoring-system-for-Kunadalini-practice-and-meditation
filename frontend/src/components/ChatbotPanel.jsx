import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import api from '../api/axios';

export default function ChatbotPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi — I can help with practice tips, breath techniques, and mantra guidance. How can I assist you today?', ts: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { from: 'user', text, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await api.post('/api/chat', { message: text });
      const botText = res.data?.data?.reply || 'Sorry, I could not generate a response right now.';
      setMessages((m) => [...m, { from: 'bot', text: botText, ts: Date.now() }]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: typeof err === 'string' ? err : 'Chat failed. Try again later.', ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-3xl p-4 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-bold">Assistant</div>
          <div className="text-xs text-text-secondary">AI-guided practice help</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wide text-text-secondary hover:text-text-primary"
          >
            Hide
          </button>
        )}
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto space-y-3 p-2 mb-3" style={{ maxHeight: 'calc(100vh - 240px)' }} aria-live="polite">
        {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}

        {loading && (
          <div className="flex items-start">
            <div className="mr-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 text-lg">🪷</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-border text-text-secondary">
              <div className="typing-dots flex items-center gap-1">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border mt-auto">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
