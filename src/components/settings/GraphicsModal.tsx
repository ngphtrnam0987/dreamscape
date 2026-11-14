import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { Modal } from '../ui/Modal';
import { Slider } from '../ui/Slider';
import { getTranslation } from '../../locales';
import {
  GraphicsQualityPreset,
  FpsTarget,
  ColorGrade,
} from '../../types/scene';
import { WeatherType, WEATHER_TYPES_INFO } from '../../types/weather';
import {
  Sparkles,
  Zap,
  BatteryCharging,
  Cpu,
  Monitor,
  CloudRain,
  Sun,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
  Flame,
  Palette,
  Eye,
  Film,
  Compass,
  MousePointer2,
  Volume2,
} from 'lucide-react';

export const GraphicsModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const {
    settings,
    setGraphicsQuality,
    setFpsTarget,
    setWeather,
    updateSettings,
    resetSettings,
  } = useSceneStore();

  const [activeTab, setActiveTab] = useState<'graphics' | 'weather' | 'visuals'>('graphics');

  const {
    graphicsQuality = 'balanced',
    fpsTarget = 60,
    weather = 'scene-default',
    weatherIntensity = 1.0,
    syncWeatherAudio = true,
    particleDensity = 1.0,
    parallax3D = true,
    filmGrain = false,
    bloomGlow = false,
    ambientCursor = true,
    colorGrade = 'standard',
    brightness = 1.0,
    overlayOpacity = 0.2,
  } = settings;

  const isVi = language === 'vi';

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'CloudRain': return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'CloudLightning': return <CloudLightning className="w-4 h-4 text-indigo-400" />;
      case 'Snowflake': return <Snowflake className="w-4 h-4 text-cyan-300" />;
      case 'CloudFog': return <CloudFog className="w-4 h-4 text-slate-300" />;
      case 'Wind': return <Wind className="w-4 h-4 text-orange-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-teal-400" />;
      default: return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'graphics'}
      onClose={closeModal}
      title={isVi ? 'Cài Đặt Đồ Hoạ & Thời Tiết' : 'Graphics & Weather Studio'}
      subtitle={
        isVi
          ? 'Tùy chỉnh chế độ CPU/GPU, thời tiết động và hiệu ứng hình ảnh điện ảnh'
          : 'Fine-tune CPU/GPU rendering tiers, dynamic weather, and cinematic visuals'
      }
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('graphics')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'graphics'
                ? 'bg-sky-500/25 border border-sky-400/40 text-white shadow-sm ring-1 ring-sky-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>{isVi ? 'Cấu Hình GPU & FPS' : 'GPU & Performance'}</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'weather'
                ? 'bg-sky-500/25 border border-sky-400/40 text-white shadow-sm ring-1 ring-sky-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span>{isVi ? 'Khí Hậu & Thời Tiết' : 'Weather Atmosphere'}</span>
          </button>

          <button
            onClick={() => setActiveTab('visuals')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'visuals'
                ? 'bg-sky-500/25 border border-sky-400/40 text-white shadow-sm ring-1 ring-sky-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>{isVi ? 'Màu Sắc & Bộ Lọc' : 'Color & Filters'}</span>
          </button>
        </div>

        {/* TAB 1: GRAPHICS QUALITY & GPU / CPU */}
        {activeTab === 'graphics' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Preset Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Eco Saver */}
              <button
                onClick={() => setGraphicsQuality('eco')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  graphicsQuality === 'eco'
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg ring-2 ring-emerald-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    30 FPS
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-0.5">
                  {isVi ? '🍃 Tiết Kiệm Eco' : '🍃 Eco Saver'}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {isVi
                    ? 'Giảm tải CPU/GPU tối đa (< 1-3%), tắt hiệu ứng nặng, cực mát máy và tiết kiệm pin laptop.'
                    : 'Ultra-low GPU/CPU load (< 1-3%), 30 FPS cap, no 3D tilt, optimized for battery life.'}
                </div>
              </button>

              {/* 2. Balanced */}
              <button
                onClick={() => setGraphicsQuality('balanced')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  graphicsQuality === 'balanced'
                    ? 'bg-sky-950/40 border-sky-500/60 shadow-lg ring-2 ring-sky-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    60 FPS
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-0.5">
                  {isVi ? '⚖️ Cân Bằng Chuẩn' : '⚖️ Balanced'}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {isVi
                    ? 'Mượt mà 60 FPS, độ trôi 3D êm ái, cân bằng hoàn hảo giữa đồ họa bắt mắt và tải máy nhẹ.'
                    : 'Smooth 60 FPS, gentle 3D parallax, standard particles, and well-balanced GPU efficiency.'}
                </div>
              </button>

              {/* 3. Ultra Max Setting */}
              <button
                onClick={() => setGraphicsQuality('ultra')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  graphicsQuality === 'ultra'
                    ? 'bg-purple-950/50 border-purple-400/70 shadow-lg ring-2 ring-purple-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/25 border border-purple-400/40 flex items-center justify-center text-purple-200">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    120Hz Max
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-0.5">
                  {isVi ? '💎 Max Setting Siêu Đẹp' : '💎 Ultra Cinema'}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {isVi
                    ? 'Đồ họa điện ảnh đỉnh cao, 120 FPS+, hạt dày đặc 160%, tia sáng bloom và vệt phim 35mm rực rỡ.'
                    : 'Maximum visual fidelity, 120 FPS high refresh, rich particles, bloom glow, and 35mm film grain.'}
                </div>
              </button>
            </div>

            {/* Fine-Tuning Hardware Settings */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isVi ? 'Tùy Chỉnh Phần Cứng Nâng Cao' : 'Hardware Fine-Tuning'}</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {graphicsQuality === 'custom' ? (isVi ? 'Tự Tùy Chỉnh' : 'Custom') : graphicsQuality.toUpperCase()}
                </span>
              </div>

              {/* Target FPS Selector */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs font-medium text-white">{isVi ? 'Giới Hạn Tốc Độ Khung Hình (FPS)' : 'Frame Rate Target (FPS)'}</div>
                  <div className="text-[11px] text-slate-400">
                    {isVi ? 'Khóa FPS giúp màn hình tần số quét cao (144Hz+) không bị nóng GPU' : 'Capping FPS prevents high-refresh displays from overutilizing GPU'}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                  {([30, 60, 120] as FpsTarget[]).map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setFpsTarget(fps)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        fpsTarget === fps
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {fps === 120 ? '120Hz' : `${fps} FPS`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Density */}
              <Slider
                label={isVi ? 'Mật Độ Hạt & Hiệu Ứng' : 'Particle Density Multiplier'}
                icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                min={0.2}
                max={2.0}
                step={0.1}
                value={particleDensity}
                onChange={(val) => updateSettings({ particleDensity: val, graphicsQuality: 'custom' })}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />

              {/* 3D Parallax Tilt */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      {isVi ? 'Chiều Sâu 3D Parallax Theo Chuột' : '3D Parallax Perspective'}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {isVi ? 'Nghiêng góc nhìn mềm mại theo chuyển động chuột (tự ngủ 0% khi đứng yên)' : 'Tilt perspective based on mouse position (auto-sleeps at 0% GPU)'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={parallax3D}
                  onChange={(e) => updateSettings({ parallax3D: e.target.checked, graphicsQuality: 'custom' })}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </div>

              {/* Cinematic Film Grain */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      {isVi ? 'Hiệu Ứng Hạt Phim Cổ Điển 35mm' : '35mm Film Grain Texture'}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {isVi ? 'Tạo chất nghệ thuật analog điện ảnh mà không tốn GPU' : 'Subtle analog film texture with 0% GPU overhead'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filmGrain}
                  onChange={(e) => updateSettings({ filmGrain: e.target.checked, graphicsQuality: 'custom' })}
                  className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                />
              </div>

              {/* Ambient Cursor Glow */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <MousePointer2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      {isVi ? 'Đốm Sáng Phát Quang Theo Chuột' : 'Glowing Ambient Cursor Aura'}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {isVi ? 'Vòng hào quang dịu mắt chuyển động theo trỏ chuột' : 'Gentle glowing particle aura following your mouse'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ambientCursor}
                  onChange={(e) => updateSettings({ ambientCursor: e.target.checked, graphicsQuality: 'custom' })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {/* Cinema Bloom Light */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">
                      {isVi ? 'Hiệu Ứng Ánh Sáng Tỏa Bloom (Ultra)' : 'Cinema Bloom Lighting (Ultra)'}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {isVi ? 'Quầng sáng điện ảnh lan tỏa huyền ảo từ đỉnh khung hình' : 'Cinematic diffuse light bloom radiating from the top horizon'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={bloomGlow}
                  onChange={(e) => updateSettings({ bloomGlow: e.target.checked, graphicsQuality: 'custom' })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEATHER & ATMOSPHERE */}
        {activeTab === 'weather' && (
          <div className="space-y-4 animate-fade-in">
            {/* Weather Sync Audio Banner */}
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    {isVi ? 'Tự Động Bật Âm Thanh Thời Tiết Tương Ứng' : 'Sync Weather Ambient Audio'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isVi
                      ? 'Tự động kích hoạt tiếng mưa, sấm hoặc gió khi bạn đổi kiểu thời tiết'
                      : 'Automatically tune rain, thunder, or wind channels to match chosen weather'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={syncWeatherAudio}
                onChange={(e) => updateSettings({ syncWeatherAudio: e.target.checked })}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>

            {/* Weather Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {WEATHER_TYPES_INFO.map((item) => {
                const active = weather === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setWeather(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[105px] ${
                      active
                        ? 'bg-sky-500/20 border-sky-400/60 shadow-lg ring-2 ring-sky-400/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-white/10 flex items-center justify-center">
                          {getWeatherIcon(item.icon)}
                        </div>
                        {active && (
                          <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {isVi ? item.nameVi : item.name}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight opacity-90 mt-1">
                      {isVi ? item.descVi : item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Weather Intensity Slider */}
            {weather !== 'scene-default' && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Slider
                  label={isVi ? 'Cường Độ Thời Tiết (Tốc Độ & Số Lượng)' : 'Weather Intensity & Density'}
                  icon={<Wind className="w-3.5 h-3.5 text-sky-400" />}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={weatherIntensity}
                  onChange={(val) => updateSettings({ weatherIntensity: val })}
                  formatValue={(v) => `${Math.round(v * 100)}%`}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VISUALS, COLOR GRADING & BRIGHTNESS */}
        {activeTab === 'visuals' && (
          <div className="space-y-4 animate-fade-in">
            {/* Color Grade Presets */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>{isVi ? 'Bộ Lọc Màu Điện Ảnh (LUTs)' : 'Cinematic Color Grading Presets'}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: isVi ? 'Chuẩn Tự Nhiên' : 'Natural Standard', color: 'from-slate-700 to-slate-900' },
                  { id: 'warm-sunset', label: isVi ? 'Hoàng Hôn Ấm Áp' : 'Warm Sunset', color: 'from-amber-600 to-orange-800' },
                  { id: 'cool-midnight', label: isVi ? 'Đêm Sương Lạnh' : 'Cool Midnight', color: 'from-cyan-700 to-indigo-900' },
                  { id: 'cyber-neon', label: isVi ? 'Cyberpunk Neon' : 'Cyber Neon', color: 'from-fuchsia-600 to-purple-900' },
                  { id: 'noir', label: isVi ? 'Phim Đen Trắng' : 'Classic Noir', color: 'from-zinc-500 to-zinc-900' },
                ].map(({ id, label, color }) => {
                  const active = (colorGrade || 'standard') === id;
                  return (
                    <button
                      key={id}
                      onClick={() => updateSettings({ colorGrade: id as ColorGrade })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                        active
                          ? 'bg-gradient-to-r ' + color + ' text-white border-white/40 shadow-md ring-2 ring-white/20'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brightness & Vignette Sliders */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <Slider
                label={getTranslation(language, 'brightness')}
                icon={<Sun className="w-3.5 h-3.5 text-amber-400" />}
                min={0.3}
                max={1.5}
                step={0.05}
                value={brightness}
                onChange={(val) => updateSettings({ brightness: val })}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />

              <Slider
                label={getTranslation(language, 'overlayOpacity')}
                icon={<Eye className="w-3.5 h-3.5 text-purple-400" />}
                min={0.0}
                max={0.7}
                step={0.05}
                value={overlayOpacity}
                onChange={(val) => updateSettings({ overlayOpacity: val })}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <button
            onClick={() => {
              setGraphicsQuality('balanced');
              setWeather('scene-default');
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isVi ? 'Khôi phục mặc định' : 'Reset to Default'}
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-md transition-all"
          >
            {isVi ? 'Áp Dụng' : 'Apply & Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
