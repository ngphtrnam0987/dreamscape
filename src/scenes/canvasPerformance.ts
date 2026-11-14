/**
 * DreamScape Canvas Performance & Frame Pacer Helper
 * Throttles requestAnimationFrame drawing to target FPS (50 FPS by default, or 30 FPS in Low Perf mode).
 * On high-refresh displays (120Hz/144Hz/165Hz/240Hz), this prevents the browser from repainting
 * complex Canvas paths 144+ times per second, drastically reducing GPU utilization.
 * Pauses rendering completely when the tab is hidden.
 */

export interface FramePacer {
  /**
   * Returns true if enough time has elapsed to render the next frame.
   */
  shouldRender: (timestamp: number) => boolean;
}

export function createFramePacer(targetFps = 50): FramePacer {
  const minInterval = 1000 / targetFps;
  let lastFrameTime = 0;

  return {
    shouldRender: (timestamp: number): boolean => {
      // Pause completely if tab is minimized or hidden
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return false;
      }

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
