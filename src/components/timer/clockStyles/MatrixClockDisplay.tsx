import React from 'react';

interface MatrixClockDisplayProps {
  timeString: string;
  size?: 'medium' | 'large';
  statusText?: string;
}

export const MatrixClockDisplay: React.FC<MatrixClockDisplayProps> = ({
  timeString,
  size = 'large',
  statusText = 'FLOW_STATE: ACTIVE',
}) => {
  const isLarge = size === 'large';

  return (
    <div className="relative inline-flex flex-col items-center p-3.5 sm:p-6 rounded-2xl bg-black/90 border border-emerald-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(34,197,94,0.15)] font-mono select-none overflow-hidden text-emerald-400">
      {/* Subtle CRT scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Terminal Header */}
      <div className="flex items-center justify-between w-full text-[10px] sm:text-xs text-emerald-500/80 mb-2 border-b border-emerald-500/20 pb-1">
        <span>&gt; DREAMSCAPE_OS_v2.0</span>
        <span className="animate-pulse">● ONLINE</span>
      </div>

      {/* Terminal Main Digits */}
      <div
        className={`flex items-center justify-center font-black tracking-widest leading-none my-1 ${
          isLarge
            ? 'text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
            : 'text-2xl sm:text-3xl'
        }`}
        style={{
          textShadow: '0 0 10px rgba(52, 211, 153, 0.8), 0 0 25px rgba(16, 185, 129, 0.4)',
        }}
      >
        <span>[ {timeString} ]</span>
        <span className="inline-block w-2 sm:w-3 h-6 sm:h-10 ml-2 bg-emerald-400 animate-pulse" />
      </div>

      {/* Terminal Footer */}
      <div className="text-[10px] sm:text-xs text-emerald-400/80 mt-2 border-t border-emerald-500/20 pt-1 w-full text-center tracking-wider">
        <span>$ {statusText}</span>
      </div>
    </div>
  );
};
