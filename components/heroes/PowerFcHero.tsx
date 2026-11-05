import HalftonePortrait from "@/components/heroes/HalftonePortrait";
import { Blobs, FloodlightPhoto, Crosshair, HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The Power FC hero: the halftone player over the poster collage, with the
// academy slogan. Used on the Power FC page (under the header) and on its own
// on the /draft page, where `fullScreen` lets it fill the whole window.
//
// The green is set like a Swiss poster: bubbly blobs of fluorescent ink laid
// across the headline (sized in em, so they track the type at every screen
// size). Black type stays black where green crosses it (multiply); inside the
// outlined letters the green shows through.

// The headline blob, in units of 1/100 em from the start of the text: it
// starts over the end of Learn., wanders down through Develop. and trails off
// to the right under Grow. (Lines are 98 units tall.)
const HEADLINE_DOTS: [number, number, number][] = [
  [235, 40, 39], [305, 26, 29], [372, 52, 49], [446, 30, 26], [470, 78, 21],
  [392, 128, 36], [322, 156, 57], [262, 120, 21], [246, 186, 34], [182, 212, 44],
  [236, 262, 52], [322, 244, 36], [398, 268, 47], [470, 240, 29], [548, 258, 39], [628, 232, 23],
  [532, 150, 23], [598, 104, 16], [118, 128, 16], [694, 262, 13],
];
const HEADLINE_TRAILS = [
  "235,40 305,26 372,52 446,30",
  "372,52 392,128 322,156 246,186 182,212 236,262",
  "236,262 322,244 398,268 470,240 548,258 628,232",
];

// Beside the photo: a chain of blobs running down to the player.
const COLUMN_DOTS: [number, number, number][] = [
  [60, 30, 39], [42, 92, 28], [70, 150, 46], [52, 226, 32], [78, 290, 41], [50, 360, 25], [66, 420, 34], [44, 490, 21], [96, 520, 14], [18, 200, 12],
];
const COLUMN_TRAILS = ["60,30 42,92 70,150 52,226 78,290 50,360 66,420 44,490"];

const mono = "font-mono text-[0.68rem] font-semibold uppercase leading-none tracking-[0.14em]";

/** One line of the headline, with its index number and a hairline rule on its baseline. */
function Line({ n, children, className = "" }: { n: string; children: ReactNode; className?: string }) {
  return (
    <span className={cn("relative block w-fit", className)}>
      <span aria-hidden="true" className={cn(mono, "absolute top-[0.2em] -left-[3.2rem] text-[0.68rem] text-ink/60 max-[860px]:hidden")}>{n}</span>
      {children}
      <span aria-hidden="true" className="absolute right-[-40vw] bottom-[0.1em] -left-[3.2rem] h-px bg-ink/25 max-[860px]:-left-5" />
    </span>
  );
}

export default function PowerFcHero({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className={cn(
          "relative mx-auto h-[min(calc(100svh-76px),860px)] min-h-[560px] w-full max-w-[1440px] max-[860px]:h-auto max-[860px]:min-h-[min(calc(100svh-110px),780px)]",
          fullScreen && "h-svh",
        )}>
        {/* Swiss grid: a ruled top band with captions, and the text column's left rule */}
        <div aria-hidden="true" className={cn(mono, "absolute top-[4.5%] right-[3%] left-[6%] grid grid-cols-4 gap-6 border-t border-ink pt-2.5 text-ink max-[860px]:hidden")}>
          <span>Power FC<br /><span className="text-ink/55">High Performance Academy</span></span>
          <span>Boys U8–U18<br /><span className="text-ink/55">Girls U8–U14</span></span>
          <span>Season<br /><span className="text-ink/55">January–November</span></span>
          <span className="text-right">Toronto, ON<br /><span className="text-ink/55">Est. 2005</span></span>
        </div>
        <span aria-hidden="true" className="absolute top-[4.5%] bottom-0 left-[6%] w-px bg-ink/25 max-[860px]:hidden" />

        {/* Collage behind the player */}
        <HeroArcs className="absolute inset-0 h-full w-full max-[860px]:hidden" />
        <FloodlightPhoto className="absolute top-[19%] left-[30%] h-[28.5%] w-[22.4%] max-[860px]:hidden" />
        {/* Blobs running down beside the photo, and a pair over its corner */}
        <Blobs viewBox="0 0 120 540" dots={COLUMN_DOTS} trails={COLUMN_TRAILS} width={38} className="absolute top-[15%] left-[51.6%] h-[58%] w-auto mix-blend-multiply max-[860px]:hidden" />
        <Blobs viewBox="0 0 200 70" dots={[[40, 35, 26], [100, 30, 18], [150, 40, 22], [188, 22, 8]]} trails={["40,35 100,30 150,40"]} width={22} className="absolute top-[26.5%] left-[26%] w-[13%] mix-blend-multiply max-[860px]:hidden" />
        <span aria-hidden="true" className="absolute right-[0.8%] bottom-0 h-[25%] w-[10%] bg-[#9fa29f] max-[860px]:hidden" />
        <Sparkle className="absolute top-[34%] left-[8%] w-[3.4%] min-w-6 text-ink" />
        <Crosshair className="absolute top-[48%] right-[4%] w-[6%] min-w-12 text-ink/70 max-[860px]:hidden" />

        <HalftonePortrait />

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-[6%] pb-[9%] max-[860px]:px-5 max-[860px]:pt-[min(106vw,560px)] max-[860px]:pb-12">
          <h1 className="rise-in relative m-0 w-fit pl-[3.2rem] text-[clamp(3rem,7.4vw,7.4rem)] uppercase leading-[0.98] tracking-[-0.01em] max-[860px]:pl-0">
            <span className="sr-only">Power FC Academy: </span>
            <Line n="01">
              <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">Learn.</span>
            </Line>
            <Line n="02">
              <span className="block origin-left -skew-x-[10deg]">Develop.</span>
            </Line>
            <Line n="03">
              <span className="block origin-left -skew-x-[10deg]">Grow.</span>
            </Line>
            {/* The blob over the words: black letters stay black under it */}
            <Blobs viewBox="0 0 720 300" dots={HEADLINE_DOTS} trails={HEADLINE_TRAILS} width={46} className="absolute top-0 left-[3.2rem] h-[3em] w-[7.2em] mix-blend-multiply max-[860px]:left-0" />
          </h1>
        </div>
      </div>
    </section>
  );
}
