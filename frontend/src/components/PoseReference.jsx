import React from 'react';
import { getChakraByName } from '../data/chakraData';
import { getYogaPoseSvg, getMudraSvg } from '../data/poseSvgs';
import { Clock, CheckCircle } from 'lucide-react';

const PoseReference = ({ chakraName, practiceStyle, mode = 'full', compact = false }) => {
  const chakra = getChakraByName(chakraName);
  if (!chakra) return null;

  const practice = practiceStyle === 'mudra' ? chakra.mudra : chakra.yogaPose;
  if (!practice) return null;

  const SvgComponent = practiceStyle === 'mudra'
    ? getMudraSvg(chakra.id)
    : getYogaPoseSvg(chakra.id);

  // Compact mode - tiny inline reference
  if (compact) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
        <div className="flex-shrink-0 p-2 rounded-lg" style={{ backgroundColor: `${chakra.color}15` }}>
          <SvgComponent size={64} color={chakra.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: chakra.color }}>
            {practiceStyle === 'mudra' ? 'Mudra' : 'Yoga Pose'}
          </p>
          <h4 className="text-sm font-bold text-slate-900 leading-tight">{practice.name}</h4>
          {practice.sanskritName && (
            <p className="text-[10px] text-slate-500 italic">{practice.sanskritName}</p>
          )}
          {practice.subtitle && (
            <p className="text-[10px] text-slate-500 italic">{practice.subtitle}</p>
          )}
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{practice.description}</p>
        </div>
      </div>
    );
  }

  // Instruction mode - hero SVG + numbered steps + alignment tips
  if (mode === 'instruction') {
    return (
      <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
        {/* Hero SVG + pose name */}
        <div className="flex flex-col items-center text-center">
          <div
            className="p-4 rounded-2xl mb-3"
            style={{ backgroundColor: `${chakra.color}12` }}
          >
            <SvgComponent size={140} color={chakra.color} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{practice.name}</h3>
          {(practice.sanskritName || practice.subtitle) && (
            <p className="text-sm text-slate-500 italic mt-0.5">
              {practice.sanskritName || practice.subtitle}
            </p>
          )}
          <p className="text-xs text-slate-600 mt-2 max-w-[280px]">{practice.description}</p>
        </div>

        {/* How to Perform - numbered steps */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            How to Perform
          </h4>
          <div className="flex flex-col gap-2">
            {practice.steps.map((step, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                  style={{ backgroundColor: chakra.color }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alignment Tips */}
        {practice.alignmentTips && practice.alignmentTips.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Alignment Tips
            </h4>
            <div className="flex flex-col gap-1.5">
              {practice.alignmentTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1 text-xs">&#8226;</span>
                  <p className="text-xs text-amber-800 leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits + Duration */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 border border-green-100 rounded-lg p-2.5">
            <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Benefits</p>
            <p className="text-[11px] text-green-800 leading-snug">{practice.benefits}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Duration
            </p>
            <p className="text-[11px] text-blue-800">{practice.duration}</p>
          </div>
        </div>
      </div>
    );
  }

  // Full mode - used in PracticeStyleChooser preview
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 p-3 rounded-xl"
          style={{ backgroundColor: `${chakra.color}15` }}
        >
          <SvgComponent size={100} color={chakra.color} />
        </div>
        <div className="flex-1">
          <p
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: chakra.color }}
          >
            {practiceStyle === 'mudra' ? 'Mudra Practice' : 'Yoga Pose'}
          </p>
          <h3 className="text-lg font-bold text-slate-900">{practice.name}</h3>
          {(practice.sanskritName || practice.subtitle) && (
            <p className="text-sm text-slate-500 italic">
              {practice.sanskritName || practice.subtitle}
            </p>
          )}
          <p className="text-sm text-slate-600 mt-2">{practice.description}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Step-by-Step Instructions
        </h4>
        <div className="flex flex-col gap-2.5">
          {practice.steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{ backgroundColor: chakra.color }}
              >
                {i + 1}
              </span>
              <p className="text-sm text-slate-700 leading-snug pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {practice.alignmentTips && practice.alignmentTips.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Alignment Tips
          </h4>
          <div className="flex flex-col gap-1.5">
            {practice.alignmentTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 text-sm">&#8226;</span>
                <p className="text-sm text-amber-800">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Benefits</p>
          <p className="text-xs text-green-800">{practice.benefits}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Duration
          </p>
          <p className="text-xs text-blue-800">{practice.duration}</p>
        </div>
      </div>
    </div>
  );
};

export default PoseReference;
