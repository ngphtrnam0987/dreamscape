/**
 * Procedural Audio Synthesizer for DreamScape
 * High-fidelity Web Audio synthesis for nature and ambient channels.
 */

// Generate 5-second seamless loopable noise buffers
export function createNoiseBuffer(ctx: AudioContext, type: 'white' | 'pink' | 'brown', durationSeconds = 5): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        data[i] = white * 0.3;
      } else if (type === 'pink') {
        // Paul Kellet's filtered pink noise algorithm
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        // Brown noise / Brownian motion
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 1.5;
      }
    }

    // Ensure seamless loop boundary by cross-fading head and tail
    const fadeSamples = Math.floor(sampleRate * 0.1);
    for (let i = 0; i < fadeSamples; i++) {
      const factor = i / fadeSamples;
      data[i] = data[i] * factor + data[bufferSize - fadeSamples + i] * (1 - factor);
    }
  }

  return buffer;
}

// Procedural Birdsong Generator
export class BirdSongSynthesizer {
  private ctx: AudioContext;
  private outputNode: GainNode;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private isRunning = false;

  constructor(ctx: AudioContext, output: GainNode) {
    this.ctx = ctx;
    this.outputNode = output;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextSong();
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextSong() {
    if (!this.isRunning) return;
    const delayMs = 1500 + Math.random() * 3500;
    this.timerId = setTimeout(() => {
      if (this.isRunning) {
        this.playPhrase();
        this.scheduleNextSong();
      }
    }, delayMs);
  }

  private playPhrase() {
    try {
      const now = this.ctx.currentTime;
      const notes = 2 + Math.floor(Math.random() * 4);
      let noteTime = now;

      for (let i = 0; i < notes; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const baseFreq = 2400 + Math.random() * 1800;
        const dur = 0.08 + Math.random() * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * (1.1 + Math.random() * 0.3), noteTime + dur * 0.5);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, noteTime + dur);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.2, noteTime + dur * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

        osc.connect(gain);
        gain.connect(this.outputNode);

        osc.start(noteTime);
        osc.stop(noteTime + dur);

        noteTime += dur + 0.05 + Math.random() * 0.08;
      }
    } catch {
      // AudioContext state edge case
    }
  }
}

// Procedural Thunder Generator
export class ThunderSynthesizer {
  private ctx: AudioContext;
  private outputNode: GainNode;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private isRunning = false;
  private brownBuffer: AudioBuffer;

  constructor(ctx: AudioContext, output: GainNode, brownBuffer: AudioBuffer) {
    this.ctx = ctx;
    this.outputNode = output;
    this.brownBuffer = brownBuffer;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextRumble(3000); // First rumble after 3s
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextRumble(customDelay?: number) {
    if (!this.isRunning) return;
    const delayMs = customDelay ?? (15000 + Math.random() * 20000); // Every 15-35 seconds
    this.timerId = setTimeout(() => {
      if (this.isRunning) {
        this.triggerStrike();
        this.scheduleNextRumble();
      }
    }, delayMs);
  }

  triggerStrike() {
    try {
      const now = this.ctx.currentTime;
      const duration = 4.0 + Math.random() * 3.0;

      // Source buffer
      const src = this.ctx.createBufferSource();
      src.buffer = this.brownBuffer;
      src.loop = false;

      // Deep rumble filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(80, now);
      filter.frequency.linearRampToValueAtTime(220, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(45, now + duration);

      // Volume envelope with initial crack/strike then long reverberant decay
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.15); // initial boom
      gain.gain.exponentialRampToValueAtTime(0.3, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputNode);

      src.start(now);
      src.stop(now + duration);
    } catch {
      // AudioContext state edge case
    }
  }
}

// Procedural Fire Crackle Generator
export class FireCrackleSynthesizer {
  private ctx: AudioContext;
  private outputNode: GainNode;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private isRunning = false;

  constructor(ctx: AudioContext, output: GainNode) {
    this.ctx = ctx;
    this.outputNode = output;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleCrackle();
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleCrackle() {
    if (!this.isRunning) return;
    const interval = 80 + Math.random() * 220; // 4-10 crackles per second
    this.timerId = setTimeout(() => {
      if (this.isRunning) {
        this.playPop();
        this.scheduleCrackle();
      }
    }, interval);
  }

  private playPop() {
    try {
      const now = this.ctx.currentTime;
      const isBigPop = Math.random() > 0.85;
      const duration = isBigPop ? 0.035 : 0.015;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'highpass';
      filter.frequency.value = 1800 + Math.random() * 1200;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isBigPop ? 220 : 540, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + duration);

      const amp = isBigPop ? 0.35 : 0.12;
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputNode);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext edge case
    }
  }
}

// Procedural Bell Chime for Pomodoro
export function playChimeSound(ctx: AudioContext, volume = 0.5) {
  try {
    const now = ctx.currentTime;
    // Harmonic frequencies for Tibetan singing bowl / crystalline chime
    const freqs = [587.33, 880.0, 1318.51, 1760.0]; // D5, A5, E6, A6

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const decayTime = 2.5 + idx * 0.4;
      const initialGain = (volume * 0.4) / (idx + 1);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(initialGain, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decayTime);
    });
  } catch {
    // AudioContext error handling
  }
}
