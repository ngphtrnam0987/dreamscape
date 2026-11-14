import React, { useState } from 'react';
import { useLofiStore } from '../../stores/useLofiStore';
import { useUIStore } from '../../stores/useUIStore';
import { getTranslation } from '../../locales';
import { PipSize } from '../../types/lofi';
import {
  Maximize2,
  Minimize2,
  EyeOff,
  Play,
  Pause,
  ExternalLink,
  Sliders,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export const StudyWithMeVideo: React.FC = () => {
  const {
    isPlaying,
    videoMode,
    setVideoMode,
    togglePlay,
    getCurrentStation,
    videoSettings,
    updateVideoSettings,
    setPipSize,
    toggleNativeControls,
    toggleMuteVideoAudio,
  } = useLofiStore();

  const { language, isFocusMode, isZenMode } = useUIStore();
  const [showAdjustDrawer, setShowAdjustDrawer] = useState(false);

  const station = getCurrentStation();

  if (!isPlaying) return null;

  // Iframe parameters
  const nativeControlsParam = videoSettings.showNativeControls ? 1 : 0;
  const muteParam = videoSettings.muteVideoAudio ? 1 : 0;

  // Mode 1: Fullscreen Background Video
  if (videoMode === 'background') {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black select-none">
        <iframe
          key={`${station.youtubeId}-${nativeControlsParam}-${muteParam}`}
          src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&controls=${nativeControlsParam}&mute=${muteParam}&loop=1&playlist=${station.youtubeId}`}
          title="Study With Me Background Video"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-300"
          style={{
            opacity: videoSettings.opacity,
            filter: videoSettings.blur > 0 ? `blur(${videoSettings.blur}px)` : 'none',
          }}
        />

        {/* Floating pill to switch back or adjust video */}
        {!isFocusMode && !isZenMode && (
          <div className="absolute top-14 sm:top-20 right-2 sm:right-6 pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-panel shadow-2xl border border-white/15 animate-fade-in z-20">
            {/* Native controls toggle */}
            <button
              onClick={toggleNativeControls}
              className={`px-2 py-1 rounded-xl text-xs flex items-center gap-1 transition-all ${
                videoSettings.showNativeControls
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                  : 'glass-pill text-slate-300 hover:text-white'
              }`}
              title={videoSettings.showNativeControls ? 'Hide YouTube Bar' : 'Show YouTube Bar & Controls'}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {videoSettings.showNativeControls ? 'Controls ON' : 'Controls'}
              </span>
            </button>

            {/* Mute video audio toggle */}
            <button
              onClick={toggleMuteVideoAudio}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                videoSettings.muteVideoAudio
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                  : 'glass-pill text-slate-300 hover:text-white'
              }`}
              title={videoSettings.muteVideoAudio ? 'Video Sound: MUTED' : 'Video Sound: ON'}
            >
              {videoSettings.muteVideoAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Switch to PiP */}
            <button
              onClick={() => setVideoMode('pip')}
              className="px-2 sm:px-2.5 py-1 rounded-xl glass-pill text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              title="Switch to Picture-in-Picture"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>PiP</span>
            </button>

            {/* Audio Only */}
            <button
              onClick={() => setVideoMode('hidden')}
              className="px-2 sm:px-2.5 py-1 rounded-xl glass-pill text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              title="Hide video (Audio only)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Audio Only</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Width class based on PiP Size
  const pipWidthClasses: Record<PipSize, string> = {
    small: 'w-48 xs:w-56 sm:w-64',
    medium: 'w-56 xs:w-72 sm:w-80',
    large: 'w-64 xs:w-84 sm:w-[460px]',
  };

  // Mode 2: Floating Picture-in-Picture (PiP) Window
  if (videoMode === 'pip') {
    if (isZenMode) return null; // Hide in pure Zen scenery mode

    return (
      <div
        className={`fixed z-30 transition-all duration-300 pointer-events-auto ${
          isFocusMode
            ? 'top-14 sm:top-auto sm:bottom-20 right-2 sm:right-6'
            : 'top-14 sm:top-auto sm:bottom-24 right-2 sm:right-6'
        } ${pipWidthClasses[videoSettings.pipSize] || pipWidthClasses.medium} rounded-2xl overflow-hidden glass-panel shadow-2xl border border-white/20 animate-fade-in group`}
      >
        {/* Video Player Header Bar */}
        <div className="flex items-center justify-between px-2.5 sm:px-3 py-2 bg-slate-950/85 backdrop-blur-md border-b border-white/10 text-xs">
          <div className="flex items-center gap-1.5 truncate pr-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="font-semibold text-white truncate text-[11px]">
              {language === 'vi' ? station.titleVi : station.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Toggle Quick Video Adjust Drawer */}
            <button
              onClick={() => setShowAdjustDrawer(!showAdjustDrawer)}
              className={`p-1 rounded-lg transition-colors ${
                showAdjustDrawer ? 'bg-rose-500/30 text-rose-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Adjust Video Dimmer & Seek Bar"
              aria-label="Adjust Video"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Mute Video Audio Only */}
            <button
              onClick={toggleMuteVideoAudio}
              className={`p-1 rounded-lg transition-colors ${
                videoSettings.muteVideoAudio ? 'text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
              title={videoSettings.muteVideoAudio ? 'Video Audio: Muted' : 'Video Audio: Active'}
            >
              {videoSettings.muteVideoAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {/* Switch to Background Video */}
            <button
              onClick={() => setVideoMode('background')}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Fullscreen Background Video"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Audio Only (Hide video) */}
            <button
              onClick={() => setVideoMode('hidden')}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Hide video frame (Audio only)"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Video Adjust Drawer (Sliders & Toggles) */}
        {showAdjustDrawer && (
          <div className="p-2.5 bg-slate-900/95 border-b border-white/10 space-y-2 text-[11px] animate-fade-in">
            {/* PiP Size Selector */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">{getTranslation(language, 'pipSize')}:</span>
              <div className="flex items-center gap-1">
                {(['small', 'medium', 'large'] as PipSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => setPipSize(size)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all ${
                      videoSettings.pipSize === size
                        ? 'bg-rose-500 text-slate-950 shadow-sm'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                  </button>
                ))}
              </div>
            </div>

            {/* Native Seek Bar Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{getTranslation(language, 'showNativeControls')}:</span>
              <button
                onClick={toggleNativeControls}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                  videoSettings.showNativeControls
                    ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {videoSettings.showNativeControls ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Dimmer / Opacity Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>{getTranslation(language, 'videoOpacity')}</span>
                <span className="font-mono text-white">{Math.round(videoSettings.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.15}
                max={1.0}
                step={0.05}
                value={videoSettings.opacity}
                onChange={e => updateVideoSettings({ opacity: parseFloat(e.target.value) })}
                className="w-full cursor-pointer accent-rose-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Soft Blur Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>{getTranslation(language, 'videoBlur')}</span>
                <span className="font-mono text-white">{videoSettings.blur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={videoSettings.blur}
                onChange={e => updateVideoSettings({ blur: parseInt(e.target.value) })}
                className="w-full cursor-pointer accent-rose-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* 16:9 Aspect Video Container */}
        <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
          <iframe
            key={`${station.youtubeId}-${nativeControlsParam}-${muteParam}`}
            src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&controls=${nativeControlsParam}&mute=${muteParam}`}
            title="Study With Me Video Feed"
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0 transition-opacity duration-300"
            style={{
              opacity: videoSettings.opacity,
              filter: videoSettings.blur > 0 ? `blur(${videoSettings.blur}px)` : 'none',
            }}
          />
        </div>

        {/* Caption & Controls footer */}
        <div className="px-3 py-1.5 bg-slate-950/85 backdrop-blur-md flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-slate-300 font-medium">
              {station.badge}
            </span>
            {videoSettings.showNativeControls && (
              <span className="text-emerald-400 text-[9px]">Seek Bar Active</span>
            )}
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${station.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>YouTube</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    );
  }

  // Mode 3: Hidden (Audio-only background iframe)
  return (
    <div className="fixed bottom-0 right-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <iframe
        key={station.youtubeId}
        src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&mute=0`}
        title="Background Audio Stream"
        allow="autoplay; encrypted-media"
        className="w-full h-full"
      />
    </div>
  );
};
