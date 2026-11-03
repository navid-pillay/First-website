"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

// Lenis smooth scrolling for the whole site. Visitors who ask for reduced
// motion keep the browser's normal scrolling.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(true);
  const [offset, setOffset] = useState(0);
  const path = usePathname();

  // The navigation bar is sticky, so anchor jumps stop just below it.
  useEffect(() => {
    const measure = () => setOffset(document.querySelector("header")?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [path]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSmooth(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -offset }, smoothWheel: smooth, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}
