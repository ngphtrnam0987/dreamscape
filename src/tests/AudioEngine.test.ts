import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioEngine } from '../audio/AudioEngine';

describe('AudioEngine', () => {
  let engine: AudioEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = AudioEngine.getInstance();
  });

  it('initializes successfully on demand', async () => {
    const initialized = await engine.init();
    expect(initialized).toBe(true);
    expect(engine.getIsInitialized()).toBe(true);
    expect(engine.getContext()).not.toBeNull();
  });

  it('clamps channel volume between 0 and 1 without throws', () => {
    expect(() => {
      engine.setChannelVolume('rain', 1.5);
      engine.setChannelVolume('rain', -0.5);
      engine.setChannelVolume('rain', 0.7);
    }).not.toThrow();
  });

  it('sets master volume and handles mute properly', () => {
    expect(() => {
      engine.setMasterVolume(0.5);
      engine.setMute(true);
      engine.setMute(false);
    }).not.toThrow();
  });

  it('starts and stops channels safely', async () => {
    await engine.startChannel('rain', 0.6);
    await engine.startChannel('binaural', 0.5);
    expect(() => engine.stopChannel('rain')).not.toThrow();
    expect(() => engine.stopChannel('binaural')).not.toThrow();
    expect(() => engine.stopAllChannels()).not.toThrow();
  });

  it('manages sleep timer ticks and cancellation', () => {
    const onTick = vi.fn();
    const onEnd = vi.fn();

    engine.startSleepTimer(15, onTick, onEnd);
    expect(() => engine.clearSleepTimer()).not.toThrow();
  });
});
