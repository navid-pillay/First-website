"use client";

import { useEffect, useId, useRef } from "react";
import DraftNav from "@/components/DraftNav";
import { ProgramPageBody, type ProgramKey } from "@/components/DraftProgramPage";

// Hover preview of a program's page: a jelly blob shaped like the site's green
// splats (lumpy lobes and a few droplets) that grows out of the splat behind
// the hovered logo and floats to its spot near the middle of the screen (the
// logo stays where it is, on top). Its lobes jiggle, and the page inside is
// shrunk and distorted like a dream sequence on TV. Shrinks back into the
// splat when the cursor leaves.

const STIFFNESS = 120; // the bubble's size spring (per second²)
const DAMPING = 9; // low, so it overshoots and wobbles like jelly
const POINTS = 72; // points around the wobbly edge
const BOX = 1.45; // the drawing box, relative to the blob's base size (room for lobes)
// Lobes bulging out of the body (angle, height, width), like the splats.
const LOBES = [[-0.35, 0.2, 0.36], [1.05, 0.13, 0.3], [2.05, 0.22, 0.42], [3.35, 0.12, 0.28], [4.35, 0.19, 0.36], [5.35, 0.1, 0.24]];
// Droplets around it (angle, distance, radius), relative to the base radius.
const DROPS = [[0.55, 1.36, 0.085], [2.9, 1.34, 0.06], [4.9, 1.4, 0.05], [3.9, 1.3, 0.035]];
const RIM = 9; // px of green around the picture
const PAGE_W = 1440, PAGE_H = 976; // the page is drawn at this size, then shrunk
const DREAM_LOOP = 8; // s for one full loop of the dream ripple

export default function ProgramBubble({ program, open, size, offset }: { program: ProgramKey; open: boolean; size: number; offset: [number, number] }) {
  const id = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLSpanElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const state = useRef({ r: 0, v: 0, raf: 0, last: 0, t0: 0 });

  useEffect(() => {
    const s = state.current;
    const R = size / 2, C = (size * BOX) / 2;
    const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
    const blobPath = (r: number, t: number, amp: number, drops: boolean) => {
      if (r < 0.5) return "circle(0px at 50% 50%)";
      const pts: [number, number][] = [];
      for (let k = 0; k < POINTS; k++) {
        const th = (k / POINTS) * Math.PI * 2;
        let w = 1;
        LOBES.forEach(([a, hgt, wid], i) => {
          const d = wrap(th - a - 0.08 * Math.sin(t * 0.9 + i));
          w += hgt * (1 + 0.25 * Math.sin(t * 1.8 + i * 1.7)) * Math.exp(-(d * d) / (wid * wid));
        });
        w += amp * (Math.sin(3 * th + t * 2.3) * 0.55 + Math.sin(5 * th - t * 1.7) * 0.3);
        // A little wider than tall, like the page inside.
        pts.push([C + Math.cos(th) * r * w * 1.08, C + Math.sin(th) * r * w * 0.9]);
      }
      const mid = (p: [number, number], q: [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      let d = `M${mid(pts[POINTS - 1], pts[0]).map((n) => n.toFixed(1)).join(",")}`;
      for (let k = 0; k < POINTS; k++) {
        const p = pts[k], m = mid(p, pts[(k + 1) % POINTS]);
        d += ` Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
      }
      d += " Z";
      if (drops) {
        DROPS.forEach(([a, dist, rad], i) => {
          const aa = a + 0.12 * Math.sin(t * 1.3 + i), dd = dist + 0.04 * Math.sin(t * 2.1 + i * 2);
          const cx = C + Math.cos(aa) * r * dd * 1.08, cy = C + Math.sin(aa) * r * dd * 0.9, rr = rad * r;
          d += ` M${(cx - rr).toFixed(1)},${cy.toFixed(1)} a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(2 * rr).toFixed(1)},0 a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(-2 * rr).toFixed(1)},0 Z`;
        });
      }
      return `path("${d}")`;
    };
    const frame = (now: number) => {
      const dt = Math.min(1 / 30, s.last ? (now - s.last) / 1000 : 1 / 60);
      s.last = now;
      if (!s.t0) s.t0 = now;
      const target = open ? R : 0;
      const steps = Math.ceil(dt / (1 / 120)), h = dt / steps;
      for (let i = 0; i < steps; i++) {
        s.v += ((target - s.r) * STIFFNESS - s.v * DAMPING) * h;
        s.r = Math.max(0, s.r + s.v * h);
      }
      const t = (now - s.t0) / 1000;
      // The dream ripple: one trip round the circle every DREAM_LOOP seconds.
      const th = (t / DREAM_LOOP) * Math.PI * 2;
      turbRef.current?.setAttribute("baseFrequency", `${(0.0045 + 0.0015 * Math.cos(th)).toFixed(5)} ${(0.016 + 0.004 * Math.sin(th)).toFixed(5)}`);
      // Wobblier while moving; a gentle ripple at rest.
      const amp = 0.035 + Math.min(0.1, Math.abs(s.v) / (R * 6));
      // Floats out from the splat to its spot as it grows.
      const k = Math.min(1.15, s.r / R);
      if (wrapRef.current) wrapRef.current.style.transform = `translate(-50%, -50%) translate(${(offset[0] * k).toFixed(1)}px, ${(offset[1] * k).toFixed(1)}px)`;
      if (greenRef.current) greenRef.current.style.clipPath = blobPath(s.r, t, amp, true);
      if (pageRef.current) pageRef.current.style.clipPath = blobPath(Math.max(0, s.r - RIM), t + 0.12, amp * 0.9, false);
      const settled = !open && s.r < 0.5 && Math.abs(s.v) < 1;
      if (settled) { s.r = 0; s.v = 0; s.raf = 0; s.last = 0; return; }
      s.raf = requestAnimationFrame(frame);
    };
    if (!s.raf) s.raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; s.last = 0; };
  }, [open, size, offset]);

  const scale = (size * 1.7) / PAGE_W; // close in on the middle of the page
  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 block"
      style={{ width: size * BOX, height: size * BOX, transform: "translate(-50%, -50%)" }}
    >
      {/* The TV-dream distortion: a slow wavy shimmer */}
      <svg width="0" height="0" className="absolute">
        {/* Wavy noise whose wave sizes travel round a circle (driven each frame
            below), so the ripple keeps flowing one way and loops cleanly, with
            no stop-and-reverse. Works the same in every browser. */}
        <filter id={`${id}-dream`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.0045 0.016" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="64" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div ref={greenRef} className="absolute inset-0 bg-green" style={{ clipPath: "circle(0px at 50% 50%)" }} />
      <div ref={pageRef} className="absolute inset-0 overflow-hidden bg-paper" style={{ clipPath: "circle(0px at 50% 50%)" }}>
        <div
          className="absolute top-1/2 left-1/2 origin-center saturate-[1.15]"
          style={{ width: PAGE_W, height: PAGE_H, transform: `translate(-50%, -50%) scale(${scale})`, filter: `url(#${id}-dream) saturate(1.15)` }}
        >
          <div className="h-full w-full bg-paper">
            <DraftNav />
            <ProgramPageBody program={program} preview />
          </div>
        </div>
        {/* Scan lines and a soft dark rim, like an old TV */}
        <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(13,15,14,0.07)_0px,rgba(13,15,14,0.07)_1px,transparent_1px,transparent_3px)]" />
        <span className="absolute inset-0 bg-[radial-gradient(closest-side,transparent_55%,rgba(13,15,14,0.3)_100%)]" />
      </div>
    </span>
  );
}
