import { create } from 'zustand';

export type WellnessAlertType = 'hydration' | 'eyeRest';

interface WellnessState {
  hydrationEnabled: boolean;
  hydrationIntervalMinutes: number;
  eyeRestEnabled: boolean;
  eyeRestIntervalMinutes: number;

  activeAlert: WellnessAlertType | null;
  lastHydrationTimestamp: number;
  lastEyeRestTimestamp: number;

  triggerAlert: (type: WellnessAlertType) => void;
  dismissAlert: () => void;
  toggleHydration: () => void;
  toggleEyeRest: () => void;
  checkTimers: () => void;
}

const STORAGE_KEY = 'dreamscape_wellness_settings';

function loadStoredWellness(): {
  hydrationEnabled: boolean;
  hydrationIntervalMinutes: number;
  eyeRestEnabled: boolean;
  eyeRestIntervalMinutes: number;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        hydrationEnabled: typeof parsed.hydrationEnabled === 'boolean' ? parsed.hydrationEnabled : true,
        hydrationIntervalMinutes: typeof parsed.hydrationIntervalMinutes === 'number' ? parsed.hydrationIntervalMinutes : 35,
        eyeRestEnabled: typeof parsed.eyeRestEnabled === 'boolean' ? parsed.eyeRestEnabled : true,
        eyeRestIntervalMinutes: typeof parsed.eyeRestIntervalMinutes === 'number' ? parsed.eyeRestIntervalMinutes : 20,
      };
    }
  } catch {}
  return {
    hydrationEnabled: true,
    hydrationIntervalMinutes: 35,
    eyeRestEnabled: true,
    eyeRestIntervalMinutes: 20,
  };
}

const initial = loadStoredWellness();

export const useWellnessStore = create<WellnessState>((set, get) => ({
  hydrationEnabled: initial.hydrationEnabled,
  hydrationIntervalMinutes: initial.hydrationIntervalMinutes,
  eyeRestEnabled: initial.eyeRestEnabled,
  eyeRestIntervalMinutes: initial.eyeRestIntervalMinutes,

  activeAlert: null,
  lastHydrationTimestamp: Date.now(),
  lastEyeRestTimestamp: Date.now(),

  triggerAlert: (type: WellnessAlertType) => {
    set({ activeAlert: type });
  },

  dismissAlert: () => {
    const current = get().activeAlert;
    set({
      activeAlert: null,
      lastHydrationTimestamp: current === 'hydration' ? Date.now() : get().lastHydrationTimestamp,
      lastEyeRestTimestamp: current === 'eyeRest' ? Date.now() : get().lastEyeRestTimestamp,
    });
  },

  toggleHydration: () => {
    set(state => {
      const updated = !state.hydrationEnabled;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          hydrationEnabled: updated,
          hydrationIntervalMinutes: state.hydrationIntervalMinutes,
          eyeRestEnabled: state.eyeRestEnabled,
          eyeRestIntervalMinutes: state.eyeRestIntervalMinutes,
        }));
      } catch {}
      return {
        hydrationEnabled: updated,
        lastHydrationTimestamp: Date.now(),
      };
    });
  },

  toggleEyeRest: () => {
    set(state => {
      const updated = !state.eyeRestEnabled;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          hydrationEnabled: state.hydrationEnabled,
          hydrationIntervalMinutes: state.hydrationIntervalMinutes,
          eyeRestEnabled: updated,
          eyeRestIntervalMinutes: state.eyeRestIntervalMinutes,
        }));
      } catch {}
      return {
        eyeRestEnabled: updated,
        lastEyeRestTimestamp: Date.now(),
      };
    });
  },

  checkTimers: () => {
    const {
      hydrationEnabled,
      hydrationIntervalMinutes,
      eyeRestEnabled,
      eyeRestIntervalMinutes,
      lastHydrationTimestamp,
      lastEyeRestTimestamp,
      activeAlert,
    } = get();

    if (activeAlert) return; // Don't interrupt if one is already showing

    const now = Date.now();

    // Check Hydration
    if (hydrationEnabled && now - lastHydrationTimestamp >= hydrationIntervalMinutes * 60 * 1000) {
      set({ activeAlert: 'hydration' });
      return;
    }

    // Check Eye Rest
    if (eyeRestEnabled && now - lastEyeRestTimestamp >= eyeRestIntervalMinutes * 60 * 1000) {
      set({ activeAlert: 'eyeRest' });
    }
  },
}));
