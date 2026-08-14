// Hero typewriter: types a greeting, backspaces it, then writes a code-style intro.
const typewriter = document.querySelector("[data-typewriter]");

if (typewriter) {
  const phrases = [
    "Hi, my name is",
    "const Shaun = (name, passion) =>",
  ];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    typewriter.textContent = phrases[1];
  } else {
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const TYPE_SPEED = 68;
    const DELETE_SPEED = 34;
    const HOLD_AFTER_TYPED = 1350;
    const HOLD_AFTER_DELETED = 260;

    const tick = () => {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        characterIndex += 1;
        typewriter.textContent = phrase.slice(0, characterIndex);

        if (characterIndex >= phrase.length) {
          deleting = true;
          window.setTimeout(tick, HOLD_AFTER_TYPED);
          return;
        }

        window.setTimeout(tick, TYPE_SPEED + Math.random() * 42);
        return;
      }

      characterIndex -= 1;
      typewriter.textContent = phrase.slice(0, characterIndex);

      if (characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, HOLD_AFTER_DELETED);
        return;
      }

      window.setTimeout(tick, DELETE_SPEED + Math.random() * 22);
    };

    // Keep the initial text visible very briefly before the first cycle starts.
    typewriter.textContent = "";
    window.setTimeout(tick, 450);
  }
}

const revealItems = document.querySelectorAll("[data-reveal]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelector("[data-top]")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Slight parallax on the HydraX art, disabled for reduced-motion users.
const projectArt = document.querySelector(".project-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (projectArt && !reduceMotion.matches) {
  projectArt.addEventListener("pointermove", (event) => {
    const rect = projectArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    projectArt.querySelector(".orb-one").style.transform =
      `translate(${x * 18}px, ${y * 18}px)`;
    projectArt.querySelector(".orb-two").style.transform =
      `translate(${x * -24}px, ${y * -24}px)`;
  });

  projectArt.addEventListener("pointerleave", () => {
    projectArt.querySelectorAll(".orb").forEach((orb) => {
      orb.style.transform = "translate(0, 0)";
    });
  });
}
