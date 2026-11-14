import Image from "next/image";
import { useId } from "react";
import cornerFlag from "@/assets/corner-flag.webp";
import DotCluster from "@/components/heroes/DotCluster";
import { HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import HalftonePhoto from "@/components/heroes/HalftonePhoto";

// The Power Soccer Inc. page's hero (draft): "See you on the pitch." over the
// poster collage, with the three players printed as halftone dots straight
// from the photo (public/draft/kids-tone.webp, cut out with a transparent
// background), the corner-flag photo, and the Power Soccer Inc. wordmark.
// `preview`: shown inside the hover preview on the draft, so nothing reacts
// to the cursor.

/** A rough-edged green brush block behind a word. */
function Brush({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 300" preserveAspectRatio="none" className={`pointer-events-none ${className}`}>
      <defs>
        <filter id={`${id}-rough`} x="-5%" y="-15%" width="110%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.5" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path filter={`url(#${id}-rough)`} d="M30 36 L985 14 L965 268 L8 286 Z" fill="var(--color-green)" />
    </svg>
  );
}

/** Two tapered green strokes under the wordmark. */
function Swoosh({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 440 70" className={className} fill="var(--color-green)">
      <path d="M2 52 C 110 18 300 2 438 6 C 300 14 130 30 2 52 Z" />
      <path d="M150 62 C 220 40 320 28 400 26 C 320 36 230 46 150 62 Z" />
    </svg>
  );
}

export default function PowerSoccerHero({ preview = false }: { preview?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="relative mx-auto h-[min(calc(100svh-76px),860px)] min-h-[600px] w-full max-w-[1440px] max-[860px]:flex max-[860px]:h-auto max-[860px]:min-h-0 max-[860px]:flex-col">
        {/* Collage */}
        <HeroArcs className="absolute inset-0 h-full w-full max-[860px]:hidden" />
        {!preview && (
          <>
            <DotCluster style={{ left: "11.5%", top: "15%", width: "20%", height: "12%" }} className="absolute max-[860px]:hidden" />
            <DotCluster style={{ left: "31%", top: "36%", width: "6%", height: "16%" }} className="absolute max-[860px]:hidden" />
            <DotCluster style={{ left: "18%", top: "62%", width: "6%", height: "8%" }} className="absolute max-[860px]:hidden" />
            <DotCluster style={{ left: "79%", top: "19%", width: "5%", height: "7%" }} className="absolute max-[860px]:hidden" />
          </>
        )}
        <span className="absolute top-[23.5%] left-[11.7%] h-[24.6%] w-[22.4%] overflow-hidden max-[860px]:hidden">
          <Image src={cornerFlag} alt="" fill sizes="(min-width: 860px) 24vw, 0px" className="object-cover contrast-[1.1] grayscale" />
          <span aria-hidden="true" className="photo-grain absolute inset-0" />
        </span>
        <span aria-hidden="true" className="absolute top-[25.8%] left-[8.2%] h-[3%] w-[8%] bg-green max-[860px]:hidden" />
        <span aria-hidden="true" className="absolute bottom-[10%] left-[35.8%] h-[13%] w-[5%] bg-[#9fa29f]/45 max-[860px]:hidden" />
        <Sparkle className="absolute top-[38.5%] left-[4.2%] w-[2.6%] min-w-5 text-ink max-[860px]:hidden" />

        {/* Headline */}
        <h1 className="rise-in absolute top-[13.5%] left-[42%] z-10 m-0 text-[clamp(2.6rem,5.6vw,5.4rem)] uppercase leading-[1.02] tracking-[-0.01em] max-[860px]:static max-[860px]:px-5 max-[860px]:pt-10 max-[860px]:text-[clamp(2.4rem,11.5vw,4rem)]">
          {/* (The slant sits on inner spans: the rise-in animation owns the lines' own transform.) */}
          <span className="block">
            <span className="block origin-left -skew-x-[12deg] text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">See you on</span>
          </span>
          <span className="block">
            <span className="ml-[0.45em] flex w-fit origin-left -skew-x-[12deg] items-center gap-[0.22em] max-[860px]:ml-0">
              <span>The</span>
              <span className="relative block">
                <Brush className="absolute top-[2%] -left-[5%] h-[100%] w-[110%]" />
                <span className="relative block px-[0.06em]">Pitch.</span>
              </span>
            </span>
          </span>
        </h1>

        {/* Wordmark */}
        <div className="absolute bottom-[9%] left-[6%] z-10 max-[860px]:static max-[860px]:order-3 max-[860px]:px-5 max-[860px]:pt-2 max-[860px]:pb-10">
          <p className="m-0 origin-left -skew-x-[12deg] font-display text-[clamp(1.8rem,3.5vw,3.3rem)] uppercase leading-none">Power Soccer</p>
          <p className="m-0 mt-[0.35em] origin-left -skew-x-[12deg] pl-[0.1em] font-display text-[clamp(1rem,2vw,1.9rem)] uppercase leading-none tracking-[0.55em]">Inc.</p>
          <Swoosh className="mt-3 block w-[clamp(180px,24vw,340px)]" />
        </div>

        {/* The players, as halftone dots from the photo */}
        <HalftonePhoto
          src="/draft/kids-tone.webp"
          width={1600}
          height={905}
          interactive={!preview}
          className="absolute right-[-5%] bottom-0 w-[66%] max-[860px]:static max-[860px]:order-2 max-[860px]:mt-6 max-[860px]:-ml-[18%] max-[860px]:w-[136%] max-[860px]:max-w-none"
        />
        <p className="sr-only">Three young Power Soccer players sitting on the pitch with a ball, laughing together.</p>
      </div>
    </section>
  );
}
