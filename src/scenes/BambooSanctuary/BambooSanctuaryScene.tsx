import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  pulseSpeed: number;
  baseAlpha: number;
  color: string;
}

export const BambooSanctuaryScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['bamboo-sanctuary'] || {};

  const fireflyDensity = specific.fireflyDensity ?? 1.0;
  const bambooSway = specific.bambooSway ?? 1.0;
  const mistDensity = specific.mistDensity ?? 1.0;
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

    // Glowing fireflies
    const fireflyCount = Math.floor((lowPerf ? 30 : 85) * fireflyDensity * settings.particleDensity);
    const fireflyColors = ['#bef264', '#fde047', '#86efac', '#a3e635'];

    const fireflies: Firefly[] = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6 * animIntensity,
      vy: (Math.random() - 0.5) * 0.6 * animIntensity,
      size: 1.5 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.03 + Math.random() * 0.05,
      baseAlpha: 0.3 + Math.random() * 0.7,
      color: fireflyColors[Math.floor(Math.random() * fireflyColors.length)],
    }));

    // Bamboo stalk positions
    const stalkCount = 26;
    const stalks = Array.from({ length: stalkCount }, (_, i) => ({
      x: (i / stalkCount) * width + (Math.random() - 0.5) * 30,
      w: 16 + (i % 4) * 8,
      nodes: 6 + (i % 3) * 2,
      depth: (i % 3) + 1, // 1: far, 2: mid, 3: near
    }));

    let time = 0;

    const render = () => {
      if (document.visibilityState === 'hidden') {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015 * animIntensity;

      // 1. Deep Bamboo Forest Twilight Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#021810'); // Deep jade midnight
      skyGrad.addColorStop(0.5, '#052e1f');
      skyGrad.addColorStop(1, '#021a12');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Far Background Bamboo Stalks
      stalks.forEach((st, idx) => {
        const sway = Math.sin(time * 0.8 + idx * 0.5) * 12 * bambooSway * (st.depth * 0.4);
        const stalkX = st.x;

        if (st.depth === 1) {
          ctx.fillStyle = '#063826';
          ctx.beginPath();
          ctx.moveTo(stalkX - st.w * 0.4, height);
          ctx.lineTo(stalkX + sway - st.w * 0.3, 0);
          ctx.lineTo(stalkX + sway + st.w * 0.3, 0);
          ctx.lineTo(stalkX + st.w * 0.4, height);
          ctx.closePath();
          ctx.fill();
        }
      });

      // 3. Ground Mist Layer (Far)
      const mistAlpha = 0.25 * mistDensity;
      const mistGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
      mistGrad.addColorStop(0, 'rgba(167, 243, 208, 0)');
      mistGrad.addColorStop(0.5, `rgba(167, 243, 208, ${mistAlpha})`);
      mistGrad.addColorStop(1, 'rgba(2, 26, 18, 0.9)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);

      // 4. Mid & Near Ground Bamboo Stalks with Segments
      stalks.forEach((st, idx) => {
        if (st.depth > 1) {
          const sway = Math.sin(time * 0.8 + idx * 0.5) * 12 * bambooSway * (st.depth * 0.4);
          const stalkX = st.x;

          ctx.fillStyle = st.depth === 2 ? '#074831' : '#032c1d';

          ctx.beginPath();
          ctx.moveTo(stalkX - st.w * 0.5, height);
          ctx.lineTo(stalkX + sway - st.w * 0.4, 0);
          ctx.lineTo(stalkX + sway + st.w * 0.4, 0);
          ctx.lineTo(stalkX + st.w * 0.5, height);
          ctx.closePath();
          ctx.fill();

          // Bamboo Segments / Node rings
          ctx.fillStyle = '#0a5c3f';
          for (let n = 1; n <= st.nodes; n++) {
            const ny = (n / (st.nodes + 1)) * height;
            const nx = stalkX + (sway * (1 - ny / height));
            ctx.fillRect(nx - st.w * 0.55, ny, st.w * 1.1, 4);
          }
        }
      });

      // 5. Stone Lantern with Warm Amber Flame Glow
      const lanternX = width * 0.22;
      const lanternY = height * 0.8;
      const candleGlow = ctx.createRadialGradient(lanternX, lanternY - 14, 5, lanternX, lanternY - 14, 80);
      candleGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
      candleGlow.addColorStop(0.4, 'rgba(217, 119, 6, 0.2)');
      candleGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = candleGlow;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY - 14, 80, 0, Math.PI * 2);
      ctx.fill();

      // Lantern Silhouette
      ctx.fillStyle = '#021810';
      ctx.fillRect(lanternX - 8, lanternY, 16, 28);
      ctx.fillRect(lanternX - 16, lanternY - 24, 32, 6);
      ctx.fillRect(lanternX - 12, lanternY - 18, 24, 18);

      // 6. Floating Pulsating Fireflies (Đom Đóm)
      fireflies.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        f.phase += f.pulseSpeed;

        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        const pulse = (Math.sin(f.phase) + 1) * 0.5;
        const currentAlpha = f.baseAlpha * (0.3 + pulse * 0.7);

        // Firefly soft light halo
        const halo = ctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, f.size * 4);
        halo.addColorStop(0, f.color);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.globalAlpha = currentAlpha * 0.8;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Firefly bright core
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 7. Foreground Mossy Path Silhouette
      ctx.fillStyle = '#01120b';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(width * 0.4, height - 35, width, height - 10);
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
  }, [fireflyDensity, bambooSway, mistDensity, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
