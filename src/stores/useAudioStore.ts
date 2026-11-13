import { create } from 'zustand';
import { ChannelId } from '../types/audio';
import { INITIAL_CHANNEL_STATES } from '../audio/channelDefinitions';
import { audioEngine } from '../audio/AudioEngine';
import { SoundPreset } from '../types/preset';

interface AudioState {
  masterVolume: number;
  isMuted: boolean;
  channels: Record<ChannelId, { volume: number; isPlaying: boolean }>;
  isAudioInitialized: boolean;
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSeconds: number | null;

  initAudio: () => Promise<boolean>;
  toggleChannel: (channelId: ChannelId) => Promise<void>;
  setChannelVolume: (channelId: ChannelId, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  toggleMute: () => void;
  stopAll: () => void;
  resetMixer: () => void;
  applyPreset: (preset: SoundPreset) => Promise<void>;
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
}

const STORAGE_KEY = 'dreamscape_audio_state';

function loadStoredAudio(): { masterVolume: number; channels: Record<ChannelId, { volume: number; isPlaying: boolean }> } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        masterVolume: typeof parsed.masterVolume === 'number' ? parsed.masterVolume : 0.8,
        channels: {
          ...INITIAL_CHANNEL_STATES,
          ...(parsed.channels || {}),
          // Autoplay policy: initialize isPlaying as false on fresh reload to respect browser policy
        },
      };
    }
  } catch {}
  return { masterVolume: 0.8, channels: INITIAL_CHANNEL_STATES };
}

const initial = loadStoredAudio();

export const useAudioStore = create<AudioState>((set, get) => ({
  masterVolume: initial.masterVolume,
  isMuted: false,
  channels: initial.channels,
  isAudioInitialized: false,
  sleepTimerMinutes: null,
  sleepTimerRemainingSeconds: null,

  initAudio: async () => {
    const ok = await audioEngine.init();
    if (ok) {
      set({ isAudioInitialized: true });
    }
    return ok;
  },

  toggleChannel: async (channelId: ChannelId) => {
    const state = get();
    await state.initAudio();

    const channel = state.channels[channelId];
    const willPlay = !channel.isPlaying;

    if (willPlay) {
      await audioEngine.startChannel(channelId, channel.volume);
    } else {
      audioEngine.stopChannel(channelId);
    }

    const updatedChannels = {
      ...state.channels,
      [channelId]: { ...channel, isPlaying: willPlay },
    };

    set({ channels: updatedChannels });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        masterVolume: state.masterVolume,
        channels: updatedChannels,
      }));
    } catch {}
  },

  setChannelVolume: (channelId: ChannelId, volume: number) => {
    const state = get();
    const clamped = Math.max(0, Math.min(1, volume));
    const channel = state.channels[channelId];

    audioEngine.setChannelVolume(channelId, clamped);

    const updatedChannels = {
      ...state.channels,
      [channelId]: { ...channel, volume: clamped },
    };

    set({ channels: updatedChannels });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        masterVolume: state.masterVolume,
        channels: updatedChannels,
      }));
    } catch {}
  },

  setMasterVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    audioEngine.setMasterVolume(clamped);
    set({ masterVolume: clamped });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        masterVolume: clamped,
        channels: get().channels,
      }));
    } catch {}
  },

  toggleMute: () => {
    const nextMute = !get().isMuted;
    audioEngine.setMute(nextMute);
    set({ isMuted: nextMute });
  },

  stopAll: () => {
    audioEngine.stopAllChannels();
    const stoppedChannels: Record<ChannelId, { volume: number; isPlaying: boolean }> = { ...get().channels };
    (Object.keys(stoppedChannels) as ChannelId[]).forEach(ch => {
      stoppedChannels[ch] = { ...stoppedChannels[ch], isPlaying: false };
    });
    set({ channels: stoppedChannels });
  },

  resetMixer: () => {
    audioEngine.stopAllChannels();
    audioEngine.setMasterVolume(0.8);
    audioEngine.setMute(false);
    set({
      masterVolume: 0.8,
      isMuted: false,
      channels: INITIAL_CHANNEL_STATES,
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },

  applyPreset: async (preset: SoundPreset) => {
    const state = get();
    await state.initAudio();

    // Stop current channels that are playing
    audioEngine.stopAllChannels(0.15);

    const newChannels: Record<ChannelId, { volume: number; isPlaying: boolean }> = { ...state.channels };

    for (const ch of Object.keys(INITIAL_CHANNEL_STATES) as ChannelId[]) {
      const presetCh = preset.channelStates[ch] || INITIAL_CHANNEL_STATES[ch];
      newChannels[ch] = {
        volume: presetCh.volume,
        isPlaying: presetCh.isPlaying,
      };

      if (presetCh.isPlaying) {
        await audioEngine.startChannel(ch, presetCh.volume);
      }
    }

    set({ channels: newChannels });
  },

  startSleepTimer: (minutes: number) => {
    const totalSec = Math.round(minutes * 60);
    set({ sleepTimerMinutes: minutes, sleepTimerRemainingSeconds: totalSec });

    audioEngine.startSleepTimer(
      minutes,
      (remaining) => set({ sleepTimerRemainingSeconds: remaining }),
      () => {
        get().stopAll();
        set({ sleepTimerMinutes: null, sleepTimerRemainingSeconds: null });
      }
    );
  },

  cancelSleepTimer: () => {
    audioEngine.clearSleepTimer();
    set({ sleepTimerMinutes: null, sleepTimerRemainingSeconds: null });
  },
}));
