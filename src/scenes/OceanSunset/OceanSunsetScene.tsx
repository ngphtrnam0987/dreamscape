import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createSceneFramePacer } from '../canvasPerformance';

interface Sparkle {
  x: number;
  y: number;
  phase: number;
  speed: number;
  size: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

export const OceanSunsetScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['ocean-sunset'] || {};

  const waveIntensity = specific.waveIntensity ?? 1.0;
  const sunsetBrightness = specific.sunsetBrightness ?? 1.0;
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

    const horizonY = height * 0.58;

    // Water sun glint sparkles
    const sparkleCount = Math.floor((lowPerf ? 25 : 60) * settings.particleDensity);
    const sparkles: Sparkle[] = Array.from({ length: sparkleCount }, () => ({
      x: width * 0.5 + (Math.random() - 0.5) * (width * 0.35),
      y: horizonY + Math.random() * (height - horizonY),
      phase: Math.random() * Math.PI * 2,
      speed: (0.02 + Math.random() * 0.04) * animIntensity,
      size: 1 + Math.random() * 2.5,
    }));

    // Soft drifting sunset clouds
    const clouds: Cloud[] = [
      { x: width * 0.1, y: height * 0.18, width: 220, height: 45, speed: 0.15 * animIntensity, opacity: 0.35 },
      { x: width * 0.55, y: height * 0.26, width: 340, height: 60, speed: 0.22 * animIntensity, opacity: 0.4 },
      { x: width * 0.8, y: height * 0.12, width: 180, height: 35, speed: 0.1 * animIntensity, opacity: 0.25 },
    ];

    let time = 0;
    const pacer = createSceneFramePacer();

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      time += 0.02 * animIntensity;

      // 1. Sunset Sky Gradient (Dusk Purple -> Crimson Coral -> Warm Amber Horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#1e112a'); // Deep twilight plum
      skyGrad.addColorStop(0.35, '#3b1d3f');
      skyGrad.addColorStop(0.65, '#832838');
      skyGrad.addColorStop(0.85, '#c2410c');
      skyGrad.addColorStop(1, '#f59e0b'); // Golden horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // 2. Setting Sun & Atmospheric Glow
      const sunX = width * 0.5;
      const sunY = horizonY - 10;
      const sunRadius = 45;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, width * 0.45);
      sunGlow.addColorStop(0, `rgba(254, 240, 138, ${0.85 * sunsetBrightness})`);
      sunGlow.addColorStop(0.25, `rgba(251, 146, 60, ${0.45 * sunsetBrightness})`);
      sunGlow.addColorStop(0.7, `rgba(239, 68, 68, ${0.15 * sunsetBrightness})`);
      sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, horizonY);

      // Crisp Sun Disc
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Drifting Sunset Clouds
      clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > width + c.width) c.x = -c.width;

        const cGrad = ctx.createLinearGradient(c.x, c.y, c.x, c.y + c.height);
        cGrad.addColorStop(0, `rgba(254, 215, 170, ${c.opacity * 0.8})`);
        cGrad.addColorStop(1, `rgba(180, 83, 9, ${c.opacity * 0.3})`);

        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.width * 0.5, c.height * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Ocean Base & Multi-Harmonic Waves
      // Deep ocean water base
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      oceanGrad.addColorStop(0, '#1e293b');
      oceanGrad.addColorStop(0.3, '#0f172a');
      oceanGrad.addColorStop(1, '#020617');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Specular Sun Reflection on Water
      const reflGrad = ctx.createLinearGradient(sunX - 90, horizonY, sunX + 90, horizonY);
      reflGrad.addColorStop(0, 'rgba(251, 146, 60, 0)');
      reflGrad.addColorStop(0.5, `rgba(254, 240, 138, ${0.45 * sunsetBrightness})`);
      reflGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = reflGrad;
      ctx.beginPath();
      ctx.moveTo(sunX - 25, horizonY);
      ctx.lineTo(sunX + 25, horizonY);
      ctx.lineTo(sunX + 160, height);
      ctx.lineTo(sunX - 160, height);
      ctx.closePath();
      ctx.fill();

      // Multi-layer Waves
      const waveLayers = [
        { y: horizonY + (height - horizonY) * 0.18, amp: 4 * waveIntensity, freq: 0.012, speed: 1.2, color: 'rgba(15, 23, 42, 0.95)' },
        { y: horizonY + (height - horizonY) * 0.42, amp: 8 * waveIntensity, freq: 0.008, speed: 1.6, color: 'rgba(12, 74, 110, 0.7)' },
        { y: horizonY + (height - horizonY) * 0.72, amp: 14 * waveIntensity, freq: 0.005, speed: 2.1, color: 'rgba(7, 89, 133, 0.55)' },
      ];

      waveLayers.forEach((layer, idx) => {
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, layer.y);

        for (let x = 0; x <= width; x += 15) {
          const waveHeight = Math.sin(x * layer.freq + time * layer.speed) * layer.amp
            + Math.cos(x * layer.freq * 1.5 - time * layer.speed * 0.7) * (layer.amp * 0.4);
          ctx.lineTo(x, layer.y + waveHeight);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Wave crest foam
        ctx.strokeStyle = idx === 2 ? 'rgba(254, 243, 199, 0.45)' : 'rgba(224, 231, 255, 0.25)';
        ctx.lineWidth = idx === 2 ? 2.5 : 1.5;
        ctx.stroke();
      });

      // 5. Golden Glint Sparkles
      sparkles.forEach(sp => {
        sp.phase += sp.speed;
        const alpha = (Math.sin(sp.phase) + 1) * 0.5;

        ctx.fillStyle = '#fef08a';
        ctx.globalAlpha = alpha * 0.75 * sunsetBrightness;
        ctx.beginPath();
        ctx.arc(sp.x + Math.sin(time + sp.y) * 12, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 6. Coastal Beach Shoreline Silhouette in Foreground
      ctx.fillStyle = '#08080c';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(width * 0.35, height - 35, width, height - 10);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [waveIntensity, sunsetBrightness, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
