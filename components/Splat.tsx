"use client";

import { useId, type CSSProperties } from "react";

// Wet green paint behind a badge. At rest it is a soft, rounded smear; when the
// surrounding `.group` is hovered or focused, arms of paint reach out in every
// direction and droplets fly off their tips. A "goo" filter melts the shapes
// together so the edges stay round and liquid instead of hard-cut.

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Arm = { a: number; len: number; w: number; d: number };
type Drop = { a: number; dist: number; r: number; d: number };

function layout(seed: number) {
  const r = rng(seed);
  const arms: Arm[] = [];
  const drops: Drop[] = [];
  const count = 11;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 360 + (r() - 0.5) * 22;
    // Arms along the smear's long axis reach further.
    const along = Math.abs(Math.cos((a * Math.PI) / 180));
    const len = 95 + along * 70 + r() * 45;
    arms.push({ a, len, w: 16 + r() * 16, d: Math.round(r() * 120) });
    if (r() > 0.35) drops.push({ a: a + (r() - 0.5) * 10, dist: len + 14 + r() * 26, r: 4 + r() * 7, d: 80 + Math.round(r() * 140) });
  }
  return { arms, drops };
}

export default function Splat({ seed = 1, tilt = 0, className = "" }: { seed?: number; tilt?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const { arms, drops } = layout(seed);
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className={`pointer-events-none overflow-visible ${className}`}>
      <defs>
        <filter id={`${id}-goo`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </defs>
      <g filter={`url(#${id}-goo)`} fill="var(--color-green)">
        <g className="splat-core" style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
          <ellipse cx="200" cy="200" rx="150" ry="50" />
          <ellipse cx="150" cy="190" rx="70" ry="44" />
          <ellipse cx="262" cy="212" rx="78" ry="40" />
          <circle cx="335" cy="186" r="16" />
          <circle cx="62" cy="214" r="13" />
        </g>
        {arms.map((arm, i) => (
          <rect
            key={i}
            className="splat-arm"
            x="200"
            y={200 - arm.w / 2}
            width={arm.len}
            height={arm.w}
            rx={arm.w / 2}
            style={{ "--a": `${arm.a}deg`, "--d": `${arm.d}ms` } as CSSProperties}
          />
        ))}
        {drops.map((drop, i) => (
          <circle
            key={i}
            className="splat-drop"
            cx="200"
            cy="200"
            r={drop.r}
            style={{ "--a": `${drop.a}deg`, "--dist": `${drop.dist}px`, "--d": `${drop.d}ms` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
