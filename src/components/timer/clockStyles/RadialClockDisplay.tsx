import React from 'react';

interface RadialClockDisplayProps {
  timeString: string;
  progressRatio: number; // 0 to 1
  size?: 'medium' | 'large';
  accentColor?: string;
  subtitle?: string;
}

export const RadialClockDisplay: React.FC<RadialClockDisplayProps> = ({
  timeString,
  progressRatio,
  size = 'large',
  accentColor = '#38bdf8',
  subtitle,
}) => {
  const isLarge = size === 'large';
  const dimension = isLarge ? 320 : 200;
  const strokeWidth = isLarge ? 8 : 5;
  const radius = (dimension - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, progressRatio)));

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer subtle breathing aura glow */}
      <div
        className="absolute rounded-full blur-2xl opacity-25 animate-pulse-subtle pointer-events-none"
        style={{
          width: dimension * 0.9,
          height: dimension * 0.9,
          backgroundColor: accentColor,
        }}
      />

      <svg width={dimension} height={dimension} className="relative z-10">
        {/* Background track circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Dynamic progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${accentColor})`,
          }}
          transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`}
        />
      </svg>

      {/* Centered Digital Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <span
          className={`font-mono font-black text-white tracking-tighter leading-none drop-shadow-lg ${
            isLarge ? 'text-5xl sm:text-7xl' : 'text-2xl sm:text-3xl'
          }`}
          style={{
            textShadow: `0 0 20px ${accentColor}60`,
          }}
        >
          {timeString}
        </span>

        {subtitle && (
          <span className="text-[11px] font-mono tracking-wider text-slate-300 mt-1 uppercase opacity-80">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
