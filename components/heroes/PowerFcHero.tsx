import HalftonePortrait from "@/components/heroes/HalftonePortrait";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
import { COLUMN_DOTS, COLUMN_TRAILS, COLUMN_WIDTH, TRAVELLER } from "@/components/heroes/slime";
import { at, FloodlightPhoto, Crosshair, HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The Power FC hero: the halftone player over the poster collage, with the
// academy slogan. Used on the Power FC page (under the header) and on its own
// on the /draft page, where `fullScreen` lets it fill the whole window.
//
// With `intro`, the hero plays an opening sequence: bare paper, then the ink
// lines trace in, the player builds himself from dots, and everything else
// comes on. The
// start times (seconds) are set on each piece with at(); the classes only
// animate inside .hero-intro (globals.css).
const PLAYER_AT = 1.5;
const LATE_AT = 2.2;
//
// The green is set like a Swiss poster: a few bubbly blobs of fluorescent ink
// around the collage, kept clear of the slogan. Black stays black where green
// crosses it (multiply).

// A small pair over the photo's top-left corner.
const CORNER_PAIR = { viewBox: "0 0 200 70", dots: [[40, 35, 26], [100, 30, 18], [150, 40, 22], [188, 22, 8]] as Dot[], trails: ["40,35 100,30 150,40"], width: 22 };

// Wide screens: loose blobs floating in the corners, some bleeding off the edge.
const FLOATERS: { className: string; viewBox: string; dots: Dot[]; trails: string[]; width: number; travels?: boolean }[] = [
  // Top left, under the caption band
  { className: "top-[11%] left-[11%] w-[13%]", viewBox: "0 0 260 150", dots: [[60, 60, 34], [122, 44, 22], [170, 74, 30], [222, 50, 12], [96, 112, 14], [20, 116, 8]], trails: ["60,60 122,44 170,74"], width: 26 },
  // Top right, running off the right edge (with scrollAway, SlimeSplit draws
  // this one instead, so it can travel down the page)
  { className: "top-[9%] right-[-1.2%] w-[11%]", ...TRAVELLER, travels: true },
];

const mono = "font-mono text-[0.68rem] font-semibold uppercase leading-none tracking-[0.14em]";

/** One line of the headline, with its index number and a hairline rule on its baseline. */
function Line({ n, rule, text, children }: { n: string; rule: number; text: number; children: ReactNode }) {
  return (
    <span className="relative block w-fit">
      <span aria-hidden="true" style={at(text)} className={cn(mono, "intro-in absolute top-[0.2em] -left-[3.2rem] text-[0.68rem] text-ink/60 max-[860px]:hidden")}>{n}</span>
      <span style={at(text)} className="intro-in block">{children}</span>
      <span aria-hidden="true" style={at(rule)} className="intro-x absolute right-[-40vw] bottom-[0.1em] -left-[3.2rem] h-px bg-ink/25 max-[860px]:-left-5" />
    </span>
  );
}

// With `scrollAway`, the player's dots gradually shrink and fade as the page
// scrolls, and dissolve below the hero instead of stopping at its edge (so
// the hero clips only sideways).
export default function PowerFcHero({ fullScreen = false, intro = false, scrollAway = false }: { fullScreen?: boolean; intro?: boolean; scrollAway?: boolean }) {
  return (
    <section data-hero className={cn("relative bg-paper", scrollAway ? "overflow-x-clip" : "overflow-hidden", intro && "hero-intro")}>
      <div className={cn(
          "relative mx-auto h-[min(calc(100svh-76px),860px)] min-h-[560px] w-full max-w-[1440px] max-[860px]:h-auto max-[860px]:min-h-[min(calc(100svh-110px),780px)]",
          fullScreen && "h-svh",
        )}>
        {/* Swiss grid: a ruled top band with captions, and the text column's left rule */}
        <span aria-hidden="true" style={at(0.15)} className="intro-x absolute top-[4.5%] right-[3%] left-[6%] h-px bg-ink max-[860px]:hidden" />
        <div aria-hidden="true" style={at(LATE_AT + 0.1)} className={cn(mono, "intro-in absolute top-[4.5%] right-[3%] left-[6%] grid grid-cols-4 gap-6 pt-3 text-ink max-[860px]:hidden")}>
          <span>Power FC<br /><span className="text-ink/55">High Performance Academy</span></span>
          <span>Boys U8–U18<br /><span className="text-ink/55">Girls U8–U14</span></span>
          <span>Season<br /><span className="text-ink/55">January–November</span></span>
          <span className="text-right">Toronto, ON<br /><span className="text-ink/55">Est. 2005</span></span>
        </div>
        <span aria-hidden="true" style={at(0.3)} className="intro-y absolute top-[4.5%] bottom-0 left-[6%] w-px bg-ink/25 max-[860px]:hidden" />

        {/* Collage behind the player */}
        <HeroArcs className="absolute inset-0 h-full w-full max-[860px]:hidden" />
        <FloodlightPhoto style={at(LATE_AT)} className="intro-in absolute top-[19%] left-[30%] h-[28.5%] w-[22.4%] max-[860px]:hidden" />
        {/* Blobs running down beside the photo, and a pair over its corner */}
        <Blobs viewBox="0 0 200 560" dots={COLUMN_DOTS} trails={COLUMN_TRAILS} width={COLUMN_WIDTH} style={at(LATE_AT + 0.5)} className="intro-pop absolute top-[15%] left-[49.5%] h-[58%] w-auto mix-blend-multiply max-[860px]:hidden" />
        <Blobs {...CORNER_PAIR} style={at(LATE_AT + 0.6)} className="intro-pop absolute top-[26.5%] left-[26%] w-[13%] mix-blend-multiply max-[860px]:hidden" />
        {FLOATERS.map(({ className, travels, ...blob }, i) => !(travels && scrollAway) && (
          <Blobs key={className} {...blob} style={at(LATE_AT + 0.65 + i * 0.1)} className={cn("intro-pop absolute mix-blend-multiply max-[860px]:hidden", className)} />
        ))}
        <span aria-hidden="true" style={at(LATE_AT + 0.2)} className="intro-in absolute right-[0.8%] bottom-0 h-[25%] w-[10%] bg-[#9fa29f] max-[860px]:hidden" />
        <Sparkle style={at(LATE_AT + 0.4)} className="intro-pop absolute top-[34%] left-[8%] w-[3.4%] min-w-6 text-ink" />
        <Crosshair className="absolute top-[48%] right-[4%] w-[6%] min-w-12 text-ink/70 max-[860px]:hidden" />

        <HalftonePortrait introAt={intro ? PLAYER_AT * 1000 : 0} lateAt={intro ? LATE_AT * 1000 : 0} scrollAway={scrollAway} />

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-[6%] pb-[9%] max-[860px]:px-5 max-[860px]:pt-[min(106vw,560px)] max-[860px]:pb-12">
          <h1 className={cn(!intro && "rise-in", "relative m-0 w-fit pl-[3.2rem] text-[clamp(3rem,7.4vw,7.4rem)] uppercase leading-[0.98] tracking-[-0.01em] max-[860px]:pl-0")}>
            <span className="sr-only">Power FC Academy: </span>
            <Line n="01" rule={0.5} text={LATE_AT + 0.1}>
              <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">Learn.</span>
            </Line>
            <Line n="02" rule={0.62} text={LATE_AT + 0.22}>
              <span className="block origin-left -skew-x-[10deg]">Develop.</span>
            </Line>
            <Line n="03" rule={0.74} text={LATE_AT + 0.34}>
              <span className="block origin-left -skew-x-[10deg]">Grow.</span>
            </Line>
          </h1>
        </div>
      </div>
    </section>
  );
}
