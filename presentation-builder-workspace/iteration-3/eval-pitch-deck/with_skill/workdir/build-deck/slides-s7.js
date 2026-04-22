// slides-s7.js — Section 7: Close (Slide 12)
// "What We Don't Have (Yet)"
// Duration: ~1 min | 1 slide

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addCard, makeCardShadow } = require('./theme');

module.exports = function buildSection7(pres) {

  // ── Slide 12: The Honest Close ─────────────────────────────────────────────
  const s12 = pres.addSlide();
  s12.background = { color: colors.offWhite };

  // Coral left accent
  s12.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Title
  s12.addText('Honest Close', {
    x: 0.25, y: 0.15, w: W - 0.5, h: 0.52,
    fontSize: 30, fontFace: fonts.title, bold: true,
    color: colors.charcoal, align: 'left',
  });

  // Separator (thin rect)
  s12.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 0.73, w: W - 0.5, h: 0.01,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Optional balance image
  try {
    s12.addImage({ path: path.join(IMG, '12-close.png'), x: W - 4.2, y: 0.85, w: 4.0, h: 3.5 });
  } catch (e) { /* image absent */ }

  // Left column: What we HAVE
  addCard(s12, pres, { x: 0.25, y: 0.9, w: 2.7, h: 3.15, accentColor: colors.success });

  s12.addText('What We Have', {
    x: 0.42, y: 1.0, w: 2.35, h: 0.42,
    fontSize: 16, fontFace: fonts.title, bold: true,
    color: colors.success, align: 'left',
  });

  const haves = [
    '72% week-4 retention (9 weeks in)',
    'NPS 61 — promoter territory',
    '38 min avg session — full workouts',
    'Top beta feedback: "caught what my trainer missed"',
    'On-device ML — technical differentiator',
    'iOS live · 40 exercises · closed beta',
  ];

  haves.forEach((item, i) => {
    s12.addText('✓  ' + item, {
      x: 0.42, y: 1.5 + i * 0.43, w: 2.35, h: 0.38,
      fontSize: 11, fontFace: fonts.body,
      color: colors.charcoal, align: 'left',
    });
  });

  // Right column: What we're FIGURING OUT
  addCard(s12, pres, { x: 3.1, y: 0.9, w: 2.5, h: 3.15, accentColor: colors.warning });

  s12.addText('Still Figuring Out', {
    x: 3.27, y: 1.0, w: 2.15, h: 0.42,
    fontSize: 16, fontFace: fonts.title, bold: true,
    color: colors.warning, align: 'left',
  });

  const figuring = [
    'Monetization: subscription vs. freemium',
    'TAM/SAM — rigorous sizing pending',
    'Moat beyond on-device ML',
    'Expansion story: mobility/yoga/cardio',
    'Android timeline',
  ];

  figuring.forEach((item, i) => {
    s12.addText('→  ' + item, {
      x: 3.27, y: 1.5 + i * 0.5, w: 2.15, h: 0.44,
      fontSize: 11, fontFace: fonts.body,
      color: colors.charcoal, align: 'left',
    });
  });

  // Bottom callback — the close line
  s12.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 4.2, w: 5.5, h: 1.1,
    fill: { color: colors.navy }, line: { type: 'none' },
    shadow: makeCardShadow(),
  });

  s12.addText('"72% retention in 9 weeks isn\'t luck. It\'s validation.', {
    x: 0.4, y: 4.27, w: 5.2, h: 0.45,
    fontSize: 14, fontFace: fonts.title, bold: true, italic: true,
    color: colors.white, align: 'center',
  });

  s12.addText('We want the time to turn it into a business — and we believe this round is how we do that."', {
    x: 0.4, y: 4.7, w: 5.2, h: 0.5,
    fontSize: 12, fontFace: fonts.body, italic: true,
    color: colors.gold, align: 'center',
  });

  s12.addNotes(`TALKING POINTS:
• "Most pitch decks end on maximum confidence. We're going to end on honesty."
• [Point to 'What We Have' column] "We have the retention proof. We have engaged users who are doing full workouts and telling their friends. We have a technical approach that's genuinely differentiated."
• [Point to 'Still Figuring Out' column] "And here's what we're still working on. We don't have a locked monetization model. We don't have a rigorously-sized TAM. We have a moat hypothesis we're still pressure-testing."
• [PAUSE]
• [Point to close quote] "Seventy-two percent retention in nine weeks isn't luck. It's validation. We want the time to turn it into a business — and we believe this round is how we do that."
• [PAUSE — let it land]
• "Thank you. What questions do you have?"

CALLBACK NOTE:
This closes the loop opened on Slide 1. The same number that started the deck without context now closes it with full meaning. The room has been on the journey.

PACING:
[~1 min. The final pause before "Thank you" is important. Don't rush the last line.]

TRANSITION:
"Thank you — over to questions."

[FOR PMs:] The 'Still Figuring Out' column is a trust signal, not a weakness. VCs fund founders who know what they know. Own it.`);
};
