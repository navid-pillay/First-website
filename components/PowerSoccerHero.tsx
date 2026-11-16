import Image from "next/image";
import cornerFlag from "@/assets/corner-flag.webp";
import Blobs, { type Dot } from "@/components/heroes/Blobs";
import DotCluster from "@/components/heroes/DotCluster";
import { at, Crosshair, HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import HalftonePhoto from "@/components/heroes/HalftonePhoto";

// The Power Soccer Inc. page's hero (draft), in the main hero's style (ruled
// caption band across the top, left rule, numbered headline lines with
// hairlines, jelly blobs): "See you on the pitch." over the
// poster collage, with the three players printed as halftone dots straight
// from the photo (public/draft/kids-tone.webp, cut out with a transparent
// background), the corner-flag photo, and the Power Soccer Inc. wordmark.
// `preview`: shown inside the hover preview on the draft, so nothing reacts
// to the cursor and there's no opening sequence.

const mono = "font-mono text-[0.68rem] font-semibold uppercase leading-none tracking-[0.14em]";

/** One line of the headline: index number, the words, a hairline rule on its baseline (as on the main hero). */
function Line({ n, rule, text, children, short = false }: { n: string; rule: number; text: number; children: React.ReactNode; short?: boolean }) {
  return (
    <span className="relative block w-fit">
      <span aria-hidden="true" style={at(text)} className={`${mono} intro-in absolute top-[0.2em] -left-[3.2rem] text-ink/60 max-[860px]:hidden`}>{n}</span>
      <span style={at(text)} className="intro-in block">{children}</span>
      <span aria-hidden="true" style={at(rule)} className={`intro-x absolute ${short ? "right-0" : "right-[-40vw]"} bottom-[0.1em] -left-[3.2rem] h-px bg-ink/25 max-[860px]:-left-5`} />
    </span>
  );
}

// Jelly blobs floating around the collage, like the main hero's (wide screens).
const BLOBS: { className: string; viewBox: string; dots: Dot[]; trails: string[]; width: number }[] = [
  { className: "top-[8%] left-[33%] w-[11%]", viewBox: "0 0 260 150", dots: [[60, 60, 34], [122, 44, 22], [170, 74, 30], [222, 50, 12], [96, 112, 14], [20, 116, 8]], trails: ["60,60 122,44 170,74"], width: 26 },
  { className: "top-[52%] left-[29.5%] w-[5%]", viewBox: "0 0 120 300", dots: [[60, 40, 28], [48, 110, 20], [70, 170, 30], [54, 240, 18], [96, 210, 9], [20, 140, 7]], trails: ["60,40 48,110 70,170 54,240"], width: 22 },
  { className: "top-[11%] right-[3%] w-[8%]", viewBox: "0 0 200 220", dots: [[110, 50, 36], [80, 110, 24], [118, 160, 30], [150, 200, 12], [40, 60, 11]], trails: ["110,50 80,110 118,160"], width: 26 },
  { className: "top-[33%] left-[83%] w-[7%]", viewBox: "0 0 200 70", dots: [[40, 35, 26], [100, 30, 18], [150, 40, 22], [188, 22, 8]], trails: ["40,35 100,30 150,40"], width: 22 },
  { className: "bottom-[24%] left-[2%] w-[7%]", viewBox: "0 0 180 140", dots: [[50, 70, 30], [104, 56, 22], [144, 84, 18], [30, 120, 8]], trails: ["50,70 104,56 144,84"], width: 22 },
];

// The opening sequence, as on the main hero: bare paper, the ink lines trace
// in, the players form from scattering dots at PLAYERS_AT, and everything else
// comes on from LATE_AT (seconds; set on each piece with at()).
const PLAYERS_AT = 1.5;
const LATE_AT = 2.2;

export default function PowerSoccerHero({ preview = false }: { preview?: boolean }) {
  return (
    <section className={`relative overflow-hidden bg-paper ${preview ? "" : "hero-intro"}`}>
      <div className="relative mx-auto h-[min(calc(100svh-76px),860px)] min-h-[600px] w-full max-w-[1440px] max-[860px]:flex max-[860px]:h-auto max-[860px]:min-h-0 max-[860px]:flex-col">
        {/* Swiss grid: a ruled caption band across the top, and the left rule (as on the main hero) */}
        <span aria-hidden="true" style={at(0.15)} className="intro-x absolute top-[4.5%] right-[3%] left-[6%] h-px bg-ink max-[860px]:hidden" />
        <div aria-hidden="true" style={at(LATE_AT + 0.1)} className={`${mono} intro-in absolute top-[4.5%] right-[3%] left-[6%] grid grid-cols-4 gap-6 pt-3 text-ink max-[860px]:hidden`}>
          <span>Power Soccer Inc.<br /><span className="text-ink/55">Est. 1996</span></span>
          <span>Soccer schools<br /><span className="text-ink/55">Summer camps</span></span>
          <span>Team &amp; private<br /><span className="text-ink/55">Training</span></span>
          <span className="text-right">Toronto, ON<br /><span className="text-ink/55">&amp; the GTA</span></span>
        </div>
        <span aria-hidden="true" style={at(0.3)} className="intro-y absolute top-[4.5%] bottom-0 left-[6%] w-px bg-ink/25 max-[860px]:hidden" />

        {/* Collage */}
        <HeroArcs className="absolute inset-0 h-full w-full max-[860px]:hidden" />
        {!preview && (
          <>
            <DotCluster style={{ left: "11.5%", top: "16.5%", width: "20%", height: "10%", ...at(LATE_AT + 0.15) }} className="intro-in absolute max-[860px]:hidden" />
            <DotCluster style={{ left: "31%", top: "36%", width: "6%", height: "16%", ...at(LATE_AT + 0.23) }} className="intro-in absolute max-[860px]:hidden" />
            <DotCluster style={{ left: "18%", top: "62%", width: "6%", height: "8%", ...at(LATE_AT + 0.31) }} className="intro-in absolute max-[860px]:hidden" />
            <DotCluster style={{ left: "79%", top: "19%", width: "5%", height: "7%", ...at(LATE_AT + 0.39) }} className="intro-in absolute max-[860px]:hidden" />
          </>
        )}
        <span aria-hidden="true" style={at(LATE_AT + 0.3)} className="intro-x absolute top-[25.8%] left-[8.2%] h-[3%] w-[8%] bg-green max-[860px]:hidden" />
        <span style={at(LATE_AT)} className="intro-in absolute top-[23.5%] left-[11.7%] h-[24.6%] w-[22.4%] overflow-hidden max-[860px]:hidden">
          <Image src={cornerFlag} alt="" fill sizes="(min-width: 860px) 24vw, 0px" className="object-cover contrast-[1.1] grayscale" />
          <span aria-hidden="true" className="photo-grain absolute inset-0" />
        </span>
        {BLOBS.map(({ className, ...blob }, i) => (
          <Blobs key={className} {...blob} jiggle={preview ? 0 : 1} style={at(LATE_AT + 0.5 + i * 0.1)} className={`intro-pop absolute mix-blend-multiply max-[860px]:hidden ${className}`} />
        ))}
        <span aria-hidden="true" style={at(LATE_AT + 0.2)} className="intro-in absolute top-[44%] left-[37%] h-[13%] w-[4.5%] bg-[#9fa29f]/45 max-[860px]:hidden" />
        <Sparkle style={at(LATE_AT + 0.4)} className="intro-pop absolute top-[38.5%] left-[4.2%] w-[2.6%] min-w-5 text-ink max-[860px]:hidden" />

        <Crosshair className="absolute top-[60%] right-[2.5%] w-[5%] min-w-10 text-ink/70 max-[860px]:hidden" />

        {/* Headline */}
        <h1 className="absolute top-[15%] left-[44%] z-10 m-0 pl-[3.2rem] text-[clamp(2.6rem,5.4vw,5.2rem)] uppercase leading-[0.98] tracking-[-0.01em] max-[860px]:static max-[860px]:px-5 max-[860px]:pt-10 max-[860px]:text-[clamp(2.4rem,11.5vw,4rem)]">
          <Line n="01" rule={0.5} text={LATE_AT + 0.1}>
            <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">See you on</span>
          </Line>
          <Line n="02" rule={0.62} text={LATE_AT + 0.22}>
            <span className="block origin-left -skew-x-[10deg]">The pitch.</span>
          </Line>
        </h1>

        {/* Wordmark */}
        <div className="absolute bottom-[9%] left-[6%] z-10 pl-[3.2rem] max-[860px]:static max-[860px]:order-3 max-[860px]:px-5 max-[860px]:pt-2 max-[860px]:pb-10">
          <Line n="03" rule={0.74} text={LATE_AT + 0.34} short>
            <span className="block origin-left -skew-x-[10deg] font-display text-[clamp(1.8rem,3.5vw,3.3rem)] uppercase leading-[1.1]">Power Soccer</span>
          </Line>
          <p style={at(LATE_AT + 0.45)} className={`${mono} intro-in m-0 mt-3 text-ink/60`}>Inc. — Training &amp; soccer schools</p>
        </div>

        {/* The players, as halftone dots from the photo */}
        <HalftonePhoto
          src="/draft/kids-tone.webp"
          width={1600}
          height={905}
          interactive={!preview}
          introAt={PLAYERS_AT * 1000}
          spacing={4} // finer than the main hero's 7, so the children's faces read
          className="mix-blend-multiply absolute right-[-3%] bottom-0 w-[57%] max-[860px]:static max-[860px]:order-2 max-[860px]:mt-6 max-[860px]:-ml-[18%] max-[860px]:w-[136%] max-[860px]:max-w-none"
        />
        <p className="sr-only">Three young Power Soccer players sitting on the pitch with a ball, laughing together.</p>
      </div>
    </section>
  );
}
