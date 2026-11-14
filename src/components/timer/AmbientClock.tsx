import React, { useState, useEffect } from 'react';
import { useTimerStore } from '../../stores/useTimerStore';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore, SCENES_INFO } from '../../stores/useSceneStore';
import { getTranslation } from '../../locales';
import { ClockSize, ClockDisplayType } from '../../types/timer';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Timer,
  Maximize2,
  Minimize2,
  Settings,
  X,
} from 'lucide-react';

export const AmbientClock: React.FC = () => {
  const {
    remainingSeconds,
    isRunning,
    totalDurationSeconds,
    mode,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    settings,
    setClockSize,
    setClockDisplayType,
  } = useTimerStore();

  const { isFocusMode, language, openModal } = useUIStore();
  const { currentSceneId } = useSceneStore();
  const [realtime, setRealtime] = useState<Date>(new Date());
  const [isHovered, setIsHovered] = useState(false);

  // Keep realtime clock updated every 500ms
  useEffect(() => {
    const timer = setInterval(() => {
      setRealtime(new Date());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const clockSize = settings.clockSize || 'medium';
  const displayType = settings.clockDisplayType || 'pomodoro';

  // If set to hidden and not in focus mode, do not render on screen
  if (clockSize === 'hidden') return null;

  const currentScene = SCENES_INFO.find(s => s.id === currentSceneId) || SCENES_INFO[0];
  const accentColor = currentScene.accentColor || '#38bdf8';

  // Format Pomodoro MM:SS
  const formatPomodoro = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format Realtime HH:MM:SS or HH:MM
  const formatRealtime = (date: Date, withSeconds = true) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return withSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  };

  // Format Date Subtitle
  const formatDateString = (date: Date) => {
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRunning) {
      pauseTimer();
    } else {
      if (remainingSeconds < totalDurationSeconds) {
        resumeTimer();
      } else {
        startTimer();
      }
    }
  };

  const toggleDisplayType = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClockDisplayType(displayType === 'pomodoro' ? 'realtime' : 'pomodoro');
  };

  // -------------------------------------------------------------
  // SIZE 1: SMALL (Compact floating pill)
  // -------------------------------------------------------------
  if (clockSize === 'small') {
    return (
      <div
        className={`fixed z-20 inset-x-0 ${
          isFocusMode ? 'top-3 sm:top-6' : 'top-14 sm:top-20'
        } flex justify-center pointer-events-none px-3`}
      >
        <aside
          aria-label="Ambient Clock Widget"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-2xl glass-panel shadow-xl border border-white/15 animate-fade-in group max-w-[94vw]"
        >
          {/* Click to toggle mode icon */}
          <button
            onClick={toggleDisplayType}
            className="text-slate-400 hover:text-white transition-colors shrink-0"
            title={`Switch to ${displayType === 'pomodoro' ? 'Realtime Clock' : 'Pomodoro Timer'}`}
          >
            {displayType === 'pomodoro' ? (
              <Timer className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-sky-400" />
            )}
          </button>

          {/* Time display */}
          <span
            onClick={toggleDisplayType}
            className="font-mono text-sm sm:text-base font-bold text-white tracking-wider cursor-pointer select-none"
          >
            {displayType === 'pomodoro' ? formatPomodoro(remainingSeconds) : formatRealtime(realtime, false)}
          </span>

          {/* Mode badge for Pomodoro */}
          {displayType === 'pomodoro' && (
            <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 hidden xs:inline">
              {mode === 'focus' ? 'Focus' : 'Break'}
            </span>
          )}

          {/* Quick Play/Pause (Pomodoro mode) */}
          {displayType === 'pomodoro' && (
            <button
              onClick={handlePlayPause}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title={isRunning ? 'Pause' : 'Start'}
            >
              {isRunning ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
          )}

          {/* Size Expand / Settings Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 border-l border-white/15 pl-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setClockSize('medium')}
              className="p-1 text-slate-400 hover:text-white"
              title="Expand to Medium Clock"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setClockSize('large')}
              className="p-1 text-slate-400 hover:text-amber-300 hidden sm:block"
              title="Expand to Large Cinematic Clock"
            >
              <span className="text-[10px] font-mono font-bold">L</span>
            </button>
            <button
              onClick={() => setClockSize('hidden')}
              className="p-1 text-slate-400 hover:text-rose-400"
              title="Hide Clock"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </aside>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SIZE 2: MEDIUM (Elegant frosted glass card)
  // -------------------------------------------------------------
  if (clockSize === 'medium') {
    const progressRatio = totalDurationSeconds > 0 ? (totalDurationSeconds - remainingSeconds) / totalDurationSeconds : 0;

    return (
      <div
        className={`fixed z-20 inset-x-0 ${
          isFocusMode
            ? 'top-1/2 -translate-y-1/2'
            : 'top-14 sm:top-24'
        } flex justify-center pointer-events-none px-3`}
      >
        <aside
          aria-label="Ambient Clock Widget"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`pointer-events-auto ${
            isFocusMode ? 'scale-100 sm:scale-110' : ''
          } w-full max-w-[320px] sm:max-w-[340px] rounded-3xl glass-panel shadow-2xl border border-white/20 p-3.5 sm:p-5 flex flex-col items-center animate-fade-in group`}
        >
          {/* Top Header bar with Mode Badge & Size Pills */}
          <div className="w-full flex items-center justify-between text-xs mb-2">
            <button
              onClick={toggleDisplayType}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              title="Click to toggle Pomodoro / Realtime"
            >
              {displayType === 'pomodoro' ? (
                <>
                  <Timer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold capitalize text-[11px]">{mode}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-semibold text-[11px]">{getTranslation(language, 'clockTypeRealtime')}</span>
                </>
              )}
            </button>

            {/* Quick Size buttons */}
            <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-xl border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setClockSize('small')}
                className="px-1.5 py-0.5 rounded-lg text-slate-400 hover:text-white"
                title="Small"
              >
                S
              </button>
              <button
                onClick={() => setClockSize('medium')}
                className="px-1.5 py-0.5 rounded-lg bg-white/20 text-white font-bold"
                title="Medium"
              >
                M
              </button>
              <button
                onClick={() => setClockSize('large')}
                className="px-1.5 py-0.5 rounded-lg text-slate-400 hover:text-white"
                title="Large"
              >
                L
              </button>
              <button
                onClick={() => setClockSize('hidden')}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                title="Hide"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Big Monospace Time Display */}
          <div
            onClick={toggleDisplayType}
            className="my-1 cursor-pointer select-none text-center group-hover:scale-[1.02] transition-transform"
            title="Click to toggle display mode"
          >
            <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tighter drop-shadow-lg">
              {displayType === 'pomodoro' ? formatPomodoro(remainingSeconds) : formatRealtime(realtime, true)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium truncate max-w-[280px]">
              {displayType === 'pomodoro' ? (
                isRunning ? 'Counting down...' : 'Paused — Click to Resume'
              ) : (
                formatDateString(realtime)
              )}
            </div>
          </div>

          {/* Progress Bar for Pomodoro */}
          {displayType === 'pomodoro' && (
            <div className="w-full bg-white/10 rounded-full h-1.5 my-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  mode === 'focus' ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                }`}
                style={{ width: `${Math.min(100, progressRatio * 100)}%` }}
              />
            </div>
          )}

          {/* Action Controls Toolbar */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-1 w-full pt-1">
            {displayType === 'pomodoro' ? (
              <>
                <button
                  onClick={resetTimer}
                  className="p-2 rounded-xl glass-pill text-slate-400 hover:text-white transition-all shrink-0"
                  title={getTranslation(language, 'reset')}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md ${
                    isRunning
                      ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>{getTranslation(language, 'pause')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{getTranslation(language, 'start')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => openModal('timer')}
                  className="p-2 rounded-xl glass-pill text-slate-400 hover:text-white transition-all shrink-0"
                  title="Timer Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setClockDisplayType('pomodoro')}
                className="px-3 py-1.5 rounded-xl glass-pill text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch to Pomodoro</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SIZE 3: LARGE (Cinematic grand desktop centerpiece)
  // -------------------------------------------------------------
  return (
    <aside
      aria-label="Ambient Clock Widget"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed inset-0 z-20 pointer-events-none flex flex-col items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
    >
      {/* Background radial glow matching current scene accent color */}
      <div
        className="absolute w-72 sm:w-[500px] h-72 sm:h-[500px] rounded-full blur-[80px] sm:blur-[100px] opacity-25 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative pointer-events-auto flex flex-col items-center group max-w-[96vw]">
        {/* Top Minimal Badge & Mode Switcher */}
        <div className="flex items-center gap-2 mb-2 transition-opacity duration-300">
          <button
            onClick={toggleDisplayType}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel-subtle text-xs font-mono font-medium text-slate-300 hover:text-white border border-white/10 shadow-lg"
          >
            {displayType === 'pomodoro' ? (
              <>
                <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                <span className="uppercase tracking-widest text-[10px] sm:text-[11px] font-bold">
                  {mode === 'focus' ? getTranslation(language, 'focus') : getTranslation(language, 'shortBreak')}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="tracking-wider text-[10px] sm:text-[11px]">
                  {formatDateString(realtime)}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Grand Cinematic Digital Clock Display (Mobile-responsive font scaling) */}
        <div
          onClick={toggleDisplayType}
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.015] text-center max-w-[95vw] overflow-hidden"
          title="Click to toggle display mode"
        >
          <h1
            className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] font-mono font-black tracking-tighter text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] leading-none select-none break-all"
            style={{
              textShadow: `0 0 35px ${accentColor}40, 0 10px 40px rgba(0,0,0,0.9)`,
            }}
          >
            {displayType === 'pomodoro' ? formatPomodoro(remainingSeconds) : formatRealtime(realtime, true)}
          </h1>
        </div>

        {/* Subtitle Information */}
        <div className="mt-2 text-xs sm:text-sm font-medium text-slate-300 tracking-wider uppercase font-mono opacity-80 text-center">
          {displayType === 'pomodoro' ? (
            <span>
              {isRunning ? 'Flow State Active' : 'Session Paused'} • {Math.round(totalDurationSeconds / 60)} min
            </span>
          ) : (
            <span>{realtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          )}
        </div>

        {/* Floating Action Controls Dock */}
        <div
          className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 px-3 sm:px-4 py-2 mt-3 sm:mt-4 rounded-2xl glass-panel shadow-2xl border border-white/15 transition-all duration-300 max-w-[94vw] ${
            isHovered || !isRunning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {displayType === 'pomodoro' && (
            <>
              <button
                onClick={handlePlayPause}
                className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all transform active:scale-95 shadow-md"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{getTranslation(language, 'pause')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{getTranslation(language, 'start')}</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-1.5 rounded-xl glass-pill text-slate-300 hover:text-white"
                title={getTranslation(language, 'reset')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Toggle Type button */}
          <button
            onClick={toggleDisplayType}
            className="px-2.5 py-1.5 rounded-xl glass-pill text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
            title="Toggle between Pomodoro and Realtime Clock"
          >
            {displayType === 'pomodoro' ? <Clock className="w-3.5 h-3.5 text-sky-400" /> : <Timer className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden xs:inline">
              {displayType === 'pomodoro' ? 'Realtime' : 'Pomodoro'}
            </span>
          </button>

          {/* Clock Size Selector Buttons: S / M / L / Hide */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-black/40 p-0.5 sm:p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setClockSize('small')}
              className="px-1.5 sm:px-2 py-0.5 rounded-lg text-slate-400 hover:text-white text-[11px]"
              title="Switch to Small Clock"
            >
              Small
            </button>
            <button
              onClick={() => setClockSize('medium')}
              className="px-1.5 sm:px-2 py-0.5 rounded-lg text-slate-400 hover:text-white text-[11px]"
              title="Switch to Medium Clock"
            >
              Medium
            </button>
            <button
              onClick={() => setClockSize('large')}
              className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-amber-500/30 border border-amber-400/50 text-amber-200 font-bold text-[11px]"
              title="Active Large Clock"
            >
              Large
            </button>
            <button
              onClick={() => setClockSize('hidden')}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
              title="Hide on-screen clock"
            >
              <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
