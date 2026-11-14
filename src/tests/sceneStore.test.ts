import { describe, it, expect, beforeEach } from 'vitest';
import { useSceneStore, SCENES_INFO } from '../stores/useSceneStore';

describe('useSceneStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSceneStore.getState().resetSettings();
    useSceneStore.getState().setScene('rainy-night');
  });

  it('initializes with default visual & graphics settings', () => {
    const { settings, currentSceneId } = useSceneStore.getState();
    expect(currentSceneId).toBe('rainy-night');
    expect(settings.colorGrade).toBe('standard');
    expect(settings.filmGrain).toBe(false);
    expect(settings.parallax3D).toBe(true);
    expect(settings.ambientCursor).toBe(true);
    expect(settings.uiSounds).toBe(true);
  });

  it('cycles scenes forward with nextScene()', () => {
    const initialScene = useSceneStore.getState().currentSceneId;
    const initialIdx = SCENES_INFO.findIndex((s) => s.id === initialScene);

    useSceneStore.getState().nextScene();

    const expectedNext = SCENES_INFO[(initialIdx + 1) % SCENES_INFO.length].id;
    expect(useSceneStore.getState().currentSceneId).toBe(expectedNext);
  });

  it('cycles scenes backward with previousScene()', () => {
    const initialScene = useSceneStore.getState().currentSceneId;
    const initialIdx = SCENES_INFO.findIndex((s) => s.id === initialScene);

    useSceneStore.getState().previousScene();

    const expectedPrev =
      SCENES_INFO[(initialIdx - 1 + SCENES_INFO.length) % SCENES_INFO.length].id;
    expect(useSceneStore.getState().currentSceneId).toBe(expectedPrev);
  });

  it('updates color grading presets and visual settings correctly', () => {
    useSceneStore.getState().updateSettings({
      colorGrade: 'cyber-neon',
      filmGrain: true,
      parallax3D: false,
    });

    const updated = useSceneStore.getState().settings;
    expect(updated.colorGrade).toBe('cyber-neon');
    expect(updated.filmGrain).toBe(true);
    expect(updated.parallax3D).toBe(false);
  });
});
