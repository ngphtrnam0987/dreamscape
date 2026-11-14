import { describe, it, expect } from 'vitest';
import { useLofiStore, extractYoutubeId, DEFAULT_LOFI_STATIONS } from '../stores/useLofiStore';

describe('useLofiStore', () => {
  it('extracts YouTube IDs correctly from diverse URL formats', () => {
    expect(extractYoutubeId('jfKfPHzGYj8')).toBe('jfKfPHzGYj8');
    expect(extractYoutubeId('https://www.youtube.com/watch?v=jfKfPHzGYj8')).toBe('jfKfPHzGYj8');
    expect(extractYoutubeId('https://youtu.be/jfKfPHzGYj8')).toBe('jfKfPHzGYj8');
    expect(extractYoutubeId('https://www.youtube.com/live/jfKfPHzGYj8')).toBe('jfKfPHzGYj8');
    expect(extractYoutubeId('invalid link')).toBeNull();
  });

  it('contains Lofi Girl 24/7 radio stations', () => {
    expect(DEFAULT_LOFI_STATIONS.length).toBeGreaterThanOrEqual(4);
    const ids = DEFAULT_LOFI_STATIONS.map(s => s.youtubeId);
    expect(ids).toContain('jfKfPHzGYj8'); // Lofi Girl Study
    expect(ids).toContain('rUxyKA_-Mg4'); // Lofi Girl Sleep
  });

  it('switches stations and manages playback state', () => {
    const store = useLofiStore.getState();
    store.setStation('lofi-sleep');

    expect(useLofiStore.getState().currentStationId).toBe('lofi-sleep');
    expect(useLofiStore.getState().isPlaying).toBe(true);

    store.togglePlay();
    expect(useLofiStore.getState().isPlaying).toBe(false);
  });

  it('loads custom YouTube stream URLs', () => {
    const store = useLofiStore.getState();
    const ok = store.setCustomYoutubeUrl('https://www.youtube.com/watch?v=5yx6BWlEVcY');

    expect(ok).toBe(true);
    expect(useLofiStore.getState().customYoutubeId).toBe('5yx6BWlEVcY');
    expect(useLofiStore.getState().isPlaying).toBe(true);
  });

  it('manages video appearance and native seek bar settings', () => {
    const store = useLofiStore.getState();

    // Default settings
    expect(store.videoSettings.opacity).toBe(0.85);
    expect(store.videoSettings.showNativeControls).toBe(true);

    // Update opacity and blur
    store.updateVideoSettings({ opacity: 0.5, blur: 4 });
    expect(useLofiStore.getState().videoSettings.opacity).toBe(0.5);
    expect(useLofiStore.getState().videoSettings.blur).toBe(4);

    // PiP Size
    store.setPipSize('large');
    expect(useLofiStore.getState().videoSettings.pipSize).toBe('large');

    // Toggle native seek controls
    store.toggleNativeControls();
    expect(useLofiStore.getState().videoSettings.showNativeControls).toBe(false);

    // Toggle mute video audio
    store.toggleMuteVideoAudio();
    expect(useLofiStore.getState().videoSettings.muteVideoAudio).toBe(true);
  });
});
