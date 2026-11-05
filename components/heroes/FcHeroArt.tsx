import { useId } from "react";

// Pieces of the Power FC hero collage: a black-and-white floodlight "photo",
// green bars, thin sweeping arcs, a star and a crosshair, all printed on paper.

/** Black-and-white photo of a stadium floodlight over the goal net, with grain. */
export function FloodlightPhoto({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const lamps = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      if ((r === 0 && (c === 0 || c === 4)) || (r === 3 && c === 4)) continue;
      lamps.push({ x: 296 + c * 17 + r * 3, y: 160 + r * 15 - c * 2 });
    }
  }
  const net = [];
  for (let i = -10; i < 22; i++) net.push(`M${i * 18} 186 L${i * 18 + 120} 330`);
  for (let i = 0; i < 10; i++) net.push(`M0 ${200 + i * 14} L320 ${330 + i * 14 - 40}`);
  return (
    <svg aria-hidden="true" viewBox="0 0 450 310" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#8f928f" />
          <stop offset="0.55" stopColor="#c9cbc8" />
          <stop offset="1" stopColor="#e2e3e0" />
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="g2">
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="g2" mode="multiply" />
        </filter>
        <clipPath id={`${id}-clip`}><rect width="450" height="310" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`} filter={`url(#${id}-grain)`}>
        <rect width="450" height="310" fill={`url(#${id}-sky)`} />
        {/* goal net and crossbar */}
        <path d={net.join(" ")} stroke="#3c3f3d" strokeWidth="1.1" fill="none" opacity="0.8" />
        <path d="M-10 168 L330 322" stroke="#7d807d" strokeWidth="13" strokeLinecap="round" />
        <path d="M-10 160 L330 314" stroke="#d9dad7" strokeWidth="4" strokeLinecap="round" />
        {/* floodlight tower */}
        <path d="M331 214 L329 312 M337 214 L340 312" stroke="#2a2c2b" strokeWidth="5" />
        <rect x="290" y="150" width="96" height="66" rx="4" fill="#2a2c2b" transform="rotate(-6 338 183)" />
        {lamps.map((l, i) => (
          <circle key={i} cx={l.x} cy={l.y} r="6.2" fill="#e9eae7" stroke="#111" strokeWidth="1.6" />
        ))}
      </g>
    </svg>
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
