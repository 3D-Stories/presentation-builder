//
// slides-s4.js — Section 4: What We'd Do Differently (Slides 14–16)
//

"use strict";

const { colors, fonts, imgPath, addDividerSlide, addContentSlide, addCard } = require("./theme");

module.exports = function addSection4(pres) {
  // ─────────────────────────────────────────────────────────────────────────
  // Slide 14: Section Divider — "What We'd Do Differently"
  // ─────────────────────────────────────────────────────────────────────────
  addDividerSlide(pres, {
    title: "What We'd Do Differently",
    subtitle: "Three changes that'll actually stick",
    imagePath: imgPath("14-section-divider-lessons.jpg"),
    sectionIndex: 3,
    speakerNotes: `TALKING POINTS:
• "The honest answer is: a lot. But most lessons from incidents get written in a doc and forgotten."
• "These three will actually change how we work."

PACING:
[~30 sec. Visual beat.]

TRANSITION:
"Here they are." [CLICK]`,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 15: Three Changes That'll Stick
  // ─────────────────────────────────────────────────────────────────────────
  const slide15 = addContentSlide(pres, {
    title: "Three Changes That'll Stick",
  });

  const changes = [
    {
      num: "1",
      title: "Canary, not waves",
      body: "1% → 10% → 50% → 100% per wave. Not dev → staging → 100%.\nSelf-limiting blast radius at every step.",
      principle: "Never go wide on a user-facing auth change without canary validation.",
      accentColor: colors.teal,
    },
    {
      num: "2",
      title: "Test matrix as code",
      body: "Every auth surface (browser, native, webview, SDK) in a YAML file that CI reads.\n\"Test matrices rot in Notion. They survive in CI.\"",
      principle: "If the test isn't in CI, it doesn't exist.",
      accentColor: colors.teal,
    },
    {
      num: "3",
      title: "State-aware rollback",
      body: "Before any flag flip that writes state: define rollback explicitly.\n\"If I need to undo this, I will do X\" — written, not assumed.",
      principle: "Rollback is a design decision, not a recovery reflex.",
      accentColor: colors.teal,
    },
  ];

  changes.forEach((c, i) => {
    const y = 1.2 + i * 1.8;
    addCard(slide15, pres, { x: 0.4, y, w: 9.2, h: 1.65, accentColor: c.accentColor });

    // Number badge
    slide15.addShape(pres.ShapeType.ellipse, {
      x: 0.55, y: y + 0.45, w: 0.55, h: 0.55,
      fill: { color: colors.teal }, line: { color: colors.teal },
    });
    slide15.addText(c.num, {
      x: 0.55, y: y + 0.45, w: 0.55, h: 0.55,
      fontSize: 14, bold: true, color: colors.white, fontFace: fonts.title, align: "center", valign: "middle",
    });

    slide15.addText(c.title, {
      x: 1.2, y: y + 0.1, w: 7.9, h: 0.45,
      fontSize: 15, bold: true, color: colors.navy, fontFace: fonts.title,
    });
    slide15.addText(c.body, {
      x: 1.2, y: y + 0.55, w: 7.9, h: 0.75,
      fontSize: 12, color: colors.navy, fontFace: fonts.body, wrap: true,
    });
    slide15.addText(c.principle, {
      x: 1.2, y: y + 1.3, w: 7.9, h: 0.3,
      fontSize: 11, italic: true, color: colors.teal, fontFace: fonts.body,
    });
  });

  // Junior-actionable beat (Phase 5 addition)
  slide15.addNotes(`TALKING POINTS:
• "Three changes. Let me give you the reasoning for each."
• [Change 1] "Canary strategy. 1%, 10%, 50%, 100% — per wave. Not dev, staging, production-full-blast. Wave 3 would have been a 1% canary. 31,000 users would have been 310."
• [Change 2] "Test matrix as code. We had a test matrix — in Notion. Nobody looked at it on the day. It's now a YAML file that CI reads. If it's not in CI, it doesn't exist."
• [Change 3] "State-aware rollback. Before you flip any flag that writes state, define your rollback. One sentence: 'If I need to undo this, I will do X.' That's the entire practice."
• [PAUSE]
• [FOR JUNIORS:] "This last one applies to you today. The next time you ship a feature that writes state — any state: cookies, tokens, database records — write down your rollback plan before you flip the switch. One sentence. That's the habit we're building."
• [FOR STAFF:] "The canary policy is going into our release runbook. I'll share the PR link after this talk."

PACING:
[~2 min. Don't rush the junior callout — it's deliberately inclusive.]

TRANSITION:
"Here's where things stand on the action items we committed to." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 16: Action Items Status
  // ─────────────────────────────────────────────────────────────────────────
  const slide16 = addContentSlide(pres, {
    title: "Action Items — Where We Stand",
  });

  const items = [
    { jira: "PLAT-942", desc: "Remove staging aud override — one source of truth", done: true },
    { jira: "PLAT-943", desc: "Add webview flow to CI matrix — it's code now", done: true },
    { jira: "PLAT-951", desc: "Write 'flag rollback ≠ state rollback' runbook", done: false },
    { jira: "PLAT-958", desc: "Post-migration audit: all SameSite settings across products", done: false },
  ];

  // Table header
  const headerXs = [0.5, 1.3, 8.1];
  const headerLabels = ["", "Action Item", "Status"];
  headerLabels.forEach((h, i) => {
    slide16.addShape(pres.ShapeType.rect, {
      x: headerXs[i], y: 1.1, w: i === 1 ? 6.7 : i === 0 ? 0.75 : 1.45, h: 0.45,
      fill: { color: colors.navy }, line: { color: colors.navy },
    });
    slide16.addText(h, {
      x: headerXs[i] + 0.07, y: 1.12, w: i === 1 ? 6.5 : 1.3, h: 0.41,
      fontSize: 12, bold: true, color: colors.white, fontFace: fonts.title,
    });
  });

  items.forEach((item, r) => {
    const rowY = 1.58 + r * 1.0;
    const rowBg = r % 2 === 0 ? "F0F4FF" : colors.offWhite;

    // Row background
    slide16.addShape(pres.ShapeType.rect, {
      x: 0.5, y: rowY, w: 9.1, h: 0.9,
      fill: { color: rowBg }, line: { color: "E5E7EB", width: 1 },
    });

    // JIRA tag
    slide16.addText(item.jira, {
      x: 0.57, y: rowY + 0.22, w: 0.7, h: 0.38,
      fontSize: 10, color: colors.teal, fontFace: fonts.body, bold: true,
    });

    // Description
    slide16.addText(item.desc, {
      x: 1.35, y: rowY + 0.12, w: 6.6, h: 0.66,
      fontSize: 12, color: colors.navy, fontFace: fonts.body, valign: "middle", wrap: true,
    });

    // Status
    slide16.addText(item.done ? "✓  Done" : "○  Open", {
      x: 8.1, y: rowY + 0.22, w: 1.4, h: 0.38,
      fontSize: 13, bold: true,
      color: item.done ? colors.success : colors.warning,
      fontFace: fonts.body, align: "center",
    });
  });

  slide16.addNotes(`TALKING POINTS:
• "Two items done, two still open."
• "PLAT-942: the aud override is gone. One source of truth for the audience claim."
• "PLAT-943: the webview flow is in CI. If it breaks, the build breaks."
• "PLAT-951: the state-aware rollback runbook. Owned by this team. Due end of May."
• "PLAT-958: a broader audit of SameSite settings across all our products. I want to know what else might have this issue."
• "If you want to pick up PLAT-951 or PLAT-958, talk to me after. Both are good scope for a junior or mid-level engineer."

PACING:
[~1 min. Brisk — this is a status slide, not a narrative slide.]

TRANSITION:
"Let me close with where we are now." [CLICK]`);
};
