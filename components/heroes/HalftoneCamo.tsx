"use client";

import { useEffect, useRef } from "react";

// Live version of the Power FC training top pattern: a grid of halftone dots
// whose size forms blocky camo patches that slowly drift and morph.
const SPACING = 9; // px between dot centres
const CELL = 2; // dots per camo "pixel" block, for the jersey's stepped edges
const LENS_RADIUS = 45; // px: how far from the cursor dots swell
const PUSH = 7; // px: how far dots bulge outward from the cursor

// Spring tuning (per second). Low damping relative to stiffness = more wobble.
const DOT_STIFFNESS = 170; // each dot's size and position spring
const DOT_DAMPING = 9; // under-damped, so dots overshoot and wobble back
const LENS_STIFFNESS = 900; // the spot follows the cursor tightly...
const LENS_DAMPING = 48; // ...with only a touch of follow-through
const POP_STIFFNESS = 260; // the spot pops in and out with a little bounce
const POP_DAMPING = 14;

// Dot colours from darkest (#232625) to lightest (#4c504e), in 24 steps.
const SHADES = Array.from({ length: 24 }, (_, i) => {
  const t = i / 23;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(0x23, 0x4c)},${mix(0x26, 0x50)},${mix(0x25, 0x4e)})`;
});

// The same shades lit up under the cursor: 12 steps from the normal colour
// toward a bright grey (#c8cdca).
const LIT = SHADES.map((_, i) => {
  const t = i / 23;
  const base = [0x23 + (0x4c - 0x23) * t, 0x26 + (0x50 - 0x26) * t, 0x25 + (0x4e - 0x25) * t];
  return Array.from({ length: 12 }, (_, j) => {
    const u = j / 11;
    const c = base.map((v, k) => Math.round(v + ([0xc8, 0xcd, 0xca][k] - v) * u));
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
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, visible = true;
    const pointer = { x: 0, y: 0, inside: false };
    // The spot under the cursor: a stiff spring on position (tiny follow-through),
    // velocity for squash and stretch, and a bouncy spring on its strength.
    const lens = { x: 0, y: 0, vx: 0, vy: 0, s: 0, vs: 0 };
    // Every dot is its own spring: extra size (g) and bulge offset (ox, oy).
    let g = new Float32Array(0), vg = new Float32Array(0);
    let ox = new Float32Array(0), oy = new Float32Array(0), vox = new Float32Array(0), voy = new Float32Array(0);
    let settled = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / SPACING) + 1;
      rows = Math.ceil(h / SPACING) + 1;
      const n = cols * rows;
      g = new Float32Array(n); vg = new Float32Array(n);
      ox = new Float32Array(n); oy = new Float32Array(n); vox = new Float32Array(n); voy = new Float32Array(n);
    };

    // Advance every spring by dt seconds (semi-implicit Euler).
    const step = (dt: number) => {
      const ax = (pointer.x - lens.x) * LENS_STIFFNESS - lens.vx * LENS_DAMPING;
      const ay = (pointer.y - lens.y) * LENS_STIFFNESS - lens.vy * LENS_DAMPING;
      lens.vx += ax * dt; lens.vy += ay * dt;
      lens.x += lens.vx * dt; lens.y += lens.vy * dt;
      lens.vs += ((pointer.inside ? 1 : 0) - lens.s) * POP_STIFFNESS * dt - lens.vs * POP_DAMPING * dt;
      lens.s = Math.max(0, lens.s + lens.vs * dt);

      // Squash and stretch: the spot stretches along the direction of travel
      // and narrows across it, keeping roughly the same area.
      const speed = Math.hypot(lens.vx, lens.vy);
      const stretch = Math.min(0.7, speed / 1800);
      const ux = speed > 1 ? lens.vx / speed : 1, uy = speed > 1 ? lens.vy / speed : 0;
      const along = LENS_RADIUS * (1 + stretch), across = LENS_RADIUS / (1 + stretch * 0.6);
      const reach = along * 2.2;
      const c0 = Math.max(0, Math.floor((lens.x - reach) / SPACING)), c1 = Math.min(cols - 1, Math.ceil((lens.x + reach) / SPACING));
      const r0 = Math.max(0, Math.floor((lens.y - reach) / SPACING)), r1 = Math.min(rows - 1, Math.ceil((lens.y + reach) / SPACING));
      const strength = Math.min(1.25, lens.s);

      let energy = Math.abs(lens.vs) + Math.abs(lens.s - (pointer.inside ? 1 : 0)) + speed * 0.01;
      for (let i = 0, n = g.length; i < n; i++) {
        const r = (i / cols) | 0, c = i - r * cols;
        let tg = 0, tx = 0, ty = 0;
        if (strength > 0.001 && c >= c0 && c <= c1 && r >= r0 && r <= r1) {
          const dx = c * SPACING - lens.x, dy = r * SPACING - lens.y;
          const pa = (dx * ux + dy * uy) / along, pc = (-dx * uy + dy * ux) / across;
          const f = Math.exp(-(pa * pa + pc * pc));
          tg = f * strength;
          // Bulge outward, strongest on the spot's edge, zero at its centre.
          const d = Math.hypot(dx, dy) || 1;
          const push = PUSH * strength * f * Math.min(1, d / LENS_RADIUS);
          tx = (dx / d) * push; ty = (dy / d) * push;
        } else if (g[i] === 0 && vg[i] === 0 && ox[i] === 0 && oy[i] === 0) {
          continue; // at rest and far from the cursor
        }
        vg[i] += ((tg - g[i]) * DOT_STIFFNESS - vg[i] * DOT_DAMPING) * dt;
        g[i] += vg[i] * dt;
        vox[i] += ((tx - ox[i]) * DOT_STIFFNESS - vox[i] * DOT_DAMPING) * dt;
        voy[i] += ((ty - oy[i]) * DOT_STIFFNESS - voy[i] * DOT_DAMPING) * dt;
        ox[i] += vox[i] * dt; oy[i] += voy[i] * dt;
        const e = Math.abs(vg[i]) + Math.abs(g[i] - tg) + Math.abs(vox[i]) + Math.abs(voy[i]) * 0.1;
        if (tg === 0 && e < 0.002 && Math.abs(ox[i]) < 0.02 && Math.abs(oy[i]) < 0.02) {
          g[i] = vg[i] = ox[i] = oy[i] = vox[i] = voy[i] = 0; // snap to rest
        } else {
          energy += e;
        }
      }
      settled = !pointer.inside && energy < 0.01;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const max = SPACING * 0.5;
      for (let r = 0; r < rows; r++) {
        const y = r * SPACING;
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          const i = r * cols + c;
          // Sample per block for stepped edges, blend a little per dot for softness.
          const n = camo(Math.floor(c / CELL), Math.floor(r / CELL), t) * 0.6 + camo(c / CELL, r / CELL, t) * 0.4;
          // Continuous size and shade, so dots grow and shrink smoothly as the
          // patches drift instead of snapping between sizes.
          let k = Math.min(1, Math.max(0, (n - 0.4) / 0.24));
          k = k * k * (3 - 2 * k);
          const grow = g[i];
          // Dots under the cursor turn one even colour: they reach the full light
          // grey quickly, so only a thin rim blends into the camo around it.
          const lit = Math.min(1, Math.max(0, grow / 0.3));
          ctx.fillStyle = LIT[Math.round(k * (SHADES.length - 1))][Math.round(lit * 11)];
          ctx.beginPath();
          ctx.arc(x + ox[i], y + oy[i], Math.max(0.4, max * Math.min(1.45, 0.28 + 0.64 * k + 1.1 * grow)), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // ~30fps is plenty for the slow drift; run every frame while springs move.
      if (!visible || now - last < (settled ? 33 : 0)) return;
      let dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      dt = Math.min(dt, 1 / 20);
      if (!settled || pointer.inside) {
        // Small fixed sub-steps keep the springs stable at any frame rate.
        const steps = Math.ceil(dt / (1 / 120));
        for (let s = 0; s < steps; s++) step(dt / steps);
      }
      draw(now / 1000);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const inside = e.pointerType === "mouse" && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && !pointer.inside && lens.s < 0.05) { lens.x = x; lens.y = y; lens.vx = lens.vy = 0; }
      pointer.inside = inside;
      pointer.x = x;
      pointer.y = y;
      if (inside) settled = false;
    };
    const onLeave = () => { pointer.inside = false; };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => { resize(); draw(last / 1000); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
}
