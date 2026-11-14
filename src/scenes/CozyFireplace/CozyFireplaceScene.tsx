import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createSceneFramePacer } from '../canvasPerformance';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export const CozyFireplaceScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['cozy-fireplace'] || {};

  const fireIntensity = specific.fireIntensity ?? 1.0;
  const embersEnabled = specific.embersEnabled ?? true;
  const windowRainEnabled = specific.windowRainEnabled ?? true;
  const animIntensity = settings.animationIntensity;
  const lowPerf = settings.lowPerformanceMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const hearthCenterX = width * 0.5;
    const hearthCenterY = height * 0.72;

    // Embers
    const emberCount = Math.floor((lowPerf ? 15 : 45) * settings.particleDensity);
    const emberColors = ['#fde047', '#fb923c', '#ea580c', '#ef4444'];
    const embers: Ember[] = Array.from({ length: emberCount }, () => ({
      x: hearthCenterX + (Math.random() - 0.5) * 120,
      y: hearthCenterY + Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.5 * animIntensity,
      vy: -(1.5 + Math.random() * 3.0) * animIntensity,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.5 + Math.random() * 0.5,
      decay: 0.008 + Math.random() * 0.015,
      color: emberColors[Math.floor(Math.random() * emberColors.length)],
    }));

    // Window rain streaks
    const winStreaks = Array.from({ length: 15 }, () => ({
      x: width * 0.85 + (Math.random() - 0.5) * 80,
      y: height * 0.2 + Math.random() * 120,
      speed: (0.4 + Math.random() * 0.8) * animIntensity,
      length: 15 + Math.random() * 25,
    }));

    let time = 0;
    const pacer = createSceneFramePacer();

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      time += 0.04 * animIntensity;

      // 1. Cabin Interior Dark Backdrop
      ctx.fillStyle = '#09080b';
      ctx.fillRect(0, 0, width, height);

      // 2. Cabin Window (Top Right)
      const winX = width * 0.82;
      const winY = height * 0.15;
      const winW = 120;
      const winH = 160;

      // Deep dark night outside window
      ctx.fillStyle = '#030712';
      ctx.fillRect(winX, winY, winW, winH);

      // Optional Window Rain
      if (windowRainEnabled) {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
        ctx.lineWidth = 1.5;
        winStreaks.forEach(s => {
          s.y += s.speed;
          if (s.y > winY + winH) s.y = winY;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x, s.y + s.length);
          ctx.stroke();
        });
      }

      // Window mullions & frame
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 6;
      ctx.strokeRect(winX, winY, winW, winH);
      ctx.beginPath();
      ctx.moveTo(winX + winW * 0.5, winY);
      ctx.lineTo(winX + winW * 0.5, winY + winH);
      ctx.moveTo(winX, winY + winH * 0.5);
      ctx.lineTo(winX + winW, winY + winH * 0.5);
      ctx.stroke();

      // 3. Dynamic Ambient Flame Light Flicker (Fluctuates warmth over cabin walls)
      const flicker = Math.sin(time * 3.5) * 0.08 + Math.cos(time * 5.2) * 0.05 + 0.88;
      const lightRadius = (width * 0.45) * flicker * fireIntensity;

      const warmGlow = ctx.createRadialGradient(
        hearthCenterX,
        hearthCenterY,
        40,
        hearthCenterX,
        hearthCenterY,
        lightRadius
      );
      warmGlow.addColorStop(0, 'rgba(251, 146, 60, 0.42)');
      warmGlow.addColorStop(0.3, 'rgba(234, 88, 12, 0.22)');
      warmGlow.addColorStop(0.7, 'rgba(180, 83, 9, 0.08)');
      warmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = warmGlow;
      ctx.fillRect(0, 0, width, height);

      // 4. Stone Fireplace Structure (Hearth Arch & Chimney)
      const archW = 280;
      const archH = 220;

      // Chimney
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(hearthCenterX - archW * 0.45, 0, archW * 0.9, hearthCenterY - archH * 0.4);

      // Mantelpiece
      ctx.fillStyle = '#292524';
      ctx.fillRect(hearthCenterX - archW * 0.58, hearthCenterY - archH * 0.52, archW * 1.16, 22);

      // Firebox interior cavity
      ctx.fillStyle = '#050406';
      ctx.beginPath();
      ctx.ellipse(hearthCenterX, hearthCenterY, archW * 0.45, archH * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();

      // 5. Wood Logs
      ctx.fillStyle = '#291e13';
      ctx.beginPath();
      // Left log
      ctx.ellipse(hearthCenterX - 35, hearthCenterY + 30, 60, 16, -0.25, 0, Math.PI * 2);
      ctx.fill();
      // Right log
      ctx.beginPath();
      ctx.ellipse(hearthCenterX + 35, hearthCenterY + 30, 60, 16, 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Glowing hot coal embers under wood
      const coalGrad = ctx.createRadialGradient(hearthCenterX, hearthCenterY + 32, 5, hearthCenterX, hearthCenterY + 32, 55);
      coalGrad.addColorStop(0, '#fef08a');
      coalGrad.addColorStop(0.4, '#ea580c');
      coalGrad.addColorStop(1, 'rgba(120, 53, 15, 0)');
      ctx.fillStyle = coalGrad;
      ctx.beginPath();
      ctx.arc(hearthCenterX, hearthCenterY + 32, 55, 0, Math.PI * 2);
      ctx.fill();

      // 6. Dynamic Procedural Flames
      const flameCount = 7;
      for (let i = 0; i < flameCount; i++) {
        const offset = (i - flameCount / 2) * 16;
        const flameHeight = (65 + Math.sin(time * 4 + i * 2) * 25 + Math.cos(time * 6 + i) * 15) * fireIntensity;
        const flameTipX = hearthCenterX + offset + Math.sin(time * 3 + i) * 15;
        const flameBaseY = hearthCenterY + 25;

        // Outer Flame (Red/Orange)
        ctx.fillStyle = i % 2 === 0 ? 'rgba(239, 68, 68, 0.75)' : 'rgba(249, 115, 22, 0.8)';
        ctx.beginPath();
        ctx.moveTo(hearthCenterX + offset - 22, flameBaseY);
        ctx.quadraticCurveTo(
          hearthCenterX + offset - 15,
          flameBaseY - flameHeight * 0.6,
          flameTipX,
          flameBaseY - flameHeight
        );
        ctx.quadraticCurveTo(
          hearthCenterX + offset + 15,
          flameBaseY - flameHeight * 0.6,
          hearthCenterX + offset + 22,
          flameBaseY
        );
        ctx.closePath();
        ctx.fill();

        // Inner Flame Core (Brilliant Yellow/White)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.beginPath();
        ctx.moveTo(hearthCenterX + offset - 10, flameBaseY);
        ctx.quadraticCurveTo(
          hearthCenterX + offset - 6,
          flameBaseY - flameHeight * 0.45,
          flameTipX * 0.7 + (hearthCenterX + offset) * 0.3,
          flameBaseY - flameHeight * 0.75
        );
        ctx.quadraticCurveTo(
          hearthCenterX + offset + 6,
          flameBaseY - flameHeight * 0.45,
          hearthCenterX + offset + 10,
          flameBaseY
        );
        ctx.closePath();
        ctx.fill();
      }

      // 7. Floating Hearth Embers
      if (embersEnabled) {
        embers.forEach(emb => {
          emb.x += emb.vx + Math.sin(time * 2 + emb.y * 0.05) * 0.6;
          emb.y += emb.vy;
          emb.alpha -= emb.decay;

          if (emb.alpha <= 0 || emb.y < hearthCenterY - 180) {
            emb.x = hearthCenterX + (Math.random() - 0.5) * 80;
            emb.y = hearthCenterY + 20;
            emb.alpha = 0.6 + Math.random() * 0.4;
            emb.vy = -(1.5 + Math.random() * 3.0) * animIntensity;
          }

          ctx.fillStyle = emb.color;
          ctx.globalAlpha = Math.max(0, emb.alpha);
          ctx.beginPath();
          ctx.arc(emb.x, emb.y, emb.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }

      // 8. Foreground Floor Shadow Silhouette
      ctx.fillStyle = '#060507';
      ctx.fillRect(0, height - 35, width, 35);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fireIntensity, embersEnabled, windowRainEnabled, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
