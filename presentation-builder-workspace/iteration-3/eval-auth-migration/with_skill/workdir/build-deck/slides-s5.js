//
// slides-s5.js — Section 5: Closing (Slide 17)
// Callback to opening hook + primary takeaway + Q&A
//
// Phase 5 review: callback sentence added verbatim (both opening and closing sync'd)
// Callback: "I opened with 31,000 users and 14 hours.
//            What it bought us: an auth stack that now supports mobile, OIDC partners,
//            and autoscaling — and a test matrix that lives in CI, not Notion."
//

"use strict";

const { colors, fonts, addDividerSlide } = require("./theme");

module.exports = function addSection5(pres) {
  // ─────────────────────────────────────────────────────────────────────────
  // Slide 17: Closing — Callback + Primary Takeaway
  // ─────────────────────────────────────────────────────────────────────────
  const slide = pres.addSlide();
  slide.background = { color: colors.navy };

  // Callback to opening
  slide.addText("I opened with 31,000 users and 14 hours.", {
    x: 0.7, y: 1.0, w: 8.6, h: 0.6,
    fontSize: 20, color: colors.iceBlue, fontFace: fonts.body, align: "left",
  });

  // What it bought us
  slide.addText("What it bought us:", {
    x: 0.7, y: 1.75, w: 8.6, h: 0.5,
    fontSize: 20, bold: true, color: colors.white, fontFace: fonts.title, align: "left",
  });

  const outcomes = [
    "An auth stack that now supports mobile, OIDC partners, and autoscaling",
    "A test matrix that lives in CI — not Notion",
    "A shared definition of what 'rollback' actually means for stateful features",
  ];
  outcomes.forEach((o, i) => {
    slide.addText("→  " + o, {
      x: 0.7, y: 2.35 + i * 0.6, w: 8.6, h: 0.55,
      fontSize: 16, color: colors.iceBlue, fontFace: fonts.body, align: "left",
    });
  });

  // Accent line
  slide.addShape(pres.ShapeType.line, {
    x: 0.7, y: 4.25, w: 8.6, h: 0,
    line: { color: colors.teal, width: 2 },
  });

  // Primary takeaway
  slide.addText("Auth migrations at scale require an explicit test matrix and canary strategy.", {
    x: 0.7, y: 4.45, w: 8.6, h: 0.65,
    fontSize: 18, bold: true, color: colors.white, fontFace: fonts.title, align: "left",
  });
  slide.addText("We learned that the hard way. Now you don't have to.", {
    x: 0.7, y: 5.1, w: 8.6, h: 0.5,
    fontSize: 16, italic: true, color: colors.iceBlue, fontFace: fonts.body, align: "left",
  });

  // Open questions forward-look
  slide.addText("Open questions we're watching: passkeys · refresh TTL · auth-v1 deprecation — no decisions yet.", {
    x: 0.7, y: 5.8, w: 8.6, h: 0.4,
    fontSize: 12, color: colors.white, fontFace: fonts.body, align: "left", italic: true,
  });

  // Q&A
  slide.addText("Questions?", {
    x: 0.7, y: 6.4, w: 8.6, h: 0.65,
    fontSize: 26, bold: true, color: colors.teal, fontFace: fonts.title, align: "center",
  });

  slide.addNotes(`TALKING POINTS:
• "I opened with 31,000 users and 14 hours. Let me close with what those 14 hours bought us."
• [Read the three outcomes] "An auth stack that now supports mobile, OIDC partners, and autoscaling."
• "A test matrix that lives in CI — the kind that actually catches things."
• "And a shared understanding of what rollback means for stateful features."
• [PAUSE]
• "Auth migrations at scale require an explicit test matrix and a canary strategy."
• "We learned that the hard way."
• [Beat] "Now you don't have to."
• [PAUSE — 2 seconds]
• "A few open questions the team is still discussing: passkeys, whether the 30-day refresh TTL should be shorter, and whether to deprecate auth-v1 for legacy partners. No decisions on any of those yet — but worth knowing they're on the table."
• "I'll take questions — or find me after if you want to go deeper on any of this."

PACING:
[~2 min including Q&A setup. The two pauses — after "hard way" and after "now you don't have to" — are critical. Don't rush the ending.]

TRANSITION:
[End of talk — open for questions]`);
};
