import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  driftVx: number;
  driftVy: number;
  radius: number;
  baseAlpha: number;
  colorType: 'white' | 'lavender' | 'purple' | 'violet';
  twinklePhase: number;
  twinkleSpeed: number;
  mass: number;
  orbitDirection: number;
  hasFlare: boolean;
  history: Array<{ x: number; y: number }>;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  size: number;
  alpha: number;
  color: string;
  tailColor: string;
  active: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export const GravityStarsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();

    // Mouse & Gravity State
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      radius: 260,
    };

    // Arrays
    let stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    const shockwaves: Shockwave[] = [];

    // Particle density calculation
    const getStarCount = () => {
      const area = width * height;
      return Math.floor(Math.min(180, Math.max(75, area / 11000)));
    };

    const colorPalettes = {
      dark: {
        white: '#ffffff',
        lavender: '#e2ccff',
        violet: '#c06bff',
        purple: '#9d2ec5',
      },
      light: {
        white: '#4b1772',
        lavender: '#7A1CAC',
        violet: '#8822c4',
        purple: '#560e7a',
      },
    };

    const createStars = () => {
      stars = [];
      const count = getStarCount();
      const colorTypes: Array<'white' | 'lavender' | 'purple' | 'violet'> = [
        'white',
        'lavender',
        'violet',
        'purple',
      ];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() < 0.7 ? Math.random() * 1.4 + 0.8 : Math.random() * 1.8 + 1.8;
        const typeIndex = Math.floor(Math.random() * colorTypes.length);

        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          driftVx: (Math.random() - 0.5) * 0.25,
          driftVy: (Math.random() - 0.5) * 0.25,
          radius,
          baseAlpha: Math.random() * 0.55 + 0.35,
          colorType: colorTypes[typeIndex],
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          mass: radius * 0.8 + 0.6,
          orbitDirection: Math.random() > 0.5 ? 1 : -1,
          hasFlare: radius > 2.0 && Math.random() > 0.45,
          history: [],
        });
      }
    };

    createStars();

    // Spawn shooting star occasionally
    let lastShootingStarTime = Date.now();
    const spawnShootingStar = () => {
      const isDark = themeRef.current === 'dark';
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4; // roughly 45 degrees downward
      const speed = Math.random() * 9 + 11;
      const startX = Math.random() * (width * 0.8);
      const startY = Math.random() * (height * 0.3);

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 100,
        size: Math.random() * 1.8 + 1.4,
        alpha: 1,
        color: isDark ? '#ffffff' : '#7A1CAC',
        tailColor: isDark ? 'rgba(192, 107, 255, 0.9)' : 'rgba(122, 28, 172, 0.7)',
        active: true,
      });
    };

    // Trigger gravity burst shockwave
    const triggerShockwave = (x: number, y: number) => {
      shockwaves.push({
        x,
        y,
        radius: 0,
        maxRadius: 280,
        alpha: 0.8,
        speed: 9,
      });

      // Apply sudden burst push to nearby stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const dx = star.x - x;
        const dy = star.y - y;
        const dist = Math.hypot(dx, dy);

        if (dist < 260 && dist > 1) {
          const impulse = (1 - dist / 260) * 12;
          star.vx += (dx / dist) * impulse;
          star.vy += (dy / dist) * impulse;
        }
      }
    };

    // Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleMouseDown = (e: MouseEvent) => {
      triggerShockwave(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.targetX = touch.clientX;
        mouse.targetY = touch.clientY;
        mouse.active = true;
        triggerShockwave(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    const handleWindowResize = () => {
      resize();
      createStars();
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Main Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = themeRef.current === 'dark';
      const palette = isDark ? colorPalettes.dark : colorPalettes.light;

      // Smooth mouse coordinate interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Draw faint Gravity Lens / Cosmic Well Glow around cursor
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const auraRadius = mouse.radius;
        const auraGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          auraRadius
        );

        if (isDark) {
          auraGrad.addColorStop(0, 'rgba(192, 107, 255, 0.16)');
          auraGrad.addColorStop(0.3, 'rgba(122, 28, 172, 0.10)');
          auraGrad.addColorStop(0.7, 'rgba(122, 28, 172, 0.03)');
          auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          auraGrad.addColorStop(0, 'rgba(122, 28, 172, 0.10)');
          auraGrad.addColorStop(0.4, 'rgba(157, 46, 197, 0.05)');
          auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();

        // Subtle glowing Event Horizon Ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 38, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? 'rgba(192, 107, 255, 0.22)'
          : 'rgba(122, 28, 172, 0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Render & Update Shockwaves
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwaves[sIdx];
        sw.radius += sw.speed;
        sw.alpha -= 0.02;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(sIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(192, 107, 255, ${sw.alpha * 0.7})`
          : `rgba(122, 28, 172, ${sw.alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = isDark ? '#c06bff' : '#7A1CAC';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // Spawn periodic shooting stars
      const now = Date.now();
      if (now - lastShootingStarTime > 4500 && Math.random() < 0.035) {
        spawnShootingStar();
        lastShootingStarTime = now;
      }

      // Update & Render Shooting Stars
      for (let idx = shootingStars.length - 1; idx >= 0; idx--) {
        const ss = shootingStars[idx];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha -= 0.012;

        // Gravitational deflection if near mouse
        if (mouse.active) {
          const dx = mouse.x - ss.x;
          const dy = mouse.y - ss.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220 && dist > 1) {
            const bend = 0.35 * (1 - dist / 220);
            ss.vx += (dx / dist) * bend;
            ss.vy += (dy / dist) * bend;
          }
        }

        if (ss.alpha <= 0 || ss.x > width + 200 || ss.y > height + 200) {
          shootingStars.splice(idx, 1);
          continue;
        }

        // Shooting Star tail vector
        const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
        const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

        const tailGradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        tailGradient.addColorStop(0, ss.color);
        tailGradient.addColorStop(0.3, ss.tailColor);
        tailGradient.addColorStop(1, 'rgba(122, 28, 172, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGradient;
        ctx.lineWidth = ss.size;
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, ss.alpha);
        ctx.stroke();

        // Glowing comet head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = ss.color;
        ctx.shadowColor = ss.tailColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // Update and Render Stars
      const gravityRadius = mouse.radius;
      const gravityStrength = 0.55;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Cosmic natural drift
        star.baseX += star.driftVx;
        star.baseY += star.driftVy;

        // Screen wrap for base coordinate
        if (star.baseX < 0) star.baseX = width;
        if (star.baseX > width) star.baseX = 0;
        if (star.baseY < 0) star.baseY = height;
        if (star.baseY > height) star.baseY = 0;

        // Gravity interaction with mouse
        if (mouse.active) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.hypot(dx, dy);

          if (dist < gravityRadius && dist > 1) {
            const factor = 1 - dist / gravityRadius;
            const force = (factor * factor * gravityStrength) / star.mass;

            // Inward radial pull
            const nx = dx / dist;
            const ny = dy / dist;
            star.vx += nx * force * 1.8;
            star.vy += ny * force * 1.8;

            // Perpendicular vortex / orbital swirling momentum
            const swirlStrength = force * 1.4 * star.orbitDirection;
            star.vx += -ny * swirlStrength;
            star.vy += nx * swirlStrength;

            // Event horizon soft repulsion cushion (prevents clumping in center)
            if (dist < 42) {
              const repel = (1 - dist / 42) * 1.2;
              star.vx -= nx * repel;
              star.vy -= ny * repel;
            }
          } else {
            // Smooth elastic return to floating cosmic home position
            const returnDx = star.baseX - star.x;
            const returnDy = star.baseY - star.y;
            star.vx += returnDx * 0.0035;
            star.vy += returnDy * 0.0035;
          }
        } else {
          // No mouse: gentle spring back to home floating path
          const returnDx = star.baseX - star.x;
          const returnDy = star.baseY - star.y;
          star.vx += returnDx * 0.0035;
          star.vy += returnDy * 0.0035;
        }

        // Air drag / velocity damping for fluid organic motion
        star.vx *= 0.94;
        star.vy *= 0.94;

        // Update position
        star.x += star.vx;
        star.y += star.vy;

        // Bounds wrap for stars
        if (star.x < -40) star.x = width + 40;
        if (star.x > width + 40) star.x = -40;
        if (star.y < -40) star.y = height + 40;
        if (star.y > height + 40) star.y = -40;

        // Motion trail record for fast moving stars
        const speed = Math.hypot(star.vx, star.vy);
        if (speed > 1.2) {
          star.history.push({ x: star.x, y: star.y });
          if (star.history.length > 5) {
            star.history.shift();
          }
        } else if (star.history.length > 0) {
          star.history.shift();
        }

        // Draw orbital trail if star is accelerating
        if (star.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(star.history[0].x, star.history[0].y);
          for (let h = 1; h < star.history.length; h++) {
            ctx.lineTo(star.history[h].x, star.history[h].y);
          }
          ctx.lineTo(star.x, star.y);
          ctx.strokeStyle = palette[star.colorType];
          ctx.globalAlpha = isDark ? 0.28 : 0.18;
          ctx.lineWidth = star.radius * 0.9;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) * 0.35 + 0.3; // 0.3 to 1.0
        let currentAlpha = star.baseAlpha * twinkle;
        if (!isDark) currentAlpha *= 0.75;

        // Boost alpha when accelerated by gravity
        if (speed > 1.5) {
          currentAlpha = Math.min(1, currentAlpha + speed * 0.1);
        }

        // Base star color
        const color = palette[star.colorType];

        // Draw radial halo glow for brightest stars
        if (star.hasFlare) {
          const glowGrad = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.radius * 3.5
          );
          glowGrad.addColorStop(
            0,
            isDark ? 'rgba(192, 107, 255, 0.45)' : 'rgba(122, 28, 172, 0.35)'
          );
          glowGrad.addColorStop(1, 'rgba(122, 28, 172, 0)');

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // 4-pointed cross star flare glint
          const flareLen = star.radius * 4.2;
          ctx.save();
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${currentAlpha * 0.55})`
            : `rgba(122, 28, 172, ${currentAlpha * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
          ctx.restore();
        }

        // Draw star core dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
