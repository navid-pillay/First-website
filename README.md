# Power FC & Power Soccer website

Built with **Next.js** (App Router, TypeScript), **Tailwind CSS v4** and **Lenis** smooth scrolling. The Locations map uses **MapLibre GL JS** with free OpenFreeMap data (no API key).

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install      # first time only
npm run dev      # then open http://localhost:3000
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
| Pages | `src/app/` (`page.tsx` is the intro; the others are in `src/app/(site)/`) |
| Header, footer, buttons, cards | `src/components/Header.tsx`, `Footer.tsx`, `ui.tsx` |
| Hero background animations | `src/components/heroes/` |
| Program orbit (Power Soccer) | `src/components/Orbit.tsx` |
| Map and its locations | `src/components/LocationsMap.tsx`, `src/data/locations.ts` |
| Contact details and motto | `src/lib/site.ts` |
| Colours, animations | `src/app/globals.css` |
| Logos | `src/assets/` |

## Notes

- In the built site, refreshing an inner page or arriving on one from outside the site shows the intro first. This is switched off during `npm run dev` so editing isn't interrupted.
- The contact form checks its fields but doesn't send anywhere yet.
