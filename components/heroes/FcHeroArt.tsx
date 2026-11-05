import Image from "next/image";
import { useId } from "react";
import floodlight from "@/assets/floodlight.webp";

// Pieces of the Power FC hero collage: a black-and-white floodlight "photo",
// green bars, thin sweeping arcs, a star and a crosshair, all printed on paper.

/** Black-and-white photo of a stadium floodlight over the goal net, with grain. */
export function FloodlightPhoto({ className = "" }: { className?: string }) {
  return (
    <span className={`overflow-hidden ${className}`}>
      <Image src={floodlight} alt="" fill sizes="(min-width: 860px) 24vw, 0px" className="object-cover object-[70%_60%] contrast-[1.15] grayscale" />
      <span aria-hidden="true" className="photo-grain absolute inset-0" />
    </span>
  );
}

/** Thin sweeping arcs across the hero, two green and one grey. */
export function HeroArcs({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 2000 1100" preserveAspectRatio="none" className={className} fill="none">
      <path d="M330 1100 C 360 560 700 190 1220 -10" stroke="#42e202" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
      <path d="M470 1100 C 520 650 820 300 1310 40" stroke="#42e202" strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.8" />
      <path d="M300 560 C 340 380 420 250 460 170" stroke="#0d0f0e" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.35" />
      <path d="M1680 850 C 1820 740 1930 640 1990 560" stroke="#42e202" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Four-pointed sparkle star. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <path d="M20 0 C 21.5 14 26 18.5 40 20 C 26 21.5 21.5 26 20 40 C 18.5 26 14 21.5 0 20 C 14 18.5 18.5 14 20 0 Z" fill="currentColor" />
    </svg>
  );
}

/** Registration crosshair with a tail line. */
export function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 70" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M86 4 V66 M56 35 H118" />
      <path d="M0 35 H52" strokeDasharray="10 4" opacity="0.5" />
    </svg>
  );
}

/** Dry-brush green stroke with bristle streaks trailing off the right end. */
export function DryBrush({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const streaks = [12, 22, 31, 44, 52, 63, 71, 83, 90];
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 160" preserveAspectRatio="none" className={`pointer-events-none ${className}`}>
      <defs>
        <filter id={`${id}-dry`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.4" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id}-dry)`} fill="var(--color-green)">
        <path d="M18 30 L930 6 L905 150 L0 158 Z" />
        {streaks.map((y, i) => (
          <rect key={y} x={880 + (i % 3) * 18} y={y + 20} width={60 + ((i * 37) % 70)} height={3 + (i % 3) * 2} />
        ))}
      </g>
    </svg>
  );
}
