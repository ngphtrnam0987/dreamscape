export type SceneId = 
  | 'rainy-night' 
  | 'forest-retreat' 
  | 'ocean-sunset' 
  | 'cozy-fireplace' 
  | 'cosmic-dream'
  | 'cherry-blossom'
  | 'cozy-cafe'
  | 'snowy-aurora'
  | 'neon-cyberpunk'
  | 'bamboo-sanctuary';

export interface SceneSpecificSettings {
  // Rainy Night
  rainIntensity?: number; // 0.2 - 2.0
  lightningEnabled?: boolean;
  
  // Forest Retreat
  fogIntensity?: number; // 0.2 - 2.0
  lightRaysEnabled?: boolean;

  // Ocean Sunset
  waveIntensity?: number; // 0.2 - 2.0
  sunsetBrightness?: number; // 0.5 - 1.5

  // Cozy Fireplace
  fireIntensity?: number; // 0.2 - 2.0
  embersEnabled?: boolean;
  windowRainEnabled?: boolean;

  // Cosmic Dream
  starDensity?: number; // 0.2 - 2.0
  cameraDriftEnabled?: boolean;
  nebulaGlow?: number; // 0.2 - 2.0

  // Cherry Blossom
  petalDensity?: number; // 0.2 - 2.0
  windBreeze?: number; // 0.2 - 2.0

  // Cozy Cafe
  cafeLighting?: number; // 0.5 - 1.5
  steamIntensity?: number; // 0.2 - 2.0
  windowRain?: boolean;

  // Snowy Aurora
  snowIntensity?: number; // 0.2 - 2.0
  auroraSpeed?: number; // 0.2 - 2.0
  auroraGlow?: number; // 0.5 - 1.5

  // Neon Cyberpunk
  neonGlow?: number; // 0.5 - 1.5
  cyberRainIntensity?: number; // 0.2 - 2.0
  hologramFlicker?: boolean;

  // Bamboo Sanctuary
  fireflyDensity?: number; // 0.2 - 2.0
  bambooSway?: number; // 0.2 - 2.0
  mistDensity?: number; // 0.2 - 2.0
}

export interface SceneSettings {
  brightness: number; // 0.3 - 1.5
  overlayOpacity: number; // 0 - 0.7
  animationIntensity: number; // 0.2 - 2.0
  particleDensity: number; // 0.2 - 2.0
  lowPerformanceMode: boolean;
  specific: Record<SceneId, SceneSpecificSettings>;
}

export interface SceneInfo {
  id: SceneId;
  name: string;
  nameVi: string;
  subtitle: string;
  subtitleVi: string;
  badge: string;
  accentColor: string;
  themeGradient: string;
  defaultChannels: Array<{ id: string; volume: number }>;
}
