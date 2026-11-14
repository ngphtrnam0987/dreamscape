import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { createFramePacer } from '../canvasPerformance';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swingPhase: number;
  swingSpeed: number;
}

export const SnowyAuroraScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['snowy-aurora'] || {};

  const snowIntensity = specific.snowIntensity ?? 1.0;
  const auroraSpeed = specific.auroraSpeed ?? 1.0;
  const auroraGlow = specific.auroraGlow ?? 1.0;
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

    const snowCount = Math.floor((lowPerf ? 80 : 200) * snowIntensity * settings.particleDensity);
    const snowflakes: Snowflake[] = Array.from({ length: snowCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3.5,
      speedY: (0.8 + Math.random() * 1.8) * animIntensity,
      speedX: (Math.random() - 0.5) * 0.8 * animIntensity,
      opacity: 0.3 + Math.random() * 0.6,
      swingPhase: Math.random() * Math.PI * 2,
      swingSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Distant background stars
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.65),
      size: 0.8 + Math.random() * 1.6,
      alpha: 0.3 + Math.random() * 0.7,
    }));

    let time = 0;
    const pacer = createFramePacer(lowPerf ? 30 : 50);

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!pacer.shouldRender(timestamp)) {
        return;
      }

      time += 0.012 * auroraSpeed * animIntensity;

      // 1. Arctic Night Void (Deep dark navy/cyan)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#020b14');
      skyGrad.addColorStop(0.5, '#051b2c');
      skyGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(s => {
        ctx.globalAlpha = s.alpha * (0.7 + Math.sin(time * 2 + s.x) * 0.3);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 2. Dancing Aurora Borealis Curtains
      // Multi-layer sine-wave ribbon blending (Emerald Green, Turquoise, Violet)
      const auroraRibbons = [
        { baseY: height * 0.28, heightAmp: 90, colorStop1: 'rgba(52, 211, 153, 0.45)', colorStop2: 'rgba(16, 185, 129, 0.0)', freq: 0.003, speed: 1.0 },
        { baseY: height * 0.35, heightAmp: 110, colorStop1: 'rgba(45, 212, 191, 0.4)', colorStop2: 'rgba(14, 165, 233, 0.0)', freq: 0.004, speed: 1.4 },
        { baseY: height * 0.22, heightAmp: 80, colorStop1: 'rgba(168, 85, 247, 0.3)', colorStop2: 'rgba(99, 102, 241, 0.0)', freq: 0.0025, speed: 0.8 },
      ];

      auroraRibbons.forEach((ribbon) => {
        const ribbonGrad = ctx.createLinearGradient(0, ribbon.baseY - ribbon.heightAmp, 0, ribbon.baseY + ribbon.heightAmp);
        ribbonGrad.addColorStop(0, ribbon.colorStop2);
        ribbonGrad.addColorStop(0.4, ribbon.colorStop1);
        ribbonGrad.addColorStop(1, ribbon.colorStop2);

        ctx.fillStyle = ribbonGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);

        for (let x = 0; x <= width; x += 20) {
          const wave = Math.sin(x * ribbon.freq + time * ribbon.speed) * 45
            + Math.cos(x * ribbon.freq * 2 - time * ribbon.speed * 0.7) * 25;
          ctx.lineTo(x, ribbon.baseY + wave);
        }

        ctx.lineTo(width, height * 0.6);
        ctx.closePath();
        ctx.fill();
      });

      // 3. Snow-Capped Alpine Mountain Peaks (Background Ridge)
      const mtGrad1 = ctx.createLinearGradient(0, height * 0.45, 0, height);
      mtGrad1.addColorStop(0, '#0c2238');
      mtGrad1.addColorStop(1, '#05111d');
      ctx.fillStyle = mtGrad1;

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.62);
      ctx.lineTo(width * 0.25, height * 0.46); // Peak 1
      ctx.lineTo(width * 0.45, height * 0.58);
      ctx.lineTo(width * 0.72, height * 0.44); // Peak 2
      ctx.lineTo(width * 0.9, height * 0.54);
      ctx.lineTo(width, height * 0.48);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Snow on Peak 1 & Peak 2
      ctx.fillStyle = `rgba(224, 242, 254, ${0.85 * auroraGlow})`;
      // Peak 1 snowcap
      ctx.beginPath();
      ctx.moveTo(width * 0.25, height * 0.46);
      ctx.lineTo(width * 0.29, height * 0.51);
      ctx.lineTo(width * 0.25, height * 0.49);
      ctx.lineTo(width * 0.21, height * 0.51);
      ctx.closePath();
      ctx.fill();

      // Peak 2 snowcap
      ctx.beginPath();
      ctx.moveTo(width * 0.72, height * 0.44);
      ctx.lineTo(width * 0.77, height * 0.49);
      ctx.lineTo(width * 0.72, height * 0.48);
      ctx.lineTo(width * 0.67, height * 0.5);
      ctx.closePath();
      ctx.fill();

      // 4. Foreground Snowy Pine Forest Ridge
      ctx.fillStyle = '#03080e';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.76);
      for (let x = 0; x <= width; x += 30) {
        const treeTop = height * 0.76 + Math.sin(x * 0.01) * 20;
        ctx.lineTo(x, treeTop);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 5. Gently Falling Fluffy Snowflakes
      snowflakes.forEach(snow => {
        snow.y += snow.speedY;
        snow.swingPhase += snow.swingSpeed;
        snow.x += snow.speedX + Math.sin(snow.swingPhase) * 1.2;

        if (snow.y > height + 10) {
          snow.y = -10;
          snow.x = Math.random() * width;
        }
        if (snow.x > width + 10) snow.x = -10;
        if (snow.x < -10) snow.x = width + 10;

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = snow.opacity;
        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [snowIntensity, auroraSpeed, auroraGlow, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
