import React, { useEffect, useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const CosmicDreamScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useSceneStore();
  const specific = settings.specific['cosmic-dream'] || {};

  const starDensity = specific.starDensity ?? 1.0;
  const cameraDrift = specific.cameraDriftEnabled ?? true;
  const nebulaGlow = specific.nebulaGlow ?? 1.0;
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

    // 3D Depth Starfield
    const starCount = Math.floor((lowPerf ? 150 : 380) * starDensity * settings.particleDensity);
    const starColors = ['#ffffff', '#bae6fd', '#fbcfe8', '#e9d5ff', '#fed7aa'];
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: 0.8 + Math.random() * 2.2,
      baseAlpha: 0.3 + Math.random() * 0.7,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.05,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Shooting star state
    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 120,
      speed: 18,
      angle: Math.PI / 4,
      alpha: 0,
      active: false,
    };

    let nextShootingStarTime = Date.now() + 4000;
    let time = 0;

    const render = () => {
      if (document.visibilityState === 'hidden') {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.01 * animIntensity;

      // 1. Deep Space Void Backdrop
      ctx.fillStyle = '#03020a';
      ctx.fillRect(0, 0, width, height);

      // 2. Multi-Layer Radiant Ethereal Nebulae
      if (!lowPerf) {
        // Nebula 1: Deep Violet / Purple
        const neb1X = width * 0.3 + (cameraDrift ? Math.sin(time * 0.4) * 40 : 0);
        const neb1Y = height * 0.4 + (cameraDrift ? Math.cos(time * 0.3) * 30 : 0);
        const neb1Grad = ctx.createRadialGradient(neb1X, neb1Y, 30, neb1X, neb1Y, width * 0.48);
        neb1Grad.addColorStop(0, `rgba(147, 51, 234, ${0.28 * nebulaGlow})`);
        neb1Grad.addColorStop(0.5, `rgba(88, 28, 135, ${0.14 * nebulaGlow})`);
        neb1Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = neb1Grad;
        ctx.fillRect(0, 0, width, height);

        // Nebula 2: Celestial Cyan / Indigo
        const neb2X = width * 0.72 + (cameraDrift ? Math.cos(time * 0.35) * 50 : 0);
        const neb2Y = height * 0.6 + (cameraDrift ? Math.sin(time * 0.45) * 35 : 0);
        const neb2Grad = ctx.createRadialGradient(neb2X, neb2Y, 20, neb2X, neb2Y, width * 0.42);
        neb2Grad.addColorStop(0, `rgba(56, 189, 248, ${0.22 * nebulaGlow})`);
        neb2Grad.addColorStop(0.5, `rgba(30, 58, 138, ${0.12 * nebulaGlow})`);
        neb2Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = neb2Grad;
        ctx.fillRect(0, 0, width, height);

        // Nebula 3: Rose / Magenta Core
        const neb3X = width * 0.5 + (cameraDrift ? Math.sin(time * 0.5) * 30 : 0);
        const neb3Y = height * 0.25;
        const neb3Grad = ctx.createRadialGradient(neb3X, neb3Y, 15, neb3X, neb3Y, width * 0.35);
        neb3Grad.addColorStop(0, `rgba(244, 63, 94, ${0.18 * nebulaGlow})`);
        neb3Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = neb3Grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. 3D Parallax Starfield
      const fov = 400;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const starSpeed = (0.6 + (cameraDrift ? 0.4 : 0)) * animIntensity;

      stars.forEach(star => {
        star.z -= starSpeed;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = fov / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          star.twinklePhase += star.twinkleSpeed;
          const twinkle = (Math.sin(star.twinklePhase) + 1) * 0.5;
          const alpha = star.baseAlpha * (0.6 + twinkle * 0.4) * (1 - star.z / width);

          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
          ctx.beginPath();
          ctx.arc(px, py, star.size * (1 - star.z / width * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      // 4. Shooting Stars
      if (!shootingStar.active && Date.now() > nextShootingStarTime) {
        shootingStar.active = true;
        shootingStar.x = Math.random() * width * 0.7;
        shootingStar.y = Math.random() * (height * 0.4);
        shootingStar.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        shootingStar.length = 80 + Math.random() * 80;
        shootingStar.speed = (16 + Math.random() * 10) * animIntensity;
        shootingStar.alpha = 1.0;
      }

      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.02 * animIntensity;

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
          nextShootingStarTime = Date.now() + 6000 + Math.random() * 12000;
        } else {
          ctx.save();
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const meteorGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          meteorGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          meteorGrad.addColorStop(0.7, `rgba(186, 230, 253, ${shootingStar.alpha * 0.6})`);
          meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha})`);

          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          // Meteor head glow
          ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.alpha})`;
          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [starDensity, cameraDrift, nebulaGlow, animIntensity, lowPerf, settings.particleDensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
