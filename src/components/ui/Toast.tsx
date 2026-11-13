import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useUIStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl glass-panel text-sm text-sky-200 border border-sky-500/30 shadow-2xl animate-fade-in pointer-events-none">
      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};
