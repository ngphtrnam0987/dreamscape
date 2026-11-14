import React, { useEffect } from 'react';
import { useWellnessStore } from '../../stores/useWellnessStore';
import { useUIStore } from '../../stores/useUIStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { getTranslation } from '../../locales';
import { Droplets, Eye, X, Check } from 'lucide-react';

export const WellnessNotificationOverlay: React.FC = () => {
  const { activeAlert, dismissAlert, checkTimers } = useWellnessStore();
  const { language, isZenMode } = useUIStore();
  const { playChime } = useAudioStore();

  // Polling wellness interval check every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      checkTimers();
    }, 15000);

    return () => clearInterval(timer);
  }, [checkTimers]);

  // Gentle chime sound when reminder appears
  useEffect(() => {
    if (activeAlert) {
      playChime(0.25);
    }
  }, [activeAlert, playChime]);

  if (!activeAlert || isZenMode) return null;

  const isHydration = activeAlert === 'hydration';

  return (
    <div className="fixed top-14 sm:top-20 right-3 sm:right-6 z-40 max-w-sm w-[calc(100vw-24px)] sm:w-80 p-3.5 rounded-2xl glass-panel shadow-2xl border border-white/20 animate-fade-in pointer-events-auto">
      <div className="flex items-start gap-3">
        {/* Animated Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
            isHydration
              ? 'bg-sky-500/25 border border-sky-400/40 text-sky-300'
              : 'bg-teal-500/25 border border-teal-400/40 text-teal-300'
          }`}
        >
          {isHydration ? (
            <Droplets className="w-5 h-5 animate-bounce" />
          ) : (
            <Eye className="w-5 h-5 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs font-semibold text-white font-display">
            {isHydration
              ? getTranslation(language, 'hydrationReminderTitle')
              : getTranslation(language, 'eyeRestReminderTitle')}
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {isHydration
              ? getTranslation(language, 'hydrationReminderDesc')
              : getTranslation(language, 'eyeRestReminderDesc')}
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={dismissAlert}
              className={`px-3 py-1 rounded-xl text-slate-950 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 ${
                isHydration
                  ? 'bg-sky-400 hover:bg-sky-300'
                  : 'bg-teal-400 hover:bg-teal-300'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {isHydration
                  ? getTranslation(language, 'hydrationAcknowledge')
                  : getTranslation(language, 'eyeRestAcknowledge')}
              </span>
            </button>

            <button
              onClick={dismissAlert}
              className="px-2.5 py-1 rounded-xl glass-pill text-xs text-slate-400 hover:text-white transition-colors"
            >
              {getTranslation(language, 'dismissReminder')}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismissAlert}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg transition-colors shrink-0"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
