import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { getTranslation } from '../../locales';
import { Play, Pause, Minimize2, Target, CheckCircle2 } from 'lucide-react';

export const FocusModeOverlay: React.FC = () => {
  const { isFocusMode, toggleFocusMode, language } = useUIStore();
  const { isRunning, remainingSeconds, startTimer, pauseTimer, settings, toggleClockSize } = useTimerStore();
  const { getActiveTask, toggleTask } = useTaskStore();
  const [controlsVisible, setControlsVisible] = useState(true);

  const activeTask = getActiveTask();

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

  const clockSize = settings.clockSize || 'medium';

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-700 ${
        controlsVisible ? 'opacity-100' : 'opacity-15 hover:opacity-100'
      }`}
    >
      {/* Top-Left Active Focus Task Pill */}
      {activeTask && (
        <div className="absolute top-3 sm:top-6 left-2.5 sm:left-6 pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel shadow-2xl border border-sky-400/30 text-xs animate-fade-in max-w-[85vw] sm:max-w-md">
          <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-semibold text-white truncate text-[11px] sm:text-xs">
            {activeTask.title}
          </span>
          <button
            onClick={() => toggleTask(activeTask.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors ml-1"
            title="Mark completed"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Floating Exit & Clock Mode Bar */}
      <div className="absolute top-3 sm:top-6 right-2.5 sm:right-6 pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-panel shadow-2xl border border-white/15 animate-fade-in max-w-[94vw]">
        {/* If clock is hidden on screen, show minimal time here */}
        {clockSize === 'hidden' && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 font-mono text-xs font-bold text-white border-r border-white/10 pr-2 sm:pr-3">
            <span>{formatTime(remainingSeconds)}</span>
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="p-1 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white"
            >
              {isRunning ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
          </div>
        )}

        {/* Quick Clock Size Pill */}
        <button
          onClick={toggleClockSize}
          className="px-2 sm:px-2.5 py-1 rounded-xl glass-pill text-[10px] sm:text-[11px] font-mono text-slate-300 hover:text-white transition-all uppercase"
          title={`Clock size: ${clockSize} (Click to toggle Small / Medium / Large / Hidden)`}
        >
          {clockSize === 'large' ? 'Large' : clockSize === 'small' ? 'Small' : clockSize === 'medium' ? 'Medium' : 'Hidden'}
        </button>

        {/* Exit Focus Mode Button */}
        <button
          onClick={toggleFocusMode}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-slate-200 hover:text-white transition-all text-xs font-medium"
          title={getTranslation(language, 'exitFocusMode')}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-[11px] font-medium hidden xs:inline">{getTranslation(language, 'exitFocusMode')}</span>
        </button>
      </div>
    </div>
  );
};
