var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fade content in as it scrolls up from the bottom of the screen.
(function () {
  var targets = document.querySelectorAll(
    "main section:not(.hero) .container > h2," +
    "main section:not(.hero) .container > .lead," +
    "main section:not(.hero) .container > .btn," +
    "main section:not(.hero) .container > .fc-actions," +
    "main section:not(.hero) .container > .eyebrow," +
    "main section:not(.hero) .container > .contact-list," +
    "main section:not(.hero) .container > .tags," +
    "main section:not(.hero) .container > blockquote," +
    ".card, .stat, .pillar, .way-item, .method li, .contact-info, .contact-card," +
    ".fc-stat, .path-step, .squad, .fc-quote, .standard-card"
  );

  // Stagger items that sit side by side (cards, stats).
  targets.forEach(function (el) {
    el.classList.add("reveal");
    if (el.matches(".card, .stat, .way-item, .method li, .fc-stat, .path-step, .squad, .standard-card")) {
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      var step = el.closest(".method, .cards-3") ? index % 3 : index;
      el.style.transitionDelay = step * 120 + "ms";
    }
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -18% 0px", threshold: 0.1 });

  targets.forEach(function (el) { observer.observe(el); });
})();

// Load-in: text types itself and box outlines draw themselves, quickly,
// as each part of the page comes into view (the intro page doesn't use this).
(function () {
  var root = document.documentElement;
  var TEXT = "main h1, main h2, main h3, main p, main blockquote, main .eyebrow, main .btn," +
    "main .stat strong, main .stat span, main .fc-stat strong, main .fc-stat span," +
    "main .pillar-num, main .path-num, main .method li, main .tags li, main .contact-list li," +
    "main dt, main dd, main label";
  var BOXES = "main .card, main .squad, main .standard-card, main .method li, main .contact-card";

  var boxes = Array.prototype.slice.call(document.querySelectorAll(BOXES));
  boxes.forEach(function (box) { box.classList.add("box-draw"); });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    boxes.forEach(function (box) { box.classList.add("is-drawn"); });
    root.classList.remove("pre-type");
    return;
  }

  // Only the outermost matching element types, so nothing types twice.
  var texts = Array.prototype.slice.call(document.querySelectorAll(TEXT)).filter(function (el) {
    return !el.parentElement.closest(TEXT) && el.textContent.trim() !== "";
  });

  // Split each text node into a typed part and a hidden remainder, so the
  // layout keeps its final size while the letters appear.
  texts.forEach(function (el) {
    var parts = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.data.trim() === "") continue;
      parts.push(node);
    }
    el._typeParts = parts.map(function (textNode) {
      var ghost = document.createElement("span");
      ghost.className = "type-ghost";
      ghost.textContent = textNode.data;
      textNode.parentNode.insertBefore(ghost, textNode.nextSibling);
      var full = textNode.data;
      textNode.data = "";
      return { node: textNode, ghost: ghost, full: full };
    });
  });
  root.classList.remove("pre-type");

  function type(el) {
    var parts = el._typeParts;
    if (!parts) return;
    el._typeParts = null;
    var total = parts.reduce(function (n, p) { return n + p.full.length; }, 0);
    var duration = Math.min(650, Math.max(180, total * 9));
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var shown = Math.min(total, Math.ceil((now - start) / duration * total));
      var left = shown;
      parts.forEach(function (p) {
        var k = Math.max(0, Math.min(p.full.length, left));
        left -= p.full.length;
        p.node.data = p.full.slice(0, k);
        p.ghost.textContent = p.full.slice(k);
      });
      if (shown < total) {
        requestAnimationFrame(frame);
      } else {
        parts.forEach(function (p) { p.node.data = p.full; p.ghost.remove(); });
      }
    }
    requestAnimationFrame(frame);
  }

  var observer = new IntersectionObserver(function (entries) {
    var batch = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      var delay = Math.min(batch++ * 60, 400);
      setTimeout(function () {
        if (el.classList.contains("box-draw")) el.classList.add("is-drawn");
        type(el);
      }, delay);
    });
  }, { rootMargin: "0px 0px -18% 0px", threshold: 0.1 });

  texts.concat(boxes).forEach(function (el) { observer.observe(el); });
})();
