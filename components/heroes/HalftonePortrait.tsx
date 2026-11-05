"use client";

import { useEffect, useRef } from "react";

import { PORTRAIT } from "@/lib/portrait";

// The Power FC hero: the player printed as live halftone dots on paper. Black
// ink for the player, grey ink for the stadium lights, green for the rim
// light. Dots breathe a little, and swell like jelly under the cursor.
const LENS_RADIUS = 38; // px: how far from the cursor dots swell
const HOVER = 0.6; // how much dots swell under the cursor (1 = double size)
const PUSH = 4; // px: how far dots bulge outward from the cursor

// Spring tuning (per second). Low damping relative to stiffness = more wobble.
const DOT_STIFFNESS = 170; // each dot's size and position spring
const DOT_DAMPING = 9; // under-damped, so dots overshoot and wobble back
const LENS_STIFFNESS = 900; // the spot follows the cursor tightly...
const LENS_DAMPING = 48; // ...with only a touch of follow-through
const POP_STIFFNESS = 260; // the spot pops in and out with a little bounce
const POP_DAMPING = 14;

// Black ink for the player, green for the stadium light streaks and his rim light.
const COLORS = ["#0d0f0e", "#5ad62a", "#42e202"];

// Decode the picture once: dot type and size (0..1) per source cell.
const SRC_TYPE = new Uint8Array(PORTRAIT.cols * PORTRAIT.rows);
const SRC_SIZE = new Float32Array(PORTRAIT.cols * PORTRAIT.rows);
for (let i = 0; i < SRC_TYPE.length; i++) {
  const v = PORTRAIT.alphabet.indexOf(PORTRAIT.data[i]);
  SRC_TYPE[i] = Math.floor(v / PORTRAIT.levels);
  SRC_SIZE[i] = (v % PORTRAIT.levels) / (PORTRAIT.levels - 1);
}
const SRC_CELL = PORTRAIT.width / PORTRAIT.cols;

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

export default function HalftonePortrait({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Dot spacing on screen: coarse like a printed poster on wide screens.
    let sp = 10;
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, visible = true;
    const pointer = { x: 0, y: 0, inside: false };
    // The spot under the cursor: a stiff spring on position (tiny follow-through),
    // velocity for squash and stretch, and a bouncy spring on its strength.
    const lens = { x: 0, y: 0, vx: 0, vy: 0, s: 0, vs: 0 };
    // Every dot is its own spring: extra size (g) and bulge offset (ox, oy).
    let g = new Float32Array(0), vg = new Float32Array(0);
    let ox = new Float32Array(0), oy = new Float32Array(0), vox = new Float32Array(0), voy = new Float32Array(0);
    let settled = true;
    // How the picture covers the canvas: scale, and offset so the player sits
    // to the right of the text on wide screens and in the middle on phones.
    let fit = { s: 1, x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sp = w < 860 ? 7 : 10;
      if (w < 860) {
        // Phones: the player fills the width, standing above the slogan.
        const sc = w / 1150;
        fit = { s: sc, x: w * 0.5 - PORTRAIT.focusX * sc, y: h * 0.54 - PORTRAIT.height * sc };
      } else {
        // Wide screens: a big player on the right, head near the top and
        // shoulders cropped by the bottom edge like a poster.
        const sc = Math.max(w / 2100, (h * 1.02) / PORTRAIT.height);
        fit = { s: sc, x: w * 0.68 - PORTRAIT.focusX * sc, y: h * 0.11 - 45 * sc };
      }
      cols = Math.ceil(w / sp) + 1;
      rows = Math.ceil(h / sp) + 1;
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
      const c0 = Math.max(0, Math.floor((lens.x - reach) / sp)), c1 = Math.min(cols - 1, Math.ceil((lens.x + reach) / sp));
      const r0 = Math.max(0, Math.floor((lens.y - reach) / sp)), r1 = Math.min(rows - 1, Math.ceil((lens.y + reach) / sp));
      const strength = Math.min(1.25, lens.s) * HOVER;

      let energy = Math.abs(lens.vs) + Math.abs(lens.s - (pointer.inside ? 1 : 0)) + speed * 0.01;
      for (let i = 0, n = g.length; i < n; i++) {
        const r = (i / cols) | 0, c = i - r * cols;
        let tg = 0, tx = 0, ty = 0;
        if (strength > 0.001 && c >= c0 && c <= c1 && r >= r0 && r <= r1) {
          const dx = c * sp - lens.x, dy = r * sp - lens.y;
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
      const max = sp * 0.5;
      for (let r = 0; r < rows; r++) {
        const y = r * sp;
        for (let c = 0; c < cols; c++) {
          const x = c * sp;
          const i = r * cols + c;
          // The picture's dot at this spot, breathing slightly over time.
          const sc = Math.floor((x - fit.x) / fit.s / SRC_CELL), sr = Math.floor((y - fit.y) / fit.s / SRC_CELL);
          let k = 0, type = 0;
          if (sc >= 0 && sr >= 0 && sc < PORTRAIT.cols && sr < PORTRAIT.rows) {
            const j = sr * PORTRAIT.cols + sc;
            k = SRC_SIZE[j];
            type = SRC_TYPE[j];
            if (k > 0) k *= 0.9 + 0.2 * noise(c * 0.09 + t * 0.35, r * 0.09 - t * 0.2);
          }
          const grow = g[i];
          const radius = max * Math.min(1.2, 1.05 * k + 1.1 * grow);
          if (radius < 0.35) continue;
          // Right at the cursor, dots ink in black.
          ctx.fillStyle = grow > 0.3 ? COLORS[0] : COLORS[type];
          ctx.beginPath();
          ctx.arc(x + ox[i], y + oy[i], radius, 0, Math.PI * 2);
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
