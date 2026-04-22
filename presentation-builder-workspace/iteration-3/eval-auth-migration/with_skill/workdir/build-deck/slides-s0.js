//
// slides-s0.js — Section 0: Title & Hook (Slide 1)
// "Auth v2: What We Shipped, What Broke, and What We'd Do Differently"
//

"use strict";

const { colors, fonts, imgPath, addDividerSlide } = require("./theme");

module.exports = function addSection0(pres) {
  // ─────────────────────────────────────────────────────────────────────────
  // Slide 1: Title Hero (dark bg)
  // ─────────────────────────────────────────────────────────────────────────
  const slide = pres.addSlide();
  slide.background = { color: colors.navy };

  // Hero image (full bleed, very low opacity)
  try {
    slide.addImage({
      path: imgPath("01-title-hero.jpg"),
      x: 0, y: 0, w: 10, h: 7.5,
      sizing: { type: "cover" },
      transparency: 60,
    });
  } catch (e) {
    // Image not available — slide still functional
  }

  // Cold open hook — impact numbers
  slide.addText("14 hours.  31,000 users.", {
    x: 0.6, y: 1.2, w: 8.8, h: 0.7,
    fontSize: 28, bold: true, color: colors.danger,
    fontFace: fonts.title, align: "left",
  });

  // Main title
  slide.addText("Auth v2: What We Shipped,\nWhat Broke, and What We'd Do Differently", {
    x: 0.6, y: 2.0, w: 8.8, h: 1.8,
    fontSize: 34, bold: true, color: colors.white,
    fontFace: fonts.title, align: "left",
  });

  // Subtitle
  slide.addText("Platform Team  ·  Engineering All-Hands  ·  April 2026", {
    x: 0.6, y: 3.9, w: 8.8, h: 0.45,
    fontSize: 16, color: colors.iceBlue, fontFace: fonts.body, align: "left",
  });

  // Callback setup line (small, bottom)
  slide.addText("This is what those 14 hours bought us.", {
    x: 0.6, y: 6.5, w: 8.8, h: 0.4,
    fontSize: 14, italic: true, color: colors.iceBlue,
    fontFace: fonts.body, align: "left",
  });

  slide.addNotes(`TALKING POINTS:
• [Open cold — no preamble]
• "On March 19th, at 08:12 UTC, we flipped a feature flag."
• "By 08:42, we were paged. 31,000 mobile users had silently lost their sessions."
• "It took us 14 hours and 22 minutes to fully recover."
• [PAUSE — 3 seconds. Let that land. Make eye contact.]
• "This talk is the story of what happened — and what it cost us, and what it bought us."
• "But to understand the incident, you need to understand what we were replacing."
• "So let's go back to the beginning."

PACING:
[~1 min. The pause after the impact numbers is critical — 3 full seconds of silence.
Do not rush past it. The audience needs to feel the weight before you pivot to the story.]

TRANSITION:
"Let's start with why auth-v1 had to go." [CLICK]`);
};
