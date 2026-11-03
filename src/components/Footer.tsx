import { CONTACT, MOTTO } from "@/lib/site";

export default function Footer({ premium = false }: { premium?: boolean }) {
  return (
    <footer
      className={`py-8 text-center text-[0.95rem] text-white/75 ${
        premium ? "border-t border-white/10 bg-night" : "border-t-[3px] border-green bg-ink"
      }`}
    >
      <div className="mx-auto max-w-[1100px] space-y-1 px-4 [&_a]:text-mint-soft">
        <p>
          {CONTACT.address} &middot; <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> &middot;{" "}
          <a href={CONTACT.emailHref}>{CONTACT.email}</a>
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-mint-soft">{MOTTO.join(" ")}</p>
        <p>&copy; {new Date().getFullYear()} Power Soccer Inc. &middot; Power FC. All rights reserved.</p>
      </div>
    </footer>
  );
}
