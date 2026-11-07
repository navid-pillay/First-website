"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import psLogo from "@/assets/power-soccer-logo.png";
import FcCrest from "@/components/FcCrest";
import { SPLATS, TRAVELLER, TRAVELLER_SPOT } from "@/components/heroes/slime";

// The draft's programs. The hero's top-right green slime (the hero leaves it
// out with scrollAway) travels down the page as the reader scrolls, as one
// rounded blob wobbling side to side and stretching, overshooting and
// recoiling on its springs. When the logos reach the middle of the screen it splatters into
// two splats, one behind each logo. Scrolling back pulls it together again.
//
// The slime is 22 gooey circles on one fixed layer, simulated in page
// coordinates (so it stays put on the page while it rests). Each has its own
// spring to a target that moves with the scroll: the tail's springs are
// softer than the head's, so the body lags, stretches and wobbles.

const N = 22;
const STIFF_HEAD = 120, STIFF_TAIL = 48; // springs, per second², head to tail
const DAMPING = 6.5; // low, so it overshoots and wobbles back
const DRAG = 7; // how much of the cursor's movement a circle picks up
const REACH = 14; // px past a circle's edge that still counts as touching
const SPLAT_SIZE = 0.95; // a splat's size, relative to its logo slot

const PROGRAMS = [
  { index: "01", name: "Power Soccer", tagline: "Training & Soccer Schools" },
  { index: "02", name: "Power FC", tagline: "High Performance Academy" },
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// The piece's shape as 22 circles: its own dots, plus the rest spread evenly
// along its trail (the thick stroke between them), in its viewBox units.
const SHAPE: [number, number, number][] = (() => {
  const pts = TRAVELLER.trails[0].split(" ").map((p) => p.split(",").map(Number));
  const segs = pts.slice(1).map((b, i) => Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const extra: [number, number, number][] = [];
  const n = N - TRAVELLER.dots.length;
  for (let k = 1; k <= n; k++) {
    let d = (k / (n + 1)) * total, s = 0;
    while (d > segs[s]) d -= segs[s++];
    const [ax, ay] = pts[s], [bx, by] = pts[s + 1], f = d / segs[s];
    extra.push([ax + (bx - ax) * f, ay + (by - ay) * f, TRAVELLER.width / 2]);
  }
  return [...TRAVELLER.dots, ...extra];
})();
// The centre of the shape (viewBox units), and the order circles lead in:
// bottom first, as it travels down.
const MID = SHAPE.reduce((a, [x, y]) => [a[0] + x / N, a[1] + y / N], [0, 0]);
const CHAIN = SHAPE.map((_, i) => i).sort((a, b) => SHAPE[b][1] - SHAPE[a][1]);

export default function SlimeSplit() {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const logoRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const X = new Float32Array(N), Y = new Float32Array(N), R = new Float32Array(N);
    const VX = new Float32Array(N), VY = new Float32Array(N);
    const TX = new Float32Array(N), TY = new Float32Array(N), TR = new Float32Array(N);
    let raf = 0, last = 0, started = false;
    const t0 = performance.now();

    // Work out where every circle should be right now (page coordinates).
    const targets = (now: number) => {
      const sy = window.scrollY, vw = window.innerWidth, vh = window.innerHeight;
      const phone = vw < 860;
      const inner = document.querySelector("[data-hero] > div")?.getBoundingClientRect();
      const slots = slotRefs.current.map((s) => s?.getBoundingClientRect());
      if (!inner || !slots[0] || !slots[1]) return -1;

      // The piece's spot in the hero (on phones, where the corner blobs are
      // hidden, right of the slogan).
      const k = (phone ? 0.36 : TRAVELLER_SPOT.width) * inner.width / 220;
      const L = phone ? inner.left + 0.6 * inner.width : inner.right - (TRAVELLER_SPOT.right + TRAVELLER_SPOT.width) * inner.width;
      const T = inner.top + sy + (phone ? 0.52 : TRAVELLER_SPOT.top) * inner.height;
      const S = { x: L + MID[0] * k, y: T + MID[1] * k };

      // The two splats, centred on the logo slots, SPLAT_SIZE x a slot's width.
      const centres = slots.map((r) => ({ x: r!.left + r!.width / 2, y: r!.top + sy + r!.height / 2, sc: (r!.width * SPLAT_SIZE) / 300 }));
      const M = { x: (centres[0].x + centres[1].x) / 2, y: (centres[0].y + centres[1].y) / 2 };

      // How far along: 1 once the logos are mid-screen.
      const travel = M.y - vh / 2;
      const p = reduce || travel <= 0 ? 1 : clamp01(sy / travel);
      const q = easeInOut(clamp01(p / 0.82)); // along the path
      const m = smooth(0, 0.1, p); // from the column's shape into a slug
      const s = smooth(0.8, 0.97, p); // splitting into the two splats

      // The path: an S-curve from the corner down to between the logos.
      const C1 = { x: S.x + 0.22 * vw, y: S.y + 0.35 * (M.y - S.y) };
      const C2 = { x: M.x - 0.28 * vw, y: M.y - 0.35 * (M.y - S.y) };
      const u = 1 - q;
      const hx = u * u * u * S.x + 3 * u * u * q * C1.x + 3 * u * q * q * C2.x + q * q * q * M.x;
      const hy = u * u * u * S.y + 3 * u * u * q * C1.y + 3 * u * q * q * C2.y + q * q * q * M.y;
      let dx = 3 * u * u * (C1.x - S.x) + 6 * u * q * (C2.x - C1.x) + 3 * q * q * (M.x - C2.x);
      let dy = 3 * u * u * (C1.y - S.y) + 6 * u * q * (C2.y - C1.y) + 3 * q * q * (M.y - C2.y);
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl; dy /= dl;

      const kd = phone ? 0.6 : 1;
      const phase = q * 30 + ((now - t0) / 1000) * 1.2;
      for (let j = 0; j < N; j++) {
        const i = CHAIN[j];
        const [cx, cy, cr] = SHAPE[i];
        // Travelling: the same rounded blob, a little bigger, wobbling side
        // to side (the trailing side a beat behind) with lumps that swell.
        const kt = k * 1.15;
        const wag = Math.sin(phase - j * 0.35) * 14 * kd;
        const sx = hx + (cx - MID[0]) * kt - dy * wag, syy = hy + (cy - MID[1]) * kt + dx * wag;
        const sr = cr * kt * (1 + 0.18 * Math.sin(phase * 0.8 - j * 0.9));
        // Splat: even links go left, odd right.
        const g = j % 2, [px, py, pr] = SPLATS[g][j >> 1], c = centres[g];
        TX[i] = lerp(lerp(L + cx * k, sx, m), c.x + (px - 150) * c.sc, s);
        TY[i] = lerp(lerp(T + cy * k, syy, m), c.y + (py - 150) * c.sc, s);
        TR[i] = lerp(lerp(cr * k, sr, m), pr * c.sc, s);
      }
      return p;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const p = targets(now);
      if (p < 0) return;
      const dt = Math.min(1 / 20, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      if (!started || reduce) {
        X.set(TX); Y.set(TY); R.set(TR); started = true;
      } else {
        const steps = Math.ceil(dt / (1 / 120)), h = dt / steps;
        for (let st = 0; st < steps; st++) {
          for (let j = 0; j < N; j++) {
            const i = CHAIN[j];
            const k = lerp(STIFF_HEAD, STIFF_TAIL, j / (N - 1));
            VX[i] += ((TX[i] - X[i]) * k - VX[i] * DAMPING) * h;
            VY[i] += ((TY[i] - Y[i]) * k - VY[i] * DAMPING) * h;
            X[i] += VX[i] * h; Y[i] += VY[i] * h;
          }
        }
        for (let i = 0; i < N; i++) R[i] += (TR[i] - R[i]) * Math.min(1, dt * 10);
      }
      const sy = window.scrollY;
      for (let i = 0; i < N; i++) {
        const c = circleRefs.current[i];
        if (!c) continue;
        c.setAttribute("cx", X[i].toFixed(1));
        c.setAttribute("cy", (Y[i] - sy).toFixed(1));
        c.setAttribute("r", Math.max(0, R[i]).toFixed(1));
      }
      logoRefs.current.forEach((l) => l?.toggleAttribute("data-on", p > 0.93));
    };

    // The cursor nudges the slime it drags through.
    let prev: { x: number; y: number; t: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduce) return;
      const x = e.clientX, y = e.clientY + window.scrollY, t = e.timeStamp;
      const before = prev;
      prev = { x, y, t };
      if (!before || t - before.t > 120) return;
      const dt = Math.max(8, t - before.t) / 1000;
      let mx = (x - before.x) / dt, my = (y - before.y) / dt;
      const sp = Math.hypot(mx, my);
      if (sp > 900) { mx *= 900 / sp; my *= 900 / sp; }
      for (let i = 0; i < N; i++) {
        const d = Math.hypot(x - X[i], y - Y[i]), range = R[i] + REACH;
        if (d > range) continue;
        const f = 1 - d / range;
        VX[i] += mx * f * DRAG * dt;
        VY[i] += my * f * DRAG * dt;
      }
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-10 px-[6%] max-[860px]:pr-5 max-[860px]:pl-8">
      {/* The slime: fixed over the page, drawn in window coordinates. It
          appears with the hero's other blobs in the opening sequence. */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-0 mix-blend-multiply motion-reduce:opacity-100"
        style={{ animation: "fade-in 0.6s ease-out 2.7s forwards" }}
      >
        <defs>
          <filter id={`${id}-goo`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
            <feColorMatrix in="b" values="0 0 0 0 0.259  0 0 0 0 0.886  0 0 0 0 0.008  0 0 0 24 -11" />
          </filter>
        </defs>
        <g filter={`url(#${id}-goo)`} fill="#000">
          {Array.from({ length: N }, (_, i) => (
            <circle key={i} ref={(el) => { circleRefs.current[i] = el; }} r="0" />
          ))}
        </g>
      </svg>

      <p className="m-0 flex w-full max-w-[760px] items-center gap-4 font-mono text-[0.75rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-ink/70">
        <span className="h-px flex-1 bg-ink/40" />
        03 / Our programs
        <span className="h-px flex-1 bg-ink/40" />
      </p>
      <div className="flex items-start justify-center gap-[clamp(2rem,9vw,9rem)] max-sm:flex-col max-sm:items-center max-sm:gap-14">
        {PROGRAMS.map((p, i) => (
          <div key={p.name} className="flex flex-col items-center gap-6 text-ink">
            {/* The splat lands centred on this slot; the logo pops in over it */}
            <span ref={(el) => { slotRefs.current[i] = el; }} className="relative z-30 grid aspect-square w-[clamp(170px,22vw,280px)] place-items-center">
              <span
                ref={(el) => { logoRefs.current[i] = el; }}
                className="grid w-full scale-50 place-items-center opacity-0 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-on:scale-100 data-on:opacity-100"
              >
                {i === 0 ? (
                  <Image src={psLogo} alt="Power Soccer Inc." className="h-auto w-full" />
                ) : (
                  <FcCrest title="Power FC" className="block h-auto w-[62%] drop-shadow-[8px_10px_0_rgba(13,15,14,0.9)]" />
                )}
              </span>
            </span>
            <span className="flex flex-col items-center gap-1 text-center">
              <span className="font-mono text-[0.72rem] font-bold tracking-[0.16em] text-ink/60">[{p.index}]</span>
              <strong className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-normal uppercase leading-none">{p.name}</strong>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink/70">{p.tagline}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
