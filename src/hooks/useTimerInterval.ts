import { useEffect } from 'react';
import { useTimerStore } from '../stores/useTimerStore';

export function useTimerInterval() {
  const { isRunning, remainingSeconds, mode, tick } = useTimerStore();

  // Drift-free ticking loop
  useEffect(() => {
    if (!isRunning) return;

    // Check every 250ms to ensure tight synchronization with targetEndTime
    const interval = setInterval(() => {
      tick();
    }, 250);

    // Immediate sync on tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, tick]);

  // Document title updater
  useEffect(() => {
    if (isRunning) {
      const m = Math.floor(remainingSeconds / 60);
      const s = remainingSeconds % 60;
      const formatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      const modeLabel = mode === 'focus' ? 'Focus' : 'Break';
      document.title = `(${formatted}) ${modeLabel} — DreamScape`;
    } else {
      document.title = 'DreamScape — Your Personal Escape';
    }
  }, [isRunning, remainingSeconds, mode]);
}
