"use client";

import { useEffect, useId, useRef } from "react";
import DraftNav from "@/components/DraftNav";
import { ProgramPageBody, type ProgramKey } from "@/components/DraftProgramPage";

// Hover preview of a program's page: a small jelly bubble that grows out of the
// splat behind the hovered logo and floats off to one side of it (the logo
// stays where it is, on top), its edge wobbling, with the page inside shrunk
// and gently distorted like a dream sequence on TV. Shrinks back into the
// splat when the cursor leaves.

const STIFFNESS = 120; // the bubble's size spring (per second²)
const DAMPING = 9; // low, so it overshoots and wobbles like jelly
const POINTS = 56; // points around the wobbly edge
const RIM = 9; // px of green around the picture
const PAGE_W = 1440, PAGE_H = 976; // the page is drawn at this size, then shrunk

export default function ProgramBubble({ program, open, size, offset }: { program: ProgramKey; open: boolean; size: number; offset: [number, number] }) {
  const id = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLSpanElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const state = useRef({ r: 0, v: 0, raf: 0, last: 0, t0: 0 });

  useEffect(() => {
    const s = state.current;
    const R = size / 2;
    const wobblePath = (r: number, t: number, amp: number) => {
      if (r < 0.5) return "circle(0px at 50% 50%)";
      const pts: [number, number][] = [];
      for (let k = 0; k < POINTS; k++) {
        const th = (k / POINTS) * Math.PI * 2;
        const w = 1 + amp * (Math.sin(3 * th + t * 2.3) * 0.55 + Math.sin(5 * th - t * 1.7) * 0.3 + Math.sin(2 * th + t * 1.1) * 0.35);
        pts.push([R + Math.cos(th) * r * w, R + Math.sin(th) * r * w]);
      }
      // Smooth closed curve through the midpoints.
      const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      let d = `M${mid(pts[POINTS - 1], pts[0]).map((n) => n.toFixed(1)).join(",")}`;
      for (let k = 0; k < POINTS; k++) {
        const p = pts[k], m = mid(p, pts[(k + 1) % POINTS]);
        d += ` Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
      }
      return `path("${d} Z")`;
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
      // Wobblier while moving; a gentle ripple at rest.
      const amp = 0.035 + Math.min(0.1, Math.abs(s.v) / (R * 6));
      // Floats out from the splat to its spot beside the logo as it grows.
      const k = Math.min(1.15, s.r / R);
      if (wrapRef.current) wrapRef.current.style.transform = `translate(-50%, -50%) translate(${(offset[0] * k).toFixed(1)}px, ${(offset[1] * k).toFixed(1)}px)`;
      if (greenRef.current) greenRef.current.style.clipPath = wobblePath(s.r, t, amp);
      if (pageRef.current) pageRef.current.style.clipPath = wobblePath(Math.max(0, s.r - RIM), t + 0.15, amp * 0.9);
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
      style={{ width: size, height: size, transform: "translate(-50%, -50%)" }}
    >
      {/* The TV-dream distortion: a slow wavy shimmer */}
      <svg width="0" height="0" className="absolute">
        <filter id={`${id}-dream`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="2" seed="4" result="n">
            <animate attributeName="baseFrequency" dur="6s" values="0.006 0.03; 0.009 0.022; 0.006 0.03" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
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
            <ProgramPageBody program={program} />
          </div>
        </div>
        {/* Scan lines and a soft dark rim, like an old TV */}
        <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(13,15,14,0.07)_0px,rgba(13,15,14,0.07)_1px,transparent_1px,transparent_3px)]" />
        <span className="absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(13,15,14,0.28)_100%)]" />
      </div>
    </span>
  );
}
