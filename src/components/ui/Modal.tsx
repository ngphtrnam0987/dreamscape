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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
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
        className={`relative w-full ${maxWidthClass} glass-panel rounded-2xl p-5 sm:p-6 text-slate-100 shadow-2xl z-10 max-h-[90vh] flex flex-col border border-white/10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-display">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
