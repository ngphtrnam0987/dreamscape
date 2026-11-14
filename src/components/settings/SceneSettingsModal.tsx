import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { ColorGrade } from '../../types/scene';
import { Modal } from '../ui/Modal';
import { Slider } from '../ui/Slider';
import { getTranslation } from '../../locales';
import {
  Sun,
  Eye,
  Activity,
  Sparkles,
  BatteryCharging,
  RotateCcw,
  Palette,
  Film,
  Compass,
  MousePointer2,
  Volume2,
} from 'lucide-react';

export const SceneSettingsModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const { currentSceneId, settings, updateSettings, updateSpecificSettings, resetSettings } = useSceneStore();

  const specific = settings.specific[currentSceneId] || {};

  return (
    <Modal
      isOpen={activeModal === 'settings'}
      onClose={closeModal}
      title={getTranslation(language, 'sceneSettings')}
      subtitle="Tailor the visual environment to your optimal comfort"
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-5">
        {/* Global Atmosphere Controls */}
        <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Global Visual Controls
          </h4>

          {/* Brightness */}
          <Slider
            label={getTranslation(language, 'brightness')}
            icon={<Sun className="w-3.5 h-3.5 text-amber-400" />}
            min={0.3}
            max={1.5}
            step={0.05}
            value={settings.brightness}
            onChange={val => updateSettings({ brightness: val })}
            formatValue={v => `${Math.round(v * 100)}%`}
          />

          {/* Vignette Overlay */}
          <Slider
            label={getTranslation(language, 'overlayOpacity')}
            icon={<Eye className="w-3.5 h-3.5 text-purple-400" />}
            min={0.0}
            max={0.7}
            step={0.05}
            value={settings.overlayOpacity}
            onChange={val => updateSettings({ overlayOpacity: val })}
            formatValue={v => `${Math.round(v * 100)}%`}
          />

          {/* Animation Intensity */}
          <Slider
            label={getTranslation(language, 'animationSpeed')}
            icon={<Activity className="w-3.5 h-3.5 text-sky-400" />}
            min={0.2}
            max={2.0}
            step={0.1}
            value={settings.animationIntensity}
            onChange={val => updateSettings({ animationIntensity: val })}
            formatValue={v => `${v.toFixed(1)}x`}
          />

          {/* Particle Density */}
          <Slider
            label={getTranslation(language, 'particleDensity')}
            icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            min={0.2}
            max={2.0}
            step={0.1}
            value={settings.particleDensity}
            onChange={val => updateSettings({ particleDensity: val })}
            formatValue={v => `${Math.round(v * 100)}%`}
          />

          {/* Low Performance Mode Toggle */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-medium text-white block">
                  {getTranslation(language, 'lowPerfMode')}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {getTranslation(language, 'lowPerfModeDesc')}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.lowPerformanceMode}
              onChange={e => updateSettings({ lowPerformanceMode: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Cinematic Color Grading & Visual Aesthetics */}
        <div className="space-y-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>{getTranslation(language, 'cinematicColorGrading')}</span>
          </div>

          {/* Color Grade Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'standard', label: getTranslation(language, 'gradeStandard'), color: 'from-slate-700 to-slate-900' },
              { id: 'warm-sunset', label: getTranslation(language, 'gradeWarmSunset'), color: 'from-amber-600 to-orange-800' },
              { id: 'cool-midnight', label: getTranslation(language, 'gradeCoolMidnight'), color: 'from-cyan-700 to-indigo-900' },
              { id: 'cyber-neon', label: getTranslation(language, 'gradeCyberNeon'), color: 'from-fuchsia-600 to-purple-900' },
              { id: 'noir', label: getTranslation(language, 'gradeNoir'), color: 'from-zinc-500 to-zinc-900' },
            ].map(({ id, label, color }) => {
              const active = (settings.colorGrade || 'standard') === id;
              return (
                <button
                  key={id}
                  onClick={() => updateSettings({ colorGrade: id as ColorGrade })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
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

          {/* Film Grain Toggle */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-xs font-medium text-white block">
                  {getTranslation(language, 'filmGrain')}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {getTranslation(language, 'filmGrainDesc')}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.filmGrain}
              onChange={e => updateSettings({ filmGrain: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </div>

          {/* 3D Parallax Perspective Tilt */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-medium text-white block">
                  {getTranslation(language, 'parallax3D')}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {getTranslation(language, 'parallax3DDesc')}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.parallax3D}
              onChange={e => updateSettings({ parallax3D: e.target.checked })}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          {/* Glowing Ambient Cursor */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-medium text-white block">
                  {getTranslation(language, 'ambientCursor')}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {getTranslation(language, 'ambientCursorDesc')}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.ambientCursor}
              onChange={e => updateSettings({ ambientCursor: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Scene-Specific Controls */}
        <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {currentSceneId.replace('-', ' ')} Settings
          </h4>

          {/* Rainy Night */}
          {currentSceneId === 'rainy-night' && (
            <>
              <Slider
                label={getTranslation(language, 'rainIntensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.rainIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('rainy-night', { rainIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>{getTranslation(language, 'lightningEnabled')}</span>
                <input
                  type="checkbox"
                  checked={specific.lightningEnabled ?? true}
                  onChange={e => updateSpecificSettings('rainy-night', { lightningEnabled: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
              </label>
            </>
          )}

          {/* Forest Retreat */}
          {currentSceneId === 'forest-retreat' && (
            <>
              <Slider
                label={getTranslation(language, 'fogIntensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.fogIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('forest-retreat', { fogIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>{getTranslation(language, 'lightRaysEnabled')}</span>
                <input
                  type="checkbox"
                  checked={specific.lightRaysEnabled ?? true}
                  onChange={e => updateSpecificSettings('forest-retreat', { lightRaysEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
            </>
          )}

          {/* Ocean Sunset */}
          {currentSceneId === 'ocean-sunset' && (
            <>
              <Slider
                label={getTranslation(language, 'waveIntensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.waveIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('ocean-sunset', { waveIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label={getTranslation(language, 'sunsetBrightness')}
                min={0.5}
                max={1.5}
                step={0.05}
                value={specific.sunsetBrightness ?? 1.0}
                onChange={val => updateSpecificSettings('ocean-sunset', { sunsetBrightness: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
            </>
          )}

          {/* Cozy Fireplace */}
          {currentSceneId === 'cozy-fireplace' && (
            <>
              <Slider
                label={getTranslation(language, 'fireIntensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.fireIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('cozy-fireplace', { fireIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>{getTranslation(language, 'embersEnabled')}</span>
                <input
                  type="checkbox"
                  checked={specific.embersEnabled ?? true}
                  onChange={e => updateSpecificSettings('cozy-fireplace', { embersEnabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>{getTranslation(language, 'windowRainEnabled')}</span>
                <input
                  type="checkbox"
                  checked={specific.windowRainEnabled ?? true}
                  onChange={e => updateSpecificSettings('cozy-fireplace', { windowRainEnabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
              </label>
            </>
          )}

          {/* Cosmic Dream */}
          {currentSceneId === 'cosmic-dream' && (
            <>
              <Slider
                label={getTranslation(language, 'starDensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.starDensity ?? 1.0}
                onChange={val => updateSpecificSettings('cosmic-dream', { starDensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label={getTranslation(language, 'nebulaGlow')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.nebulaGlow ?? 1.0}
                onChange={val => updateSpecificSettings('cosmic-dream', { nebulaGlow: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>{getTranslation(language, 'cameraDriftEnabled')}</span>
                <input
                  type="checkbox"
                  checked={specific.cameraDriftEnabled ?? true}
                  onChange={e => updateSpecificSettings('cosmic-dream', { cameraDriftEnabled: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>
            </>
          )}

          {/* Cherry Blossom */}
          {currentSceneId === 'cherry-blossom' && (
            <>
              <Slider
                label="Sakura Petal Density"
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.petalDensity ?? 1.0}
                onChange={val => updateSpecificSettings('cherry-blossom', { petalDensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label="Wind Breeze Speed"
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.windBreeze ?? 1.0}
                onChange={val => updateSpecificSettings('cherry-blossom', { windBreeze: val })}
                formatValue={v => `${v.toFixed(1)}x`}
              />
            </>
          )}

          {/* Cozy Cafe */}
          {currentSceneId === 'cozy-cafe' && (
            <>
              <Slider
                label="Cafe Ambient Warmth"
                min={0.5}
                max={1.5}
                step={0.05}
                value={specific.cafeLighting ?? 1.0}
                onChange={val => updateSpecificSettings('cozy-cafe', { cafeLighting: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label="Coffee Steam Density"
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.steamIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('cozy-cafe', { steamIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
            </>
          )}

          {/* Snowy Aurora */}
          {currentSceneId === 'snowy-aurora' && (
            <>
              <Slider
                label="Snowfall Density"
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.snowIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('snowy-aurora', { snowIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label="Northern Lights Speed"
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.auroraSpeed ?? 1.0}
                onChange={val => updateSpecificSettings('snowy-aurora', { auroraSpeed: val })}
                formatValue={v => `${v.toFixed(1)}x`}
              />
              <Slider
                label="Aurora Luminance"
                min={0.5}
                max={1.5}
                step={0.05}
                value={specific.auroraGlow ?? 1.0}
                onChange={val => updateSpecificSettings('snowy-aurora', { auroraGlow: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
            </>
          )}

          {/* Neon Cyberpunk Tokyo */}
          {currentSceneId === 'neon-cyberpunk' && (
            <>
              <Slider
                label={getTranslation(language, 'neonGlow')}
                min={0.5}
                max={1.5}
                step={0.05}
                value={specific.neonGlow ?? 1.0}
                onChange={val => updateSpecificSettings('neon-cyberpunk', { neonGlow: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label={getTranslation(language, 'cyberRainIntensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.cyberRainIntensity ?? 1.0}
                onChange={val => updateSpecificSettings('neon-cyberpunk', { cyberRainIntensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1">
                <span>{getTranslation(language, 'hologramFlicker')}</span>
                <input
                  type="checkbox"
                  checked={specific.hologramFlicker ?? true}
                  onChange={e => updateSpecificSettings('neon-cyberpunk', { hologramFlicker: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
              </label>
            </>
          )}

          {/* Bamboo Sanctuary */}
          {currentSceneId === 'bamboo-sanctuary' && (
            <>
              <Slider
                label={getTranslation(language, 'fireflyDensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.fireflyDensity ?? 1.0}
                onChange={val => updateSpecificSettings('bamboo-sanctuary', { fireflyDensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
              <Slider
                label={getTranslation(language, 'bambooSway')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.bambooSway ?? 1.0}
                onChange={val => updateSpecificSettings('bamboo-sanctuary', { bambooSway: val })}
                formatValue={v => `${v.toFixed(1)}x`}
              />
              <Slider
                label={getTranslation(language, 'mistDensity')}
                min={0.2}
                max={2.0}
                step={0.1}
                value={specific.mistDensity ?? 1.0}
                onChange={val => updateSpecificSettings('bamboo-sanctuary', { mistDensity: val })}
                formatValue={v => `${Math.round(v * 100)}%`}
              />
            </>
          )}
        </div>

        {/* Reset Button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-400 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
