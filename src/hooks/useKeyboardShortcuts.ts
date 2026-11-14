import { useEffect } from 'react';
import { useTimerStore } from '../stores/useTimerStore';
import { useAudioStore } from '../stores/useAudioStore';
import { useUIStore } from '../stores/useUIStore';
import { useSceneStore, SCENES_INFO } from '../stores/useSceneStore';
import { CLOCK_STYLES_INFO } from '../types/timer';
import { getTranslation } from '../locales';

export function useKeyboardShortcuts() {
  const {
    isRunning,
    startTimer,
    pauseTimer,
    remainingSeconds,
    totalDurationSeconds,
    resumeTimer,
    toggleClockSize,
    cycleClockStyle,
  } = useTimerStore();

  const { toggleMute } = useAudioStore();
  const {
    activeModal,
    closeModal,
    toggleModal,
    isFocusMode,
    toggleFocusMode,
    isZenMode,
    toggleZenMode,
    showToast,
    language,
  } = useUIStore();

  const { setScene, nextScene, previousScene } = useSceneStore();

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
        return;
      }

      // 'M' or 'm': Toggle Mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // 'F' or 'f': Toggle Focus Mode
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFocusMode();
        return;
      }

      // 'H' or 'h': Toggle Zen Scenery Mode (Hide all UI)
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        toggleZenMode();
        return;
      }

      // 'C' or 'c': Cycle Clock Size
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        toggleClockSize();
        return;
      }

      // 'V' or 'v': Cycle Clock Visual Style
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        cycleClockStyle();
        const activeStyle = useTimerStore.getState().settings.clockStyle || 'minimal';
        const info = CLOCK_STYLES_INFO.find(s => s.id === activeStyle);
        showToast(
          getTranslation(language, 'clockStyleToast').replace(
            '{style}',
            info ? (language === 'vi' ? info.nameVi : info.name) : activeStyle
          )
        );
        return;
      }

      // 'L' or 'l': Toggle Lofi & Video Modal
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleModal('lofi');
        return;
      }

      // 'T' or 't': Toggle Pomodoro Timer Modal
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleModal('timer');
        return;
      }

      // 'B' or 'b': Toggle Mindful Breathing Guide Modal
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleModal('breathe');
        return;
      }

      // 'N' or 'n': Toggle Focus Notes Modal
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        toggleModal('notes');
        return;
      }

      // 'K' or 'k': Toggle Daily Tasks Modal
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        toggleModal('tasks');
        return;
      }

      // 'S' or 's': Toggle Sound Mixer Modal
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleModal('mixer');
        return;
      }

      // '?' or '/': Toggle Shortcuts Guide Modal
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        toggleModal('shortcuts');
        return;
      }

      // '1' through '8': Quick Scene Switch
      if (/^[1-8]$/.test(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (SCENES_INFO[index]) {
          e.preventDefault();
          setScene(SCENES_INFO[index].id);
          showToast(`Scene: ${SCENES_INFO[index].name}`);
        }
        return;
      }

      // '[': Previous Scene
      if (e.key === '[') {
        e.preventDefault();
        previousScene();
        const current = SCENES_INFO.find(s => s.id === useSceneStore.getState().currentSceneId);
        if (current) {
          showToast(`Scene: ${current.name}`);
        }
        return;
      }

      // ']': Next Scene
      if (e.key === ']') {
        e.preventDefault();
        nextScene();
        const current = SCENES_INFO.find(s => s.id === useSceneStore.getState().currentSceneId);
        if (current) {
          showToast(`Scene: ${current.name}`);
        }
        return;
      }

      // 'Escape': Close open modal or exit focus / zen mode
      if (e.key === 'Escape') {
        if (activeModal) {
          closeModal();
        } else if (isZenMode) {
          toggleZenMode();
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
    toggleClockSize,
    cycleClockStyle,
    toggleMute,
    activeModal,
    closeModal,
    toggleModal,
    isFocusMode,
    toggleFocusMode,
    isZenMode,
    toggleZenMode,
    setScene,
    nextScene,
    previousScene,
    showToast,
    language,
  ]);
}
