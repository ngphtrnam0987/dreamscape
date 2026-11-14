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
    expect(settings.graphicsQuality).toBe('balanced');
    expect(settings.fpsTarget).toBe(60);
    expect(settings.weather).toBe('scene-default');
    expect(settings.weatherIntensity).toBe(1.0);
    expect(settings.colorGrade).toBe('standard');
    expect(settings.filmGrain).toBe(false);
    expect(settings.parallax3D).toBe(true);
    expect(settings.ambientCursor).toBe(true);
    expect(settings.uiSounds).toBe(true);
  });

  it('switches between graphics quality tiers (Eco, Balanced, Ultra) and sets hardware parameters', () => {
    const store = useSceneStore.getState();

    // Switch to Eco Saver
    store.setGraphicsQuality('eco');
    let settings = useSceneStore.getState().settings;
    expect(settings.graphicsQuality).toBe('eco');
    expect(settings.fpsTarget).toBe(30);
    expect(settings.lowPerformanceMode).toBe(true);
    expect(settings.particleDensity).toBe(0.4);
    expect(settings.parallax3D).toBe(false);

    // Switch to Ultra Max Setting
    store.setGraphicsQuality('ultra');
    settings = useSceneStore.getState().settings;
    expect(settings.graphicsQuality).toBe('ultra');
    expect(settings.fpsTarget).toBe(120);
    expect(settings.lowPerformanceMode).toBe(false);
    expect(settings.particleDensity).toBe(1.6);
    expect(settings.parallax3D).toBe(true);
    expect(settings.filmGrain).toBe(true);
    expect(settings.bloomGlow).toBe(true);

    // Switch back to Balanced
    store.setGraphicsQuality('balanced');
    settings = useSceneStore.getState().settings;
    expect(settings.graphicsQuality).toBe('balanced');
    expect(settings.fpsTarget).toBe(60);
    expect(settings.particleDensity).toBe(1.0);
  });

  it('cycles graphics quality with cycleGraphicsQuality()', () => {
    const store = useSceneStore.getState();
    expect(store.settings.graphicsQuality).toBe('balanced');

    store.cycleGraphicsQuality(); // balanced -> ultra
    expect(useSceneStore.getState().settings.graphicsQuality).toBe('ultra');

    store.cycleGraphicsQuality(); // ultra -> eco
    expect(useSceneStore.getState().settings.graphicsQuality).toBe('eco');

    store.cycleGraphicsQuality(); // eco -> balanced
    expect(useSceneStore.getState().settings.graphicsQuality).toBe('balanced');
  });

  it('updates dynamic weather and cycles through weather atmospheres', () => {
    const store = useSceneStore.getState();
    expect(store.settings.weather).toBe('scene-default');

    store.setWeather('thunderstorm');
    expect(useSceneStore.getState().settings.weather).toBe('thunderstorm');

    store.setWeather('snow');
    expect(useSceneStore.getState().settings.weather).toBe('snow');

    store.setWeatherIntensity(1.5);
    expect(useSceneStore.getState().settings.weatherIntensity).toBe(1.5);

    store.cycleWeather();
    expect(useSceneStore.getState().settings.weather).not.toBe('snow');
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
