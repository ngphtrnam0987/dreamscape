import React from 'react';
import { SceneContainer } from './scenes/SceneContainer';
import { Header } from './components/layout/Header';
import { BottomControls } from './components/layout/BottomControls';
import { FocusModeOverlay } from './components/timer/FocusModeOverlay';
import { SceneSelectorModal } from './components/navigation/SceneSelectorModal';
import { AudioMixerPanel } from './components/audio/AudioMixerPanel';
import { PomodoroTimerModal } from './components/timer/PomodoroTimerModal';
import { PresetsModal } from './components/presets/PresetsModal';
import { SceneSettingsModal } from './components/settings/SceneSettingsModal';
import { StatsModal } from './components/stats/StatsModal';
import { BreathingGuideModal } from './components/mindfulness/BreathingGuideModal';
import { QuickNotesModal } from './components/notes/QuickNotesModal';
import { Toast } from './components/ui/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTimerInterval } from './hooks/useTimerInterval';
import { useSharedPresetLoader } from './hooks/useSharedPresetLoader';

export const App: React.FC = () => {
  // Global hooks
  useKeyboardShortcuts();
  useTimerInterval();
  useSharedPresetLoader();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Dynamic Background Atmosphere Scenes */}
      <SceneContainer />

      {/* Primary Floating Application Chrome */}
      <Header />
      <BottomControls />
      <FocusModeOverlay />

      {/* Modals & Panels */}
      <SceneSelectorModal />
      <AudioMixerPanel />
      <PomodoroTimerModal />
      <PresetsModal />
      <SceneSettingsModal />
      <StatsModal />
      <BreathingGuideModal />
      <QuickNotesModal />

      {/* Global Toast Alerts */}
      <Toast />
    </main>
  );
};

export default App;
