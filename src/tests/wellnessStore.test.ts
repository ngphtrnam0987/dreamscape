import { describe, it, expect, beforeEach } from 'vitest';
import { useWellnessStore } from '../stores/useWellnessStore';

describe('useWellnessStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles hydration and eye rest reminders', () => {
    const store = useWellnessStore.getState();
    expect(store.hydrationEnabled).toBe(true);

    store.toggleHydration();
    expect(useWellnessStore.getState().hydrationEnabled).toBe(false);

    store.toggleEyeRest();
    expect(useWellnessStore.getState().eyeRestEnabled).toBe(false);
  });

  it('triggers and dismisses active alerts', () => {
    const store = useWellnessStore.getState();
    expect(store.activeAlert).toBeNull();

    store.triggerAlert('hydration');
    expect(useWellnessStore.getState().activeAlert).toBe('hydration');

    store.dismissAlert();
    expect(useWellnessStore.getState().activeAlert).toBeNull();
  });
});
