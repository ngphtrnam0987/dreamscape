import { describe, it, expect, beforeEach } from 'vitest';
import { useStatsStore } from '../stores/useStatsStore';

describe('useStatsStore', () => {
  beforeEach(() => {
    useStatsStore.getState().clearAllStats();
  });

  it('initializes with zero records', () => {
    const state = useStatsStore.getState();
    expect(state.totalMinutes).toBe(0);
    expect(state.totalSessions).toBe(0);
    expect(Object.keys(state.dailyStats).length).toBe(0);
  });

  it('records focus sessions and computes totals', () => {
    const store = useStatsStore.getState();

    store.recordFocusSession(25);
    store.recordFocusSession(25);

    const updated = useStatsStore.getState();
    expect(updated.totalMinutes).toBe(50);
    expect(updated.totalSessions).toBe(2);

    const todayStat = store.getTodayStats();
    expect(todayStat.sessions).toBe(2);
    expect(todayStat.minutes).toBe(50);
  });

  it('formats last 7 days history array properly', () => {
    const store = useStatsStore.getState();
    store.recordFocusSession(30);

    const history = store.getLast7DaysStats();
    expect(history.length).toBe(7);
    expect(history[6].dayLabel).toBe('Today');
    expect(history[6].minutes).toBe(30);
  });

  it('clears all statistics on command', () => {
    const store = useStatsStore.getState();
    store.recordFocusSession(45);
    store.clearAllStats();

    expect(useStatsStore.getState().totalMinutes).toBe(0);
    expect(useStatsStore.getState().totalSessions).toBe(0);
  });
});
