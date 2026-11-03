import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import ThreeVThree from "@/components/heroes/ThreeVThree";
import Reveal from "@/components/Reveal";
import { Button, Card, Container, Eyebrow, H2, Lead, Section } from "@/components/ui";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Power FC",
  description: "About Power Soccer Inc. and Power FC: a Toronto youth soccer academy since 1996, with boys teams U8 to U18 and girls teams U8 to U14.",
};

const PILLARS = [
  ["01", "Smart Soccer", "Coaches capture players playing smart soccer and give them the confidence to find their own solutions in the game. We stress possession soccer and encourage players to think about what they do with and without the ball. Coaches offer options and priorities of play, so players understand the fundamental principles of the game."],
  ["02", "‘All Ball’", "All training is done with the ball. Continuous contact with the ball leads to a remarkable improvement in every player's ability, builds confidence, and is a proven principle in advanced soccer nations. Players learn creative fakes and turns, shielding skills, ball tricks and moves to deal with pressure in the game."],
  ["03", "Game Sense", "Sessions promote quick decision making, speed of reaction and a sharper sense of the game. We build good soccer habits from an early age, combining skill exercises with lots of game play so players enjoy every session."],
];

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="size-9 flex-none fill-none stroke-mint-soft [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2]">
    {children}
  </svg>
);

const METHOD: [ReactNode, string][] = [
  [icon(<><circle cx="16" cy="16" r="12" /><path d="M11 19c1.5 2 3 3 5 3s3.5-1 5-3" /><path d="M12 13h.01M20 13h.01" strokeWidth="3" /></>), "Enthusiastic, well organized and qualified coaches"],
  [icon(<><rect x="7" y="5" width="18" height="23" rx="2" /><path d="M12 5V3h8v2M11 12h10M11 17h10M11 22h6" /></>), "Well planned sessions with a skill or tactical focus"],
  [icon(<><circle cx="16" cy="16" r="12" /><path d="M16 11l4.5 3.3-1.7 5.2h-5.6l-1.7-5.2z" /><path d="M16 11V4M20.5 14.3l6.6-2.1M18.8 19.5l4.1 5.7M13.2 19.5l-4.1 5.7M11.5 14.3l-6.6-2.1" /></>), "The ball is used throughout the session"],
  [icon(<path d="M12 22h8M13 26h6M16 4a8 8 0 0 0-4.5 14.6c.3.9.5 1.9.5 3.4h8c0-1.5.2-2.5.5-3.4A8 8 0 0 0 16 4z" />), "Coaches let players solve problems"],
  [icon(<><circle cx="16" cy="16" r="12" /><path d="M10.5 16.5l3.5 3.5 7.5-8" /></>), "Keep it simple, don't over-coach"],
  [icon(<path d="M16 27S5 20.5 5 12.5A5.5 5.5 0 0 1 16 10a5.5 5.5 0 0 1 11 2.5C27 20.5 16 27 16 27z" />), "Fitness is achieved through ball skills"],
  [icon(<><path d="M4 25l8-8 5 5 11-12" /><path d="M21 10h7v7" /></>), "Creative sessions that challenge players to reach their potential"],
  [icon(<path d="M5 7h22v14H14l-6 5v-5H5z" />), "Respect the player, parent, coach and official: fair play"],
  [icon(<><circle cx="16" cy="16" r="12" /><path d="M16 10v12M10 16h12" /></>), "Positive feedback from coaches creates a stimulating learning environment"],
];

export default function AboutPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-ink)_0%,var(--color-coal)_45%,var(--color-green)_100%)] py-14 text-center text-white">
          <ThreeVThree />
          <Container className="rise-in relative z-10">
            <Eyebrow>About Us</Eyebrow>
            <h1 className="mb-3 text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-[1.15]">About Power Soccer &amp; Power FC</h1>
            <p className="mx-auto max-w-[680px] text-xl opacity-90">A soccer coaching resource for Canadian players and coaches since 1996.</p>
          </Container>
        </section>

        <Section>
          <Container className="text-muted">
            <Reveal><H2 className="text-ink">Our Story</H2></Reveal>
            <Reveal>
              <Lead className="mb-4">
                Power Soccer was formed in 1996 to create a soccer coaching resource for the growing population of Canadian players and coaches. Since then, it has grown to become one of the most respected player development programs in Canada.
              </Lead>
            </Reveal>
            <Reveal>
              <Lead>
                That growth is a direct result of our exceptional coaching staff, who run dynamic and enjoyable training programs that are completely focused on player development. Today we offer year-round soccer schools, summer camps, team training, private training and more, all in Toronto and the GTA.
              </Lead>
            </Reveal>
          </Container>
        </Section>

        <Section tone="alt">
          <Container>
            <Reveal><H2 className="text-ink">What We Stand For</H2></Reveal>
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              <Reveal><Card title="We Emphasize">Skill, tactical development and the maximization of game enjoyment, through a training process that emphasizes fair play and respect.</Card></Reveal>
              <Reveal delay={120}><Card title="We Believe">In nurturing and developing the mental, physical and technical characteristics of the youth player, through a dynamic and creative soccer training model.</Card></Reveal>
              <Reveal delay={240}><Card title="We Encourage">Players to use their imagination and creativity while playing. Our innovative skills program gives every player the opportunity for total involvement.</Card></Reveal>
            </div>
          </Container>
        </Section>

        <Section tone="dark">
          <Container>
            <Reveal><H2>Our Mission</H2></Reveal>
            <Reveal>
              <blockquote className="mb-8 max-w-[820px] border-l-4 border-green-bright py-1 pl-6 text-[clamp(1.35rem,3vw,1.9rem)] font-semibold leading-snug">
                Players who are enjoying soccer and are comfortable to make mistakes without criticism will develop best.
              </blockquote>
            </Reveal>
            <Reveal>
              <Lead className="mb-4 text-white/75">
                At Power Soccer we focus on allowing players to express their individuality while giving them concise feedback on how they can improve their game. Players follow an age- and skill-specific program that fosters development and greater enjoyment of soccer.
              </Lead>
            </Reveal>
            <Reveal>
              <Lead className="text-white/75">
                Proper player development is a long-term project that produces incredible results. Players receive informative, positive feedback through detailed Player Profile reports and constant communication with their coaches.
              </Lead>
            </Reveal>
          </Container>
        </Section>

        <Section>
          <Container>
            <Reveal><H2 className="text-ink">How We Train</H2></Reveal>
            <Reveal><Lead className="text-muted">Three ideas shape every Power Soccer session.</Lead></Reveal>
            <div className="mt-10 border-t border-[#e1e6e3]">
              {PILLARS.map(([num, title, text]) => (
                <Reveal
                  as="article"
                  key={num}
                  className="grid grid-cols-[90px_minmax(0,260px)_minmax(0,1fr)] items-baseline gap-6 border-b border-[#e1e6e3] py-8 max-md:grid-cols-1 max-md:gap-2 max-md:py-6"
                >
                  <span className="text-[2.25rem] font-extrabold leading-none text-green-bright">{num}</span>
                  <h3 className="m-0 text-2xl font-bold text-ink">{title}</h3>
                  <p className="m-0 text-muted">{text}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        <Section tone="dark">
          <Container>
            <Reveal><H2>Coaching Methodology</H2></Reveal>
            <Reveal><Lead className="text-white/75">What you&apos;ll see at every Power Soccer session.</Lead></Reveal>
            <ul className="mt-8 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 p-0">
              {METHOD.map(([svg, text], i) => (
                <Reveal
                  as="li"
                  key={text}
                  delay={(i % 3) * 120}
                  className="flex items-center gap-4 rounded-[10px] border border-[#262b29] bg-coal p-5 font-medium text-white/90"
                >
                  {svg}
                  {text}
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="alt">
          <Container>
            <Reveal><H2 className="text-ink">The Power FC Academy</H2></Reveal>
            <Reveal>
              <Lead className="text-muted">Power FC is our academy team program, formed in 2005 to give players a competitive pathway and elite-level opportunities to advance their game.</Lead>
            </Reveal>
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              <Reveal><Card title="Boys Academy">Teams from U8 through U18.</Card></Reveal>
              <Reveal delay={120}><Card title="Girls Academy">Teams currently from U8 through U14.</Card></Reveal>
              <Reveal delay={240}><Card title="Academy Season">Runs January to November. Players can join squads during the year after an assessment.</Card></Reveal>
            </div>
          </Container>
        </Section>

        <Section tone="dark" className="text-center">
          <Container>
            <Reveal><H2>Contact Us</H2></Reveal>
            <Reveal>
              <ul className="mb-6 list-none space-y-1.5 p-0 text-lg [&_a]:text-mint-soft">
                <li>{CONTACT.address}</li>
                <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
                <li><a href={CONTACT.emailHref}>{CONTACT.email}</a></li>
              </ul>
            </Reveal>
            <Reveal><Button href="/contact/">Send Us a Message</Button></Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
