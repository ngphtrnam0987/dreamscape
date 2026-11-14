import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { audioEngine } from '../../audio/AudioEngine';

type BreathingPattern = 'box' | '478' | 'calm';

interface BreathPhase {
  nameKey: 'inhale' | 'hold' | 'exhale' | 'rest';
  seconds: number;
  scaleTarget: number; // 1.0 (exhale) to 1.7 (inhale)
}

const PATTERNS: Record<BreathingPattern, { nameKey: string; phases: BreathPhase[] }> = {
  box: {
    nameKey: 'boxBreathing',
    phases: [
      { nameKey: 'inhale', seconds: 4, scaleTarget: 1.6 },
      { nameKey: 'hold', seconds: 4, scaleTarget: 1.6 },
      { nameKey: 'exhale', seconds: 4, scaleTarget: 1.0 },
      { nameKey: 'rest', seconds: 4, scaleTarget: 1.0 },
    ],
  },
  '478': {
    nameKey: 'relaxing478',
    phases: [
      { nameKey: 'inhale', seconds: 4, scaleTarget: 1.65 },
      { nameKey: 'hold', seconds: 7, scaleTarget: 1.65 },
      { nameKey: 'exhale', seconds: 8, scaleTarget: 1.0 },
    ],
  },
  calm: {
    nameKey: 'deepCalm',
    phases: [
      { nameKey: 'inhale', seconds: 5, scaleTarget: 1.6 },
      { nameKey: 'exhale', seconds: 5, scaleTarget: 1.0 },
    ],
  },
};

export const BreathingGuideModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const [patternKey, setPatternKey] = useState<BreathingPattern>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const pattern = PATTERNS[patternKey];
  const currentPhase = pattern.phases[currentPhaseIndex] || pattern.phases[0];

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Switch pattern
  const handleSelectPattern = (pk: BreathingPattern) => {
    setPatternKey(pk);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(PATTERNS[pk].phases[0].seconds);
    setIsActive(false);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(pattern.phases[0].seconds);
    setCompletedCycles(0);
  };

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setPhaseSecondsLeft(prev => {
        if (prev <= 1) {
          // Advance phase
          const nextIndex = (currentPhaseIndex + 1) % pattern.phases.length;
          if (nextIndex === 0) {
            setCompletedCycles(c => c + 1);
          }
          setCurrentPhaseIndex(nextIndex);

          // Subtle harmonic chime for phase cue
          try {
            audioEngine.playChime(0.2);
          } catch {}

          return pattern.phases[nextIndex].seconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, currentPhaseIndex, pattern]);

  // Visual Orb scale and glow calculation
  const isInhaling = currentPhase.nameKey === 'inhale';
  const isExhaling = currentPhase.nameKey === 'exhale';

  let scale = 1.0;
  if (currentPhase.nameKey === 'hold') scale = 1.6;
  else if (currentPhase.nameKey === 'rest') scale = 1.0;
  else if (isInhaling) {
    const progress = 1 - phaseSecondsLeft / currentPhase.seconds;
    scale = 1.0 + progress * 0.6;
  } else if (isExhaling) {
    const progress = 1 - phaseSecondsLeft / currentPhase.seconds;
    scale = 1.6 - progress * 0.6;
  }

  return (
    <Modal
      isOpen={activeModal === 'breathe'}
      onClose={closeModal}
      title={getTranslation(language, 'breatheTitle')}
      subtitle={getTranslation(language, 'breatheDesc')}
      maxWidthClass="max-w-md"
    >
      <div className="flex flex-col items-center space-y-6 py-2">
        {/* Pattern Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 w-full justify-between">
          {(['box', '478', 'calm'] as BreathingPattern[]).map(pk => (
            <button
              key={pk}
              onClick={() => handleSelectPattern(pk)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
                patternKey === pk
                  ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {pk === 'box' && getTranslation(language, 'boxBreathing')}
              {pk === '478' && getTranslation(language, 'relaxing478')}
              {pk === 'calm' && getTranslation(language, 'deepCalm')}
            </button>
          ))}
        </div>

        {/* Breathing Orb Visualization */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center my-1 sm:my-2 shrink-0">
          {/* Outer Ambient Aura Rings */}
          <div
            style={{
              transform: `scale(${scale * 1.15})`,
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-sky-500/10 blur-xl pointer-events-none"
          />

          <div
            style={{
              transform: `scale(${scale * 1.08})`,
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-teal-400/20 blur-md pointer-events-none"
          />

          {/* Core Breathing Orb */}
          <div
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-sky-500 via-teal-400 to-indigo-400 shadow-2xl flex items-center justify-center text-slate-950 font-bold border-2 border-white/30"
          >
            <div className="flex flex-col items-center">
              <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900/80 mb-0.5 animate-pulse" />
              <span className="text-xl sm:text-2xl font-mono">{phaseSecondsLeft}s</span>
            </div>
          </div>
        </div>

        {/* Phase Instructions & Progress */}
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold font-display text-white tracking-wide">
            {getTranslation(language, currentPhase.nameKey)}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {getTranslation(language, 'breathsCompleted')}:{' '}
            <span className="text-sky-300 font-semibold">{completedCycles}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetBreathing}
            className="p-3 rounded-2xl glass-pill text-slate-400 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 transform active:scale-95"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{getTranslation(language, 'pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{getTranslation(language, 'start')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
