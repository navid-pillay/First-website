"use client";

import { useEffect, useRef } from "react";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
import DotCluster from "@/components/heroes/DotCluster";
import { Crosshair, Sparkle } from "@/components/heroes/FcHeroArt";
import { CONTACT } from "@/lib/site";
import HexChoice from "@/components/HexChoice";
import { cn } from "@/lib/utils";

// Below the draft hero: the hero's left rule keeps drawing down the page as
// the reader scrolls (only then), small captions appear as the line reaches
// them, and it passes the programs hexagon (HexChoice), which sits mid-page.
// The draft stands on its own: nothing links to the old site's pages.

// The line's tip sits this far down the window, so it is drawn as you scroll.
const TIP = 0.72;

const CAPTIONS: { top: string; lines: [string, string] }[] = [
  { top: "8%", lines: ["02 — Two programs", "Learn. Develop. Grow."] },
  { top: "30%", lines: ["Power Soccer Inc.", "Training & soccer schools since 1996"] },
  { top: "52%", lines: ["Power FC", "High performance academy since 2005"] },
  { top: "74%", lines: ["Toronto, ON", "Choose where to start"] },
];

// Loose blobs floating at the edges, like the hero's corners (wide screens).
const FLOATERS: { className: string; viewBox: string; dots: Dot[]; trails: string[]; width: number }[] = [
  { className: "top-[5%] left-[46%] w-[9%]", viewBox: "0 0 200 120", dots: [[50, 60, 28], [104, 48, 20], [148, 70, 24], [186, 40, 8], [86, 104, 9]], trails: ["50,60 104,48 148,70"], width: 24 },
  { className: "top-[26%] right-[-2%] w-[11%]", viewBox: "0 0 220 220", dots: [[160, 60, 40], [116, 112, 26], [164, 164, 34], [70, 70, 12], [200, 210, 10]], trails: ["160,60 116,112 164,164"], width: 30 },
  { className: "top-[66%] left-[-2.5%] w-[12%]", viewBox: "0 0 240 200", dots: [[50, 70, 42], [104, 110, 28], [70, 160, 32], [150, 92, 14], [170, 170, 9]], trails: ["50,70 104,110 70,160"], width: 32 },
  { className: "top-[84%] right-[7%] w-[8%]", viewBox: "0 0 160 120", dots: [[44, 60, 24], [94, 50, 18], [130, 74, 14], [20, 20, 7]], trails: ["44,60 94,50 130,74"], width: 20 },
];

// Small halftone dot clusters (left, top, width, height), as in the hero; the
// dots swell under the cursor.
const PATCHES = [
  ["38%", "11%", "13%", "11%"],
  ["16%", "50%", "9%", "9%"],
  ["74%", "60%", "12%", "8%"],
];

const BAND = [
  ["Power Soccer Inc.", "Est. 1996"],
  ["Power FC Academy", "Est. 2005"],
  [CONTACT.addressLines[0], CONTACT.addressLines[1]],
  [CONTACT.email, CONTACT.phone],
];

export default function DraftChoice() {
  const lineRef = useRef<HTMLSpanElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "none";
      captionRefs.current.forEach((c) => c?.setAttribute("data-shown", ""));
      return;
    }
    let raf = 0, lastY = -1;
    const update = () => {
      raf = requestAnimationFrame(update);
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const box = line.parentElement!.getBoundingClientRect();
      const drawn = Math.min(box.height, Math.max(0, window.innerHeight * TIP - box.top));
      line.style.transform = `scaleY(${(drawn / box.height).toFixed(4)})`;
      captionRefs.current.forEach((c) => {
        if (!c) return;
        if (c.offsetTop <= drawn) c.setAttribute("data-shown", "");
        else c.removeAttribute("data-shown");
      });
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative overflow-x-clip">
      <div className="relative mx-auto w-full max-w-[1440px] pb-[45svh]">
        {/* Poster details, as in the hero */}
        <svg aria-hidden="true" viewBox="0 0 2000 2000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
          {/* The hero's two green arcs, carried on and curving away off the left edge */}
          <path d="M330 0 C 318 160 270 330 -40 520" stroke="#42e202" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
          <path d="M470 0 C 458 220 390 420 -40 680" stroke="#42e202" strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.8" />
          <path d="M-40 1500 C 400 1180 900 1080 1500 760 S 1980 260 2060 120" stroke="#42e202" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
          <path d="M120 1720 C 520 1380 1000 1260 1560 940 S 1990 500 2060 380" stroke="#42e202" strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.8" />
          <path d="M1240 60 C 1300 260 1420 400 1640 470" stroke="#0d0f0e" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.35" />
          <path d="M260 1960 C 300 1820 380 1720 470 1660" stroke="#0d0f0e" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.35" />
        </svg>
        <span aria-hidden="true" className="pointer-events-none absolute top-[3%] right-[6%] font-display text-[clamp(7rem,17vw,16rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(13,15,14,0.35)] max-[860px]:right-5 max-[860px]:text-[6.5rem]">02</span>
        {PATCHES.map(([left, top, width, height]) => (
          <DotCluster key={left + top} style={{ left, top, width, height }} className="absolute max-[860px]:hidden" />
        ))}
        {FLOATERS.map(({ className, ...blob }) => (
          <Blobs key={className} {...blob} className={cn("absolute mix-blend-multiply max-[860px]:hidden", className)} />
        ))}
        <span aria-hidden="true" className="absolute top-[54%] right-[0.8%] h-[9%] w-[5%] bg-[#9fa29f] max-[860px]:hidden" />
        <Sparkle className="absolute top-[24%] right-[26%] w-[2.6%] min-w-5 text-ink" />
        <Sparkle className="absolute top-[86%] left-[12%] w-[1.8%] min-w-4 text-ink max-[860px]:hidden" />
        <Crosshair className="absolute top-[40%] left-[66%] w-[6%] min-w-12 text-ink/70 max-[860px]:hidden" />
        <Crosshair className="absolute top-[74%] right-[3%] w-[5%] min-w-10 text-ink/70 max-[860px]:hidden" />

        {/* A ruled band of captions near the bottom, like the hero's top band */}
        <div aria-hidden="true" className="absolute right-[3%] bottom-[8svh] left-[6%] grid grid-cols-4 gap-6 border-t border-ink pt-2.5 font-mono text-[0.68rem] font-semibold uppercase leading-[1.5] tracking-[0.14em] text-ink max-[860px]:right-5 max-[860px]:left-3 max-[860px]:grid-cols-2 max-[860px]:gap-y-3">
          {BAND.map(([a, b], i) => (
            <span key={a} className={cn(i === 3 && "text-right max-[860px]:text-left")}>{a}<br /><span className="text-ink/55">{b}</span></span>
          ))}
        </div>

        {/* The hero's left rule, carrying on down the page */}
        <span aria-hidden="true" className="absolute top-0 bottom-[30svh] left-[6%] w-px max-[860px]:left-3">
          <span ref={lineRef} style={{ transform: "scaleY(0)" }} className="block h-full w-full origin-top bg-ink" />
        </span>

        {/* Captions along the line */}
        <div className="relative h-[50svh] min-h-[340px]">
        {CAPTIONS.map(({ top, lines }, i) => (
          <div
            key={lines[0]}
            ref={(el) => { captionRefs.current[i] = el; }}
            aria-hidden="true"
            style={{ top }}
            className="absolute left-[6%] flex translate-y-2 items-start gap-3 font-mono text-[0.68rem] font-semibold uppercase leading-[1.5] tracking-[0.14em] text-ink opacity-0 transition-[opacity,translate] duration-500 data-shown:translate-y-0 data-shown:opacity-100 max-[860px]:left-3"
          >
            <span className="mt-[0.55em] block h-px w-6 bg-ink" />
            <span>{lines[0]}<br /><span className="text-ink/55">{lines[1]}</span></span>
          </div>
        ))}
        </div>

        {/* The programs: six dots from the player gather into a spinning hexagon */}
        <HexChoice />
      </div>
    </section>
  );
}
