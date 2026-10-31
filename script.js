document.getElementById("year").textContent = new Date().getFullYear();

// Highlight the nav link for the section in view. Every section is observed, including
// the intro and contact, so the highlight clears when none of the nav sections is in view.
const navLinks = document.querySelectorAll("#nav a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navLinks) link.classList.toggle("is-active", link.hash === `#${entry.target.id}`);
    }
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main > section[id]").forEach((section) => sectionObserver.observe(section));

// Contact dialog. showModal() traps focus, closes on Escape and restores focus on close.
const contactModal = document.getElementById("contact-modal");
document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", () => contactModal.showModal());
});
document.querySelector("[data-close-contact]").addEventListener("click", () => contactModal.close());

// Close on a backdrop click, but not when a text selection dragged out of the form ends on the backdrop
let pressedBackdrop = false;
contactModal.addEventListener("pointerdown", (event) => { pressedBackdrop = event.target === contactModal; });
contactModal.addEventListener("click", (event) => {
  if (pressedBackdrop && event.target === contactModal) contactModal.close();
});

// Formspree is missing if its CDN is blocked; the form then falls back to a plain POST.
// Its default styles are light-theme banners that override ours, so they're turned off.
window.formspree?.("initForm", {
  formElement: "#contact-form",
  formId: "xrpzlpvk",
  useDefaultStyles: false,
});
