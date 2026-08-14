(() => {
document.getElementById("top-button")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Contact popup
  const contactModal = document.getElementById("contact-modal");
  const openContact = document.getElementById("open-contact");
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

  openContact?.addEventListener("click", openContactModal);
  closeContactButtons.forEach((button) => {
    button.addEventListener("click", closeContactModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && contactModal && !contactModal.hidden) {
      closeContactModal();
    }
  });

  // Formspree contact form
  if (window.formspree) {
    window.formspree('initForm', {
      formElement: '#contact-form',
      formId: 'xrpzlpvk'
    });
  }

})();
