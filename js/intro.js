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
})();
