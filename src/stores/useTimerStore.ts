import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { TimerMode, TimerSettings, ClockSize, ClockDisplayType } from '../types/timer';
import { audioEngine } from '../audio/AudioEngine';
import { useStatsStore } from './useStatsStore';

interface TimerStoreState {
  mode: TimerMode;
  isRunning: boolean;
  targetEndTime: number | null;
  remainingSeconds: number;
  totalDurationSeconds: number;
  completedSessions: number;
  settings: TimerSettings;

  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  setMode: (mode: TimerMode) => void;
  updateSettings: (partial: Partial<TimerSettings>) => void;
  setClockSize: (size: ClockSize) => void;
  setClockDisplayType: (type: ClockDisplayType) => void;
  toggleClockSize: () => void;
  tick: () => void;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundAlertEnabled: true,
  clockSize: 'medium',
  clockDisplayType: 'pomodoro',
};

const STORAGE_KEY = 'dreamscape_timer_state';

function getDurationSeconds(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'focus': return Math.round(settings.focusMinutes * 60);
    case 'short-break': return Math.round(settings.shortBreakMinutes * 60);
    case 'long-break': return Math.round(settings.longBreakMinutes * 60);
  }
}

function loadStoredTimer(): {
  mode: TimerMode;
  remainingSeconds: number;
  completedSessions: number;
  settings: TimerSettings;
  targetEndTime: number | null;
  isRunning: boolean;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const settings = { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) };
      const mode: TimerMode = parsed.mode || 'focus';
      const targetEndTime: number | null = parsed.targetEndTime || null;
      let remainingSeconds = parsed.remainingSeconds;
      let isRunning = Boolean(parsed.isRunning);

      // Handle page reload while running
      if (isRunning && targetEndTime) {
        const diffMs = targetEndTime - Date.now();
        if (diffMs > 0) {
          remainingSeconds = Math.ceil(diffMs / 1000);
        } else {
          // Timer finished while offline/refreshing
          remainingSeconds = 0;
          isRunning = false;
        }
      }

      if (typeof remainingSeconds !== 'number' || remainingSeconds < 0) {
        remainingSeconds = getDurationSeconds(mode, settings);
      }

      return {
        mode,
        remainingSeconds,
        completedSessions: parsed.completedSessions || 0,
        settings,
        targetEndTime: isRunning ? targetEndTime : null,
        isRunning,
      };
    }
  } catch {}

  const defaultTotal = getDurationSeconds('focus', DEFAULT_SETTINGS);
  return {
    mode: 'focus',
    remainingSeconds: defaultTotal,
    completedSessions: 0,
    settings: DEFAULT_SETTINGS,
    targetEndTime: null,
    isRunning: false,
  };
}

const initial = loadStoredTimer();

export const useTimerStore = create<TimerStoreState>((set, get) => ({
  mode: initial.mode,
  isRunning: initial.isRunning,
  targetEndTime: initial.targetEndTime,
  remainingSeconds: initial.remainingSeconds,
  totalDurationSeconds: getDurationSeconds(initial.mode, initial.settings),
  completedSessions: initial.completedSessions,
  settings: initial.settings,

  startTimer: () => {
    const state = get();
    const duration = state.remainingSeconds > 0 ? state.remainingSeconds : getDurationSeconds(state.mode, state.settings);
    const targetEndTime = Date.now() + duration * 1000;

    set({
      isRunning: true,
      targetEndTime,
      remainingSeconds: duration,
      totalDurationSeconds: getDurationSeconds(state.mode, state.settings),
    });

    saveTimerToStorage(get());
  },

  pauseTimer: () => {
    const state = get();
    if (!state.isRunning) return;

    let rem = state.remainingSeconds;
    if (state.targetEndTime) {
      rem = Math.max(0, Math.ceil((state.targetEndTime - Date.now()) / 1000));
    }

    set({
      isRunning: false,
      targetEndTime: null,
      remainingSeconds: rem,
    });

    saveTimerToStorage(get());
  },

  resumeTimer: () => {
    get().startTimer();
  },

  resetTimer: () => {
    const state = get();
    const total = getDurationSeconds(state.mode, state.settings);
    set({
      isRunning: false,
      targetEndTime: null,
      remainingSeconds: total,
      totalDurationSeconds: total,
    });
    saveTimerToStorage(get());
  },

  setMode: (mode: TimerMode) => {
    const state = get();
    const total = getDurationSeconds(mode, state.settings);
    set({
      mode,
      isRunning: false,
      targetEndTime: null,
      remainingSeconds: total,
      totalDurationSeconds: total,
    });
    saveTimerToStorage(get());
  },

  skipSession: () => {
    const state = get();
    handleSessionCompletion(state, set, get);
  },

  updateSettings: (partial: Partial<TimerSettings>) => {
    set(state => {
      const newSettings = { ...state.settings, ...partial };
      const currentModeTotal = getDurationSeconds(state.mode, newSettings);
      // Adjust remaining if timer is not running
      const remainingSeconds = state.isRunning ? state.remainingSeconds : currentModeTotal;

      const newState = {
        settings: newSettings,
        totalDurationSeconds: currentModeTotal,
        remainingSeconds,
      };
      saveTimerToStorage({ ...state, ...newState });
      return newState;
    });
  },

  setClockSize: (clockSize: ClockSize) => {
    get().updateSettings({ clockSize });
  },

  setClockDisplayType: (clockDisplayType: ClockDisplayType) => {
    get().updateSettings({ clockDisplayType });
  },

  toggleClockSize: () => {
    const current = get().settings.clockSize;
    const cycle: Record<ClockSize, ClockSize> = {
      small: 'medium',
      medium: 'large',
      large: 'hidden',
      hidden: 'small',
    };
    get().setClockSize(cycle[current] || 'medium');
  },

  tick: () => {
    const state = get();
    if (!state.isRunning || !state.targetEndTime) return;

    const remainingMs = state.targetEndTime - Date.now();
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

    if (remainingSeconds <= 0) {
      handleSessionCompletion(state, set, get);
    } else {
      set({ remainingSeconds });
    }
  },
}));

function handleSessionCompletion(
  state: TimerStoreState,
  set: (state: Partial<TimerStoreState>) => void,
  get: () => TimerStoreState
) {
  // Play soft completion chime
  if (state.settings.soundAlertEnabled) {
    audioEngine.playChime(0.6);
  }

  // Browser notification if permitted
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const title = state.mode === 'focus' ? 'Focus Session Completed!' : 'Break Completed!';
    const body = state.mode === 'focus' ? 'Awesome job! Time for a refreshing break.' : 'Break is over. Ready to focus again?';
    try {
      new Notification(title, { body, icon: '/vite.svg' });
    } catch {}
  }

  // If focus session completed, record into stats
  let completedCount = state.completedSessions;
  if (state.mode === 'focus') {
    completedCount += 1;
    useStatsStore.getState().recordFocusSession(state.settings.focusMinutes);

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#34d399'],
        disableForReducedMotion: true,
      });
    } catch {}
  }

  // Determine next mode
  let nextMode: TimerMode = 'focus';
  if (state.mode === 'focus') {
    if (completedCount % state.settings.longBreakInterval === 0) {
      nextMode = 'long-break';
    } else {
      nextMode = 'short-break';
    }
  } else {
    nextMode = 'focus';
  }

  const nextDuration = getDurationSeconds(nextMode, state.settings);
  const shouldAutoStart = nextMode === 'focus' ? state.settings.autoStartFocus : state.settings.autoStartBreaks;

  const targetEndTime = shouldAutoStart ? Date.now() + nextDuration * 1000 : null;

  set({
    mode: nextMode,
    isRunning: shouldAutoStart,
    targetEndTime,
    remainingSeconds: nextDuration,
    totalDurationSeconds: nextDuration,
    completedSessions: completedCount,
  });

  saveTimerToStorage(get());
}

function saveTimerToStorage(state: TimerStoreState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: state.mode,
        remainingSeconds: state.remainingSeconds,
        completedSessions: state.completedSessions,
        settings: state.settings,
        targetEndTime: state.targetEndTime,
        isRunning: state.isRunning,
      })
    );
  } catch {}
}
