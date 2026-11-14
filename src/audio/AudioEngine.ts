/**
 * DreamScape AudioEngine
 * Centralized Web Audio API multi-channel engine with procedural sound generators,
 * click-free gain ramping, master controls, and sleep timer automation.
 */

import { ChannelId } from '../types/audio';
import {
  createNoiseBuffer,
  BirdSongSynthesizer,
  ThunderSynthesizer,
  FireCrackleSynthesizer,
  MechanicalKeyboardSynthesizer,
  CafeMurmurSynthesizer,
  playChimeSound,
} from './proceduralAudio';

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;
  private currentMasterVolume = 0.8;

  // Sound generator buffers
  private whiteBuffer: AudioBuffer | null = null;
  private pinkBuffer: AudioBuffer | null = null;
  private brownBuffer: AudioBuffer | null = null;

  // Active channel nodes
  private channelGains: Map<ChannelId, GainNode> = new Map();
  private channelSources: Map<ChannelId, { stop: () => void; isRunning: boolean }> = new Map();

  // Procedural sub-synthesizers
  private birdSynth: BirdSongSynthesizer | null = null;
  private thunderSynth: ThunderSynthesizer | null = null;
  private fireCrackleSynth: FireCrackleSynthesizer | null = null;
  private keyboardSynth: MechanicalKeyboardSynthesizer | null = null;
  private cafeSynth: CafeMurmurSynthesizer | null = null;

  // Sleep timer tracking
  private sleepTimerId: ReturnType<typeof setInterval> | null = null;
  private sleepEndTime: number | null = null;
  private onSleepTimerTick?: (remainingSeconds: number) => void;
  private onSleepTimerEnd?: () => void;

  private isInitialized = false;

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Initializes AudioContext upon user gesture.
   */
  public async init(): Promise<boolean> {
    if (this.isInitialized && this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentMasterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Pre-synthesize loopable noise buffers
      this.whiteBuffer = createNoiseBuffer(this.ctx, 'white', 5);
      this.pinkBuffer = createNoiseBuffer(this.ctx, 'pink', 5);
      this.brownBuffer = createNoiseBuffer(this.ctx, 'brown', 5);

      this.isInitialized = true;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    } catch (err) {
      console.warn('AudioEngine initialization error:', err);
      return false;
    }
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Gets or creates GainNode for a channel
   */
  private getChannelGain(channelId: ChannelId): GainNode | null {
    if (!this.ctx || !this.masterGain) return null;

    let gainNode = this.channelGains.get(channelId);
    if (!gainNode) {
      gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.connect(this.masterGain);
      this.channelGains.set(channelId, gainNode);
    }
    return gainNode;
  }

  /**
   * Sets channel volume with smooth exponential/linear ramp
   */
  public setChannelVolume(channelId: ChannelId, volume: number, fadeTime = 0.05) {
    const gainNode = this.getChannelGain(channelId);
    if (!gainNode || !this.ctx) return;

    const now = this.ctx.currentTime;
    const clampedVol = Math.max(0, Math.min(1, volume));

    // Ramp gain smoothly without clicking
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(clampedVol, now + fadeTime);
  }

  /**
   * Sets master volume
   */
  public setMasterVolume(volume: number) {
    this.currentMasterVolume = Math.max(0, Math.min(1, volume));
    if (!this.masterGain || !this.ctx) return;

    if (!this.isMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentMasterVolume, now + 0.08);
    }
  }

  /**
   * Toggles mute
   */
  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (!this.masterGain || !this.ctx) return;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.currentMasterVolume, now + 0.1);
  }

  /**
   * Starts a specific sound channel
   */
  public async startChannel(channelId: ChannelId, targetVolume: number): Promise<void> {
    await this.init();
    if (!this.ctx || !this.masterGain) return;

    // If already playing, just adjust volume
    const current = this.channelSources.get(channelId);
    if (current?.isRunning) {
      this.setChannelVolume(channelId, targetVolume, 0.2);
      return;
    }

    const channelGain = this.getChannelGain(channelId)!;
    const stopCallbacks: Array<() => void> = [];

    // Construct audio pipeline based on channel identity
    switch (channelId) {
      case 'rain': {
        // Pink noise with bandpass filtering and rain tone
        const src = this.ctx.createBufferSource();
        src.buffer = this.pinkBuffer;
        src.loop = true;

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 1400;

        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 250;

        src.connect(hp);
        hp.connect(lp);
        lp.connect(channelGain);
        src.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            src.disconnect();
          } catch {}
        });
        break;
      }

      case 'thunder': {
        if (!this.thunderSynth && this.brownBuffer) {
          this.thunderSynth = new ThunderSynthesizer(this.ctx, channelGain, this.brownBuffer);
        }
        this.thunderSynth?.start();
        stopCallbacks.push(() => this.thunderSynth?.stop());
        break;
      }

      case 'wind': {
        // Modulated bandpass wind sweep
        const src = this.ctx.createBufferSource();
        src.buffer = this.pinkBuffer;
        src.loop = true;

        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 450;
        bp.Q.value = 2.0;

        // LFO for howling wind modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.18; // Slow breeze cycle
        lfoGain.gain.value = 220;

        lfo.connect(lfoGain);
        lfoGain.connect(bp.frequency);
        lfo.start();

        src.connect(bp);
        bp.connect(channelGain);
        src.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            lfo.stop();
            src.disconnect();
            bp.disconnect();
          } catch {}
        });
        break;
      }

      case 'birds': {
        if (!this.birdSynth) {
          this.birdSynth = new BirdSongSynthesizer(this.ctx, channelGain);
        }
        this.birdSynth.start();
        stopCallbacks.push(() => this.birdSynth?.stop());
        break;
      }

      case 'forest': {
        // Whispering canopy foliage (dual filtered noise)
        const src = this.ctx.createBufferSource();
        src.buffer = this.whiteBuffer;
        src.loop = true;

        const filter1 = this.ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.value = 750;
        filter1.Q.value = 1.2;

        const filter2 = this.ctx.createBiquadFilter();
        filter2.type = 'lowpass';
        filter2.frequency.value = 2400;

        src.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(channelGain);
        src.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            src.disconnect();
          } catch {}
        });
        break;
      }

      case 'stream': {
        // Babbling stream: pink noise with multiple resonant peaks and highpass
        const src = this.ctx.createBufferSource();
        src.buffer = this.pinkBuffer;
        src.loop = true;

        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 350;

        const peak = this.ctx.createBiquadFilter();
        peak.type = 'peaking';
        peak.frequency.value = 1200;
        peak.Q.value = 2.5;
        peak.gain.value = 4;

        src.connect(hp);
        hp.connect(peak);
        peak.connect(channelGain);
        src.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            src.disconnect();
          } catch {}
        });
        break;
      }

      case 'ocean-waves': {
        // Ocean surf: brown noise modulated by slow tidal envelope
        const src = this.ctx.createBufferSource();
        src.buffer = this.brownBuffer;
        src.loop = true;

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 500;

        // Tidal gain envelope modulated by sine LFO
        const waveGain = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoDepth = this.ctx.createGain();

        lfo.type = 'sine';
        lfo.frequency.value = 0.08; // ~12.5s wave cycle
        lfoDepth.gain.value = 0.45;
        waveGain.gain.value = 0.55;

        lfo.connect(lfoDepth);
        lfoDepth.connect(waveGain.gain);
        lfo.start();

        src.connect(lp);
        lp.connect(waveGain);
        waveGain.connect(channelGain);
        src.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            lfo.stop();
            src.disconnect();
          } catch {}
        });
        break;
      }

      case 'fire': {
        // Low warm fireplace rumble + dynamic crackle pops
        const src = this.ctx.createBufferSource();
        src.buffer = this.brownBuffer;
        src.loop = true;

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 160;

        src.connect(lp);
        lp.connect(channelGain);
        src.start();

        if (!this.fireCrackleSynth) {
          this.fireCrackleSynth = new FireCrackleSynthesizer(this.ctx, channelGain);
        }
        this.fireCrackleSynth.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            src.disconnect();
            this.fireCrackleSynth?.stop();
          } catch {}
        });
        break;
      }

      case 'insects': {
        // Nocturnal crickets using resonant oscillators with 15Hz tremolo
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const tremolo = this.ctx.createGain();
        const tremoloLfo = this.ctx.createOscillator();
        const tremoloDepth = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.value = 4650;
        osc2.type = 'sine';
        osc2.frequency.value = 4920;

        tremoloLfo.type = 'square';
        tremoloLfo.frequency.value = 15; // 15Hz cricket pulse
        tremoloDepth.gain.value = 0.4;
        tremolo.gain.value = 0.5;

        tremoloLfo.connect(tremoloDepth);
        tremoloDepth.connect(tremolo.gain);

        osc1.connect(tremolo);
        osc2.connect(tremolo);
        tremolo.connect(channelGain);

        osc1.start();
        osc2.start();
        tremoloLfo.start();

        stopCallbacks.push(() => {
          try {
            osc1.stop();
            osc2.stop();
            tremoloLfo.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch {}
        });
        break;
      }

      case 'city': {
        // Deep urban rumble: lowpass brown noise + mild high shelf cut
        const src = this.ctx.createBufferSource();
        src.buffer = this.brownBuffer;
        src.loop = true;

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 140;

        src.connect(lp);
        lp.connect(channelGain);
        src.start();

        stopCallbacks.push(() => {
          try {
            src.stop();
            src.disconnect();
          } catch {}
        });
        break;
      }

      case 'cosmic': {
        // Cosmic ethereal pads: multi-oscillator chord (A1, E2, A2) + slow filter sweep
        const oscSub = this.ctx.createOscillator();
        const oscFifth = this.ctx.createOscillator();
        const oscHarmonic = this.ctx.createOscillator();

        oscSub.type = 'triangle';
        oscSub.frequency.value = 55; // A1
        oscFifth.type = 'sine';
        oscFifth.frequency.value = 82.4; // E2
        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.value = 110; // A2

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        filter.Q.value = 3.5;

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; // 20s celestial sweep
        lfoGain.gain.value = 180;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        oscSub.connect(filter);
        oscFifth.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(channelGain);

        oscSub.start();
        oscFifth.start();
        oscHarmonic.start();

        stopCallbacks.push(() => {
          try {
            oscSub.stop();
            oscFifth.stop();
            oscHarmonic.stop();
            lfo.stop();
            filter.disconnect();
          } catch {}
        });
        break;
      }

      case 'binaural': {
        // Alpha brainwave entrainment (Left 200Hz, Right 210Hz => 10Hz Alpha differential)
        const oscL = this.ctx.createOscillator();
        const oscR = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.value = 200;
        oscR.type = 'sine';
        oscR.frequency.value = 210;

        const merger = this.ctx.createChannelMerger(2);
        oscL.connect(merger, 0, 0); // Left channel
        oscR.connect(merger, 0, 1); // Right channel

        merger.connect(channelGain);
        oscL.start();
        oscR.start();

        stopCallbacks.push(() => {
          try {
            oscL.stop();
            oscR.stop();
            oscL.disconnect();
            oscR.disconnect();
            merger.disconnect();
          } catch {}
        });
        break;
      }

      case 'keyboard': {
        // Procedural mechanical typing clicks and bottoming out thocks
        if (!this.keyboardSynth) {
          this.keyboardSynth = new MechanicalKeyboardSynthesizer(this.ctx, channelGain);
        }
        this.keyboardSynth.start();

        stopCallbacks.push(() => {
          try {
            this.keyboardSynth?.stop();
          } catch {}
        });
        break;
      }

      case 'cafe': {
        // Procedural warm cafe background murmur + occasional ceramic cup clink
        if (!this.cafeSynth) {
          this.cafeSynth = new CafeMurmurSynthesizer(this.ctx, channelGain);
        }
        if (this.pinkBuffer) {
          this.cafeSynth.start(this.pinkBuffer);
        }

        stopCallbacks.push(() => {
          try {
            this.cafeSynth?.stop();
          } catch {}
        });
        break;
      }
    }

    this.channelSources.set(channelId, {
      isRunning: true,
      stop: () => stopCallbacks.forEach(cb => cb()),
    });

    // Smooth fade in
    this.setChannelVolume(channelId, targetVolume, 0.25);
  }

  /**
   * Stops a specific sound channel with smooth fade out
   */
  public stopChannel(channelId: ChannelId, fadeTime = 0.2) {
    const active = this.channelSources.get(channelId);
    if (!active || !active.isRunning) return;

    const gainNode = this.channelGains.get(channelId);
    if (gainNode && this.ctx) {
      const now = this.ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
    }

    setTimeout(() => {
      active.stop();
      this.channelSources.delete(channelId);
    }, fadeTime * 1000 + 30);
  }

  /**
   * Stops all sound channels
   */
  public stopAllChannels(fadeTime = 0.2) {
    this.channelSources.forEach((_, channelId) => {
      this.stopChannel(channelId, fadeTime);
    });
  }

  /**
   * Plays Pomodoro completion chime
   */
  public playChime(volume = 0.5) {
    if (!this.ctx) return;
    playChimeSound(this.ctx, volume);
  }

  /**
   * Plays soft tactile haptic micro-audio click for buttons, toggles, and interactions
   */
  public playUiClick(type: 'tap' | 'toggle' | 'pop' = 'tap') {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.012);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.012);
      } else if (type === 'toggle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(880, now + 0.012);

        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.02);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
      }
    } catch {}
  }

  /**
   * Starts a sleep timer (duration in minutes)
   */
  public startSleepTimer(
    minutes: number,
    onTick?: (remainingSeconds: number) => void,
    onEnd?: () => void
  ) {
    this.clearSleepTimer();
    this.onSleepTimerTick = onTick;
    this.onSleepTimerEnd = onEnd;

    const totalSeconds = Math.round(minutes * 60);
    this.sleepEndTime = Date.now() + totalSeconds * 1000;

    this.sleepTimerId = setInterval(() => {
      if (!this.sleepEndTime) return;
      const remainingMs = this.sleepEndTime - Date.now();
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      if (this.onSleepTimerTick) {
        this.onSleepTimerTick(remainingSeconds);
      }

      // Over the final 15 seconds, initiate smooth master volume fade-out
      if (remainingSeconds <= 15 && this.masterGain && this.ctx && !this.isMuted) {
        const factor = remainingSeconds / 15;
        this.masterGain.gain.setValueAtTime(this.currentMasterVolume * factor, this.ctx.currentTime);
      }

      if (remainingSeconds <= 0) {
        this.clearSleepTimer();
        this.stopAllChannels(0.5);
        if (this.onSleepTimerEnd) {
          this.onSleepTimerEnd();
        }
      }
    }, 1000);
  }

  public clearSleepTimer() {
    if (this.sleepTimerId) {
      clearInterval(this.sleepTimerId);
      this.sleepTimerId = null;
    }
    this.sleepEndTime = null;
  }
}

export const audioEngine = AudioEngine.getInstance();
