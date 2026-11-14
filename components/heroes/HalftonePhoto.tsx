"use client";

import { useEffect, useRef } from "react";

// A photo printed as halftone dots, straight from the photo's own tones (so
// faces stay true to the original): black ink dots whose size follows how dark
// the photo is, and a green halo of dots fading out around the cut-out. The
// photo needs a transparent background. The canvas has the photo's shape; give
// it a width with className. The dots are fine (about 3px apart) so faces
// read. The finished print is kept on a hidden canvas: the picture spreads out
// from its middle when the photo loads, then is still, and when the cursor
// moves over it only the patch of dots under the cursor is redrawn, swelling
// like jelly.

const LENS_RADIUS = 34; // px: how far from the cursor dots swell
const HOVER = 0.4; // how much dots swell under the cursor
const PUSH = 3; // px: how far dots bulge outward from the cursor
const STIFFNESS = 170, DAMPING = 11; // each dot's spring (per second)
const FORM_S = 1.3; // s: the opening, spreading from the middle
const INK = "#0d0f0e", GREEN = "#42e202";

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export default function HalftonePhoto({ src, width, height, className = "", interactive = true }: {
  src: string;
  /** The photo's size in pixels (sets the canvas's shape). */
  width: number;
  height: number;
  className?: string;
  /** false: no hover and no opening animation (used inside the hover preview). */
  interactive?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = interactive && !reduce;
    let w = 0, h = 0, dpr = 1, sp = 3, cols = 0, rows = 0, raf = 0, last = 0, formStart = 0;
    const base = document.createElement("canvas"); // the finished, resting print
    // The patch of dots the cursor has disturbed (grid cells), or null.
    let box: { c0: number; c1: number; r0: number; r1: number } | null = null;
    // Per dot: size (0..1), kind (0 ink, 1 green halo), and its jelly spring.
    let K = new Float32Array(0), T = new Uint8Array(0);
    let g = new Float32Array(0), vg = new Float32Array(0), ox = new Float32Array(0), oy = new Float32Array(0), vx = new Float32Array(0), vy = new Float32Array(0);
    const pointer = { x: 0, y: 0, inside: false };
    const photo = new Image();
    photo.decoding = "async";

    const sample = () => {
      const n = cols * rows;
      K = new Float32Array(n); T = new Uint8Array(n);
      g = new Float32Array(n); vg = new Float32Array(n); ox = new Float32Array(n); oy = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
      if (!photo.complete || !photo.naturalWidth) return;
      // One pixel per dot: the browser averages each dot's patch of the photo.
      const off = document.createElement("canvas");
      off.width = cols; off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.imageSmoothingEnabled = true; o.imageSmoothingQuality = "high";
      o.drawImage(photo, 0, 0, w / sp, h / sp);
      const px = o.getImageData(0, 0, cols, rows).data;
      const A = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const a = px[i * 4 + 3] / 255;
        A[i] = a;
        if (a < 0.05) continue;
        const L = px[i * 4] / 255;
        // Dark = big dot. The photo's own tones, with the mid-tones lifted a
        // little so skin stays light and features stay clear.
        const lit = Math.pow(Math.min(1, Math.max(0, (L - 0.05) / 0.8)), 0.8);
        K[i] = a * Math.min(1, Math.max(0, 1.02 - lit));
      }
      // Green halo: three rings of dots outside the cut-out, each fainter.
      let edge = A;
      for (let ring = 0; ring < 3; ring++) {
        const next = new Float32Array(edge);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            if (edge[i] > 0.5) continue;
            let near = 0;
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
              const rr = r + dr, cc = c + dc;
              if (rr >= 0 && cc >= 0 && rr < rows && cc < cols) near = Math.max(near, edge[rr * cols + cc]);
            }
            if (near > 0.5 && r < rows - 2) { next[i] = 1; T[i] = 1; K[i] = [0.62, 0.42, 0.24][ring] * (0.75 + 0.5 * hash(c, r)); }
          }
        }
        edge = next;
      }
      renderBase();
    };

    const dots = (c: CanvasRenderingContext2D, c0: number, c1: number, r0: number, r1: number, springs: boolean) => {
      const max = sp * 0.62;
      for (let kind = 0; kind < 2; kind++) {
        c.fillStyle = kind ? GREEN : INK;
        c.beginPath();
        for (let r = r0; r <= r1; r++) for (let col = c0; col <= c1; col++) {
          const i = r * cols + col;
          if (T[i] !== kind || K[i] <= 0) continue;
          const rb = max * K[i];
          if (rb < 0.25) continue;
          const radius = springs ? Math.min(max * 1.3, rb + max * g[i] * Math.min(1, rb / (max * 0.25))) : rb;
          const x = col * sp + (springs ? ox[i] : 0), y = r * sp + (springs ? oy[i] : 0);
          c.moveTo(x + radius, y);
          c.arc(x, y, radius, 0, Math.PI * 2);
        }
        c.fill();
      }
    };

    const renderBase = () => {
      base.width = canvas.width; base.height = canvas.height;
      const b = base.getContext("2d");
      if (!b) return;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots(b, 0, cols - 1, 0, rows - 1, false);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Fine dots, finer still on small screens, so faces read.
      sp = w < 700 ? 2.4 : 3;
      box = null;
      cols = Math.ceil(w / sp) + 1; rows = Math.ceil(h / sp) + 1;
      sample();
    };

    const draw = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (box) {
        // Redraw just the disturbed patch, with its springs.
        const pad = sp;
        ctx.clearRect(box.c0 * sp - pad, box.r0 * sp - pad, (box.c1 - box.c0) * sp + pad * 2, (box.r1 - box.r0) * sp + pad * 2);
        dots(ctx, Math.max(0, box.c0 - 1), Math.min(cols - 1, box.c1 + 1), Math.max(0, box.r0 - 1), Math.min(rows - 1, box.r1 + 1), true);
      }
      // Opening: the print spreads out from the middle, soft-edged.
      const f = !animate || !formStart ? 1 : Math.min(1, Math.max(0, (now - formStart) / 1000 / FORM_S));
      if (f < 1) {
        const R = Math.hypot(w, h) * 0.75 * (1 - Math.pow(1 - f, 2.2)) + 1;
        const grad = ctx.createRadialGradient(w * 0.55, h * 0.6, R * 0.55, w * 0.55, h * 0.6, R);
        grad.addColorStop(0, "#000"); grad.addColorStop(1, "transparent");
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
      return f < 1;
    };

    // Springs for the dots near the cursor; returns whether any still move.
    const step = (dt: number) => {
      const reach = LENS_RADIUS * 2.2;
      if (pointer.inside) {
        // Grow the patch to cover the cursor's reach.
        const c0 = Math.max(0, Math.floor((pointer.x - reach) / sp)), c1 = Math.min(cols - 1, Math.ceil((pointer.x + reach) / sp));
        const r0 = Math.max(0, Math.floor((pointer.y - reach) / sp)), r1 = Math.min(rows - 1, Math.ceil((pointer.y + reach) / sp));
        box = box ? { c0: Math.min(box.c0, c0), c1: Math.max(box.c1, c1), r0: Math.min(box.r0, r0), r1: Math.max(box.r1, r1) } : { c0, c1, r0, r1 };
      }
      if (!box) return false;
      let energy = 0;
      for (let r = box.r0; r <= box.r1; r++) for (let c = box.c0; c <= box.c1; c++) {
        const i = r * cols + c;
        if (K[i] <= 0) continue;
        const dx = c * sp - pointer.x, dy = r * sp - pointer.y;
        let tg = 0, tx = 0, ty = 0;
        if (pointer.inside && Math.abs(dx) < reach && Math.abs(dy) < reach) {
          const f = Math.exp(-(dx * dx + dy * dy) / (LENS_RADIUS * LENS_RADIUS));
          const d = Math.hypot(dx, dy) || 1;
          const push = PUSH * HOVER * f * Math.min(1, d / LENS_RADIUS);
          tg = f * HOVER; tx = (dx / d) * push; ty = (dy / d) * push;
        } else if (g[i] === 0 && vg[i] === 0 && ox[i] === 0 && oy[i] === 0) continue;
        vg[i] += ((tg - g[i]) * STIFFNESS - vg[i] * DAMPING) * dt;
        vx[i] += ((tx - ox[i]) * STIFFNESS - vx[i] * DAMPING) * dt;
        vy[i] += ((ty - oy[i]) * STIFFNESS - vy[i] * DAMPING) * dt;
        g[i] += vg[i] * dt; ox[i] += vx[i] * dt; oy[i] += vy[i] * dt;
        const e = Math.abs(vg[i]) + Math.abs(g[i] - tg) + (Math.abs(vx[i]) + Math.abs(vy[i])) * 0.1;
        if (tg === 0 && e < 0.004 && Math.abs(ox[i]) < 0.03 && Math.abs(oy[i]) < 0.03) { g[i] = vg[i] = ox[i] = oy[i] = vx[i] = vy[i] = 0; }
        else energy += e;
      }
      if (pointer.inside || energy > 0.01) return true;
      box = null; // settled: back to the resting print
      return false;
    };

    const frame = (now: number) => {
      const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      step(dt / 2);
      const moving = step(dt / 2);
      const forming = draw(now);
      if (moving || forming) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const inside = e.pointerType === "mouse" && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!inside && !pointer.inside) return;
      pointer.x = x; pointer.y = y; pointer.inside = inside;
      wake();
    };
    const onLeave = () => { if (pointer.inside) { pointer.inside = false; wake(); } };

    photo.onload = () => { sample(); formStart = performance.now(); wake(); };
    photo.src = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
    resize();
    const ro = new ResizeObserver(() => { resize(); wake(); });
    ro.observe(canvas);
    if (animate) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [src, interactive]);

  return <canvas ref={ref} aria-hidden="true" style={{ aspectRatio: `${width} / ${height}` }} className={`block ${className}`} />;
}
