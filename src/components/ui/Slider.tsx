import React from 'react';

interface SliderProps {
  label: string;
  value: number; // 0.0 to 1.0 or custom range
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
  formatValue?: (val: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  unit = '%',
  onChange,
  icon,
  formatValue,
}) => {
  const percentage = Math.round(((value - min) / (max - min)) * 100);
  const displayVal = formatValue ? formatValue(value) : (unit === '%' ? `${percentage}%` : `${value}${unit}`);

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
        <span className="flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="text-slate-400 font-mono text-[11px]">{displayVal}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer accent-sky-400"
      />
    </div>
  );
};
