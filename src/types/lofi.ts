export type VideoMode = 'hidden' | 'pip' | 'background';
export type PipSize = 'small' | 'medium' | 'large';

export interface VideoSettings {
  opacity: number; // 0.1 to 1.0 (default 0.85)
  blur: number; // 0 to 12 in px (default 0)
  showNativeControls: boolean; // controls=1 vs controls=0 (shows YouTube seek/scrub bar)
  muteVideoAudio: boolean; // mute=1 vs mute=0 (audio only from ambient or lofi)
  pipSize: PipSize; // small, medium, large
}

export interface LofiStation {
  id: string;
  title: string;
  titleVi: string;
  artist: string;
  badge: string;
  youtubeId: string;
  thumbnail: string;
  isStudyWithMe?: boolean;
}

export interface LofiState {
  currentStationId: string;
  isPlaying: boolean;
  volume: number; // 0 to 1
  stations: LofiStation[];
  customYoutubeId: string | null;
  videoMode: VideoMode;
  videoSettings: VideoSettings;
}
