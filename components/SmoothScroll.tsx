"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

// Lenis smooth scrolling for the whole site. Visitors who ask for reduced
// motion keep the browser's normal scrolling.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSmooth(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, smoothWheel: smooth, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}
