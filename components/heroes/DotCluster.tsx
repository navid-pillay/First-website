"use client";

import { type CSSProperties, useEffect, useRef } from "react";

// A small cluster of black halftone dots (11px grid, fading out toward its
// edges), drawn live so the dots swell like jelly under the cursor, as the
// hero's do. Only printed dots react; the paper around them stays still.

const SPACING = 11;
const DOT = 1.8; // px radius at the cluster's centre
const PAD = 16; // px of room around the cluster for dots to swell into
const LENS_RADIUS = 38;
const HOVER = 0.6;
const PUSH = 4;
const STIFFNESS = 170;
const DAMPING = 9;
const POP_STIFFNESS = 260;
const POP_DAMPING = 14;

export default function DotCluster({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, last = 0;
    let X = new Float32Array(0), Y = new Float32Array(0), R = new Float32Array(0);
    let g = new Float32Array(0), vg = new Float32Array(0), ox = new Float32Array(0), oy = new Float32Array(0), vx = new Float32Array(0), vy = new Float32Array(0);
    const pointer = { x: 0, y: 0, inside: false };
    const lens = { s: 0, vs: 0 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bw = w - PAD * 2, bh = h - PAD * 2;
      const xs: number[] = [], ys: number[] = [], rs: number[] = [];
      for (let y = SPACING / 2; y < bh; y += SPACING) {
        for (let x = SPACING / 2; x < bw; x += SPACING) {
          // Elliptical fade: full size to 30% of the way out, gone by 75%.
          const e = Math.hypot(x / bw - 0.5, y / bh - 0.5) * Math.SQRT2;
          const a = Math.min(1, Math.max(0, (0.75 - e) / 0.45));
          if (a < 0.08) continue;
          xs.push(PAD + x); ys.push(PAD + y); rs.push(DOT * Math.sqrt(a));
        }
      }
      X = Float32Array.from(xs); Y = Float32Array.from(ys); R = Float32Array.from(rs);
      const n = rs.length;
      g = new Float32Array(n); vg = new Float32Array(n); ox = new Float32Array(n); oy = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0d0f0e";
      ctx.beginPath();
      for (let i = 0; i < R.length; i++) {
        const r = R[i] * (1 + g[i] * 1.8);
        ctx.moveTo(X[i] + ox[i] + r, Y[i] + oy[i]);
        ctx.arc(X[i] + ox[i], Y[i] + oy[i], r, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    // Advance the springs; returns whether anything is still moving.
    const step = (dt: number) => {
      lens.vs += ((pointer.inside ? 1 : 0) - lens.s) * POP_STIFFNESS * dt - lens.vs * POP_DAMPING * dt;
      lens.s = Math.max(0, lens.s + lens.vs * dt);
      const strength = Math.min(1.25, lens.s) * HOVER;
      let energy = Math.abs(lens.vs) + Math.abs(lens.s - (pointer.inside ? 1 : 0));
      for (let i = 0; i < R.length; i++) {
        const dx = X[i] - pointer.x, dy = Y[i] - pointer.y;
        const f = strength > 0.001 ? Math.exp(-(dx * dx + dy * dy) / (LENS_RADIUS * LENS_RADIUS)) : 0;
        const d = Math.hypot(dx, dy) || 1;
        const push = PUSH * strength * f * Math.min(1, d / LENS_RADIUS);
        const tg = f * strength, tx = (dx / d) * push, ty = (dy / d) * push;
        vg[i] += ((tg - g[i]) * STIFFNESS - vg[i] * DAMPING) * dt;
        vx[i] += ((tx - ox[i]) * STIFFNESS - vx[i] * DAMPING) * dt;
        vy[i] += ((ty - oy[i]) * STIFFNESS - vy[i] * DAMPING) * dt;
        g[i] += vg[i] * dt; ox[i] += vx[i] * dt; oy[i] += vy[i] * dt;
        energy += Math.abs(vg[i]) + Math.abs(g[i] - tg) + Math.abs(vx[i]) * 0.1 + Math.abs(vy[i]) * 0.1;
      }
      return pointer.inside || energy > 0.01;
    };

    const frame = (now: number) => {
      const dt = Math.min(1 / 20, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const steps = Math.ceil(dt / (1 / 120));
      let moving = false;
      for (let s = 0; s < steps; s++) moving = step(dt / steps);
      draw();
      if (moving) raf = requestAnimationFrame(frame);
      else { g.fill(0); vg.fill(0); ox.fill(0); oy.fill(0); vx.fill(0); vy.fill(0); draw(); raf = 0; last = 0; }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const inside = e.pointerType === "mouse" && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x; pointer.y = y;
      if (inside === pointer.inside && !inside) return;
      pointer.inside = inside;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => { pointer.inside = false; if (!raf) raf = requestAnimationFrame(frame); };

    build();
    draw();
    const ro = new ResizeObserver(() => { build(); draw(); });
    ro.observe(canvas);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // The canvas reaches PAD px past the cluster's box on every side.
  return (
    <span aria-hidden="true" style={style} className={`pointer-events-none ${className}`}>
      <canvas ref={ref} style={{ left: -PAD, top: -PAD, width: `calc(100% + ${PAD * 2}px)`, height: `calc(100% + ${PAD * 2}px)` }} className="absolute" />
    </span>
  );
}
