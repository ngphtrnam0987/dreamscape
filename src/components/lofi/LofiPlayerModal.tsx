import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useLofiStore } from '../../stores/useLofiStore';
import { Modal } from '../ui/Modal';
import { Slider } from '../ui/Slider';
import { getTranslation } from '../../locales';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  Disc3,
  ExternalLink,
  Plus,
  Sparkles,
} from 'lucide-react';

export const LofiPlayerModal: React.FC = () => {
  const { activeModal, closeModal, language, showToast } = useUIStore();
  const {
    stations,
    currentStationId,
    setStation,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    setCustomYoutubeUrl,
    getCurrentStation,
  } = useLofiStore();

  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const currentStation = getCurrentStation();

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const ok = setCustomYoutubeUrl(customInput.trim());
    if (ok) {
      showToast('Custom YouTube stream loaded!');
      setCustomInput('');
      setShowCustomInput(false);
    } else {
      showToast('Could not find YouTube video ID in link');
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'lofi'}
      onClose={closeModal}
      title={getTranslation(language, 'lofiRadio')}
      subtitle="Official Lofi Girl 24/7 live streams & curated study chill beats"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-5 py-1">
        {/* Active Now Playing Banner with Vinyl Animation */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Spinning Vinyl Record Icon */}
            <div className="relative w-14 h-14 rounded-full bg-slate-950 border-2 border-rose-500/40 flex items-center justify-center shrink-0 shadow-lg">
              <Disc3
                className={`w-9 h-9 text-rose-400 ${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
              />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-rose-400 border border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {currentStation.badge}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-white font-display mt-0.5 truncate max-w-xs sm:max-w-sm">
                {language === 'vi' ? currentStation.titleVi : currentStation.title}
              </h3>
              <p className="text-xs text-slate-400">{currentStation.artist}</p>
            </div>
          </div>

          {/* Big Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all transform active:scale-95 shadow-lg ${
              isPlaying
                ? 'bg-rose-500 text-slate-950 shadow-rose-500/30 ring-2 ring-rose-400/40'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Volume Slider for Lo-Fi */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <Slider
            label={getTranslation(language, 'lofiVolume')}
            icon={<Volume2 className="w-3.5 h-3.5 text-rose-400" />}
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={setVolume}
            formatValue={v => `${Math.round(v * 100)}%`}
          />
        </div>

        {/* Station Selection Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>{getTranslation(language, 'lofiStations')}</span>
            </h4>

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>{getTranslation(language, 'customYoutube')}</span>
            </button>
          </div>

          {/* Custom YouTube Stream Input Box */}
          {showCustomInput && (
            <form onSubmit={handleApplyCustom} className="p-3 rounded-2xl bg-white/5 border border-rose-500/30 space-y-2 animate-fade-in">
              <label className="text-xs text-slate-300 block">
                Paste any YouTube live stream or video link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold text-xs"
                >
                  Load Stream
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stations.map(station => {
              const isActive = currentStationId === station.id;

              return (
                <button
                  key={station.id}
                  onClick={() => setStation(station.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-rose-500/20 border-rose-400/50 shadow-md ring-2 ring-rose-400/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300">
                        {station.badge}
                      </span>
                      {isActive && isPlaying && (
                        <span className="text-[10px] text-emerald-400 font-mono">▶ Playing</span>
                      )}
                    </div>
                    <h5 className="text-xs font-semibold text-white truncate">
                      {language === 'vi' ? station.titleVi : station.title}
                    </h5>
                    <p className="text-[11px] text-slate-400">{station.artist}</p>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${station.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip banner */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            {getTranslation(language, 'lofiTip')}
          </span>
        </div>
      </div>
    </Modal>
  );
};
