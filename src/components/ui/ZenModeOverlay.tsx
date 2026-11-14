import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { getTranslation } from '../../locales';
import { Eye, Sparkles } from 'lucide-react';

export const ZenModeOverlay: React.FC = () => {
  const { isZenMode, toggleZenMode, language } = useUIStore();
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!isZenMode) {
      setShowHint(true);
      return;
    }

    // Automatically fade hint after 4 seconds
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isZenMode]);

  if (!isZenMode) return null;

  return (
    <div
      onClick={toggleZenMode}
      onMouseMove={() => setShowHint(true)}
      className="fixed inset-0 z-20 cursor-pointer select-none"
      title="Click anywhere to exit Zen Scenery Mode"
    >
      {/* Floating Zen hint */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-auto ${
          showHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleZenMode();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel shadow-2xl border border-white/20 text-xs text-slate-200 hover:text-white transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>{getTranslation(language, 'exitZenModeHint')}</span>
          <Eye className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
      </div>
    </div>
  );
};
