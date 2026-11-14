import React from 'react';
import { SceneContainer } from './scenes/SceneContainer';
import { Header } from './components/layout/Header';
import { BottomControls } from './components/layout/BottomControls';
import { AmbientClock } from './components/timer/AmbientClock';
import { FocusModeOverlay } from './components/timer/FocusModeOverlay';
import { SceneSelectorModal } from './components/navigation/SceneSelectorModal';
import { AudioMixerPanel } from './components/audio/AudioMixerPanel';
import { PomodoroTimerModal } from './components/timer/PomodoroTimerModal';
import { PresetsModal } from './components/presets/PresetsModal';
import { SceneSettingsModal } from './components/settings/SceneSettingsModal';
import { StatsModal } from './components/stats/StatsModal';
import { BreathingGuideModal } from './components/mindfulness/BreathingGuideModal';
import { QuickNotesModal } from './components/notes/QuickNotesModal';
import { LofiPlayerModal } from './components/lofi/LofiPlayerModal';
import { ShortcutsModal } from './components/ui/ShortcutsModal';
import { ZenModeOverlay } from './components/ui/ZenModeOverlay';
import { TaskModal } from './components/tasks/TaskModal';
import { WellnessNotificationOverlay } from './components/wellness/WellnessNotificationOverlay';
import { StudyWithMeVideo } from './components/study/StudyWithMeVideo';
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
      <AmbientClock />
      <BottomControls />
      <FocusModeOverlay />
      <ZenModeOverlay />
      <WellnessNotificationOverlay />

      {/* Modals & Panels */}
      <SceneSelectorModal />
      <AudioMixerPanel />
      <PomodoroTimerModal />
      <PresetsModal />
      <SceneSettingsModal />
      <StatsModal />
      <BreathingGuideModal />
      <QuickNotesModal />
      <LofiPlayerModal />
      <ShortcutsModal />
      <TaskModal />

      {/* Study With Me Video Feed & Lo-Fi Stream Audio */}
      <StudyWithMeVideo />

      {/* Global Toast Alerts */}
      <Toast />
    </main>
  );
};

export default App;
