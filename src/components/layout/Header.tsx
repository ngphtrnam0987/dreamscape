import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore, SCENES_INFO } from '../../stores/useSceneStore';
import { getTranslation } from '../../locales';
import { Sparkles, Compass, BarChart2, Maximize2, Globe2, Wind, FileText } from 'lucide-react';

export const Header: React.FC = () => {
  const { openModal, toggleFocusMode, language, setLanguage, isFocusMode } = useUIStore();
  const { currentSceneId } = useSceneStore();

  if (isFocusMode) return null;

  const currentScene = SCENES_INFO.find(s => s.id === currentSceneId) || SCENES_INFO[0];
  const sceneName = language === 'vi' ? currentScene.nameVi : currentScene.name;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 transition-all duration-300">
      {/* Brand & Active Scene */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel-subtle border border-white/10">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-inner">
            <Sparkles className="w-4 h-4 animate-pulse-subtle" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide font-display text-white">
              DreamScape
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              {getTranslation(language, 'tagline')}
            </div>
          </div>
        </div>

        {/* Scene Pill Switcher */}
        <button
          onClick={() => openModal('scenes')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-pill text-xs font-medium text-slate-200 transition-all hover:scale-105"
          title={getTranslation(language, 'scenes')}
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline text-slate-400">{getTranslation(language, 'scenes')}:</span>
          <span className="font-semibold text-white">{sceneName}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Mindful Breathing Guide */}
        <button
          onClick={() => openModal('breathe')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'breathe')}
        >
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">{getTranslation(language, 'breathe')}</span>
        </button>

        {/* Focus Notes / Scratchpad */}
        <button
          onClick={() => openModal('notes')}
          className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'quickNotes')}
          aria-label={getTranslation(language, 'quickNotes')}
        >
          <FileText className="w-4 h-4 text-amber-400" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'toggleLanguage')}
        >
          <Globe2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="uppercase text-[11px] font-mono">{language}</span>
        </button>

        {/* Statistics */}
        <button
          onClick={() => openModal('stats')}
          className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'statistics')}
          aria-label={getTranslation(language, 'statistics')}
        >
          <BarChart2 className="w-4 h-4" />
        </button>

        {/* Enter Focus Mode */}
        <button
          onClick={toggleFocusMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-200 hover:bg-sky-500/30 transition-all text-xs font-medium"
          title={`${getTranslation(language, 'focusMode')} (F)`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{getTranslation(language, 'focusMode')}</span>
        </button>
      </div>
    </header>
  );
};
