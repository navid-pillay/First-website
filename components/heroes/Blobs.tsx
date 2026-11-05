"use client";

import { type CSSProperties, useEffect, useId, useRef } from "react";

export type Dot = [cx: number, cy: number, r: number];

// Jelly tuning. Each blob is a spring (per second): low damping relative to
// stiffness means it overshoots and wobbles back.
const STIFFNESS = 140;
const DAMPING = 6.5;
const DRAG = 9; // how much of the cursor's movement a blob picks up
const SWELL = 0.005; // how much a blob swells with the cursor's speed
const REACH = 14; // viewBox units beyond a blob's edge that still count as touching
const MAX_SPEED = 260; // viewBox units per second

/**
 * Soft green blobs, like fluorescent ink blotted onto the poster: circles and
 * thick rounded strokes are blurred together and then cut back to a hard edge,
 * so neighbours melt into one rounded, bubbly shape. Dragging the cursor
 * through them nudges each blob it touches; the blobs bounce back like jelly,
 * and the strokes between them stretch along.
 */
export default function Blobs({ viewBox, dots, trails = [], width = 40, jiggle = 1, className = "", style }: {
  viewBox: string;
  dots: Dot[];
  /** Polylines ("x,y x,y ...") drawn as thick rounded strokes; a point on a dot's centre moves with that dot. */
  trails?: string[];
  /** Stroke width of the trails, in viewBox units. */
  width?: number;
  /** How strongly the cursor moves the blobs (1 = normal). */
  jiggle?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const trailRefs = useRef<(SVGPolylineElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = dots.length;
    const ox = new Float32Array(n), oy = new Float32Array(n), vx = new Float32Array(n), vy = new Float32Array(n);
    const sc = new Float32Array(n), vs = new Float32Array(n);
    // Each trail point either follows a dot (its index) or stays put (-1).
    const trailPts = trails.map((t) =>
      t.trim().split(/\s+/).map((p) => {
        const [x, y] = p.split(",").map(Number);
        return { x, y, dot: dots.findIndex(([cx, cy]) => cx === x && cy === y) };
      }),
    );
    let raf = 0, last = 0, prev: { x: number; y: number; t: number } | null = null;

    const render = () => {
      for (let i = 0; i < n; i++) {
        const c = circleRefs.current[i];
        if (!c) continue;
        c.setAttribute("cx", (dots[i][0] + ox[i]).toFixed(2));
        c.setAttribute("cy", (dots[i][1] + oy[i]).toFixed(2));
        c.setAttribute("r", (dots[i][2] * (1 + sc[i])).toFixed(2));
      }
      trailPts.forEach((pts, j) => {
        trailRefs.current[j]?.setAttribute(
          "points",
          pts.map((p) => (p.dot < 0 ? `${p.x},${p.y}` : `${(p.x + ox[p.dot]).toFixed(2)},${(p.y + oy[p.dot]).toFixed(2)}`)).join(" "),
        );
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      let energy = 0;
      // Small fixed sub-steps keep the springs stable at any frame rate.
      const steps = Math.ceil(dt / (1 / 120));
      const h = dt / steps;
      for (let s = 0; s < steps; s++) {
        for (let i = 0; i < n; i++) {
          vx[i] += (-ox[i] * STIFFNESS - vx[i] * DAMPING) * h;
          vy[i] += (-oy[i] * STIFFNESS - vy[i] * DAMPING) * h;
          vs[i] += (-sc[i] * STIFFNESS - vs[i] * DAMPING) * h;
          ox[i] += vx[i] * h; oy[i] += vy[i] * h; sc[i] += vs[i] * h;
        }
      }
      for (let i = 0; i < n; i++) energy += Math.abs(ox[i]) + Math.abs(oy[i]) + Math.abs(vx[i]) * 0.05 + Math.abs(vy[i]) * 0.05 + Math.abs(sc[i]) * 50;
      render();
      if (energy > 0.02) raf = requestAnimationFrame(frame);
      else { ox.fill(0); oy.fill(0); vx.fill(0); vy.fill(0); sc.fill(0); vs.fill(0); render(); raf = 0; last = 0; }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      const t = e.timeStamp;
      const before = prev;
      prev = { x: p.x, y: p.y, t };
      if (!before || t - before.t > 120) return;
      const dt = Math.max(8, t - before.t) / 1000;
      let mx = (p.x - before.x) / dt, my = (p.y - before.y) / dt;
      const speed = Math.hypot(mx, my);
      if (speed < 1) return;
      if (speed > MAX_SPEED) { mx *= MAX_SPEED / speed; my *= MAX_SPEED / speed; }
      let hit = false;
      for (let i = 0; i < n; i++) {
        const [cx, cy, r] = dots[i];
        const d = Math.hypot(p.x - cx - ox[i], p.y - cy - oy[i]);
        const range = r + REACH;
        if (d > range) continue;
        const f = 1 - d / range;
        vx[i] += mx * f * DRAG * jiggle * dt;
        vy[i] += my * f * DRAG * jiggle * dt;
        vs[i] += Math.min(speed, MAX_SPEED) * f * SWELL * jiggle;
        hit = true;
      }
      if (hit && !raf) raf = requestAnimationFrame(frame);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [dots, trails, jiggle]);

  return (
    <svg ref={svgRef} aria-hidden="true" viewBox={viewBox} style={style} className={`pointer-events-none overflow-visible ${className}`}>
      <defs>
        <filter id={`${id}-goo`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
          <feColorMatrix in="b" values="0 0 0 0 0.259  0 0 0 0 0.886  0 0 0 0 0.008  0 0 0 24 -11" />
        </filter>
      </defs>
      <g filter={`url(#${id}-goo)`} fill="#000" stroke="#000" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        {trails.map((t, j) => <polyline key={t} ref={(el) => { trailRefs.current[j] = el; }} points={t} fill="none" />)}
        {dots.map(([cx, cy, r], i) => <circle key={i} ref={(el) => { circleRefs.current[i] = el; }} cx={cx} cy={cy} r={r} stroke="none" />)}
      </g>
    </svg>
  );
}
