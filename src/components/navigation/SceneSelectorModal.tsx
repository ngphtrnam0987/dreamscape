import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore, SCENES_INFO } from '../../stores/useSceneStore';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import { Check, CloudRain, Trees, Waves, Flame, MoonStar } from 'lucide-react';
import { SceneId } from '../../types/scene';

export const SceneSelectorModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const { currentSceneId, setScene } = useSceneStore();

  const getSceneIcon = (id: SceneId) => {
    switch (id) {
      case 'rainy-night': return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'forest-retreat': return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'ocean-sunset': return <Waves className="w-5 h-5 text-amber-400" />;
      case 'cozy-fireplace': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'cosmic-dream': return <MoonStar className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleSelectScene = (sceneId: SceneId) => {
    setScene(sceneId);
    closeModal();
  };

  return (
    <Modal
      isOpen={activeModal === 'scenes'}
      onClose={closeModal}
      title={getTranslation(language, 'scenes')}
      subtitle="Select a tranquil atmosphere for your session"
      maxWidthClass="max-w-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 pb-2">
        {SCENES_INFO.map(scene => {
          const isActive = scene.id === currentSceneId;
          const name = language === 'vi' ? scene.nameVi : scene.name;
          const subtitle = language === 'vi' ? scene.subtitleVi : scene.subtitle;

          return (
            <button
              key={scene.id}
              onClick={() => handleSelectScene(scene.id)}
              className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 border ${
                isActive
                  ? 'border-sky-400 bg-white/10 ring-2 ring-sky-400/30 shadow-lg scale-[1.01]'
                  : 'border-white/10 hover:border-white/25 bg-slate-900/60 hover:bg-slate-800/70'
              }`}
            >
              {/* Scene Gradient Accent */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${scene.themeGradient} opacity-30 group-hover:opacity-45 transition-opacity`}
              />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                    {getSceneIcon(scene.id)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white font-display">
                      {name}
                    </h3>
                    <span className="inline-block text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300 mt-1">
                      {scene.badge}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="relative z-10 text-xs text-slate-300 mt-3 line-clamp-2">
                {subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
