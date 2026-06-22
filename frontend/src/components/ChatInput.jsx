import React, { useState } from 'react';

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder={loading ? 'Waiting for response...' : 'Ask about breathwork, mantras, chakras, or practice tips'}
        className="form-input w-full min-h-[3.5rem] resize-none"
        disabled={loading}
      />
      <button className="btn-primary px-4 py-3" disabled={loading || !text.trim()}>
        {loading ? '...' : 'Send'}
      </button>
    </form>
  );
}
