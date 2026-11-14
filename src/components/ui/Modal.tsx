import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-fade-in pt-safe pb-safe"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Surface */}
      <div
        className={`relative w-full ${maxWidthClass} glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-slate-100 shadow-2xl z-10 max-h-[94vh] sm:max-h-[90vh] flex flex-col border border-white/10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3 sm:mb-4 shrink-0 gap-2">
          <div className="min-w-0 pr-2">
            <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-white font-display truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-0.5 sm:pr-1 flex-1 space-y-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
