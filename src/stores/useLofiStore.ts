import { create } from 'zustand';
import { LofiStation, VideoMode, VideoSettings, PipSize } from '../types/lofi';

export const DEFAULT_LOFI_STATIONS: LofiStation[] = [
  // Study With Me Stations
  {
    id: 'study-lofi-desk',
    title: 'Lofi Girl Official Live Study Desk',
    titleVi: 'Bàn Học Lofi Girl 24/7 Trực Tuyến',
    artist: 'Lofi Girl',
    badge: 'Study With Me',
    youtubeId: 'jfKfPHzGYj8',
    thumbnail: 'https://img.youtube.com/vi/jfKfPHzGYj8/hqdefault.jpg',
    isStudyWithMe: true,
  },
  {
    id: 'study-rain-room',
    title: 'Rainy Room Study With Me (Pomodoro 50/10)',
    titleVi: 'Học Cùng Tôi Bên Cửa Sổ Mưa (Pomodoro 50/10)',
    artist: 'The Hanoi Study / Aesthetic Space',
    badge: 'Study With Me',
    youtubeId: 'M5n_xM4-h0E',
    thumbnail: 'https://img.youtube.com/vi/M5n_xM4-h0E/hqdefault.jpg',
    isStudyWithMe: true,
  },
  {
    id: 'study-vintage-library',
    title: 'Vintage Midnight Library — 3H Deep Study Session',
    titleVi: 'Thư Viện Cổ Điển Ban Đêm — 3 Giờ Học Sâu',
    artist: 'Calm Library Ambience',
    badge: 'Study With Me',
    youtubeId: 'Dx_t9t0t4Gg',
    thumbnail: 'https://img.youtube.com/vi/Dx_t9t0t4Gg/hqdefault.jpg',
    isStudyWithMe: true,
  },
  {
    id: 'study-seoul-cafe',
    title: 'Seoul Rain Cafe — Realtime Study & Work With Me',
    titleVi: 'Quán Cà Phê Mưa Seoul — Học & Làm Việc Cùng Tôi',
    artist: 'Cafe Study Vibes',
    badge: 'Study With Me',
    youtubeId: '8ZhnJmXGvJ4',
    thumbnail: 'https://img.youtube.com/vi/8ZhnJmXGvJ4/hqdefault.jpg',
    isStudyWithMe: true,
  },

  // Classic Lo-Fi Stations
  {
    id: 'lofi-sleep',
    title: 'Lofi Girl — Beats to Sleep/Chill to',
    titleVi: 'Lofi Girl — Nhạc Ngủ Ngon & Chill Đêm 24/7',
    artist: 'Lofi Girl',
    badge: 'Sleep Radio',
    youtubeId: 'rUxyKA_-Mg4',
    thumbnail: 'https://img.youtube.com/vi/rUxyKA_-Mg4/hqdefault.jpg',
    isStudyWithMe: false,
  },
  {
    id: 'lofi-cafe',
    title: 'Peaceful Coffee Shop Lofi Piano',
    titleVi: 'Góc Cà Phê Dương Cầm Lofi Êm Dịu',
    artist: 'ChillHop Cafe',
    badge: 'Acoustic Piano',
    youtubeId: '5yx6BWlEVcY',
    thumbnail: 'https://img.youtube.com/vi/5yx6BWlEVcY/hqdefault.jpg',
    isStudyWithMe: false,
  },
  {
    id: 'lofi-synth',
    title: 'Synthwave Chill Radio — Chill Drive',
    titleVi: 'Synthwave Radio Lofi Hoàng Hôn',
    artist: 'Lofi Girl Records',
    badge: 'Retro Vibes',
    youtubeId: '4xDzrJKXOOY',
    thumbnail: 'https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    isStudyWithMe: false,
  },
];

export const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  opacity: 0.85,
  blur: 0,
  showNativeControls: true,
  muteVideoAudio: false,
  pipSize: 'medium',
};

interface LofiStoreState {
  currentStationId: string;
  isPlaying: boolean;
  volume: number;
  stations: LofiStation[];
  customYoutubeId: string | null;
  videoMode: VideoMode;
  videoSettings: VideoSettings;

  setStation: (stationId: string) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (vol: number) => void;
  setVideoMode: (mode: VideoMode) => void;
  updateVideoSettings: (settings: Partial<VideoSettings>) => void;
  setPipSize: (size: PipSize) => void;
  toggleNativeControls: () => void;
  toggleMuteVideoAudio: () => void;
  setCustomYoutubeUrl: (urlOrId: string, isStudyWithMe?: boolean) => boolean;
  getCurrentStation: () => LofiStation;
}

export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // URLs
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.slice(1);
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.has('v')) {
        return url.searchParams.get('v');
      }
      if (url.pathname.startsWith('/live/')) {
        return url.pathname.replace('/live/', '');
      }
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.replace('/embed/', '');
      }
    }
  } catch {}

  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

const STORAGE_KEY = 'dreamscape_lofi_state';

function loadStoredLofi(): {
  currentStationId: string;
  volume: number;
  videoMode: VideoMode;
  videoSettings: VideoSettings;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentStationId: parsed.currentStationId || 'study-lofi-desk',
        volume: typeof parsed.volume === 'number' ? parsed.volume : 0.75,
        videoMode: parsed.videoMode || 'pip',
        videoSettings: {
          ...DEFAULT_VIDEO_SETTINGS,
          ...(parsed.videoSettings || {}),
        },
      };
    }
  } catch {}
  return {
    currentStationId: 'study-lofi-desk',
    volume: 0.75,
    videoMode: 'pip',
    videoSettings: DEFAULT_VIDEO_SETTINGS,
  };
}

const initial = loadStoredLofi();

export const useLofiStore = create<LofiStoreState>((set, get) => ({
  currentStationId: initial.currentStationId,
  isPlaying: false,
  volume: initial.volume,
  stations: DEFAULT_LOFI_STATIONS,
  customYoutubeId: null,
  videoMode: initial.videoMode,
  videoSettings: initial.videoSettings,

  setStation: (stationId: string) => {
    set({ currentStationId: stationId, isPlaying: true, customYoutubeId: null });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStationId: stationId,
        volume: get().volume,
        videoMode: get().videoMode,
        videoSettings: get().videoSettings,
      }));
    } catch {}
  },

  togglePlay: () => {
    set(state => ({ isPlaying: !state.isPlaying }));
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ volume: clamped });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStationId: get().currentStationId,
        volume: clamped,
        videoMode: get().videoMode,
        videoSettings: get().videoSettings,
      }));
    } catch {}
  },

  setVideoMode: (videoMode: VideoMode) => {
    set({ videoMode });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStationId: get().currentStationId,
        volume: get().volume,
        videoMode,
        videoSettings: get().videoSettings,
      }));
    } catch {}
  },

  updateVideoSettings: (partial: Partial<VideoSettings>) => {
    set(state => {
      const updated = { ...state.videoSettings, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          currentStationId: state.currentStationId,
          volume: state.volume,
          videoMode: state.videoMode,
          videoSettings: updated,
        }));
      } catch {}
      return { videoSettings: updated };
    });
  },

  setPipSize: (pipSize: PipSize) => {
    get().updateVideoSettings({ pipSize });
  },

  toggleNativeControls: () => {
    const current = get().videoSettings.showNativeControls;
    get().updateVideoSettings({ showNativeControls: !current });
  },

  toggleMuteVideoAudio: () => {
    const current = get().videoSettings.muteVideoAudio;
    get().updateVideoSettings({ muteVideoAudio: !current });
  },

  setCustomYoutubeUrl: (input: string, isStudyWithMe = true) => {
    const id = extractYoutubeId(input);
    if (!id) return false;

    const customStation: LofiStation = {
      id: 'custom-' + id,
      title: 'Custom YouTube Stream',
      titleVi: 'Luồng YouTube Tùy Chọn',
      artist: 'Custom Streamer',
      badge: isStudyWithMe ? 'Study With Me' : 'Custom URL',
      youtubeId: id,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      isStudyWithMe,
    };

    set(state => ({
      stations: [customStation, ...state.stations.filter(s => s.id !== customStation.id)],
      currentStationId: customStation.id,
      customYoutubeId: id,
      isPlaying: true,
      videoMode: isStudyWithMe ? 'pip' : state.videoMode,
    }));

    return true;
  },

  getCurrentStation: () => {
    const { stations, currentStationId } = get();
    return stations.find(s => s.id === currentStationId) || stations[0];
  },
}));
