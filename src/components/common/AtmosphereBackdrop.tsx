import React, { useEffect, useRef } from 'react';
import { AtmosphereType } from '../../types/home';

interface AtmosphereBackdropProps {
  atmosphere: AtmosphereType;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  color?: string;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  alpha: number;
  puffs: { offsetX: number; offsetY: number; r: number }[];
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

    // Handle high DPI
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

    // Time tracking
    let time = 0;

    // 1. MIDNIGHT ASSETS: Stars, Shooting Star, Floating motes
    const stars: Particle[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.9,
      radius: Math.random() * 1.6 + 0.6,
      speedX: 0,
      speedY: 0,
      alpha: Math.random() * 0.7 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
    }));

    const stardust: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -(Math.random() * 0.25 + 0.08),
      alpha: Math.random() * 0.4 + 0.1,
      baseAlpha: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01,
    }));

    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };
    let nextShootingStarTime = Math.random() * 300 + 200;

    // 2. CLOUDS ASSETS: Parallax fluffy cloud clusters
    const clouds: Cloud[] = [
      // Layer 1: distant large slow clouds
      {
        x: width * 0.1,
        y: height * 0.15,
        width: 380,
        height: 120,
        speed: 0.12,
        alpha: 0.28,
        puffs: [
          { offsetX: 0, offsetY: 0, r: 70 },
          { offsetX: 60, offsetY: -25, r: 90 },
          { offsetX: 140, offsetY: -35, r: 105 },
          { offsetX: 220, offsetY: -20, r: 95 },
          { offsetX: 290, offsetY: 5, r: 75 },
        ],
      },
      {
        x: width * 0.7,
        y: height * 0.08,
        width: 420,
        height: 130,
        speed: 0.1,
        alpha: 0.25,
        puffs: [
          { offsetX: 0, offsetY: 0, r: 75 },
          { offsetX: 80, offsetY: -30, r: 100 },
          { offsetX: 170, offsetY: -40, r: 110 },
          { offsetX: 260, offsetY: -15, r: 90 },
          { offsetX: 340, offsetY: 10, r: 70 },
        ],
      },
      // Layer 2: mid-ground clouds
      {
        x: width * 0.35,
        y: height * 0.45,
        width: 320,
        height: 100,
        speed: 0.22,
        alpha: 0.32,
        puffs: [
          { offsetX: 0, offsetY: 0, r: 60 },
          { offsetX: 55, offsetY: -20, r: 80 },
          { offsetX: 130, offsetY: -30, r: 90 },
          { offsetX: 200, offsetY: -15, r: 75 },
          { offsetX: 260, offsetY: 5, r: 55 },
        ],
      },
      // Layer 3: gentle lower vapor puffs
      {
        x: width * 0.85,
        y: height * 0.75,
        width: 360,
        height: 110,
        speed: 0.32,
        alpha: 0.3,
        puffs: [
          { offsetX: 0, offsetY: 0, r: 65 },
          { offsetX: 70, offsetY: -25, r: 85 },
          { offsetX: 150, offsetY: -35, r: 95 },
          { offsetX: 230, offsetY: -10, r: 80 },
          { offsetX: 300, offsetY: 15, r: 60 },
        ],
      },
    ];

    // 3. SUNSET ASSETS: Warm dusk embers
    const sunsetEmbers: Particle[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: height * 0.4 + Math.random() * height * 0.6,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.4) * 0.35,
      speedY: -(Math.random() * 0.35 + 0.15),
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015,
      color: Math.random() > 0.5 ? '#F97316' : '#FB923C',
    }));

    // 4. OCEAN ASSETS: Bioluminescent bubbles
    const oceanBubbles: Particle[] = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.4 + 0.7,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -(Math.random() * 0.45 + 0.15),
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02,
      color: Math.random() > 0.4 ? '#38BDF8' : '#60A5FA',
    }));

    // RENDER LOOP
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // ATMOSPHERE: MIDNIGHT
      // ==========================================
      if (atmosphere === 'Midnight') {
        // Deep cosmic void gradient
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.15,
          20,
          width * 0.5,
          height * 0.5,
          Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#151928');
        bgGrad.addColorStop(0.4, '#0D111D');
        bgGrad.addColorStop(1, '#06080E');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft moonlit aura top-right
        const moonAura = ctx.createRadialGradient(
          width * 0.82,
          height * 0.12,
          10,
          width * 0.82,
          height * 0.12,
          Math.min(width * 0.5, 420)
        );
        moonAura.addColorStop(0, 'rgba(185, 195, 255, 0.14)');
        moonAura.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
        moonAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = moonAura;
        ctx.fillRect(0, 0, width, height);

        // Twinkling stars
        stars.forEach((star) => {
          const currentAlpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * (star.baseAlpha * 0.6);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
          ctx.fill();

          // Subtle diamond glimmer on brightest stars
          if (star.radius > 1.8 && currentAlpha > 0.6) {
            ctx.strokeStyle = `rgba(185, 205, 255, ${currentAlpha * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(star.x - 4, star.y);
            ctx.lineTo(star.x + 4, star.y);
            ctx.moveTo(star.x, star.y - 4);
            ctx.lineTo(star.x, star.y + 4);
            ctx.stroke();
          }
        });

        // Floating stardust motes
        stardust.forEach((mote) => {
          mote.x += mote.speedX;
          mote.y += mote.speedY;
          if (mote.y < -10) mote.y = height + 10;
          if (mote.x < -10) mote.x = width + 10;
          if (mote.x > width + 10) mote.x = -10;

          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(195, 215, 255, ${mote.alpha})`;
          ctx.fill();
        });

        // Occasional shooting star
        if (!shootingStar.active && time > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * width * 0.7,
            y: Math.random() * height * 0.35,
            length: Math.random() * 120 + 80,
            speed: Math.random() * 12 + 10,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            alpha: 1,
            active: true,
          };
          nextShootingStarTime = time + Math.random() * 500 + 350;
        }

        if (shootingStar.active) {
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const starGrad = ctx.createLinearGradient(
            tailX,
            tailY,
            shootingStar.x,
            shootingStar.y
          );
          starGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          starGrad.addColorStop(0.8, `rgba(220, 235, 255, ${shootingStar.alpha * 0.7})`);
          starGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha})`);

          ctx.strokeStyle = starGrad;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.alpha -= 0.025;

          if (shootingStar.alpha <= 0) {
            shootingStar.active = false;
          }
        }
      }

      // ==========================================
      // ATMOSPHERE: CLOUDS
      // ==========================================
      else if (atmosphere === 'Clouds') {
        // Warm day sky gradient
        const cloudsSky = ctx.createLinearGradient(0, 0, 0, height);
        cloudsSky.addColorStop(0, '#FAF8F4');
        cloudsSky.addColorStop(0.4, '#F2EFEB');
        cloudsSky.addColorStop(1, '#E6E4DF');
        ctx.fillStyle = cloudsSky;
        ctx.fillRect(0, 0, width, height);

        // Sunlit warm ray halo in upper right
        const sunRay = ctx.createRadialGradient(
          width * 0.85,
          height * 0.05,
          20,
          width * 0.85,
          height * 0.05,
          Math.min(width * 0.6, 500)
        );
        sunRay.addColorStop(0, 'rgba(255, 235, 190, 0.35)');
        sunRay.addColorStop(0.5, 'rgba(255, 243, 215, 0.15)');
        sunRay.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunRay;
        ctx.fillRect(0, 0, width, height);

        // Drifting volumetric cumulus clouds
        clouds.forEach((cloud) => {
          cloud.x += cloud.speed;
          if (cloud.x > width + 100) {
            cloud.x = -cloud.width - 50;
          }

          ctx.save();
          ctx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha})`;
          ctx.beginPath();
          cloud.puffs.forEach((puff) => {
            ctx.arc(
              cloud.x + puff.offsetX,
              cloud.y + puff.offsetY,
              puff.r,
              0,
              Math.PI * 2
            );
          });
          ctx.fill();
          ctx.restore();
        });
      }

      // ==========================================
      // ATMOSPHERE: SUNSET
      // ==========================================
      else if (atmosphere === 'Sunset') {
        // Dramatic dusk gradient shifting slightly over time
        const sunsetGrad = ctx.createLinearGradient(0, 0, 0, height);
        sunsetGrad.addColorStop(0, '#1E1528');
        sunsetGrad.addColorStop(0.25, '#351F38');
        sunsetGrad.addColorStop(0.55, '#682542');
        sunsetGrad.addColorStop(0.82, '#9E3E37');
        sunsetGrad.addColorStop(1, '#D97736');
        ctx.fillStyle = sunsetGrad;
        ctx.fillRect(0, 0, width, height);

        // Golden solar halo near bottom-center
        const sunHalo = ctx.createRadialGradient(
          width * 0.5,
          height * 0.85,
          30,
          width * 0.5,
          height * 0.85,
          Math.min(width * 0.55, 450)
        );
        sunHalo.addColorStop(0, 'rgba(253, 186, 116, 0.35)');
        sunHalo.addColorStop(0.5, 'rgba(249, 115, 22, 0.15)');
        sunHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunHalo;
        ctx.fillRect(0, 0, width, height);

        // Rising golden evening embers
        sunsetEmbers.forEach((ember) => {
          ember.x += ember.speedX + Math.sin(time * 0.02 + ember.phase) * 0.2;
          ember.y += ember.speedY;

          if (ember.y < height * 0.15) {
            ember.y = height + 10;
            ember.x = Math.random() * width;
          }

          const currentAlpha =
            ember.baseAlpha + Math.sin(time * ember.pulseSpeed + ember.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
          ctx.fillStyle = ember.color
            ? ember.color + Math.floor(Math.max(0.1, currentAlpha) * 255).toString(16).padStart(2, '0')
            : `rgba(251, 146, 60, ${currentAlpha})`;
          ctx.fill();
        });
      }

      // ==========================================
      // ATMOSPHERE: OCEAN
      // ==========================================
      else if (atmosphere === 'Ocean') {
        // Deep marine abyssal wash
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
        oceanGrad.addColorStop(0, '#0F2644');
        oceanGrad.addColorStop(0.45, '#0B1E38');
        oceanGrad.addColorStop(0.8, '#07152A');
        oceanGrad.addColorStop(1, '#040B16');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, width, height);

        // Dynamic fluid wave caustics
        ctx.save();
        for (let i = 0; i < 3; i++) {
          const wavePhase = time * 0.008 + i * 1.5;
          const waveY = height * (0.2 + i * 0.25);
          ctx.beginPath();
          ctx.moveTo(0, waveY);

          for (let x = 0; x <= width; x += 25) {
            const dy = Math.sin(x * 0.005 + wavePhase) * 28 + Math.cos(x * 0.009 + wavePhase * 0.8) * 14;
            ctx.lineTo(x, waveY + dy);
          }

          ctx.strokeStyle = i === 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.08)';
          ctx.lineWidth = 35 + i * 15;
          ctx.stroke();
        }
        ctx.restore();

        // Rising bioluminescent bubbles
        oceanBubbles.forEach((bubble) => {
          bubble.y += bubble.speedY;
          bubble.x += Math.sin(bubble.y * 0.015 + time * 0.01) * 0.4;

          if (bubble.y < -10) {
            bubble.y = height + 10;
            bubble.x = Math.random() * width;
          }

          const currentAlpha =
            bubble.baseAlpha + Math.sin(time * bubble.pulseSpeed + bubble.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fillStyle = bubble.color
            ? bubble.color + Math.floor(Math.max(0.1, currentAlpha) * 255).toString(16).padStart(2, '0')
            : `rgba(56, 189, 248, ${currentAlpha})`;
          ctx.fill();
        });
      }

      // ==========================================
      // ATMOSPHERE: AURORA
      // ==========================================
      else if (atmosphere === 'Aurora') {
        // Deep polar night
        const auroraBg = ctx.createLinearGradient(0, 0, 0, height);
        auroraBg.addColorStop(0, '#0C1424');
        auroraBg.addColorStop(0.5, '#070C17');
        auroraBg.addColorStop(1, '#04070D');
        ctx.fillStyle = auroraBg;
        ctx.fillRect(0, 0, width, height);

        // Polar starry sky
        stars.slice(0, 40).forEach((star) => {
          const currentAlpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * (star.baseAlpha * 0.6);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, currentAlpha)})`;
          ctx.fill();
        });

        // Undulating Aurora Curtains (Emerald, Cyan, Violet ribbons)
        const ribbons = [
          { color: 'rgba(16, 185, 129, 0.16)', yOffset: height * 0.18, freq: 0.0035, amp: 45, speed: 0.007 },
          { color: 'rgba(6, 182, 212, 0.14)', yOffset: height * 0.28, freq: 0.0045, amp: 55, speed: 0.009 },
          { color: 'rgba(139, 92, 246, 0.12)', yOffset: height * 0.38, freq: 0.003, amp: 50, speed: 0.006 },
        ];

        ctx.save();
        ribbons.forEach((ribbon) => {
          ctx.beginPath();
          ctx.moveTo(0, ribbon.yOffset);

          for (let x = 0; x <= width; x += 15) {
            const dy =
              Math.sin(x * ribbon.freq + time * ribbon.speed) * ribbon.amp +
              Math.sin(x * ribbon.freq * 2 + time * ribbon.speed * 1.5) * (ribbon.amp * 0.4);
            ctx.lineTo(x, ribbon.yOffset + dy);
          }

          ctx.strokeStyle = ribbon.color;
          ctx.lineWidth = 55;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
        ctx.restore();
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
