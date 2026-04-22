/**
 * slides-s2.js — Section 2: What We Shipped
 * Slide 2: Major features (left-accent card list)
 * Slide 3: Impact metrics (2x2 stat callout grid)
 */

'use strict';

const { colors, fonts, addCard, addStat } = require('./theme');

module.exports = function addSection2(pres) {

  // ----- Slide 2: What Shipped — Features -----
  const notes2 = `TALKING POINTS:
• "Four big things shipped this quarter."
• "Homepage first — full redesign of the hero section, nav, and mobile layout."
• "Product pages — new layout, faster load time, better hierarchy."
• "Checkout flow — we cut the steps from five down to three. That was a team effort."
• "And underneath all of this — design system adoption. New tokens rolled out across every page."

PACING:
[~30 sec. Move through these quickly — they all know the work. Just the labels.]

[FOR DEVS:] "The design token rollout was the invisible win — everything now traces back to the same source of truth."
[FOR PM:] "These were all in the Q4 spec. Zero scope creep."

TRANSITION:
"Here's what those changes translated to externally." [CLICK]`;

  const slide2 = pres.addSlide();
  slide2.background = { color: colors.offWhite };

  // Slide title
  slide2.addText('What Shipped in Q4', {
    x: 0.5, y: 0.35, w: 12.33, h: 0.75,
    fontSize: 30, bold: true, color: colors.nearBlack,
    fontFace: fonts.title,
    align: 'left',
    valign: 'middle',
  });

  // Teal underline
  slide2.addShape(pres.ShapeType.RECTANGLE, {
    x: 0.5, y: 1.1, w: 12.33, h: 0.04,
    fill: { color: colors.teal },
    line: { width: 0 },
  });

  // Feature cards — 4 items with left-accent border
  const features = [
    { label: 'New Homepage', detail: 'Redesigned hero, updated nav, mobile-first layout' },
    { label: 'Product Pages', detail: 'New layout structure, improved load performance' },
    { label: 'Checkout Flow', detail: 'Simplified from 5 steps → 3 steps' },
    { label: 'Design System Adoption', detail: 'New tokens rolled out across all pages' },
  ];

  const cardW = 5.7;
  const cardH = 1.05;
  const positions = [
    { x: 0.5,  y: 1.35 },
    { x: 6.63, y: 1.35 },
    { x: 0.5,  y: 2.65 },
    { x: 6.63, y: 2.65 },
  ];

  features.forEach(function(feat, i) {
    const pos = positions[i];

    // Card background + left accent
    addCard(slide2, pres, { x: pos.x, y: pos.y, w: cardW, h: cardH, accentColor: colors.teal });

    // Feature label (bold)
    slide2.addText(feat.label, {
      x: pos.x + 0.22, y: pos.y + 0.08, w: cardW - 0.3, h: 0.35,
      fontSize: 16, bold: true, color: colors.nearBlack,
      fontFace: fonts.title,
      align: 'left',
      valign: 'middle',
    });

    // Feature detail
    slide2.addText(feat.detail, {
      x: pos.x + 0.22, y: pos.y + 0.45, w: cardW - 0.3, h: 0.45,
      fontSize: 13, bold: false, color: colors.midGray,
      fontFace: fonts.body,
      align: 'left',
      valign: 'top',
    });
  });

  // Footer note
  slide2.addText('All four items were in the original Q4 spec. Zero scope creep.', {
    x: 0.5, y: 4.0, w: 12.33, h: 0.4,
    fontSize: 12, bold: false, color: colors.midGray,
    fontFace: fonts.body,
    align: 'center',
    valign: 'middle',
    italic: false,
  });

  slide2.addNotes(notes2);


  // ----- Slide 3: Impact Metrics -----
  const notes3 = `TALKING POINTS:
• [IMPORTANT: Replace all metrics below with real Q4 numbers before presenting]
• "All Q4 commitments shipped. Here's what that translated to."
• "Page load time down 35% — users feel that immediately."
• "Mobile bounce rate dropped 18% — the mobile-first work paid off."
• "Checkout completion up 12% — cutting those two steps made a real difference."
• "Zero P1 regressions at launch. The team QA'd this properly."

PACING:
[~30 sec. Read the numbers, let them land. Don't over-explain — the stats speak.]
[PAUSE after "Zero P1 regressions."]

TRANSITION:
"Those are the numbers. The team execution behind them is the real story." [CLICK]`;

  const slide3 = pres.addSlide();
  slide3.background = { color: colors.offWhite };

  // Slide title — reinforces primary takeaway
  slide3.addText('All Q4 Commitments: Shipped', {
    x: 0.5, y: 0.35, w: 12.33, h: 0.75,
    fontSize: 30, bold: true, color: colors.nearBlack,
    fontFace: fonts.title,
    align: 'left',
    valign: 'middle',
  });

  // Teal underline
  slide3.addShape(pres.ShapeType.RECTANGLE, {
    x: 0.5, y: 1.1, w: 12.33, h: 0.04,
    fill: { color: colors.teal },
    line: { width: 0 },
  });

  // 2x2 stat grid
  const stats = [
    { number: '-35%',  label: 'Page Load Time\n(PLACEHOLDER)' },
    { number: '-18%',  label: 'Mobile Bounce Rate\n(PLACEHOLDER)' },
    { number: '+12%',  label: 'Checkout Completion\n(PLACEHOLDER)' },
    { number: '0',     label: 'P1 Regressions at Launch' },
  ];

  const statW = 5.5;
  const statH = 2.2;
  const statPositions = [
    { x: 0.6,  y: 1.3 },
    { x: 6.73, y: 1.3 },
    { x: 0.6,  y: 3.7 },
    { x: 6.73, y: 3.7 },
  ];

  const statColors = [colors.teal, colors.teal, colors.teal, '4CAF50'];

  stats.forEach(function(stat, i) {
    const pos = statPositions[i];
    addStat(slide3, pres, {
      x: pos.x, y: pos.y, w: statW, h: statH,
      number: stat.number,
      label: stat.label,
      color: statColors[i],
    });
  });

  slide3.addNotes(notes3);
};
