import HalftonePortrait from "@/components/heroes/HalftonePortrait";
import { FloodlightPhoto, Crosshair, HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The Power FC hero: the halftone player over the poster collage, with the
// academy slogan. Used on the Power FC page (under the header) and on its own
// on the /draft page, where `fullScreen` lets it fill the whole window.
//
// The green is set like a Swiss poster: flat, hard-edged blocks on the type's
// own lines (sized in em, so they track the headline at every screen size),
// crossing the letters. Black type stays black where green crosses it
// (multiply); inside the outlined letters the green shows through.

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
        {/* Tall green block beside the photo, with its caption set vertically */}
        <span aria-hidden="true" className="absolute top-[15%] left-[52.3%] flex h-[58%] w-[6.2%] items-start justify-center bg-green pt-3 max-[860px]:hidden">
          <span className={cn(mono, "rotate-180 text-[0.72rem] whitespace-nowrap text-ink [writing-mode:vertical-rl]")}>Learn — Develop — Grow — 2005</span>
        </span>
        {/* Short green block across the photo's top-left corner */}
        <span aria-hidden="true" className={cn(mono, "absolute top-[28.4%] left-[26%] flex h-[3.8%] w-[13%] items-center bg-green px-2.5 text-ink max-[860px]:hidden")}>01 / Academy</span>
        <span aria-hidden="true" className="absolute right-[0.8%] bottom-0 h-[25%] w-[10%] bg-[#9fa29f] max-[860px]:hidden" />
        <Sparkle className="absolute top-[34%] left-[8%] w-[3.4%] min-w-6 text-ink" />
        <Crosshair className="absolute top-[48%] right-[4%] w-[6%] min-w-12 text-ink/70 max-[860px]:hidden" />

        <HalftonePortrait />

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-[6%] pb-[9%] max-[860px]:px-5 max-[860px]:pt-[min(106vw,560px)] max-[860px]:pb-12">
          <h1 className="rise-in relative m-0 w-fit pl-[3.2rem] text-[clamp(3rem,7.4vw,7.4rem)] uppercase leading-[0.98] tracking-[-0.01em] max-[860px]:pl-0">
            <span className="sr-only">Power FC Academy: </span>
            {/* Learn.: outlined letters, half of the word laid over a green block */}
            <Line n="01">
              <span aria-hidden="true" className="absolute top-[0.17em] left-[1.55em] h-[0.66em] w-[2.75em] bg-green" />
              <span className="relative block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">Learn.</span>
            </Line>
            <Line n="02">
              <span className="block origin-left -skew-x-[10deg]">Develop.</span>
            </Line>
            {/* Grow.: on a hard-edged green block that runs past the word, with a caption */}
            <Line n="03">
              <span aria-hidden="true" className="absolute top-[0.12em] -left-[0.18em] h-[0.76em] w-[calc(100%+1.9em)] bg-green">
                <span className={cn(mono, "absolute right-[0.9rem] bottom-[0.7rem] text-ink max-[860px]:right-2 max-[860px]:bottom-1.5 max-[860px]:text-[0.55rem]")}>03 — Grow</span>
              </span>
              <span className="relative block origin-left -skew-x-[10deg]">Grow.</span>
            </Line>
            {/* A green bar joining the Learn. and Grow. blocks through Develop.: black letters stay black under it */}
            <span aria-hidden="true" className="absolute top-[0.83em] left-[calc(3.2rem+3.05em)] h-[1.25em] w-[0.42em] bg-green mix-blend-multiply max-[860px]:left-[3.05em]" />
          </h1>
        </div>
      </div>
    </section>
  );
}
