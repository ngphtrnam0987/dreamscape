import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createFramePacer } from '../canvasPerformance';

interface RainStreak {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
}

export const CozyCafeScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['cozy-cafe'] || {};

  const cafeLighting = specific.cafeLighting ?? 1.0;
  const steamIntensity = specific.steamIntensity ?? 1.0;
  const windowRain = specific.windowRain ?? true;
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

    const rainCount = Math.floor((lowPerf ? 25 : 60) * settings.particleDensity);
    const rainStreaks: RainStreak[] = Array.from({ length: rainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      speed: (6 + Math.random() * 8) * animIntensity,
      length: 15 + Math.random() * 25,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    // Steam particles rising from the coffee cup
    const cupX = width * 0.5;
    const cupY = height * 0.78;
    const steamCount = Math.floor((lowPerf ? 15 : 35) * steamIntensity);
    const steam: SteamParticle[] = Array.from({ length: steamCount }, () => ({
      x: cupX + (Math.random() - 0.5) * 20,
      y: cupY - 15 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.4 * animIntensity,
      vy: -(0.6 + Math.random() * 1.2) * animIntensity,
      radius: 4 + Math.random() * 8,
      alpha: 0.2 + Math.random() * 0.4,
      decay: 0.005 + Math.random() * 0.01,
    }));

    let time = 0;
    const pacer = createFramePacer(lowPerf ? 30 : 50);

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      time += 0.02 * animIntensity;

      // 1. Outside Night Metropolis (Blurred through rain window)
      const outGrad = ctx.createLinearGradient(0, 0, 0, height * 0.75);
      outGrad.addColorStop(0, '#060a12');
      outGrad.addColorStop(0.6, '#0f172a');
      outGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = outGrad;
      ctx.fillRect(0, 0, width, height * 0.75);

      // Bokeh City Streetlights Outside
      const bokehLights = [
        { x: width * 0.2, y: height * 0.35, r: 45, c: 'rgba(251, 146, 60, 0.25)' },
        { x: width * 0.4, y: height * 0.25, r: 60, c: 'rgba(254, 240, 138, 0.2)' },
        { x: width * 0.75, y: height * 0.4, r: 50, c: 'rgba(244, 63, 94, 0.25)' },
        { x: width * 0.85, y: height * 0.28, r: 35, c: 'rgba(56, 189, 248, 0.2)' },
      ];
      bokehLights.forEach(b => {
        const bg = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.r);
        bg.addColorStop(0, b.c);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Window Rain Streaks
      if (windowRain) {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
        ctx.lineWidth = 1.5;
        rainStreaks.forEach(r => {
          r.y += r.speed;
          if (r.y > height * 0.72) {
            r.y = -20;
            r.x = Math.random() * width;
          }
          ctx.globalAlpha = r.opacity;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - 2, r.y + r.length);
          ctx.stroke();
        });
        ctx.globalAlpha = 1.0;
      }

      // 2. Hanging Vintage Edison Lamp (Top Center)
      const bulbX = width * 0.5;
      const bulbSway = Math.sin(time * 0.8) * 8;
      const bulbY = height * 0.18;

      // Lamp Cord
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bulbX, 0);
      ctx.lineTo(bulbX + bulbSway, bulbY);
      ctx.stroke();

      // Warm Radiant Bulb Ambient Glow
      const bulbGlow = ctx.createRadialGradient(
        bulbX + bulbSway,
        bulbY + 12,
        8,
        bulbX + bulbSway,
        bulbY + 12,
        width * 0.42 * cafeLighting
      );
      bulbGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      bulbGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.2)');
      bulbGlow.addColorStop(0.7, 'rgba(217, 119, 6, 0.06)');
      bulbGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bulbGlow;
      ctx.fillRect(0, 0, width, height);

      // Edison Bulb glass teardrop
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.beginPath();
      ctx.arc(bulbX + bulbSway, bulbY + 14, 10, 0, Math.PI * 2);
      ctx.fill();

      // 3. Cafe Wooden Counter Table (Foreground)
      const tableY = height * 0.72;
      const tableGrad = ctx.createLinearGradient(0, tableY, 0, height);
      tableGrad.addColorStop(0, '#261b14'); // Rich dark mahogany wood
      tableGrad.addColorStop(0.1, '#1c130e');
      tableGrad.addColorStop(1, '#0e0906');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, tableY, width, height - tableY);

      // Table highlight bevel
      ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.fillRect(0, tableY, width, 2);

      // 4. Steaming Ceramic Coffee Cup on Table
      // Cup Saucer
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.ellipse(cupX, cupY + 18, 48, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ceramic Cup Body
      ctx.fillStyle = '#3f3f46';
      ctx.beginPath();
      ctx.moveTo(cupX - 28, cupY - 14);
      ctx.lineTo(cupX + 28, cupY - 14);
      ctx.lineTo(cupX + 22, cupY + 14);
      ctx.lineTo(cupX - 22, cupY + 14);
      ctx.closePath();
      ctx.fill();

      // Hot Coffee Liquid surface
      ctx.fillStyle = '#1c1008';
      ctx.beginPath();
      ctx.ellipse(cupX, cupY - 14, 26, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cup handle
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cupX + 28, cupY, 10, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();

      // 5. Rising Steam Wisps from Coffee Cup
      steam.forEach(s => {
        s.y += s.vy;
        s.x += s.vx + Math.sin(time * 2 + s.y * 0.05) * 0.6;
        s.radius += 0.08;
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.y < cupY - 120) {
          s.x = cupX + (Math.random() - 0.5) * 16;
          s.y = cupY - 16;
          s.alpha = 0.25 + Math.random() * 0.35;
          s.radius = 4 + Math.random() * 4;
        }

        ctx.fillStyle = `rgba(244, 244, 245, ${Math.max(0, s.alpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [cafeLighting, steamIntensity, windowRain, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
