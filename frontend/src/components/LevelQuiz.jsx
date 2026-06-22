import React, { useState } from 'react';
import { BookOpen, Radio } from 'lucide-react';
import api from '../api/axios';

/**
 * LevelQuiz Component
 * 
 * Onboarding quiz shown after first email verification.
 * Collects user background in 3 areas and sets initial practitioner level.
 * Levels: beginner, intermediate, advanced
 */
const LevelQuiz = ({ onComplete }) => {
  // Track answers for all 3 quiz questions
  const [answers, setAnswers] = useState({
    q1_meditation_experience: '',
    q2_pranayama_knowledge: '',
    q3_session_duration: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz question definitions with answer options
  const quizQuestions = [
    {
      id: 'q1_meditation_experience',
      label: 'Have you practiced yoga or meditation before?',
      options: [
        { value: 'never', label: 'Never', icon: '🌱' },
        { value: 'a_few_times', label: 'A few times', icon: '🌿' },
        { value: 'regularly', label: 'Regularly', icon: '🌳' }
      ]
    },
    {
      id: 'q2_pranayama_knowledge',
      label: 'Are you familiar with breathing exercises (pranayama)?',
      options: [
        { value: 'no', label: 'No', icon: '🔵' },
        { value: 'a_little', label: 'A little', icon: '🟣' },
        { value: 'yes_comfortable', label: 'Yes, comfortable', icon: '🟡' }
      ]
    },
    {
      id: 'q3_session_duration',
      label: 'How much time can you give per session?',
      options: [
        { value: '5_10_min', label: '5-10 min', icon: '⏱️' },
        { value: '15_20_min', label: '15-20 min', icon: '⏰' },
        { value: '20_30_min', label: '20-30 min', icon: '⌛' }
      ]
    }
  ];

  // Handle answer selection for a specific question
  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // Submit quiz and send answers to backend
  const handleSubmit = async () => {
    // Validate all questions answered
    if (!answers.q1_meditation_experience || !answers.q2_pranayama_knowledge || !answers.q3_session_duration) {
      setError('Please answer all questions before continuing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send quiz answers to backend for processing
      const res = await api.post('/api/level/quiz', answers);
      if (res.data.success) {
        // Call parent callback with selected level
        onComplete(res.data.data.level);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to submit quiz. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl w-full border border-purple-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customize Your Journey</h1>
            <p className="text-sm text-gray-500 mt-1">Answer 3 quick questions to get started at the right level</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}

        {/* Quiz questions */}
        <div className="space-y-8 mb-8">
          {quizQuestions.map((question, idx) => (
            <div key={question.id}>
              {/* Question number and text */}
              <label className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                {question.label}
              </label>

              {/* Radio button options for this question */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                      answers[question.id] === option.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    {/* Radio button */}
                    <Radio
                      className={`w-5 h-5 ${
                        answers[question.id] === option.value ? 'text-purple-600' : 'text-gray-300'
                      }`}
                    />
                    {/* Icon and label */}
                    <div className="flex-1">
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </div>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswer(question.id, option.value)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !answers.q1_meditation_experience || !answers.q2_pranayama_knowledge || !answers.q3_session_duration}
          className={`w-full py-4 font-bold text-lg rounded-xl transition ${
            loading || !answers.q1_meditation_experience || !answers.q2_pranayama_knowledge || !answers.q3_session_duration
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
          }`}
        >
          {loading ? 'Analyzing Your Answers...' : 'Get Started'}
        </button>

        {/* Info text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You can adjust your level anytime after completing sessions
        </p>
      </div>
    </div>
  );
};

export default LevelQuiz;
