import type { Metadata } from "next";
import type { ReactNode } from "react";
import FcCrest from "@/components/FcCrest";
import Footer from "@/components/Footer";
import HalftoneCamo from "@/components/heroes/HalftoneCamo";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import { Button, Container, Eyebrow } from "@/components/ui";
import { MOTTO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Power FC | High Performance Academy in Toronto",
  description: "Power FC, the high performance academy program of Power Soccer: boys teams U8 to U18 and girls teams U8 to U14 in Toronto since 2005.",
};

const STATS = [
  ["2005", "Academy founded"],
  ["U8–U18", "Boys academy"],
  ["U8–U14", "Girls academy"],
  ["Jan–Nov", "Academy season"],
];

const PATHWAY = [
  ["I", "Assessment", "Every player joins through a player evaluation, and squads can be joined during the year."],
  ["II", "Squad Placement", "Players join an age group squad in the boys academy (U8–U18) or the girls academy (U8–U14)."],
  ["III", "Development", "Age and skill specific training, detailed Player Profile reports and constant communication with coaches."],
  ["IV", "The Season", "A full academy year from January to November, playing for the Power FC crest."],
];

const AGES = ["U8", "", "U10", "", "U12", "", "U14", "", "U16", "", "U18"];

const STANDARDS = [
  ["Smart Soccer", "Possession soccer and the confidence to find their own solutions, with and without the ball."],
  ["Game Sense", "Quick decision making and speed of reaction, sharpened through lots of game play."],
  ["Player Profiles", "Detailed reports and constant communication with coaches show every player how to improve."],
];

function FcHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="metal-text mb-4 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold uppercase leading-[1.15] tracking-[0.04em]">
      {children}
    </h2>
  );
}

const PANEL =
  "relative overflow-hidden rounded-[14px] border border-white/10 bg-[linear-gradient(160deg,#151918,#0a0c0b)] p-8 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[linear-gradient(90deg,#3fbf8f,#e9ecea_60%,transparent)]";

function AgeBar({ upTo }: { upTo: number }) {
  return (
    <ul className="m-0 grid list-none grid-cols-11 gap-1 p-0">
      {AGES.map((label, i) => (
        <li
          key={i}
          className={`min-h-[1.6rem] text-center text-[0.78rem] before:mb-2 before:block before:h-2 before:rounded before:content-[''] ${
            i <= upTo ? "text-white/80 before:bg-[linear-gradient(90deg,var(--color-green-bright),#3fbf8f)]" : "text-white/55 before:bg-white/10"
          }`}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

export default function PowerFcPage() {
  return (
    <div className="bg-night text-white">
      <main>
        <section className="relative overflow-hidden bg-[#151716]">
          <HalftoneCamo />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(26,122,90,0.3),transparent_55%),linear-gradient(90deg,rgba(7,8,8,0.75)_0%,rgba(7,8,8,0.2)_60%,transparent_100%)]" />
          <Stars />
          <Container className="relative z-10 grid min-h-[min(calc(100vh-80px),760px)] grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-center gap-12 py-16 max-[860px]:min-h-0 max-[860px]:grid-cols-1 max-[860px]:gap-8 max-[860px]:text-center">
            <div className="rise-in">
              <h1 className="mt-2 mb-6 text-[clamp(3rem,8vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[0.02em]">
                <span className="metal-text">Power FC</span>
                <br />
                <span className="text-white">Academy</span>
              </h1>
              <p className="-mt-2 mb-8 flex flex-wrap gap-x-4 gap-y-1 font-display text-[clamp(1.1rem,2.4vw,1.5rem)] uppercase tracking-[0.1em] max-[860px]:justify-center">
                {MOTTO.map((word, i) => (
                  <span key={word} className={["text-silver", "text-[#b9bfbc]", "text-mint"][i]}>{word}</span>
                ))}
              </p>
              <div className="flex flex-wrap gap-3.5 max-[860px]:justify-center">
                <Button href="/contact/">Book an Assessment</Button>
                <Button href="#pathway" variant="silver">The Pathway</Button>
              </div>
            </div>
            <div className="w-[min(280px,100%)] justify-self-center drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] [animation:crest-float_9s_ease-in-out_infinite] max-[860px]:order-first max-[860px]:w-[190px]">
              <FcCrest title="Power FC crest" className="block h-auto w-full drop-shadow-[0_0_40px_rgba(26,122,90,0.35)]" />
            </div>
          </Container>
          <a href="#pathway" aria-label="Scroll to the pathway" className="scroll-cue absolute bottom-5 left-1/2 z-10 grid size-11 -translate-x-1/2 place-items-center rounded-full text-white/55 transition-colors hover:text-white max-[860px]:hidden">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </a>
        </section>

        <section className="relative overflow-hidden border-t border-white/[0.07] bg-[linear-gradient(180deg,#0c0f0e,#070808)] py-12">
          <Stars />
          <Container className="relative z-10">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-6 text-center">
              {STATS.map(([value, label], i) => (
                <Reveal key={value} delay={i * 120}>
                  <strong className="metal-text block text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-tight">{value}</strong>
                  <span className="mt-1.5 block text-[0.8rem] uppercase tracking-[0.2em] text-white/55">{label}</span>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="pathway" className="border-t border-white/[0.07] py-16">
          <Container>
            <Reveal><Eyebrow className="tracking-[0.3em]">The Pathway</Eyebrow></Reveal>
            <Reveal><FcHeading>From Assessment to the Crest</FcHeading></Reveal>
            <Reveal><p className="max-w-[720px] text-[1.1rem] text-white/70">Every Power FC player follows the same pathway, built around long-term development.</p></Reveal>
            <ol className="relative mt-12 grid list-none grid-cols-4 gap-8 p-0 before:absolute before:inset-x-7 before:top-7 before:h-px before:bg-[linear-gradient(90deg,#3fbf8f,rgba(233,236,234,0.5),rgba(233,236,234,0.1))] max-[860px]:grid-cols-2 max-[860px]:before:hidden max-[520px]:grid-cols-1">
              {PATHWAY.map(([num, title, text], i) => (
                <Reveal as="li" key={num} delay={i * 120}>
                  <span className="relative mb-5 grid size-14 place-items-center rounded-full border border-silver/55 bg-[radial-gradient(circle_at_35%_30%,#2a302d,#0b0d0c_70%)] font-bold tracking-wider text-silver shadow-[0_0_0_6px_#070808,0_0_24px_rgba(63,191,143,0.18)]">
                    {num}
                  </span>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="m-0 text-white/60">{text}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>

        <section className="border-t border-white/[0.07] py-16">
          <Container>
            <Reveal><Eyebrow className="tracking-[0.3em]">Academy Squads</Eyebrow></Reveal>
            <Reveal><FcHeading>Boys &amp; Girls Academies</FcHeading></Reveal>
            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              <Reveal as="article" className={PANEL}>
                <h3 className="mb-1.5 text-2xl font-bold">Boys Academy</h3>
                <p className="mb-7 text-white/60">Teams from U8 through U18.</p>
                <AgeBar upTo={10} />
              </Reveal>
              <Reveal as="article" delay={120} className={PANEL}>
                <h3 className="mb-1.5 text-2xl font-bold">Girls Academy</h3>
                <p className="mb-7 text-white/60">The Power FC Girls Academy currently runs from U8 through U14.</p>
                <AgeBar upTo={6} />
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="border-t border-white/[0.07] py-16">
          <Container>
            <Reveal>
              <blockquote className="metal-text mx-auto mb-12 max-w-[860px] text-center text-[clamp(1.5rem,3.4vw,2.3rem)] font-bold italic leading-[1.3]">
                &ldquo;Proper player development is a long-term project which produces incredible results.&rdquo;
              </blockquote>
            </Reveal>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {STANDARDS.map(([title, text], i) => (
                <Reveal key={title} delay={i * 120} className={PANEL}>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="m-0 text-white/60">{text}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="relative overflow-hidden border-t border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_100%,rgba(26,122,90,0.3),transparent_60%)] py-16 text-center">
          <Stars />
          <Container className="relative z-10">
            <Reveal><FcHeading>Wear the Crest</FcHeading></Reveal>
            <Reveal>
              <p className="mx-auto mb-8 max-w-[720px] text-[1.1rem] text-white/70">
                Players can join Power FC squads during the year after an assessment. Backed by Power Soccer, one of the most respected player development programs in Canada since 1996.
              </p>
            </Reveal>
            <Reveal className="flex flex-wrap justify-center gap-3.5">
              <Button href="/contact/">Book an Assessment</Button>
              <Button href="/about/" variant="silver">Our Story</Button>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer premium />
    </div>
  );
}
