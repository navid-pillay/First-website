import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button, Container, Eyebrow, H2, Lead } from "@/components/ui";
import { CropMarks, Halftone, Meta, Slash, Tape } from "@/components/zine";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Power FC",
  description: "Contact Power Soccer Inc. and Power FC about the academy, soccer schools, summer camps, or private training in Toronto.",
};

export default function ContactPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-paper">
          <Halftone from="top right" />
          <Slash seed={14} className="slash-in absolute top-[46%] -right-[5%] h-20 w-[44%] rotate-[7deg] max-sm:h-12 max-sm:w-[75%]" />
          <CropMarks />
          <Container className="rise-in relative z-10 py-16 max-sm:py-12">
            <Meta className="mb-10" lines={["Contact", "Power Soccer Inc.", "Toronto, ON"]} />
            <h1 className="m-0 text-[clamp(3rem,8.4vw,6.6rem)] uppercase leading-[0.88] tracking-[-0.02em]">
              Get in <Tape>Touch</Tape>
            </h1>
            <p className="mt-8 mb-0 max-w-[560px] text-[1.15rem] text-ink/80">
              Questions about the academy, camps, or training? Send us a message and we&apos;ll get back to you.
            </p>
          </Container>
        </section>

        <section className="border-t border-ink bg-white py-20 max-sm:py-14">
          <Container className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-10">
            <Reveal as="aside">
              <Eyebrow index="01">Office</Eyebrow>
              <H2>Power Soccer Inc.</H2>
              <Lead className="mb-8 text-ink/75">Home of the Power FC Academy, developing players in Toronto since 1996.</Lead>
              <dl className="mb-9 border-t border-ink [&_dd]:m-0 [&_dd]:pb-4 [&_dd]:text-[1.05rem] [&_dt]:pt-4 [&_dt]:font-mono [&_dt]:text-[0.75rem] [&_dt]:font-bold [&_dt]:uppercase [&_dt]:tracking-[0.16em] [&_dt]:text-ink/60 [&>dd]:border-b [&>dd]:border-ink">
                <dt>Office</dt>
                <dd>{CONTACT.addressLines[0]}<br />{CONTACT.addressLines[1]}</dd>
                <dt>Phone</dt>
                <dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd>
                <dt>Email</dt>
                <dd><a href={CONTACT.emailHref}>{CONTACT.email}</a></dd>
              </dl>
              <Button href="/locations/" variant="outline">View Our Locations</Button>
            </Reveal>
            <Reveal className="relative border border-ink bg-paper p-9 shadow-[10px_10px_0_var(--color-ink)] max-sm:p-6 max-sm:shadow-[6px_6px_0_var(--color-ink)]">
              <span aria-hidden="true" className="absolute top-0 right-0 h-2 w-20 bg-green" />
              <ContactForm />
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
