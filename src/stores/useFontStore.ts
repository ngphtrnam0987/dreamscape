import { create } from 'zustand';
import { FontId, CustomFontMeta, PRESET_FONTS } from '../types/font';
import {
  saveCustomFontToDb,
  loadCustomFontFromDb,
  deleteCustomFontFromDb,
  registerCustomFontFace,
  applyFontToDom,
} from '../utils/fontStorage';

interface FontState {
  currentFontId: FontId;
  customFontMeta: CustomFontMeta | null;
  fontScale: number;
  isLoading: boolean;
  error: string | null;

  setFont: (fontId: FontId) => Promise<void>;
  setFontScale: (scale: number) => void;
  uploadCustomFont: (file: File) => Promise<{ success: boolean; error?: string }>;
  removeCustomFont: () => Promise<void>;
  initFont: () => Promise<void>;
}

const STORAGE_ACTIVE_FONT = 'dreamscape_active_font';
const STORAGE_FONT_SCALE = 'dreamscape_font_scale';
const CUSTOM_FONT_FAMILY_NAME = 'DreamscapeCustomFont';

function getStoredFontId(): FontId {
  try {
    const val = localStorage.getItem(STORAGE_ACTIVE_FONT) as FontId | null;
    if (val) return val;
  } catch {}
  return 'inter';
}

function getStoredFontScale(): number {
  try {
    const val = localStorage.getItem(STORAGE_FONT_SCALE);
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 85 && num <= 125) return num;
    }
  } catch {}
  return 100;
}

export const useFontStore = create<FontState>((set, get) => ({
  currentFontId: getStoredFontId(),
  customFontMeta: null,
  fontScale: getStoredFontScale(),
  isLoading: false,
  error: null,

  initFont: async () => {
    const { currentFontId, fontScale } = get();

    // Check if custom font is stored in IndexedDB
    try {
      const customRecord = await loadCustomFontFromDb();
      if (customRecord) {
        set({ customFontMeta: customRecord.meta });

        if (currentFontId === 'custom') {
          const registered = await registerCustomFontFace(
            CUSTOM_FONT_FAMILY_NAME,
            customRecord.buffer
          );
          if (registered) {
            applyFontToDom(`'${CUSTOM_FONT_FAMILY_NAME}', sans-serif`, fontScale);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load custom font on init:', e);
    }

    // Fallback to selected preset font
    const preset = PRESET_FONTS.find((f) => f.id === currentFontId) || PRESET_FONTS[0];
    applyFontToDom(preset.fontFamily, fontScale);
  },

  setFont: async (fontId: FontId) => {
    const { customFontMeta, fontScale } = get();
    set({ isLoading: true, error: null });

    try {
      if (fontId === 'custom') {
        if (!customFontMeta) {
          throw new Error('No custom font uploaded yet');
        }

        const customRecord = await loadCustomFontFromDb();
        if (!customRecord) {
          throw new Error('Custom font file could not be found');
        }

        await registerCustomFontFace(CUSTOM_FONT_FAMILY_NAME, customRecord.buffer);
        applyFontToDom(`'${CUSTOM_FONT_FAMILY_NAME}', sans-serif`, fontScale);
      } else {
        const preset = PRESET_FONTS.find((f) => f.id === fontId);
        if (preset) {
          applyFontToDom(preset.fontFamily, fontScale);
        }
      }

      set({ currentFontId: fontId, isLoading: false });
      try {
        localStorage.setItem(STORAGE_ACTIVE_FONT, fontId);
      } catch {}
    } catch (err: any) {
      console.error('Error switching font:', err);
      set({ error: err?.message || 'Failed to apply font', isLoading: false });
    }
  },

  setFontScale: (scale: number) => {
    const clamped = Math.max(85, Math.min(125, scale));
    set({ fontScale: clamped });
    try {
      localStorage.setItem(STORAGE_FONT_SCALE, clamped.toString());
    } catch {}

    const { currentFontId, customFontMeta } = get();
    if (currentFontId === 'custom' && customFontMeta) {
      applyFontToDom(`'${CUSTOM_FONT_FAMILY_NAME}', sans-serif`, clamped);
    } else {
      const preset = PRESET_FONTS.find((f) => f.id === currentFontId) || PRESET_FONTS[0];
      applyFontToDom(preset.fontFamily, clamped);
    }
  },

  uploadCustomFont: async (file: File) => {
    // Validate file type
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      const msg = 'Unsupported font file format. Please upload .ttf, .otf, .woff, or .woff2';
      set({ error: msg });
      return { success: false, error: msg };
    }

    // Limit font file size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      const msg = 'Font file is too large (max 15MB).';
      set({ error: msg });
      return { success: false, error: msg };
    }

    set({ isLoading: true, error: null });

    try {
      const buffer = await file.arrayBuffer();
      const meta: CustomFontMeta = {
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: Date.now(),
        format: file.name.split('.').pop()?.toUpperCase() || 'TTF',
      };

      // Test load font before storing
      const registered = await registerCustomFontFace(CUSTOM_FONT_FAMILY_NAME, buffer);
      if (!registered) {
        throw new Error('Browser could not parse this font file. Please ensure it is a valid font.');
      }

      // Persist in IndexedDB
      await saveCustomFontToDb(buffer, meta);

      // Apply immediately
      applyFontToDom(`'${CUSTOM_FONT_FAMILY_NAME}', sans-serif`, get().fontScale);

      set({
        customFontMeta: meta,
        currentFontId: 'custom',
        isLoading: false,
        error: null,
      });

      try {
        localStorage.setItem(STORAGE_ACTIVE_FONT, 'custom');
      } catch {}

      return { success: true };
    } catch (err: any) {
      console.error('Failed to upload custom font:', err);
      const msg = err?.message || 'Failed to read or load custom font';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  removeCustomFont: async () => {
    try {
      await deleteCustomFontFromDb();
      set({ customFontMeta: null });

      // If custom font was active, fall back to Inter
      if (get().currentFontId === 'custom') {
        await get().setFont('inter');
      }
    } catch (err) {
      console.error('Failed to remove custom font:', err);
    }
  },
}));
