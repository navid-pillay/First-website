// Power Soccer locations. To update a location, edit its entry here.
// "address" is left empty where the exact venue hasn't been confirmed;
// the Google Maps link then searches the neighbourhood instead.
var LOCATIONS = [
  {
    id: "head-office",
    name: "Head Office",
    type: "Head Office",
    venue: "Power Soccer Inc.",
    address: "201 Wicksteed Ave, Suite 8, Toronto, ON M4G 0B1",
    lat: 43.7098,
    lng: -79.3585
  },
  {
    id: "east-york",
    name: "East York",
    type: "Program Location",
    venue: "Toronto City Sports Centre",
    address: "32 Curity Ave, Toronto, ON M4B 0A2",
    lat: 43.7065,
    lng: -79.3100
  },
  {
    id: "leaside",
    name: "Leaside",
    type: "Program Location",
    venue: "",
    address: "2365 Bayview Ave, Toronto, ON",
    lat: 43.7360,
    lng: -79.3830
  },
  {
    id: "forest-hill",
    name: "Forest Hill",
    type: "Program Location",
    venue: "Upper Canada College",
    address: "200 Lonsdale Rd, Toronto, ON",
    lat: 43.6905,
    lng: -79.4040
  },
  {
    id: "danforth",
    name: "The Danforth",
    type: "Program Location",
    venue: "Felstead Park",
    address: "60 Felstead Ave, Toronto, ON",
    lat: 43.6832,
    lng: -79.3255
  },
  {
    id: "north-toronto",
    name: "North Toronto",
    type: "Program Location",
    venue: "",
    address: "",
    lat: 43.7066,
    lng: -79.3984
  },
  {
    id: "lawrence-park",
    name: "Lawrence Park",
    type: "Program Location",
    venue: "",
    address: "",
    lat: 43.7225,
    lng: -79.3955
  },
  {
    id: "york-mills",
    name: "York Mills",
    type: "Program Location",
    venue: "",
    address: "",
    lat: 43.7445,
    lng: -79.4060
  },
  {
    id: "bloor-west",
    name: "Bloor West",
    type: "Program Location",
    venue: "",
    address: "",
    lat: 43.6505,
    lng: -79.4840
  }
];


// Clean dark map style built on OpenFreeMap's free vector tiles
// (no API key, commercial use allowed). Only streets, water, parks and
// neighbourhood names are drawn: no buildings, house numbers or shops.
var MAP_STYLE = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    openmaptiles: { type: "vector", url: "https://tiles.openfreemap.org/planet" }
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#0d0f0e" } },
    {
      id: "park", type: "fill", source: "openmaptiles", "source-layer": "park",
      paint: { "fill-color": "#111614" }
    },
    {
      id: "water", type: "fill", source: "openmaptiles", "source-layer": "water",
      paint: { "fill-color": "#1a2220" }
    },
    {
      id: "waterway", type: "line", source: "openmaptiles", "source-layer": "waterway",
      minzoom: 12,
      paint: { "line-color": "#1a2220", "line-width": 1.2 }
    },
    {
      id: "rail", type: "line", source: "openmaptiles", "source-layer": "transportation",
      minzoom: 12,
      filter: ["==", ["get", "class"], "rail"],
      paint: { "line-color": "#262b29", "line-width": 1, "line-dasharray": [3, 3] }
    },
    {
      id: "road-minor", type: "line", source: "openmaptiles", "source-layer": "transportation",
      minzoom: 12.5,
      filter: ["in", ["get", "class"], ["literal", ["minor", "tertiary"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#2b302e",
        "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 12.5, 0.4, 16, 3, 18, 8]
      }
    },
    {
      id: "road-secondary", type: "line", source: "openmaptiles", "source-layer": "transportation",
      minzoom: 10,
      filter: ["==", ["get", "class"], "secondary"],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#3a403d",
        "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 10, 0.5, 16, 4, 18, 10]
      }
    },
    {
      id: "road-primary", type: "line", source: "openmaptiles", "source-layer": "transportation",
      minzoom: 8,
      filter: ["in", ["get", "class"], ["literal", ["primary", "trunk"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#4a504d",
        "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 8, 0.6, 16, 5, 18, 12]
      }
    },
    {
      id: "road-motorway", type: "line", source: "openmaptiles", "source-layer": "transportation",
      minzoom: 6,
      filter: ["==", ["get", "class"], "motorway"],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#5a615e",
        "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 6, 0.8, 16, 6, 18, 14]
      }
    },
    {
      id: "road-label", type: "symbol", source: "openmaptiles", "source-layer": "transportation_name",
      minzoom: 13,
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary"]]],
      layout: {
        "symbol-placement": "line",
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 17, 13]
      },
      paint: { "text-color": "#7d8582", "text-halo-color": "#0d0f0e", "text-halo-width": 1.5 }
    },
    {
      id: "place-label", type: "symbol", source: "openmaptiles", "source-layer": "place",
      minzoom: 10.5,
      maxzoom: 15,
      filter: ["in", ["get", "class"], ["literal", ["suburb", "neighbourhood", "quarter"]]],
      layout: {
        "text-field": ["upcase", ["coalesce", ["get", "name:en"], ["get", "name"]]],
        "text-font": ["Noto Sans Bold"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 11, 10, 14, 12],
        "text-letter-spacing": 0.12,
        "text-max-width": 8
      },
      paint: { "text-color": "#5d6562", "text-halo-color": "#0d0f0e", "text-halo-width": 1.5 }
    }
  ]
};

(function () {
  var mapEl = document.getElementById("map");
  var panel = document.getElementById("map-panel");
  if (!mapEl || !window.maplibregl) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var markers = {};
  var activeId = null;

  var bounds = new maplibregl.LngLatBounds();
  LOCATIONS.forEach(function (loc) { bounds.extend([loc.lng, loc.lat]); });

  // Keep pins clear of the side panel (desktop) or bottom sheet (phone).
  function viewPadding() {
    if (window.innerWidth <= 760) {
      return { top: 40, bottom: panel.offsetHeight + 40, left: 40, right: 40 };
    }
    return { top: 60, bottom: 60, left: 60, right: panel.offsetWidth + 80 };
  }

  renderList();

  var map = new maplibregl.Map({
    container: mapEl,
    style: MAP_STYLE,
    bounds: bounds,
    fitBoundsOptions: { padding: viewPadding() },
    maxZoom: 18,
    attributionControl: false,
    dragRotate: false,
    pitchWithRotate: false
  });
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
  map.addControl(new maplibregl.AttributionControl({
    compact: true,
    customAttribution: '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }), "bottom-left");

  function move(options) {
    if (reduceMotion) {
      map.jumpTo(options);
    } else {
      map.flyTo(Object.assign({ duration: 1400, essential: true }, options));
    }
  }

  function showAll() {
    map.fitBounds(bounds, { padding: viewPadding(), duration: reduceMotion ? 0 : 1200 });
  }

  function mapsUrl(loc) {
    var query = loc.address
      ? (loc.venue ? loc.venue + ", " : "") + loc.address
      : loc.name + ", Toronto, ON";
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function renderList() {
    var items = LOCATIONS.map(function (loc) {
      return '<li><button type="button" class="loc-item" data-id="' + loc.id + '">' +
        '<span class="loc-dot' + (loc.type === "Head Office" ? " loc-dot-hq" : "") + '" aria-hidden="true"></span>' +
        '<span><strong>' + escapeHtml(loc.name) + '</strong>' +
        '<small>' + escapeHtml(loc.venue || loc.type) + '</small></span>' +
        '</button></li>';
    }).join("");

    panel.innerHTML =
      '<span class="eyebrow">' + LOCATIONS.length + ' Locations</span>' +
      '<h1>Where We Play</h1>' +
      '<p class="panel-hint">Select a pin or a location below.</p>' +
      '<ul class="loc-list">' + items + '</ul>' +
      '<p class="panel-note">Questions? Call <a href="tel:+14164256062">416.425.6062</a> or email <a href="mailto:info@powersoccer.ca">info@powersoccer.ca</a>.</p>';
  }

  function renderDetail(loc) {
    var details = loc.address
      ? '<p class="loc-address">' + escapeHtml(loc.address) + '</p>'
      : '<p class="loc-address">Venue details coming soon. Contact us at ' +
        '<a href="tel:+14164256062">416.425.6062</a> or ' +
        '<a href="mailto:info@powersoccer.ca">info@powersoccer.ca</a> for the exact location.</p>';

    panel.innerHTML =
      '<button type="button" class="panel-back">&larr; All locations</button>' +
      '<span class="eyebrow">' + escapeHtml(loc.type) + '</span>' +
      '<h1>' + escapeHtml(loc.name) + '</h1>' +
      (loc.venue ? '<p class="loc-venue">' + escapeHtml(loc.venue) + '</p>' : '') +
      details +
      '<a class="btn" href="' + mapsUrl(loc) + '" target="_blank" rel="noopener">Open in Google Maps</a>';

    panel.scrollTop = 0;
    panel.querySelector(".panel-back").focus({ preventScroll: true });
  }

  function setActive(id) {
    if (activeId && markers[activeId]) markers[activeId].classList.remove("is-active");
    activeId = id;
    if (id && markers[id]) markers[id].classList.add("is-active");
  }

  function select(id) {
    var loc = LOCATIONS.filter(function (l) { return l.id === id; })[0];
    if (!loc) return;
    setActive(id);
    renderDetail(loc);
    move({ center: [loc.lng, loc.lat], zoom: 15, padding: viewPadding() });
  }

  function reset() {
    setActive(null);
    renderList();
    showAll();
  }

  LOCATIONS.forEach(function (loc) {
    var el = document.createElement("button");
    el.type = "button";
    el.className = "pin" + (loc.type === "Head Office" ? " pin-hq" : "");
    el.setAttribute("aria-label", loc.name);
    el.innerHTML = '<span></span><em class="pin-label">' + escapeHtml(loc.name) + '</em>';
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      select(loc.id);
    });
    new maplibregl.Marker({ element: el }).setLngLat([loc.lng, loc.lat]).addTo(map);
    markers[loc.id] = el;
  });

  panel.addEventListener("click", function (e) {
    var item = e.target.closest(".loc-item");
    if (item) {
      select(item.getAttribute("data-id"));
      return;
    }
    if (e.target.closest(".panel-back")) reset();
  });
})();
