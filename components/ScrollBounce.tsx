"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Gives the page a little give as it scrolls: the content lags a few
// millimetres behind fast scrolling, on a spring, and bounces back with a
// small overshoot when the scrolling stops. (Anything fixed-position inside
// would move with it.)

// A virtual scroll position springs after the real one; the content is
// offset by the gap between them, softly capped at MAX.
const MAX = 14; // px, about 4mm
const STIFFNESS = 110;
const DAMPING = 8.5; // under-damped, so it swings past and bounces back

export default function ScrollBounce({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = 0, pos = window.scrollY, vel = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(1 / 20, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const sy = window.scrollY;
      const steps = Math.ceil(dt / (1 / 120)), h = dt / steps;
      for (let s = 0; s < steps; s++) {
        vel += ((sy - pos) * STIFFNESS - vel * DAMPING) * h;
        pos += vel * h;
      }
      const gap = sy - pos;
      if (Math.abs(gap) < 0.05 && Math.abs(vel) < 0.5) { pos = sy; vel = 0; el.style.transform = ""; return; }
      el.style.transform = `translate3d(0, ${(MAX * Math.tanh(gap / MAX)).toFixed(2)}px, 0)`;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // data-slime-host: SlimeSplit draws its layer in here (see there).
  return <div ref={ref} data-slime-host className="relative">{children}</div>;
}
