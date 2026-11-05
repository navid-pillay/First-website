"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import psLogo from "@/assets/power-soccer-logo.png";
import FcCrest from "@/components/FcCrest";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
import { cn } from "@/lib/utils";

// Below the draft hero: the hero's left rule keeps drawing down the page as
// the reader scrolls (only then), small captions appear as the line reaches
// them, and it ends at the two programs to choose from.

// The line's tip sits this far down the window, so it is drawn as you scroll.
const TIP = 0.72;

const CAPTIONS: { top: string; lines: [string, string] }[] = [
  { top: "10%", lines: ["02 — Two programs", "Learn. Develop. Grow."] },
  { top: "32%", lines: ["Power Soccer Inc.", "Training & soccer schools since 1996"] },
  { top: "54%", lines: ["Power FC", "High performance academy since 2005"] },
  { top: "76%", lines: ["Toronto, ON", "Choose where to start"] },
];

// Blobs behind each logo (viewBox 0 0 300 300; the logo sits in the middle).
const BEHIND: { dots: Dot[]; trails: string[] }[] = [
  {
    dots: [[150, 150, 78], [84, 112, 44], [224, 104, 40], [222, 206, 50], [96, 214, 36], [150, 46, 24], [262, 160, 22], [40, 160, 16], [176, 270, 18], [276, 52, 10], [30, 250, 9]],
    trails: ["84,112 150,150 224,104", "96,214 150,150 222,206"],
  },
  {
    dots: [[150, 150, 74], [206, 88, 46], [92, 92, 34], [86, 204, 48], [214, 214, 38], [150, 262, 24], [268, 140, 18], [34, 140, 20], [150, 34, 14], [252, 268, 10], [44, 54, 9]],
    trails: ["92,92 150,150 206,88", "86,204 150,150 214,214"],
  },
];

const PROGRAMS = [
  { href: "/power-soccer/", index: "01", name: "Power Soccer", tagline: "Training & Soccer Schools" },
  { href: "/power-fc/", index: "02", name: "Power FC", tagline: "High Performance Academy" },
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
    <section className="relative">
      <div className="relative mx-auto w-full max-w-[1440px] pb-[12svh]">
        {/* The hero's left rule, carrying on down the page */}
        <span aria-hidden="true" className="absolute top-0 bottom-[12svh] left-[6%] w-px max-[860px]:left-3">
          <span ref={lineRef} style={{ transform: "scaleY(0)" }} className="block h-full w-full origin-top bg-ink" />
        </span>

        {/* Captions along the line, one screen tall */}
        <div className="relative h-svh">
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

        {/* The choice */}
        <div className="relative flex flex-col items-center gap-10 px-[6%] max-[860px]:pr-5 max-[860px]:pl-8">
          <p className="m-0 font-mono text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink/70">Select a program &darr;</p>
          <div className="flex items-start justify-center gap-[clamp(2rem,9vw,9rem)] max-sm:flex-col max-sm:items-center max-sm:gap-14">
            {PROGRAMS.map((p, i) => (
              <Link key={p.href} href={p.href} className="group flex flex-col items-center gap-6 text-ink no-underline">
                <span className="relative grid aspect-square w-[clamp(170px,22vw,280px)] place-items-center">
                  <Blobs viewBox="0 0 300 300" {...BEHIND[i]} width={46} className="absolute -inset-[18%] h-[136%] w-[136%] transition-transform duration-500 group-hover:scale-105" />
                  {i === 0 ? (
                    <Image src={psLogo} alt="Power Soccer Inc." className="relative h-auto w-full transition-transform duration-300 group-hover:-translate-y-1.5" />
                  ) : (
                    <span className="relative block w-[62%] transition-transform duration-300 group-hover:-translate-y-1.5">
                      <FcCrest title="Power FC" className="block h-auto w-full drop-shadow-[8px_10px_0_rgba(13,15,14,0.9)]" />
                    </span>
                  )}
                </span>
                <span className="flex flex-col items-center gap-1 text-center">
                  <span className="font-mono text-[0.72rem] font-bold tracking-[0.16em] text-ink/60">[{p.index}]</span>
                  <strong className={cn(
                    "font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-normal uppercase leading-none",
                    "group-hover:underline group-hover:decoration-ink group-hover:decoration-2 group-hover:underline-offset-[6px] group-focus-visible:underline",
                  )}>{p.name}</strong>
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink/70">{p.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
