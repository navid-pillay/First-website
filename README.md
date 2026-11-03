# Power FC & Power Soccer website

Built in the standard demo format (the `start-demo` skill): **Next.js 16** (App Router, TypeScript), React 19, **Tailwind CSS v4**, **Lenis** smooth scrolling, GSAP, Framer Motion, Three.js, and clsx + tailwind-merge (the `cn()` helper in `lib/utils.ts`). The Locations map uses **MapLibre GL JS** with free OpenFreeMap data (no API key).

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install      # first time only
npm run dev      # then open http://localhost:3000
npm run lint     # check the code
```

The site reloads as you edit files.

## Build the finished site

```bash
npm run build
```

This writes a fully static site to `out/` that any static host can serve.

To publish under a sub-path such as GitHub Pages (`https://<user>.github.io/First-website/`), build with:

```bash
NEXT_PUBLIC_BASE_PATH=/First-website npm run build
```

## Where things are

| What | Where |
|---|---|
| Pages | `app/` (`page.tsx` is the intro; the others are in `app/(site)/`) |
| Header, footer, buttons, cards | `components/Header.tsx`, `Footer.tsx`, `ui.tsx` |
| Power FC camo background | `components/heroes/HalftoneCamo.tsx` |
| Program orbit (Power Soccer) | `components/Orbit.tsx` |
| Map and its locations | `components/LocationsMap.tsx`, `lib/locations.ts` |
| Contact details and motto | `lib/site.ts` |
| `cn()` class helper | `lib/utils.ts` |
| Colours, animations | `app/globals.css` |
| Logos | `assets/` |

## Notes

- In the built site, refreshing an inner page or arriving on one from outside the site shows the intro first. This is switched off during `npm run dev` so editing isn't interrupted.
- The contact form checks its fields but doesn't send anywhere yet.
