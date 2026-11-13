import React from 'react';
import { ChannelConfig } from '../../types/audio';
import { useAudioStore } from '../../stores/useAudioStore';
import { useUIStore } from '../../stores/useUIStore';
import { getTranslation, TranslationKey } from '../../locales';
import {
  CloudRain,
  CloudLightning,
  Wind,
  Bird,
  Trees,
  Droplets,
  Waves,
  Flame,
  Sparkles,
  Building2,
  MoonStar,
  Volume2,
} from 'lucide-react';

interface ChannelRowProps {
  config: ChannelConfig;
}

export const ChannelVolumeRow: React.FC<ChannelRowProps> = ({ config }) => {
  const { channels, toggleChannel, setChannelVolume } = useAudioStore();
  const { language } = useUIStore();

  const channelState = channels[config.id] || { volume: config.defaultVolume, isPlaying: false };
  const isPlaying = channelState.isPlaying;

  const renderIcon = () => {
    const props = { className: `w-4 h-4 ${isPlaying ? 'text-sky-300' : 'text-slate-400'}` };
    switch (config.icon) {
      case 'CloudRain': return <CloudRain {...props} />;
      case 'CloudLightning': return <CloudLightning {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Bird': return <Bird {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'MoonStar': return <MoonStar {...props} />;
      default: return <Volume2 {...props} />;
    }
  };

  const channelTitle = getTranslation(language, config.nameKey as TranslationKey);

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all border ${
        isPlaying
          ? 'bg-sky-500/15 border-sky-400/30 shadow-inner'
          : 'bg-white/5 border-white/5 hover:border-white/15'
      }`}
    >
      {/* Play/Stop Toggle Button */}
      <button
        onClick={() => toggleChannel(config.id)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
          isPlaying
            ? 'bg-sky-500/30 border border-sky-400/50 shadow-md ring-2 ring-sky-400/20'
            : 'bg-white/10 hover:bg-white/15 border border-white/10'
        }`}
        title={`${isPlaying ? 'Stop' : 'Play'} ${channelTitle}`}
        aria-label={`${isPlaying ? 'Stop' : 'Play'} ${channelTitle}`}
      >
        {renderIcon()}
      </button>

      {/* Info & Slider */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span
            onClick={() => toggleChannel(config.id)}
            className={`text-xs font-medium cursor-pointer truncate ${
              isPlaying ? 'text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {channelTitle}
          </span>
          <span className="text-[11px] font-mono text-slate-400 ml-2">
            {Math.round(channelState.volume * 100)}%
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={channelState.volume}
          onChange={e => {
            const vol = parseFloat(e.target.value);
            setChannelVolume(config.id, vol);
            // If dragging slider while stopped, auto-start channel
            if (!isPlaying && vol > 0.05) {
              toggleChannel(config.id);
            }
          }}
          className="w-full cursor-pointer accent-sky-400"
          aria-label={`${channelTitle} Volume`}
        />
      </div>
    </div>
  );
};
