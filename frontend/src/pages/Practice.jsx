// Import React hooks, routing tools, components, and API client.
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionTimer from '../components/SessionTimer';
import MoodPicker from '../components/MoodPicker';
import MantraPlayer from '../components/MantraPlayer';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import BreathAnimation from '../components/BreathAnimation';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { chakras, getChakrasByLevel } from '../data/chakraData';
import compute5D from '../utils/compute5D';
import { Camera, RefreshCw, Sparkles, AlertCircle, Zap } from 'lucide-react';

// Level-based content restrictions - defines what chakras and breath ratios are available at each level
const LEVEL_CONFIG = {
  beginner: {
    chakras: ['Root', 'Sacral', 'Solar Plexus'],
    breathRatio: '4-4-4 sec',
    sessionLength: '5-10 min',
    hasBreathOfFire: false,
    mantraRepetitions: 5,
    exercises: [
      'Gentle seated breath awareness',
      'Root grounding stance',
      'Sacral pulse movement',
      'Simple chanting for solar plexus'
    ]
  },
  intermediate: {
    chakras: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
    breathRatio: '6-6-6 sec',
    sessionLength: '15-20 min',
    hasBreathOfFire: true,
    mantraRepetitions: 7,
    exercises: [
      'Full-body flow with spine lifts',
      'Heart-opening chest expansion',
      'Throat vibration chant',
      'Balanced seated breath cycles'
    ]
  },
  advanced: {
    chakras: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
    breathRatio: '8-8-8 sec',
    sessionLength: '20-30 min',
    hasBreathOfFire: true,
    mantraRepetitions: 'Full sequence',
    exercises: [
      'Advanced pranayama with breath retention',
      'Crown-opening meditation hold',
      'Dynamic chakra activation rounds',
      'Mantra-led energy circulation'
    ]
  }
};

const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced'];

// Practice page component - enables live pose detection with mood tracking and level-based content filtering.
const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  
  // User level state - determines which content is available
  const [userLevel, setUserLevel] = useState('beginner');
  const [levelConfig, setLevelConfig] = useState(LEVEL_CONFIG.beginner);
  
  // Mood check-in state
  const [showMoodBefore, setShowMoodBefore] = useState(true);
  const [moodBefore, setMoodBefore] = useState(3);

  // Safety disclaimer reminder state (shown once per practice session)
  const [showSafetyReminder, setShowSafetyReminder] = useState(true);
  
  // Real-time predictions state
  const [predictions, setPredictions] = useState([]);
  const [dominantChakra, setDominantChakra] = useState('');

  // Mantra player state - tracks TTS playback and completion for spiritual score
  const [selectedChakra, setSelectedChakra] = useState(null);
  const [availableChakras, setAvailableChakras] = useState([]);
  const [mantraPlaybackComplete, setMantraPlaybackComplete] = useState(false);
  // Breath cycle tracking for Prana scoring
  const [breathCycleCount, setBreathCycleCount] = useState(0);
  const [breathTargetCycles, setBreathTargetCycles] = useState(3);
  const [breathCompleted, setBreathCompleted] = useState(false);
  const [breathActive, setBreathActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  // Reset key to force BreathAnimation reset when starting/stopping
  const [breathResetKey, setBreathResetKey] = useState(0);
  
  // Before-snapshot: captured once after mood check-in, before camera starts
  const [beforeSnapshot, setBeforeSnapshot] = useState(null);

  // Stats tracking references
  const posesTracked = useRef(new Map());
  const confidenceSum = useRef(0);
  const confidenceCount = useRef(0);
  const distractionCount = useRef(0);
  const isRunning = useRef(false);
  const streamRef = useRef(null);
  
  // DOM references
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const requestRef = useRef(null);

  const updateLevelState = (level) => {
    if (!LEVEL_CONFIG[level]) level = 'beginner';
    setUserLevel(level);
    setLevelConfig(LEVEL_CONFIG[level]);
    setBreathTargetCycles(level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 6);
    const levelChakras = getChakrasByLevel(level);
    setAvailableChakras(levelChakras);
    if (levelChakras.length > 0) {
      setSelectedChakra(levelChakras[0]);
    }
    setBreathActive(false);
    setBreathResetKey((k) => k + 1);
    setBreathCompleted(false);
    setBreathCycleCount(0);
    setMantraPlaybackComplete(false);
  };

  // Load external TensorFlow.js and Teachable Machine libraries dynamically.
  useEffect(() => {
    // Fetch user's level to determine available content
    const fetchUserLevel = async () => {
      try {
        const res = await api.get('/api/level/status');
        const level = res.data.data.level;
        updateLevelState(level);
      } catch (err) {
        console.log('Could not fetch user level, defaulting to beginner');
        updateLevelState('beginner');
      }
    };
    fetchUserLevel();
  }, []);

  useEffect(() => {
    const loadScripts = async () => {
      setLoadingText('Loading TensorFlow.js...');
      try {
        if (!window.tf) {
          const tfScript = document.createElement('script');
          tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js';
          tfScript.async = true;
          document.body.appendChild(tfScript);
          await new Promise((resolve) => {
            tfScript.onload = resolve;
          });
        }
        
        setLoadingText('Loading Teachable Machine Pose...');
        if (!window.tmPose) {
          const tmScript = document.createElement('script');
          tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js';
          tmScript.async = true;
          document.body.appendChild(tmScript);
          await new Promise((resolve) => {
            tmScript.onload = resolve;
          });
        }
        
        setModelLoaded(true);
      } catch (err) {
        console.error('Failed to load libraries:', err);
        setLoadingText('Failed to load required AI libraries.');
      }
    };
    loadScripts();

    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    setLoadingText('Starting Camera & Model...');
    setCameraError('');
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const modelURL = `${baseUrl}components/model.json`;
      const metadataURL = `${baseUrl}components/metadata.json`;
      
      if (!window.tmPose || !window.tmPose.load) {
        throw new Error('Teachable Machine library not loaded yet. Refresh the page and try again.');
      }

      // Load model using TM libraries.
      const model = await window.tmPose.load(modelURL, metadataURL);
      window.poseModel = model;

      // Access camera stream.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setLoadingText('Camera active');
      setWebcamActive(true);
      isRunning.current = true;
      requestRef.current = requestAnimationFrame(predictLoop);
      // Reset breath cycle tracker when starting practice
      setBreathCycleCount(0);
      setBreathCompleted(false);
      setBreathResetKey((k) => k + 1);
    } catch (error) {
      console.error('Webcam initialization failed:', error);
      const message = error?.message || 'Failed to access camera or load model files.';
      setCameraError(message);
      alert(`${message} Please check permissions and folder files.`);
    }
  };

  const handleStartBreath = () => {
    setBreathActive(true);
    setBreathResetKey((k) => k + 1);
    setBreathCompleted(false);
    setBreathCycleCount(0);
  };

  const stopWebcam = () => {
    isRunning.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setWebcamActive(false);
    // reset breath when camera stopped so UI shows initial state next start
    setBreathResetKey((k) => k + 1);
  };

  const predictLoop = async () => {
    if (!isRunning.current || !window.poseModel || !videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState < 2) {
      requestRef.current = requestAnimationFrame(predictLoop);
      return;
    }

    try {
      const model = window.poseModel;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Draw current video frame to canvas.
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Estimate pose.
      const { pose, posenetOutput } = await model.estimatePose(videoRef.current);
      const predictions = await model.predict(posenetOutput);
      
      setPredictions(predictions);

      if (pose) {
        drawSkeleton(pose, ctx);
      }

      // Track classifications.
      const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
      const topPred = sorted[0];

      if (topPred && topPred.probability > 0.6) {
        const count = posesTracked.current.get(topPred.className) || 0;
        posesTracked.current.set(topPred.className, count + 1);
        
        // Accumulate statistics.
        confidenceSum.current += topPred.probability;
        confidenceCount.current += 1;
        
        // Update dominant chakra.
        let highest = '';
        let maxVal = 0;
        posesTracked.current.forEach((val, key) => {
          if (val > maxVal) {
            maxVal = val;
            highest = key;
          }
        });
        setDominantChakra(highest.replace(' CHAKRA', ''));
      }
    } catch (err) {
      console.error('Error during pose classification loop:', err);
    }

    requestRef.current = requestAnimationFrame(predictLoop);
  };

  const drawSkeleton = (pose, ctx) => {
    const minConfidence = 0.5;

    // Draw keypoints.
    pose.keypoints.forEach((kp) => {
      if (kp.score >= minConfidence) {
        ctx.beginPath();
        ctx.arc(kp.position.x, kp.position.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#6B4FA0'; // Deep Purple
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      }
    });

    // Draw lines.
    const adjacentKeyPoints = window.tmPose.getAdjacentKeyPoints(pose.keypoints, minConfidence);
    ctx.strokeStyle = '#2D9596'; // Teal
    ctx.lineWidth = 3;
    adjacentKeyPoints.forEach((pair) => {
      ctx.beginPath();
      ctx.moveTo(pair[0].position.x, pair[0].position.y);
      ctx.lineTo(pair[1].position.x, pair[1].position.y);
      ctx.stroke();
    });
  };

  const handleStopSession = (durationMinutes) => {
    stopWebcam();

    // Calculate final score on 1-10 scale.
    const avgConfidence = confidenceCount.current > 0 
      ? (confidenceSum.current / confidenceCount.current) * 10
      : 5.0;

    // "After" metrics captured from live session
    const afterMetrics = {
      pose_confidence: confidenceCount.current > 0 ? (confidenceSum.current / confidenceCount.current) * 100 : 75,
      shake_count: 0,
      breath_cycles_completed: breathCycleCount,
      breath_cycles_assigned: breathTargetCycles,
      distraction_count: distractionCount.current,
      positive_expression_frames: 0,
      total_frames: confidenceCount.current || 100,
      mantra_played: mantraPlaybackComplete,
      duration_minutes: durationMinutes,
      target_duration_minutes: levelConfig.sessionLength ? parseInt(levelConfig.sessionLength) : 10
    };

    // Compute 5D index using available signals (minimal frontend-only computation)
    const fiveD = compute5D({
      score: avgConfidence,
      breathCompleted: breathCompleted,
      breathCycles: breathCycleCount,
      breathTarget: breathTargetCycles,
      mantraPlayed: mantraPlaybackComplete
    });

    // Direct to LogSession passing state keys.
    navigate('/log-session', {
      state: {
        duration: durationMinutes,
        score: parseFloat(avgConfidence.toFixed(2)),
        poses_detected: confidenceCount.current,
        chakra_focus: dominantChakra || 'General Meditation',
        mood_before: moodBefore,
        breath_completed: breathCompleted,
        mantra_played: mantraPlaybackComplete,
        breath_cycles: breathCycleCount,
        five_d_score: parseFloat(fiveD.five_d_score.toFixed(2)),
        five_d: fiveD,
        // Before/after metrics for InsightScreen comparison
        before_metrics: beforeSnapshot,
        after_metrics: afterMetrics
      }
    });
  };

  if (!modelLoaded) {
    return <LoadingSpinner text={loadingText} />;
  }

  // Show safety reminder before mood check-in (safety first!)
  if (showSafetyReminder) {
    return (
      <SafetyDisclaimer 
        mode="short"
        onSkip={() => setShowSafetyReminder(false)}
      />
    );
  }

  if (showMoodBefore) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col items-center gap-6">
        <div className="w-12 h-12 bg-purple-50 text-accent-primary rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary text-center">Initial Check-in</h2>
        <p className="text-sm text-text-secondary text-center leading-relaxed">
          Take a deep breath and settle in. How is your energy state before we begin?
        </p>
        <MoodPicker value={moodBefore} onChange={setMoodBefore} label="" />

        {/* Show level-based practice settings */}
        <div className="w-full bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Choose your level</p>
              <div className="flex flex-wrap gap-2">
                {LEVEL_OPTIONS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateLevelState(level)}
                    className={`px-3 py-2 rounded-2xl text-xs font-semibold transition ${userLevel === level ? 'bg-purple-700 text-white' : 'bg-white text-gray-700 border border-purple-100 hover:bg-purple-50'}`}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Your {userLevel} Level Settings:</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div><span className="font-semibold">Chakras:</span> {levelConfig.chakras.join(', ')}</div>
                <div><span className="font-semibold">Breath Ratio:</span> {levelConfig.breathRatio}</div>
                <div><span className="font-semibold">Session:</span> {levelConfig.sessionLength}</div>
                {levelConfig.hasBreathOfFire && (
                  <div className="text-yellow-600 font-semibold">⚠️ Breath of Fire: Available</div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Level-specific practice plan</p>
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                {levelConfig.exercises.map((exercise) => (
                  <li key={exercise}>{exercise}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            // Capture "before" snapshot: baseline metrics at session start
            setBeforeSnapshot({
              pose_confidence: 0,
              shake_count: 0,
              breath_cycles_completed: 0,
              breath_cycles_assigned: breathTargetCycles,
              distraction_count: 0,
              positive_expression_frames: 0,
              total_frames: 100,
              mantra_played: false,
              duration_minutes: 0,
              target_duration_minutes: levelConfig.sessionLength ? parseInt(levelConfig.sessionLength) : 10
            });
            setShowMoodBefore(false);
          }}
          className="w-full mt-4 py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition"
        >
          Proceed to Practice
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_380px] gap-6">
      {/* Video & canvas Column */}
      <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent-primary" />
            Live Practice Space
          </h2>
          {webcamActive && (
            <span className="flex items-center gap-1.5 text-xs text-success font-bold">
              <span className="h-2.5 w-2.5 bg-success rounded-full animate-pulse"></span>
              AI Core Active
            </span>
          )}
        </div>

        <div className="relative aspect-[4/3] bg-background-secondary rounded-3xl overflow-hidden border border-border">
          {!webcamActive ? (
            <div className="flex flex-col items-center gap-4 text-center p-6">
              <span className="text-4xl">📷</span>
              <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
                Connect your webcam and align yourself in the camera view before launching predictions.
              </p>
              <button
                onClick={startWebcam}
                className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-full hover:bg-opacity-90 transition shadow-sm"
              >
                Enable Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                width="640"
                height="480"
                playsInline
                muted
                autoPlay
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                width="640"
                height="480"
              />
            </>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          This camera module uses the trained pose model you provided for yoga pose detection. It evaluates the body posture against the pose classes in the model, not a full medical posture scan.
        </div>

        {cameraError && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p><span className="font-semibold">Camera error:</span> {cameraError}</p>
            <p>Please allow camera access and verify the model files exist at <code className="font-mono">/components/model.json</code>.</p>
          </div>
        )}
        {webcamActive && (
          <div className="flex justify-end">
            <button
              onClick={stopWebcam}
              className="text-xs font-bold text-red-500 border border-red-100 hover:bg-red-50 px-3.5 py-1.5 rounded-full transition"
            >
              Disable Camera
            </button>
          </div>
        )}
      </div>

      {/* Control panel and AI readouts */}
      <div className="flex flex-col gap-6">
        {/* SessionTimer Card */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
          <SessionTimer onStop={handleStopSession} />
        </div>

        {/* Chakra Selector for Mantra */}
        {availableChakras.length > 0 && (
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              Select Chakra for Mantra
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableChakras.map((chakra) => (
                <button
                  key={chakra.id}
                  onClick={() => setSelectedChakra(chakra)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                    selectedChakra?.id === chakra.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="block text-lg mb-0.5">{chakra.emoji || '◉'}</span>
                  {chakra.englishName.replace(' Chakra', '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mantra Player Component */}
        {selectedChakra && (
          <MantraPlayer
            chakra={selectedChakra}
            level={userLevel}
            disabled={webcamActive}
            onPlaybackComplete={() => setMantraPlaybackComplete(true)}
          />
        )}

        {/* Breath animation and cycle tracker for Prana scoring */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text-primary">Breath Practice</h3>
            <span className="text-xs text-text-secondary">Target: {breathTargetCycles} cycles</span>
          </div>
          {!breathCompleted ? (
            <div className="space-y-4">
              {!breathActive ? (
                <div className="text-sm text-gray-600">
                  Press start when you are ready. The breath trainer will remain paused until you choose to begin.
                </div>
              ) : null}
              {!breathActive ? (
                <button
                  onClick={handleStartBreath}
                  className="w-full py-3 bg-accent-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition"
                >
                  Start Breath Practice
                </button>
              ) : (
                <BreathAnimation
                  level={userLevel}
                  targetCycles={breathTargetCycles}
                  onCycleComplete={(n) => setBreathCycleCount(n)}
                  onComplete={() => setBreathCompleted(true)}
                  resetKey={breathResetKey}
                  autoStart={true}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-green-700 font-semibold">Breath cycles complete ✅</div>
          )}
        </div>

        {/* AI Predictions feedback */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">Pose Classifications</h3>
            {/* Show level badge with available chakras hint */}
            <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
              {userLevel} Level
            </span>
          </div>
          
          {predictions.length === 0 ? (
            <p className="text-xs text-text-secondary leading-relaxed italic">
              Awaiting camera stream feedback... Align your full body in the center frame.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                <span className="text-xs text-text-secondary font-medium">Dominant Energy Center</span>
                <p className="text-lg font-bold text-accent-primary">{dominantChakra || 'Evaluating...'}</p>
              </div>

              {predictions.map((p) => {
                const chakraName = p.className.replace(' CHAKRA', '');
                // Filter predictions: only show chakras available at user's level
                const isAvailable = levelConfig.chakras.includes(chakraName);
                const probability = Math.round(p.probability * 100);
                
                return isAvailable ? (
                  <div key={p.className} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-text-primary truncate max-w-[150px]">{chakraName}</span>
                      <span className="text-text-secondary">{probability}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-background-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-secondary rounded-full transition-all duration-300"
                        style={{ width: `${probability}%` }}
                      ></div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export Practice.
export default Practice;
