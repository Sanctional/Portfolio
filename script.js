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

/* ---------- Nav scroll-spy (active link highlight) ---------- */
const navAnchors = document.querySelectorAll("[data-nav]");
const sections   = document.querySelectorAll("section[id]");

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      // Map section IDs to nav data-nav values
      const map = {
        top:      "about",
        metrics:  "about",
        about:    "about",
        skills:   "skills",
        work:     "work",
        projects: "projects",
        contact:  "contact",
      };
      navAnchors.forEach(a => {
        a.classList.toggle("is-active", a.dataset.nav === map[id]);
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => spyObserver.observe(s));

/* ---------- Metric count-up animation ---------- */
function animateCount(el, target, duration) {
  const start = performance.now();
  const tick  = (now) => {
    const p      = Math.min(1, (now - start) / duration);
    const eased  = 1 - Math.pow(1 - p, 3);  // ease-out cubic
    const value  = Math.round(target * eased);
    el.textContent = value.toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const metricCards = document.querySelectorAll(".io-metric[data-metric-value]");

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card   = entry.target;
      const target = parseInt(card.dataset.metricValue, 10);
      const numEl  = card.querySelector(".io-metric__num");
      if (numEl && numEl.dataset.animated !== "true") {
        numEl.dataset.animated = "true";
        animateCount(numEl, target, 900);
      }
      countObserver.unobserve(card);
    }
  });
}, { threshold: 0.4 });

metricCards.forEach(card => countObserver.observe(card));

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
