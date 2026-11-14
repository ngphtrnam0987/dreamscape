export type TimerMode = 'focus' | 'short-break' | 'long-break';

export type ClockSize = 'hidden' | 'small' | 'medium' | 'large';
export type ClockDisplayType = 'pomodoro' | 'realtime' | 'stopwatch';

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number; // e.g. every 4 sessions
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundAlertEnabled: boolean;
  clockSize: ClockSize;
  clockDisplayType: ClockDisplayType;
}

export interface PomodoroState {
  mode: TimerMode;
  isRunning: boolean;
  targetEndTime: number | null; // Timestamp for drift-free background tabs
  remainingSeconds: number;
  completedSessions: number;
  settings: TimerSettings;
}
