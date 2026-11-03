---
name: start-demo
description: Scaffold a new blank Next.js demo/website starter in Ginola's standard format. Use whenever starting a new demo, client website, or homepage build ("start a demo", "create a next.js project like my other sites", "new site like OQ", "spin up a blank site"). Produces the same stack every time - Next.js 16 (App Router + TypeScript), Tailwind CSS v4, Lenis smooth scroll, GSAP, Framer Motion, Three.js, and clsx + tailwind-merge (cn helper).
---

# Start Demo — standard Next.js starter

Scaffolds a **blank** Next.js project matching the house stack used across Ginola's sites (OQ, etc.). It installs everything and leaves a clean starter. It does **not** add brand content, pages, or components beyond the blank scaffold — building the actual site is a separate step the user requests afterwards.

## The standard stack (do not change without being asked)

- **Next.js 16** (App Router) + **TypeScript**, React 19
- **Tailwind CSS v4** (via `@tailwindcss/postcss`, `@import "tailwindcss"` in `app/globals.css`)
- **Lenis** — smooth scroll (instantiate per page/component with `new Lenis(...)`; there is no global provider by convention)
- **GSAP** — scroll/timeline animation
- **Framer Motion** — component motion
- **Three.js** (+ `@types/three`) — 3D / WebGL
- **clsx** + **tailwind-merge** — the `cn()` helper lives in `lib/utils.ts`
- ESLint (`eslint-config-next`), path alias `@/*`

## How to run it

The project folder convention is a `site/` subdirectory inside the client/project folder (mirrors `oq/site`). From the project root:

```bash
bash ~/.claude/skills/start-demo/scaffold.sh site
# or, from a checkout of this repo when the user-level copy isn't installed:
# bash .claude/skills/start-demo/scaffold.sh site
```

Pass a different target path as the first argument if needed. The script refuses to overwrite a non-empty directory.

The script copies `template/`, restores `.gitignore`, and runs `npm install` (a pinned `package-lock.json` ships in the template for deterministic, fast installs).

## After scaffolding

Start the dev server and confirm it boots, then hand back to the user:

```bash
cd site && npm run dev
```

Opens on http://localhost:3000. The blank page renders a centered `DEMO` label so you can confirm Tailwind + rendering work.

## What's in the template

```
package.json          # the pinned stack above
package-lock.json     # deterministic install
tsconfig.json         # strict, @/* alias
next.config.ts
postcss.config.mjs    # @tailwindcss/postcss
eslint.config.mjs
gitignore             # renamed to .gitignore by the script
AGENTS.md / CLAUDE.md # "this is NOT the Next.js you know" — read node_modules/next/dist/docs before coding
README.md
app/layout.tsx        # minimal root layout, generic metadata
app/page.tsx          # blank centered "DEMO" placeholder
app/globals.css       # Tailwind v4 import + minimal light/dark tokens + font vars
lib/utils.ts          # cn() = twMerge(clsx(...))
```

## Notes

- Keep the scaffold **blank**. Do not pre-add brand colors, fonts, logos, or sections unless the user asks to start building.
- To bump the stack, edit `template/package.json` (and regenerate `template/package-lock.json`) so future demos inherit the change.
- Node 20+ / npm 9+ recommended (developed on Node 26 / npm 11).
