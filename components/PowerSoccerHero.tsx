import Image from "next/image";
import { useId } from "react";
import cornerFlag from "@/assets/corner-flag.webp";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
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
      {/* The green as it looks blended into the paper (as on the main page; the
          headline is its own layer, so it can't blend with the paper itself). */}
      <path filter={`url(#${id}-rough)`} d="M30 36 L985 14 L965 268 L8 286 Z" fill="#3ed602" />
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

// Jelly blobs floating around the collage, like the main hero's (wide screens).
const BLOBS: { className: string; viewBox: string; dots: Dot[]; trails: string[]; width: number }[] = [
  { className: "top-[8%] left-[33%] w-[11%]", viewBox: "0 0 260 150", dots: [[60, 60, 34], [122, 44, 22], [170, 74, 30], [222, 50, 12], [96, 112, 14], [20, 116, 8]], trails: ["60,60 122,44 170,74"], width: 26 },
  { className: "top-[52%] left-[29.5%] w-[5%]", viewBox: "0 0 120 300", dots: [[60, 40, 28], [48, 110, 20], [70, 170, 30], [54, 240, 18], [96, 210, 9], [20, 140, 7]], trails: ["60,40 48,110 70,170 54,240"], width: 22 },
  { className: "top-[11%] right-[3%] w-[8%]", viewBox: "0 0 200 220", dots: [[110, 50, 36], [80, 110, 24], [118, 160, 30], [150, 200, 12], [40, 60, 11]], trails: ["110,50 80,110 118,160"], width: 26 },
  { className: "bottom-[24%] left-[2%] w-[7%]", viewBox: "0 0 180 140", dots: [[50, 70, 30], [104, 56, 22], [144, 84, 18], [30, 120, 8]], trails: ["50,70 104,56 144,84"], width: 22 },
];

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
        <span aria-hidden="true" className="absolute top-[25.8%] left-[8.2%] h-[3%] w-[8%] bg-green max-[860px]:hidden" />
        <span className="absolute top-[23.5%] left-[11.7%] h-[24.6%] w-[22.4%] overflow-hidden max-[860px]:hidden">
          <Image src={cornerFlag} alt="" fill sizes="(min-width: 860px) 24vw, 0px" className="object-cover contrast-[1.1] grayscale" />
          <span aria-hidden="true" className="photo-grain absolute inset-0" />
        </span>
        {BLOBS.map(({ className, ...blob }) => (
          <Blobs key={className} {...blob} jiggle={preview ? 0 : 1} className={`absolute mix-blend-multiply max-[860px]:hidden ${className}`} />
        ))}
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
                <Brush className="absolute top-[2%] -left-[5%] h-[100%] w-[110%] mix-blend-multiply" />
                <span className="relative block px-[0.06em]">Pitch.</span>
              </span>
            </span>
          </span>
        </h1>

        {/* Wordmark */}
        <div className="absolute bottom-[9%] left-[6%] z-10 max-[860px]:static max-[860px]:order-3 max-[860px]:px-5 max-[860px]:pt-2 max-[860px]:pb-10">
          <p className="m-0 origin-left -skew-x-[12deg] font-display text-[clamp(1.8rem,3.5vw,3.3rem)] uppercase leading-none">Power Soccer</p>
          <p className="m-0 mt-[0.35em] origin-left -skew-x-[12deg] pl-[0.1em] font-display text-[clamp(1rem,2vw,1.9rem)] uppercase leading-none tracking-[0.55em]">Inc.</p>
          <Swoosh className="mt-3 block w-[clamp(180px,24vw,340px)] mix-blend-multiply" />
        </div>

        {/* The players, as halftone dots from the photo */}
        <HalftonePhoto
          src="/draft/kids-tone.webp"
          width={1600}
          height={905}
          interactive={!preview}
          className="mix-blend-multiply absolute right-[-5%] bottom-0 w-[66%] max-[860px]:static max-[860px]:order-2 max-[860px]:mt-6 max-[860px]:-ml-[18%] max-[860px]:w-[136%] max-[860px]:max-w-none"
        />
        <p className="sr-only">Three young Power Soccer players sitting on the pitch with a ball, laughing together.</p>
      </div>
    </section>
  );
}
