import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFontStore } from '../stores/useFontStore';
import { PRESET_FONTS } from '../types/font';

describe('useFontStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFontStore.setState({
      currentFontId: 'inter',
      customFontMeta: null,
      fontScale: 100,
      isLoading: false,
      error: null,
    });
  });

  it('initializes with default font Inter at 100% scale', () => {
    const { currentFontId, fontScale } = useFontStore.getState();
    expect(currentFontId).toBe('inter');
    expect(fontScale).toBe(100);
  });

  it('switches between preset fonts correctly', async () => {
    await useFontStore.getState().setFont('playfair');
    expect(useFontStore.getState().currentFontId).toBe('playfair');
    expect(localStorage.getItem('dreamscape_active_font')).toBe('playfair');

    await useFontStore.getState().setFont('be-vietnam-pro');
    expect(useFontStore.getState().currentFontId).toBe('be-vietnam-pro');
  });

  it('updates font scaling and clamps within safe bounds [85, 125]', () => {
    useFontStore.getState().setFontScale(110);
    expect(useFontStore.getState().fontScale).toBe(110);
    expect(localStorage.getItem('dreamscape_font_scale')).toBe('110');

    // Clamps minimum
    useFontStore.getState().setFontScale(50);
    expect(useFontStore.getState().fontScale).toBe(85);

    // Clamps maximum
    useFontStore.getState().setFontScale(200);
    expect(useFontStore.getState().fontScale).toBe(125);
  });

  it('rejects unsupported file formats during custom font upload', async () => {
    const fakeFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    const result = await useFontStore.getState().uploadCustomFont(fakeFile);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported font file format');
  });

  it('contains all curated preset fonts with required metadata', () => {
    expect(PRESET_FONTS.length).toBeGreaterThanOrEqual(8);
    const inter = PRESET_FONTS.find((f) => f.id === 'inter');
    const beVietnam = PRESET_FONTS.find((f) => f.id === 'be-vietnam-pro');
    const jetbrains = PRESET_FONTS.find((f) => f.id === 'jetbrains-mono');

    expect(inter).toBeDefined();
    expect(beVietnam).toBeDefined();
    expect(jetbrains).toBeDefined();
    expect(beVietnam?.fontFamily).toContain('Be Vietnam Pro');
  });
});
