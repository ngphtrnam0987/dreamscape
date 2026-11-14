import { CustomFontMeta } from '../types/font';

const DB_NAME = 'dreamscape_fonts_db';
const DB_VERSION = 1;
const STORE_NAME = 'fonts';
const FONT_RECORD_KEY = 'active_custom_font';

function openFontDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomFontToDb(
  buffer: ArrayBuffer,
  meta: CustomFontMeta
): Promise<void> {
  const db = await openFontDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record = { buffer, meta };
    const req = store.put(record, FONT_RECORD_KEY);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function loadCustomFontFromDb(): Promise<{
  buffer: ArrayBuffer;
  meta: CustomFontMeta;
} | null> {
  try {
    const db = await openFontDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(FONT_RECORD_KEY);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function deleteCustomFontFromDb(): Promise<void> {
  try {
    const db = await openFontDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(FONT_RECORD_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}
}

let activeCustomFontFace: FontFace | null = null;

export async function registerCustomFontFace(
  fontName: string,
  buffer: ArrayBuffer
): Promise<boolean> {
  if (typeof FontFace === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    // Remove previous custom font face if present
    if (activeCustomFontFace) {
      document.fonts.delete(activeCustomFontFace);
    }

    const fontFace = new FontFace(fontName, buffer);
    const loaded = await fontFace.load();
    document.fonts.add(loaded);
    activeCustomFontFace = loaded;
    return true;
  } catch (err) {
    console.error('Failed to register custom FontFace:', err);
    return false;
  }
}

export function applyFontToDom(fontFamily: string, scale = 100): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--font-app', fontFamily);
  root.style.setProperty('--font-sans', fontFamily);
  root.style.setProperty('--font-scale', `${scale}%`);
  document.body.style.fontFamily = fontFamily;
}
