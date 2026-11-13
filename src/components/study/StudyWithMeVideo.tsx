import React from 'react';
import { useLofiStore } from '../../stores/useLofiStore';
import { useUIStore } from '../../stores/useUIStore';
import { getTranslation } from '../../locales';
import { Maximize2, Minimize2, EyeOff, Play, Pause, ExternalLink } from 'lucide-react';

export const StudyWithMeVideo: React.FC = () => {
  const { isPlaying, videoMode, setVideoMode, togglePlay, getCurrentStation } = useLofiStore();
  const { language, isFocusMode } = useUIStore();
  const station = getCurrentStation();

  if (!isPlaying) return null;

  // Mode 1: Fullscreen Background Video
  if (videoMode === 'background') {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black select-none">
        <iframe
          key={station.youtubeId}
          src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&mute=0&loop=1&playlist=${station.youtubeId}`}
          title="Study With Me Background Video"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover opacity-75"
        />

        {/* Floating pill to switch back or minimize video */}
        {!isFocusMode && (
          <div className="absolute top-20 right-6 pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl glass-panel shadow-2xl border border-white/15 animate-fade-in z-20">
            <button
              onClick={() => setVideoMode('pip')}
              className="px-2.5 py-1 rounded-xl glass-pill text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              title="Switch to Picture-in-Picture"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>PiP Mode</span>
            </button>
            <button
              onClick={() => setVideoMode('hidden')}
              className="px-2.5 py-1 rounded-xl glass-pill text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              title="Hide video (Audio only)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Audio Only</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Mode 2: Floating Picture-in-Picture (PiP) Window
  if (videoMode === 'pip') {
    return (
      <div
        className={`fixed z-30 transition-all duration-300 pointer-events-auto ${
          isFocusMode
            ? 'bottom-20 right-4 sm:right-6 w-56 sm:w-72'
            : 'bottom-20 sm:bottom-24 right-3 sm:right-6 w-60 sm:w-80'
        } rounded-2xl overflow-hidden glass-panel shadow-2xl border border-white/20 animate-fade-in group`}
      >
        {/* Video Player Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-xs">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-white truncate text-[11px]">
              {language === 'vi' ? station.titleVi : station.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
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
              title="Make Fullscreen Background Video"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Audio Only (Hide video) */}
            <button
              onClick={() => setVideoMode('hidden')}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Hide video frame"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 16:9 Aspect Video Container */}
        <div className="relative w-full aspect-video bg-slate-950">
          <iframe
            key={station.youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1`}
            title="Study With Me Video Feed"
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
          />
        </div>

        {/* Quick caption footer */}
        <div className="px-3 py-1.5 bg-slate-950/70 flex items-center justify-between text-[10px] text-slate-400">
          <span>{station.badge}</span>
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
        src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1`}
        title="Background Audio Stream"
        allow="autoplay; encrypted-media"
        className="w-full h-full"
      />
    </div>
  );
};
