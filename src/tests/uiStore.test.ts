import { describe, it, expect } from 'vitest';
import { useUIStore } from '../stores/useUIStore';

describe('useUIStore', () => {
  it('manages modal opening, closing, and toggling', () => {
    const store = useUIStore.getState();
    expect(store.activeModal).toBeNull();

    store.openModal('lofi');
    expect(useUIStore.getState().activeModal).toBe('lofi');

    store.toggleModal('lofi');
    expect(useUIStore.getState().activeModal).toBeNull();

    store.openModal('shortcuts');
    expect(useUIStore.getState().activeModal).toBe('shortcuts');
    store.closeModal();
    expect(useUIStore.getState().activeModal).toBeNull();
  });

  it('toggles focus mode and zen scenery mode correctly', () => {
    const store = useUIStore.getState();
    expect(store.isZenMode).toBe(false);

    store.toggleZenMode();
    expect(useUIStore.getState().isZenMode).toBe(true);

    store.toggleZenMode();
    expect(useUIStore.getState().isZenMode).toBe(false);

    store.toggleFocusMode();
    expect(useUIStore.getState().isFocusMode).toBe(true);
    store.toggleFocusMode();
    expect(useUIStore.getState().isFocusMode).toBe(false);
  });
});
