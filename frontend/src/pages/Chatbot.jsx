import React from 'react';
import ChatbotPanel from '../components/ChatbotPanel';

export default function Chatbot() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Practice Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <ChatbotPanel />
        </div>
        <div className="md:col-span-1 bg-white border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-2">How to use</h3>
          <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1">
            <li>Breathwork: "How long should I inhale for beginner level?"</li>
            <li>Mantra guidance: "What mantra should I use for the Heart chakra?"</li>
            <li>Chakra info: "What are the benefits of activating the Third Eye?"</li>
            <li>Posture tips: "How do I keep my spine straight during practice?"</li>
            <li>Practice progress: "What does my 5D score mean?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
