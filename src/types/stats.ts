export interface DailyFocusStat {
  date: string; // YYYY-MM-DD
  minutes: number;
  sessions: number;
}

export interface FocusStats {
  totalMinutes: number;
  totalSessions: number;
  dailyStats: Record<string, DailyFocusStat>;
}
