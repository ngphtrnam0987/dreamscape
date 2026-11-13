import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API
class AudioNodeMock {
  connect() { return this; }
  disconnect() {}
}

class GainNodeMock extends AudioNodeMock {
  gain = {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
    setTargetAtTime: vi.fn(),
  };
}

class AudioBufferSourceNodeMock extends AudioNodeMock {
  buffer = null;
  loop = false;
  start = vi.fn();
  stop = vi.fn();
}

class AudioContextMock {
  state = 'running';
  currentTime = 0;
  destination = new AudioNodeMock();
  createGain() { return new GainNodeMock(); }
  createBufferSource() { return new AudioBufferSourceNodeMock(); }
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(1024),
      length: 1024,
      duration: 1,
      sampleRate: 44100,
      numberOfChannels: 2,
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 1000, setValueAtTime: vi.fn() },
      Q: { value: 1, setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440, setValueAtTime: vi.fn() },
      start: vi.fn(),
      stop: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  createChannelMerger() {
    return new AudioNodeMock();
  }
  resume = vi.fn().mockResolvedValue(undefined);
  suspend = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
}

// @ts-expect-error mock window AudioContext
window.AudioContext = AudioContextMock;
// @ts-expect-error mock webkitAudioContext
window.webkitAudioContext = AudioContextMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
