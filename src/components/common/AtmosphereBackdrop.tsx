import React, { useEffect, useRef } from 'react';
import { AtmosphereType } from '../../types/home';

interface AtmosphereBackdropProps {
  atmosphere: AtmosphereType;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  color: string;
  isBright?: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  color?: string;
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

export const AtmosphereBackdrop: React.FC<AtmosphereBackdropProps> = ({ atmosphere }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let time = 0;

    // =========================================================================
    // 1. STARS & COSMIC PARTICLES (Used in Aurora, Midnight, Ocean)
    // =========================================================================
    const starColors = ['#FFFFFF', '#E0F2FE', '#FDE68A', '#DDD6FE', '#BAE6FD'];
    const stars: Star[] = Array.from({ length: 85 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.95,
      radius: i % 12 === 0 ? Math.random() * 1.6 + 1.2 : Math.random() * 1.2 + 0.5,
      baseAlpha: Math.random() * 0.7 + 0.25,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.025 + 0.008,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      isBright: i % 12 === 0,
    }));

    // Floating Stardust Motes
    const stardust: Particle[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -(Math.random() * 0.3 + 0.1),
      baseAlpha: Math.random() * 0.45 + 0.15,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.012,
    }));

    // Realistic Shooting Star
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };
    let nextShootingStarCounter = Math.random() * 260 + 180;

    // Sunset Embers
    const sunsetEmbers: Particle[] = Array.from({ length: 36 }, () => ({
      x: Math.random() * width,
      y: height * 0.45 + Math.random() * height * 0.55,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.4) * 0.35,
      speedY: -(Math.random() * 0.4 + 0.15),
      baseAlpha: Math.random() * 0.55 + 0.25,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.018,
      color: Math.random() > 0.5 ? '#F97316' : '#FB923C',
    }));

    // Ocean Caustic Bubbles
    const oceanBubbles: Particle[] = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -(Math.random() * 0.45 + 0.18),
      baseAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02,
      color: Math.random() > 0.4 ? '#38BDF8' : '#60A5FA',
    }));

    // =========================================================================
    // RENDER ENGINE
    // =========================================================================
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // =======================================================================
      // ATMOSPHERE: AURORA (СЕВЕРНОЕ СИЯНИЕ - VOLUMETRIC REALISTIC CURTAINS)
      // =======================================================================
      if (atmosphere === 'Aurora') {
        // 1. Deep Celestial Polar Void Background
        const auroraSky = ctx.createLinearGradient(0, 0, 0, height);
        auroraSky.addColorStop(0, '#040814');
        auroraSky.addColorStop(0.35, '#07101E');
        auroraSky.addColorStop(0.7, '#0A1526');
        auroraSky.addColorStop(1, '#050A12');
        ctx.fillStyle = auroraSky;
        ctx.fillRect(0, 0, width, height);

        // 2. Polar Starfield (Twinkling through the ionosphere)
        ctx.save();
        stars.forEach((star) => {
          const currentAlpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * (star.baseAlpha * 0.5);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, currentAlpha)})`;
          ctx.fill();

          // Diffraction cross-spikes on bright celestial landmarks
          if (star.isBright && currentAlpha > 0.55) {
            ctx.strokeStyle = `rgba(186, 230, 253, ${currentAlpha * 0.45})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(star.x - star.radius * 3.5, star.y);
            ctx.lineTo(star.x + star.radius * 3.5, star.y);
            ctx.moveTo(star.x, star.y - star.radius * 3.5);
            ctx.lineTo(star.x, star.y + star.radius * 3.5);
            ctx.stroke();
          }
        });
        ctx.restore();

        // 3. Ambient Atmospheric Glow (Volumetric ionospheric green & teal corona)
        ctx.save();
        const ionoGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.32,
          20,
          width * 0.5,
          height * 0.32,
          Math.max(width * 0.65, 500)
        );
        ionoGlow.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
        ionoGlow.addColorStop(0.4, 'rgba(6, 182, 212, 0.14)');
        ionoGlow.addColorStop(0.75, 'rgba(139, 92, 246, 0.08)');
        ionoGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = ionoGlow;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // 4. Volumetric Striated Aurora Curtains (Multi-depth draperies)
        // Real aurora consists of vertical luminous ray striations undulating in folds
        const curtains = [
          // Curtain 1: Distant subtle background violet/cyan ribbon
          {
            baseY: height * 0.16,
            curtainHeight: Math.min(height * 0.36, 280),
            freq1: 0.0022,
            amp1: 35,
            freq2: 0.0045,
            amp2: 18,
            speed: 0.006,
            rayDensity: 5,
            bottomColor: 'rgba(5, 150, 105, 0.35)',
            midColor: 'rgba(6, 182, 212, 0.42)',
            topColor: 'rgba(168, 85, 247, 0.38)',
            tipColor: 'rgba(236, 72, 153, 0.25)',
          },
          // Curtain 2: Dominant foreground emerald/teal drapery with vivid folds
          {
            baseY: height * 0.26,
            curtainHeight: Math.min(height * 0.42, 340),
            freq1: 0.003,
            amp1: 55,
            freq2: 0.0065,
            amp2: 24,
            speed: 0.008,
            rayDensity: 4,
            bottomColor: 'rgba(16, 185, 129, 0.55)',
            midColor: 'rgba(34, 211, 238, 0.48)',
            topColor: 'rgba(139, 92, 246, 0.42)',
            tipColor: 'rgba(217, 70, 239, 0.28)',
          },
          // Curtain 3: S-curve secondary wave flaring into celestial magenta
          {
            baseY: height * 0.38,
            curtainHeight: Math.min(height * 0.38, 300),
            freq1: 0.0025,
            amp1: 45,
            freq2: 0.0055,
            amp2: 20,
            speed: 0.005,
            rayDensity: 5,
            bottomColor: 'rgba(52, 211, 153, 0.45)',
            midColor: 'rgba(14, 165, 233, 0.42)',
            topColor: 'rgba(192, 132, 252, 0.4)',
            tipColor: 'rgba(244, 63, 94, 0.22)',
          },
        ];

        ctx.save();
        // Use additive blending for natural volumetric luminescence
        ctx.globalCompositeOperation = 'screen';

        curtains.forEach((curt) => {
          const step = curt.rayDensity;

          for (let x = 0; x <= width; x += step) {
            // Compound harmonic wave calculation for realistic fold physics
            const waveY =
              curt.baseY +
              Math.sin(x * curt.freq1 + time * curt.speed) * curt.amp1 +
              Math.cos(x * curt.freq2 - time * curt.speed * 1.3) * curt.amp2 +
              Math.sin(x * 0.012 + time * 0.015) * 8;

            // Height breathing
            const dynamicHeight =
              curt.curtainHeight * (0.85 + 0.15 * Math.sin(x * 0.004 + time * 0.01));

            // Shimmering vertical ray striations (Rayed Arc effect)
            const rayShimmer =
              0.65 +
              0.35 *
                Math.sin(x * 0.08 + time * 0.025 + Math.sin(x * 0.015 + time * 0.01));

            // Ray gradient rising from bottom arc to upper magnetosphere
            const rayGrad = ctx.createLinearGradient(x, waveY, x, waveY - dynamicHeight);
            rayGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            rayGrad.addColorStop(0.06, curt.bottomColor);
            rayGrad.addColorStop(0.35, curt.midColor);
            rayGrad.addColorStop(0.72, curt.topColor);
            rayGrad.addColorStop(0.92, curt.tipColor);
            rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = rayGrad;
            ctx.globalAlpha = rayShimmer * 0.95;
            ctx.fillRect(x - step * 0.5, waveY - dynamicHeight, step + 1.5, dynamicHeight);
          }

          // Undulating lower intense ribbon line
          ctx.beginPath();
          ctx.moveTo(0, curt.baseY);
          for (let x = 0; x <= width; x += 15) {
            const dy =
              curt.baseY +
              Math.sin(x * curt.freq1 + time * curt.speed) * curt.amp1 +
              Math.cos(x * curt.freq2 - time * curt.speed * 1.3) * curt.amp2 +
              Math.sin(x * 0.012 + time * 0.015) * 8;
            ctx.lineTo(x, dy);
          }
          ctx.strokeStyle = curt.bottomColor;
          ctx.lineWidth = 3.5;
          ctx.stroke();
        });

        ctx.restore();

        // 5. Floating Celestial Auroral Stardust Particles
        stardust.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.01 + time * 0.01) * 0.35;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          const alpha =
            p.baseAlpha + Math.sin(time * p.pulseSpeed + p.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0.1, alpha)})`;
          ctx.fill();
        });
      }

      // =======================================================================
      // ATMOSPHERE: MIDNIGHT (DEEP COSMIC NEBULA & PRECISION CELESTIAL STARS)
      // =======================================================================
      else if (atmosphere === 'Midnight') {
        // Deep cosmic void gradient
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.2,
          20,
          width * 0.5,
          height * 0.5,
          Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#151928');
        bgGrad.addColorStop(0.45, '#0C101A');
        bgGrad.addColorStop(1, '#05070B');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Cosmic Nebula Cloud (Pulsing slowly in deep space)
        ctx.save();
        const nebulaGrad = ctx.createRadialGradient(
          width * 0.65,
          height * 0.35,
          30,
          width * 0.65,
          height * 0.35,
          Math.min(width * 0.55, 480)
        );
        const nebulaAlpha = 0.12 + 0.04 * Math.sin(time * 0.005);
        nebulaGrad.addColorStop(0, `rgba(99, 102, 241, ${nebulaAlpha})`);
        nebulaGrad.addColorStop(0.4, `rgba(168, 85, 247, ${nebulaAlpha * 0.7})`);
        nebulaGrad.addColorStop(0.8, `rgba(59, 130, 246, ${nebulaAlpha * 0.3})`);
        nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft Lunar Corona Halo (Top-right)
        const moonHalo = ctx.createRadialGradient(
          width * 0.82,
          height * 0.12,
          10,
          width * 0.82,
          height * 0.12,
          Math.min(width * 0.45, 380)
        );
        moonHalo.addColorStop(0, 'rgba(199, 210, 254, 0.16)');
        moonHalo.addColorStop(0.5, 'rgba(147, 197, 253, 0.06)');
        moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = moonHalo;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Twinkling precision stars
        stars.forEach((star) => {
          const currentAlpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * (star.baseAlpha * 0.6);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, currentAlpha)})`;
          ctx.fill();

          if (star.isBright && currentAlpha > 0.6) {
            ctx.strokeStyle = `rgba(199, 210, 254, ${currentAlpha * 0.4})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(star.x - star.radius * 3, star.y);
            ctx.lineTo(star.x + star.radius * 3, star.y);
            ctx.moveTo(star.x, star.y - star.radius * 3);
            ctx.lineTo(star.x, star.y + star.radius * 3);
            ctx.stroke();
          }
        });

        // Shooting Star Logic
        nextShootingStarCounter -= 1;
        if (nextShootingStarCounter <= 0 && !shootingStar.active) {
          shootingStar = {
            x: Math.random() * width * 0.7 + width * 0.1,
            y: Math.random() * height * 0.35 + 20,
            length: Math.random() * 90 + 70,
            speed: Math.random() * 12 + 10,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
            alpha: 1,
            active: true,
          };
          nextShootingStarCounter = Math.random() * 320 + 220;
        }

        if (shootingStar.active) {
          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.alpha -= 0.022;

          if (shootingStar.alpha <= 0) {
            shootingStar.active = false;
          } else {
            const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
            const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

            const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
            grad.addColorStop(0.3, `rgba(147, 197, 253, ${shootingStar.alpha * 0.7})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
          }
        }

        // Drifting Stardust
        stardust.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.01 + time * 0.01) * 0.25;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          const alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.phase) * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(165, 180, 252, ${Math.max(0.08, alpha)})`;
          ctx.fill();
        });
      }

      // =======================================================================
      // ATMOSPHERE: CLOUDS (TROPOSPHERIC LIGHT DIFFUSION & CUMULUS DRIFT)
      // =======================================================================
      else if (atmosphere === 'Clouds') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#F5F8FF');
        skyGrad.addColorStop(0.4, '#FAF9F6');
        skyGrad.addColorStop(1, '#EDE9E2');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Sunlight Diffusion Orb
        const sunAura = ctx.createRadialGradient(
          width * 0.35,
          height * 0.15,
          10,
          width * 0.35,
          height * 0.15,
          Math.min(width * 0.6, 520)
        );
        sunAura.addColorStop(0, 'rgba(254, 240, 138, 0.2)');
        sunAura.addColorStop(0.5, 'rgba(253, 230, 138, 0.08)');
        sunAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunAura;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Soft Cloud Layers
        const cloudLayers = [
          { y: height * 0.15, speed: 0.15, scale: 1.1, alpha: 0.35 },
          { y: height * 0.42, speed: 0.25, scale: 0.9, alpha: 0.4 },
          { y: height * 0.72, speed: 0.35, scale: 1.2, alpha: 0.32 },
        ];

        cloudLayers.forEach((layer, idx) => {
          const offsetX = ((time * layer.speed + idx * 300) % (width + 400)) - 200;
          ctx.save();
          const cloudGrad = ctx.createRadialGradient(
            offsetX,
            layer.y,
            20,
            offsetX,
            layer.y,
            160 * layer.scale
          );
          cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${layer.alpha})`);
          cloudGrad.addColorStop(0.6, `rgba(241, 245, 249, ${layer.alpha * 0.6})`);
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.arc(offsetX, layer.y, 160 * layer.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // =======================================================================
      // ATMOSPHERE: SUNSET (GOLDEN HOUR RAYLEIGH SCATTERING & DUSK EMBERS)
      // =======================================================================
      else if (atmosphere === 'Sunset') {
        const sunsetGrad = ctx.createLinearGradient(0, 0, 0, height);
        sunsetGrad.addColorStop(0, '#1E122B');
        sunsetGrad.addColorStop(0.35, '#3B183A');
        sunsetGrad.addColorStop(0.7, '#6E253A');
        sunsetGrad.addColorStop(1, '#1A0B1E');
        ctx.fillStyle = sunsetGrad;
        ctx.fillRect(0, 0, width, height);

        // Golden Solar Core
        const sunGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.65,
          15,
          width * 0.5,
          height * 0.65,
          Math.min(width * 0.55, 450)
        );
        sunGlow.addColorStop(0, 'rgba(251, 146, 60, 0.35)');
        sunGlow.addColorStop(0.4, 'rgba(244, 63, 94, 0.18)');
        sunGlow.addColorStop(0.8, 'rgba(168, 85, 247, 0.08)');
        sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, width, height);

        // Rising Dusk Embers
        sunsetEmbers.forEach((ember) => {
          ember.y += ember.speedY;
          ember.x += Math.sin(ember.y * 0.015 + time * 0.012) * 0.45;
          if (ember.y < height * 0.35) {
            ember.y = height + 10;
            ember.x = Math.random() * width;
          }
          const alpha = ember.baseAlpha + Math.sin(time * ember.pulseSpeed + ember.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
          ctx.fillStyle = ember.color
            ? ember.color + Math.floor(Math.max(0.12, alpha) * 255).toString(16).padStart(2, '0')
            : `rgba(251, 146, 60, ${alpha})`;
          ctx.fill();
        });
      }

      // =======================================================================
      // ATMOSPHERE: OCEAN (DEEP-SEA ABYSSAL CAUSTICS & BIOLUMINESCENCE)
      // =======================================================================
      else if (atmosphere === 'Ocean') {
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
        oceanGrad.addColorStop(0, '#05233D');
        oceanGrad.addColorStop(0.4, '#091A30');
        oceanGrad.addColorStop(0.8, '#040F1E');
        oceanGrad.addColorStop(1, '#02070D');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Light Shafts (Crepuscular Rays)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 3; i++) {
          const rayX = width * (0.2 + i * 0.3) + Math.sin(time * 0.005 + i) * 60;
          const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 150, height * 0.85);
          rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
          rayGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.08)');
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(rayX - 30, 0);
          ctx.lineTo(rayX + 90, 0);
          ctx.lineTo(rayX + 240, height);
          ctx.lineTo(rayX + 60, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Rising Bioluminescent Bubbles
        oceanBubbles.forEach((bubble) => {
          bubble.y += bubble.speedY;
          bubble.x += Math.sin(bubble.y * 0.015 + time * 0.01) * 0.45;
          if (bubble.y < -10) {
            bubble.y = height + 10;
            bubble.x = Math.random() * width;
          }
          const alpha = bubble.baseAlpha + Math.sin(time * bubble.pulseSpeed + bubble.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fillStyle = bubble.color
            ? bubble.color + Math.floor(Math.max(0.12, alpha) * 255).toString(16).padStart(2, '0')
            : `rgba(56, 189, 248, ${alpha})`;
          ctx.fill();
        });
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [atmosphere]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
