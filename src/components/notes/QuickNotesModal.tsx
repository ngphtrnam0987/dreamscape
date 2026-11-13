import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import { Copy, Trash2, Check, FileText } from 'lucide-react';

const STORAGE_KEY = 'dreamscape_quick_notes';

export const QuickNotesModal: React.FC = () => {
  const { activeModal, closeModal, language, showToast } = useUIStore();
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, notes);
    } catch {}
  }, [notes]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(notes).then(() => {
        setCopied(true);
        showToast(getTranslation(language, 'notesCopied'));
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleClear = () => {
    setNotes('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  return (
    <Modal
      isOpen={activeModal === 'notes'}
      onClose={closeModal}
      title={getTranslation(language, 'quickNotes')}
      subtitle={getTranslation(language, 'quickNotesDesc')}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4 py-1">
        <div className="relative">
          <textarea
            rows={10}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={getTranslation(language, 'notesPlaceholder')}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-y custom-scrollbar font-sans leading-relaxed"
          />
        </div>

        {/* Footer info & controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>{wordCount} words</span>
            </span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {notes && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl glass-pill text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
                title={getTranslation(language, 'clearNotes')}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'clearNotes')}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              disabled={!notes}
              className="px-4 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{getTranslation(language, 'copyNotes')}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
