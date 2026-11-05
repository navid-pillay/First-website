"use client";

import { useEffect, useRef } from "react";

// The Power FC hero: the player photo printed as live halftone dots on paper.
// Black ink for the player (dot size follows the photo's tones), green rim
// light around his outline, and soft green light streaks behind him. Dots
// breathe a little, and swell like jelly under the cursor. Only dots that are
// already printed react: the player, his rim light, the light streaks and the
// small ink clusters by the floodlight photo. Bare paper stays still.
const LENS_RADIUS = 38; // px: how far from the cursor dots swell
const HOVER = 0.6; // how much dots swell under the cursor (1 = double size)
const PUSH = 4; // px: how far dots bulge outward from the cursor

// Spring tuning (per second). Low damping relative to stiffness = more wobble.
const DOT_STIFFNESS = 170; // each dot's size and position spring
const DOT_DAMPING = 9; // under-damped, so dots overshoot and wobble back
const LENS_STIFFNESS = 900; // the spot follows the cursor tightly...
const LENS_DAMPING = 48; // ...with only a touch of follow-through
const POP_STIFFNESS = 260; // the spot pops in and out with a little bounce
const POP_DAMPING = 14;

// Opening animation: once the photo has loaded, the player slides in from
// slightly to the right (a share of the hero's width) and fades in.
const INTRO_SHIFT = "5%";
const INTRO_MS = 1400;

// Black ink for the player, green for the stadium light streaks and his rim light.
const COLORS = ["#0d0f0e", "#5ad62a", "#42e202"];

// The player photo: greyscale with a transparent background (public/hero),
// in a 2000 x 1778 coordinate space. His head is centred at x 850, top at y 40.
const PHOTO = { src: "/hero/player-tone.webp", width: 2000, height: 1778, headX: 850, headTop: 40, shoulders: 1640 };

// Wide screens only: small clusters of ink dots in the collage, as fractions of
// the hero (left, top, width, height). Dots on an 11px grid fade out toward the
// edge of each cluster.
const CLUSTERS = [
  [0.29, 0.13, 0.12, 0.1],
  [0.23, 0.34, 0.08, 0.09],
  [0.35, 0.46, 0.1, 0.05],
];
const CLUSTER_SPACING = 11;
const CLUSTER_DOT = 1.8; // px radius at the cluster's centre
// Collage pieces that sit in front of the clusters (same units), so no cluster
// dot is drawn over them: the floodlight photo.
const COVERS = [[0.3, 0.19, 0.224, 0.285]];

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

export default function HalftonePortrait({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Dot spacing on screen: coarse like a printed poster on wide screens.
    let sp = 10;
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, visible = true;
    const pointer = { x: 0, y: 0, inside: false };
    // The spot under the cursor: a stiff spring on position (tiny follow-through),
    // velocity for squash and stretch, and a bouncy spring on its strength.
    const lens = { x: 0, y: 0, vx: 0, vy: 0, s: 0, vs: 0 };
    // Every dot is its own spring: extra size (g) and bulge offset (ox, oy).
    let g = new Float32Array(0), vg = new Float32Array(0);
    let ox = new Float32Array(0), oy = new Float32Array(0), vox = new Float32Array(0), voy = new Float32Array(0);
    // Every dot's resting position. The first cols * rows are the photo grid;
    // after them come the ink cluster dots, with their size in clusterR.
    let X = new Float32Array(0), Y = new Float32Array(0), clusterR = new Float32Array(0);
    let settled = true;
    // How the picture covers the canvas: scale, and offset so the player sits
    // to the right of the text on wide screens and in the middle on phones.
    let fit = { s: 1, x: 0, y: 0 };
    // Per dot: the photo's ink (0..1) and kind (0 ink, 2 rim light), rebuilt on resize.
    let baseK = new Float32Array(0), baseT = new Uint8Array(0);
    const photo = new Image();
    photo.decoding = "async";

    // Sample the photo onto the dot grid: draw it into a canvas with one pixel
    // per dot (the browser averages each dot's area), then read the tones.
    const sample = () => {
      baseK = new Float32Array(cols * rows);
      baseT = new Uint8Array(cols * rows);
      if (!photo.complete || !photo.naturalWidth) return;
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.imageSmoothingEnabled = true;
      o.imageSmoothingQuality = "high";
      o.drawImage(photo, fit.x / sp + 0.5, fit.y / sp + 0.5, (PHOTO.width * fit.s) / sp, (PHOTO.height * fit.s) / sp);
      const px = o.getImageData(0, 0, cols, rows).data;
      const alpha = new Float32Array(cols * rows);
      for (let i = 0; i < alpha.length; i++) {
        const a = px[i * 4 + 3] / 255;
        alpha[i] = a;
        if (a < 0.02) continue;
        const L = px[i * 4] / 255;
        // Lift the dark tones so his curls and shirt folds show as dot sizes.
        baseK[i] = a * Math.min(1, Math.max(0, 1.08 - Math.pow(L, 0.7) * 1.1));
      }
      // Rim light: a green line just inside the outline and a softer halo outside.
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          let near = 1, far = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const rr = r + dr, cc = c + dc;
              if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
              const v = alpha[rr * cols + cc];
              near = Math.min(near, v);
              far = Math.max(far, v);
            }
          }
          if (alpha[i] > 0.45 && near < 0.3) { baseT[i] = 2; baseK[i] = 0.72; }
          else if (alpha[i] <= 0.45 && far > 0.6) { baseT[i] = 2; baseK[i] = 0.42; }
        }
      }
    };

    // Soft diagonal streaks of green light behind the player, slowly drifting.
    const streak = (x: number, y: number, t: number) => {
      if (w >= 860 && x < w * 0.4) return 0;
      const u = x * 0.87 - y * 0.5 + t * 14, v = x * 0.5 + y * 0.87;
      const n = noise(u * 0.0032, v * 0.016) * 0.75 + noise(u * 0.009, v * 0.04 + 50) * 0.25;
      const edge = w >= 860 ? Math.min(1, (x / w - 0.4) / 0.2) : 1;
      return Math.max(0, (n - 0.6) / 0.4) * edge;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sp = w < 860 ? 5 : 7;
      if (w < 860) {
        // Phones: the player fills the width, standing above the slogan.
        const sc = (w * 0.9) / PHOTO.shoulders;
        fit = { s: sc, x: w * 0.5 - PHOTO.headX * sc, y: 16 - PHOTO.headTop * sc };
      } else {
        // Wide screens: a big player on the right, head near the top and
        // shoulders cropped by the bottom edge like a poster.
        const sc = Math.max(w * 0.000288, (h * 0.9) / PHOTO.height);
        fit = { s: sc, x: w * 0.68 - PHOTO.headX * sc, y: h * 0.12 - PHOTO.headTop * sc };
      }
      cols = Math.ceil(w / sp) + 1;
      rows = Math.ceil(h / sp) + 1;
      const cx: number[] = [], cy: number[] = [], cr: number[] = [];
      if (w >= 860) {
        for (const [l, t, cw, ch] of CLUSTERS) {
          const x0 = l * w, y0 = t * h, bw = cw * w, bh = ch * h;
          for (let y = CLUSTER_SPACING / 2; y < bh; y += CLUSTER_SPACING) {
            for (let x = CLUSTER_SPACING / 2; x < bw; x += CLUSTER_SPACING) {
              const px = x0 + x, py = y0 + y;
              if (COVERS.some(([a, b, c, d]) => px >= a * w && px <= (a + c) * w && py >= b * h && py <= (b + d) * h)) continue;
              // Elliptical fade: full size to 30% of the way out, gone by 75%.
              const e = Math.hypot(x / bw - 0.5, y / bh - 0.5) * Math.SQRT2;
              const a = Math.min(1, Math.max(0, (0.75 - e) / 0.45));
              if (a < 0.08) continue;
              cx.push(px); cy.push(py); cr.push(CLUSTER_DOT * Math.sqrt(a));
            }
          }
        }
      }
      const grid = cols * rows;
      const n = grid + cr.length;
      X = new Float32Array(n); Y = new Float32Array(n);
      for (let i = 0; i < grid; i++) { const r = (i / cols) | 0; X[i] = (i - r * cols) * sp; Y[i] = r * sp; }
      X.set(cx, grid); Y.set(cy, grid);
      clusterR = Float32Array.from(cr);
      g = new Float32Array(n); vg = new Float32Array(n);
      ox = new Float32Array(n); oy = new Float32Array(n); vox = new Float32Array(n); voy = new Float32Array(n);
      sample();
    };

    // Advance every spring by dt seconds (semi-implicit Euler).
    const step = (dt: number) => {
      const ax = (pointer.x - lens.x) * LENS_STIFFNESS - lens.vx * LENS_DAMPING;
      const ay = (pointer.y - lens.y) * LENS_STIFFNESS - lens.vy * LENS_DAMPING;
      lens.vx += ax * dt; lens.vy += ay * dt;
      lens.x += lens.vx * dt; lens.y += lens.vy * dt;
      lens.vs += ((pointer.inside ? 1 : 0) - lens.s) * POP_STIFFNESS * dt - lens.vs * POP_DAMPING * dt;
      lens.s = Math.max(0, lens.s + lens.vs * dt);

      // Squash and stretch: the spot stretches along the direction of travel
      // and narrows across it, keeping roughly the same area.
      const speed = Math.hypot(lens.vx, lens.vy);
      const stretch = Math.min(0.7, speed / 1800);
      const ux = speed > 1 ? lens.vx / speed : 1, uy = speed > 1 ? lens.vy / speed : 0;
      const along = LENS_RADIUS * (1 + stretch), across = LENS_RADIUS / (1 + stretch * 0.6);
      const reach = along * 2.2;
      const strength = Math.min(1.25, lens.s) * HOVER;

      let energy = Math.abs(lens.vs) + Math.abs(lens.s - (pointer.inside ? 1 : 0)) + speed * 0.01;
      for (let i = 0, n = g.length; i < n; i++) {
        let tg = 0, tx = 0, ty = 0;
        const dx = X[i] - lens.x, dy = Y[i] - lens.y;
        if (strength > 0.001 && Math.abs(dx) <= reach && Math.abs(dy) <= reach) {
          const pa = (dx * ux + dy * uy) / along, pc = (-dx * uy + dy * ux) / across;
          const f = Math.exp(-(pa * pa + pc * pc));
          tg = f * strength;
          // Bulge outward, strongest on the spot's edge, zero at its centre.
          const d = Math.hypot(dx, dy) || 1;
          const push = PUSH * strength * f * Math.min(1, d / LENS_RADIUS);
          tx = (dx / d) * push; ty = (dy / d) * push;
        } else if (g[i] === 0 && vg[i] === 0 && ox[i] === 0 && oy[i] === 0) {
          continue; // at rest and far from the cursor
        }
        vg[i] += ((tg - g[i]) * DOT_STIFFNESS - vg[i] * DOT_DAMPING) * dt;
        g[i] += vg[i] * dt;
        vox[i] += ((tx - ox[i]) * DOT_STIFFNESS - vox[i] * DOT_DAMPING) * dt;
        voy[i] += ((ty - oy[i]) * DOT_STIFFNESS - voy[i] * DOT_DAMPING) * dt;
        ox[i] += vox[i] * dt; oy[i] += voy[i] * dt;
        const e = Math.abs(vg[i]) + Math.abs(g[i] - tg) + Math.abs(vox[i]) + Math.abs(voy[i]) * 0.1;
        if (tg === 0 && e < 0.002 && Math.abs(ox[i]) < 0.02 && Math.abs(oy[i]) < 0.02) {
          g[i] = vg[i] = ox[i] = oy[i] = vox[i] = voy[i] = 0; // snap to rest
        } else {
          energy += e;
        }
      }
      settled = !pointer.inside && energy < 0.01;
    };

    // A dot's size: its printed size rb, plus the cursor swell. The swell is
    // scaled by how big the dot already is, so bare paper never grows dots
    // and the faint dots at the edge of a cluster or streak only swell a little.
    const dotRadius = (rb: number, grow: number, max: number) =>
      rb < 0.35 ? 0 : Math.min(max * 1.2, rb + max * 1.1 * grow * Math.min(1, rb / (max * 0.25)));

    const dot = (x: number, y: number, radius: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const max = sp * 0.5;
      // The ink clusters first, as they sit behind the player.
      const grid = cols * rows;
      for (let j = 0; j < clusterR.length; j++) {
        const i = grid + j;
        const rb = clusterR[j] * (0.93 + 0.14 * noise(X[i] * 0.013 + t * 0.35, Y[i] * 0.013 - t * 0.2));
        const radius = dotRadius(rb, g[i], max);
        if (radius > 0) dot(X[i] + ox[i], Y[i] + oy[i], radius, COLORS[0]);
      }
      for (let r = 0; r < rows; r++) {
        const y = r * sp;
        for (let c = 0; c < cols; c++) {
          const x = c * sp;
          const i = r * cols + c;
          // The photo's dot here (or a light streak behind him), breathing slightly.
          let k = baseK[i], type = baseT[i];
          if (k < 0.04 && type === 0) {
            const sk = streak(x, y, t);
            if (sk > 0) { k = sk * 0.8; type = 1; }
          }
          if (k > 0) k *= 0.93 + 0.14 * noise(c * 0.09 + t * 0.35, r * 0.09 - t * 0.2);
          const grow = g[i];
          const radius = dotRadius(max * k, grow, max);
          if (radius === 0) continue;
          // Dots keep their own colour as they swell.
          dot(x + ox[i], y + oy[i], radius, COLORS[type]);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // ~30fps is plenty for the slow drift; run every frame while springs move.
      if (!visible || now - last < (settled ? 33 : 0)) return;
      let dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      dt = Math.min(dt, 1 / 20);
      if (!settled || pointer.inside) {
        // Small fixed sub-steps keep the springs stable at any frame rate.
        const steps = Math.ceil(dt / (1 / 120));
        for (let s = 0; s < steps; s++) step(dt / steps);
      }
      draw(now / 1000);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const inside = e.pointerType === "mouse" && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && !pointer.inside && lens.s < 0.05) { lens.x = x; lens.y = y; lens.vx = lens.vy = 0; }
      pointer.inside = inside;
      pointer.x = x;
      pointer.y = y;
      if (inside) settled = false;
    };
    const onLeave = () => { pointer.inside = false; };

    let intro: Animation | null = null;
    const reveal = () => {
      canvas.style.opacity = "1";
      if (reduce) return;
      intro = canvas.animate(
        [{ transform: `translateX(${INTRO_SHIFT})`, opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: INTRO_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    };
    photo.onload = () => { sample(); draw(last / 1000); reveal(); };
    photo.onerror = reveal;
    photo.src = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${PHOTO.src}`;
    resize();
    draw(0);
    const ro = new ResizeObserver(() => { resize(); draw(last / 1000); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      intro?.cancel();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Hidden until the photo is ready, then revealed by the opening animation.
  return <canvas ref={ref} aria-hidden="true" style={{ opacity: 0 }} className={`absolute inset-0 h-full w-full ${className}`} />;
}
