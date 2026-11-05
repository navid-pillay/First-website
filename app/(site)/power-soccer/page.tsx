import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Orbit from "@/components/Orbit";
import Reveal from "@/components/Reveal";
import { Button, Container, Eyebrow, H2, Lead, Section } from "@/components/ui";
import { CropMarks, Halftone, Meta, Slash, Tape } from "@/components/zine";
import { NEIGHBOURHOODS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Power Soccer | Training & Soccer Schools in Toronto",
  description: "Power Soccer Inc.: year-round soccer schools, summer camps, team and private training across Toronto and the GTA since 1996.",
};

const STATS = [
  ["1996", "Coaching players in Toronto"],
  ["8", "Toronto neighbourhoods"],
  ["Year-round", "Soccer schools"],
  ["All ball", "Every drill uses the ball"],
];

const WAY = [
  ["01", "Smart Soccer", "Players gain the confidence to find their own solutions, with a focus on possession and thinking with and without the ball."],
  ["02", "‘All Ball’", "Every drill uses the ball. Constant contact builds skill, creative moves and confidence under pressure."],
  ["03", "Game Sense", "Quick decisions, fast reactions and good habits from an early age, with lots of game play for enjoyment."],
];

export default function PowerSoccerPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-paper">
          <Halftone from="top right" className="[background-size:9px_9px]" />
          <Slash seed={5} className="slash-in absolute top-[38%] -right-[8%] h-28 w-[62%] -rotate-[9deg] max-[860px]:top-[58%] max-[860px]:h-16 max-[860px]:w-[90%]" />
          <Slash seed={12} ragged={22} className="slash-in absolute top-[62%] right-[4%] h-6 w-[38%] rotate-[4deg] [animation-delay:0.45s] max-[860px]:hidden" />
          <CropMarks />
          <Container className="relative z-10 flex min-h-[min(calc(100vh-80px),720px)] flex-col py-10 max-[860px]:min-h-0">
            <div className="flex items-start justify-between gap-6">
              <Meta lines={["Power Soccer Inc.", "Est. 1996", "Toronto, ON"]} />
              <Meta className="text-right max-sm:hidden" lines={["Soccer schools", "Camps", "Team & private training"]} />
            </div>
            <div className="rise-in flex flex-1 flex-col justify-center py-12">
              <h1 className="m-0 max-w-[900px] text-[clamp(3rem,8.4vw,6.6rem)] uppercase leading-[0.88] tracking-[-0.02em]">
                Training &amp;
                <br />
                Soccer <Tape>Schools</Tape>
              </h1>
              <p className="mt-8 mb-9 max-w-[560px] text-[1.15rem] text-ink/80">
                Year-round soccer schools, summer camps, and team and private training for players of all ages across Toronto and the GTA.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="#programs">Explore Programs</Button>
                <Button href="/locations/" variant="outline">Find a Location</Button>
              </div>
            </div>
            <div className="border-t border-ink pt-4">
              <Meta lines={["Learn. Develop. Grow."]} />
            </div>
          </Container>
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

        <Section id="programs" className="text-center">
          <Halftone from="center" />
          <Container className="relative">
            <Reveal><Eyebrow index="01">Ways to Play</Eyebrow></Reveal>
            <Reveal><H2>Find Your <Tape>Program</Tape></H2></Reveal>
            <Reveal>
              <Lead className="mx-auto text-ink/75">
                From seasonal soccer schools to camps and private sessions, there&apos;s a way to play all year round. Select a
                program, or grab the ring and spin it.
              </Lead>
            </Reveal>
            <Orbit />
            <p className="m-0 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-ink/70 max-[640px]:mt-7">
              Ready for the next step?{" "}
              <Link href="/power-fc/" className="font-bold">Explore the Power FC Academy</Link>
            </p>
          </Container>
        </Section>

        <Section tone="dark">
          <Halftone light from="top left" />
          <Slash seed={29} className="absolute -right-24 top-12 h-12 w-[420px] rotate-[8deg] max-sm:w-[240px]" />
          <Container className="relative">
            <Reveal><Eyebrow index="02" light>Our Method</Eyebrow></Reveal>
            <Reveal><H2>The Power<br />Soccer Way</H2></Reveal>
            <Reveal>
              <Lead className="text-white/75">
                Every session is age and skill specific, completely focused on player development, and built on three ideas.
              </Lead>
            </Reveal>
            <div className="my-12 grid grid-cols-3 border-t border-white/40 max-[860px]:grid-cols-1">
              {WAY.map(([num, title, text], i) => (
                <Reveal key={num} delay={i * 120} className="border-white/40 pt-7 pr-6 pb-2 not-first:border-l not-first:pl-6 max-[860px]:not-first:border-l-0 max-[860px]:not-first:pl-0 max-[860px]:pb-6">
                  <span className="font-display text-[3rem] leading-none text-green">{num}</span>
                  <h3 className="mt-4 mb-2 text-[1.35rem] uppercase">{title}</h3>
                  <p className="m-0 text-white/70">{text}</p>
                </Reveal>
              ))}
            </div>
            <Reveal><Button href="/about/" variant="light">Our Coaching Approach</Button></Reveal>
          </Container>
        </Section>

        <Section tone="alt">
          <Container>
            <Reveal><Eyebrow index="03">Locations</Eyebrow></Reveal>
            <Reveal><H2>Where We Play</H2></Reveal>
            <Reveal>
              <Lead className="text-ink/75">Power Soccer programs run at sites across Toronto, close to home for families throughout the city.</Lead>
            </Reveal>
            <Reveal>
              <ul className="mt-8 mb-9 flex list-none flex-wrap gap-2 p-0">
                {NEIGHBOURHOODS.map((n) => (
                  <li key={n} className="border border-ink bg-paper px-3.5 py-2 font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-green">{n}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal><Button href="/locations/" variant="outline">View the Map</Button></Reveal>
          </Container>
        </Section>

        <Section className="text-center">
          <Halftone from="bottom center" />
          <Container className="relative">
            <Reveal><Eyebrow index="04">Join</Eyebrow></Reveal>
            <Reveal className="relative mx-auto w-fit">
              <Slash seed={33} className="slash-in absolute top-[30%] -left-[8%] h-[46%] w-[116%] -rotate-2" />
              <H2 className="relative mb-6 text-[clamp(2.6rem,7vw,5rem)]">Ready to Play?</H2>
            </Reveal>
            <Reveal>
              <Lead className="mx-auto mb-9 text-ink/75">Ask us about soccer schools, summer camps, or team and private training near you.</Lead>
            </Reveal>
            <Reveal><Button href="/contact/">Contact Us</Button></Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
