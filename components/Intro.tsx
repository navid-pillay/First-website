"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import psLogo from "@/assets/power-soccer-logo.png";
import FcCrest from "@/components/FcCrest";
import { CropMarks, Halftone, Meta, Slash, Tape } from "@/components/zine";

type Program = {
  href: string;
  index: string;
  name: string;
  tagline: string;
  logo: StaticImageData | "crest";
  alt: string;
  logoWidth: string;
  seed: number;
  tilt: string;
  delay: number;
};

const PROGRAMS: Program[] = [
  { href: "/power-soccer/", index: "01", name: "Power Soccer", tagline: "Training & Soccer Schools", logo: psLogo, alt: "Power Soccer Inc.", logoWidth: "100%", seed: 4, tilt: "-rotate-[8deg]", delay: 0.35 },
  { href: "/power-fc/", index: "02", name: "Power FC", tagline: "High Performance Academy", logo: "crest", alt: "Power FC", logoWidth: "66%", seed: 11, tilt: "rotate-[7deg]", delay: 0.6 },
];

// The first screen, printed like a poster: both programs on white paper with
// halftone dots and torn green strokes. Choosing one fades into its page.
export default function Intro() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const enter = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => router.push(href), 450);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-paper text-ink">
      <Halftone from="top right" />
      <Halftone from="bottom left" />
      <CropMarks />

      <main
        className={`relative z-10 flex h-full flex-col px-8 py-7 transition-[opacity,transform] duration-450 max-sm:px-5 max-sm:py-5 ${
          leaving ? "scale-[1.02] opacity-0" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4 opacity-0 [animation:fade-in_0.8s_ease-out_0.1s_forwards]">
          <Meta lines={["Power Soccer Inc.", "Est. 1996", "Toronto, ON"]} />
          <Meta className="text-right" lines={["Power FC Academy", "Est. 2005", "Boys & Girls"]} />
        </div>

        <h1 className="sr-only">Power Soccer and Power FC</h1>

        <div className="flex flex-1 items-center justify-center gap-[clamp(2rem,9vw,8rem)] max-sm:flex-col max-sm:gap-6">
          {PROGRAMS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              onClick={enter(p.href)}
              className="group flex flex-col items-center gap-5 text-ink no-underline opacity-0 max-sm:gap-2"
              style={{ animation: `pendant-in 1.1s cubic-bezier(0.2,0.7,0.2,1) ${p.delay}s forwards` }}
            >
              <span className="relative grid aspect-square w-[clamp(150px,22vw,260px)] place-items-center max-sm:w-[150px]">
                <Slash
                  seed={p.seed}
                  className={`slash-in absolute top-[38%] -left-[12%] h-[30%] w-[124%] ${p.tilt} transition-transform duration-300 group-hover:scale-x-110`}
                />
                {p.logo === "crest" ? (
                  <span className="relative block transition-transform duration-300 group-hover:-translate-y-1.5" style={{ width: p.logoWidth }}>
                    <FcCrest title={p.alt} className="block h-auto w-full drop-shadow-[8px_10px_0_rgba(13,15,14,0.9)]" />
                  </span>
                ) : (
                  <Image
                    src={p.logo}
                    alt={p.alt}
                    priority
                    className="relative h-auto transition-transform duration-300 group-hover:-translate-y-1.5"
                    style={{ width: p.logoWidth }}
                  />
                )}
              </span>
              <span className="flex flex-col items-center gap-1 text-center">
                <span className="font-mono text-[0.72rem] font-bold tracking-[0.16em] text-ink/60">[{p.index}]</span>
                <strong className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-normal uppercase leading-none group-hover:underline group-hover:decoration-green group-hover:decoration-4 group-hover:underline-offset-[6px] group-focus-visible:underline">
                  {p.name}
                </strong>
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink/70">{p.tagline}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-ink pt-4 opacity-0 [animation:fade-in_0.8s_ease-out_1.2s_forwards] max-sm:flex-col max-sm:items-start max-sm:gap-2">
          <p className="m-0 font-display text-[clamp(1.1rem,2.4vw,1.6rem)] uppercase leading-none">
            Learn. Develop. <Tape>Grow.</Tape>
          </p>
          <p className="m-0 font-mono text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink/70">Select a program to enter &rarr;</p>
        </div>
      </main>
    </div>
  );
}
