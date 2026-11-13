import { create } from 'zustand';
import { LofiStation } from '../types/lofi';

export const DEFAULT_LOFI_STATIONS: LofiStation[] = [
  {
    id: 'lofi-study',
    title: 'Lofi Girl — Beats to Relax/Study to',
    titleVi: 'Lofi Girl — Nhạc Thư Giãn & Học Tập 24/7',
    artist: 'Lofi Girl',
    badge: '24/7 Live Stream',
    youtubeId: 'jfKfPHzGYj8',
    thumbnail: 'https://img.youtube.com/vi/jfKfPHzGYj8/hqdefault.jpg',
  },
  {
    id: 'lofi-sleep',
    title: 'Lofi Girl — Beats to Sleep/Chill to',
    titleVi: 'Lofi Girl — Nhạc Ngủ Ngon & Chill Đêm',
    artist: 'Lofi Girl',
    badge: 'Sleep Radio',
    youtubeId: 'rUxyKA_-Mg4',
    thumbnail: 'https://img.youtube.com/vi/rUxyKA_-Mg4/hqdefault.jpg',
  },
  {
    id: 'lofi-cafe',
    title: 'Peaceful Coffee Shop Lofi Piano',
    titleVi: 'Góc Cà Phê Dương Cầm Lofi Êm Dịu',
    artist: 'ChillHop Cafe',
    badge: 'Acoustic Piano',
    youtubeId: '5yx6BWlEVcY',
    thumbnail: 'https://img.youtube.com/vi/5yx6BWlEVcY/hqdefault.jpg',
  },
  {
    id: 'lofi-synth',
    title: 'Synthwave Chill Radio — Chill Drive',
    titleVi: 'Synthwave Radio Lofi Hoàng Hôn',
    artist: 'Lofi Girl Records',
    badge: 'Retro Vibes',
    youtubeId: '4xDzrJKXOOY',
    thumbnail: 'https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg',
  },
];

interface LofiStoreState {
  currentStationId: string;
  isPlaying: boolean;
  volume: number;
  stations: LofiStation[];
  customYoutubeId: string | null;

  setStation: (stationId: string) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (vol: number) => void;
  setCustomYoutubeUrl: (urlOrId: string) => boolean;
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

function loadStoredLofi(): { currentStationId: string; volume: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentStationId: parsed.currentStationId || 'lofi-study',
        volume: typeof parsed.volume === 'number' ? parsed.volume : 0.75,
      };
    }
  } catch {}
  return { currentStationId: 'lofi-study', volume: 0.75 };
}

const initial = loadStoredLofi();

export const useLofiStore = create<LofiStoreState>((set, get) => ({
  currentStationId: initial.currentStationId,
  isPlaying: false,
  volume: initial.volume,
  stations: DEFAULT_LOFI_STATIONS,
  customYoutubeId: null,

  setStation: (stationId: string) => {
    set({ currentStationId: stationId, isPlaying: true, customYoutubeId: null });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStationId: stationId,
        volume: get().volume,
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
      }));
    } catch {}
  },

  setCustomYoutubeUrl: (input: string) => {
    const id = extractYoutubeId(input);
    if (!id) return false;

    const customStation: LofiStation = {
      id: 'custom-' + id,
      title: 'Custom YouTube Stream',
      titleVi: 'Luồng Nhạc YouTube Tùy Chọn',
      artist: 'YouTube Live',
      badge: 'Custom URL',
      youtubeId: id,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };

    set(state => ({
      stations: [customStation, ...state.stations.filter(s => s.id !== customStation.id)],
      currentStationId: customStation.id,
      customYoutubeId: id,
      isPlaying: true,
    }));

    return true;
  },

  getCurrentStation: () => {
    const { stations, currentStationId } = get();
    return stations.find(s => s.id === currentStationId) || stations[0];
  },
}));
