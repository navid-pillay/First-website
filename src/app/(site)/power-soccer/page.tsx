import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import TacticsBoard from "@/components/heroes/TacticsBoard";
import Orbit from "@/components/Orbit";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import { Button, Container, Eyebrow, H2, Lead, Section } from "@/components/ui";
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
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-ink)_0%,var(--color-coal)_45%,var(--color-green)_100%)] py-20 text-center text-white max-sm:py-14">
          <TacticsBoard />
          <Stars />
          <Container className="rise-in relative z-10">
            <Eyebrow>Power Soccer Inc. &middot; Toronto since 1996</Eyebrow>
            <h1 className="mb-3 text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-[1.15]">Training &amp; Soccer Schools</h1>
            <p className="mx-auto mb-8 max-w-[680px] text-xl opacity-90">
              Year-round soccer schools, summer camps, and team and private training for players of all ages across Toronto and the GTA.
            </p>
            <Button href="#programs" variant="light">Explore Programs</Button>
          </Container>
        </section>

        <Section tone="dark">
          <Container>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 text-center">
              {STATS.map(([value, label], i) => (
                <Reveal key={value} delay={i * 120}>
                  <strong className="block text-[2.2rem] leading-tight text-mint-soft">{value}</strong>
                  <span className="text-white/75">{label}</span>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        <section
          id="programs"
          className="relative overflow-hidden bg-[#0a0c0b] bg-[radial-gradient(ellipse_at_50%_60%,rgba(26,122,90,0.28),transparent_60%)] py-16 text-center text-white"
        >
          <Stars />
          <Container className="relative z-10">
            <Reveal><Eyebrow>Ways to Play</Eyebrow></Reveal>
            <Reveal><H2>Find Your Program</H2></Reveal>
            <Reveal>
              <Lead className="mx-auto text-white/70">
                From seasonal soccer schools to camps and private sessions, there&apos;s a way to play all year round. Select a
                program, or grab the ring and spin it.
              </Lead>
            </Reveal>
            <Orbit />
            <p className="m-0 text-white/65 max-[640px]:mt-7">
              Ready for the next step?{" "}
              <Link href="/power-fc/" className="font-semibold text-mint-soft">Explore the Power FC Academy</Link>
            </p>
          </Container>
        </section>

        <Section tone="dark">
          <Container>
            <Reveal><H2>The Power Soccer Way</H2></Reveal>
            <Reveal>
              <Lead className="text-white/75">
                Every session is age and skill specific, completely focused on player development, and built on three ideas.
              </Lead>
            </Reveal>
            <div className="my-10 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
              {WAY.map(([num, title, text], i) => (
                <Reveal key={num} delay={i * 120} className="border-t-2 border-green pt-5">
                  <span className="text-[2.25rem] font-extrabold leading-none text-green-bright">{num}</span>
                  <h3 className="mt-3 mb-2 text-[1.35rem] font-bold">{title}</h3>
                  <p className="m-0 text-white/70">{text}</p>
                </Reveal>
              ))}
            </div>
            <Reveal><Button href="/about/" variant="light">Our Coaching Approach</Button></Reveal>
          </Container>
        </Section>

        <Section tone="alt">
          <Container>
            <Reveal><H2 className="text-ink">Where We Play</H2></Reveal>
            <Reveal>
              <Lead className="text-muted">Power Soccer programs run at sites across Toronto, close to home for families throughout the city.</Lead>
            </Reveal>
            <Reveal>
              <ul className="mt-6 mb-8 flex list-none flex-wrap gap-2.5 p-0">
                {NEIGHBOURHOODS.map((n) => (
                  <li key={n} className="rounded-full bg-tint px-3.5 py-1.5 font-semibold text-green">{n}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal><Button href="/locations/" variant="outline">View the Map</Button></Reveal>
          </Container>
        </Section>

        <Section className="text-center">
          <Container>
            <Reveal><H2 className="text-ink">Ready to Play?</H2></Reveal>
            <Reveal>
              <Lead className="mx-auto mb-6 text-muted">Ask us about soccer schools, summer camps, or team and private training near you.</Lead>
            </Reveal>
            <Reveal><Button href="/contact/">Contact Us</Button></Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
