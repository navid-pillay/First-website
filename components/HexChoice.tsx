"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import psLogo from "@/assets/power-soccer-logo.png";
import FcCrest from "@/components/FcCrest";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
import { cn } from "@/lib/utils";

// The draft's program showcase. As the page scrolls, six dots glide down from
// the player (in the hero, marked data-hero) and gather into a hexagon here.
// Once the hexagon is reached it stays, spinning slowly, with green blobs and
// a logo inside that switches between Power Soccer Inc. and Power FC every
// SWITCH_MS. A small caption sits by each corner and changes with the logo.

const SWITCH_MS = 8000;
const TURN_S = 60; // seconds per full turn of the hexagon
const DOT_START = 3.5; // px radius of a dot on the player (like his dots)
const DOT_END = 10; // px radius at the hexagon's corners

// Where the six dots start on the player: fractions of the hero's width and
// height on wide screens, of its width (both axes) on phones, where he sits
// at the top.
const START_WIDE = [[0.68, 0.26], [0.83, 0.62], [0.765, 0.8], [0.625, 0.78], [0.53, 0.62], [0.68, 0.47]];
const START_PHONE = [[0.5, 0.28], [0.85, 0.85], [0.62, 0.97], [0.38, 0.97], [0.15, 0.85], [0.5, 0.56]];

const PROGRAMS = [
  {
    name: "Power Soccer Inc.",
    captions: [
      ["Power Soccer", "Est. 1996"],
      ["Soccer schools", "Year-round"],
      ["Summer camps", "Toronto & the GTA"],
      ["Team training", "& private sessions"],
      ["Smart Soccer", "Possession play"],
      ["All Ball", "A ball in every drill"],
    ],
    blobs: {
      dots: [[150, 150, 78], [84, 112, 44], [224, 104, 40], [222, 206, 50], [96, 214, 36], [150, 46, 24], [262, 160, 22], [40, 160, 16], [176, 270, 18], [276, 52, 10], [30, 250, 9]] as Dot[],
      trails: ["84,112 150,150 224,104", "96,214 150,150 222,206"],
    },
  },
  {
    name: "Power FC",
    captions: [
      ["Power FC", "Est. 2005"],
      ["Boys academy", "U8–U18"],
      ["Girls academy", "U8–U14"],
      ["The season", "January–November"],
      ["Assessment", "Player evaluations"],
      ["Player Profiles", "Detailed reports"],
    ],
    blobs: {
      dots: [[150, 150, 74], [206, 88, 46], [92, 92, 34], [86, 204, 48], [214, 214, 38], [150, 262, 24], [268, 140, 18], [34, 140, 20], [150, 34, 14], [252, 268, 10], [44, 54, 9]] as Dot[],
      trails: ["92,92 150,150 206,88", "86,204 150,150 214,214"],
    },
  },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function HexChoice() {
  const [shown, setShown] = useState(0);
  const centerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<SVGPolygonElement>(null);
  const insideRef = useRef<HTMLDivElement>(null);

  // Switch the logo every SWITCH_MS.
  useEffect(() => {
    const id = setInterval(() => setShown((i) => 1 - i), SWITCH_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const center = centerRef.current;
    if (!center) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const c = center.getBoundingClientRect();
      const cx = c.left + c.width / 2, cy = c.top + c.height / 2;
      const R = c.width / 2;
      const vw = window.innerWidth, vh = window.innerHeight;

      // How far along the glide is: 1 once the hexagon is mid-screen.
      const travel = window.scrollY + cy - vh / 2;
      const p = reduce || travel <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / travel));
      const rot = reduce ? 0 : (((now - t0) / 1000) / TURN_S) * Math.PI * 2;

      const hero = document.querySelector("[data-hero]")?.getBoundingClientRect();
      const phone = vw < 860;
      const pts: string[] = [];
      let formed = 1;
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3 + rot;
        const ex = Math.cos(a) * R, ey = Math.sin(a) * R;
        // Start on the player, relative to the hexagon's centre.
        let sx = ex, sy = ey;
        if (hero) {
          const [fx, fy] = (phone ? START_PHONE : START_WIDE)[i];
          sx = hero.left + fx * hero.width - cx;
          sy = hero.top + (phone ? fy * hero.width : fy * hero.height) - cy;
        }
        // Each dot leaves a little after the one before, on a gentle curve.
        const q = easeInOut(Math.min(1, Math.max(0, (p - i * 0.03) / 0.85)));
        formed = Math.min(formed, q);
        const mx = (sx + ex) / 2, my = (sy + ey) / 2;
        const len = Math.hypot(ex - sx, ey - sy);
        const side = i % 2 ? 1 : -1;
        const kx = mx + (-(ey - sy) / (len || 1)) * len * 0.18 * side;
        const ky = my + ((ex - sx) / (len || 1)) * len * 0.18 * side;
        const x = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * kx + q * q * ex;
        const y = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * ky + q * q * ey;
        const r = DOT_START + (DOT_END - DOT_START) * q;
        const dot = dotRefs.current[i];
        if (dot) {
          dot.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
          dot.style.width = dot.style.height = `${(r * 2).toFixed(1)}px`;
          dot.style.margin = `${(-r).toFixed(1)}px`;
        }
        pts.push(`${ex.toFixed(1)},${ey.toFixed(1)}`);
        // Captions sit just outside each corner, upright, anchored away from the centre.
        const cap = capRefs.current[i];
        if (cap) {
          const dx = Math.cos(a), dy = Math.sin(a);
          const off = R + DOT_END + 12;
          const cw = cap.offsetWidth, ch = cap.offsetHeight;
          let tx = dx * off - ((1 - dx) / 2) * cw;
          const ty = dy * off - ((1 - dy) / 2) * ch;
          // Keep it on screen (phones are narrow).
          tx = Math.min(vw - 8 - cx - cw, Math.max(8 - cx, tx));
          cap.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
          cap.style.textAlign = dx > 0.35 ? "left" : dx < -0.35 ? "right" : "center";
        }
      }
      const done = smooth(0.85, 1, formed);
      lineRef.current?.setAttribute("points", pts.join(" "));
      if (lineRef.current) lineRef.current.style.opacity = String(done);
      if (insideRef.current) {
        insideRef.current.style.opacity = String(done);
        insideRef.current.style.transform = `scale(${(0.85 + 0.15 * done).toFixed(3)})`;
      }
      capRefs.current.forEach((cap) => { if (cap) cap.style.opacity = String(done); });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mono = "font-mono text-[0.66rem] font-semibold uppercase leading-[1.45] tracking-[0.14em] max-[860px]:text-[0.56rem] max-[860px]:tracking-[0.1em]";

  return (
    <div className="relative flex flex-col items-center px-[6%] max-[860px]:px-5">
      <p className="m-0 flex w-full max-w-[760px] items-center gap-4 font-mono text-[0.75rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-ink/70">
        <span className="h-px flex-1 bg-ink/40" />
        03 / Our programs
        <span className="h-px flex-1 bg-ink/40" />
      </p>

      <div className="relative grid h-[calc(clamp(92px,19vw,260px)*2+190px)] w-full place-items-center">
        {/* The hexagon: its size sets R (half its width) */}
        <div ref={centerRef} className="relative aspect-square w-[calc(clamp(92px,19vw,260px)*2)]">
          {/* Inside: green blobs and the current logo */}
          <div ref={insideRef} className="absolute inset-0 opacity-0">
            {PROGRAMS.map((prog, i) => (
              <div key={prog.name} aria-hidden={shown !== i} className={cn("absolute inset-0 grid place-items-center transition-[opacity,scale] duration-900", shown === i ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
                <Blobs viewBox="0 0 300 300" {...prog.blobs} width={46} className="absolute inset-[13%] h-[74%] w-[74%]" />
                {i === 0 ? (
                  <Image src={psLogo} alt="Power Soccer Inc." className="relative h-auto w-[62%]" />
                ) : (
                  <FcCrest title="Power FC" className="relative block h-auto w-[38%] drop-shadow-[8px_10px_0_rgba(13,15,14,0.9)]" />
                )}
              </div>
            ))}
          </div>

          {/* Corner captions, by logo */}
          {Array.from({ length: 6 }, (_, v) => (
            <div key={v} ref={(el) => { capRefs.current[v] = el; }} aria-hidden="true" className="absolute top-1/2 left-1/2 opacity-0">
              <div className="relative">
                {PROGRAMS.map((prog, i) => (
                  <span key={prog.name} className={cn(mono, "block whitespace-nowrap text-ink transition-opacity duration-700", i === 1 && "absolute inset-0", shown === i ? "opacity-100" : "opacity-0")}>
                    {prog.captions[v][0]}<br className="max-[860px]:hidden" /><span className="text-ink/55 max-[860px]:hidden">{prog.captions[v][1]}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* The six dots, placed from the hexagon's centre; they travel in from the player */}
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} ref={(el) => { dotRefs.current[i] = el; }} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 z-20 block rounded-full bg-ink" style={{ width: 7, height: 7, margin: -3.5 }} />
          ))}

          {/* Hairlines joining the corners */}
          <svg aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 overflow-visible" width="1" height="1">
            <polygon ref={lineRef} fill="none" stroke="#0d0f0e" strokeWidth="1" opacity="0" />
          </svg>
        </div>
      </div>

    </div>
  );
}
