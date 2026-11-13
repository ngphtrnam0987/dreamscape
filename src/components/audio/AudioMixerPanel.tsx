import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { Modal } from '../ui/Modal';
import { CHANNELS } from '../../audio/channelDefinitions';
import { ChannelVolumeRow } from './ChannelVolumeRow';
import { getTranslation } from '../../locales';
import {
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Moon,
  Clock,
  Check,
} from 'lucide-react';

export const AudioMixerPanel: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const {
    masterVolume,
    setMasterVolume,
    isMuted,
    toggleMute,
    stopAll,
    resetMixer,
    channels,
    sleepTimerMinutes,
    sleepTimerRemainingSeconds,
    startSleepTimer,
    cancelSleepTimer,
  } = useAudioStore();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weather' | 'nature' | 'urban' | 'ethereal'>('all');
  const [customSleepInput, setCustomSleepInput] = useState('');
  const [showCustomSleep, setShowCustomSleep] = useState(false);

  const activeSoundCount = Object.values(channels).filter(c => c.isPlaying).length;

  const filteredChannels = selectedCategory === 'all'
    ? CHANNELS
    : CHANNELS.filter(c => c.category === selectedCategory);

  const formatSleepSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleApplyCustomSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(customSleepInput);
    if (!isNaN(min) && min > 0) {
      startSleepTimer(min);
      setShowCustomSleep(false);
      setCustomSleepInput('');
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'mixer'}
      onClose={closeModal}
      title={getTranslation(language, 'audioMixer')}
      subtitle={getTranslation(language, 'audioHelp')}
      maxWidthClass="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Master Controls & Global Actions */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Master Volume */}
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-sm">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-colors"
              title={isMuted ? getTranslation(language, 'unmute') : getTranslation(language, 'mute')}
            >
              {isMuted || masterVolume === 0 ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-sky-400" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>{getTranslation(language, 'masterVolume')}</span>
                <span className="font-mono text-slate-400">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : masterVolume}
                onChange={e => setMasterVolume(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-sky-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={stopAll}
              disabled={activeSoundCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Square className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation(language, 'stopAll')}</span>
            </button>
            <button
              onClick={resetMixer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{getTranslation(language, 'resetMixer')}</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'weather', label: getTranslation(language, 'catWeather') },
            { id: 'nature', label: getTranslation(language, 'catNature') },
            { id: 'urban', label: getTranslation(language, 'catUrban') },
            { id: 'ethereal', label: getTranslation(language, 'catEthereal') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as typeof selectedCategory)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === tab.id
                  ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200'
                  : 'glass-pill text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredChannels.map(config => (
            <ChannelVolumeRow key={config.id} config={config} />
          ))}
        </div>

        {/* Sleep Timer Section */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mt-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">
                {getTranslation(language, 'sleepTimer')}
              </span>
            </div>

            {sleepTimerRemainingSeconds !== null && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30 animate-pulse">
                  {formatSleepSeconds(sleepTimerRemainingSeconds)}
                </span>
                <button
                  onClick={cancelSleepTimer}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  {getTranslation(language, 'cancel')}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[15, 30, 45, 60].map(min => {
              const isCurrent = sleepTimerMinutes === min;
              return (
                <button
                  key={min}
                  onClick={() => isCurrent ? cancelSleepTimer() : startSleepTimer(min)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 shadow-md ring-2 ring-indigo-400/20'
                      : 'glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'sleepTimerMinutes', { min })}</span>
                  {isCurrent && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              );
            })}

            <button
              onClick={() => setShowCustomSleep(!showCustomSleep)}
              className="px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white"
            >
              {getTranslation(language, 'sleepCustom')}...
            </button>
          </div>

          {showCustomSleep && (
            <form onSubmit={handleApplyCustomSleep} className="flex items-center gap-2 mt-3">
              <input
                type="number"
                min="1"
                max="360"
                placeholder="Minutes (e.g. 90)"
                value={customSleepInput}
                onChange={e => setCustomSleepInput(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/15 text-white text-xs w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
              >
                {getTranslation(language, 'apply')}
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
