import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore } from '../../stores/useSceneStore';
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
