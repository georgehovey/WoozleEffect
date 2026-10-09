/* The Woozle Effect — two small behaviours, no dependencies, no network. */
(function () {
  "use strict";

  /* 1. Footnotes: shown by default (so the page works without JS),
        collapsed here into tap-to-reveal notes under their paragraph. */
  document.querySelectorAll(".fn-ref").forEach(function (btn) {
    var note = document.getElementById(btn.getAttribute("aria-controls"));
    if (!note) return;
    note.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      note.hidden = open;
    });
  });

  /* 2. Background: Milne's map before the film, the AI landscape after.
        Switches when the film's vertical centre crosses this line of the
        viewport (0.5 = the middle). Tune here. */
  var TRIGGER = 0.5;

  var sentinel = document.querySelector(".film-sentinel");
  if (!sentinel) return;
  function update() {
    var y = sentinel.getBoundingClientRect().top;
    document.body.classList.toggle("after-film", y < window.innerHeight * TRIGGER);
  }
  if ("IntersectionObserver" in window) {
    // The observed region runs from far above the page down to the trigger
    // line, so "past the film" is one region. Any crossing flips it, even a
    // jump straight to the endnotes, which a thin line-crossing test can miss.
    var bottom = -((1 - TRIGGER) * 100) + "%";
    new IntersectionObserver(update, { rootMargin: "100000px 0px " + bottom + " 0px" })
      .observe(sentinel);
  }
  // Belt and braces: the observer only reports on painted frames, so also
  // check on scroll. One measurement per event; cheap.
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("hashchange", update);
  update();
})();
