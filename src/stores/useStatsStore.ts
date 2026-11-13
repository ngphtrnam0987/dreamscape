import { create } from 'zustand';
import { FocusStats, DailyFocusStat } from '../types/stats';

interface StatsStoreState extends FocusStats {
  recordFocusSession: (minutes: number) => void;
  getTodayStats: () => DailyFocusStat;
  getLast7DaysStats: () => Array<{ date: string; dayLabel: string; minutes: number; sessions: number }>;
  clearAllStats: () => void;
}

const STORAGE_KEY = 'dreamscape_focus_stats';

function getLocalDateString(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadStoredStats(): FocusStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        totalMinutes: parsed.totalMinutes || 0,
        totalSessions: parsed.totalSessions || 0,
        dailyStats: parsed.dailyStats || {},
      };
    }
  } catch {}
  return {
    totalMinutes: 0,
    totalSessions: 0,
    dailyStats: {},
  };
}

const initial = loadStoredStats();

export const useStatsStore = create<StatsStoreState>((set, get) => ({
  totalMinutes: initial.totalMinutes,
  totalSessions: initial.totalSessions,
  dailyStats: initial.dailyStats,

  recordFocusSession: (minutes: number) => {
    const today = getLocalDateString();
    set(state => {
      const currentDay = state.dailyStats[today] || { date: today, minutes: 0, sessions: 0 };
      const updatedDay: DailyFocusStat = {
        date: today,
        minutes: currentDay.minutes + minutes,
        sessions: currentDay.sessions + 1,
      };

      const newState = {
        totalMinutes: state.totalMinutes + minutes,
        totalSessions: state.totalSessions + 1,
        dailyStats: {
          ...state.dailyStats,
          [today]: updatedDay,
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch {}

      return newState;
    });
  },

  getTodayStats: () => {
    const today = getLocalDateString();
    return get().dailyStats[today] || { date: today, minutes: 0, sessions: 0 };
  },

  getLast7DaysStats: () => {
    const results: Array<{ date: string; dayLabel: string; minutes: number; sessions: number }> = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = getLocalDateString(d);
      const stat = get().dailyStats[dateKey] || { minutes: 0, sessions: 0 };
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

      results.push({
        date: dateKey,
        dayLabel,
        minutes: stat.minutes,
        sessions: stat.sessions,
      });
    }

    return results;
  },

  clearAllStats: () => {
    const empty = {
      totalMinutes: 0,
      totalSessions: 0,
      dailyStats: {},
    };
    set(empty);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
}));
