import React from 'react';
import { useSceneStore } from '../stores/useSceneStore';
import { useLofiStore } from '../stores/useLofiStore';
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
  const { videoMode, isPlaying } = useLofiStore();

  const isVideoBackdrop = isPlaying && videoMode === 'background';

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden select-none transition-[filter] duration-500 pointer-events-none ${
        isVideoBackdrop ? 'opacity-30' : 'opacity-100'
      }`}
      style={{
        filter: `brightness(${settings.brightness})`,
      }}
      aria-hidden="true"
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

      {/* Vignette & Scene Overlay Darkening Filter */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-20"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${settings.overlayOpacity})`,
          backgroundImage:
            'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
    </div>
  );
};
