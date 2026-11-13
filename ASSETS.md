# Asset Manifest & Licensing Documentation

DreamScape has been engineered with a privacy-first, zero-external-dependency philosophy. Every visual and acoustic asset is 100% self-contained, royalty-free, and legally compliant.

---

## 1. Audio Assets Specification

All 11 audio channels and notification alerts are synthesized procedurally in real-time using the **Web Audio API**:

| Channel | Synthesis Method | DSP Components | License |
|---|---|---|---|
| **Rain** | Algorithmic Pink Noise | LowPass (1400Hz) + HighPass (250Hz) + impulse clicks | Procedural (MIT) |
| **Thunder** | Dynamic Trigger Synthesis | Brownian Noise Buffer + LowPass envelope (80-220Hz) | Procedural (MIT) |
| **Wind** | Bandpass Swept Noise | Pink Noise + LFO (0.18Hz) sweeping 250Hz - 700Hz | Procedural (MIT) |
| **Birds** | FM Oscillator Pitch Modulation | Sine Carrier (2400-4200Hz) with algorithmic phrase timing | Procedural (MIT) |
| **Forest** | Dual Bandpass Noise | White Noise + dual resonant filters (750Hz, 2400Hz) | Procedural (MIT) |
| **Stream** | Multi-Resonant Fluid Synthesis | Pink Noise + Highpass (350Hz) + Peaking Filter (1200Hz) | Procedural (MIT) |
| **Ocean Waves** | Harmonic Tidal Wave Synthesis | Brown Noise + 0.08Hz Sine LFO Tidal Gain Modulation | Procedural (MIT) |
| **Fire** | Dual Layer Hearth Synthesis | Lowpass (160Hz) Brown Noise + Sawtooth Impulses (4-10Hz) | Procedural (MIT) |
| **Insects** | Dual Pulse Oscillator | Dual Sine (4650Hz & 4920Hz) + 15Hz Tremolo Modulator | Procedural (MIT) |
| **City** | Subsonic Urban Hum | Brownian Noise + Lowpass (140Hz) | Procedural (MIT) |
| **Cosmic** | Polyphonic Harmonic Chord Drone | Triangle/Sine Oscs (55Hz, 82.4Hz, 110Hz) + 0.05Hz LFO Filter | Procedural (MIT) |
| **Chime** | Crystalline Singing Bowl | 4 Harmonic Sines (D5, A5, E6, A6) with Exponential Decay | Procedural (MIT) |

Zero copyrighted third-party MP3 or WAV files are bundled, avoiding any licensing conflicts, DMCA ambiguity, or hotlink degradation.

---

## 2. Visual & Scenery Assets

- **Atmospheric Scenery**: Generated directly onto HTML5 Canvas surfaces via procedural particle physics, trigonometry, and hardware-accelerated 2D context operations.
- **Icons**: [Lucide Icons](https://lucide.dev/) (ISC License).
- **Typography**:
  - [Inter](https://fonts.google.com/specimen/Inter) — SIL Open Font License 1.1
  - [Outfit](https://fonts.google.com/specimen/Outfit) — SIL Open Font License 1.1
