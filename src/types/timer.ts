export type TimerMode = 'focus' | 'short-break' | 'long-break';

export type ClockSize = 'hidden' | 'small' | 'medium' | 'large';
export type ClockDisplayType = 'pomodoro' | 'realtime' | 'stopwatch';
export type ClockStyle = 'minimal' | 'flip' | 'digital-led' | 'analog' | 'radial' | 'matrix' | 'zen';

export interface ClockStyleInfo {
  id: ClockStyle;
  name: string;
  nameVi: string;
  desc: string;
  descVi: string;
}

export const CLOCK_STYLES_INFO: ClockStyleInfo[] = [
  {
    id: 'minimal',
    name: 'Modern Glass',
    nameVi: 'Kính Hiện Đại',
    desc: 'Clean glassmorphism with crisp typography and subtle ambient glow',
    descVi: 'Thiết kế kính mờ tối giản, hiện đại và tinh tế',
  },
  {
    id: 'flip',
    name: 'Retro Flip Clock',
    nameVi: 'Đồng Hồ Lật Cổ Điển (Flip)',
    desc: 'Vintage mechanical split-flap desk cards with satisfying tactile crease',
    descVi: 'Phong cách thẻ lật cơ học hoài niệm chuẩn bàn làm việc lofi',
  },
  {
    id: 'digital-led',
    name: 'Cyber Neon LED',
    nameVi: 'Đèn LED Neon Điện Tử',
    desc: 'Authentic 7-segment digital display with glowing neon segments and scanlines',
    descVi: 'Màn hình số điện tử 7 đoạn phát sáng phong cách cyberpunk',
  },
  {
    id: 'analog',
    name: 'Classic Dial Gauge',
    nameVi: 'Mặt Kim Cổ Điển (Analog)',
    desc: 'Elegant circular watchface with sweeping second hand and hour dial ticks',
    descVi: 'Mặt đồng hồ kim tròn thanh lịch với kim trôi mượt mà',
  },
  {
    id: 'radial',
    name: 'Aura Halo Ring',
    nameVi: 'Vòng Hào Quang (Radial Halo)',
    desc: 'Hypnotic circular progress ring tracing time with breathing ambient aura',
    descVi: 'Vòng tròn tiến độ phát sáng huyền ảo chuyển động theo thời gian',
  },
  {
    id: 'matrix',
    name: 'Hacker Terminal',
    nameVi: 'Màn Hình Terminal Hacker',
    desc: 'Retro green phosphor CRT monitor with bracketed time and blinking cursor',
    descVi: 'Màn hình máy tính cổ điển với chữ xanh phosphor và con trỏ nhấp nháy',
  },
  {
    id: 'zen',
    name: 'Zen Airy Floating',
    nameVi: 'Chữ Số Nổi Vô Cực (Zen)',
    desc: 'Ultra-large, borderless translucent numerals blending into ambient scenery',
    descVi: 'Chữ số siêu lớn bay bổng không viền, hoà mình vào không gian',
  },
];

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
  clockStyle: ClockStyle;
}

export interface PomodoroState {
  mode: TimerMode;
  isRunning: boolean;
  targetEndTime: number | null; // Timestamp for drift-free background tabs
  remainingSeconds: number;
  completedSessions: number;
  settings: TimerSettings;
}
