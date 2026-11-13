import { describe, it, expect, beforeEach } from 'vitest';
import { usePresetStore } from '../stores/usePresetStore';
import { SoundPreset } from '../types/preset';

describe('usePresetStore', () => {
  beforeEach(() => {
    usePresetStore.getState().clearAllUserPresets();
  });

  it('contains 5 default curated presets', () => {
    const defaults = usePresetStore.getState().defaultPresets;
    expect(defaults.length).toBe(5);
    const ids = defaults.map(d => d.id);
    expect(ids).toContain('deep-focus');
    expect(ids).toContain('cozy-night');
    expect(ids).toContain('forest-morning');
    expect(ids).toContain('ocean-calm');
    expect(ids).toContain('sleep-mode');
  });

  it('saves, renames, and deletes a custom preset', () => {
    const store = usePresetStore.getState();
    const created = store.savePreset('Night Rain Chill');

    expect(created.name).toBe('Night Rain Chill');
    expect(usePresetStore.getState().userPresets.length).toBe(1);

    store.renamePreset(created.id, 'Midnight Rain Vibe');
    expect(usePresetStore.getState().userPresets[0].name).toBe('Midnight Rain Vibe');

    store.deletePreset(created.id);
    expect(usePresetStore.getState().userPresets.length).toBe(0);
  });

  it('serializes and deserializes shareable URL presets safely', () => {
    const store = usePresetStore.getState();
    const preset: SoundPreset = {
      id: 'test-preset',
      name: 'Ethereal Meditation',
      sceneId: 'cosmic-dream',
      createdAt: 12345678,
      channelStates: {
        rain: { volume: 0.5, isPlaying: false },
        thunder: { volume: 0, isPlaying: false },
        wind: { volume: 0, isPlaying: false },
        birds: { volume: 0, isPlaying: false },
        forest: { volume: 0, isPlaying: false },
        stream: { volume: 0, isPlaying: false },
        'ocean-waves': { volume: 0, isPlaying: false },
        fire: { volume: 0, isPlaying: false },
        insects: { volume: 0, isPlaying: false },
        city: { volume: 0, isPlaying: false },
        cosmic: { volume: 0.7, isPlaying: true },
      },
      sceneSpecificSettings: {
        starDensity: 1.2,
      },
    };

    const url = store.exportPresetUrl(preset);
    expect(url).toContain('?preset=');

    const parsedUrl = new URL(url);
    const encoded = parsedUrl.searchParams.get('preset')!;
    const imported = store.importPresetFromUrl(encoded);

    expect(imported).not.toBeNull();
    expect(imported?.name).toBe('Ethereal Meditation');
    expect(imported?.sceneId).toBe('cosmic-dream');
    expect(imported?.channelStates.cosmic.isPlaying).toBe(true);
    expect(imported?.channelStates.cosmic.volume).toBe(0.7);
  });

  it('handles invalid or corrupted URL preset gracefully', () => {
    const store = usePresetStore.getState();
    const result = store.importPresetFromUrl('INVALID_BASE64_DATA!!!');
    expect(result).toBeNull();
  });
});
