import { useEffect } from 'react';
import { usePresetStore } from '../stores/usePresetStore';
import { useUIStore } from '../stores/useUIStore';

export function useSharedPresetLoader() {
  const { importPresetFromUrl, loadPreset } = usePresetStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedPreset = urlParams.get('preset');

      if (encodedPreset) {
        const preset = importPresetFromUrl(encodedPreset);
        if (preset) {
          loadPreset(preset);
          showToast(`Applied shared preset: ${preset.name}`);
        }

        // Clean query parameter from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      console.warn('Could not parse URL preset parameter:', e);
    }
  }, [importPresetFromUrl, loadPreset, showToast]);
}
