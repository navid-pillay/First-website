"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Star = { cross: boolean; style: CSSProperties };

// Twinkling green stars scattered over the parent (which must be positioned).
// Generated after mount so server and browser markup always match.
export default function Stars({ density = 22000, min = 8, max = 36 }: { density?: number; min?: number; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const area = parent.offsetWidth * parent.offsetHeight;
    const count = Math.max(min, Math.min(max, Math.round(area / density)));
    const list: Star[] = [];
    for (let i = 0; i < count; i++) {
      const dur = 3 + Math.random() * 4.5;
      list.push({
        cross: i % 7 === 0,
        style: {
          left: `${(Math.random() * 100).toFixed(2)}%`,
          top: `${(Math.random() * 100).toFixed(2)}%`,
          "--size": `${(1.5 + Math.random() * 2).toFixed(1)}px`,
          "--dur": `${dur.toFixed(1)}s`,
          "--delay": `${(-Math.random() * dur).toFixed(1)}s`,
          "--peak": (0.4 + Math.random() * 0.5).toFixed(2),
        } as CSSProperties,
      });
    }
    setStars(list);
  }, [density, min, max]);

  return (
    <span ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span key={i} className={`star${s.cross ? " cross" : ""}`} style={s.style} />
      ))}
    </span>
  );
}
