export type ChannelId =
  | 'rain'
  | 'thunder'
  | 'wind'
  | 'birds'
  | 'forest'
  | 'stream'
  | 'ocean-waves'
  | 'fire'
  | 'insects'
  | 'city'
  | 'cosmic'
  | 'binaural'
  | 'keyboard'
  | 'cafe';

export interface ChannelConfig {
  id: ChannelId;
  nameKey: string;
  category: 'weather' | 'nature' | 'urban' | 'ethereal';
  icon: string;
  defaultVolume: number;
  descriptionKey: string;
}

export interface ChannelRuntimeState {
  volume: number; // 0.0 to 1.0
  isPlaying: boolean;
}

export interface AudioMixerState {
  masterVolume: number; // 0.0 to 1.0
  isMuted: boolean;
  channels: Record<ChannelId, ChannelRuntimeState>;
  isAudioInitialized: boolean;
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSeconds: number | null;
}
