import { create } from 'zustand';
import { SoundPreset } from '../types/preset';
import { DEFAULT_PRESETS } from '../audio/audioPresets';
import { useAudioStore } from './useAudioStore';
import { useSceneStore } from './useSceneStore';
import { SceneId } from '../types/scene';
import { ChannelId } from '../types/audio';

interface PresetStoreState {
  defaultPresets: SoundPreset[];
  userPresets: SoundPreset[];
  activePresetId: string | null;

  savePreset: (name: string) => SoundPreset;
  loadPreset: (preset: SoundPreset) => Promise<void>;
  renamePreset: (id: string, newName: string) => void;
  deletePreset: (id: string) => void;
  exportPresetUrl: (preset: SoundPreset) => string;
  importPresetFromUrl: (encoded: string) => SoundPreset | null;
  clearAllUserPresets: () => void;
}

const STORAGE_KEY = 'dreamscape_user_presets';

function loadStoredUserPresets(): SoundPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export const usePresetStore = create<PresetStoreState>((set, get) => ({
  defaultPresets: DEFAULT_PRESETS,
  userPresets: loadStoredUserPresets(),
  activePresetId: 'deep-focus',

  savePreset: (name: string) => {
    const audioState = useAudioStore.getState();
    const sceneState = useSceneStore.getState();
    const currentScene = sceneState.currentSceneId;

    const newPreset: SoundPreset = {
      id: 'custom-' + Date.now(),
      name: name.trim() || 'My Calm Atmosphere',
      sceneId: currentScene,
      isDefault: false,
      channelStates: audioState.channels,
      sceneSpecificSettings: sceneState.settings.specific[currentScene],
      createdAt: Date.now(),
    };

    set(state => {
      const updated = [newPreset, ...state.userPresets];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return { userPresets: updated, activePresetId: newPreset.id };
    });

    return newPreset;
  },

  loadPreset: async (preset: SoundPreset) => {
    // 1. Switch scene if different
    useSceneStore.getState().setScene(preset.sceneId);

    // 2. Apply scene-specific settings if available
    if (preset.sceneSpecificSettings) {
      useSceneStore.getState().updateSpecificSettings(preset.sceneId, preset.sceneSpecificSettings);
    }

    // 3. Apply sound mix
    await useAudioStore.getState().applyPreset(preset);

    set({ activePresetId: preset.id });
  },

  renamePreset: (id: string, newName: string) => {
    set(state => {
      const updated = state.userPresets.map(p =>
        p.id === id ? { ...p, name: newName.trim() } : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return { userPresets: updated };
    });
  },

  deletePreset: (id: string) => {
    set(state => {
      const updated = state.userPresets.filter(p => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return {
        userPresets: updated,
        activePresetId: state.activePresetId === id ? null : state.activePresetId,
      };
    });
  },

  exportPresetUrl: (preset: SoundPreset) => {
    try {
      const payload = {
        n: preset.name,
        s: preset.sceneId,
        c: Object.entries(preset.channelStates)
          .filter(([, v]) => v.isPlaying)
          .map(([id, v]) => ({ id, v: Math.round(v.volume * 100) / 100 })),
        ss: preset.sceneSpecificSettings || {},
      };
      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const url = new URL(window.location.href);
      url.searchParams.set('preset', encoded);
      return url.toString();
    } catch {
      return window.location.href;
    }
  },

  importPresetFromUrl: (encoded: string): SoundPreset | null => {
    try {
      const decodedJson = decodeURIComponent(atob(encoded));
      const payload = JSON.parse(decodedJson);

      if (!payload || !payload.s) return null;

      const channelStates: Record<ChannelId, { volume: number; isPlaying: boolean }> = {
        ...useAudioStore.getState().channels,
      };

      // Turn off all first
      (Object.keys(channelStates) as ChannelId[]).forEach(k => {
        channelStates[k] = { ...channelStates[k], isPlaying: false };
      });

      // Turn on active channels from payload
      if (Array.isArray(payload.c)) {
        payload.c.forEach((item: { id: ChannelId; v: number }) => {
          if (channelStates[item.id]) {
            channelStates[item.id] = { volume: item.v, isPlaying: true };
          }
        });
      }

      return {
        id: 'shared-' + Date.now(),
        name: payload.n || 'Shared Preset',
        sceneId: payload.s as SceneId,
        isDefault: false,
        channelStates,
        sceneSpecificSettings: payload.ss,
        createdAt: Date.now(),
      };
    } catch (e) {
      console.warn('Failed to parse shareable preset:', e);
      return null;
    }
  },

  clearAllUserPresets: () => {
    set({ userPresets: [] });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
}));
