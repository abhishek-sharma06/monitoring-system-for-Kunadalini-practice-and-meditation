import React, { useEffect, useState, useRef } from 'react';
import SessionTimer from './SessionTimer';
import { Camera, AlertCircle } from 'lucide-react';

// PosePractice: Step 5 - TensorFlow.js pose detection with Teachable Machine model
const PosePractice = ({ programDay, onNext, sessionData }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [loadingText, setLoadingText] = useState('Loading AI libraries...');
  const [predictions, setPredictions] = useState([]);
  const [dominantChakra, setDominantChakra] = useState('');

  const targetDuration = programDay.session_length_minutes || 10;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const requestRef = useRef(null);
  const isRunning = useRef(false);
  const posesTracked = useRef(new Map());
  const confidenceSum = useRef(0);
  const confidenceCount = useRef(0);
  const modelRef = useRef(null);

  // Load TensorFlow.js and Teachable Machine libraries, then start camera
  useEffect(() => {
    let cancelled = false;

    const loadAndStart = async () => {
      try {
        setLoadingText('Loading TensorFlow.js...');
        if (!window.tf) {
          const tfScript = document.createElement('script');
          tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js';
          tfScript.async = true;
          document.body.appendChild(tfScript);
          await new Promise((resolve, reject) => {
            tfScript.onload = resolve;
            tfScript.onerror = reject;
          });
        }
        if (cancelled) return;

        setLoadingText('Loading Pose Model...');
        if (!window.tmPose) {
          const tmScript = document.createElement('script');
          tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js';
          tmScript.async = true;
          document.body.appendChild(tmScript);
          await new Promise((resolve, reject) => {
            tmScript.onload = resolve;
            tmScript.onerror = reject;
          });
        }
        if (cancelled) return;

        setLoadingText('Loading your trained model...');
        const baseUrl = import.meta.env.BASE_URL || '/';
        const modelURL = `${baseUrl}components/model.json`;
        const metadataURL = `${baseUrl}components/metadata.json`;

        if (!window.tmPose || !window.tmPose.load) {
          throw new Error('Teachable Machine library not loaded.');
        }
        const model = await window.tmPose.load(modelURL, metadataURL);
        if (cancelled) return;
        modelRef.current = model;

        setLoadingText('Starting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setCameraReady(true);
        isRunning.current = true;
        requestRef.current = requestAnimationFrame(predictLoop);
      } catch (err) {
        console.error('Pose detection init failed:', err);
        if (!cancelled) {
          setCameraError(err.message || 'Failed to initialize pose detection.');
        }
      }
    };

    loadAndStart();

    return () => {
      cancelled = true;
      isRunning.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const predictLoop = async () => {
    if (!isRunning.current || !modelRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }
    if (videoRef.current.readyState < 2) {
      requestRef.current = requestAnimationFrame(predictLoop);
      return;
    }

    try {
      const model = modelRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const { pose, posenetOutput } = await model.estimatePose(videoRef.current);
      const preds = await model.predict(posenetOutput);

      setPredictions(preds);

      if (pose) {
        drawSkeleton(pose, ctx);
      }

      const sorted = [...preds].sort((a, b) => b.probability - a.probability);
      const topPred = sorted[0];

      if (topPred && topPred.probability > 0.6) {
        const count = posesTracked.current.get(topPred.className) || 0;
        posesTracked.current.set(topPred.className, count + 1);

        confidenceSum.current += topPred.probability;
        confidenceCount.current += 1;

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
      console.error('Prediction error:', err);
    }

    requestRef.current = requestAnimationFrame(predictLoop);
  };

  const drawSkeleton = (pose, ctx) => {
    const minConfidence = 0.5;

    pose.keypoints.forEach((kp) => {
      if (kp.score >= minConfidence) {
        ctx.beginPath();
        ctx.arc(kp.position.x, kp.position.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#6B4FA0';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      }
    });

    const adjacentKeyPoints = window.tmPose.getAdjacentKeyPoints(pose.keypoints, minConfidence);
    ctx.strokeStyle = '#2D9596';
    ctx.lineWidth = 3;
    adjacentKeyPoints.forEach((pair) => {
      ctx.beginPath();
      ctx.moveTo(pair[0].position.x, pair[0].position.y);
      ctx.lineTo(pair[1].position.x, pair[1].position.y);
      ctx.stroke();
    });
  };

  const handleCompleteSession = () => {
    isRunning.current = false;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const avgConfidence = confidenceCount.current > 0
      ? (confidenceSum.current / confidenceCount.current) * 100
      : 75;

    onNext({
      duration_minutes: Math.ceil(timeSpent / 60),
      pose_confidence: avgConfidence,
      shake_count: 0,
      poses_detected: confidenceCount.current,
      distraction_count: Math.max(0, 100 - confidenceCount.current),
      chakra_focus: dominantChakra || sessionData?.chakra_focus || 'General Meditation'
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Pose Practice with Detection
        </h2>
        <p className="text-sm text-slate-600">
          Hold poses while AI tracks your form. Target: {targetDuration} min
        </p>
      </div>

      {/* Split layout: camera left, controls right */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_380px] gap-4">

        {/* Left: Camera feed (always prominent) */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="relative aspect-[4/3] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              width="640"
              height="480"
              style={{ display: cameraReady ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              width="640"
              height="480"
              style={{ display: cameraReady ? 'block' : 'none' }}
            />
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Camera className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-300">{loadingText}</p>
              </div>
            )}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-red-900/20">
                <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                <p className="text-sm text-red-300 font-semibold">Camera Error</p>
                <p className="text-xs text-red-400 mt-1">{cameraError}</p>
              </div>
            )}
            {cameraReady && (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                AI Active
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls sidebar */}
        <div className="flex flex-col gap-4">

          {/* Timer */}
          {cameraReady && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <SessionTimer
                targetDuration={targetDuration}
                onTimeUpdate={setTimeSpent}
                onTargetReached={handleCompleteSession}
              />
            </div>
          )}

          {/* Pose classifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pose Classifications</h4>
            {predictions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {cameraReady ? 'Align your full body in frame...' : 'Waiting for camera...'}
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {dominantChakra && (
                  <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium uppercase">Dominant</span>
                    <p className="text-base font-bold text-purple-700">{dominantChakra}</p>
                  </div>
                )}
                {predictions.slice(0, 5).map((p) => {
                  const chakraName = p.className.replace(' CHAKRA', '');
                  const probability = Math.round(p.probability * 100);
                  return (
                    <div key={p.className} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-700 font-medium truncate max-w-[120px]">{chakraName}</span>
                        <span className="text-slate-500 font-semibold">{probability}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${probability}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-blue-600 font-bold uppercase">Time</p>
              <p className="text-lg font-bold text-blue-900">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-purple-600 font-bold uppercase">Poses</p>
              <p className="text-lg font-bold text-purple-900">{confidenceCount.current}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-green-600 font-bold uppercase">Target</p>
              <p className="text-lg font-bold text-green-900">{targetDuration}m</p>
            </div>
          </div>

          {/* Complete button */}
          <button
            onClick={handleCompleteSession}
            disabled={timeSpent < 30}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              timeSpent >= 30
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {timeSpent >= 30 ? 'Continue to Next Step' : `Wait ${Math.ceil((30 - timeSpent) / 10) * 10}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosePractice;
