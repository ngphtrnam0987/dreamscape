import React from 'react';

interface ZenClockDisplayProps {
  timeString: string;
  size?: 'medium' | 'large';
  accentColor?: string;
  subtitle?: string;
}

export const ZenClockDisplay: React.FC<ZenClockDisplayProps> = ({
  timeString,
  size = 'large',
  accentColor = '#ffffff',
  subtitle,
}) => {
  const isLarge = size === 'large';

  return (
    <div className="flex flex-col items-center justify-center select-none text-center">
      <h1
        className={`font-mono font-light tracking-widest text-white/90 select-none leading-none ${
          isLarge
            ? 'text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[11rem]'
            : 'text-3xl sm:text-4xl'
        }`}
        style={{
          textShadow: `0 4px 30px rgba(0,0,0,0.8), 0 0 40px ${accentColor}30`,
        }}
      >
        {timeString}
      </h1>

      {subtitle && (
        <div className="mt-2 text-xs sm:text-sm font-mono tracking-widest text-slate-300 uppercase opacity-70">
          {subtitle}
        </div>
      )}
    </div>
  );
};
