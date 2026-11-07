"use client";

import { ProgramPageBody, type ProgramKey } from "@/components/DraftProgramPage";

// Hover preview of a program's page: the green splat behind the hovered logo
// grows into a circle that fills the screen, revealing the page inside it just
// behind its green edge. Shrinks back into the splat when the cursor leaves.
// Sits under the sticky navigation bar (the same on every page), and never
// catches the cursor, so the hover stays on the logo underneath.

export type Preview = { program: ProgramKey; x: number; y: number; r0: number; open: boolean; top: number };

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const EDGE = 22; // px of green showing at the growing edge

export default function ProgramPreview({ preview }: { preview: Preview | null }) {
  if (!preview) return null;
  const { program, x, y, r0, open, top } = preview;
  const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
  const vh = typeof window === "undefined" ? 900 : window.innerHeight;
  const full = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y)) + 40;
  const r = open ? full : r0;
  const clip = (rr: number) => `circle(${Math.max(0, rr).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      {/* The green edge, leading */}
      <div
        className="absolute inset-0 bg-green"
        style={{ clipPath: clip(open ? r : 0), transition: `clip-path ${open ? 0.75 : 0.45}s ${EASE}` }}
      />
      {/* The page, just inside it (both grow together, so the green edge stays even) */}
      <div
        className="absolute inset-0 overflow-hidden bg-paper"
        style={{ clipPath: clip(open ? r - EDGE : 0), transition: `clip-path ${open ? 0.75 : 0.45}s ${EASE}`, paddingTop: top }}
      >
        <ProgramPageBody program={program} />
      </div>
    </div>
  );
}
