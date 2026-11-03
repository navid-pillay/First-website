"use client";

import { useEffect, useRef } from "react";

// Live version of the Power FC training top pattern: a grid of halftone dots
// whose size forms blocky camo patches that slowly drift and morph.
const SPACING = 9; // px between dot centres
const CELL = 2; // dots per camo "pixel" block, for the jersey's stepped edges

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function camo(x: number, y: number, t: number) {
  return (
    noise(x * 0.11 + t * 0.06, y * 0.11 - t * 0.04) * 0.55 +
    noise(x * 0.26 - t * 0.05, y * 0.26 + t * 0.07 + 40) * 0.3 +
    noise(x * 0.7 + 90, y * 0.7 + t * 0.1) * 0.15
  );
}

export default function HalftoneCamo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, last = 0, visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      const max = SPACING * 0.5;
      for (let r = 0; r < rows; r++) {
        const y = r * SPACING;
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          // Sample per block for stepped edges, blend a little per dot for softness.
          const n = camo(Math.floor(c / CELL), Math.floor(r / CELL), t) * 0.6 + camo(c / CELL, r / CELL, t) * 0.4;
          let size: number, shade: string;
          if (n > 0.6) { size = 0.9; shade = "#4c504e"; }
          else if (n > 0.52) { size = 0.68; shade = "#3a3e3c"; }
          else if (n > 0.44) { size = 0.45; shade = "#2c2f2e"; }
          else { size = 0.3; shade = "#232625"; }
          ctx.fillStyle = shade;
          ctx.beginPath();
          ctx.arc(x, y, max * size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return; // ~30fps is plenty for slow drift
      last = now;
      draw(now / 1000);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => { resize(); draw(last / 1000); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
}
