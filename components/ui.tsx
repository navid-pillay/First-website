import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Tag } from "@/components/zine";

// Small building blocks shared by every page, in the poster style: paper
// sections, black "subject" blocks, square black buttons and ruled cards.

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1100px] px-4 ${className}`}>{children}</div>;
}

const TONES = {
  white: "bg-paper text-ink",
  alt: "bg-white text-ink",
  dark: "bg-ink text-white",
} as const;

export function Section({
  tone = "white",
  className = "",
  children,
  ...rest
}: { tone?: keyof typeof TONES; className?: string; children: ReactNode } & ComponentProps<"section">) {
  return (
    <section className={`relative overflow-hidden border-t border-ink py-20 max-sm:py-14 ${TONES[tone]} ${className}`} {...rest}>
      {children}
    </section>
  );
}

/** Section label, e.g. [01] THE PATHWAY. Pass light on black sections. */
export function Eyebrow({ index, light = false, className = "", children }: { index?: string; light?: boolean; className?: string; children: ReactNode }) {
  return (
    <Tag index={index} light={light} className={className}>
      {children}
    </Tag>
  );
}

export function H2({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h2 className={`mb-5 text-[clamp(2rem,4.6vw,3.2rem)] uppercase leading-[1.02] tracking-[-0.01em] ${className}`}>{children}</h2>;
}

export function Lead({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`max-w-[680px] text-[1.1rem] ${className}`}>{children}</p>;
}

const BUTTONS = {
  primary: "border-ink bg-ink text-white hover:border-ink hover:bg-green hover:text-ink",
  light: "border-white bg-white text-ink hover:border-green hover:bg-green",
  outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  silver: "border-white bg-transparent text-white hover:bg-white hover:text-ink",
  green: "border-ink bg-green text-ink hover:bg-ink hover:text-white",
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
  const cls = `group inline-flex min-h-12 items-center gap-3 border-2 px-6 py-3 font-mono text-[0.85rem] font-bold uppercase tracking-[0.12em] no-underline transition-colors duration-200 ${BUTTONS[variant]} ${className}`;
  const inner = (
    <>
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
    </>
  );
  const external = href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");
  return external ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

export function Card({ title, index, children, className = "" }: { title: string; index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`relative h-full border border-ink bg-white p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] ${className}`}>
      {index && <span className="mb-4 block font-mono text-[0.75rem] font-bold tracking-[0.16em] text-ink/60">{index}</span>}
      <h3 className="mb-3 text-xl uppercase text-ink">{title}</h3>
      <p className="m-0 text-ink/75">{children}</p>
      <span aria-hidden="true" className="absolute top-0 right-0 h-1.5 w-14 bg-green" />
    </div>
  );
}
