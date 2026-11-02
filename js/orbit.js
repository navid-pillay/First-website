// Power Soccer programs on a slowly turning ring. Green lines link the
// programs and every few seconds reconnect into a different shape. The
// selected program's details show in the middle.
(function () {
  var orbit = document.querySelector("[data-orbit]");
  if (!orbit) return;

  var PROGRAMS = {
    fall: {
      when: "October – December",
      title: "Fall Soccer Schools",
      text: "Classes for ages 4 to 15, with adult clinics available.",
      where: ["Crescent School", "Toronto City Sports Centre", "Monarch Park", "Upper Canada College"]
    },
    winter: {
      when: "January – March Break",
      title: "Winter Soccer Schools",
      text: "Weekly classes through the winter, on different days at each location.",
      where: ["Toronto City Sports Centre (Wed/Thu/Sat)", "Monarch Park (Sun)", "Crescent School (Fri/Sat/Sun)", "Upper Canada College (Fri/Sat)"]
    },
    pa: {
      when: "PA days through the school year",
      title: "PA Day Camps",
      text: "Full day, morning and afternoon options, at different locations through the year.",
      where: ["Toronto City Sports Centre (East York)", "Central Tech Stadium (West Toronto)", "The Hangar at Downsview Park (North York)"]
    },
    summer: {
      when: "Summer",
      title: "Summer Camps",
      text: "Fun, high-energy camps where players learn creative moves, turns and ball skills all summer long.",
      where: []
    },
    "private": {
      when: "Year-round",
      title: "Private Training",
      text: "Focused, individual coaching tailored to each player's goals.",
      where: []
    },
    team: {
      when: "Year-round",
      title: "Team Training",
      text: "Sessions for whole teams, led by Power Soccer coaches and built around a skill or tactical focus.",
      where: []
    },
    adult: {
      when: "With the fall soccer schools",
      title: "Adult Clinics",
      text: "Clinics for adult players, available alongside the fall soccer schools.",
      where: []
    }
  };

  var svgNS = "http://www.w3.org/2000/svg";
  var svg = orbit.querySelector(".orbit-lines");
  var center = orbit.querySelector(".orbit-center");
  var nodes = Array.prototype.slice.call(orbit.querySelectorAll(".orbit-node"));
  var n = nodes.length;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Shapes the links cycle through: neighbours (a ring), then every second
  // and every third program (two different stars).
  var SHAPES = [1, 2, 3];
  var lines = [];
  SHAPES.forEach(function (step, shape) {
    for (var i = 0; i < n; i++) {
      var line = document.createElementNS(svgNS, "line");
      line.setAttribute("class", "orbit-link");
      svg.appendChild(line);
      lines.push({ el: line, a: i, b: (i + step) % n, shape: shape });
    }
  });

  var shape = 0;
  function showShape() {
    lines.forEach(function (l) { l.el.classList.toggle("is-on", l.shape === shape); });
  }

  var active = "fall";
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  function select(id) {
    var p = PROGRAMS[id];
    if (!p) return;
    active = id;
    nodes.forEach(function (b) {
      var on = b.getAttribute("data-id") === id;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var activeIndex = nodes.findIndex(function (b) { return b.getAttribute("data-id") === id; });
    lines.forEach(function (l) { l.el.classList.toggle("is-hot", l.a === activeIndex || l.b === activeIndex); });
    center.classList.remove("is-in");
    void center.offsetWidth;
    center.innerHTML =
      '<span class="orbit-when">' + escapeHtml(p.when) + '</span>' +
      '<h3>' + escapeHtml(p.title) + '</h3>' +
      '<p>' + escapeHtml(p.text) + '</p>' +
      (p.where.length ? '<p class="orbit-where">' + p.where.map(escapeHtml).join(' &middot; ') + '</p>' : '') +
      '<a class="btn" href="contact.html">Ask About This Program</a>';
    center.classList.add("is-in");
  }

  // Positions
  var size = 0, radius = 0;
  function measure() {
    size = orbit.clientWidth;
    var pad = window.innerWidth <= 640 ? 46 : 74;
    radius = size / 2 - pad;
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
  }

  var angle = -Math.PI / 2;
  function place() {
    var c = size / 2;
    var pts = nodes.map(function (node, i) {
      var a = angle + (i / n) * Math.PI * 2;
      var x = c + Math.cos(a) * radius;
      var y = c + Math.sin(a) * radius;
      node.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translate(-50%, -50%)";
      return [x, y];
    });
    lines.forEach(function (l) {
      l.el.setAttribute("x1", pts[l.a][0].toFixed(1));
      l.el.setAttribute("y1", pts[l.a][1].toFixed(1));
      l.el.setAttribute("x2", pts[l.b][0].toFixed(1));
      l.el.setAttribute("y2", pts[l.b][1].toFixed(1));
    });
  }

  // Interaction: choosing a program pauses the automatic tour for a while.
  var lastPick = 0;
  nodes.forEach(function (node) {
    node.addEventListener("click", function () {
      lastPick = performance.now();
      select(node.getAttribute("data-id"));
    });
    node.addEventListener("mouseenter", function () {
      lastPick = performance.now();
      select(node.getAttribute("data-id"));
    });
  });
  var hovering = false;
  orbit.addEventListener("mouseenter", function () { hovering = true; });
  orbit.addEventListener("mouseleave", function () { hovering = false; });

  measure();
  showShape();
  select(active);
  place();
  window.addEventListener("resize", function () { measure(); place(); });

  if (reduceMotion) return;

  // Animate only while the section is on screen.
  var visible = false;
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) { last = null; requestAnimationFrame(tick); }
  }).observe(orbit);

  var SPIN = (Math.PI * 2) / 120000;   // one turn every two minutes
  var SHAPE_EVERY = 7000, TOUR_EVERY = 6000, TOUR_PAUSE = 15000;
  var last = null, sinceShape = 0, sinceTour = 0;
  function tick(now) {
    if (!visible) return;
    if (last !== null) {
      var dt = Math.min(now - last, 100);
      if (!hovering) angle += SPIN * dt;
      sinceShape += dt;
      if (sinceShape > SHAPE_EVERY) {
        sinceShape = 0;
        shape = (shape + 1) % SHAPES.length;
        showShape();
      }
      sinceTour += dt;
      if (sinceTour > TOUR_EVERY && !hovering && now - lastPick > TOUR_PAUSE) {
        sinceTour = 0;
        var ids = Object.keys(PROGRAMS);
        select(ids[(ids.indexOf(active) + 1) % ids.length]);
      }
      place();
    }
    last = now;
    requestAnimationFrame(tick);
  }
})();
