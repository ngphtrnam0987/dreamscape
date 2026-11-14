import React, { useEffect, useState, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { useUIStore } from '../../stores/useUIStore';
import { useAudioStore } from '../../stores/useAudioStore';

export const AmbientCursor: React.FC = () => {
  const { settings } = useSceneStore();
  const { isZenMode } = useUIStore();

  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const ringX = useRef(-100);
  const ringY = useRef(-100);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only activate on pointer-fine devices (desktops, mice)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      setVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.getAttribute('role') === 'button' ||
          window.getComputedStyle(target).cursor === 'pointer';

        setIsHovering(isInteractive);
      }

      if (isZenMode) {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
          setVisible(false);
        }, 3000);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.closest('button') !== null ||
          target.tagName === 'A' ||
          target.closest('a') !== null ||
          target.getAttribute('role') === 'button' ||
          target.tagName === 'INPUT')
      ) {
        useAudioStore.getState().playUiFeedback('tap');
      }
    };
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth 60/120fps ring lerp interpolation loop
    let rafId: number;
    const animate = () => {
      // Lerp ring towards mouse with spring factor 0.22
      ringX.current += (mouseX.current - ringX.current) * 0.22;
      ringY.current += (mouseY.current - ringY.current) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX.current}px, ${mouseY.current}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isZenMode]);

  if (!settings.ambientCursor) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Central precise luminous dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] pointer-events-none"
      />

      {/* Trailing ambient interactive ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-sky-400/50 pointer-events-none transition-[width,height,margin,background-color,border-color] duration-200 ease-out ${
          isClicking
            ? 'w-6 h-6 -ml-3 -mt-3 bg-sky-400/30 border-sky-300'
            : isHovering
            ? 'w-11 h-11 -ml-[22px] -mt-[22px] bg-sky-500/15 border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] backdrop-blur-[1px]'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 bg-transparent border-white/30'
        }`}
      />
    </div>
  );
};
