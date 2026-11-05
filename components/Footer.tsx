import { Slash } from "@/components/zine";
import { CONTACT, MOTTO } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink bg-ink py-10 text-white">
      <Slash seed={41} className="absolute -right-24 -bottom-6 h-14 w-[460px] -rotate-6 opacity-90" />
      <div className="relative mx-auto grid max-w-[1100px] grid-cols-[1fr_auto] items-end gap-6 px-4 max-md:grid-cols-1">
        <div className="space-y-1 font-mono text-[0.8rem] uppercase tracking-[0.12em] text-white/75 [&_a]:text-white [&_a]:decoration-green">
          <p className="m-0">{CONTACT.address}</p>
          <p className="m-0">
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> &middot; <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          </p>
          <p className="m-0 pt-3 text-white/55">&copy; {new Date().getFullYear()} Power Soccer Inc. &middot; Power FC</p>
        </div>
        <p className="m-0 font-display text-[clamp(1.4rem,3vw,2rem)] uppercase leading-none">
          {MOTTO.map((w, i) => (
            <span key={w} className={i === 2 ? "text-green" : ""}>{w} </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
