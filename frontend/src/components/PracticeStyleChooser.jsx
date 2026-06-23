import React, { useState, useMemo } from 'react';
import { getChakraByName } from '../data/chakraData';
import { getYogaPoseSvg, getMudraSvg } from '../data/poseSvgs';
import { getPosesForDay, getPoseCountDescription } from '../utils/getPosesForDay';
import PoseReference from './PoseReference';
import { Hand, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

// PracticeStyleChooser: Step 5 - Choose between Yoga Poses or Mudras, with progressive pose selection
const PracticeStyleChooser = ({ programDay, onNext, sessionData }) => {
  const [practiceStyle, setPracticeStyle] = useState(null); // 'yoga' | 'mudra'
  const [selectedPoses, setSelectedPoses] = useState([]); // Array of selected pose indices
  const [showPreview, setShowPreview] = useState(null); // Index of pose being previewed

  // Get user level from session or default to beginner
  const userLevel = sessionData?.user_level || 'beginner';
  const dayNumber = programDay.day_number || 1;

  // Get available poses for today
  const availablePoses = useMemo(() => {
    return getPosesForDay(programDay.chakra_focus, userLevel, dayNumber);
  }, [programDay.chakra_focus, userLevel, dayNumber]);

  const focusKeyword = programDay.chakra_focus?.split(' ')[0] || 'Root';
  const chakraNameMap = {
    Root: 'Root Chakra',
    Sacral: 'Sacral Chakra',
    Solar: 'Solar Plexus Chakra',
    Heart: 'Heart Chakra',
    Throat: 'Throat Chakra',
    Third: 'Third Eye Chakra',
    Crown: 'Crown Chakra'
  };
  const chakraFocusName = chakraNameMap[focusKeyword] || programDay.chakra_focus;
  const chakra = getChakraByName(chakraFocusName) || getChakraByName('Root Chakra');

  const handleStyleSelect = (style) => {
    setPracticeStyle(style);
    setSelectedPoses([]);
    setShowPreview(null);
  };

  const handlePoseToggle = (index) => {
    setSelectedPoses(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    const poses = practiceStyle === 'mudra' ? availablePoses.mudras : availablePoses.yogaPoses;
    setSelectedPoses(poses.map((_, i) => i));
  };

  const handleConfirm = () => {
    const poses = practiceStyle === 'mudra' ? availablePoses.mudras : availablePoses.yogaPoses;
    const selected = selectedPoses.map(i => poses[i]);
    onNext({
      practice_style: practiceStyle,
      selected_poses: selected,
      pose_count: selected.length
    });
  };

  const currentPoses = practiceStyle === 'mudra' ? availablePoses.mudras : availablePoses.yogaPoses;
  const hasMultiplePoses = currentPoses.length > 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Choose Your Practice
        </h2>
        <p className="text-slate-600">
          Select how you'd like to work with the{' '}
          <span className="font-semibold" style={{ color: chakra.color }}>
            {programDay.chakra_focus}
          </span>{' '}
          energy today.
        </p>
        {availablePoses.poseCount > 1 && (
          <p className="text-sm text-purple-600 mt-2 font-medium">
            {getPoseCountDescription(availablePoses.poseCount)}
          </p>
        )}
      </div>

      {/* Style choice cards */}
      {!practiceStyle && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleStyleSelect('yoga')}
            className="relative text-left p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-green-100">
                {(() => {
                  const YogaSvg = getYogaPoseSvg(chakra.id);
                  return <YogaSvg size={80} color="#16a34a" />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Yoga Poses
                </h3>
                <p className="text-sm text-slate-500 mt-1">Physical Postures</p>
              </div>
              <p className="text-xs text-slate-600">
                Full-body asanas that activate energy through movement and alignment.
                {hasMultiplePoses && (
                  <span className="block mt-1 font-semibold text-green-600">
                    {availablePoses.yogaPoses.length} poses available today
                  </span>
                )}
              </p>
            </div>
          </button>

          <button
            onClick={() => handleStyleSelect('mudra')}
            className="relative text-left p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100">
                {(() => {
                  const MudraSvg = getMudraSvg(chakra.id);
                  return <MudraSvg size={80} color="#9333ea" />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                  <Hand className="w-5 h-5 text-purple-600" />
                  Mudras
                </h3>
                <p className="text-sm text-slate-500 mt-1">Hand Gestures</p>
              </div>
              <p className="text-xs text-slate-600">
                Sacred hand positions that channel energy flow. Perfect for meditation.
                {hasMultiplePoses && (
                  <span className="block mt-1 font-semibold text-purple-600">
                    {availablePoses.mudras.length} mudras available today
                  </span>
                )}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Pose selection (after style chosen) */}
      {practiceStyle && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleStyleSelect(null)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Change Style
            </button>
            {hasMultiplePoses && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Select All
              </button>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {practiceStyle === 'yoga' ? 'Select Yoga Poses' : 'Select Mudras'}
          </h3>
          <p className="text-sm text-slate-500">
            {hasMultiplePoses
              ? 'Choose which poses to practice today. You can select multiple.'
              : 'Today\'s practice:'}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {currentPoses.map((pose, index) => {
              const isSelected = selectedPoses.includes(index);
              const SvgComponent = practiceStyle === 'mudra'
                ? getMudraSvg(pose.chakraId)
                : getYogaPoseSvg(pose.chakraId);

              return (
                <div key={index} className="space-y-2">
                  <button
                    onClick={() => handlePoseToggle(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${pose.chakraColor}15` }}
                        >
                          <SvgComponent size={50} color={pose.chakraColor} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{pose.name}</h4>
                          {pose.isPrimary && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                              Primary
                            </span>
                          )}
                        </div>
                        {(pose.sanskritName || pose.subtitle) && (
                          <p className="text-xs text-slate-500 italic">
                            {pose.sanskritName || pose.subtitle}
                          </p>
                        )}
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {pose.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Preview toggle */}
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPreview(showPreview === index ? null : index);
                      }}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium ml-4"
                    >
                      {showPreview === index ? 'Hide Preview' : 'Show Visual Guide'}
                    </button>
                  )}

                  {/* Preview area */}
                  {showPreview === index && isSelected && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 ml-4">
                      <PoseReference
                        chakraName={getChakraByName(`${pose.name.split(' ')[0]} Chakra`)?.englishName || chakraFocusName}
                        practiceStyle={practiceStyle}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm button */}
      {practiceStyle && (
        <button
          onClick={handleConfirm}
          disabled={selectedPoses.length === 0}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            selectedPoses.length > 0
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedPoses.length > 0
            ? `Continue with ${selectedPoses.length} ${practiceStyle === 'yoga' ? 'Pose' : 'Mudra'}${selectedPoses.length > 1 ? 's' : ''}`
            : 'Select at least one pose'}
        </button>
      )}
    </div>
  );
};

export default PracticeStyleChooser;
