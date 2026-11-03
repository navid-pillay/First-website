"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fcCrest from "@/assets/power-fc-crest.png";
import psLogo from "@/assets/power-soccer-logo.png";

const NAV = [
  { href: "/about/", label: "About" },
  { href: "/locations/", label: "Locations" },
  { href: "/contact/", label: "Contact" },
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
      className={`bg-ink text-white ${
        onFc
          ? "border-b border-transparent [border-image:linear-gradient(90deg,transparent,#9aa19d_30%,#e9ecea_50%,#9aa19d_70%,transparent)_1]"
          : "border-b-[3px] border-green"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-4 max-sm:justify-center">
        <div className="flex items-center gap-2.5 italic uppercase">
          <Link href="/power-soccer/" aria-label="Power Soccer home" className={`flex items-center transition-opacity ${dim(onPs)}`}>
            <Image src={psLogo} alt="Power Soccer" priority className="h-12 w-auto max-sm:h-10" />
          </Link>
          <span aria-hidden="true" className="mx-1.5 h-[34px] w-px bg-white/20" />
          <Link href="/power-fc/" aria-label="Power FC home" className={`flex items-center gap-2.5 text-white no-underline transition-opacity ${dim(onFc)}`}>
            <Image src={fcCrest} alt="" priority className="h-11 w-auto max-sm:h-[38px]" />
            <span className="flex flex-col gap-1">
              <span className="font-display text-[1.25rem] leading-none tracking-[0.02em] not-italic">
                Power <em className="text-mint not-italic">FC</em>
              </span>
              <span className="text-[0.55rem] font-semibold not-italic tracking-[0.16em] text-white/60 max-md:hidden">
                High Performance Academy
              </span>
            </span>
          </Link>
        </div>
        <nav aria-label="Main">
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-1.5 p-0">
            {NAV.map((item) => {
              const current = path.startsWith(item.href.replace(/\/$/, ""));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className="border-b-2 border-transparent pb-0.5 font-semibold text-white no-underline hover:border-green-bright aria-[current=page]:border-green-bright"
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
