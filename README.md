# Interactive 3D Love Letter

A standalone, handcrafted love letter delivered as an interactive pop-up book — built entirely with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies beyond Google Fonts.

## How to View

**Option A — Download and open locally (works on any device):**
1. Go to the repository on GitHub
2. Click `love-letter.html`
3. Click the **Download raw file** button (the download icon, top right of the file view)
4. Open the downloaded file in any browser — Chrome, Safari, Firefox

**Option B — HTMLPreview (browser, no download needed):**
Open this link in your browser:
https://htmlpreview.github.io/?https://raw.githubusercontent.com/sanctional/portfolio/claude/interactive-3d-love-letter-0hQ0y/love-letter.html

> Note: This file lives on the `claude/interactive-3d-love-letter-0hQ0y` branch intentionally — it is a personal side project separate from the main portfolio.

---

## What It Is

A digital love letter shaped like a physical hardcover book. You choose a cultural setting, click the book to open it, and a 3D pop-up pavilion scene springs up from the pages — surrounded by culturally matching flowers — while the letter appears on the right page in handwritten script.

---

## 8 Cultural Scenes

| Scene | Pavilion Style | Flowers | Falling Particles |
|-------|---------------|---------|------------------|
| Japan | Torii gate archway | Sakura (cherry blossom pink) | Cherry petals |
| Korea | Jeongja pavilion (hanbok-era) | Peach blossoms | Floating lanterns |
| China | Tiered pagoda | Lotuses + plum blossoms | Paper lanterns |
| Western Europe | Victorian garden gazebo | Roses, tulips, lavender | Rose petals |
| India | Mughal arch (Taj-style) | Marigold + jasmine | Marigold petals |
| Morocco / Middle East | Moorish keyhole arches | Bougainvillea + roses | Flower petals |
| Greece / Mediterranean | White marble columns + pergola | Bougainvillea (purple/white) | Olive blossoms |
| Bali / Southeast Asia | Balinese stone temple gate | Hibiscus + frangipani | Tropical petals |

---

## Features

- **Scene selector** — 8 illustrated cards, each previewing the colour palette and cultural theme
- **Book cover** — perspectively tilted, styled per scene with a matching gradient and decorative border
- **3D book opening animation** — the hardcover flips left (~1.4 s) while the pop-up scene springs up simultaneously
- **CSS pop-up pavilion** — each of the 8 pavilion styles is built entirely from CSS shapes (`clip-path`, `border-radius`, absolute positioning)
- **CSS flowers** — petals radially arranged with hover-sway animation; click any flower for a heart-burst particle effect
- **Cinematic orbit** — after the book opens, the scene auto-rotates on the Y-axis so the pavilion is seen from multiple angles
- **Drag-to-orbit** — mouse drag or touch swipe rotates the scene manually in real time
- **Falling petals** — culturally matched particle system (JS interval, CSS `@keyframes`)
- **Handwritten letter** — placeholder romantic text on aged parchment paper; clearly marked for easy replacement
- **Fully responsive** — scales down gracefully on mobile screens

---

## File Structure

```
love-letter.html    ← single self-contained file (all CSS + JS inline)
README.md           ← this file
```

Everything is in one file. To customise the letter text, search for `<!-- LETTER TEXT -->` inside `love-letter.html` and replace the placeholder paragraphs.

---

## Built With

- HTML5
- CSS3 (3D transforms, `clip-path`, `@keyframes`, CSS custom properties)
- Vanilla JavaScript (no libraries)
- Google Fonts — Playfair Display, EB Garamond, Cinzel

---

## Personalising

| What to change | Where in the file |
|----------------|------------------|
| Recipient name | Search `My Love` — replace in the letter heading and cover |
| Letter body text | Search `<!-- LETTER TEXT -->` — replace the `<p>` blocks |
| Sender name | Search `Ivan ♡` at the bottom of the letter |
| Add a new scene | Add an entry to the `SCENES` object and a `pav*()` builder function |

---

## Branch Note

This project lives permanently on `claude/interactive-3d-love-letter-0hQ0y` and is intentionally **not merged into main**. The main branch contains the professional portfolio at [sanctional.github.io/Portfolio](https://sanctional.github.io/Portfolio/).
