import { create } from 'zustand';
import { SceneId, SceneSettings, SceneSpecificSettings, SceneInfo } from '../types/scene';

export const SCENES_INFO: SceneInfo[] = [
  {
    id: 'rainy-night',
    name: 'Rainy Night',
    nameVi: 'Đêm Mưa Yên Tĩnh',
    subtitle: 'Nocturnal metropolis sanctuary',
    subtitleVi: 'Căn phòng ấm áp nhìn ra mưa đêm',
    badge: 'Cozy & Ambient',
    accentColor: '#38bdf8',
    themeGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    defaultChannels: [{ id: 'rain', volume: 0.7 }, { id: 'wind', volume: 0.35 }],
  },
  {
    id: 'forest-retreat',
    name: 'Forest Retreat',
    nameVi: 'Rừng Xanh Tĩnh Lặng',
    subtitle: 'Sun-dappled canopy & gentle stream',
    subtitleVi: 'Nắng luồn qua tán lá mờ sương',
    badge: 'Organic & Refreshing',
    accentColor: '#4ade80',
    themeGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    defaultChannels: [{ id: 'birds', volume: 0.5 }, { id: 'stream', volume: 0.6 }, { id: 'forest', volume: 0.45 }],
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    nameVi: 'Hoàng Hôn Biển Vắng',
    subtitle: 'Golden hour surf & coastal breeze',
    subtitleVi: 'Sóng vỗ bờ cát vàng hoàng hôn',
    badge: 'Serene & Warm',
    accentColor: '#fb923c',
    themeGradient: 'from-orange-950 via-slate-950 to-cyan-950',
    defaultChannels: [{ id: 'ocean-waves', volume: 0.75 }, { id: 'wind', volume: 0.35 }],
  },
  {
    id: 'cozy-fireplace',
    name: 'Cozy Fireplace',
    nameVi: 'Bên Lò Sưởi Ấm',
    subtitle: 'Mountain hearth on a winter eve',
    subtitleVi: 'Lửa bập bùng trong nhà gỗ',
    badge: 'Intimate & Warming',
    accentColor: '#f97316',
    themeGradient: 'from-amber-950 via-stone-950 to-zinc-950',
    defaultChannels: [{ id: 'fire', volume: 0.75 }, { id: 'rain', volume: 0.4 }],
  },
  {
    id: 'cosmic-dream',
    name: 'Cosmic Dream',
    nameVi: 'Giấc Mơ Vũ Trụ',
    subtitle: 'Floating starfield & ethereal nebulae',
    subtitleVi: 'Dải ngân hà lấp lánh huyền ảo',
    badge: 'Deep & Hypnotic',
    accentColor: '#c084fc',
    themeGradient: 'from-purple-950 via-slate-950 to-violet-950',
    defaultChannels: [{ id: 'cosmic', volume: 0.5 }, { id: 'rain', volume: 0.25 }],
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom Shrine',
    nameVi: 'Đền Hoa Anh Đào',
    subtitle: 'Kyoto garden with drifting sakura petals',
    subtitleVi: 'Vườn thiền Kyoto ngập tràn cánh hoa anh đào',
    badge: 'Zen & Peaceful',
    accentColor: '#f472b6',
    themeGradient: 'from-pink-950 via-slate-950 to-rose-950',
    defaultChannels: [{ id: 'wind', volume: 0.45 }, { id: 'birds', volume: 0.35 }],
  },
  {
    id: 'cozy-cafe',
    name: 'Cozy Rainy Cafe',
    nameVi: 'Quán Cà Phê Mưa',
    subtitle: 'Warm coffee aroma & rain on glass',
    subtitleVi: 'Góc cà phê ấm áp ngắm mưa rơi',
    badge: 'Lofi & Mellow',
    accentColor: '#d97706',
    themeGradient: 'from-amber-950 via-stone-950 to-orange-950',
    defaultChannels: [{ id: 'rain', volume: 0.65 }, { id: 'city', volume: 0.3 }],
  },
  {
    id: 'snowy-aurora',
    name: 'Snowy Aurora',
    nameVi: 'Cực Quang Tuyết Trắng',
    subtitle: 'Dancing northern lights over arctic peaks',
    subtitleVi: 'Cực quang huyền ảo trên đỉnh núi tuyết',
    badge: 'Magical & Ethereal',
    accentColor: '#2dd4bf',
    themeGradient: 'from-teal-950 via-slate-950 to-cyan-950',
    defaultChannels: [{ id: 'wind', volume: 0.5 }, { id: 'cosmic', volume: 0.4 }],
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Tokyo Rain',
    nameVi: 'Phố Đêm Tokyo Mưa',
    subtitle: 'Futuristic neon alleys & glistening wet asphalt',
    subtitleVi: 'Hẻm phố Tokyo ngập tràn ánh đèn neon huyền ảo',
    badge: 'Vibrant & Cinematic',
    accentColor: '#06b6d4',
    themeGradient: 'from-cyan-950 via-fuchsia-950 to-slate-950',
    defaultChannels: [{ id: 'rain', volume: 0.7 }, { id: 'city', volume: 0.55 }, { id: 'cosmic', volume: 0.3 }],
  },
  {
    id: 'bamboo-sanctuary',
    name: 'Arashiyama Bamboo Grove',
    nameVi: 'Rừng Trúc & Đom Đóm',
    subtitle: 'Whispering bamboo forest & glowing fireflies',
    subtitleVi: 'Rừng trúc Arashiyama lung linh hàng vạn đom đóm',
    badge: 'Mystical & Serene',
    accentColor: '#84cc16',
    themeGradient: 'from-lime-950 via-emerald-950 to-slate-950',
    defaultChannels: [{ id: 'wind', volume: 0.4 }, { id: 'insects', volume: 0.6 }, { id: 'forest', volume: 0.45 }],
  },
];

const DEFAULT_SETTINGS: SceneSettings = {
  brightness: 1.0,
  overlayOpacity: 0.2,
  animationIntensity: 1.0,
  particleDensity: 1.0,
  lowPerformanceMode: false,
  colorGrade: 'standard',
  filmGrain: false,
  parallax3D: false,
  ambientCursor: true,
  uiSounds: true,
  specific: {
    'rainy-night': { rainIntensity: 1.0, lightningEnabled: true },
    'forest-retreat': { fogIntensity: 1.0, lightRaysEnabled: true },
    'ocean-sunset': { waveIntensity: 1.0, sunsetBrightness: 1.0 },
    'cozy-fireplace': { fireIntensity: 1.0, embersEnabled: true, windowRainEnabled: true },
    'cosmic-dream': { starDensity: 1.0, cameraDriftEnabled: true, nebulaGlow: 1.0 },
    'cherry-blossom': { petalDensity: 1.0, windBreeze: 1.0 },
    'cozy-cafe': { cafeLighting: 1.0, steamIntensity: 1.0, windowRain: true },
    'snowy-aurora': { snowIntensity: 1.0, auroraSpeed: 1.0, auroraGlow: 1.0 },
    'neon-cyberpunk': { neonGlow: 1.0, cyberRainIntensity: 1.0, hologramFlicker: true },
    'bamboo-sanctuary': { fireflyDensity: 1.0, bambooSway: 1.0, mistDensity: 1.0 },
  },
};

interface SceneState {
  currentSceneId: SceneId;
  settings: SceneSettings;
  setScene: (sceneId: SceneId) => void;
  nextScene: () => void;
  previousScene: () => void;
  updateSettings: (partial: Partial<SceneSettings>) => void;
  updateSpecificSettings: (sceneId: SceneId, partial: SceneSpecificSettings) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'dreamscape_scene_config';

function loadStoredConfig(): { currentSceneId: SceneId; settings: SceneSettings } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentSceneId: parsed.currentSceneId || 'rainy-night',
        settings: {
          ...DEFAULT_SETTINGS,
          ...parsed.settings,
          specific: {
            ...DEFAULT_SETTINGS.specific,
            ...(parsed.settings?.specific || {}),
          },
        },
      };
    }
  } catch {}
  return { currentSceneId: 'rainy-night', settings: DEFAULT_SETTINGS };
}

const initial = loadStoredConfig();

export const useSceneStore = create<SceneState>((set, get) => ({
  currentSceneId: initial.currentSceneId,
  settings: initial.settings,

  setScene: (sceneId: SceneId) => {
    set({ currentSceneId: sceneId });
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentSceneId: sceneId, settings: get().settings })
      );
    } catch {}
  },

  nextScene: () => {
    const { currentSceneId, setScene } = get();
    const currentIndex = SCENES_INFO.findIndex(s => s.id === currentSceneId);
    const nextIndex = (currentIndex + 1) % SCENES_INFO.length;
    setScene(SCENES_INFO[nextIndex].id);
  },

  previousScene: () => {
    const { currentSceneId, setScene } = get();
    const currentIndex = SCENES_INFO.findIndex(s => s.id === currentSceneId);
    const prevIndex = (currentIndex - 1 + SCENES_INFO.length) % SCENES_INFO.length;
    setScene(SCENES_INFO[prevIndex].id);
  },

  updateSettings: (partial) => {
    set(state => {
      const newSettings = { ...state.settings, ...partial };
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ currentSceneId: state.currentSceneId, settings: newSettings })
        );
      } catch {}
      return { settings: newSettings };
    });
  },

  updateSpecificSettings: (sceneId, partial) => {
    set(state => {
      const currentSpec = state.settings.specific[sceneId] || {};
      const newSpecific = {
        ...state.settings.specific,
        [sceneId]: { ...currentSpec, ...partial },
      };
      const newSettings = { ...state.settings, specific: newSpecific };
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ currentSceneId: state.currentSceneId, settings: newSettings })
        );
      } catch {}
      return { settings: newSettings };
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentSceneId: get().currentSceneId, settings: DEFAULT_SETTINGS })
      );
    } catch {}
  },
}));
