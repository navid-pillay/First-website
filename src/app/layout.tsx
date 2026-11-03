import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power Soccer & Power FC | Toronto",
  description: "Power Soccer Inc. training and soccer schools, and the Power FC high performance academy, in Toronto since 1996.",
};

export const viewport: Viewport = {
  themeColor: "#0d0f0e",
};

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const gateEnabled = process.env.NODE_ENV === "production";

// Runs before the page shows. Marks that JavaScript is on, and (in the built
// site) sends visitors to the intro when they refresh an inner page or arrive
// on one from outside the site, so the intro is always the first thing seen.
const bootScript = `(function () {
  document.documentElement.classList.add("js");
  if (!${gateEnabled}) return;
  var base = ${JSON.stringify(base)};
  var path = location.pathname.slice(base.length) || "/";
  if (path === "/" || path === "/index.html") return;
  var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  var type = nav ? nav.type : "navigate";
  var fromSite = false;
  try { fromSite = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  if (type === "reload" || (type === "navigate" && !fromSite)) location.replace(base + "/");
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="boot" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: bootScript }} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
