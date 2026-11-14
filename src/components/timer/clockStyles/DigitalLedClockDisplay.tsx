import React from 'react';

interface DigitalLedClockDisplayProps {
  timeString: string;
  size?: 'medium' | 'large';
  accentColor?: string;
}

export const DigitalLedClockDisplay: React.FC<DigitalLedClockDisplayProps> = ({
  timeString,
  size = 'large',
  accentColor = '#34d399',
}) => {
  const isLarge = size === 'large';

  // Construct ghost template (e.g. '88:88' or '88:88:88')
  const ghostTemplate = timeString.replace(/[0-9]/g, '8');

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-950/95 border border-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.9),inset_0_2px_8px_rgba(255,255,255,0.05)] select-none overflow-hidden`}
    >
      {/* Subtle CRT scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Ghost background unlit 7-segment LED backdrop */}
      <div
        className={`font-mono font-black tracking-widest text-zinc-800/40 opacity-25 select-none leading-none pointer-events-none ${
          isLarge
            ? 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
            : 'text-2xl sm:text-3xl'
        }`}
      >
        {ghostTemplate}
      </div>

      {/* Active illuminated glowing digits */}
      <div
        className={`absolute inset-0 flex items-center justify-center font-mono font-black tracking-widest leading-none select-none ${
          isLarge
            ? 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
            : 'text-2xl sm:text-3xl'
        }`}
        style={{
          color: accentColor,
          textShadow: `0 0 12px ${accentColor}, 0 0 25px ${accentColor}80, 0 0 45px ${accentColor}40`,
        }}
      >
        {timeString}
      </div>
    </div>
  );
};
