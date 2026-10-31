// Intro page: fade out before going to the chosen program's home page.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".pendant").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (reduceMotion || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(function () { window.location.href = link.href; }, 500);
    });
  });

  // Coming back with the browser's Back button restores the page as it was
  // left, so undo the fade-out.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.remove("is-leaving");
  });

  // Twinkling green stars, scattered at random.
  var stars = document.querySelector(".stars");
  if (stars) {
    var count = window.innerWidth < 600 ? 18 : 32;
    for (var i = 0; i < count; i++) {
      var star = document.createElement("span");
      star.className = "star" + (i % 8 === 0 ? " cross" : "");
      var dur = 3.5 + Math.random() * 4.5;
      star.style.cssText =
        "left:" + (Math.random() * 100).toFixed(2) + "%;" +
        "top:" + (Math.random() * 100).toFixed(2) + "%;" +
        "--size:" + (1.5 + Math.random() * 2).toFixed(1) + "px;" +
        "--dur:" + dur.toFixed(1) + "s;" +
        "--delay:" + (-Math.random() * dur).toFixed(1) + "s;" +
        "--peak:" + (0.45 + Math.random() * 0.5).toFixed(2);
      stars.appendChild(star);
    }
  }

  // The flutes glow where the cursor (or a finger) passes over them.
  var bg = document.querySelector(".intro-bg");
  if (bg) {
    var x = 0, y = 0, queued = false;
    var place = function () {
      queued = false;
      bg.style.setProperty("--mx", x + "px");
      bg.style.setProperty("--my", y + "px");
    };
    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY;
      bg.classList.add("is-lit");
      if (!queued) { queued = true; requestAnimationFrame(place); }
    });
    document.documentElement.addEventListener("pointerleave", function () { bg.classList.remove("is-lit"); });
    window.addEventListener("blur", function () { bg.classList.remove("is-lit"); });
  }
})();
