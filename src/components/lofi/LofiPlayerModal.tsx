import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useLofiStore } from '../../stores/useLofiStore';
import { Modal } from '../ui/Modal';
import { Slider } from '../ui/Slider';
import { getTranslation } from '../../locales';
import { VideoMode } from '../../types/lofi';
import {
  Play,
  Pause,
  Volume2,
  Disc3,
  ExternalLink,
  Plus,
  Sparkles,
  Video,
  Monitor,
  Headphones,
  Tv,
} from 'lucide-react';

type FilterTab = 'all' | 'study' | 'lofi';

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
    videoMode,
    setVideoMode,
    setCustomYoutubeUrl,
    getCurrentStation,
  } = useLofiStore();

  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customIsStudy, setCustomIsStudy] = useState(true);

  const currentStation = getCurrentStation();

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const ok = setCustomYoutubeUrl(customInput.trim(), customIsStudy);
    if (ok) {
      showToast('Custom YouTube stream loaded!');
      setCustomInput('');
      setShowCustomInput(false);
    } else {
      showToast('Could not find YouTube video ID in link');
    }
  };

  const filteredStations = stations.filter(s => {
    if (filterTab === 'study') return s.isStudyWithMe;
    if (filterTab === 'lofi') return !s.isStudyWithMe;
    return true;
  });

  const videoModes: Array<{ mode: VideoMode; labelKey: 'pipMode' | 'backgroundVideoMode' | 'audioOnlyMode'; icon: React.ReactNode }> = [
    { mode: 'pip', labelKey: 'pipMode', icon: <Tv className="w-3.5 h-3.5" /> },
    { mode: 'background', labelKey: 'backgroundVideoMode', icon: <Monitor className="w-3.5 h-3.5" /> },
    { mode: 'hidden', labelKey: 'audioOnlyMode', icon: <Headphones className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal
      isOpen={activeModal === 'lofi'}
      onClose={closeModal}
      title={getTranslation(language, 'lofiRadio')}
      subtitle="Study With Me video feeds, Lofi Girl live streams & curated focus tracks"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-4 py-1">
        {/* Active Now Playing Banner */}
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-slate-900 border border-rose-500/30 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Spinning Vinyl Record or Video Thumbnail */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-950 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-lg group">
              {currentStation.thumbnail ? (
                <img
                  src={currentStation.thumbnail}
                  alt={currentStation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Disc3
                  className={`w-8 h-8 sm:w-9 sm:h-9 text-rose-400 ${isPlaying ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '4s' }}
                />
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                </div>
              )}
            </div>

            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {currentStation.badge}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white font-display mt-0.5 truncate max-w-[160px] xs:max-w-xs sm:max-w-sm">
                {language === 'vi' ? currentStation.titleVi : currentStation.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">{currentStation.artist}</p>
            </div>
          </div>

          {/* Big Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all transform active:scale-95 shadow-lg ${
              isPlaying
                ? 'bg-rose-500 text-slate-950 shadow-rose-500/30 ring-2 ring-rose-400/40'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Video Display Mode Selector */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>{getTranslation(language, 'videoMode')}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {videoMode === 'pip' ? 'Floating PiP' : videoMode === 'background' ? 'Fullscreen Backdrop' : 'Audio Only'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {videoModes.map(({ mode, labelKey, icon }) => {
              const active = videoMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setVideoMode(mode)}
                  className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-rose-500/25 border border-rose-400 text-rose-200 shadow-md ring-2 ring-rose-400/20'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {icon}
                  <span className="truncate">{getTranslation(language, labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume Slider for Stream */}
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

        {/* Category Tabs & Custom Link Button */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-white/10">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterTab === 'all'
                    ? 'bg-rose-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {getTranslation(language, 'allStations')}
              </button>
              <button
                onClick={() => setFilterTab('study')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterTab === 'study'
                    ? 'bg-rose-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {getTranslation(language, 'studyStations')}
              </button>
              <button
                onClick={() => setFilterTab('lofi')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterTab === 'lofi'
                    ? 'bg-rose-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {getTranslation(language, 'lofiStationsTab')}
              </button>
            </div>

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20"
            >
              <Plus className="w-3 h-3" />
              <span>{getTranslation(language, 'customYoutube')}</span>
            </button>
          </div>

          {/* Custom YouTube Stream Input Box */}
          {showCustomInput && (
            <form onSubmit={handleApplyCustom} className="p-3.5 rounded-2xl bg-white/5 border border-rose-500/30 space-y-2.5 animate-fade-in">
              <label className="text-xs text-slate-300 block font-medium">
                Paste any YouTube live stream, Study With Me, or music link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... or Video ID"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold text-xs whitespace-nowrap transition-colors"
                >
                  Load Stream
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="customType"
                    checked={customIsStudy}
                    onChange={() => setCustomIsStudy(true)}
                    className="accent-rose-500"
                  />
                  <span>Study With Me Video</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="customType"
                    checked={!customIsStudy}
                    onChange={() => setCustomIsStudy(false)}
                    className="accent-rose-500"
                  />
                  <span>Lo-Fi Chill Music</span>
                </label>
              </div>
            </form>
          )}

          {/* Station Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {filteredStations.map(station => {
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
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/10">
                    <img
                      src={station.thumbnail}
                      alt={station.title}
                      className="w-full h-full object-cover"
                    />
                    {station.isStudyWithMe && (
                      <div className="absolute top-0.5 right-0.5 p-0.5 rounded bg-rose-600/90 text-[8px] text-white">
                        <Video className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {station.badge}
                      </span>
                      {isActive && isPlaying && (
                        <span className="text-[10px] text-emerald-400 font-mono">▶ Active</span>
                      )}
                    </div>
                    <h5 className="text-xs font-semibold text-white truncate">
                      {language === 'vi' ? station.titleVi : station.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">{station.artist}</p>
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
