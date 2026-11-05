"use client";

import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOCATIONS, MAP_STYLE, type Location } from "@/lib/locations";
import { CONTACT } from "@/lib/site";

function mapsUrl(loc: Location) {
  const query = loc.address ? (loc.venue ? `${loc.venue}, ` : "") + loc.address : `${loc.name}, Toronto, ON`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Full-screen dark map of Toronto with a green pin for each location. Choosing
// a pin (or a name in the panel) zooms in and shows the address with a Google
// Maps link; "All locations" zooms back out.
export default function LocationsMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const panelEl = useRef<HTMLElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef<Record<string, HTMLButtonElement>>({});
  const [selected, setSelected] = useState<Location | null>(null);

  const padding = useCallback(() => {
    const panel = panelEl.current;
    if (window.innerWidth <= 760) return { top: 40, bottom: (panel?.offsetHeight ?? 0) + 40, left: 40, right: 40 };
    return { top: 60, bottom: 60, left: 60, right: (panel?.offsetWidth ?? 0) + 80 };
  }, []);

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const select = useCallback(
    (loc: Location) => {
      Object.values(markers.current).forEach((el) => el.classList.remove("is-active"));
      markers.current[loc.id]?.classList.add("is-active");
      setSelected(loc);
      const map = mapRef.current;
      if (!map) return;
      const options = { center: [loc.lng, loc.lat] as [number, number], zoom: 15, padding: padding() };
      if (reduceMotion()) map.jumpTo(options);
      else map.flyTo({ ...options, duration: 1400, essential: true });
    },
    [padding],
  );

  const showAll = useCallback(() => {
    Object.values(markers.current).forEach((el) => el.classList.remove("is-active"));
    setSelected(null);
    const map = mapRef.current;
    if (!map) return;
    import("maplibre-gl").then(({ LngLatBounds }) => {
      const bounds = new LngLatBounds();
      LOCATIONS.forEach((l) => bounds.extend([l.lng, l.lat]));
      map.fitBounds(bounds, { padding: padding(), duration: reduceMotion() ? 0 : 1200 });
    });
  }, [padding]);

  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;

    import("maplibre-gl").then((maplibregl) => {
      if (cancelled || !mapEl.current) return;
      maplibregl.setWorkerUrl(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/maplibre/maplibre-gl-worker.mjs`);
      const bounds = new maplibregl.LngLatBounds();
      LOCATIONS.forEach((l) => bounds.extend([l.lng, l.lat]));

      map = new maplibregl.Map({
        container: mapEl.current,
        style: MAP_STYLE,
        bounds,
        fitBoundsOptions: { padding: padding() },
        maxZoom: 18,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });
      mapRef.current = map;
      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution:
            '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        }),
        "bottom-left",
      );

      LOCATIONS.forEach((loc) => {
        const el = document.createElement("button");
        el.type = "button";
        // MapLibre positions each pin absolutely; the pin styles must not set position.
        el.className = `pin size-[22px] cursor-pointer border-0 bg-transparent p-0 outline-none${loc.type === "Head Office" ? " pin-hq" : ""}`;
        el.setAttribute("aria-label", loc.name);
        const dot = document.createElement("span");
        const label = document.createElement("em");
        label.className = "pin-label";
        label.textContent = loc.name;
        el.append(dot, label);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          select(loc);
        });
        new maplibregl.Marker({ element: el }).setLngLat([loc.lng, loc.lat]).addTo(map!);
        markers.current[loc.id] = el;
      });
    });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markers.current = {};
    };
  }, [padding, select]);

  return (
    <main data-map-page className="relative min-h-[420px] flex-1 bg-ink">
      {/* data-lenis-prevent: let the map handle the scroll wheel (zoom) */}
      {/* MapLibre makes its container position: relative, so the wrapper does the sizing */}
      <div className="absolute inset-0">
        <div ref={mapEl} data-lenis-prevent className="h-full w-full bg-ink" role="region" aria-label="Map of Power Soccer locations in Toronto" />
      </div>

      <aside
        ref={panelEl}
        aria-live="polite"
        data-lenis-prevent
        className="absolute top-5 right-5 bottom-5 z-[2] w-[360px] overflow-y-auto border border-ink bg-paper p-7 text-ink shadow-[8px_8px_0_var(--color-green)] max-[760px]:top-auto max-[760px]:right-3 max-[760px]:bottom-3 max-[760px]:left-3 max-[760px]:max-h-[46%] max-[760px]:w-auto max-[760px]:p-5"
      >
        {selected ? (
          <>
            <button
              type="button"
              onClick={showAll}
              className="mb-5 block cursor-pointer border-0 bg-transparent p-0 font-mono text-[0.78rem] font-bold uppercase tracking-[0.12em] text-ink/70 hover:text-ink"
            >
              &larr; All locations
            </button>
            <span className="tape mb-3 inline-block font-mono text-[0.75rem] font-bold uppercase tracking-[0.16em] text-ink">{selected.type}</span>
            <h1 className="mb-2 text-[1.8rem] uppercase leading-none max-[760px]:text-[1.4rem]">{selected.name}</h1>
            {selected.venue && <p className="mb-1 text-[1.1rem] font-semibold text-ink">{selected.venue}</p>}
            {selected.address ? (
              <p className="mb-6 font-mono text-[0.85rem] uppercase tracking-[0.04em] text-ink/75">{selected.address}</p>
            ) : (
              <p className="mb-6 text-ink/75">
                Venue details coming soon. Contact us at <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> or{" "}
                <a href={CONTACT.emailHref}>{CONTACT.email}</a> for the exact location.
              </p>
            )}
            <a
              href={mapsUrl(selected)}
              target="_blank"
              rel="noopener"
              className="btn inline-flex min-h-12 items-center border-2 border-ink bg-ink px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-green hover:text-ink"
            >
              Open in Google Maps
            </a>
          </>
        ) : (
          <>
            <span className="mb-3 inline-flex items-center gap-2 font-mono text-[0.75rem] font-bold uppercase tracking-[0.16em] text-ink/75"><span aria-hidden="true" className="size-2 bg-green" />
              {LOCATIONS.length} Locations
            </span>
            <h1 className="mb-2 text-[1.8rem] uppercase leading-none max-[760px]:text-[1.4rem]">Where We Play</h1>
            <p className="mb-5 text-ink/70">Select a pin or a location below.</p>
            <ul className="m-0 list-none p-0">
              {LOCATIONS.map((loc) => (
                <li key={loc.id}>
                  <button
                    type="button"
                    onClick={() => select(loc)}
                    className="flex w-full cursor-pointer items-center gap-3.5 border-0 border-b border-ink/25 bg-transparent px-2 py-3 text-left text-ink transition-colors hover:bg-green focus-visible:bg-green focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-3 flex-none rounded-full ${
                        loc.type === "Head Office" ? "border-2 border-ink bg-white" : "border-2 border-ink bg-green"
                      }`}
                    />
                    <span>
                      <strong className="block font-semibold">{loc.name}</strong>
                      <small className="block font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink/60">{loc.venue || loc.type}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.9rem] text-ink/70">
              Questions? Call <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> or email <a href={CONTACT.emailHref}>{CONTACT.email}</a>.
            </p>
          </>
        )}
      </aside>
    </main>
  );
}
