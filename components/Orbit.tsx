"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

type Program = { id: string; label: string; when: string; title: string; text: string; where: string[] };

const PROGRAMS: Program[] = [
  {
    id: "fall", label: "Fall Schools", when: "October – December", title: "Fall Soccer Schools",
    text: "Classes for ages 4 to 15, with adult clinics available.",
    where: ["Crescent School", "Toronto City Sports Centre", "Monarch Park", "Upper Canada College"],
  },
  {
    id: "winter", label: "Winter Schools", when: "January – March Break", title: "Winter Soccer Schools",
    text: "Weekly classes through the winter, on different days at each location.",
    where: ["Toronto City Sports Centre (Wed/Thu/Sat)", "Monarch Park (Sun)", "Crescent School (Fri/Sat/Sun)", "Upper Canada College (Fri/Sat)"],
  },
  {
    id: "pa", label: "PA Day Camps", when: "PA days through the school year", title: "PA Day Camps",
    text: "Full day, morning and afternoon options, at different locations through the year.",
    where: ["Toronto City Sports Centre (East York)", "Central Tech Stadium (West Toronto)", "The Hangar at Downsview Park (North York)"],
  },
  {
    id: "summer", label: "Summer Camps", when: "Summer", title: "Summer Camps",
    text: "Fun, high-energy camps where players learn creative moves, turns and ball skills all summer long.", where: [],
  },
  {
    id: "private", label: "Private Training", when: "Year-round", title: "Private Training",
    text: "Focused, individual coaching tailored to each player's goals.", where: [],
  },
  {
    id: "team", label: "Team Training", when: "Year-round", title: "Team Training",
    text: "Sessions for whole teams, led by Power Soccer coaches and built around a skill or tactical focus.", where: [],
  },
  {
    id: "adult", label: "Adult Clinics", when: "With the fall soccer schools", title: "Adult Clinics",
    text: "Clinics for adult players, available alongside the fall soccer schools.", where: [],
  },
];

// Links cycle through three shapes: neighbours (a ring), then every second
// and every third program (two different stars).
const SHAPES = [1, 2, 3];
const LINKS = SHAPES.flatMap((step, shape) =>
  PROGRAMS.map((_, i) => ({ a: i, b: (i + step) % PROGRAMS.length, shape })),
);

const SPIN = (Math.PI * 2) / 120000; // one turn every two minutes
const SHAPE_EVERY = 7000;
const TOUR_EVERY = 6000;
const TOUR_PAUSE = 15000;
const MAX_MOMENTUM = 0.004; // about two-thirds of a turn per second

// Power Soccer's programs on a slowly turning ring that never stops and can
// be grabbed and spun. Green lines link them and every few seconds reconnect
// into a new shape. The selected program's details show in the middle.
export default function Orbit() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [shape, setShape] = useState(0);
  const [dragging, setDragging] = useState(false);
  const activeRef = useRef(0);
  const lastPick = useRef(0);
  const state = useRef({ angle: -Math.PI / 2, size: 0, radius: 0, momentum: 0, dragging: false });

  const select = (i: number, byUser: boolean) => {
    if (byUser) lastPick.current = performance.now();
    activeRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    const orbit = orbitRef.current;
    const svg = svgRef.current;
    if (!orbit || !svg) return;
    const s = state.current;
    const n = PROGRAMS.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      s.size = orbit.clientWidth;
      s.radius = s.size / 2 - (window.innerWidth <= 640 ? 46 : 74);
      svg.setAttribute("viewBox", `0 0 ${s.size} ${s.size}`);
    };

    const place = () => {
      const c = s.size / 2;
      const pts = nodeRefs.current.map((node, i) => {
        const a = s.angle + (i / n) * Math.PI * 2;
        const x = c + Math.cos(a) * s.radius;
        const y = c + Math.sin(a) * s.radius;
        if (node) node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
        return [x, y];
      });
      LINKS.forEach((l, k) => {
        const el = lineRefs.current[k];
        if (!el) return;
        el.setAttribute("x1", pts[l.a][0].toFixed(1));
        el.setAttribute("y1", pts[l.a][1].toFixed(1));
        el.setAttribute("x2", pts[l.b][0].toFixed(1));
        el.setAttribute("y2", pts[l.b][1].toFixed(1));
      });
    };

    measure();
    place();
    const onResize = () => { measure(); place(); };
    window.addEventListener("resize", onResize);

    // Grab and spin. Mouse users can grab anywhere on the ring; touch and pen
    // grab a program label, so swiping elsewhere still scrolls the page. The
    // pointer is only taken over once it's really a drag, so taps still select.
    let pointerId: number | null = null;
    let moved = false;
    let dragAngle = 0;
    let lastMove = 0;
    const pointerAngle = (e: PointerEvent) => {
      const r = orbit.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + s.size / 2), e.clientX - (r.left + s.size / 2));
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const onNode = target.closest("[data-orbit-node]");
      if (!onNode && (e.pointerType !== "mouse" || target.closest("[data-orbit-center]"))) return;
      if (e.button !== 0) return;
      pointerId = e.pointerId;
      moved = false;
      dragAngle = pointerAngle(e);
      lastMove = performance.now();
      s.momentum = 0;
      s.dragging = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const a = pointerAngle(e);
      let d = a - dragAngle;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      if (!moved && Math.abs(d) > 0.02) {
        moved = true;
        setDragging(true);
        if (pointerId !== null) orbit.setPointerCapture(pointerId);
      }
      if (!moved) return;
      const now = performance.now();
      const dt = Math.max(now - lastMove, 1);
      s.angle += d;
      s.momentum = s.momentum * 0.6 + (d / dt) * 0.4;
      dragAngle = a;
      lastMove = now;
      place();
    };
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      setDragging(false);
      if (performance.now() - lastMove > 120) s.momentum = 0;
      s.momentum = Math.max(-MAX_MOMENTUM, Math.min(MAX_MOMENTUM, s.momentum));
      if (orbit.hasPointerCapture(e.pointerId)) orbit.releasePointerCapture(e.pointerId);
      // The click that ends a drag is cancelled below; clear the flag after it.
      setTimeout(() => { moved = false; }, 0);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); }
    };
    orbit.addEventListener("pointerdown", onDown);
    orbit.addEventListener("pointermove", onMove);
    orbit.addEventListener("pointerup", onUp);
    orbit.addEventListener("pointercancel", onUp);
    orbit.addEventListener("click", onClickCapture, true);

    let raf = 0;
    let visible = false;
    let last: number | null = null;
    let sinceShape = 0;
    let sinceTour = 0;
    let hovering = false;
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    orbit.addEventListener("mouseenter", onEnter);
    orbit.addEventListener("mouseleave", onLeave);

    const tick = (now: number) => {
      if (!visible) return;
      if (last !== null) {
        const dt = Math.min(now - last, 100);
        if (!s.dragging) {
          s.angle += (SPIN + s.momentum) * dt;
          s.momentum *= Math.exp(-dt / 900);
        }
        sinceShape += dt;
        if (sinceShape > SHAPE_EVERY) {
          sinceShape = 0;
          setShape((v) => (v + 1) % SHAPES.length);
        }
        sinceTour += dt;
        if (sinceTour > TOUR_EVERY && !hovering && !s.dragging && now - lastPick.current > TOUR_PAUSE) {
          sinceTour = 0;
          select((activeRef.current + 1) % n, false);
        }
        place();
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };

    let io: IntersectionObserver | null = null;
    if (!reduceMotion) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          last = null;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
        }
      });
      io.observe(orbit);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      orbit.removeEventListener("pointerdown", onDown);
      orbit.removeEventListener("pointermove", onMove);
      orbit.removeEventListener("pointerup", onUp);
      orbit.removeEventListener("pointercancel", onUp);
      orbit.removeEventListener("click", onClickCapture, true);
      orbit.removeEventListener("mouseenter", onEnter);
      orbit.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const p = PROGRAMS[active];

  return (
    <div
      ref={orbitRef}
      className={`relative mx-auto mt-10 mb-4 aspect-square w-full max-w-[660px] select-none max-[640px]:mb-0 max-[640px]:aspect-auto max-[640px]:pt-[calc(100%+1rem)] ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <svg ref={svgRef} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible max-[640px]:h-auto max-[640px]:aspect-square">
        {LINKS.map((l, k) => (
          <line
            key={k}
            ref={(el) => { lineRefs.current[k] = el; }}
            className={`orbit-link${l.shape === shape ? " is-on" : ""}${l.a === active || l.b === active ? " is-hot" : ""}`}
          />
        ))}
      </svg>

      <div
        data-orbit-center
        aria-live="polite"
        className="absolute top-1/2 left-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 cursor-auto select-text max-[640px]:relative max-[640px]:top-auto max-[640px]:left-auto max-[640px]:w-auto max-[640px]:translate-x-0 max-[640px]:translate-y-0"
      >
        <div key={p.id} className="[&>*]:[animation:orbit-in_0.6s_ease_both]">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-mint-soft">{p.when}</span>
          <h3 className="mt-1.5 mb-2 text-2xl font-bold text-white">{p.title}</h3>
          <p className="mb-3 text-[0.95rem] text-white/75">{p.text}</p>
          {p.where.length > 0 && <p className="mb-3 text-[0.82rem] text-white/55">{p.where.join(" · ")}</p>}
          <Button href="/contact/" className="mt-1 px-5 py-2.5 text-[0.9rem]">Ask About This Program</Button>
        </div>
      </div>

      <ul className="m-0 list-none p-0">
        {PROGRAMS.map((prog, i) => (
          <li key={prog.id}>
            <button
              type="button"
              data-orbit-node
              ref={(el) => { nodeRefs.current[i] = el; }}
              aria-pressed={i === active}
              onClick={() => select(i, true)}
              onMouseEnter={() => { if (!state.current.dragging) select(i, true); }}
              className={`absolute top-0 left-0 touch-none whitespace-nowrap rounded-full border px-4 py-2.5 text-[0.92rem] font-semibold shadow-[0_0_0_4px_rgba(13,15,14,0.6)] outline-none transition-[background,border-color,box-shadow] duration-300 focus-visible:border-mint before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] max-[640px]:px-2.5 max-[640px]:py-1.5 max-[640px]:text-[0.72rem] ${
                dragging ? "cursor-grabbing" : "cursor-pointer"
              } ${
                i === active
                  ? "border-mint bg-green text-ink shadow-[0_0_0_4px_rgba(13,15,14,0.6),0_0_24px_rgba(66,226,2,0.45)]"
                  : "border-mint/45 bg-ink/90 text-white hover:border-mint"
              }`}
            >
              {prog.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
