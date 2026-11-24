'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const SPACING = 26; // px between grid dots
const REACH = 120; // px around the pointer where dots link up
const LINK_CHANCE = 0.5; // share of neighbor pairs that get a link, so it reads as a network, not a mesh
const TOUCH_HOLD_MS = 900; // how long a tap's network lingers before fading

const PALETTE = {
  dark: { neutral: [148, 163, 196], warm: [255, 120, 40], cool: [160, 110, 240], dot: 0.22, line: 0.55 },
  light: { neutral: [110, 120, 150], warm: [235, 95, 20], cool: [130, 80, 210], dot: 0.28, line: 0.5 },
} as const;

type RGB = readonly number[];

const mix = (a: RGB, b: RGB, t: number) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/** Stable pseudo-random value per grid edge, so the network shape doesn't flicker. */
function edgeHash(i: number, j: number, k: number) {
  let h = (i * 73856093) ^ (j * 19349663) ^ (k * 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/**
 * Welcome-screen background: a still dot grid tinted with warm/violet hues
 * around the center (behind the chat area). Near the pointer, or a finger on
 * touch screens, dots brighten and link into small networks that fade out
 * when the pointer leaves.
 *
 * Nothing animates on its own: the canvas only redraws while the network is
 * visible or fading, so an idle page costs nothing.
 */
export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    // Listen on the welcome screen container: the canvas itself ignores
    // pointer events so it never blocks the input or buttons.
    const host = canvas?.parentElement?.parentElement;
    if (!canvas || !ctx || !host) return;

    const pal = resolvedTheme === 'light' ? PALETTE.light : PALETTE.dark;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offX = 0;
    let offY = 0;
    let dotColors: number[][] = [];
    let pointer: { x: number; y: number } | null = null;
    let intensity = 0; // 0..1, eases toward target
    let target = 0;
    let releaseTimer = 0;
    let frame = 0;

    const dotPos = (i: number, j: number) => ({ x: offX + i * SPACING, y: offY + j * SPACING });

    const computeColors = () => {
      dotColors = [];
      const cx = width / 2;
      const cy = height / 2;
      const rx = Math.max(220, width * 0.38);
      const ry = Math.max(200, height * 0.32);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = dotPos(i, j);
          const d = Math.hypot((p.x - cx) / rx, (p.y - cy) / ry);
          const tint = Math.max(0, 1 - d); // 1 at center, 0 outside the ellipse
          // Warm on the left, violet on the right of the center.
          const hue = mix(pal.warm, pal.cool, Math.min(1, Math.max(0, (p.x - cx) / rx + 0.5)));
          const c = mix(pal.neutral, hue, tint * 0.85);
          dotColors.push([c[0], c[1], c[2], pal.dot + tint * 0.35]);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const reach2 = REACH * REACH;

      // Network links near the pointer.
      if (pointer && intensity > 0.01) {
        const pi = Math.round((pointer.x - offX) / SPACING);
        const pj = Math.round((pointer.y - offY) / SPACING);
        const span = Math.ceil(REACH / SPACING) + 1;
        ctx.lineWidth = 1;
        for (let j = Math.max(0, pj - span); j <= Math.min(rows - 1, pj + span); j++) {
          for (let i = Math.max(0, pi - span); i <= Math.min(cols - 1, pi + span); i++) {
            const a = dotPos(i, j);
            const da = (a.x - pointer.x) ** 2 + (a.y - pointer.y) ** 2;
            if (da > reach2) continue;
            // Right, down, and the two diagonals: each pair considered once.
            const neighbors: [number, number, number][] = [
              [i + 1, j, 0],
              [i, j + 1, 1],
              [i + 1, j + 1, 2],
              [i - 1, j + 1, 3],
            ];
            for (const [ni, nj, k] of neighbors) {
              if (ni < 0 || nj >= rows || ni >= cols) continue;
              if (edgeHash(i, j, k) > LINK_CHANCE) continue;
              const b = dotPos(ni, nj);
              const mx = (a.x + b.x) / 2 - pointer.x;
              const my = (a.y + b.y) / 2 - pointer.y;
              const fall = 1 - Math.sqrt(mx * mx + my * my) / REACH;
              if (fall <= 0) continue;
              const c = dotColors[j * cols + i];
              ctx.strokeStyle = rgba(c, pal.line * fall * intensity);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Dots, brightened and slightly enlarged near the pointer.
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = dotPos(i, j);
          const c = dotColors[j * cols + i];
          let boost = 0;
          if (pointer && intensity > 0.01) {
            const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
            if (d < REACH) boost = (1 - d / REACH) * intensity;
          }
          ctx.fillStyle = rgba(c, Math.min(1, c[3] + boost * 0.6));
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.1 + boost * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      intensity += (target - intensity) * 0.12;
      if (Math.abs(target - intensity) < 0.005) intensity = target;
      draw();
      frame = intensity === target ? 0 : requestAnimationFrame(tick);
      if (!frame && intensity === 0) pointer = null;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(width / SPACING) + 1;
      rows = Math.floor(height / SPACING) + 1;
      offX = (width - (cols - 1) * SPACING) / 2;
      offY = (height - (rows - 1) * SPACING) / 2;
      computeColors();
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      window.clearTimeout(releaseTimer);
      target = 1;
      if (e.pointerType !== 'mouse') {
        // Touch/pen: no hover, so let the network linger briefly after the tap.
        releaseTimer = window.setTimeout(() => {
          target = 0;
          kick();
        }, TOUCH_HOLD_MS);
      }
      if (intensity === target) draw();
      else kick();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target = 0;
      kick();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerdown', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer);
      observer.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [resolvedTheme]);

  return <canvas ref={canvasRef} className="welcome-network" aria-hidden="true" />;
}
