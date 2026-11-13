import { describe, it, expect, beforeEach } from 'vitest';
import { useTimerStore } from '../stores/useTimerStore';

describe('useTimerStore', () => {
  beforeEach(() => {
    useTimerStore.getState().resetTimer();
    useTimerStore.getState().setMode('focus');
  });

  it('starts with focus mode and 25 minutes default duration', () => {
    const state = useTimerStore.getState();
    expect(state.mode).toBe('focus');
    expect(state.totalDurationSeconds).toBe(25 * 60);
    expect(state.remainingSeconds).toBe(25 * 60);
    expect(state.isRunning).toBe(false);
  });

  it('transitions state on start, pause, and reset', () => {
    const store = useTimerStore.getState();

    store.startTimer();
    expect(useTimerStore.getState().isRunning).toBe(true);
    expect(useTimerStore.getState().targetEndTime).toBeGreaterThan(Date.now());

    store.pauseTimer();
    expect(useTimerStore.getState().isRunning).toBe(false);
    expect(useTimerStore.getState().targetEndTime).toBeNull();

    store.resetTimer();
    expect(useTimerStore.getState().remainingSeconds).toBe(25 * 60);
  });

  it('switches modes correctly and updates duration', () => {
    const store = useTimerStore.getState();

    store.setMode('short-break');
    expect(useTimerStore.getState().mode).toBe('short-break');
    expect(useTimerStore.getState().remainingSeconds).toBe(5 * 60);

    store.setMode('long-break');
    expect(useTimerStore.getState().mode).toBe('long-break');
    expect(useTimerStore.getState().remainingSeconds).toBe(15 * 60);
  });

  it('updates custom duration settings', () => {
    const store = useTimerStore.getState();
    store.updateSettings({ focusMinutes: 30 });
    expect(useTimerStore.getState().settings.focusMinutes).toBe(30);
    expect(useTimerStore.getState().totalDurationSeconds).toBe(30 * 60);
  });

  it('skips session and updates completed sessions count', () => {
    const store = useTimerStore.getState();
    const initialCompleted = store.completedSessions;

    store.skipSession();
    const after = useTimerStore.getState();
    expect(after.completedSessions).toBe(initialCompleted + 1);
    expect(after.mode).toBe('short-break');
  });
});
