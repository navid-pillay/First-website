import type { Metadata } from "next";
import Footer from "@/components/Footer";
import HalftonePortrait from "@/components/heroes/HalftonePortrait";
import Reveal from "@/components/Reveal";
import { Button, Card, Container, Eyebrow, H2, Lead, Section } from "@/components/ui";
import { FloodlightPhoto, Crosshair, DryBrush, HeroArcs, Sparkle } from "@/components/heroes/FcHeroArt";
import { Halftone, Slash, Tape } from "@/components/zine";

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
  ["01", "Assessment", "Every player joins through a player evaluation, and squads can be joined during the year."],
  ["02", "Squad Placement", "Players join an age group squad in the boys academy (U8–U18) or the girls academy (U8–U14)."],
  ["03", "Development", "Age and skill specific training, detailed Player Profile reports and constant communication with coaches."],
  ["04", "The Season", "A full academy year from January to November, playing for the Power FC crest."],
];

const AGES = ["U8", "", "U10", "", "U12", "", "U14", "", "U16", "", "U18"];

const STANDARDS = [
  ["Smart Soccer", "Possession soccer and the confidence to find their own solutions, with and without the ball."],
  ["Game Sense", "Quick decision making and speed of reaction, sharpened through lots of game play."],
  ["Player Profiles", "Detailed reports and constant communication with coaches show every player how to improve."],
];

function AgeBar({ upTo }: { upTo: number }) {
  return (
    <ul className="m-0 grid list-none grid-cols-11 gap-1 p-0">
      {AGES.map((label, i) => (
        <li
          key={i}
          className={`min-h-[1.6rem] text-center font-mono text-[0.72rem] font-bold before:mb-2 before:block before:h-3 before:content-[''] ${
            i <= upTo ? "text-ink before:bg-ink" : "text-ink/45 before:border before:border-ink/30"
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
    <>
      <main>
        <section className="relative overflow-hidden bg-paper">
          <div className="relative mx-auto h-[min(calc(100svh-76px),860px)] min-h-[560px] w-full max-w-[1440px] max-[860px]:h-auto max-[860px]:min-h-[min(calc(100svh-110px),780px)]">
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

            <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-[6%] pb-[9%] max-[860px]:px-5 max-[860px]:pt-[50vh] max-[860px]:pb-12">
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

        <section className="border-t border-ink bg-white">
          <Container className="grid grid-cols-4 max-[860px]:grid-cols-2">
            {STATS.map(([value, label], i) => (
              <Reveal
                key={value}
                delay={i * 100}
                className="border-ink px-5 py-9 not-first:border-l max-[860px]:[&:nth-child(3)]:border-l-0 max-[860px]:[&:nth-child(n+3)]:border-t"
              >
                <strong className="block font-display text-[clamp(1.5rem,3vw,2.3rem)] font-normal leading-none whitespace-nowrap">{value}</strong>
                <span className="mt-3 block font-mono text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink/70">{label}</span>
              </Reveal>
            ))}
          </Container>
        </section>

        <Section id="pathway">
          <Halftone from="top left" />
          <Container className="relative">
            <Reveal><Eyebrow index="01">The Pathway</Eyebrow></Reveal>
            <Reveal><H2>From Assessment<br />to the <Tape>Crest</Tape></H2></Reveal>
            <Reveal><Lead className="text-ink/75">Every Power FC player follows the same pathway, built around long-term development.</Lead></Reveal>
            <ol className="relative mt-14 grid list-none grid-cols-4 gap-0 border-t border-ink p-0 max-[860px]:grid-cols-2 max-[520px]:grid-cols-1">
              {PATHWAY.map(([num, title, text], i) => (
                <Reveal as="li" key={num} delay={i * 110} className="relative border-ink pt-8 pr-6 pb-2 not-first:pl-6 not-first:border-l max-[860px]:[&:nth-child(3)]:border-l-0 max-[860px]:[&:nth-child(3)]:pl-0 max-[520px]:border-l-0 max-[520px]:pl-0">
                  <span className="absolute -top-px left-0 h-1.5 w-12 bg-green not-first:left-6" />
                  <span className="mb-5 grid size-12 place-items-center bg-ink font-mono text-[0.9rem] font-bold text-white">{num}</span>
                  <h3 className="mb-2 text-xl uppercase">{title}</h3>
                  <p className="m-0 text-ink/70">{text}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>

        <Section tone="alt">
          <Container>
            <Reveal><Eyebrow index="02">Academy Squads</Eyebrow></Reveal>
            <Reveal><H2>Boys &amp; Girls<br />Academies</H2></Reveal>
            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              <Reveal as="article" className="relative border border-ink bg-paper p-8">
                <span className="absolute top-0 right-0 h-1.5 w-14 bg-green" />
                <h3 className="mb-1.5 text-2xl uppercase">Boys Academy</h3>
                <p className="mb-7 text-ink/70">Teams from U8 through U18.</p>
                <AgeBar upTo={10} />
              </Reveal>
              <Reveal as="article" delay={120} className="relative border border-ink bg-paper p-8">
                <span className="absolute top-0 right-0 h-1.5 w-14 bg-green" />
                <h3 className="mb-1.5 text-2xl uppercase">Girls Academy</h3>
                <p className="mb-7 text-ink/70">The Power FC Girls Academy currently runs from U8 through U14.</p>
                <AgeBar upTo={6} />
              </Reveal>
            </div>
          </Container>
        </Section>

        <Section tone="dark">
          <Halftone light from="bottom right" />
          <Slash seed={17} className="absolute -right-20 bottom-10 h-10 w-[440px] -rotate-6 opacity-95 max-sm:w-[260px]" />
          <Container className="relative">
            <Reveal><Eyebrow index="03" light>Our Standard</Eyebrow></Reveal>
            <Reveal>
              <blockquote className="mx-0 mt-2 mb-14 max-w-[900px] font-display text-[clamp(1.7rem,4vw,2.9rem)] uppercase leading-[1.08]">
                &ldquo;Proper player development is a long-term project which produces{" "}
                <span className="tape text-ink">incredible results.</span>&rdquo;
              </blockquote>
            </Reveal>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {STANDARDS.map(([title, text], i) => (
                <Reveal key={title} delay={i * 120}>
                  <Card title={title} index={`0${i + 1}`}>{text}</Card>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="text-center">
          <Halftone from="center" />
          <Container className="relative">
            <Reveal><Eyebrow index="04">Join</Eyebrow></Reveal>
            <Reveal className="relative mx-auto w-fit">
              <Slash seed={23} className="slash-in absolute top-[30%] -left-[8%] h-[46%] w-[116%] -rotate-2" />
              <H2 className="relative mb-6 text-[clamp(2.6rem,7vw,5rem)]">Wear the Crest</H2>
            </Reveal>
            <Reveal>
              <Lead className="mx-auto mb-9 text-ink/75">
                Players can join Power FC squads during the year after an assessment. Backed by Power Soccer, one of the most respected player development programs in Canada since 1996.
              </Lead>
            </Reveal>
            <Reveal className="flex flex-wrap justify-center gap-3">
              <Button href="/contact/">Book an Assessment</Button>
              <Button href="/about/" variant="outline">Our Story</Button>
            </Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
