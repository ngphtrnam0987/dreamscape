import { SoundPreset } from '../types/preset';
import { INITIAL_CHANNEL_STATES } from './channelDefinitions';

export const DEFAULT_PRESETS: SoundPreset[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    sceneId: 'rainy-night',
    isDefault: true,
    channelStates: {
      ...INITIAL_CHANNEL_STATES,
      rain: { volume: 0.70, isPlaying: true },
      wind: { volume: 0.35, isPlaying: true },
      thunder: { volume: 0.20, isPlaying: false },
    },
    sceneSpecificSettings: {
      rainIntensity: 1.0,
      lightningEnabled: false,
    },
    createdAt: 1700000000000,
  },
  {
    id: 'cozy-night',
    name: 'Cozy Night',
    sceneId: 'cozy-fireplace',
    isDefault: true,
    channelStates: {
      ...INITIAL_CHANNEL_STATES,
      fire: { volume: 0.75, isPlaying: true },
      rain: { volume: 0.40, isPlaying: true },
      wind: { volume: 0.25, isPlaying: true },
    },
    sceneSpecificSettings: {
      fireIntensity: 1.1,
      embersEnabled: true,
      windowRainEnabled: true,
    },
    createdAt: 1700000000001,
  },
  {
    id: 'forest-morning',
    name: 'Forest Morning',
    sceneId: 'forest-retreat',
    isDefault: true,
    channelStates: {
      ...INITIAL_CHANNEL_STATES,
      birds: { volume: 0.50, isPlaying: true },
      stream: { volume: 0.60, isPlaying: true },
      forest: { volume: 0.45, isPlaying: true },
      wind: { volume: 0.30, isPlaying: true },
    },
    sceneSpecificSettings: {
      fogIntensity: 0.8,
      lightRaysEnabled: true,
    },
    createdAt: 1700000000002,
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    sceneId: 'ocean-sunset',
    isDefault: true,
    channelStates: {
      ...INITIAL_CHANNEL_STATES,
      'ocean-waves': { volume: 0.75, isPlaying: true },
      wind: { volume: 0.35, isPlaying: true },
      birds: { volume: 0.25, isPlaying: false },
    },
    sceneSpecificSettings: {
      waveIntensity: 1.0,
      sunsetBrightness: 1.1,
    },
    createdAt: 1700000000003,
  },
  {
    id: 'sleep-mode',
    name: 'Sleep Mode',
    sceneId: 'cosmic-dream',
    isDefault: true,
    channelStates: {
      ...INITIAL_CHANNEL_STATES,
      cosmic: { volume: 0.45, isPlaying: true },
      rain: { volume: 0.25, isPlaying: true },
    },
    sceneSpecificSettings: {
      starDensity: 0.7,
      cameraDriftEnabled: true,
      nebulaGlow: 0.8,
    },
    createdAt: 1700000000004,
  },
];
