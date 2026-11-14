import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createSceneFramePacer } from '../canvasPerformance';

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  thickness: number;
  opacity: number;
}

interface WindowStreak {
  x: number;
  y: number;
  speed: number;
  length: number;
  width: number;
  opacity: number;
  curve: number;
}

export const RainyNightScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['rainy-night'] || {};

  const rainIntensity = specific.rainIntensity ?? 1.0;
  const lightningEnabled = specific.lightningEnabled ?? true;
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

    // Raindrop particles
    const dropCount = Math.floor((lowPerf ? 80 : 220) * rainIntensity * settings.particleDensity);
    const drops: RainDrop[] = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: (12 + Math.random() * 16) * animIntensity,
      length: 15 + Math.random() * 25,
      thickness: 1 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.45,
    }));

    // Glass window streaks
    const streakCount = Math.floor((lowPerf ? 12 : 30) * rainIntensity);
    const streaks: WindowStreak[] = Array.from({ length: streakCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: (0.4 + Math.random() * 1.2) * animIntensity,
      length: 20 + Math.random() * 45,
      width: 1.5 + Math.random() * 2.5,
      opacity: 0.2 + Math.random() * 0.4,
      curve: (Math.random() - 0.5) * 10,
    }));

    // City lights
    const buildingCount = 28;
    const buildings = Array.from({ length: buildingCount }, (_, i) => {
      const bWidth = 40 + Math.random() * 60;
      const bHeight = 120 + Math.random() * (height * 0.45);
      const bX = (i * (width / buildingCount)) + (Math.random() - 0.5) * 20;
      const windows: Array<{ x: number; y: number; on: boolean; color: string }> = [];
      const rows = Math.floor(bHeight / 24);
      const cols = Math.floor(bWidth / 14);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.4) {
            windows.push({
              x: c * 12 + 4,
              y: r * 20 + 6,
              on: Math.random() > 0.2,
              color: Math.random() > 0.6 ? '#fef08a' : (Math.random() > 0.5 ? '#fed7aa' : '#bae6fd'),
            });
          }
        }
      }

      return { x: bX, width: bWidth, height: bHeight, windows };
    });

    // Lightning state
    let lightningOpacity = 0;
    let nextLightningTime = Date.now() + 8000 + Math.random() * 14000;

    let lastTime = performance.now();
    const pacer = createSceneFramePacer();

    const render = (time: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(time)) {
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Check lightning trigger
      if (lightningEnabled && Date.now() > nextLightningTime) {
        lightningOpacity = 0.85;
        nextLightningTime = Date.now() + 12000 + Math.random() * 20000;
      }
      if (lightningOpacity > 0) {
        lightningOpacity = Math.max(0, lightningOpacity - dt * 2.8);
      }

      // 1. Sky & Metropolis Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#020617'); // Dark midnight sky
      skyGrad.addColorStop(0.65, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Lightning flash overlay
      if (lightningOpacity > 0) {
        ctx.fillStyle = `rgba(224, 231, 255, ${lightningOpacity * 0.7})`;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. City Skyline Silhouette
      buildings.forEach(b => {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(b.x, height - b.height, b.width, b.height);

        // Windows
        b.windows.forEach(w => {
          if (w.on) {
            ctx.fillStyle = w.color;
            ctx.globalAlpha = 0.5 + Math.sin(time * 0.001 + w.x) * 0.15;
            ctx.fillRect(b.x + w.x, height - b.height + w.y, 4, 7);
          }
        });
        ctx.globalAlpha = 1.0;
      });

      // Atmospheric mist between city and window
      const mistGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      mistGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      mistGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, height * 0.4, width, height * 0.6);

      // 3. Falling Rain Outside
      ctx.strokeStyle = '#93c5fd';
      drops.forEach(drop => {
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.15; // Slanted by wind

        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * (width + 100);
        }
        if (drop.x < -20) {
          drop.x = width + 20;
        }

        ctx.lineWidth = drop.thickness;
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.15, drop.y + drop.length);
        ctx.stroke();
      });

      // 4. Window Glass Streaks & Water Droplets
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
      streaks.forEach(s => {
        s.y += s.speed;
        if (s.y > height + 50) {
          s.y = -40;
          s.x = Math.random() * width;
        }

        ctx.globalAlpha = s.opacity;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(s.x + s.curve, s.y + s.length * 0.5, s.x, s.y + s.length);
        ctx.stroke();

        // Droplet at head of streak
        ctx.beginPath();
        ctx.arc(s.x, s.y + s.length, s.width * 1.1, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 5. Warm Interior Room Ambient Glow (Bottom corner lamp reflection)
      const lampGlow = ctx.createRadialGradient(
        width * 0.88,
        height * 0.92,
        20,
        width * 0.88,
        height * 0.92,
        width * 0.55
      );
      lampGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      lampGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.08)');
      lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lampGlow;
      ctx.fillRect(0, 0, width, height);

      // Window Frame & Sill Silhouette
      ctx.fillStyle = '#050811';
      // Bottom sill
      ctx.fillRect(0, height - 28, width, 28);
      // Window panes
      ctx.fillRect(width * 0.5 - 6, 0, 12, height);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [rainIntensity, lightningEnabled, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
