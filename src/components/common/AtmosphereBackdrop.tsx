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

interface CloudCluster {
  x: number;
  y: number;
  scale: number;
  speed: number;
  alpha: number;
  puffs: { dx: number; dy: number; r: number }[];
}

export const AtmosphereBackdrop: React.FC<AtmosphereBackdropProps> = ({ atmosphere }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
      ctx.scale(dpr, dpr);
    };

    setupDimensions();

    const handleResize = () => {
      setupDimensions();
    };

    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let time = 0;

    // =========================================================================
    // 1. STARS & COSMIC PARTICLES (Midnight, Aurora, Ocean)
    // =========================================================================
    const starColors = ['#FFFFFF', '#E0F2FE', '#FEF3C7', '#EDE9FE', '#BAE6FD'];
    const stars: Star[] = Array.from({ length: 90 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.95,
      radius: i % 10 === 0 ? Math.random() * 1.5 + 1.2 : Math.random() * 1.0 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.25,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.006,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      isBright: i % 10 === 0,
    }));

    // Floating Stardust Motes
    const stardust: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -(Math.random() * 0.25 + 0.08),
      baseAlpha: Math.random() * 0.45 + 0.15,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.012,
    }));

    // Shooting Star for Midnight
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };
    let nextShootingStarCounter = Math.random() * 240 + 160;

    // Sunset Dusk Embers
    const sunsetEmbers: Particle[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: height * 0.4 + Math.random() * height * 0.6,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.4) * 0.3,
      speedY: -(Math.random() * 0.35 + 0.12),
      baseAlpha: Math.random() * 0.55 + 0.25,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.016,
      color: Math.random() > 0.5 ? '#F97316' : '#FBBF24',
    }));

    // Ocean Bioluminescent Bubbles
    const oceanBubbles: Particle[] = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: -(Math.random() * 0.38 + 0.14),
      baseAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.018,
      color: Math.random() > 0.4 ? '#38BDF8' : '#34D399',
    }));

    // Realistic Clouds Data Structure: Clusters of overlapping puffy spheres
    const cloudClusters: CloudCluster[] = [
      {
        x: width * 0.05,
        y: height * 0.20,
        scale: 1.1,
        speed: 0.16,
        alpha: 0.55,
        puffs: [
          { dx: 0, dy: 0, r: 120 },
          { dx: 90, dy: -25, r: 140 },
          { dx: 180, dy: -10, r: 110 },
          { dx: 260, dy: 15, r: 90 },
          { dx: 110, dy: 30, r: 100 },
        ],
      },
      {
        x: width * 0.55,
        y: height * 0.12,
        scale: 0.9,
        speed: 0.11,
        alpha: 0.48,
        puffs: [
          { dx: 0, dy: 0, r: 100 },
          { dx: 80, dy: -20, r: 125 },
          { dx: 170, dy: -15, r: 110 },
          { dx: 240, dy: 10, r: 85 },
          { dx: 90, dy: 25, r: 90 },
        ],
      },
      {
        x: width * 0.25,
        y: height * 0.45,
        scale: 1.35,
        speed: 0.22,
        alpha: 0.42,
        puffs: [
          { dx: 0, dy: 0, r: 130 },
          { dx: 110, dy: -30, r: 160 },
          { dx: 220, dy: -15, r: 140 },
          { dx: 310, dy: 20, r: 110 },
          { dx: 140, dy: 35, r: 120 },
        ],
      },
      {
        x: width * 0.75,
        y: height * 0.52,
        scale: 1.2,
        speed: 0.18,
        alpha: 0.38,
        puffs: [
          { dx: 0, dy: 0, r: 110 },
          { dx: 95, dy: -25, r: 135 },
          { dx: 190, dy: -10, r: 120 },
          { dx: 270, dy: 15, r: 95 },
        ],
      },
    ];

    // =========================================================================
    // RENDER ENGINE
    // =========================================================================
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // =======================================================================
      // 1. ATMOSPHERE: CLOUDS (LUMINOUS TROPOSPHERIC SKY & PARALLAX DRIFT)
      // =======================================================================
      if (atmosphere === 'Clouds') {
        // Luminous Sky Gradient: Fresh Cerulean Blue to Warm Airy Horizon
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#D8EBFC');   // Soft azure sky zenith
        skyGrad.addColorStop(0.35, '#E8F3FD'); // Airy light blue
        skyGrad.addColorStop(0.70, '#F5F7FB'); // Soft ivory horizon
        skyGrad.addColorStop(1, '#F4EEE6');    // Warm editorial ground tone
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Warm Solar Corona Diffusion in Upper Right
        ctx.save();
        const sunGlow = ctx.createRadialGradient(
          width * 0.78,
          height * 0.14,
          20,
          width * 0.78,
          height * 0.14,
          Math.min(width * 0.6, 550)
        );
        sunGlow.addColorStop(0, 'rgba(255, 248, 220, 0.55)');
        sunGlow.addColorStop(0.3, 'rgba(254, 243, 199, 0.28)');
        sunGlow.addColorStop(0.7, 'rgba(238, 242, 255, 0.12)');
        sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Volumetric Cumulus Clouds: Overlapping soft gradient puffs
        cloudClusters.forEach((cluster) => {
          cluster.x += cluster.speed;
          const clusterWidth = 360 * cluster.scale;
          if (cluster.x > width + 100) {
            cluster.x = -clusterWidth - 100;
          }

          ctx.save();
          cluster.puffs.forEach((puff) => {
            const px = cluster.x + puff.dx * cluster.scale;
            const py = cluster.y + puff.dy * cluster.scale;
            const pr = puff.r * cluster.scale;

            const puffGrad = ctx.createRadialGradient(
              px - pr * 0.15,
              py - pr * 0.2,
              pr * 0.1,
              px,
              py,
              pr
            );
            puffGrad.addColorStop(0, `rgba(255, 255, 255, ${cluster.alpha * 0.95})`);
            puffGrad.addColorStop(0.55, `rgba(248, 250, 252, ${cluster.alpha * 0.75})`);
            puffGrad.addColorStop(0.85, `rgba(226, 232, 240, ${cluster.alpha * 0.35})`);
            puffGrad.addColorStop(1, 'rgba(241, 245, 249, 0)');

            ctx.fillStyle = puffGrad;
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        });

        // Floating Sunlit Dust Motes
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
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, alpha * 0.8)})`;
          ctx.fill();
        });
      }

      // =======================================================================
      // 2. ATMOSPHERE: MIDNIGHT (DEEP COSMIC NEBULA & TWINKLING STARFIELD)
      // =======================================================================
      else if (atmosphere === 'Midnight') {
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.25,
          40,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.9
        );
        bgGrad.addColorStop(0, '#101526');  // Cosmic deep indigo
        bgGrad.addColorStop(0.45, '#0A0D18'); // Midnight navy
        bgGrad.addColorStop(1, '#040509');    // Polar void
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Cosmic Nebula Cloud (Pulsing slowly in deep space)
        ctx.save();
        const nebulaGrad = ctx.createRadialGradient(
          width * 0.62,
          height * 0.32,
          30,
          width * 0.62,
          height * 0.32,
          Math.min(width * 0.55, 480)
        );
        const nebulaAlpha = 0.14 + 0.04 * Math.sin(time * 0.005);
        nebulaGrad.addColorStop(0, `rgba(99, 102, 241, ${nebulaAlpha})`);
        nebulaGrad.addColorStop(0.4, `rgba(168, 85, 247, ${nebulaAlpha * 0.7})`);
        nebulaGrad.addColorStop(0.8, `rgba(59, 130, 246, ${nebulaAlpha * 0.3})`);
        nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGrad;
        ctx.fillRect(0, 0, width, height);

        // Lunar Corona Halo in Top Right
        const moonHalo = ctx.createRadialGradient(
          width * 0.82,
          height * 0.14,
          10,
          width * 0.82,
          height * 0.14,
          Math.min(width * 0.45, 380)
        );
        moonHalo.addColorStop(0, 'rgba(199, 210, 254, 0.18)');
        moonHalo.addColorStop(0.5, 'rgba(147, 197, 253, 0.07)');
        moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = moonHalo;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Multi-tier Twinkling Stars
        stars.forEach((star) => {
          const currentAlpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * (star.baseAlpha * 0.6);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, currentAlpha)})`;
          ctx.fill();

          // Diffraction Spikes for brightest stars
          if (star.isBright && currentAlpha > 0.6) {
            ctx.strokeStyle = `rgba(199, 210, 254, ${currentAlpha * 0.45})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(star.x - star.radius * 3.2, star.y);
            ctx.lineTo(star.x + star.radius * 3.2, star.y);
            ctx.moveTo(star.x, star.y - star.radius * 3.2);
            ctx.lineTo(star.x, star.y + star.radius * 3.2);
            ctx.stroke();
          }
        });

        // Shooting Star
        nextShootingStarCounter -= 1;
        if (nextShootingStarCounter <= 0 && !shootingStar.active) {
          shootingStar = {
            x: Math.random() * width * 0.7 + width * 0.1,
            y: Math.random() * height * 0.35 + 20,
            length: Math.random() * 95 + 75,
            speed: Math.random() * 12 + 10,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
            alpha: 1,
            active: true,
          };
          nextShootingStarCounter = Math.random() * 300 + 200;
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

        // Drifting Cosmic Stardust
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
      // 3. ATMOSPHERE: SUNSET (GOLDEN-HOUR RAYLEIGH SCATTERING & DUSK EMBERS)
      // =======================================================================
      else if (atmosphere === 'Sunset') {
        const sunsetGrad = ctx.createLinearGradient(0, 0, 0, height);
        sunsetGrad.addColorStop(0, '#160826');    // Zenith deep violet
        sunsetGrad.addColorStop(0.28, '#340F37'); // Rich plum
        sunsetGrad.addColorStop(0.55, '#681B3E'); // Crimson twilight
        sunsetGrad.addColorStop(0.78, '#B83A2E'); // Vermilion horizon
        sunsetGrad.addColorStop(0.92, '#E86326'); // Golden orange
        sunsetGrad.addColorStop(1, '#FBBF24');    // Radiant horizon amber
        ctx.fillStyle = sunsetGrad;
        ctx.fillRect(0, 0, width, height);

        // Radiant Solar Core on Horizon
        ctx.save();
        const sunCore = ctx.createRadialGradient(
          width * 0.5,
          height * 0.78,
          25,
          width * 0.5,
          height * 0.78,
          Math.min(width * 0.65, 520)
        );
        sunCore.addColorStop(0, 'rgba(254, 240, 138, 0.62)');
        sunCore.addColorStop(0.35, 'rgba(251, 146, 60, 0.38)');
        sunCore.addColorStop(0.7, 'rgba(244, 63, 94, 0.16)');
        sunCore.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = sunCore;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Silhouetted Distant Sunset Cloud Strata
        for (let i = 0; i < 3; i++) {
          const cy = height * (0.62 + i * 0.12);
          const cx = ((time * (0.12 + i * 0.08)) % (width + 300)) - 150;
          ctx.save();
          const cloudGrad = ctx.createLinearGradient(0, cy - 35, 0, cy + 35);
          cloudGrad.addColorStop(0, 'rgba(40, 10, 35, 0.38)');
          cloudGrad.addColorStop(1, 'rgba(25, 5, 25, 0)');
          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 280 + i * 60, 28 + i * 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Rising Dusk Embers
        sunsetEmbers.forEach((ember) => {
          ember.y += ember.speedY;
          ember.x += Math.sin(ember.y * 0.015 + time * 0.012) * 0.45;
          if (ember.y < height * 0.3) {
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
      // 4. ATMOSPHERE: OCEAN (DEEP-SEA ABYSSAL CAUSTICS & BIOLUMINESCENCE)
      // =======================================================================
      else if (atmosphere === 'Ocean') {
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
        oceanGrad.addColorStop(0, '#031728');    // Deep sapphire surface
        oceanGrad.addColorStop(0.35, '#05223A'); // Ocean depth
        oceanGrad.addColorStop(0.70, '#031424'); // Abyssal zone
        oceanGrad.addColorStop(1, '#010810');    // Ocean floor void
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Crepuscular Light Shafts
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 4; i++) {
          const rayX = width * (0.15 + i * 0.25) + Math.sin(time * 0.005 + i * 1.5) * 55;
          const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 160, height * 0.88);
          rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
          rayGrad.addColorStop(0.45, 'rgba(14, 165, 233, 0.10)');
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(rayX - 35, 0);
          ctx.lineTo(rayX + 90, 0);
          ctx.lineTo(rayX + 240, height);
          ctx.lineTo(rayX + 70, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Floating Bioluminescent Bubbles & Plankton
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

      // =======================================================================
      // 5. ATMOSPHERE: AURORA (ARCTIC NIGHT SKY & VOLUMETRIC NORTHERN LIGHTS)
      // =======================================================================
      else if (atmosphere === 'Aurora') {
        const auroraSky = ctx.createLinearGradient(0, 0, 0, height);
        auroraSky.addColorStop(0, '#040710');    // Polar void
        auroraSky.addColorStop(0.5, '#07111E');  // High atmosphere
        auroraSky.addColorStop(1, '#02050A');    // Deep horizon
        ctx.fillStyle = auroraSky;
        ctx.fillRect(0, 0, width, height);

        // Distant Starfield behind the aurora
        stars.forEach((star) => {
          const currentAlpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * (star.baseAlpha * 0.5);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, currentAlpha)})`;
          ctx.fill();
        });

        // 4 Volumetric Undulating Curtains with Vertical Rayed Striations
        const curtains = [
          {
            baseY: height * 0.38,
            curtainHeight: Math.max(height * 0.48, 380),
            freq1: 0.0022,
            amp1: 55,
            freq2: 0.0044,
            amp2: 28,
            speed: 0.006,
            rayDensity: 4,
            bottomColor: 'rgba(52, 211, 153, 0.55)', // Emerald
            midColor: 'rgba(6, 182, 212, 0.45)',    // Cyan
            topColor: 'rgba(168, 85, 247, 0.35)',   // Violet
            tipColor: 'rgba(236, 72, 153, 0.18)',   // Magenta
          },
          {
            baseY: height * 0.55,
            curtainHeight: Math.max(height * 0.52, 420),
            freq1: 0.0018,
            amp1: 65,
            freq2: 0.0036,
            amp2: 32,
            speed: 0.0048,
            rayDensity: 4,
            bottomColor: 'rgba(16, 185, 129, 0.58)',
            midColor: 'rgba(14, 165, 233, 0.48)',
            topColor: 'rgba(139, 92, 246, 0.38)',
            tipColor: 'rgba(244, 63, 94, 0.20)',
          },
          {
            baseY: height * 0.78,
            curtainHeight: Math.max(height * 0.46, 360),
            freq1: 0.0024,
            amp1: 45,
            freq2: 0.0048,
            amp2: 24,
            speed: 0.0052,
            rayDensity: 5,
            bottomColor: 'rgba(5, 150, 105, 0.45)',
            midColor: 'rgba(56, 189, 248, 0.36)',
            topColor: 'rgba(99, 102, 241, 0.28)',
            tipColor: 'rgba(192, 132, 252, 0.15)',
          },
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        curtains.forEach((curt) => {
          const step = curt.rayDensity;

          for (let x = 0; x <= width; x += step) {
            const waveY =
              curt.baseY +
              Math.sin(x * curt.freq1 + time * curt.speed) * curt.amp1 +
              Math.cos(x * curt.freq2 - time * curt.speed * 1.3) * curt.amp2 +
              Math.sin(x * 0.012 + time * 0.015) * 8;

            const dynamicHeight =
              curt.curtainHeight * (0.85 + 0.15 * Math.sin(x * 0.004 + time * 0.01));

            const rayShimmer =
              0.68 +
              0.32 *
                Math.sin(x * 0.08 + time * 0.025 + Math.sin(x * 0.015 + time * 0.01));

            const rayGrad = ctx.createLinearGradient(x, waveY, x, waveY - dynamicHeight);
            rayGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            rayGrad.addColorStop(0.08, curt.bottomColor);
            rayGrad.addColorStop(0.38, curt.midColor);
            rayGrad.addColorStop(0.72, curt.topColor);
            rayGrad.addColorStop(0.92, curt.tipColor);
            rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = rayGrad;
            ctx.globalAlpha = rayShimmer * 0.95;
            ctx.fillRect(x - step * 0.5, waveY - dynamicHeight, step + 1.5, dynamicHeight);
          }
        });

        ctx.restore();

        // Auroral Stardust Motes
        stardust.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.01 + time * 0.01) * 0.35;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          const alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0.1, alpha)})`;
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
