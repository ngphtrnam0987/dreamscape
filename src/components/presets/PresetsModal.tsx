import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { usePresetStore } from '../../stores/usePresetStore';
import { Modal } from '../ui/Modal';
import { SoundPreset } from '../../types/preset';
import { getTranslation } from '../../locales';
import {
  Bookmark,
  Share2,
  Trash2,
  Edit2,
  Check,
  Plus,
  Play,
  Sparkles,
  Layers,
  Download,
  Upload,
} from 'lucide-react';

export const PresetsModal: React.FC = () => {
  const { activeModal, closeModal, language, showToast } = useUIStore();
  const {
    defaultPresets,
    userPresets,
    activePresetId,
    loadPreset,
    savePreset,
    deletePreset,
    renamePreset,
    exportPresetUrl,
    importPresetsList,
  } = usePresetStore();

  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    const saved = savePreset(newPresetName.trim());
    setIsSavingNew(false);
    setNewPresetName('');
    showToast(getTranslation(language, 'presetSavedSuccess'));
    loadPreset(saved);
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renamePreset(id, editingName.trim());
    }
    setEditingPresetId(null);
  };

  const handleShare = (preset: SoundPreset) => {
    const url = exportPresetUrl(preset);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast(getTranslation(language, 'copiedToClipboard'));
      });
    }
  };

  const handleLoad = async (preset: SoundPreset) => {
    await loadPreset(preset);
    showToast(getTranslation(language, 'presetLoadedSuccess', { name: preset.name }));
    closeModal();
  };

  const handleExportJson = () => {
    if (userPresets.length === 0) return;
    const blob = new Blob([JSON.stringify(userPresets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dreamscape-presets-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Presets exported successfully');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const count = importPresetsList(list);
        if (count > 0) {
          showToast(getTranslation(language, 'presetsImportedSuccess', { count }));
        } else {
          showToast(getTranslation(language, 'invalidJsonFile'));
        }
      } catch {
        showToast(getTranslation(language, 'invalidJsonFile'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Modal
      isOpen={activeModal === 'presets'}
      onClose={closeModal}
      title={getTranslation(language, 'presets')}
      subtitle="Curated atmospheres & personalized sound combinations"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Save Current Mix Action Header */}
        {!isSavingNew ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 border border-sky-400/20 gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white">Love your current atmosphere?</h4>
                <p className="text-[11px] text-slate-300">Save your active sounds and scene settings to re-open anytime.</p>
              </div>
            </div>
            <button
              onClick={() => setIsSavingNew(true)}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 self-end sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{getTranslation(language, 'saveCurrentAsPreset')}</span>
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSaveCurrent}
            className="p-3.5 rounded-2xl bg-white/5 border border-sky-400/30 space-y-2.5 animate-fade-in"
          >
            <label className="text-xs font-semibold text-white block">
              {getTranslation(language, 'saveCurrentAsPreset')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder={getTranslation(language, 'presetNamePlaceholder')}
                value={newPresetName}
                onChange={e => setNewPresetName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:ring-2 focus:ring-sky-400 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-all"
              >
                {getTranslation(language, 'save')}
              </button>
              <button
                type="button"
                onClick={() => setIsSavingNew(false)}
                className="px-3 py-2 rounded-xl glass-pill text-slate-400 hover:text-white text-xs"
              >
                {getTranslation(language, 'cancel')}
              </button>
            </div>
          </form>
        )}

        {/* User Saved Presets */}
        {userPresets.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                <span>{getTranslation(language, 'savedPresets')}</span>
              </h4>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportJson}
                  className="px-2.5 py-1 rounded-lg glass-pill text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
                  title="Export presets JSON"
                >
                  <Download className="w-3 h-3 text-sky-400" />
                  <span>{getTranslation(language, 'exportPresets')}</span>
                </button>
                <label className="px-2.5 py-1 rounded-lg glass-pill text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>{getTranslation(language, 'importPresets')}</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {userPresets.map(preset => {
                const isActive = activePresetId === preset.id;
                const isEditing = editingPresetId === preset.id;
                const isDeleting = deleteConfirmId === preset.id;

                const activeChannels = Object.entries(preset.channelStates)
                  .filter(([, s]) => s.isPlaying)
                  .map(([id]) => id);

                return (
                  <div
                    key={preset.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-sky-500/15 border-sky-400/40'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-white/20 text-xs text-white"
                          />
                          <button
                            onClick={() => handleRename(preset.id)}
                            className="p-1 rounded text-sky-400 hover:text-sky-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white font-display">
                            {preset.name}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {preset.sceneId}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {activeChannels.map(ch => (
                          <span
                            key={ch}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/20"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-red-950/80 px-2 py-1 rounded-xl border border-red-500/40 text-xs">
                          <span className="text-[11px] text-red-200">Delete?</span>
                          <button
                            onClick={() => {
                              deletePreset(preset.id);
                              setDeleteConfirmId(null);
                              showToast(getTranslation(language, 'presetDeletedSuccess'));
                            }}
                            className="text-red-400 font-bold hover:underline px-1"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-slate-400 hover:underline px-1"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleLoad(preset)}
                            className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-medium flex items-center gap-1"
                            title="Load preset"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Load</span>
                          </button>

                          <button
                            onClick={() => handleShare(preset)}
                            className="p-1.5 rounded-xl glass-pill text-slate-400 hover:text-white"
                            title={getTranslation(language, 'sharePreset')}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingPresetId(preset.id);
                              setEditingName(preset.name);
                            }}
                            className="p-1.5 rounded-xl glass-pill text-slate-400 hover:text-white"
                            title="Rename"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(preset.id)}
                            className="p-1.5 rounded-xl glass-pill text-slate-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Curated Default Presets */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTranslation(language, 'defaultPresets')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {defaultPresets.map(preset => {
              const isActive = activePresetId === preset.id;
              const activeCount = Object.values(preset.channelStates).filter(s => s.isPlaying).length;

              return (
                <button
                  key={preset.id}
                  onClick={() => handleLoad(preset)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-400/40 ring-2 ring-amber-400/20 shadow-md'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white font-display">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {preset.sceneId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">
                    {preset.id === 'deep-focus' && getTranslation(language, 'presetDeepFocusDesc')}
                    {preset.id === 'cozy-night' && getTranslation(language, 'presetCozyNightDesc')}
                    {preset.id === 'forest-morning' && getTranslation(language, 'presetForestMorningDesc')}
                    {preset.id === 'ocean-calm' && getTranslation(language, 'presetOceanCalmDesc')}
                    {preset.id === 'sleep-mode' && getTranslation(language, 'presetSleepModeDesc')}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                    <span>{activeCount} active sound layers</span>
                    <span className="text-amber-400 flex items-center gap-1 font-medium">
                      <Play className="w-3 h-3 fill-current" />
                      Apply
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
