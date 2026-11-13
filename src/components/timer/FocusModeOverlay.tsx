import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { getTranslation } from '../../locales';
import { Play, Pause, Minimize2 } from 'lucide-react';

export const FocusModeOverlay: React.FC = () => {
  const { isFocusMode, toggleFocusMode, language } = useUIStore();
  const { isRunning, remainingSeconds, startTimer, pauseTimer, mode } = useTimerStore();
  const [controlsVisible, setControlsVisible] = useState(true);

  // Auto-dim controls after 4 seconds of idle in focus mode
  useEffect(() => {
    if (!isFocusMode) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 4000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    timeout = setTimeout(() => setControlsVisible(false), 4000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFocusMode]);

  if (!isFocusMode) return null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-700 ${
        controlsVisible ? 'opacity-100' : 'opacity-20 hover:opacity-100'
      }`}
    >
      {/* Top Floating Minimal Focus Widget */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel shadow-2xl border border-white/10 animate-fade-in">
        <span className="text-xl font-mono font-bold text-white tracking-wider">
          {formatTime(remainingSeconds)}
        </span>

        <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
          {mode}
        </span>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        <div className="h-4 w-px bg-white/15 mx-0.5" />

        <button
          onClick={toggleFocusMode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all text-xs"
          title={getTranslation(language, 'exitFocusMode')}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{getTranslation(language, 'exitFocusMode')}</span>
        </button>
      </div>
    </div>
  );
};
