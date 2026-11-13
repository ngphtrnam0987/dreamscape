# DreamScape — Your Personal Escape

> **Calm. Cinematic. Minimal. Immersive. Beautiful.**

DreamScape is a production-grade, immersive ambient sanctuary designed to help people relax, study, focus, read, and sleep. Featuring real-time procedural Web Audio synthesis, interactive animated atmospheric environments, a Pomodoro focus timer with drift-free tracking, custom preset management, and bilingual localization (English & Tiếng Việt).

---

## 🌟 Key Features

### 1. Eight Dynamic Interactive Atmospheric Scenery
Each scene is dynamically rendered with real-time canvas physics, atmospheric depth, and customizable parameters:
- **🌧️ Rainy Night**: A cozy room overlooking a rain-swept nocturnal metropolis with window streaks, raindrop physics, warm ambient lamp glow, and occasional lightning flashes.
- **🌲 Forest Retreat**: Early morning canopy with volumetric fog mist, gentle swaying emerald leaves, moving sunlight god rays, and floating light motes.
- **🌅 Ocean Sunset**: Peaceful golden hour beach with multi-harmonic ocean wave simulations, sunset sky gradient, clouds, and specular solar glints.
- **🔥 Cozy Fireplace**: Warm mountain cabin hearth with procedural flame dancing, glowing wood coals, floating embers, and optional window rain.
- **✨ Cosmic Dream**: Dreamlike deep space with 3D parallax starfield, celestial nebulae luminance, camera drift, and shooting stars.
- **🌸 Cherry Blossom Shrine (New!)**: Kyoto Zen garden with pagodas, stone lantern candle flickers, and gentle drifting pink sakura blossom petals.
- **☕ Cozy Rainy Cafe (New!)**: Warm lofi coffee shop interior with steaming coffee mug, hanging Edison bulb, blurred streetlights, and rain on the window.
- **🏔️ Snowy Aurora (New!)**: Majestic snow-capped arctic mountain peaks, shimmering emerald and violet northern lights (Aurora Borealis), and drifting snow.

### 2. Official Lofi Girl Radio & YouTube Player (New!)
- **Embedded 24/7 Lofi Girl Streams**: Official streams from YouTube embedded seamlessly:
  - 🎧 *Lofi Girl — Beats to Relax/Study to* (24/7 live stream)
  - 💤 *Lofi Girl — Beats to Sleep/Chill to* (24/7 sleep stream)
  - ☕ *Peaceful Coffee Shop Lofi Piano*
  - 🌆 *Synthwave Chill Radio — Retro Sunset Drive*
- **Custom YouTube Stream Link**: Paste any YouTube live stream, music link, or video ID to play directly inside DreamScape!
- **Independent Lofi Volume Mixing**: Blends harmoniously with rain, fireplace, stream, and nature soundscapes without overpowering.
- **Animated Vinyl & Audio Visualizer**: Real-time rotating vinyl record and dock audio visualizer equalizers.

### 3. Centralized Web Audio API Multi-Channel Mixer
- **12 Audio Channels**: Rain, Thunder, Wind, Songbirds, Forest Canopy, Babbling Stream, Ocean Waves, Fireplace Hearth, Night Insects, City Ambience, Cosmic Drone, and **Binaural Beats (Alpha 10Hz)** for cognitive flow state.
- **Procedural Sound Generation**: 100% self-contained Web Audio synthesis (pink/brown noise filters, LFO swept bandpass, FM birdsong synthesis, fire crackle bursts, and celestial drones). Zero broken external links, zero CORS issues, instant playback, zero megabytes of asset downloads.
- **Individual Volume & Mute Controls**: Smooth linear and exponential gain ramping to eliminate clicks or pops.
- **Master Controls**: Master volume slider, global mute (M), "Stop All", and "Reset Mixer".
- **Integrated Sleep Timer**: Configurable timers (15m, 30m, 45m, 60m, or custom) with smooth 15-second master volume fade-out.

### 3. Pomodoro Focus Timer & Confetti Celebration
- **High-Precision Timestamp Synchronization**: Drift-free calculation (`targetEndTime - Date.now()`) that remains perfectly accurate across background tabs, tab switches, and system sleep.
- **Modes**: Focus (25 min), Short Break (5 min), Long Break (15 min) with custom duration configuration.
- **Circular Animated Progress Ring**: Real-time SVG stroke calculation.
- **Confetti Celebration**: Vibrant celebratory confetti shower upon completing a focus milestone!
- **Harmonic Singing Bowl Chime**: Pleasant crystal bell notification sound upon completion.
- **Browser Notifications**: Optional native notification prompts.
- **Document Title Countdown**: Live status in browser tab `(24:59) Focus — DreamScape`.

### 4. Mindful Breathing Guide (New!)
- **Rhythmic Visual Breathing Orb**: Smooth harmonic scaling circle with glowing aura.
- **Techniques**: Box Breathing (4-4-4-4), Relaxing Breath (4-7-8), and Deep Calm (5-5).
- Real-time phase cues ("Inhale", "Hold", "Exhale", "Rest") with acoustic phase chime and cycle tracking.

### 5. Focus Quick Notes / Scratchpad (New!)
- Frosted glass scratchpad for capturing fleeting thoughts, tasks, or insights without leaving your flow.
- Real-time word and character counts.
- Persistent local storage auto-save and one-click copy to clipboard.

### 6. Distraction-Free Focus Mode
- Clean minimal interface that auto-dims after 4 seconds of idle mouse activity.
- Floating minimal timer pill with quick play/pause.
- Fullscreen support (`F` or Fullscreen button).
- Instant exit with `Esc`.

### 7. Sound Presets, URL Sharing & JSON Backup
- **Curated Default Presets**: *Deep Focus*, *Cozy Night*, *Forest Morning*, *Ocean Calm*, *Sleep Mode*.
- **Custom User Presets**: Save custom mixes, rename, and delete with confirmation dialogs.
- **Shareable Preset URLs**: Encodes sound volume configurations and scene settings into base64 URL parameters for one-click sharing.
- **JSON Export & Import**: Download your customized presets as a `.json` backup and import them on any machine.

### 8. Local Session Statistics
- Tracks total focus minutes, completed sessions, and today's milestones.
- 7-day activity bar chart with daily peak indicators.
- 100% local and private—no accounts, no tracking cookies, no server dependencies.

### 9. Bilingual UI & PWA Ready
- Full bilingual English and Vietnamese (Tiếng Việt) localization switchable with one click.
- Web App Manifest (`manifest.webmanifest`) configured for standalone PWA home screen installation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Bundler & Tooling** | Vite 8, PostCSS, Autoprefixer |
| **Styling** | Tailwind CSS 3.4 with custom glassmorphism design tokens |
| **Audio Engine** | Web Audio API (procedural synthesis, GainNodes, BiquadFilters) |
| **State Management** | Zustand 5 with localStorage persistence |
| **Icons** | Lucide React |
| **Testing** | Vitest, JSDOM, Testing Library |
| **Deployment Target** | Cloudflare Pages / Static Hosting |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node.js v26 LTS)
- npm or pnpm or yarn

### Installation
```bash
# Clone or navigate to the dreamscape directory
cd dreamscape

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Run Automated Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
```
The static production assets will be built into the `dist/` folder.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>Space</kbd> | Start / Pause Pomodoro Timer |
| <kbd>M</kbd> | Toggle Master Audio Mute |
| <kbd>F</kbd> | Toggle Distraction-Free Focus Mode |
| <kbd>Esc</kbd> | Close Active Modal / Exit Focus Mode |

---

## 📄 License
MIT License. Created with love for mindfulness and deep concentration.
