export interface LofiStation {
  id: string;
  title: string;
  titleVi: string;
  artist: string;
  badge: string;
  youtubeId: string;
  thumbnail: string;
}

export interface LofiState {
  currentStationId: string;
  isPlaying: boolean;
  volume: number; // 0 to 1
  stations: LofiStation[];
  customYoutubeId: string | null;
  showPlayerModal: boolean;
}
