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

  it('updates clockSize and toggles size correctly', () => {
    const store = useTimerStore.getState();
    store.setClockSize('small');
    expect(useTimerStore.getState().settings.clockSize).toBe('small');

    store.toggleClockSize(); // small -> medium
    expect(useTimerStore.getState().settings.clockSize).toBe('medium');

    store.toggleClockSize(); // medium -> large
    expect(useTimerStore.getState().settings.clockSize).toBe('large');

    store.toggleClockSize(); // large -> hidden
    expect(useTimerStore.getState().settings.clockSize).toBe('hidden');

    store.toggleClockSize(); // hidden -> small
    expect(useTimerStore.getState().settings.clockSize).toBe('small');
  });

  it('updates clockDisplayType between pomodoro and realtime', () => {
    const store = useTimerStore.getState();
    store.setClockDisplayType('realtime');
    expect(useTimerStore.getState().settings.clockDisplayType).toBe('realtime');

    store.setClockDisplayType('pomodoro');
    expect(useTimerStore.getState().settings.clockDisplayType).toBe('pomodoro');
  });

  it('updates clockStyle and cycles through visual styles', () => {
    const store = useTimerStore.getState();
    expect(store.settings.clockStyle).toBe('minimal');

    store.setClockStyle('flip');
    expect(useTimerStore.getState().settings.clockStyle).toBe('flip');

    store.setClockStyle('analog');
    expect(useTimerStore.getState().settings.clockStyle).toBe('analog');

    store.setClockStyle('radial');
    store.cycleClockStyle(); // radial -> matrix
    expect(useTimerStore.getState().settings.clockStyle).toBe('matrix');

    store.cycleClockStyle(); // matrix -> zen
    expect(useTimerStore.getState().settings.clockStyle).toBe('zen');

    store.cycleClockStyle(); // zen -> minimal
    expect(useTimerStore.getState().settings.clockStyle).toBe('minimal');
  });
});
