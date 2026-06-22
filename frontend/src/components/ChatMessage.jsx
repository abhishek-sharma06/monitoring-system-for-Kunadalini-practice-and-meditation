import React from 'react';

// Small chat message with avatar and timestamp
export default function ChatMessage({ msg }) {
  const isUser = msg.from === 'user';
  const avatar = isUser ? '🙋' : '🪷';

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-3 flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 text-lg">{avatar}</div>
        </div>
      )}

      <div className={`p-3 rounded-xl max-w-[75%] ${isUser ? 'bg-accent-primary text-white' : 'bg-white border border-border text-text-primary'}`}>
        <div className="text-sm leading-relaxed">{msg.text}</div>
        <div className="text-[10px] text-gray-400 mt-1 text-right">{new Date(msg.ts).toLocaleTimeString()}</div>
      </div>

      {isUser && (
        <div className="ml-3 flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-lg">{avatar}</div>
        </div>
      )}
    </div>
  );
}
