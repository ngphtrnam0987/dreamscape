import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createSceneFramePacer } from '../canvasPerformance';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
}

export const CherryBlossomScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['cherry-blossom'] || {};

  const petalDensity = specific.petalDensity ?? 1.0;
  const windBreeze = specific.windBreeze ?? 1.0;
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

    const petalCount = Math.floor((lowPerf ? 35 : 90) * petalDensity * settings.particleDensity);
    const petalColors = ['#fbcfe8', '#f472b6', '#fda4af', '#fff1f2', '#f9a8d4'];

    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 8,
      speedY: (0.7 + Math.random() * 1.4) * animIntensity,
      speedX: (1.2 + Math.random() * 2.2) * windBreeze * animIntensity,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04 * animIntensity,
      opacity: 0.4 + Math.random() * 0.5,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
    }));

    let time = 0;
    const pacer = createSceneFramePacer();

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      time += 0.015 * animIntensity;

      // 1. Twilight Kyoto Sky Gradient (Deep plum dusk into soft rose blush)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#1a0d24'); // Deep purple twilight
      skyGrad.addColorStop(0.5, '#3b1836');
      skyGrad.addColorStop(0.85, '#6b2149');
      skyGrad.addColorStop(1, '#9d325a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Distant Crescent Moon & Soft Glow
      const moonX = width * 0.78;
      const moonY = height * 0.22;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 120);
      moonGlow.addColorStop(0, 'rgba(253, 230, 138, 0.4)');
      moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Crescent Moon
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3b1836';
      ctx.beginPath();
      ctx.arc(moonX + 10, moonY - 6, 24, 0, Math.PI * 2);
      ctx.fill();

      // 3. Distant Mountain Silhouette
      ctx.fillStyle = '#210c22';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 50) {
        const mh = height * 0.62 + Math.sin(x * 0.003) * 60 + Math.cos(x * 0.009) * 30;
        ctx.lineTo(x, mh);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 4. Traditional Pagoda & Torii Gate Silhouette on Left Ridge
      const ridgeY = height * 0.74;
      ctx.fillStyle = '#100512';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(width * 0.25, ridgeY - 30, width * 0.6, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Pagoda roof levels
      const pagodaX = width * 0.16;
      ctx.fillStyle = '#0a030b';
      // Level 1 roof
      ctx.beginPath();
      ctx.moveTo(pagodaX - 55, ridgeY - 90);
      ctx.quadraticCurveTo(pagodaX, ridgeY - 110, pagodaX + 55, ridgeY - 90);
      ctx.lineTo(pagodaX + 40, ridgeY - 75);
      ctx.lineTo(pagodaX - 40, ridgeY - 75);
      ctx.closePath();
      ctx.fill();

      // Level 2 roof
      ctx.beginPath();
      ctx.moveTo(pagodaX - 42, ridgeY - 130);
      ctx.quadraticCurveTo(pagodaX, ridgeY - 148, pagodaX + 42, ridgeY - 130);
      ctx.lineTo(pagodaX + 30, ridgeY - 118);
      ctx.lineTo(pagodaX - 30, ridgeY - 118);
      ctx.closePath();
      ctx.fill();

      // Pagoda spire
      ctx.fillRect(pagodaX - 2, ridgeY - 175, 4, 30);

      // Stone Lantern with Warm Paper Candle Glow
      const lanternX = width * 0.35;
      const lanternY = height * 0.78;
      const candleFlicker = 0.85 + Math.sin(time * 5) * 0.15;
      const lanternGlow = ctx.createRadialGradient(lanternX, lanternY - 12, 5, lanternX, lanternY - 12, 65);
      lanternGlow.addColorStop(0, `rgba(251, 191, 36, ${0.7 * candleFlicker})`);
      lanternGlow.addColorStop(0.5, `rgba(217, 119, 6, ${0.25 * candleFlicker})`);
      lanternGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY - 12, 65, 0, Math.PI * 2);
      ctx.fill();

      // Lantern Silhouette
      ctx.fillStyle = '#080209';
      ctx.fillRect(lanternX - 8, lanternY, 16, 25);
      ctx.fillRect(lanternX - 14, lanternY - 20, 28, 6);
      ctx.fillRect(lanternX - 11, lanternY - 14, 22, 14);

      // 5. Overhead Cherry Blossom Branch Silhouette (Top Right)
      ctx.fillStyle = '#090209';
      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.quadraticCurveTo(width * 0.8, height * 0.15, width * 0.65, height * 0.08);
      ctx.quadraticCurveTo(width * 0.75, height * 0.05, width, 0);
      ctx.fill();

      // 6. Floating Drifting Sakura Petals
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.y * 0.02) * 1.5;
        p.rotation += p.rotSpeed;

        if (p.x > width + 20) {
          p.x = -20;
          p.y = Math.random() * height * 0.8;
        }
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Sakura petal heart/curve shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.8, -p.size * 0.4, 0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.8, -p.size * 0.4, 0, -p.size);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });
      ctx.globalAlpha = 1.0;

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [petalDensity, windBreeze, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
