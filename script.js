(() => {
  const root = document.documentElement;
  const header = document.getElementById("site-header");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header: solid background once the page scrolls
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");

  const setMenu = (open) => {
    header?.classList.toggle("nav-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuToggle?.addEventListener("click", () => {
    setMenu(!header?.classList.contains("nav-open"));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Highlight the nav link for the section in view
  const navLinks = new Map(
    [...(nav?.querySelectorAll('a[href^="#"]') ?? [])].map((link) => [link.getAttribute("href").slice(1), link])
  );

  if ("IntersectionObserver" in window && navLinks.size) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link, id) => link.classList.toggle("is-active", id === entry.target.id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    navLinks.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  // Reveal on scroll. The .js class is added here so content stays visible if this script never runs.
  if ("IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("js");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }

  // Cursor spotlight on cards
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-spotlight]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  }

  // Local time in Toronto
  const localTime = document.getElementById("local-time");
  if (localTime) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
    const tick = () => {
      localTime.textContent = `${formatter.format(new Date())} local time`;
    };
    tick();
    setInterval(tick, 30_000);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  document.getElementById("top-button")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Contact popup
  const contactModal = document.getElementById("contact-modal");
  const openContactButtons = document.querySelectorAll("[data-open-contact]");
  const closeContactButtons = document.querySelectorAll("[data-close-contact]");
  let contactReturnFocus = null;

  const openContactModal = () => {
    if (!contactModal) return;
    setMenu(false);
    contactReturnFocus = document.activeElement;
    contactModal.hidden = false;
    document.body.classList.add("contact-open");
    requestAnimationFrame(() => {
      document.getElementById("contact-name")?.focus();
    });
  };

  const closeContactModal = () => {
    if (!contactModal) return;
    contactModal.hidden = true;
    document.body.classList.remove("contact-open");
    contactReturnFocus?.focus?.();
  };

  openContactButtons.forEach((button) => {
    button.addEventListener("click", openContactModal);
  });

  closeContactButtons.forEach((button) => {
    button.addEventListener("click", closeContactModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (contactModal && !contactModal.hidden) {
      closeContactModal();
    } else if (header?.classList.contains("nav-open")) {
      setMenu(false);
      menuToggle?.focus();
    }
  });

  // Keep keyboard focus inside the open dialog
  contactModal?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...contactModal.querySelectorAll(".contact-dialog :is(a[href], button, input, textarea)")]
      .filter((el) => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Formspree contact form
  if (window.formspree) {
    window.formspree("initForm", {
      formElement: "#contact-form",
      formId: "xrpzlpvk",
    });
  }
})();
