/* Big Foot Water Heaters — interactive behaviors */

(() => {
  // Refresh always lands at the top, even if a previous in-page click
  // (Book / Pricing / etc.) left a #fragment in the URL. Without this
  // the browser re-jumps to that section on every reload, which reads
  // as the page being broken — the user's complaint was "refreshing
  // takes me down to the booking form". Cleared via replaceState so the
  // back button isn't polluted.
  if (window.location.hash) {
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
    ".bar-verse, .price-row, .areas-tags, .book-cta"
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
