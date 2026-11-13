import { useEffect } from 'react';
import { useTimerStore } from '../stores/useTimerStore';
import { useAudioStore } from '../stores/useAudioStore';
import { useUIStore } from '../stores/useUIStore';

export function useKeyboardShortcuts() {
  const { isRunning, startTimer, pauseTimer, remainingSeconds, totalDurationSeconds, resumeTimer } = useTimerStore();
  const { toggleMute } = useAudioStore();
  const { activeModal, closeModal, isFocusMode, toggleFocusMode } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcuts when user is typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Space: Start/Pause Timer
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          if (remainingSeconds < totalDurationSeconds) {
            resumeTimer();
          } else {
            startTimer();
          }
        }
      }

      // 'M' or 'm': Toggle Mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }

      // 'F' or 'f': Toggle Focus Mode
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFocusMode();
      }

      // 'Escape': Close open modal or exit focus mode
      if (e.key === 'Escape') {
        if (activeModal) {
          closeModal();
        } else if (isFocusMode) {
          toggleFocusMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    remainingSeconds,
    totalDurationSeconds,
    toggleMute,
    activeModal,
    closeModal,
    isFocusMode,
    toggleFocusMode,
  ]);
}
