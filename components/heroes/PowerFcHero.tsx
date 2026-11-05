import HalftonePortrait from "@/components/heroes/HalftonePortrait";
import { FloodlightPhoto, Crosshair, DryBrush, HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import { cn } from "@/lib/utils";

// The Power FC hero: the halftone player over the poster collage, with the
// academy slogan. Used on the Power FC page (under the header) and on its own
// on the /draft page, where `fullScreen` lets it fill the whole window.
export default function PowerFcHero({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className={cn(
          "relative mx-auto h-[min(calc(100svh-76px),860px)] min-h-[560px] w-full max-w-[1440px] max-[860px]:h-auto max-[860px]:min-h-[min(calc(100svh-110px),780px)]",
          fullScreen && "h-svh",
        )}>
        {/* Collage behind the player */}
        <HeroArcs className="absolute inset-0 h-full w-full max-[860px]:hidden" />
        <span aria-hidden="true" className="dots-patch absolute top-[13%] left-[29%] h-[10%] w-[12%] max-[860px]:hidden" />
        <span aria-hidden="true" className="dots-patch absolute top-[34%] left-[23%] h-[9%] w-[8%] max-[860px]:hidden" />
        <span aria-hidden="true" className="dots-patch absolute top-[46%] left-[35%] h-[5%] w-[10%] max-[860px]:hidden" />
        <FloodlightPhoto className="absolute top-[19%] left-[30%] h-[28.5%] w-[22.4%] max-[860px]:hidden" />
        <span aria-hidden="true" className="green-bar absolute top-[15%] left-[52.3%] h-[58%] w-[6.2%] max-[860px]:hidden" />
        <span aria-hidden="true" className="absolute top-[28.4%] left-[26%] h-[3.8%] w-[13%] bg-green max-[860px]:hidden" />
        <span aria-hidden="true" className="absolute right-[0.8%] bottom-0 h-[25%] w-[10%] bg-[#9fa29f] max-[860px]:hidden" />
        <Sparkle className="absolute top-[34%] left-[8%] w-[3.4%] min-w-6 text-ink" />
        <Crosshair className="absolute top-[48%] right-[4%] w-[6%] min-w-12 text-ink/70 max-[860px]:hidden" />

        <HalftonePortrait />

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-[6%] pb-[9%] max-[860px]:px-5 max-[860px]:pt-[min(106vw,560px)] max-[860px]:pb-12">
          <h1 className="rise-in m-0 text-[clamp(3rem,7.4vw,7.4rem)] uppercase leading-[0.98] tracking-[-0.01em]">
            <span className="sr-only">Power FC Academy: </span>
            <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">Learn.</span>
            <span className="block"><span className="block origin-left -skew-x-[10deg]">Develop.</span></span>
            <span className="relative block w-fit">
              <DryBrush className="absolute top-[4%] -left-[7%] h-[108%] w-[118%]" />
              <span className="relative block origin-left -skew-x-[10deg]">Grow.</span>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
