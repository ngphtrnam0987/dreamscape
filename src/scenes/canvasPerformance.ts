/**
 * DreamScape Canvas Performance & Frame Pacer Helper
 * Throttles requestAnimationFrame drawing to target FPS:
 * - 30 FPS in Eco Saver mode (ultra-low CPU/GPU consumption < 1-3%)
 * - 60 FPS in Balanced mode (standard buttery-smooth)
 * - 120 FPS in Ultra Max Setting (native high-refresh display cinema quality)
 * Pauses rendering completely when the tab is hidden (0% GPU).
 */

import { useSceneStore } from '../stores/useSceneStore';

export interface FramePacer {
  /**
   * Returns true if enough time has elapsed to render the next frame.
   */
  shouldRender: (timestamp: number) => boolean;
}

export function createFramePacer(targetFps: number | (() => number) = 50): FramePacer {
  let lastFrameTime = 0;

  return {
    shouldRender: (timestamp: number): boolean => {
      // Pause completely if tab is minimized or hidden (0% GPU sleep)
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return false;
      }

      const currentFps = typeof targetFps === 'function' ? targetFps() : targetFps;
      const minInterval = 1000 / (currentFps > 0 ? currentFps : 50);

      if (!lastFrameTime) {
        lastFrameTime = timestamp;
        return true;
      }

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < minInterval) {
        return false;
      }

      // Maintain consistent rhythm without drifting
      lastFrameTime = timestamp - (elapsed % minInterval);
      return true;
    },
  };
}

/**
 * Convenience pacer for scenes that automatically respects the active
 * Graphics Quality tier (30 FPS Eco, 60 FPS Balanced, 120 FPS Ultra).
 */
export function createSceneFramePacer(): FramePacer {
  return createFramePacer(() => {
    try {
      const { settings } = useSceneStore.getState();
      if (settings.lowPerformanceMode || settings.graphicsQuality === 'eco') {
        return 30;
      }
      return settings.fpsTarget || 60;
    } catch {
      return 60;
    }
  });
}
