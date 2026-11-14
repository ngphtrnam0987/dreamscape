import React from 'react';
import { ClockDisplayType } from '../../../types/timer';

interface AnalogClockDisplayProps {
  realtime: Date;
  remainingSeconds: number;
  totalDurationSeconds: number;
  stopwatchSeconds: number;
  displayType: ClockDisplayType;
  size?: 'medium' | 'large';
  accentColor?: string;
}

export const AnalogClockDisplay: React.FC<AnalogClockDisplayProps> = ({
  realtime,
  remainingSeconds,
  totalDurationSeconds,
  stopwatchSeconds,
  displayType,
  size = 'large',
  accentColor = '#38bdf8',
}) => {
  const isLarge = size === 'large';
  const dialDimension = isLarge ? 280 : 180;
  const center = dialDimension / 2;
  const radius = center - 16;

  // Compute angles
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (displayType === 'realtime') {
    hours = realtime.getHours();
    minutes = realtime.getMinutes();
    seconds = realtime.getSeconds();
  } else if (displayType === 'pomodoro') {
    minutes = Math.floor(remainingSeconds / 60);
    seconds = remainingSeconds % 60;
    hours = Math.floor(minutes / 60);
  } else {
    minutes = Math.floor(stopwatchSeconds / 60);
    seconds = stopwatchSeconds % 60;
    hours = Math.floor(stopwatchSeconds / 3600);
  }

  const secondAngle = seconds * 6; // 360 / 60
  const minuteAngle = minutes * 6 + (seconds / 60) * 6;
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;

  // 12 hour ticks
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angleRad = (i * 30 * Math.PI) / 180;
    const isCardinal = i % 3 === 0;
    const innerR = radius - (isCardinal ? 12 : 6);
    const outerR = radius;

    const x1 = center + Math.sin(angleRad) * innerR;
    const y1 = center - Math.cos(angleRad) * innerR;
    const x2 = center + Math.sin(angleRad) * outerR;
    const y2 = center - Math.cos(angleRad) * outerR;

    return { x1, y1, x2, y2, isCardinal, hour: i === 0 ? 12 : i };
  });

  // Pomodoro countdown progress arc
  const progressRatio =
    totalDurationSeconds > 0 ? remainingSeconds / totalDurationSeconds : 0;
  const arcDash = 2 * Math.PI * (radius - 18);
  const arcOffset = arcDash * (1 - progressRatio);

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div
        className="relative rounded-full glass-panel shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.12)] border border-white/20 p-2"
        style={{ width: dialDimension, height: dialDimension }}
      >
        <svg
          width={dialDimension}
          height={dialDimension}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Subtle countdown progress ring in Pomodoro mode */}
          {displayType === 'pomodoro' && (
            <circle
              cx={center}
              cy={center}
              r={radius - 18}
              fill="none"
              stroke={accentColor}
              strokeWidth={3}
              strokeDasharray={arcDash}
              strokeDashoffset={arcOffset}
              strokeLinecap="round"
              className="opacity-40 transition-all duration-500"
              transform={`rotate(-90 ${center} ${center})`}
            />
          )}

          {/* 12 Hour Ticks */}
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isCardinal ? '#f8fafc' : '#94a3b8'}
              strokeWidth={t.isCardinal ? 2.5 : 1.5}
              strokeLinecap="round"
              className="opacity-80"
            />
          ))}

          {/* Cardinal Numerals 12, 3, 6, 9 */}
          {isLarge && (
            <>
              <text
                x={center}
                y={center - radius + 24}
                textAnchor="middle"
                className="fill-slate-300 font-mono text-[11px] font-bold select-none"
              >
                12
              </text>
              <text
                x={center + radius - 20}
                y={center + 4}
                textAnchor="middle"
                className="fill-slate-300 font-mono text-[11px] font-bold select-none"
              >
                3
              </text>
              <text
                x={center}
                y={center + radius - 16}
                textAnchor="middle"
                className="fill-slate-300 font-mono text-[11px] font-bold select-none"
              >
                6
              </text>
              <text
                x={center - radius + 20}
                y={center + 4}
                textAnchor="middle"
                className="fill-slate-300 font-mono text-[11px] font-bold select-none"
              >
                9
              </text>
            </>
          )}

          {/* Hour Hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.sin((hourAngle * Math.PI) / 180) * (radius * 0.52)}
            y2={center - Math.cos((hourAngle * Math.PI) / 180) * (radius * 0.52)}
            stroke="#f8fafc"
            strokeWidth={isLarge ? 4 : 3}
            strokeLinecap="round"
            className="shadow-sm"
          />

          {/* Minute Hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.sin((minuteAngle * Math.PI) / 180) * (radius * 0.76)}
            y2={center - Math.cos((minuteAngle * Math.PI) / 180) * (radius * 0.76)}
            stroke="#cbd5e1"
            strokeWidth={isLarge ? 3 : 2}
            strokeLinecap="round"
            className="shadow-sm"
          />

          {/* Second Hand (Sweeping needle) */}
          <line
            x1={center - Math.sin((secondAngle * Math.PI) / 180) * 16}
            y1={center + Math.cos((secondAngle * Math.PI) / 180) * 16}
            x2={center + Math.sin((secondAngle * Math.PI) / 180) * (radius * 0.85)}
            y2={center - Math.cos((secondAngle * Math.PI) / 180) * (radius * 0.85)}
            stroke={accentColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Center Hub Cap */}
          <circle cx={center} cy={center} r={4.5} fill={accentColor} />
          <circle cx={center} cy={center} r={2} fill="#ffffff" />
        </svg>
      </div>

      {/* Digital readout badge underneath */}
      <div className="mt-2 text-xs font-mono font-semibold text-slate-300 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 shadow-sm">
        {displayType === 'pomodoro'
          ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : displayType === 'realtime'
          ? realtime.toLocaleTimeString()
          : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </div>
    </div>
  );
};
