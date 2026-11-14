import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore, SCENES_INFO } from '../../stores/useSceneStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { getTranslation } from '../../locales';
import {
  Sparkles,
  Compass,
  BarChart2,
  Maximize2,
  Globe2,
  Wind,
  FileText,
  Bell,
  Eye,
  HelpCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Type,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    openModal,
    toggleFocusMode,
    language,
    setLanguage,
    isFocusMode,
    isZenMode,
    toggleZenMode,
  } = useUIStore();
  const { currentSceneId, nextScene, previousScene } = useSceneStore();
  const { playChime } = useAudioStore();
  const { tasks } = useTaskStore();

  if (isFocusMode || isZenMode) return null;

  const pendingTaskCount = tasks.filter(t => !t.completed).length;

  const currentScene = SCENES_INFO.find(s => s.id === currentSceneId) || SCENES_INFO[0];
  const sceneName = language === 'vi' ? currentScene.nameVi : currentScene.name;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-2.5 sm:px-6 pt-safe py-2 sm:py-3.5 transition-all duration-300 w-full max-w-full">
      {/* Brand & Active Scene */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl glass-panel-subtle border border-white/10 shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse-subtle" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold tracking-wide font-display text-white">
              DreamScape
            </div>
            <div className="text-[10px] text-slate-400 hidden md:block">
              {getTranslation(language, 'tagline')}
            </div>
          </div>
        </div>

        {/* Scene Pill Switcher with Step Chevrons */}
        <div className="flex items-center rounded-2xl glass-pill text-xs font-medium text-slate-200 min-w-0 shrink p-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              previousScene();
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={getTranslation(language, 'prevScene')}
            aria-label={getTranslation(language, 'prevScene')}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => openModal('scenes')}
            className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 transition-all hover:text-white min-w-0"
            title={getTranslation(language, 'scenes')}
          >
            <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden lg:inline text-slate-400">{getTranslation(language, 'scenes')}:</span>
            <span className="font-semibold text-white truncate max-w-[70px] xs:max-w-[105px] sm:max-w-[145px] md:max-w-none">
              {sceneName}
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextScene();
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={getTranslation(language, 'nextScene')}
            aria-label={getTranslation(language, 'nextScene')}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Tibetan Singing Bowl Chime */}
        <button
          onClick={() => playChime(0.6)}
          className="p-1.5 sm:p-2 rounded-xl glass-pill text-slate-300 hover:text-amber-300 transition-all"
          title={`${getTranslation(language, 'tibetanChime')} (${getTranslation(language, 'playChimeTip')})`}
          aria-label={getTranslation(language, 'tibetanChime')}
        >
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
        </button>

        {/* Mindful Breathing Guide */}
        <button
          onClick={() => openModal('breathe')}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          title={`${getTranslation(language, 'breathe')} (B)`}
          aria-label={getTranslation(language, 'breathe')}
        >
          <Wind className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="hidden md:inline">{getTranslation(language, 'breathe')}</span>
        </button>

        {/* Task Focus / To-Do List */}
        <button
          onClick={() => openModal('tasks')}
          className="relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          title={`${getTranslation(language, 'tasks')} (K)`}
          aria-label={getTranslation(language, 'tasks')}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden md:inline">{getTranslation(language, 'tasks')}</span>
          {pendingTaskCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
              {pendingTaskCount}
            </span>
          )}
        </button>

        {/* Focus Notes / Scratchpad */}
        <button
          onClick={() => openModal('notes')}
          className="p-1.5 sm:p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-all"
          title={`${getTranslation(language, 'quickNotes')} (N)`}
          aria-label={getTranslation(language, 'quickNotes')}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
        </button>

        {/* Typography & Fonts Quick Button */}
        <button
          onClick={() => openModal('typography')}
          className="p-1.5 sm:p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'typography')}
          aria-label={getTranslation(language, 'typography')}
        >
          <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
          className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'toggleLanguage')}
        >
          <Globe2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 shrink-0" />
          <span className="uppercase text-[10px] sm:text-[11px] font-mono">{language}</span>
        </button>

        {/* Statistics */}
        <button
          onClick={() => openModal('stats')}
          className="p-1.5 sm:p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-all"
          title={getTranslation(language, 'statistics')}
          aria-label={getTranslation(language, 'statistics')}
        >
          <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
        </button>

        {/* Shortcuts Guide Help Modal */}
        <button
          onClick={() => openModal('shortcuts')}
          className="p-1.5 sm:p-2 rounded-xl glass-pill text-slate-400 hover:text-white transition-all hidden sm:block"
          title={`${getTranslation(language, 'shortcutsTitle')} (?)`}
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Enter Zen Scenery Mode (Hide UI) */}
        <button
          onClick={toggleZenMode}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          title={`${getTranslation(language, 'zenMode')} (H)`}
          aria-label={getTranslation(language, 'zenMode')}
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden xl:inline">{getTranslation(language, 'zenMode')}</span>
        </button>

        {/* Enter Focus Mode */}
        <button
          onClick={toggleFocusMode}
          className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-200 hover:bg-sky-500/30 transition-all text-xs font-medium"
          title={`${getTranslation(language, 'focusMode')} (F)`}
          aria-label={getTranslation(language, 'focusMode')}
        >
          <Maximize2 className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{getTranslation(language, 'focusMode')}</span>
        </button>
      </div>
    </header>
  );
};
