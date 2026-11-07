import Image from "next/image";
import psLogo from "@/assets/power-soccer-logo.png";
import FcCrest from "@/components/FcCrest";

// The draft's navigation bar: sticky, no border, just the two badges on the
// left and three links on the right. The draft has no inner pages yet, so the
// links stay on this page (they don't lead back to the old site), and the
// badges take you to the top. It comes in with the hero's ruled lines.
const NAV = [
  { href: "#about", label: "About" },
  { href: "#locations", label: "Locations" },
  { href: "#contact", label: "Contact" },
];

export default function DraftNav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/92 text-ink opacity-0 backdrop-blur-md [animation:fade-in_0.8s_ease-out_0.2s_forwards] motion-reduce:opacity-100">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-[6%] py-3.5 max-sm:flex-col max-sm:gap-1 max-sm:px-4 max-sm:py-2">
        <a href="#" aria-label="Power Soccer and Power FC, back to top" className="flex min-h-11 items-center gap-5 no-underline max-sm:gap-4">
          <Image src={psLogo} alt="" priority className="h-12 w-auto max-sm:h-10" />
          <FcCrest className="h-12 w-auto max-sm:h-10" />
        </a>
        <nav aria-label="Main">
          <ul className="m-0 flex list-none items-center gap-x-7 p-0 max-sm:gap-x-5">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="relative inline-flex min-h-11 items-center font-mono text-[0.8rem] font-bold uppercase tracking-[0.12em] text-ink no-underline after:absolute after:inset-x-0 after:bottom-2 after:h-1 after:origin-left after:scale-x-0 after:bg-green after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
