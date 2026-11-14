import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import { TimerMode, ClockStyle, CLOCK_STYLES_INFO } from '../../types/timer';
import { audioEngine } from '../../audio/AudioEngine';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  Palette,
} from 'lucide-react';

export const PomodoroTimerModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const {
    mode,
    isRunning,
    remainingSeconds,
    totalDurationSeconds,
    completedSessions,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipSession,
    setMode,
    settings,
    updateSettings,
  } = useTimerStore();

  const { getTodayStats } = useStatsStore();
  const todayStats = getTodayStats();

  const [showSettings, setShowSettings] = useState(false);

  // SVG Circular progress math
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDurationSeconds > 0 ? remainingSeconds / totalDurationSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      if (res === 'granted') {
        new Notification('DreamScape Notifications Enabled', {
          body: 'You will receive subtle alerts when sessions conclude.',
        });
      }
    }
  };

  const modes: Array<{ id: TimerMode; label: string }> = [
    { id: 'focus', label: getTranslation(language, 'focus') },
    { id: 'short-break', label: getTranslation(language, 'shortBreak') },
    { id: 'long-break', label: getTranslation(language, 'longBreak') },
  ];

  return (
    <Modal
      isOpen={activeModal === 'timer'}
      onClose={closeModal}
      title={getTranslation(language, 'focusTimer')}
      subtitle="Elevate your flow state with structured intervals"
      maxWidthClass="max-w-md"
    >
      <div className="flex flex-col items-center space-y-5 py-2">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 w-full justify-between">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
                mode === m.id
                  ? 'bg-amber-500/25 border border-amber-400/40 text-amber-200 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* On-Screen Clock Size Quick Selector */}
        <div className="w-full flex flex-col xs:flex-row items-start xs:items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs gap-2">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">{getTranslation(language, 'clockSize')}</span>
          </div>

          <div className="grid grid-cols-4 w-full xs:w-auto gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-white/10 font-mono text-[11px]">
            <button
              onClick={() => updateSettings({ clockSize: 'small' })}
              className={`px-2 py-1 rounded-lg transition-all text-center ${
                (settings.clockSize || 'medium') === 'small'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {getTranslation(language, 'clockSizeSmall')}
            </button>
            <button
              onClick={() => updateSettings({ clockSize: 'medium' })}
              className={`px-2 py-1 rounded-lg transition-all text-center ${
                (settings.clockSize || 'medium') === 'medium'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {getTranslation(language, 'clockSizeMedium')}
            </button>
            <button
              onClick={() => updateSettings({ clockSize: 'large' })}
              className={`px-2 py-1 rounded-lg transition-all text-center ${
                (settings.clockSize || 'medium') === 'large'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {getTranslation(language, 'clockSizeLarge')}
            </button>
            <button
              onClick={() => updateSettings({ clockSize: 'hidden' })}
              className={`px-2 py-1 rounded-lg transition-all text-center ${
                settings.clockSize === 'hidden'
                  ? 'bg-rose-500/30 text-rose-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Hide Clock"
            >
              {getTranslation(language, 'clockSizeHidden')}
            </button>
          </div>
        </div>

        {/* Circular Dial Timer */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center my-1 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
            {/* Background track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="text-white/10 stroke-current"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Animated progress stroke */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className={`stroke-current transition-all duration-300 ${
                mode === 'focus' ? 'text-amber-400' : 'text-emerald-400'
              }`}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time & Session Center Content */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400 mt-1">
              {mode === 'focus' ? getTranslation(language, 'focus') : getTranslation(language, 'shortBreak')}
            </span>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
              <span>{getTranslation(language, 'sessionsCompletedToday')}:</span>
              <span className="font-semibold text-amber-300">{todayStats.sessions}</span>
            </div>
          </div>
        </div>

        {/* Clock Visual Style Selector */}
        <div className="w-full p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{getTranslation(language, 'clockStyle')}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {language === 'vi' ? 'Phím tắt V' : 'Hotkey V'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {CLOCK_STYLES_INFO.map((style) => {
              const active = (settings.clockStyle || 'minimal') === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => updateSettings({ clockStyle: style.id as ClockStyle })}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    active
                      ? 'bg-amber-500/25 border-amber-400/50 text-white shadow-sm ring-1 ring-amber-400/30'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">
                    {language === 'vi' ? style.nameVi : style.name}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate opacity-80 mt-0.5">
                    {language === 'vi' ? style.descVi : style.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Play/Pause, Reset, Skip, Settings */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl glass-pill text-slate-400 hover:text-white transition-all"
            title={getTranslation(language, 'reset')}
            aria-label={getTranslation(language, 'reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={isRunning ? pauseTimer : (remainingSeconds < totalDurationSeconds ? resumeTimer : startTimer)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 transform active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{getTranslation(language, 'pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{remainingSeconds < totalDurationSeconds ? getTranslation(language, 'resume') : getTranslation(language, 'start')}</span>
              </>
            )}
          </button>

          <button
            onClick={skipSession}
            className="p-3 rounded-2xl glass-pill text-slate-400 hover:text-white transition-all"
            title={getTranslation(language, 'skip')}
            aria-label={getTranslation(language, 'skip')}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl transition-all ${
              showSettings
                ? 'bg-amber-500/25 border border-amber-400/40 text-amber-300'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
            title={getTranslation(language, 'timerSettings')}
            aria-label={getTranslation(language, 'timerSettings')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Timer Settings Panel */}
        {showSettings && (
          <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5 text-xs animate-fade-in">
            <h4 className="font-semibold text-white font-display flex items-center justify-between">
              <span>{getTranslation(language, 'timerSettings')}</span>
              <button
                onClick={handleRequestNotification}
                className="text-[11px] font-normal text-sky-400 hover:underline flex items-center gap-1"
              >
                <Bell className="w-3 h-3" />
                <span>Enable Notifications</span>
              </button>
            </h4>

            {/* Display Mode Selection */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300 font-medium">{getTranslation(language, 'clockDisplayType')}</span>
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-white/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => updateSettings({ clockDisplayType: 'pomodoro' })}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    (settings.clockDisplayType || 'pomodoro') === 'pomodoro'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {getTranslation(language, 'clockTypePomodoro')}
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ clockDisplayType: 'realtime' })}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    settings.clockDisplayType === 'realtime'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {getTranslation(language, 'clockTypeRealtime')}
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ clockDisplayType: 'stopwatch' })}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    settings.clockDisplayType === 'stopwatch'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'vi' ? 'Đếm Xuôi' : 'Stopwatch'}
                </button>
              </div>
            </div>

            {/* Durations Inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Focus (min)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusMinutes}
                  onChange={e => updateSettings({ focusMinutes: Math.max(1, parseInt(e.target.value) || 25) })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-center focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.shortBreakMinutes}
                  onChange={e => updateSettings({ shortBreakMinutes: Math.max(1, parseInt(e.target.value) || 5) })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-center focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.longBreakMinutes}
                  onChange={e => updateSettings({ longBreakMinutes: Math.max(1, parseInt(e.target.value) || 15) })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-center focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>{getTranslation(language, 'autoStartBreaks')}</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={e => updateSettings({ autoStartBreaks: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>{getTranslation(language, 'autoStartFocus')}</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartFocus}
                  onChange={e => updateSettings({ autoStartFocus: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span>{getTranslation(language, 'soundChime')}</span>
                  <button
                    type="button"
                    onClick={() => audioEngine.playChime(0.5)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
                    title="Test chime"
                  >
                    Preview
                  </button>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundAlertEnabled}
                  onChange={e => updateSettings({ soundAlertEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation(language, 'cycleProgress', { current: (completedSessions % settings.longBreakInterval) + 1, total: settings.longBreakInterval })}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
