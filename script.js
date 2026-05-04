/* Big Foot Water Heaters — interactive behaviors */

(() => {
  // On page RELOAD only, scroll back to the top and clear any in-page
  // hash that a previous click left in the URL — so refreshing doesn't
  // re-jump to (say) the booking section that the user clicked through
  // five minutes ago. We only do this on a true reload; external deep
  // links like /#pricing keep their hash so a Google result can land
  // the user on the right section.
  const isReload =
    (performance.getEntriesByType?.("navigation")[0]?.type === "reload") ||
    // Fallback for older browsers (deprecated but still around).
    (performance.navigation && performance.navigation.type === 1);

  if (isReload && window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Reveal-on-scroll — one accent element per moment, not a blanket
  // fade-up on every text node. Hero choreography stays special.
  const revealTargets = document.querySelectorAll(
    ".moment:not(.moment--hero) .moment-display, " +
    ".moment:not(.moment--hero) .moment-display-md, " +
    ".price-row, .areas-tags, .book-cta"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }
})();
