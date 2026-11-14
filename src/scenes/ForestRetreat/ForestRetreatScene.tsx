import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createFramePacer } from '../canvasPerformance';

interface Leaf {
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

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
}

export const ForestRetreatScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['forest-retreat'] || {};

  const fogIntensity = specific.fogIntensity ?? 1.0;
  const lightRaysEnabled = specific.lightRaysEnabled ?? true;
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

    // Leaves
    const leafCount = Math.floor((lowPerf ? 15 : 35) * settings.particleDensity);
    const leafColors = ['#86efac', '#4ade80', '#22c55e', '#a3e635', '#fef08a'];
    const leaves: Leaf[] = Array.from({ length: leafCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 9,
      speedY: (0.8 + Math.random() * 1.5) * animIntensity,
      speedX: (Math.random() - 0.4) * 1.2 * animIntensity,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05 * animIntensity,
      opacity: 0.35 + Math.random() * 0.5,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    }));

    // Floating light motes / fireflies
    const moteCount = Math.floor((lowPerf ? 20 : 50) * settings.particleDensity);
    const motes: Particle[] = Array.from({ length: moteCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.4 * animIntensity,
      vy: (Math.random() - 0.5) * 0.4 * animIntensity,
      alpha: 0.2 + Math.random() * 0.7,
      baseAlpha: 0.3 + Math.random() * 0.6,
    }));

    let timeOffset = 0;
    const pacer = createFramePacer(lowPerf ? 30 : 50);

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      timeOffset += 0.015 * animIntensity;

      // 1. Forest Sky Background (Soft early morning emerald canopy glow)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#022c22'); // Deep forest jade
      bgGrad.addColorStop(0.4, '#064e3b');
      bgGrad.addColorStop(0.8, '#065f46');
      bgGrad.addColorStop(1, '#022c22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Far Woodland Silhouette (Deep background hills/trees)
      ctx.fillStyle = '#043429';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const treeTop = height * 0.4 + Math.sin(x * 0.005) * 40 + Math.cos(x * 0.02) * 20;
        ctx.lineTo(x, treeTop);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 3. Sun God Rays through Canopy
      if (lightRaysEnabled) {
        ctx.save();
        const rayAngle = 0.28;
        const rayCount = 5;
        for (let i = 0; i < rayCount; i++) {
          const rayX = width * (0.2 + i * 0.16) + Math.sin(timeOffset * 0.5 + i) * 25;
          const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + height * Math.tan(rayAngle), height);
          const rayAlpha = (0.08 + Math.sin(timeOffset * 0.8 + i * 1.5) * 0.04) * (lowPerf ? 0.7 : 1);
          rayGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha * 1.5})`);
          rayGrad.addColorStop(0.6, `rgba(167, 243, 208, ${rayAlpha})`);
          rayGrad.addColorStop(1, 'rgba(6, 78, 59, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(rayX - 35, 0);
          ctx.lineTo(rayX + 35, 0);
          ctx.lineTo(rayX + height * Math.tan(rayAngle) + 90, height);
          ctx.lineTo(rayX + height * Math.tan(rayAngle) - 90, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 4. Middle Ground Trees (Detailed pine trunks and mossy branches)
      const trunkColor = '#022019';
      ctx.fillStyle = trunkColor;
      const trunkPositions = [0.12, 0.28, 0.65, 0.84, 0.96];
      trunkPositions.forEach((pos, idx) => {
        const tx = width * pos;
        const tw = 28 + (idx % 3) * 14;
        ctx.fillRect(tx - tw * 0.5, 0, tw, height);

        // Branch accents
        ctx.beginPath();
        ctx.arc(tx, height * 0.35 + idx * 40, tw * 1.4, 0, Math.PI);
        ctx.fill();
      });

      // 5. Volumetric Forest Fog Layers
      const fogAlpha = Math.min(0.45, 0.22 * fogIntensity);
      if (fogAlpha > 0.02) {
        const fogGrad1 = ctx.createLinearGradient(0, height * 0.5, 0, height);
        fogGrad1.addColorStop(0, 'rgba(209, 250, 229, 0)');
        fogGrad1.addColorStop(0.5, `rgba(209, 250, 229, ${fogAlpha})`);
        fogGrad1.addColorStop(1, `rgba(6, 78, 59, ${fogAlpha * 1.5})`);
        ctx.fillStyle = fogGrad1;
        ctx.fillRect(0, height * 0.4, width, height * 0.6);
      }

      // 6. Floating Sunlight Motes / Fireflies
      motes.forEach(m => {
        m.x += m.vx;
        m.y += m.vy;

        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;

        const pulse = Math.sin(timeOffset * 2 + m.x * 0.02);
        ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.1, m.baseAlpha + pulse * 0.25)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Drifting Leaves
      leaves.forEach(leaf => {
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(timeOffset + leaf.y * 0.01) * 0.8;
        leaf.rotation += leaf.rotSpeed;

        if (leaf.y > height + 20) {
          leaf.y = -20;
          leaf.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.fillStyle = leaf.color;
        ctx.globalAlpha = leaf.opacity;

        // Leaf shape
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.globalAlpha = 1.0;

      // 8. Foreground Canopy Foliage Silhouette (Top corners)
      ctx.fillStyle = '#011812';
      // Left canopy
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.35, 0, Math.PI * 0.5);
      ctx.fill();
      // Right canopy
      ctx.beginPath();
      ctx.arc(width, 0, width * 0.3, Math.PI * 0.5, Math.PI);
      ctx.fill();

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fogIntensity, lightRaysEnabled, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
