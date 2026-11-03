// MapLibre loads its rendering worker from a file next to its own code, which
// moves once Next.js bundles it. Copy the worker into public/ so the map can
// point at a fixed URL. Runs automatically before `dev` and `build`.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/maplibre", { recursive: true });
copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/maplibre/maplibre-gl-worker.mjs");
