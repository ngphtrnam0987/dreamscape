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

// Mock canvas-confetti
vi.mock('canvas-confetti', () => {
  const confetti = vi.fn();
  // @ts-expect-error mock properties
  confetti.reset = vi.fn();
  // @ts-expect-error mock properties
  confetti.create = vi.fn(() => vi.fn());
  return { default: confetti };
});

// Mock HTMLCanvasElement getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
  if (contextId === '2d') {
    return {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 0 }),
    };
  }
  return null;
}) as any;

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
