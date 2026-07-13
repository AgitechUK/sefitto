// ============ Şefitto — main.js ============
(function () {
  "use strict";

  // Sticky header shadow
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Animated heat meters — light peppers one by one when scrolled into view
  const heatObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const meter = e.target;
        const level = parseInt(meter.dataset.level, 10) || 0;
        const peppers = meter.querySelectorAll(".heat-peppers i");
        meter.classList.add("lit");
        peppers.forEach((pep, i) => {
          if (i < level) {
            pep.style.animationDelay = `${i * 0.18}s`;
            pep.classList.add("on");
          }
        });
        heatObserver.unobserve(meter);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".heat").forEach((el) => heatObserver.observe(el));
})();
