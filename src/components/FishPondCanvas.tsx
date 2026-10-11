import React, { useEffect, useRef } from 'react';

interface Fish {
  x: number;
  y: number;
  speed: number;
  length: number;
  height: number;
  color: string;
  secondaryColor: string;
  tailAngle: number;
  tailSpeed: number;
  direction: 1 | -1; // 1 = right, -1 = left
  depth: number; // 0.4 to 1 (scale & opacity)
  targetY: number;
  isCaught?: boolean;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  wobbleOffset: number;
  opacity: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface FishPondCanvasProps {
  isHooking?: boolean;
  hookProgress?: number; // 0 to 1
  onCanvasClick?: (x: number, y: number) => void;
  className?: string;
}

export const FishPondCanvas: React.FC<FishPondCanvasProps> = ({
  isHooking = false,
  onCanvasClick,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishesRef = useRef<Fish[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes for tropical fish
    const fishProfiles = [
      { color: '#f97316', secondary: '#ffffff', len: 55, h: 26 }, // Clownfish
      { color: '#0284c7', secondary: '#facc15', len: 65, h: 32 }, // Blue Tang
      { color: '#eab308', secondary: '#f97316', len: 50, h: 28 }, // Golden Angel
      { color: '#10b981', secondary: '#38bdf8', len: 60, h: 30 }, // Emerald Reef
      { color: '#ec4899', secondary: '#8b5cf6', len: 48, h: 24 }, // Magenta Coral
      { color: '#8b5cf6', secondary: '#06b6d4', len: 52, h: 25 }, // Purple Tetra
      { color: '#fb923c', secondary: '#fed7aa', len: 70, h: 34 }, // Big Koi
    ];

    // Initialize 14 swimming fish
    fishesRef.current = Array.from({ length: 14 }).map((_, i) => {
      const profile = fishProfiles[i % fishProfiles.length];
      const dir = Math.random() > 0.5 ? 1 : -1;
      const depth = 0.5 + Math.random() * 0.5; // Depth factor
      return {
        x: Math.random() * width,
        y: 80 + Math.random() * (height - 180),
        speed: (0.8 + Math.random() * 1.2) * (dir === 1 ? 1 : -1) * depth,
        length: profile.len * depth,
        height: profile.h * depth,
        color: profile.color,
        secondaryColor: profile.secondary,
        tailAngle: Math.random() * Math.PI,
        tailSpeed: 0.08 + Math.random() * 0.06,
        direction: dir as 1 | -1,
        depth,
        targetY: 80 + Math.random() * (height - 180),
      };
    });

    // Initialize 40 bubbles
    bubblesRef.current = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2 + Math.random() * 7,
      speed: 0.6 + Math.random() * 1.5,
      wobbleSpeed: 0.02 + Math.random() * 0.04,
      wobbleDistance: 10 + Math.random() * 20,
      wobbleOffset: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.5,
    }));

    let tick = 0;

    // Draw Seaweed Stalks
    const drawSeaweed = (c: CanvasRenderingContext2D, baseX: number, baseH: number, swayOffset: number) => {
      c.save();
      c.beginPath();
      c.moveTo(baseX, height);
      const sway = Math.sin(tick * 0.02 + swayOffset) * 25;
      c.quadraticCurveTo(baseX + sway * 0.5, height - baseH * 0.5, baseX + sway, height - baseH);
      c.strokeStyle = '#059669';
      c.lineWidth = 14;
      c.lineCap = 'round';
      c.stroke();

      // Highlight line
      c.beginPath();
      c.moveTo(baseX + 2, height);
      c.quadraticCurveTo(baseX + 2 + sway * 0.5, height - baseH * 0.5, baseX + 2 + sway, height - baseH);
      c.strokeStyle = '#34d399';
      c.lineWidth = 4;
      c.stroke();
      c.restore();
    };

    // Main animation loop
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Underwater gradient background
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
      oceanGrad.addColorStop(0, '#021838');
      oceanGrad.addColorStop(0.35, '#032554');
      oceanGrad.addColorStop(0.7, '#021e42');
      oceanGrad.addColorStop(1, '#011227');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Underwater sun rays / caustics effect
      ctx.save();
      for (let r = 0; r < 5; r++) {
        const rayAngle = -0.15 + r * 0.08 + Math.sin(tick * 0.01 + r) * 0.02;
        const rayX = width * 0.15 + r * (width * 0.18);
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + Math.tan(rayAngle) * height, height);
        rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        rayGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.04)');
        rayGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.moveTo(rayX - 30, 0);
        ctx.lineTo(rayX + 30, 0);
        ctx.lineTo(rayX + Math.tan(rayAngle) * height + 100, height);
        ctx.lineTo(rayX + Math.tan(rayAngle) * height - 60, height);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw Seaweed along the pond bottom
      const seaweedPositions = [
        { x: width * 0.05, h: 160, off: 0 },
        { x: width * 0.09, h: 220, off: 1.5 },
        { x: width * 0.15, h: 180, off: 3.1 },
        { x: width * 0.85, h: 210, off: 0.8 },
        { x: width * 0.91, h: 260, off: 2.4 },
        { x: width * 0.96, h: 170, off: 4.2 },
      ];
      seaweedPositions.forEach((sw) => drawSeaweed(ctx, sw.x, sw.h, sw.off));

      // 4. Update and render Bubbles
      ctx.save();
      bubblesRef.current.forEach((b) => {
        b.y -= b.speed;
        b.wobbleOffset += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobbleOffset) * (b.wobbleDistance * 0.3);

        if (b.y < -20) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${b.opacity * 0.5})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Bubble highlight shine
        ctx.beginPath();
        ctx.arc(currentX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.9})`;
        ctx.fill();
      });
      ctx.restore();

      // 5. Update and render Fishes
      fishesRef.current.forEach((fish) => {
        // Natural movement
        fish.x += fish.speed;
        fish.tailAngle += fish.tailSpeed;

        // Subtle vertical drifting
        if (Math.abs(fish.y - fish.targetY) < 5 || Math.random() < 0.005) {
          fish.targetY = 70 + Math.random() * (height - 180);
        }
        fish.y += (fish.targetY - fish.y) * 0.006;

        // Screen boundary wraparound
        if (fish.speed > 0 && fish.x > width + 100) {
          fish.x = -80;
          fish.y = 70 + Math.random() * (height - 180);
        } else if (fish.speed < 0 && fish.x < -100) {
          fish.x = width + 80;
          fish.y = 70 + Math.random() * (height - 180);
        }

        // Draw fish body with tail animation
        ctx.save();
        ctx.translate(fish.x, fish.y);

        // Facing direction flip
        if (fish.speed < 0) {
          ctx.scale(-1, 1);
        }

        const tailWag = Math.sin(fish.tailAngle) * 7;
        const fishLen = fish.length;
        const fishHalfH = fish.height / 2;

        // Main body
        ctx.beginPath();
        ctx.moveTo(fishLen * 0.5, 0); // Nose
        ctx.quadraticCurveTo(0, -fishHalfH * 1.2, -fishLen * 0.5, 0); // Top curve to tail root
        ctx.quadraticCurveTo(0, fishHalfH * 1.2, fishLen * 0.5, 0); // Bottom curve to nose
        ctx.fillStyle = fish.color;
        ctx.fill();

        // Decorative stripe or belly
        ctx.beginPath();
        ctx.moveTo(fishLen * 0.1, -fishHalfH * 0.9);
        ctx.quadraticCurveTo(-fishLen * 0.1, 0, -fishLen * 0.05, fishHalfH * 0.9);
        ctx.lineTo(-fishLen * 0.2, fishHalfH * 0.7);
        ctx.quadraticCurveTo(-fishLen * 0.25, 0, -fishLen * 0.05, -fishHalfH * 0.7);
        ctx.fillStyle = fish.secondaryColor;
        ctx.fill();

        // Tail fin (wags with sine wave)
        ctx.beginPath();
        ctx.moveTo(-fishLen * 0.5, 0);
        ctx.lineTo(-fishLen * 0.85, -fishHalfH * 0.9 + tailWag);
        ctx.quadraticCurveTo(-fishLen * 0.65, tailWag, -fishLen * 0.85, fishHalfH * 0.9 + tailWag);
        ctx.closePath();
        ctx.fillStyle = fish.secondaryColor;
        ctx.fill();

        // Dorsal fin
        ctx.beginPath();
        ctx.moveTo(0, -fishHalfH);
        ctx.quadraticCurveTo(-fishLen * 0.15, -fishHalfH * 1.6, -fishLen * 0.35, -fishHalfH * 0.7);
        ctx.fillStyle = fish.color;
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(fishLen * 0.32, -fishHalfH * 0.2, 3.5 * fish.depth, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(fishLen * 0.33, -fishHalfH * 0.2, 1.8 * fish.depth, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.restore();
      });

      // 6. Draw and expand Water Ripples
      ctx.save();
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rp = ripplesRef.current[i];
        rp.radius += 2.2;
        rp.opacity -= 0.015;

        if (rp.opacity <= 0) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.radius * 1.5, rp.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${rp.opacity})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();

      // 7. If Hooking is active, add dynamic ripple under the hook point
      if (isHooking && tick % 15 === 0) {
        ripplesRef.current.push({
          x: width * 0.5,
          y: height * 0.45,
          radius: 10,
          maxRadius: 180,
          opacity: 0.8,
        });
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHooking]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: 120,
      opacity: 0.9,
    });

    if (onCanvasClick) {
      onCanvasClick(x, y);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      className={`block w-full h-full cursor-pointer select-none ${className}`}
    />
  );
};
