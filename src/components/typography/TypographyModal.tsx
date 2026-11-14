import React, { useState, useRef } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useFontStore } from '../../stores/useFontStore';
import { PRESET_FONTS, FontCategory, FontId } from '../../types/font';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import {
  Type,
  Upload,
  Trash2,
  Check,
  Sparkles,
  Sliders,
  FileText,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const TypographyModal: React.FC = () => {
  const { activeModal, closeModal, language, showToast } = useUIStore();
  const {
    currentFontId,
    customFontMeta,
    fontScale,
    setFont,
    setFontScale,
    uploadCustomFont,
    removeCustomFont,
    isLoading,
    error,
  } = useFontStore();

  const [activeCategory, setActiveCategory] = useState<FontCategory>('all');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: { id: FontCategory; label: string }[] = [
    { id: 'all', label: getTranslation(language, 'fontCategoryAll') },
    { id: 'clean', label: getTranslation(language, 'fontCategoryClean') },
    { id: 'serif', label: getTranslation(language, 'fontCategorySerif') },
    { id: 'mono', label: getTranslation(language, 'fontCategoryMono') },
    { id: 'handwriting', label: getTranslation(language, 'fontCategoryHandwriting') },
    { id: 'rounded', label: getTranslation(language, 'fontCategoryRounded') },
    { id: 'custom', label: getTranslation(language, 'fontCategoryCustom') },
  ];

  const filteredFonts = PRESET_FONTS.filter(
    (font) => activeCategory === 'all' || font.category === activeCategory
  );

  const handleSelectFont = async (fontId: FontId, fontName: string) => {
    await setFont(fontId);
    showToast(getTranslation(language, 'fontAppliedToast').replace('{font}', fontName));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await uploadCustomFont(file);
      if (res.success) {
        showToast(getTranslation(language, 'fontUploadSuccessToast'));
      } else if (res.error) {
        showToast(getTranslation(language, 'fontUploadErrorToast').replace('{error}', res.error));
      }
    }
    if (e.target) e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const res = await uploadCustomFont(file);
      if (res.success) {
        showToast(getTranslation(language, 'fontUploadSuccessToast'));
      } else if (res.error) {
        showToast(getTranslation(language, 'fontUploadErrorToast').replace('{error}', res.error));
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal
      isOpen={activeModal === 'typography'}
      onClose={closeModal}
      title={getTranslation(language, 'typographyTitle')}
      subtitle={getTranslation(language, 'typographySubtitle')}
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-5 py-2">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
                    : 'glass-pill text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Custom Font Upload Area */}
        {(activeCategory === 'all' || activeCategory === 'custom') && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>{getTranslation(language, 'uploadCustomFont')}</span>
              </div>
              {customFontMeta && (
                <button
                  onClick={removeCustomFont}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/15 border border-rose-400/20 transition-colors"
                  title={getTranslation(language, 'removeCustomFont')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'removeCustomFont')}</span>
                </button>
              )}
            </div>

            {customFontMeta ? (
              <div
                onClick={() => handleSelectFont('custom', customFontMeta.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  currentFontId === 'custom'
                    ? 'bg-sky-500/20 border-sky-400/50 shadow-md ring-2 ring-sky-400/20'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 font-bold text-xs uppercase shrink-0">
                    {customFontMeta.format}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate font-['DreamscapeCustomFont']">
                        {customFontMeta.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {formatFileSize(customFontMeta.fileSize)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-['DreamscapeCustomFont'] truncate">
                      Aa Bb Gg 123 • Tiếng Việt có dấu mẫu
                    </div>
                  </div>
                </div>

                {currentFontId === 'custom' && (
                  <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-sky-400 bg-sky-500/15'
                    : 'border-white/15 hover:border-white/30 bg-slate-900/40 hover:bg-slate-900/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-sky-400 mx-auto mb-2 opacity-80" />
                <div className="text-xs font-medium text-slate-200">
                  {getTranslation(language, 'uploadFontDrop')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {getTranslation(language, 'uploadFontHint')}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Preset Font Cards Grid */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {getTranslation(language, 'fontCategoryAll')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredFonts.map((font) => {
              const isSelected = currentFontId === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => handleSelectFont(font.id, font.name)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border-sky-400/50 shadow-md ring-2 ring-sky-400/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white tracking-wide">
                      {font.name}
                    </span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {font.category}
                      </span>
                    )}
                  </div>

                  {/* Font Sample Styled in Its Own Family */}
                  <div
                    className="text-base text-slate-200 py-1 truncate"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    {font.sample}
                  </div>

                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {language === 'vi' ? font.descVi : font.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Typography Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">
              {getTranslation(language, 'previewTextLabel')}
            </span>
            <span className="font-mono text-[11px] text-sky-400">
              Font: {currentFontId === 'custom' ? customFontMeta?.name || 'Custom' : currentFontId}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {getTranslation(language, 'previewTextSample')}
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-t border-white/5 pt-2">
              <span>Pomodoro: 25:00</span>
              <span>•</span>
              <span>100% Flow</span>
              <span>•</span>
              <span>12:34:56 PM</span>
            </div>
          </div>
        </div>

        {/* Font Size Scaling Slider */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{getTranslation(language, 'fontScale')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-semibold">{fontScale}%</span>
              {fontScale !== 100 && (
                <button
                  onClick={() => setFontScale(100)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Reset to 100%"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <input
            type="range"
            min={85}
            max={120}
            step={5}
            value={fontScale}
            onChange={(e) => setFontScale(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>85% (Compact)</span>
            <span>100% (Default)</span>
            <span>120% (Comfort)</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
