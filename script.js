/* ============================================================
   Ivan Ong Portfolio — script.js
   Vanilla JS only. No frameworks, no build tools.
   ============================================================ */

/* ---------- Bootstrap Lucide icons ---------- */
if (window.lucide) lucide.createIcons();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById("nav-toggle");
const navLinks  = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("is-open");
});

// Close mobile nav when any nav link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

/* ---------- Nav scroll-spy (set up inside GSAP block — requires ScrollTrigger) ---------- */
const navAnchors   = document.querySelectorAll("[data-nav]");
const sections     = document.querySelectorAll("section[id]");
const sectionNavMap = {
  top: "about", metrics: "about", about: "about",
  skills: "skills", work: "work", projects: "projects", contact: "contact",
};
function setActiveNavLink(id) {
  navAnchors.forEach(a => a.classList.toggle("is-active", a.dataset.nav === sectionNavMap[id]));
}


/* ---------- Case study modals ---------- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
  // Re-create icons inside the freshly shown modal
  if (window.lucide) lucide.createIcons();
  // Focus the close button for accessibility
  const closeBtn = modal.querySelector("[data-modal-close]");
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

// Open modal on case card click
document.querySelectorAll(".io-case[data-modal]").forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.modal));
  // Keyboard accessibility
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card.dataset.modal);
    }
  });
});

// Close modal on close button click
document.querySelectorAll("[data-modal-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".io-modal");
    if (modal) closeModal(modal);
  });
});

// Close modal on backdrop (overlay) click
document.querySelectorAll(".io-modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal(modal);
  });
});

// Close modal on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".io-modal.is-open").forEach(closeModal);
  }
});

/* ---------- Nav scroll state ---------- */
const topNav = document.getElementById("top-nav");
if (topNav) {
  const onScroll = () => topNav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   GSAP + ScrollTrigger animations
   ============================================================ */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // ── Smooth scroll ───────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ScrollSmoother.create({
    wrapper:     "#smooth-wrapper",
    content:     "#smooth-content",
    smooth:      prefersReducedMotion ? 1 : 1.5,
    smoothTouch: 0.1,
    effects:     true,
  });

  // ── Nav scroll-spy (ScrollTrigger — compatible with ScrollSmoother) ──
  sections.forEach(section => {
    ScrollTrigger.create({
      trigger:     section,
      start:       "top 45%",
      end:         "bottom 45%",
      onEnter:     () => setActiveNavLink(section.id),
      onEnterBack: () => setActiveNavLink(section.id),
    });
  });

  // Reverse scroll-triggered animations when scrolling back up
  ScrollTrigger.defaults({ toggleActions: "play none none reverse" });

  // ── Hero entrance — plays on load, no scroll required ──────
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".io-hero__eyebrow",  { opacity: 0, y: 14, duration: 0.6 })
    .from(".io-hero__title",    { opacity: 0, y: 32, duration: 0.85 }, "-=0.4")
    .from(".io-hero__sub",      { opacity: 0, y: 20, duration: 0.65 }, "-=0.45")
    .from(".io-hero__ctas > *", { opacity: 0, y: 14, duration: 0.5, stagger: 0.09 }, "-=0.4")
    .from(".io-hero__meta",     { opacity: 0, duration: 0.5 },          "-=0.3")
    .from(".io-hero__visual",   { opacity: 0, x: 32, duration: 0.9 },   "-=0.75");

  // ── Hero glow — subtle parallax as you scroll away ─────────
  gsap.to(".io-hero__glow", {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: ".io-hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // ── Hero visual — floats up slightly on scroll ─────────────
  gsap.to(".io-hero__visual", {
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: ".io-hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.8,
    },
  });

  // ── Value strip ────────────────────────────────────────────
  gsap.from(".io-value-item", {
    opacity: 0,
    y: 26,
    duration: 0.65,
    stagger: 0.13,
    ease: "power2.out",
    scrollTrigger: { trigger: ".io-value-strip", start: "top 87%" },
  });

  // ── Metrics: section head ──────────────────────────────────
  gsap.from("#metrics .io-section__head", {
    opacity: 0, y: 22, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: "#metrics .io-section__head", start: "top 88%" },
  });

  // ── Metrics: cards stagger ─────────────────────────────────
  gsap.from(".io-metric", {
    opacity: 0,
    y: 32,
    duration: 0.55,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: { trigger: ".io-metrics-grid", start: "top 83%" },
  });

  // ── Metrics: count-up ─────────────────────────────────────
  document.querySelectorAll(".io-metric[data-metric-value]").forEach(card => {
    const target = parseInt(card.dataset.metricValue, 10);
    const numEl  = card.querySelector(".io-metric__num");
    if (!numEl) return;
    const counter = { val: 0 };
    gsap.to(counter, {
      val: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => { numEl.textContent = Math.round(counter.val).toLocaleString(); },
      scrollTrigger: { trigger: card, start: "top 87%" },
    });
  });

  // ── About ──────────────────────────────────────────────────
  gsap.from("#about .io-section__head", {
    opacity: 0, y: 22, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: "#about .io-section__head", start: "top 88%" },
  });
  gsap.from(".io-about__photo", {
    opacity: 0, y: 36, duration: 0.75, ease: "power2.out",
    scrollTrigger: { trigger: ".io-about", start: "top 83%" },
  });
  gsap.from(".io-about__copy p", {
    opacity: 0, y: 20, duration: 0.55, stagger: 0.12, ease: "power2.out",
    scrollTrigger: { trigger: ".io-about__copy", start: "top 83%" },
  });

  // ── Skills ─────────────────────────────────────────────────
  gsap.from("#skills .io-section__head", {
    opacity: 0, y: 22, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: "#skills .io-section__head", start: "top 88%" },
  });
  gsap.from(".io-skill", {
    opacity: 0, y: 20, duration: 0.45, stagger: 0.07, ease: "power2.out",
    scrollTrigger: { trigger: ".io-skills--triple", start: "top 83%" },
  });
  gsap.from(".io-skills__pills .io-pill", {
    opacity: 0, scale: 0.88, duration: 0.4, stagger: 0.06, ease: "back.out(1.6)",
    scrollTrigger: { trigger: ".io-skills__pills", start: "top 86%" },
  });

  // ── Case studies ───────────────────────────────────────────
  gsap.from("#work .io-section__head", {
    opacity: 0, y: 22, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: "#work .io-section__head", start: "top 88%" },
  });
  gsap.from(".io-case", {
    opacity: 0, y: 38, duration: 0.65, stagger: 0.14, ease: "power2.out",
    scrollTrigger: { trigger: ".io-cases", start: "top 83%" },
  });

  // ── Projects ───────────────────────────────────────────────
  gsap.from("#projects .io-section__head", {
    opacity: 0, y: 22, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: "#projects .io-section__head", start: "top 88%" },
  });
  gsap.from(".io-project", {
    opacity: 0, y: 28, duration: 0.5, stagger: 0.1, ease: "power2.out",
    scrollTrigger: { trigger: ".io-projects", start: "top 83%" },
  });

  // ── Contact ────────────────────────────────────────────────
  gsap.from("#contact .io-section__head", {
    opacity: 0, y: 22, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: "#contact .io-section__head", start: "top 88%" },
  });
  gsap.from(".io-contact-meta", {
    opacity: 0, y: 22, duration: 0.55, ease: "power2.out",
    scrollTrigger: { trigger: ".io-contact-meta", start: "top 88%" },
  });
  gsap.from(".io-form", {
    opacity: 0, x: -28, duration: 0.7, ease: "power2.out",
    scrollTrigger: { trigger: ".io-contact", start: "top 83%" },
  });
  gsap.from(".io-contact__rail", {
    opacity: 0, x: 28, duration: 0.7, ease: "power2.out",
    scrollTrigger: { trigger: ".io-contact", start: "top 83%" },
  });
}

/* ---------- Contact form (mailto fallback) ---------- */
const form     = document.getElementById("contact-form");
const submitBtn = document.getElementById("cf-submit");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email   = form.querySelector("#cf-email").value;
    const company = form.querySelector("#cf-company").value;
    const message = form.querySelector("#cf-message").value;

    const subject = encodeURIComponent(`Portfolio enquiry — ${company || "from website"}`);
    const body    = encodeURIComponent(
      `From: ${email}\nCompany / role: ${company}\n\n${message}`
    );

    submitBtn.textContent = "Opening email…";
    submitBtn.disabled    = true;

    setTimeout(() => {
      window.location.href = `mailto:IvanJTOng@gmail.com?subject=${subject}&body=${body}`;
      submitBtn.textContent = "Sent — talk soon";
    }, 400);
  });
}
