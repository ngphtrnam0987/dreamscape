import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../stores/useSceneStore';
import { createFramePacer } from './canvasPerformance';

interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation?: number;
  vRot?: number;
  extra?: number;
}

export const WeatherOverlay: React.FC = () => {
  const { settings } = useSceneStore();
  const { weather, weatherIntensity = 1.0, fpsTarget = 60, graphicsQuality } = settings;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (weather === 'scene-default') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Frame pacer respecting dynamic target FPS
    const pacer = createFramePacer(() => useSceneStore.getState().settings.fpsTarget || 60);

    // Adjust particle count based on graphic quality
    const qualityMultiplier = graphicsQuality === 'eco' ? 0.35 : graphicsQuality === 'ultra' ? 1.6 : 1.0;
    const intensity = Math.max(0.5, Math.min(2.0, weatherIntensity)) * qualityMultiplier;

    // Generate weather-specific particles
    let particles: WeatherParticle[] = [];
    let lightningTimer = 0;
    let lightningAlpha = 0;
    let auroraPhase = 0;

    if (weather === 'clear') {
      const count = Math.floor(40 * intensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.5,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.4,
        extra: Math.random() * Math.PI * 2,
      }));
    } else if (weather === 'rain') {
      const count = Math.floor(140 * intensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -1.0 - Math.random() * 0.8,
        vy: 12 + Math.random() * 8,
        size: 12 + Math.random() * 16,
        alpha: 0.25 + Math.random() * 0.35,
      }));
    } else if (weather === 'thunderstorm') {
      const count = Math.floor(220 * intensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -3.5 - Math.random() * 2.5,
        vy: 16 + Math.random() * 10,
        size: 16 + Math.random() * 22,
        alpha: 0.35 + Math.random() * 0.45,
      }));
    } else if (weather === 'snow') {
      const count = Math.floor(90 * intensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.8 + Math.random() * 1.6,
        size: 1.2 + Math.random() * 3.5,
        alpha: 0.4 + Math.random() * 0.5,
        extra: Math.random() * Math.PI * 2,
      }));
    } else if (weather === 'autumn-wind') {
      const count = Math.floor(55 * intensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 1.5 + Math.random() * 2.5,
        vy: 0.8 + Math.random() * 1.5,
        size: 5 + Math.random() * 8,
        alpha: 0.6 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        extra: Math.random() > 0.5 ? 1 : 0, // 1 = amber, 0 = crimson
      }));
    } else if (weather === 'fog') {
      const count = Math.floor(16 * intensity);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: height * 0.2 + Math.random() * (height * 0.7),
        vx: 0.2 + Math.random() * 0.5,
        vy: (Math.random() - 0.5) * 0.1,
        size: 140 + Math.random() * 180,
        alpha: 0.04 + Math.random() * 0.07,
      }));
    }

    let animId: number;

    const render = (timestamp: number) => {
      animId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) return;

      ctx.clearRect(0, 0, width, height);

      // 1. CLEAR WEATHER (Golden Sunbeams & Shimmering Motes)
      if (weather === 'clear') {
        // Soft golden atmospheric gradient bloom
        const sunGrad = ctx.createRadialGradient(width * 0.8, height * 0.15, 20, width * 0.8, height * 0.15, width * 0.65);
        sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
        sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.03)');
        sunGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.extra !== undefined) p.extra += 0.02;
          const wobble = Math.sin(p.extra || 0) * 0.4;
          p.x += wobble;

          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha * 0.85})`;
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = graphicsQuality === 'ultra' ? 8 : 0;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // 2. GENTLE RAIN
      else if (weather === 'rain') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * (width + 100);
          }
          if (p.x < -20) p.x = width + 20;

          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.5, p.y + p.size);
        }
        ctx.stroke();
      }

      // 3. DRAMATIC THUNDERSTORM
      else if (weather === 'thunderstorm') {
        // Lightning flash controller
        lightningTimer++;
        if (lightningAlpha > 0) {
          lightningAlpha *= 0.88;
          if (lightningAlpha < 0.01) lightningAlpha = 0;
        } else if (lightningTimer > 280 && Math.random() < 0.018) {
          lightningAlpha = 0.65 + Math.random() * 0.3;
          lightningTimer = 0;
        }

        if (lightningAlpha > 0.02) {
          ctx.fillStyle = `rgba(224, 231, 255, ${lightningAlpha})`;
          ctx.fillRect(0, 0, width, height);
        }

        // Heavy wind-driven rain
        ctx.strokeStyle = 'rgba(219, 234, 254, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height + 30) {
            p.y = -30;
            p.x = Math.random() * (width + 300);
          }
          if (p.x < -30) p.x = width + 100;

          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.8, p.y + p.size);
        }
        ctx.stroke();
      }

      // 4. PEACEFUL SNOWFALL
      else if (weather === 'snow') {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.extra !== undefined) p.extra += 0.02;
          p.x += Math.sin(p.extra || 0) * 0.7;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${p.alpha})`;
          ctx.fill();
        }
      }

      // 5. VOLUMETRIC VALLEY MIST / FOG
      else if (weather === 'fog') {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x > width + p.size) {
            p.x = -p.size;
            p.y = height * 0.2 + Math.random() * (height * 0.7);
          }

          const grad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(226, 232, 240, ${p.alpha * 1.2})`);
          grad.addColorStop(0.6, `rgba(203, 213, 225, ${p.alpha * 0.6})`);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. AUTUMN WIND & TUMBLING LEAVES
      else if (weather === 'autumn-wind') {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.rotation !== undefined && p.vRot !== undefined) {
            p.rotation += p.vRot;
          }

          if (p.x > width + 30 || p.y > height + 30) {
            p.x = -20;
            p.y = Math.random() * (height * 0.8);
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.rotation) ctx.rotate(p.rotation);

          // Maple leaf ellipse path
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fillStyle =
            p.extra === 1
              ? `rgba(245, 158, 11, ${p.alpha})` // Amber
              : `rgba(239, 68, 68, ${p.alpha * 0.9})`; // Crimson
          ctx.fill();
          ctx.restore();
        }
      }

      // 7. COSMIC AURORA VEIL
      else if (weather === 'aurora') {
        auroraPhase += 0.012;
        const waveCount = graphicsQuality === 'eco' ? 2 : 3;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);

          const baseHeight = height * (0.18 + w * 0.08);
          for (let x = 0; x <= width; x += 30) {
            const waveY =
              baseHeight +
              Math.sin(x * 0.003 + auroraPhase + w) * 45 +
              Math.cos(x * 0.006 - auroraPhase * 0.7) * 25;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, 0);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
          if (w === 0) {
            grad.addColorStop(0, 'rgba(45, 212, 191, 0.16)');
            grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.06)');
            grad.addColorStop(1, 'transparent');
          } else if (w === 1) {
            grad.addColorStop(0, 'rgba(168, 85, 247, 0.13)');
            grad.addColorStop(0.7, 'rgba(192, 132, 252, 0.04)');
            grad.addColorStop(1, 'transparent');
          } else {
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
            grad.addColorStop(0.8, 'rgba(99, 102, 241, 0.03)');
            grad.addColorStop(1, 'transparent');
          }

          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [weather, weatherIntensity, fpsTarget, graphicsQuality]);

  if (weather === 'scene-default') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-16 select-none"
      aria-hidden="true"
    />
  );
};
