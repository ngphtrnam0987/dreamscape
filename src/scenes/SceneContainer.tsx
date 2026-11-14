import React, { useState, useEffect } from 'react';
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

export const SceneContainer: React.FC = () => {
  const { currentSceneId, settings } = useSceneStore();
  const { videoMode, isPlaying: isLofiPlaying } = useLofiStore();
  const { channels } = useAudioStore();

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const activeSoundCount = Object.values(channels).filter(c => c.isPlaying).length;
  const isAudioActive = activeSoundCount > 0 || isLofiPlaying;
  const isVideoBackdrop = isLofiPlaying && videoMode === 'background';

  // Smooth mouse parallax listener
  useEffect(() => {
    if (!settings.parallax3D) return;

    let rafId: number;
    let targetX = 0.5;
    let targetY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Smooth lerp frame loop
    const update = () => {
      setMousePos(prev => ({
        x: prev.x + (targetX - prev.x) * 0.08,
        y: prev.y + (targetY - prev.y) * 0.08,
      }));
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [settings.parallax3D]);

  // Color Grade Filter Mapping
  const getColorGradeFilter = (grade: ColorGrade, brightness: number) => {
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
        return `brightness(${brightness})`;
    }
  };

  const tiltX = settings.parallax3D ? (mousePos.x - 0.5) * 3 : 0; // -1.5deg to +1.5deg
  const tiltY = settings.parallax3D ? (mousePos.y - 0.5) * -3 : 0;

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden select-none transition-[filter] duration-500 pointer-events-none ${
        isVideoBackdrop ? 'opacity-30' : 'opacity-100'
      }`}
      style={{
        filter: getColorGradeFilter(settings.colorGrade || 'standard', settings.brightness),
        perspective: '1200px',
      }}
      aria-hidden="true"
    >
      {/* 3D Parallax Canvas Wrapper */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: settings.parallax3D
            ? `rotateY(${tiltX.toFixed(2)}deg) rotateX(${tiltY.toFixed(2)}deg) scale(1.025)`
            : 'none',
        }}
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
      </div>

      {/* Dynamic Cursor Spotlight Effect */}
      {settings.parallax3D && (
        <div
          className="absolute inset-0 pointer-events-none z-15 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 500px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 255, 255, 0.035), transparent 75%)`,
          }}
        />
      )}

      {/* Audio-Reactive Breathing Pulse Vignette */}
      {isAudioActive && (
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

      {/* Cinematic Film Grain Overlay */}
      {settings.filmGrain && (
        <div
          className="absolute inset-0 pointer-events-none z-30 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
};
