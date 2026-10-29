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

(function () {
  var mapEl = document.getElementById("map");
  var panel = document.getElementById("map-panel");
  if (!mapEl || !window.L) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var map = L.map(mapEl, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true
  });

  // Dark basemap: black background with grey streets.
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  var bounds = L.latLngBounds(LOCATIONS.map(function (loc) { return [loc.lat, loc.lng]; }));
  var markers = {};
  var activeId = null;

  function showAll(animate) {
    map.flyToBounds(bounds, { padding: [40, 40], duration: animate && !reduceMotion ? 1.2 : 0, animate: animate && !reduceMotion });
  }

  map.fitBounds(bounds, { padding: [40, 40] });

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
      '<h2>Where We Play</h2>' +
      '<p class="panel-hint">Select a pin or a location below.</p>' +
      '<ul class="loc-list">' + items + '</ul>';
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
      '<h2>' + escapeHtml(loc.name) + '</h2>' +
      (loc.venue ? '<p class="loc-venue">' + escapeHtml(loc.venue) + '</p>' : '') +
      details +
      '<a class="btn" href="' + mapsUrl(loc) + '" target="_blank" rel="noopener">Open in Google Maps</a>';

    panel.querySelector(".panel-back").focus({ preventScroll: true });
  }

  function setActive(id) {
    if (activeId && markers[activeId]) {
      markers[activeId].getElement().classList.remove("is-active");
    }
    activeId = id;
    if (id && markers[id]) {
      markers[id].getElement().classList.add("is-active");
    }
  }

  function select(id) {
    var loc = LOCATIONS.filter(function (l) { return l.id === id; })[0];
    if (!loc) return;
    setActive(id);
    map.flyTo([loc.lat, loc.lng], 15, { duration: reduceMotion ? 0 : 1.4, animate: !reduceMotion });
    renderDetail(loc);
    if (window.innerWidth <= 860) {
      panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }
  }

  function reset() {
    setActive(null);
    showAll(true);
    renderList();
  }

  LOCATIONS.forEach(function (loc) {
    var icon = L.divIcon({
      className: "pin" + (loc.type === "Head Office" ? " pin-hq" : ""),
      html: "<span></span>",
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    var marker = L.marker([loc.lat, loc.lng], { icon: icon, title: loc.name, alt: loc.name, riseOnHover: true })
      .addTo(map)
      .on("click", function () { select(loc.id); });
    marker.bindTooltip(loc.name, { direction: "top", offset: [0, -12], className: "pin-label" });
    markers[loc.id] = marker;
  });

  panel.addEventListener("click", function (e) {
    var item = e.target.closest(".loc-item");
    if (item) {
      select(item.getAttribute("data-id"));
      return;
    }
    if (e.target.closest(".panel-back")) {
      reset();
    }
  });

  renderList();
})();
