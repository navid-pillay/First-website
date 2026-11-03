"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import fcCrest from "@/assets/power-fc-crest.png";
import psLogo from "@/assets/power-soccer-logo.png";
import Stars from "@/components/Stars";

type Pendant = {
  href: string;
  name: string;
  tagline: string;
  logo: StaticImageData;
  alt: string;
  logoWidth: string;
  delay: number;
};

const PENDANTS: Pendant[] = [
  { href: "/power-soccer/", name: "Power Soccer", tagline: "Training & Soccer Schools", logo: psLogo, alt: "Power Soccer Inc.", logoWidth: "92%", delay: 0.5 },
  { href: "/power-fc/", name: "Power FC", tagline: "High Performance Academy", logo: fcCrest, alt: "Power FC", logoWidth: "54%", delay: 0.85 },
];

const SPARKLES = [
  { className: "top-[6%] right-[12%] size-7", offset: 0.6 },
  { className: "top-[42%] -left-[2%] size-[18px]", offset: 1.0 },
  { className: "bottom-[18%] right-[4%] size-5", offset: 1.4 },
];

// The first screen: both programs as metal pendants on black, with green
// light drifting behind fluted glass, twinkling stars, and flutes that glow
// under the cursor. Choosing a pendant fades out into that program's page.
export default function Intro() {
  const router = useRouter();
  const bgRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    let x = 0, y = 0, queued = false;
    const place = () => {
      queued = false;
      bg.style.setProperty("--mx", `${x}px`);
      bg.style.setProperty("--my", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setLit(true);
      if (!queued) {
        queued = true;
        requestAnimationFrame(place);
      }
    };
    const off = () => setLit(false);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", off);
    window.addEventListener("blur", off);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", off);
      window.removeEventListener("blur", off);
    };
  }, []);

  const enter = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => router.push(href), 500);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <div ref={bgRef} aria-hidden="true" className="fixed inset-0 overflow-hidden opacity-0 [animation:fade-in_2.4s_ease-out_0.2s_forwards]">
        <span className="intro-glow -left-[30vmax] -top-[20vmax] [animation:glow-a_18s_ease-in-out_infinite]" />
        <span className="intro-glow -right-[30vmax] top-0 [animation:glow-b_22s_ease-in-out_4s_infinite]" />
        <span className="intro-glow -bottom-[45vmax] left-[15vw] [animation:glow-c_20s_ease-in-out_9s_infinite]" />
        <span className="flutes absolute inset-0" />
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.1)_40%,#000_90%)]" />
        <span className={`flute-glow absolute inset-0 transition-opacity duration-600 ${lit ? "opacity-100" : "opacity-0"}`} />
        <Stars density={30000} min={18} max={32} />
      </div>

      <main
        className={`relative z-10 flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-8 transition-[opacity,transform] duration-500 max-sm:gap-6 ${
          leaving ? "scale-[1.03] opacity-0" : ""
        }`}
      >
        <h1 className="sr-only">Power Soccer and Power FC</h1>

        <div className="flex items-start justify-center gap-[clamp(2rem,8vw,7rem)] max-sm:flex-col max-sm:items-center max-sm:gap-7">
          {PENDANTS.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              onClick={enter(p.href)}
              className="group flex flex-col items-center gap-5 text-white no-underline opacity-0 outline-none max-sm:gap-3"
              style={{ animation: `pendant-in 1.6s cubic-bezier(0.2,0.7,0.2,1) ${p.delay}s forwards` }}
            >
              <span className="relative block w-[clamp(150px,22vw,260px)] drop-shadow-[0_18px_40px_rgba(0,0,0,0.8)] transition-transform duration-400 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5 max-sm:w-[170px]">
                <span
                  className="medallion relative grid aspect-square place-items-center overflow-hidden rounded-full shadow-[0_0_22px_rgba(26,122,90,0.25)] transition-shadow duration-400 group-hover:shadow-[0_0_34px_rgba(63,191,143,0.45)]"
                  style={{ "--sheen-delay": `${1.4 + i * 0.4}s` } as CSSProperties}
                >
                  <Image
                    src={p.logo}
                    alt={p.alt}
                    priority
                    className="relative h-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
                    style={{ width: p.logoWidth }}
                  />
                </span>
                {SPARKLES.map((s) => (
                  <span key={s.className} className={`sparkle ${s.className}`} style={{ animationDelay: `${p.delay + s.offset}s` }} />
                ))}
              </span>
              <span
                className="flex flex-col items-center gap-0.5 text-center opacity-0"
                style={{ animation: `fade-in 1s ease-out ${1.6 + i * 0.3}s forwards` }}
              >
                <strong className="font-display text-[1.1rem] font-normal uppercase tracking-[0.06em] group-focus-visible:underline group-focus-visible:underline-offset-[6px]">
                  {p.name}
                </strong>
                <span className="text-[0.85rem] text-white/60">{p.tagline}</span>
              </span>
            </Link>
          ))}
        </div>

        <p className="m-0 text-[0.9rem] font-bold uppercase tracking-[0.35em] text-mint-soft/85 opacity-0 [animation:fade-in_1.2s_ease-out_2.2s_forwards]">
          Learn &middot; Develop &middot; Grow
        </p>
        <p className="m-0 text-[0.8rem] uppercase tracking-[0.25em] text-white/55 opacity-0 [animation:fade-in_1.2s_ease-out_2.4s_forwards]">
          Select a program to enter
        </p>
      </main>
    </div>
  );
}
