import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import SafetyReminder from '../components/SafetyReminder';
import MoodCheckin from '../components/MoodCheckin';
import BreathWarmup from '../components/BreathWarmup';
import ChakraIntro from '../components/ChakraIntro';
import PosePractice from '../components/PosePractice';
import ChantingWithPose from '../components/ChantingWithPose';
import BreathCooldown from '../components/BreathCooldown';
import InsightScreen from '../components/InsightScreen';
import RestDayScreen from '../components/RestDayScreen';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// DayFlow: Orchestrates the 10-step practice sequence for a program day
const DayFlow = () => {
  const { programId, dayId } = useParams();
  const navigate = useNavigate();
  
  const [programDay, setProgramDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  // Session data accumulator
  const [sessionData, setSessionData] = useState({
    mood_before: null,
    mood_after: null,
    duration_minutes: 0,
    pose_confidence: 75,
    shake_count: 0,
    breath_cycles_completed: 0,
    breath_cycles_assigned: 3,
    distraction_count: 0,
    positive_expression_frames: 0,
    total_frames: 100,
    mantra_played: false,
    notes: ''
  });

  // Before-snapshot: captured once after initial mood check-in
  const [beforeSnapshot, setBeforeSnapshot] = useState(null);

  useEffect(() => {
    // Fetch program day details
    const fetchDayDetails = async () => {
      try {
        const res = await api.get(`/api/programs/${programId}/days`);
        const { days } = res.data.data;
        const day = days.find(d => d.id === parseInt(dayId));
        
        if (!day) {
          setError('Day not found.');
          return;
        }

        setProgramDay(day);
        
        // Initialize breath cycles based on day (from program level config)
        setSessionData(prev => ({
          ...prev,
          breath_cycles_assigned: day.is_rest_day ? 1 : 3
        }));
      } catch (err) {
        setError('Failed to load day details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDayDetails();
  }, [programId, dayId]);

  // Handle step progression
  const handleNextStep = (stepData = {}) => {
    // Merge any step-specific data
    setSessionData(prev => {
      const updated = { ...prev, ...stepData };
      // Capture before snapshot right after mood_before is set (step 1 → step 2)
      if (stepData.mood_before && !beforeSnapshot) {
        setBeforeSnapshot({
          pose_confidence: 0,
          shake_count: 0,
          breath_cycles_completed: 0,
          breath_cycles_assigned: updated.breath_cycles_assigned || 3,
          distraction_count: 0,
          positive_expression_frames: 0,
          total_frames: 100,
          mantra_played: false,
          duration_minutes: 0,
          target_duration_minutes: programDay?.session_length_minutes || 10
        });
      }
      return updated;
    });

    if (currentStep < getSteps().length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Complete the day and submit session
  const handleCompleteDay = async (finalData = {}) => {
    // Ensure core session values are present before saving.
    if (!sessionData.mood_before || !sessionData.mood_after || !sessionData.duration_minutes) {
      setError('Please complete the mood check-ins and practice duration before finishing this day.');
      return;
    }

    try {
      setCompleting(true);
      
      const finalSessionData = {
        ...sessionData,
        ...finalData,
        // Pass before snapshot for backend 5D comparison
        before_metrics: beforeSnapshot || {
          pose_confidence: 0,
          shake_count: 0,
          breath_cycles_completed: 0,
          breath_cycles_assigned: sessionData.breath_cycles_assigned || 3,
          distraction_count: 0,
          positive_expression_frames: 0,
          total_frames: 100,
          mantra_played: false,
          duration_minutes: 0,
          target_duration_minutes: programDay?.session_length_minutes || 10
        }
      };

      const res = await api.post(`/api/programs/day/${dayId}/complete`, finalSessionData);

      if (res.data.success) {
        // Return to program overview after completing the day.
        navigate(`/programs/${programId}`, {
          state: {
            completedDay: true,
            insightData: res.data.data.insightData,
            newBadges: res.data.data.newBadges || []
          }
        });
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.response?.data?.message || 'Failed to complete day.';
      setError(msg);
      console.error('Complete day error:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !programDay) {
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            {error || 'Day not found.'}
          </h2>
          <button
            onClick={() => navigate(`/programs/${programId}`)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Program
          </button>
        </div>
      </div>
    );
  }

  // Rest day handling
  if (programDay.is_rest_day) {
    return (
      <RestDayScreen
        programId={programId}
        dayNumber={programDay.day_number}
        onComplete={handleCompleteDay}
      />
    );
  }

  // Get steps based on day type
  const getSteps = () => {
    return [
      { id: 1, name: 'Safety Reminder', component: SafetyReminder },
      { id: 2, name: 'Mood Check-in (Before)', component: MoodCheckin },
      { id: 3, name: 'Breathing Warmup', component: BreathWarmup },
      { id: 4, name: 'Chakra Introduction', component: ChakraIntro },
      { id: 5, name: 'Pose Practice', component: PosePractice },
      { id: 6, name: 'Chanting with Pose', component: ChantingWithPose },
      { id: 7, name: 'Cool-down Breathing', component: BreathCooldown },
      { id: 8, name: 'Mood Check-in (After)', component: MoodCheckin },
      { id: 9, name: 'Insight Screen', component: InsightScreen }
    ];
  };

  const steps = getSteps();
  const CurrentStepComponent = steps[currentStep].component;
  const isAfterMood = currentStep === 7;
  const isLastStep = currentStep === steps.length - 1;
  const stepProgress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/programs/${programId}`)}
            className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Program
          </button>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Day {programDay.day_number}: {programDay.chakra_focus || 'Rest Day'}
          </h1>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
              </span>
              <span className="text-sm font-semibold text-purple-600">
                {stepProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <CurrentStepComponent
            programDay={programDay}
            sessionData={sessionData}
            stepNumber={currentStep + 1}
            isAfterMood={isAfterMood}
            isBefore={currentStep === 1}
            onNext={handleNextStep}
            onComplete={isLastStep ? handleCompleteDay : undefined}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-slate-600 text-white hover:bg-slate-700 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <span className="text-sm text-slate-600 font-semibold">
            {currentStep + 1} / {steps.length}
          </span>

          {!isLastStep ? (
            <button
              onClick={() => handleNextStep()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all active:scale-95"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => handleCompleteDay()}
              disabled={completing}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                completing
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
            >
              {completing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin" />
                  Completing...
                </>
              ) : (
                '✓ Complete Day'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayFlow;
