import Image from "next/image";
import type { CSSProperties } from "react";
import floodlight from "@/assets/floodlight.webp";

// Pieces of the Power FC hero collage: a black-and-white floodlight "photo",
// thin sweeping arcs, a star and a crosshair, all printed on paper. The green
// blobs are in Blobs.tsx. The intro-* classes only animate inside the hero's
// opening sequence (.hero-intro in globals.css).

/** Start time of a piece in the hero's opening sequence. */
export const at = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Black-and-white photo of a stadium floodlight over the goal net, with grain. */
export function FloodlightPhoto({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <span style={style} className={`overflow-hidden ${className}`}>
      <Image src={floodlight} alt="" fill sizes="(min-width: 860px) 24vw, 0px" className="object-cover object-[70%_60%] contrast-[1.15] grayscale" />
      <span aria-hidden="true" className="photo-grain absolute inset-0" />
    </span>
  );
}

/** Thin sweeping arcs across the hero, two green and one grey. In the opening sequence they trace in. */
export function HeroArcs({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 2000 1100" preserveAspectRatio="none" className={className} fill="none">
      <path className="intro-trace" style={at(0.3)} pathLength={1} d="M330 1100 C 360 560 700 190 1220 -10" stroke="#42e202" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
      <path className="intro-trace" style={at(0.45)} pathLength={1} d="M470 1100 C 520 650 820 300 1310 40" stroke="#42e202" strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.8" />
      <path className="intro-trace" style={at(0.6)} pathLength={1} d="M300 560 C 340 380 420 250 460 170" stroke="#0d0f0e" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.35" />
      <path className="intro-trace" style={at(0.75)} pathLength={1} d="M1680 850 C 1820 740 1930 640 1990 560" stroke="#42e202" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Four-pointed sparkle star. */
export function Sparkle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" style={style} className={className}>
      <path d="M20 0 C 21.5 14 26 18.5 40 20 C 26 21.5 21.5 26 20 40 C 18.5 26 14 21.5 0 20 C 14 18.5 18.5 14 20 0 Z" fill="currentColor" />
    </svg>
  );
}

/** Registration crosshair with a tail line. */
export function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 70" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path className="intro-trace" style={at(0.9)} pathLength={1} d="M86 4 V66 M56 35 H118" />
      <path className="intro-in" style={at(1.4)} d="M0 35 H52" strokeDasharray="10 4" opacity="0.5" />
    </svg>
  );
}
