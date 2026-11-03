import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button, Container, Eyebrow, H2, Lead } from "@/components/ui";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Power FC",
  description: "Contact Power Soccer Inc. and Power FC about the academy, soccer schools, summer camps, or private training in Toronto.",
};

export default function ContactPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_100%_100%,rgba(66,226,2,0.32),transparent_60%),linear-gradient(135deg,var(--color-ink),var(--color-coal))] py-14 text-center text-white">
          <Container className="rise-in relative z-10">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mb-3 text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-[1.15]">Get in Touch</h1>
            <p className="mx-auto max-w-[680px] text-xl opacity-90">
              Questions about the academy, camps, or training? Send us a message and we&apos;ll get back to you.
            </p>
          </Container>
        </section>

        <section className="bg-mist py-16 max-sm:py-12">
          <Container className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-8">
            <Reveal as="aside">
              <H2 className="text-ink">Power Soccer Inc.</H2>
              <Lead className="mb-7 text-muted">Home of the Power FC Academy, developing players in Toronto since 1996.</Lead>
              <dl className="mb-8 [&_dd]:mt-1 [&_dd]:mb-5 [&_dd]:text-[1.05rem] [&_dt]:text-[0.8rem] [&_dt]:font-bold [&_dt]:uppercase [&_dt]:tracking-[0.12em] [&_dt]:text-ink">
                <dt>Office</dt>
                <dd>{CONTACT.addressLines[0]}<br />{CONTACT.addressLines[1]}</dd>
                <dt>Phone</dt>
                <dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd>
                <dt>Email</dt>
                <dd><a href={CONTACT.emailHref}>{CONTACT.email}</a></dd>
              </dl>
              <Button href="/locations/" variant="outline">View Our Locations</Button>
            </Reveal>
            <Reveal className="rounded-xl border-t-4 border-green bg-white p-9 shadow-[0_10px_40px_rgba(13,15,14,0.1)] max-sm:p-6">
              <ContactForm />
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
