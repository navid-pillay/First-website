"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import psLogo from "@/assets/power-soccer-logo.png";
import FcCrest from "@/components/FcCrest";

const NAV = [
  { href: "/about/", label: "About" },
  { href: "/locations/", label: "Locations" },
  { href: "/contact/", label: "Contact Us", cta: true },
];

// The two brand logos switch between the Power Soccer and Power FC home
// pages; the one you're on is bright and the other is dimmed.
export default function Header() {
  const path = usePathname() || "/";
  const onPs = path.startsWith("/power-soccer");
  const onFc = path.startsWith("/power-fc");
  const dim = (current: boolean) => (onPs || onFc) && !current ? "opacity-55 hover:opacity-100" : "";

  return (
    <header
      className="sticky top-0 z-50 border-b border-ink bg-paper/92 text-ink backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-4 max-sm:justify-center max-sm:gap-y-1 max-sm:py-2">
        <div className="flex items-center gap-5 italic uppercase max-sm:gap-4">
          <Link href="/power-soccer/" aria-label="Power Soccer home" className={`flex min-h-11 items-center transition-opacity ${dim(onPs)}`}>
            <Image src={psLogo} alt="Power Soccer" priority className="h-12 w-auto max-sm:h-10" />
          </Link>
          <Link href="/power-fc/" aria-label="Power FC home" className={`flex min-h-11 items-center gap-2.5 text-ink no-underline transition-opacity ${dim(onFc)}`}>
            <FcCrest className="h-11 w-auto max-sm:h-[38px]" />
            <span className="flex flex-col gap-1">
              <span className="font-display text-[1.25rem] leading-none tracking-[0.02em] not-italic">
                Power <em className="tape not-italic">FC</em>
              </span>
              <span className="font-mono text-[0.68rem] font-semibold not-italic tracking-[0.14em] text-ink/70 max-md:hidden">
                High Performance Academy
              </span>
            </span>
          </Link>
        </div>
        <nav aria-label="Main">
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-1.5 p-0 max-sm:gap-x-4">
            {NAV.map((item) => {
              const current = path.startsWith(item.href.replace(/\/$/, ""));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={
                      item.cta
                        ? "inline-flex min-h-11 items-center border-2 border-ink bg-ink px-4 font-mono text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white no-underline transition-colors duration-200 hover:bg-green hover:text-ink aria-[current=page]:bg-green aria-[current=page]:text-ink"
                        : "relative inline-flex min-h-11 items-center font-mono text-[0.8rem] font-bold uppercase tracking-[0.12em] text-ink no-underline after:absolute after:inset-x-0 after:bottom-2 after:h-1 after:origin-left after:scale-x-0 after:bg-green after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
