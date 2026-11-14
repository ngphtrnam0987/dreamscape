import React from 'react';

interface FlipClockDisplayProps {
  timeString: string;
  size?: 'medium' | 'large';
  accentColor?: string;
}

export const FlipClockDisplay: React.FC<FlipClockDisplayProps> = ({
  timeString,
  size = 'large',
  accentColor = '#f59e0b',
}) => {
  const isLarge = size === 'large';

  // Split into character blocks
  const characters = timeString.split('');

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 select-none">
      {characters.map((char, index) => {
        if (char === ':') {
          return (
            <div
              key={`colon-${index}`}
              className="flex flex-col items-center justify-center gap-2 sm:gap-3 px-1 sm:px-1.5"
            >
              <div
                className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full animate-pulse shadow-sm"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full animate-pulse shadow-sm"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          );
        }

        return (
          <div
            key={`flip-${index}-${char}`}
            className={`relative rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-700/80 shadow-[0_12px_30px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col items-center justify-center ${
              isLarge
                ? 'w-11 xs:w-14 sm:w-20 md:w-24 lg:w-28 h-16 xs:h-20 sm:h-28 md:h-36 lg:h-40'
                : 'w-7 xs:w-8 sm:w-10 h-10 xs:h-12 sm:h-14'
            }`}
          >
            {/* Top flap */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b border-black/90 pointer-events-none" />

            {/* Bottom flap */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-zinc-900 to-zinc-950 pointer-events-none" />

            {/* Center Split Horizontal Crease */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-[0.5px] h-[1.5px] bg-black/95 z-10 shadow-[0_1px_1px_rgba(255,255,255,0.08)]" />

            {/* Left and Right Metallic Rivet Hinges */}
            <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-2 rounded-r-sm bg-zinc-600 z-20 shadow-inner" />
            <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1 h-2 rounded-l-sm bg-zinc-600 z-20 shadow-inner" />

            {/* Digit numeral with high contrast */}
            <span
              className={`relative z-10 font-mono font-black text-zinc-100 tracking-tighter leading-none select-none drop-shadow-md ${
                isLarge
                  ? 'text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
                  : 'text-xl sm:text-2xl'
              }`}
            >
              {char}
            </span>
          </div>
        );
      })}
    </div>
  );
};
