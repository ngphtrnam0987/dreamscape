import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../stores/useSceneStore';
import { useLofiStore } from '../stores/useLofiStore';
import { useAudioStore } from '../stores/useAudioStore';
import { ColorGrade } from '../types/scene';
import { RainyNightScene } from './RainyNight/RainyNightScene';
import { ForestRetreatScene } from './ForestRetreat/ForestRetreatScene';
import { OceanSunsetScene } from './OceanSunset/OceanSunsetScene';
import { CozyFireplaceScene } from './CozyFireplace/CozyFireplaceScene';
import { CosmicDreamScene } from './CosmicDream/CosmicDreamScene';
import { CherryBlossomScene } from './CherryBlossom/CherryBlossomScene';
import { CozyCafeScene } from './CozyCafe/CozyCafeScene';
import { SnowyAuroraScene } from './SnowyAurora/SnowyAuroraScene';
import { NeonCyberpunkScene } from './NeonCyberpunk/NeonCyberpunkScene';
import { BambooSanctuaryScene } from './BambooSanctuary/BambooSanctuaryScene';
import { WeatherOverlay } from './WeatherOverlay';

let cachedStaticNoise: string | null = null;
function getStaticNoiseDataUrl(): string {
  if (cachedStaticNoise) return cachedStaticNoise;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const img = ctx.createImageData(64, 64);
      for (let i = 0; i < img.data.length; i += 4) {
        const val = Math.floor(Math.random() * 255);
        img.data[i] = val;
        img.data[i + 1] = val;
        img.data[i + 2] = val;
        img.data[i + 3] = 16;
      }
      ctx.putImageData(img, 0, 0);
      cachedStaticNoise = canvas.toDataURL('image/png');
      return cachedStaticNoise;
    }
  } catch {}
  return '';
}

export const SceneContainer: React.FC = () => {
  const { currentSceneId, settings } = useSceneStore();
  const { videoMode, isPlaying: isLofiPlaying } = useLofiStore();
  const { channels } = useAudioStore();

  const parallaxRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const activeSoundCount = Object.values(channels).filter(c => c.isPlaying).length;
  const isAudioActive = activeSoundCount > 0 || isLofiPlaying;
  const isVideoBackdrop = isLofiPlaying && videoMode === 'background';

  // Smooth mouse parallax with 0% idle GPU footprint & ZERO React re-renders
  useEffect(() => {
    if (!settings.parallax3D || settings.lowPerformanceMode) {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = 'none';
      }
      return;
    }

    let rafId: number | null = null;
    let targetX = 0.5;
    let targetY = 0.5;
    let currX = 0.5;
    let currY = 0.5;
    let isRunning = false;

    const update = () => {
      currX += (targetX - currX) * 0.1;
      currY += (targetY - currY) * 0.1;

      const tiltX = (currX - 0.5) * 2.4;
      const tiltY = (currY - 0.5) * -2.4;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `rotateY(${tiltX.toFixed(2)}deg) rotateX(${tiltY.toFixed(2)}deg) scale(1.015)`;
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(circle 500px at ${(currX * 100).toFixed(1)}% ${(currY * 100).toFixed(1)}%, rgba(255, 255, 255, 0.035), transparent 75%)`;
      }

      // Check if settled to stop RAF loop and enter 0% GPU sleep
      if (Math.abs(currX - targetX) < 0.0005 && Math.abs(currY - targetY) < 0.0005) {
        isRunning = false;
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(update);
    };

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [settings.parallax3D, settings.lowPerformanceMode]);

  // Color Grade Filter Mapping - Returns undefined for standard to avoid GPU offscreen textures
  const getColorGradeFilter = (grade: ColorGrade | undefined, brightness: number): string | undefined => {
    if ((!grade || grade === 'standard') && brightness === 1.0) {
      return undefined;
    }

    switch (grade) {
      case 'warm-sunset':
        return `brightness(${brightness * 1.05}) sepia(0.22) saturate(1.25) hue-rotate(-12deg)`;
      case 'cool-midnight':
        return `brightness(${brightness * 0.95}) saturate(0.9) hue-rotate(185deg) contrast(1.05)`;
      case 'cyber-neon':
        return `brightness(${brightness * 1.05}) saturate(1.4) contrast(1.15) hue-rotate(265deg)`;
      case 'noir':
        return `brightness(${brightness * 1.1}) grayscale(1) contrast(1.25)`;
      default:
        return brightness !== 1.0 ? `brightness(${brightness})` : undefined;
    }
  };

  const filterStyle = getColorGradeFilter(settings.colorGrade, settings.brightness);

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${
        isVideoBackdrop ? 'opacity-30' : 'opacity-100'
      }`}
      style={{
        filter: filterStyle,
        perspective: settings.parallax3D && !settings.lowPerformanceMode ? '1200px' : undefined,
      }}
      aria-hidden="true"
    >
      {/* 3D Parallax Canvas Wrapper */}
      <div
        ref={parallaxRef}
        className="w-full h-full relative will-change-transform"
        style={{ transform: 'none' }}
      >
        {/* 1. Rainy Night */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'rainy-night' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'rainy-night' && <RainyNightScene />}
        </div>

        {/* 2. Forest Retreat */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'forest-retreat' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'forest-retreat' && <ForestRetreatScene />}
        </div>

        {/* 3. Ocean Sunset */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'ocean-sunset' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'ocean-sunset' && <OceanSunsetScene />}
        </div>

        {/* 4. Cozy Fireplace */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'cozy-fireplace' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'cozy-fireplace' && <CozyFireplaceScene />}
        </div>

        {/* 5. Cosmic Dream */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'cosmic-dream' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'cosmic-dream' && <CosmicDreamScene />}
        </div>

        {/* 6. Cherry Blossom Shrine */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'cherry-blossom' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'cherry-blossom' && <CherryBlossomScene />}
        </div>

        {/* 7. Cozy Cafe */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'cozy-cafe' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'cozy-cafe' && <CozyCafeScene />}
        </div>

        {/* 8. Snowy Aurora */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'snowy-aurora' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'snowy-aurora' && <SnowyAuroraScene />}
        </div>

        {/* 9. Neon Cyberpunk Tokyo */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'neon-cyberpunk' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'neon-cyberpunk' && <NeonCyberpunkScene />}
        </div>

        {/* 10. Arashiyama Bamboo Grove */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSceneId === 'bamboo-sanctuary' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {currentSceneId === 'bamboo-sanctuary' && <BambooSanctuaryScene />}
        </div>

        {/* Dynamic Universal Weather Overlay */}
        <WeatherOverlay />
      </div>

      {/* Ultra Max Setting Cinema Bloom Glow */}
      {settings.bloomGlow && !settings.lowPerformanceMode && (
        <div
          className="absolute inset-0 pointer-events-none z-14 mix-blend-screen opacity-35"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(254, 240, 138, 0.08), rgba(56, 189, 248, 0.05) 50%, transparent 80%)',
          }}
        />
      )}

      {/* Dynamic Cursor Spotlight Effect */}
      {settings.parallax3D && !settings.lowPerformanceMode && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-15 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle 500px at 50% 50%, rgba(255, 255, 255, 0.035), transparent 75%)',
          }}
        />
      )}

      {/* Audio-Reactive Breathing Pulse Vignette */}
      {isAudioActive && !settings.lowPerformanceMode && (
        <div
          className="absolute inset-0 pointer-events-none z-18 animate-pulse-subtle"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 65%, rgba(56, 189, 248, 0.06) 100%)',
          }}
        />
      )}

      {/* Vignette & Scene Overlay Darkening Filter */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-20"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${settings.overlayOpacity})`,
          backgroundImage:
            'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />

      {/* Lightweight Static Film Grain Overlay (0% GPU) */}
      {settings.filmGrain && !settings.lowPerformanceMode && (
        <div
          className="absolute inset-0 pointer-events-none z-30 opacity-40"
          style={{
            backgroundImage: `url(${getStaticNoiseDataUrl()})`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}
    </div>
  );
};
