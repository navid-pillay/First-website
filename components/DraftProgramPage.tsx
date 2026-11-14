import Link from "next/link";
import DraftNav from "@/components/DraftNav";
import FcCrest from "@/components/FcCrest";
import PowerSoccerHero from "@/components/PowerSoccerHero";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
import { SPLATS } from "@/components/heroes/slime";

// A program's page on the draft. Power Soccer Inc. has its designed hero
// (PowerSoccerHero); Power FC is blank for now: its logo on its green splat,
// its name, and a way back to the draft's home.

const PROGRAMS = {
  "power-soccer": { index: "01", name: "Power Soccer", tagline: "Training & Soccer Schools", meta: ["Power Soccer Inc.", "Est. 1996", "Toronto, ON"], splat: SPLATS[0] },
  "power-fc": { index: "02", name: "Power FC", tagline: "High Performance Academy", meta: ["Power FC Academy", "Est. 2005", "Boys U8–U18 · Girls U8–U14"], splat: SPLATS[1] },
};

const mono = "font-mono text-[0.72rem] font-semibold uppercase leading-[1.5] tracking-[0.14em]";

export type ProgramKey = keyof typeof PROGRAMS;

export default function DraftProgramPage({ program }: { program: ProgramKey }) {
  return (
    <>
      <DraftNav />
      <main className="relative bg-paper">
        <ProgramPageBody program={program} />
      </main>
    </>
  );
}

/** The page's content under the navigation bar (also shown as the hover preview on the draft). */
export function ProgramPageBody({ program, preview = false }: { program: ProgramKey; preview?: boolean }) {
  if (program === "power-soccer") return <PowerSoccerHero preview={preview} />;
  const p = PROGRAMS[program];
  const dots: Dot[] = p.splat;
  return (
        <div className="relative mx-auto flex min-h-[calc(100svh-76px)] w-full max-w-[1440px] flex-col px-[6%] pt-10 pb-12 max-sm:px-5">
          {/* Ruled caption band, as on the draft's hero */}
          <div className={`grid grid-cols-3 gap-6 border-t border-ink pt-2.5 text-ink ${mono} max-sm:grid-cols-1 max-sm:gap-1`}>
            <span>[{p.index}] {p.meta[0]}</span>
            <span className="text-ink/55 max-sm:hidden">{p.meta[1]}</span>
            <span className="text-right text-ink/55 max-sm:hidden">{p.meta[2]}</span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center">
            <span className="relative grid aspect-square w-[clamp(200px,26vw,340px)] place-items-center">
              <Blobs viewBox="0 0 300 300" dots={dots} width={46} className="absolute inset-[2%] h-[96%] w-[96%] mix-blend-multiply" />
              <FcCrest title="Power FC" className="relative block h-auto w-[62%] drop-shadow-[8px_10px_0_rgba(13,15,14,0.9)]" />
            </span>
            <div className="flex flex-col items-center gap-2">
              <h1 className="m-0 font-display text-[clamp(2.2rem,5vw,4rem)] font-normal uppercase leading-none">{p.name}</h1>
              <p className={`m-0 ${mono} text-ink/70`}>{p.tagline}</p>
            </div>
            <p className={`m-0 flex w-full max-w-[520px] items-center gap-4 whitespace-nowrap ${mono} text-ink/55`}>
              <span className="h-px flex-1 bg-ink/30" />
              Page coming soon
              <span className="h-px flex-1 bg-ink/30" />
            </p>
          </div>

          <Link href="/draft/" className={`self-start text-ink no-underline ${mono} hover:underline hover:decoration-green hover:decoration-2 hover:underline-offset-4`}>
            &larr; Back to the programs
          </Link>
        </div>
  );
}
