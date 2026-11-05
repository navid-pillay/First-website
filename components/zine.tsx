import type { ReactNode } from "react";

// Building blocks for the poster style: torn green brush strokes, small
// monospaced labels, halftone dot fields and printer's crop marks.

// Small deterministic random generator, so strokes look the same on the
// server and in the browser.
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// A torn, slightly ragged band: two jittered edges and frayed ends.
function strokePath(seed: number, ragged: number) {
  const r = rng(seed);
  const top: string[] = [];
  const bottom: string[] = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 1000;
    const swell = Math.sin((i / steps) * Math.PI) * 6;
    top.push(`${x.toFixed(0)},${(18 - swell + (r() - 0.5) * ragged).toFixed(1)}`);
    bottom.push(`${x.toFixed(0)},${(82 + swell + (r() - 0.5) * ragged).toFixed(1)}`);
  }
  // Frayed ends: a few spikes in and out.
  const endR = [0, 1, 2, 3].map(() => `${(1000 - r() * 40).toFixed(0)},${(20 + r() * 60).toFixed(0)}`);
  const endL = [0, 1, 2, 3].map(() => `${(r() * 40).toFixed(0)},${(80 - r() * 60).toFixed(0)}`);
  return `M${top.join(" L")} L${endR.join(" L")} L${bottom.reverse().join(" L")} L${endL.join(" L")} Z`;
}

const FLECKS = (seed: number) => {
  const r = rng(seed + 7);
  return Array.from({ length: 7 }, () => ({ x: r() * 1000, y: r() > 0.5 ? r() * 14 : 86 + r() * 14, w: 6 + r() * 26, h: 2 + r() * 5 }));
};

/** A torn green brush stroke. Size and place it with className (absolute). */
export function Slash({
  className = "",
  seed = 1,
  ragged = 14,
  color = "var(--color-green)",
}: {
  className?: string;
  seed?: number;
  ragged?: number;
  color?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 100" preserveAspectRatio="none" className={`pointer-events-none ${className}`}>
      <path d={strokePath(seed, ragged)} fill={color} />
      {FLECKS(seed).map((f, i) => (
        <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} fill={color} />
      ))}
    </svg>
  );
}

/** Small monospaced label, e.g. [01] THE PATHWAY. */
export function Tag({ index, children, className = "", light = false }: { index?: string; children: ReactNode; className?: string; light?: boolean }) {
  return (
    <span className={`mb-4 inline-flex items-center gap-2 font-mono text-[0.78rem] font-semibold uppercase tracking-[0.16em] ${light ? "text-white/80" : "text-ink/75"} ${className}`}>
      <span aria-hidden="true" className="size-2 bg-green" />
      {index && <span className={light ? "text-white" : "text-ink"}>[{index}]</span>}
      {children}
    </span>
  );
}

/** Words highlighted with a strip of green tape behind them. */
export function Tape({ children }: { children: ReactNode }) {
  return <span className="tape">{children}</span>;
}

/** Halftone dot field that fades out; place it absolutely inside a positioned parent. */
export function Halftone({ className = "", from = "top right", light = false }: { className?: string; from?: string; light?: boolean }) {
  return <span aria-hidden="true" className={`halftone ${light ? "halftone-light" : ""} ${className}`} style={{ ["--ht-from" as string]: from }} />;
}

/** Printer's crop marks in the four corners of the parent. */
export function CropMarks({ light = false }: { light?: boolean }) {
  const c = light ? "border-white/50" : "border-ink/45";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-3 max-sm:inset-2">
      <span className={`absolute top-0 left-0 size-4 border-t border-l ${c}`} />
      <span className={`absolute top-0 right-0 size-4 border-t border-r ${c}`} />
      <span className={`absolute bottom-0 left-0 size-4 border-b border-l ${c}`} />
      <span className={`absolute right-0 bottom-0 size-4 border-r border-b ${c}`} />
    </span>
  );
}

/** A little stacked block of monospaced details, like the corner of a poster. */
export function Meta({ lines, className = "", light = false }: { lines: string[]; className?: string; light?: boolean }) {
  return (
    <p className={`m-0 font-mono text-[0.72rem] leading-[1.6] uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-ink/70"} ${className}`}>
      {lines.map((l) => (
        <span key={l} className="block">{l}</span>
      ))}
    </p>
  );
}
