"use client";

import { useEffect, useRef } from "react";

// Live version of the Power FC training top pattern: a grid of halftone dots
// whose size forms blocky camo patches that slowly drift and morph.
const SPACING = 9; // px between dot centres
const CELL = 2;
const RIPPLE_SPEED = 260; // px per second the ring spreads
const RIPPLE_WIDTH = 11; // px thickness of each ring
const RIPPLE_GAP = 34; // px between the lead ring and the one behind it
const RIPPLE_LIFE = 1.6; // seconds until a ripple has faded
const MAX_RIPPLES = 8; // dots per camo "pixel" block, for the jersey's stepped edges

// Dot colours from darkest (#232625) to lightest (#4c504e), in 24 steps.
const SHADES = Array.from({ length: 24 }, (_, i) => {
  const t = i / 23;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(0x23, 0x4c)},${mix(0x26, 0x50)},${mix(0x25, 0x4e)})`;
});

// The same shades lit up by a ripple: 12 steps from the normal colour toward
// a bright grey (#a3a9a6), like light catching the crest of a wave.
const LIT = SHADES.map((_, i) => {
  const t = i / 23;
  const base = [0x23 + (0x4c - 0x23) * t, 0x26 + (0x50 - 0x26) * t, 0x25 + (0x4e - 0x25) * t];
  return Array.from({ length: 12 }, (_, j) => {
    const u = j / 11;
    const c = base.map((v, k) => Math.round(v + ([0xa3, 0xa9, 0xa6][k] - v) * u));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  });
});

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function camo(x: number, y: number, t: number) {
  return (
    noise(x * 0.11 + t * 0.06, y * 0.11 - t * 0.04) * 0.55 +
    noise(x * 0.26 - t * 0.05, y * 0.26 + t * 0.07 + 40) * 0.3 +
    noise(x * 0.7 + 90, y * 0.7 + t * 0.1) * 0.15
  );
}

export default function HalftoneCamo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, last = 0, visible = true;
    // Water-style ripples left by the cursor: rings of swollen dots that
    // spread out and fade.
    const ripples: { x: number; y: number; born: number }[] = [];
    let lastDrop = { x: -1e4, y: -1e4, at: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      const max = SPACING * 0.5;
      for (let r = 0; r < rows; r++) {
        const y = r * SPACING;
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          // Sample per block for stepped edges, blend a little per dot for softness.
          const n = camo(Math.floor(c / CELL), Math.floor(r / CELL), t) * 0.6 + camo(c / CELL, r / CELL, t) * 0.4;
          // Continuous size and shade, so dots grow and shrink smoothly as the
          // patches drift instead of snapping between sizes.
          let k = Math.min(1, Math.max(0, (n - 0.4) / 0.24));
          k = k * k * (3 - 2 * k);
          let wave = 0;
          for (const rp of ripples) {
            const age = t - rp.born;
            const d = Math.hypot(x - rp.x, y - rp.y) - age * RIPPLE_SPEED;
            if (d > -RIPPLE_GAP - RIPPLE_WIDTH * 3 && d < RIPPLE_WIDTH * 3) {
              const fade = 1 - age / RIPPLE_LIFE;
              const d2 = d + RIPPLE_GAP;
              wave += (Math.exp(-(d * d) / (RIPPLE_WIDTH * RIPPLE_WIDTH)) + 0.5 * Math.exp(-(d2 * d2) / (RIPPLE_WIDTH * RIPPLE_WIDTH))) * fade * fade;
            }
          }
          wave = Math.min(1, wave);
          ctx.fillStyle = LIT[Math.round(k * (SHADES.length - 1))][Math.round(wave * 11)];
          ctx.beginPath();
          ctx.arc(x, y, max * Math.min(1.2, 0.28 + 0.64 * k + 0.95 * wave), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = now / 1000;
      while (ripples.length && t - ripples[0].born > RIPPLE_LIFE) ripples.shift();
      // ~30fps is plenty for the slow drift; go smooth while ripples spread.
      if (!visible || now - last < (ripples.length ? 15 : 33)) return;
      last = now;
      draw(t);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const now = performance.now();
      // Drop a new ripple every so often as the cursor travels.
      if (Math.hypot(x - lastDrop.x, y - lastDrop.y) < 110 && now - lastDrop.at < 450) return;
      lastDrop = { x, y, at: now };
      ripples.push({ x, y, born: now / 1000 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => { resize(); draw(last / 1000); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
}
