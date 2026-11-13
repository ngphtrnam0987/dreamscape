import { create } from 'zustand';
import { Language } from '../locales';

export type ModalType = 'scenes' | 'mixer' | 'timer' | 'presets' | 'settings' | 'stats' | 'breathe' | 'notes' | 'lofi';

interface UIStoreState {
  activeModal: ModalType | null;
  isFocusMode: boolean;
  isFullscreen: boolean;
  language: Language;
  toastMessage: string | null;

  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  toggleModal: (modal: ModalType) => void;
  toggleFocusMode: () => void;
  setFocusMode: (val: boolean) => void;
  toggleFullscreen: () => void;
  setFullscreen: (val: boolean) => void;
  setLanguage: (lang: Language) => void;
  showToast: (msg: string, durationMs?: number) => void;
}

const STORAGE_LANG_KEY = 'dreamscape_language';

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'vi' || saved === 'en') return saved;
  } catch {}
  return 'en';
}

export const useUIStore = create<UIStoreState>((set, get) => ({
  activeModal: null,
  isFocusMode: false,
  isFullscreen: false,
  language: getInitialLanguage(),
  toastMessage: null,

  openModal: (modal: ModalType) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleModal: (modal: ModalType) => {
    set(state => ({
      activeModal: state.activeModal === modal ? null : modal,
    }));
  },

  toggleFocusMode: () => {
    set(state => ({ isFocusMode: !state.isFocusMode, activeModal: null }));
  },

  setFocusMode: (val: boolean) => {
    set({ isFocusMode: val, activeModal: val ? null : get().activeModal });
  },

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      set({ isFullscreen: false });
    }
  },

  setFullscreen: (val: boolean) => set({ isFullscreen: val }),

  setLanguage: (lang: Language) => {
    set({ language: lang });
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {}
  },

  showToast: (msg: string, durationMs = 3000) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, durationMs);
  },
}));
