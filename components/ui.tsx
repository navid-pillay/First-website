import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Small building blocks shared by every page.

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1100px] px-4 ${className}`}>{children}</div>;
}

const TONES = {
  white: "bg-white",
  alt: "bg-mist",
  dark: "bg-ink text-white",
} as const;

export function Section({
  tone = "white",
  className = "",
  children,
  ...rest
}: { tone?: keyof typeof TONES; className?: string; children: ReactNode } & ComponentProps<"section">) {
  return (
    <section className={`py-16 max-sm:py-12 ${TONES[tone]} ${className}`} {...rest}>
      {children}
    </section>
  );
}

export function Eyebrow({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`mb-3 inline-block text-[0.85rem] font-bold uppercase tracking-[0.15em] text-mint-soft ${className}`}>
      {children}
    </span>
  );
}

export function H2({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h2 className={`mb-4 text-[2rem] font-bold leading-tight ${className}`}>{children}</h2>;
}

export function Lead({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`max-w-[720px] text-[1.1rem] ${className}`}>{children}</p>;
}

const BUTTONS = {
  primary: "border-green bg-green text-white hover:border-green-bright hover:bg-green-bright",
  light: "border-white bg-white text-ink hover:border-tint hover:bg-tint",
  outline: "border-green bg-transparent text-green hover:bg-green hover:text-white",
  silver: "border border-white/45 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink",
} as const;

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof BUTTONS;
  className?: string;
  children: ReactNode;
}) {
  const cls = `inline-block rounded-md border-2 px-6 py-3 font-bold no-underline transition-colors ${BUTTONS[variant]} ${className}`;
  const external = href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");
  return external ? (
    <a href={href} className={cls}>{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}

export function Card({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[10px] border-t-4 border-green bg-white p-7 shadow-[0_2px_12px_rgba(13,15,14,0.08)] ${className}`}>
      <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
      <p className="m-0 text-muted">{children}</p>
    </div>
  );
}
