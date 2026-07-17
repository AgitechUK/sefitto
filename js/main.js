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

  // KVKK cookie consent banner + Google Consent Mode v2
  const banner = document.getElementById("cookie-banner");
  const gtagFn = window.gtag || function () {};
  const CONSENT_KEY = "sefitto-consent";

  function storeConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }
  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }

  function grant() {
    gtagFn("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    storeConsent("granted");
    hideBanner();
  }
  function deny() {
    gtagFn("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    storeConsent("denied");
    hideBanner();
  }

  const accept = document.getElementById("cookie-accept");
  const reject = document.getElementById("cookie-reject");
  const settings = document.getElementById("cookie-settings");
  if (accept) accept.addEventListener("click", grant);
  if (reject) reject.addEventListener("click", deny);
  if (settings) settings.addEventListener("click", (e) => { e.preventDefault(); showBanner(); });

  // Show banner only if no choice has been made yet
  if (!getConsent()) showBanner();
})();
