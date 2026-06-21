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
    ".pricing-cta, .carousel, .areas-tags, .book-cta"
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

  // ---- Install carousel ----------------------------------------------
  // Native swipe is handled by CSS scroll-snap on the track. This adds
  // auto-advance, prev/next arrows, and clickable dots, and keeps the
  // active dot in sync when the user swipes manually. Pauses on hover,
  // focus, touch, and when the tab is hidden; auto-advance is disabled
  // under prefers-reduced-motion.
  const ROTATE_MS = 5500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initCarousel = (root) => {
    const track = root.querySelector("[data-carousel-track]");
    const slides = track ? Array.from(track.children) : [];
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    const capEl = root.querySelector("[data-carousel-cap]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Photo " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsWrap && dotsWrap.appendChild(dot);
      return dot;
    });

    const setActive = (i) => {
      index = i;
      dots.forEach((d, di) =>
        d.setAttribute("aria-current", di === i ? "true" : "false")
      );
      const img = slides[i] && slides[i].querySelector("img");
      if (capEl && img && img.dataset.cap) capEl.textContent = img.dataset.cap;
    };

    const goTo = (i) => {
      const n = slides.length;
      const target = ((i % n) + n) % n;
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
      setActive(target);
    };

    const start = () => {
      if (reduceMotion.matches || timer) return;
      timer = window.setInterval(() => goTo(index + 1), ROTATE_MS);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const restart = () => {
      stop();
      start();
    };

    nextBtn && nextBtn.addEventListener("click", () => { goTo(index + 1); restart(); });
    prevBtn && prevBtn.addEventListener("click", () => { goTo(index - 1); restart(); });

    // Keep the active dot in sync when the user scrolls/swipes by hand.
    let scrollDebounce = null;
    track.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(() => {
          const i = Math.round(track.scrollLeft / track.clientWidth);
          setActive(Math.max(0, Math.min(slides.length - 1, i)));
        }, 90);
      },
      { passive: true }
    );

    // Pause while the user is engaging; resume after.
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    track.addEventListener("pointerdown", stop, { passive: true });
    track.addEventListener("pointerup", restart, { passive: true });
    document.addEventListener("visibilitychange", () =>
      document.hidden ? stop() : start()
    );

    setActive(0);

    // Only rotate while the carousel is actually on screen, so a visitor
    // arrives at the first photo rather than mid-rotation.
    if ("IntersectionObserver" in window) {
      const vis = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0.4 }
      );
      vis.observe(root);
    } else {
      start();
    }
  };

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
})();
