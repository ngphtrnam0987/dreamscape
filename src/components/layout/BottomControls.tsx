import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { getTranslation } from '../../locales';
import {
  Volume2,
  VolumeX,
  Sliders,
  Timer,
  SlidersHorizontal,
  Bookmark,
  Maximize,
  Minimize,
  Moon,
} from 'lucide-react';

export const BottomControls: React.FC = () => {
  const { openModal, toggleModal, isFocusMode, language, isFullscreen, toggleFullscreen } = useUIStore();
  const { masterVolume, setMasterVolume, isMuted, toggleMute, channels, sleepTimerRemainingSeconds } = useAudioStore();
  const { remainingSeconds, isRunning, mode } = useTimerStore();

  if (isFocusMode) return null;

  const activeSoundCount = Object.values(channels).filter(c => c.isPlaying).length;

  const formatTimerMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatSleepTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-30 flex justify-center px-3 sm:px-4 pointer-events-none">
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl glass-panel shadow-2xl border border-white/10 pointer-events-auto max-w-full overflow-x-auto custom-scrollbar">
        {/* Sound Mixer Toggle */}
        <button
          onClick={() => toggleModal('mixer')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeSoundCount > 0
              ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
              : 'glass-pill text-slate-300 hover:text-white'
          }`}
          title={getTranslation(language, 'audioMixer')}
        >
          <Sliders className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">{getTranslation(language, 'audioMixer')}</span>
          {activeSoundCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {activeSoundCount}
            </span>
          )}
        </button>

        {/* Pomodoro Timer Toggle */}
        <button
          onClick={() => toggleModal('timer')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            isRunning
              ? 'bg-amber-500/25 border border-amber-400/40 text-amber-200 shadow-sm animate-pulse-subtle'
              : 'glass-pill text-slate-300 hover:text-white'
          }`}
          title={getTranslation(language, 'focusTimer')}
        >
          <Timer className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs">{formatTimerMinSec(remainingSeconds)}</span>
          <span className="hidden md:inline text-[11px] text-slate-400">
            ({mode === 'focus' ? 'Focus' : 'Break'})
          </span>
        </button>

        {/* Presets */}
        <button
          onClick={() => openModal('presets')}
          className="p-2 sm:px-3 sm:py-2 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          title={getTranslation(language, 'presets')}
        >
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">{getTranslation(language, 'presets')}</span>
        </button>

        {/* Atmosphere Scene Settings */}
        <button
          onClick={() => openModal('settings')}
          className="p-2 sm:px-3 sm:py-2 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          title={getTranslation(language, 'sceneSettings')}
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">{getTranslation(language, 'sceneSettings')}</span>
        </button>

        {/* Sleep Timer Indicator if active */}
        {sleepTimerRemainingSeconds !== null && (
          <div
            onClick={() => openModal('mixer')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs cursor-pointer"
            title="Sleep timer active"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="font-mono text-[11px]">{formatSleepTimer(sleepTimerRemainingSeconds)}</span>
          </div>
        )}

        <div className="h-5 w-px bg-white/10 mx-0.5 sm:mx-1 hidden sm:block" />

        {/* Master Volume Controls */}
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
            title={isMuted ? getTranslation(language, 'unmute') : getTranslation(language, 'mute')}
          >
            {isMuted || masterVolume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-300" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : masterVolume}
            onChange={e => setMasterVolume(parseFloat(e.target.value))}
            className="w-16 sm:w-20 cursor-pointer accent-sky-400"
            title={`${getTranslation(language, 'masterVolume')}: ${Math.round(masterVolume * 100)}%`}
          />
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-all hidden sm:block"
          title={isFullscreen ? getTranslation(language, 'exitFullscreen') : getTranslation(language, 'fullscreen')}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
