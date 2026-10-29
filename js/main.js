var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fade content in as it scrolls up from the bottom of the screen.
(function () {
  var targets = document.querySelectorAll(
    "main section:not(.hero) .container > h2," +
    "main section:not(.hero) .container > .lead," +
    "main section:not(.hero) .container > .btn," +
    "main section:not(.hero) .container > .contact-list," +
    "main section:not(.hero) .container > .tags," +
    ".card, .stat"
  );

  // Stagger items that sit side by side (cards, stats).
  targets.forEach(function (el) {
    el.classList.add("reveal");
    if (el.classList.contains("card") || el.classList.contains("stat")) {
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = index * 120 + "ms";
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
