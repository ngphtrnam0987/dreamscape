import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createFramePacer } from '../canvasPerformance';

interface CyberRain {
  x: number;
  y: number;
  speed: number;
  length: number;
  color: string;
  opacity: number;
}

interface NeonSign {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  glowColor: string;
  flickerRate: number;
}

export const NeonCyberpunkScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['neon-cyberpunk'] || {};

  const neonGlow = specific.neonGlow ?? 1.0;
  const cyberRainIntensity = specific.cyberRainIntensity ?? 1.0;
  const hologramFlicker = specific.hologramFlicker ?? true;
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

    const rainColors = ['#38bdf8', '#f43f5e', '#a855f7', '#06b6d4', '#e2e8f0'];
    const rainCount = Math.floor((lowPerf ? 80 : 200) * cyberRainIntensity * settings.particleDensity);
    const drops: CyberRain[] = Array.from({ length: rainCount }, () => ({
      x: Math.random() * (width + 150),
      y: Math.random() * height,
      speed: (14 + Math.random() * 18) * animIntensity,
      length: 20 + Math.random() * 35,
      color: rainColors[Math.floor(Math.random() * rainColors.length)],
      opacity: 0.25 + Math.random() * 0.5,
    }));

    const signs: NeonSign[] = [
      { text: '夢境', x: width * 0.15, y: height * 0.28, w: 70, h: 140, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.45)', flickerRate: 0.95 },
      { text: 'LO-FI', x: width * 0.82, y: height * 0.22, w: 90, h: 50, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.5)', flickerRate: 0.98 },
      { text: '夜雨', x: width * 0.78, y: height * 0.42, w: 60, h: 110, color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.45)', flickerRate: 0.92 },
      { text: 'FOCUS', x: width * 0.25, y: height * 0.18, w: 85, h: 36, color: '#fbbf24', glowColor: 'rgba(251, 191, 36, 0.4)', flickerRate: 0.97 },
    ];

    let time = 0;
    const pacer = createFramePacer(lowPerf ? 30 : 50);

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      time += 0.02 * animIntensity;

      // 1. Dark Cyberpunk Alley Backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#02040a');
      bgGrad.addColorStop(0.5, '#0a0f1d');
      bgGrad.addColorStop(1, '#060a14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. High-Tech Skyscraper Silhouettes
      const bCount = 12;
      for (let i = 0; i < bCount; i++) {
        const bx = i * (width / bCount);
        const bw = width / bCount + 4;
        const bh = height * (0.45 + ((i * 3) % 5) * 0.08);

        ctx.fillStyle = '#05070e';
        ctx.fillRect(bx, height - bh, bw, bh);

        // Cyber window grid
        ctx.fillStyle = i % 2 === 0 ? 'rgba(6, 182, 212, 0.25)' : 'rgba(244, 63, 94, 0.2)';
        for (let wy = height - bh + 20; wy < height - 60; wy += 35) {
          if (Math.sin(i * 4 + wy) > 0.2) {
            ctx.fillRect(bx + 10, wy, bw - 20, 2);
          }
        }
      }

      // 3. Glowing Neon Sign Boards
      signs.forEach(s => {
        const isFlickering = hologramFlicker && Math.random() > s.flickerRate;
        const alpha = isFlickering ? 0.3 : 1.0;

        // Big ambient neon bloom aura
        const aura = ctx.createRadialGradient(s.x + s.w * 0.5, s.y + s.h * 0.5, 5, s.x + s.w * 0.5, s.y + s.h * 0.5, 130 * neonGlow);
        aura.addColorStop(0, s.glowColor);
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aura;
        ctx.fillRect(s.x - 70, s.y - 70, s.w + 140, s.h + 140);

        // Sign frame
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = alpha;
        ctx.strokeRect(s.x, s.y, s.w, s.h);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.text, s.x + s.w * 0.5, s.y + s.h * 0.5);
        ctx.globalAlpha = 1.0;
      });

      // 4. Wet Asphalt Ground Reflection (Bottom 25%)
      const roadY = height * 0.75;
      const roadGrad = ctx.createLinearGradient(0, roadY, 0, height);
      roadGrad.addColorStop(0, '#0a0f1d');
      roadGrad.addColorStop(0.3, '#0e1628');
      roadGrad.addColorStop(1, '#05070d');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, roadY, width, height - roadY);

      // Neon road reflections
      signs.forEach(s => {
        const reflGrad = ctx.createLinearGradient(s.x, roadY, s.x, height);
        reflGrad.addColorStop(0, s.glowColor);
        reflGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(s.x - 15, roadY, s.w + 30, height - roadY);
      });

      // 5. Slanted Fast Cyber Rain
      drops.forEach(d => {
        d.y += d.speed;
        d.x -= d.speed * 0.22; // Strong wind slant

        if (d.y > height) {
          d.y = -20;
          d.x = Math.random() * (width + 120);
        }
        if (d.x < -20) {
          d.x = width + 20;
        }

        ctx.strokeStyle = d.color;
        ctx.globalAlpha = d.opacity;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.length * 0.22, d.y + d.length);
        ctx.stroke();

        // Splash ripples on wet asphalt
        if (d.y > roadY && Math.random() > 0.85) {
          ctx.beginPath();
          ctx.ellipse(d.x, d.y, 4, 1.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [neonGlow, cyberRainIntensity, hologramFlicker, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
