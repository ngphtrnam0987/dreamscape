import { ChannelId } from './audio';
import { SceneId, SceneSpecificSettings } from './scene';

export interface SoundPreset {
  id: string;
  name: string;
  sceneId: SceneId;
  isDefault?: boolean;
  channelStates: Record<ChannelId, { volume: number; isPlaying: boolean }>;
  sceneSpecificSettings?: SceneSpecificSettings;
  createdAt: number;
}
