/* Big Foot Water Heaters — interactive behaviors */

(() => {
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

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      mobileNav.hidden = !open;
    };
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!expanded);
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
  }

  // Booking form
  const form = document.getElementById("bookForm");
  const success = document.getElementById("bookSuccess");
  if (form && success) {
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener("blur", () => {
        const digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);
        if (digits.length === 10) {
          phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Wire up to a real handler (Formspree, Netlify Forms, your backend) here:
      // const data = Object.fromEntries(new FormData(form));
      // fetch("/api/lead", { method: "POST", body: JSON.stringify(data) })

      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Reveal-on-scroll for the moment-deck
  const revealTargets = document.querySelectorAll(
    ".moment-eyebrow, .moment-display, .moment-display-md, .moment-sub, .hero-h1, .hero-sub, .hero-ctas, .hero-mascot, .price-tile, .bar-verse, .bar-mascot, .bar-attrib, .areas-tags, .book-pitch, .book-form"
  );
  if ("IntersectionObserver" in window) {
    revealTargets.forEach((el, i) => {
      el.classList.add("reveal");
      // tiny stagger for elements within the same moment
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }
})();
