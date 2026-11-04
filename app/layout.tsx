import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

// Audiowide: the rounded, squared lettering of the Power FC crest, used for
// headings. It has a single weight (SIL Open Font License, fonts/Audiowide-OFL.txt).
const display = localFont({
  src: "./fonts/audiowide-latin-400.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  title: "Power Soccer & Power FC | Toronto",
  description: "Power Soccer Inc. training and soccer schools, and the Power FC high performance academy, in Toronto since 1996.",
};

export const viewport: Viewport = {
  themeColor: "#0d0f0e",
};

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const gateEnabled = process.env.NODE_ENV === "production";
// Set by scripts/publish.sh; the same value is written to out/version.txt.
const buildId = process.env.NEXT_PUBLIC_BUILD_ID || "";

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
})();
(function () {
  // Browsers may show a saved copy of the site for a few minutes after a new
  // version is published. Ask the server which version is live and, if this
  // page is older, load the new one (once, so it can never loop).
  var id = ${JSON.stringify(buildId)};
  if (!id || !window.fetch) return;
  var base = ${JSON.stringify(base)};
  fetch(base + "/version.txt?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { return r.ok ? r.text() : ""; })
    .then(function (live) {
      live = live.trim();
      if (!live || live === id) return;
      var key = "pfc-updated-" + live;
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) { return; }
      var url = new URL(location.href);
      url.searchParams.set("v", live);
      location.replace(url.toString());
    })
    .catch(function () {});
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={display.variable} suppressHydrationWarning>
      <body>
        <Script id="boot" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: bootScript }} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
