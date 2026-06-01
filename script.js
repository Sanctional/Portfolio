/* ============================================================
   Ivan Ong Portfolio — script.js
   Single-page: Lucide · Lenis · GSAP · ScrollTrigger
   Phase 4: magnetic cursor · card glow · editorial reveals
   ============================================================ */

/* ── Lucide icons ── */
function initIcons() {
  if (window.lucide) lucide.createIcons();
}
initIcons();

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById("nav-toggle");
const navLinks  = document.getElementById("nav-links");
navToggle?.addEventListener("click", () => navLinks?.classList.toggle("is-open"));

/* ── Nav scroll state ── */
const topNav = document.getElementById("top-nav");
if (topNav) {
  const onScroll = () => topNav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis = null;

function initLenis() {
  if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Smooth in-page anchor navigation via Lenis ── */
function initAnchors() {
  const NAV_OFFSET = -80;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    link.addEventListener("click", e => {
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      navLinks?.classList.remove("is-open");
      if (lenis) {
        lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ============================================================
   ANIMATIONS — GSAP + ScrollTrigger
   ─────────────────────────────────────────────────────────────
   Phase 4 refinements:
   • power3.out throughout — harder deceleration = more premium
   • Trigger at "top 78%" — earlier entry, animation lands before
     the element reaches centre-screen (cinematic breathing room)
   • Hero title y: 44px throw — more drama on the headline settle
   • GSAP-managed hover lift on .io-case — keeps transform ownership
     inside GSAP so the scroll-in y tween and the hover tween share
     the same property without CSS/GSAP conflicts
   ─────────────────────────────────────────────────────────────
   Phase 2 correctness fixes preserved:
   A1: true HTML metric values; count-up resets inside onEnter
   A2: prefers-reduced-motion gate before any GSAP motion
   A3: FOUC guard removed here; hero uses fromTo() for both states
   ============================================================ */
function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* A2 — reduced-motion gate */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* A3 — remove FOUC guard; either GSAP takes over or elements become visible */
  document.getElementById("io-fouc-guard")?.remove();

  if (reducedMotion) {
    ScrollTrigger.refresh();
    return;
  }

  ScrollTrigger.defaults({ toggleActions: "play none none reverse" });

  /* ── Hero entrance (no ScrollTrigger — fires on load) ── */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .fromTo(".io-hero__eyebrow",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 })
    .fromTo(".io-hero__title",
      { opacity: 0, y: 44 },
      { opacity: 1, y: 0, duration: 1.0 }, "-=0.4")
    .fromTo(".io-hero__sub",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75 }, "-=0.5")
    .fromTo(".io-hero__ctas",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55 }, "-=0.45")
    .fromTo(".io-hero__meta",
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }, "-=0.35")
    .fromTo(".io-hero__visual",
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1.0 }, "-=0.8");

  /* ── Hero parallax (scrub — bidirectional by nature) ── */
  gsap.to(".io-hero__glow", {
    yPercent: -30, ease: "none",
    scrollTrigger: { trigger: ".io-hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".io-hero__visual", {
    y: -40, ease: "none",
    scrollTrigger: { trigger: ".io-hero", start: "top top", end: "bottom top", scrub: 1.8 },
  });

  /* ── Value strip ── */
  gsap.from(".io-value-item", {
    opacity: 0, y: 32, duration: 0.7, stagger: 0.14, ease: "power3.out",
    scrollTrigger: { trigger: ".io-value-strip", start: "top 82%" },
  });

  /* ── Section heads — uniform cadence across all sections ── */
  ["#work", "#projects", "#about", "#skills", "#metrics", "#contact"].forEach(sel => {
    gsap.from(`${sel} .io-section__head`, {
      opacity: 0, y: 28, duration: 0.75, ease: "power3.out",
      scrollTrigger: { trigger: `${sel} .io-section__head`, start: "top 84%" },
    });
  });

  /* ── Case study cards ── */
  gsap.from(".io-case", {
    opacity: 0, y: 44, duration: 0.72, stagger: 0.13, ease: "power3.out",
    scrollTrigger: { trigger: ".io-cases", start: "top 78%" },
  });

  /* GSAP-managed hover lift keeps transform inside GSAP throughout,
     so .io-case:hover { transform } in CSS is not needed — removing
     it prevents CSS vs GSAP ownership conflicts on the same property. */
  document.querySelectorAll(".io-case").forEach(card => {
    card.addEventListener("mouseenter", () =>
      gsap.to(card, { y: -4, duration: 0.3, ease: "power2.out", overwrite: "auto" })
    );
    card.addEventListener("mouseleave", () =>
      gsap.to(card, { y: 0,  duration: 0.4, ease: "power2.out", overwrite: "auto" })
    );
  });

  /* ── Projects ── */
  gsap.from(".io-project", {
    opacity: 0, y: 36, duration: 0.65, stagger: 0.11, ease: "power3.out",
    scrollTrigger: { trigger: ".io-projects", start: "top 78%" },
  });

  /* ── About ── */
  gsap.from(".io-about__photo", {
    opacity: 0, y: 44, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: ".io-about", start: "top 78%" },
  });
  gsap.from(".io-about__copy p", {
    opacity: 0, y: 24, duration: 0.65, stagger: 0.13, ease: "power3.out",
    scrollTrigger: { trigger: ".io-about__copy", start: "top 80%" },
  });

  /* ── Skills ── */
  gsap.from(".io-skill", {
    opacity: 0, y: 22, duration: 0.55, stagger: 0.07, ease: "power3.out",
    scrollTrigger: { trigger: ".io-skills--triple", start: "top 78%" },
  });
  gsap.from(".io-skills__pills .io-pill", {
    opacity: 0, scale: 0.86, duration: 0.45, stagger: 0.07, ease: "back.out(1.5)",
    scrollTrigger: { trigger: ".io-skills__pills", start: "top 84%" },
  });

  /* ── Metrics — stagger then count-up ── */
  gsap.from(".io-metric", {
    opacity: 0, y: 36, duration: 0.65, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: ".io-metrics-grid", start: "top 78%" },
  });

  /* A1 — count-up fires once per card when it enters the viewport.
     HTML already shows the true value as a fallback for no-JS. */
  document.querySelectorAll(".io-metric[data-metric-value]").forEach(card => {
    const targetVal = parseInt(card.dataset.metricValue, 10);
    const numEl = card.querySelector(".io-metric__num");
    if (!numEl) return;

    ScrollTrigger.create({
      trigger: card, start: "top 84%", once: true,
      onEnter() {
        const counter = { val: 0 };
        numEl.textContent = "0";
        gsap.to(counter, {
          val: targetVal, duration: 1.8, ease: "power3.out",
          onUpdate() { numEl.textContent = Math.round(counter.val).toLocaleString(); },
        });
      },
    });
  });

  /* ── Contact ── */
  gsap.from(".io-contact-meta", {
    opacity: 0, y: 24, duration: 0.65, ease: "power3.out",
    scrollTrigger: { trigger: ".io-contact-meta", start: "top 84%" },
  });
  gsap.from(".io-form", {
    opacity: 0, x: -32, duration: 0.75, ease: "power3.out",
    scrollTrigger: { trigger: ".io-contact", start: "top 78%" },
  });
  gsap.from(".io-contact__rail", {
    opacity: 0, x: 32, duration: 0.75, ease: "power3.out",
    scrollTrigger: { trigger: ".io-contact", start: "top 78%" },
  });

  ScrollTrigger.refresh();
}

/* ============================================================
   CUSTOM CURSOR — magnetic, fine-pointer only
   ─────────────────────────────────────────────────────────────
   Two layers:
   • #io-cursor-dot  — snaps to raw mouse position each frame
   • #io-cursor-ring — lerps behind (lerp factor 0.10) for lag

   The ring lerp runs inside the existing GSAP ticker (which also
   drives Lenis), so there is no extra rAF loop.

   Magnetic elements: on mouseenter the ring tweens to the
   element centre and scales up; on mouseleave lerp vars are
   synced to the GSAP-tweened position before the lerp resumes,
   so there is no snap / jump on leave.

   Touch guard: (hover: hover) and (pointer: fine) — the cursor
   HTML is never shown and the OS cursor is never hidden on touch.
   ============================================================ */
function initCursor() {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFinePointer || reducedMotion || !window.gsap) return;

  const dot  = document.getElementById("io-cursor-dot");
  const ring = document.getElementById("io-cursor-ring");
  if (!dot || !ring) return;

  /* GSAP owns all transforms. xPercent/yPercent centres elements on cursor. */
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

  /* Suppress the OS cursor */
  document.documentElement.classList.add("io-has-cursor");

  let mx = 0, my = 0;        // raw mouse position (dot follows exactly)
  let rx = 0, ry = 0;        // ring lerped position
  let isMagnetic = false;
  let hasEntered = false;

  /* Track raw mouse — dot snaps directly, ring lerps via ticker below */
  window.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
    if (!hasEntered) {
      rx = mx; ry = my;
      hasEntered = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.5 });
    }
  }, { passive: true });

  /* Ring lerp — shares the GSAP ticker with Lenis, zero overhead */
  gsap.ticker.add(() => {
    if (isMagnetic) return;   // GSAP tween handles position during magnetic state
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    gsap.set(ring, { x: rx, y: ry });
  });

  /* Fade when cursor leaves / re-enters the window */
  window.addEventListener("mouseleave",
    () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 }),
    { passive: true }
  );
  window.addEventListener("mouseenter", () => {
    if (hasEntered) gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
  }, { passive: true });

  /* Magnetic elements */
  const MAGNETIC = [
    ".io-nav__link",
    ".io-btn",
    "button.io-case__cta",
    ".io-project",
    ".io-contact__link",
    ".io-footer__rail a",
  ].join(", ");

  document.querySelectorAll(MAGNETIC).forEach(el => {
    el.addEventListener("mouseenter", () => {
      isMagnetic = true;
      const r = el.getBoundingClientRect();
      gsap.to(ring, {
        x: r.left + r.width  / 2,
        y: r.top  + r.height / 2,
        scale: 2.1, duration: 0.38, ease: "power2.out", overwrite: "auto",
      });
      gsap.to(dot, { scale: 0.45, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    });

    el.addEventListener("mouseleave", () => {
      /* Sync lerp start position to where GSAP left the ring — no jump */
      rx = gsap.getProperty(ring, "x");
      ry = gsap.getProperty(ring, "y");
      isMagnetic = false;
      gsap.to(ring, { scale: 1, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      gsap.to(dot,  { scale: 1, duration: 0.3,  ease: "power2.out", overwrite: "auto" });
    });
  });
}

/* ============================================================
   CARD GLOW — cursor-tracking spotlight inside each card
   ─────────────────────────────────────────────────────────────
   Sets CSS custom properties --gx / --gy on each card via
   mousemove. The card's ::before pseudo-element reads these to
   position a radial-gradient spotlight that fades in/out on
   hover via CSS opacity transition.

   Skipped on touch devices and reduced-motion — CSS fallback
   (::before always at 50% 50%) is harmless and invisible since
   opacity stays at 0 without :hover.
   ============================================================ */
function initCardGlow() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".io-case, .io-project").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--gx", `${e.clientX - r.left}px`);
      card.style.setProperty("--gy", `${e.clientY - r.top}px`);
    }, { passive: true });
  });
}

/* ============================================================
   MODALS — A4: focus trap + return focus (Phase 2, unchanged)
   ============================================================ */
function initModals() {
  const FOCUSABLE_SELECTORS =
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

  let lastFocused = null;
  const trapCleanups = new WeakMap();

  function trapFocus(modal) {
    function onKeyDown(e) {
      if (e.key !== "Tab") return;
      const nodes = [...modal.querySelectorAll(FOCUSABLE_SELECTORS)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
    modal.addEventListener("keydown", onKeyDown);
    return () => modal.removeEventListener("keydown", onKeyDown);
  }

  function openModal(modal, triggerEl) {
    lastFocused = triggerEl;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lenis?.stop(); // pause Lenis so its RAF loop can't scroll the background
    if (window.lucide) lucide.createIcons();
    trapCleanups.set(modal, trapFocus(modal));
    modal.querySelector("[data-modal-close]")?.focus();
  }

  function closeModal(modal) {
    const cleanup = trapCleanups.get(modal);
    if (cleanup) { cleanup(); trapCleanups.delete(modal); }
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    lenis?.start(); // resume Lenis once the modal is gone
    lastFocused?.focus();
    lastFocused = null;
  }

  document.querySelectorAll(".io-case[data-modal]").forEach(card => {
    card.addEventListener("click", () => {
      const modal = document.getElementById(card.dataset.modal);
      if (!modal || modal.classList.contains("is-open")) return;
      const cta = card.querySelector(".io-case__cta");
      openModal(modal, cta || card);
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".io-modal");
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll(".io-modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const open = document.querySelector(".io-modal.is-open");
    if (open) closeModal(open);
  });
}

/* ============================================================
   CONTACT FORM — Formspree async submission
   ============================================================ */
function initContactForm() {
  const form      = document.getElementById("contact-form");
  const submitBtn = document.getElementById("cf-submit");
  if (!form || !submitBtn) return;

  const ENDPOINT   = "https://formspree.io/f/mojbokal";
  const LABEL_ORIG = submitBtn.innerHTML;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Sending state
    submitBtn.innerHTML = "Sending…";
    submitBtn.disabled  = true;

    try {
      const res = await fetch(ENDPOINT, {
        method:  "POST",
        headers: { Accept: "application/json" },
        body:    new FormData(form),
      });

      if (res.ok) {
        // Success state — permanent until page reload
        submitBtn.innerHTML = "Message Sent!";
        form.reset(); // native reset clears values + validation state
      } else {
        // Formspree returned an error — let them retry
        submitBtn.innerHTML = LABEL_ORIG;
        submitBtn.disabled  = false;
      }
    } catch {
      // Network failure — let them retry
      submitBtn.innerHTML = LABEL_ORIG;
      submitBtn.disabled  = false;
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */
initLenis();
initAnchors();
initAnimations();
initCursor();
initCardGlow();
initModals();
initContactForm();
