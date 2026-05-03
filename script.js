/* Big Foot Water Heaters — interactive behaviors */

(() => {
  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        mobileNav.hidden = false;
      } else {
        mobileNav.hidden = true;
      }
    };
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!expanded);
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
  }

  // FAQ — close siblings when one opens (single-open accordion)
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Booking form
  const form = document.getElementById("bookForm");
  const success = document.getElementById("bookSuccess");
  if (form && success) {
    // Light phone-number formatting on blur — US 10 digit
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
      // In production: POST to your backend / Formspree / Netlify Forms
      // const data = Object.fromEntries(new FormData(form));
      // fetch("/api/lead", { method: "POST", body: JSON.stringify(data) })

      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Reveal-on-scroll for sections that opt in (we add the class via JS so SSR-less pages still look right with JS off)
  const revealTargets = document.querySelectorAll(
    ".section-head, .service-card, .price-card, .how-step, .diff-item, .hero-card, .about-copy, .about-photo, .faq-item, .book-form"
  );
  if ("IntersectionObserver" in window) {
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }
})();
