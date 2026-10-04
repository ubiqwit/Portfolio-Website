(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Contact popup
  const contactModal = document.getElementById("contact-modal");
  const openContactButtons = document.querySelectorAll("[data-open-contact]");
  const closeContactButtons = document.querySelectorAll("[data-close-contact]");
  let contactReturnFocus = null;

  const openContactModal = () => {
    if (!contactModal) return;
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
    if (event.key === "Escape" && contactModal && !contactModal.hidden) {
      closeContactModal();
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
