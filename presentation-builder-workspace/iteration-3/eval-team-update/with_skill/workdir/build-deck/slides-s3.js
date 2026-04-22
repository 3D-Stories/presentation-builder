/**
 * slides-s3.js — Section 3: Team + Q1 Preview
 * Slide 4: Team recognition (dark, pull-quote style)
 * Slide 5: Q1 Preview (light, card-with-divider layout + CTA)
 */

'use strict';

const { colors, fonts, addCard } = require('./theme');

module.exports = function addSection3(pres) {

  // ----- Slide 4: Team Recognition -----
  const notes4 = `TALKING POINTS:
• "Shipped in 11 weeks. Zero all-nighters."
• [PAUSE] "That's worth saying out loud."
• "This was a full team effort — frontend, backend, design, PM — all in sync."
• "Everyone here had a hand in this. That's not a given."

PACING:
[~45 sec. Slow down here. This is the emotional beat of the deck. Don't rush the pause.]
[FOR MANAGERS:] "This is the model we want to repeat in Q1."

TRANSITION:
"Same team, same energy. Here's what Q1 looks like." [CLICK]`;

  const slide4 = pres.addSlide();
  slide4.background = { color: colors.charcoal };

  // Big pull-quote — achievement statement
  slide4.addText('Shipped in 11 weeks.\nZero all-nighters.', {
    x: 0.5, y: 1.5, w: 12.33, h: 1.8,
    fontSize: 36, bold: true, color: colors.white,
    fontFace: fonts.title,
    align: 'center',
    valign: 'middle',
  });

  // Teal accent bar below quote
  slide4.addShape(pres.ShapeType.RECTANGLE, {
    x: 4.0, y: 3.4, w: 5.33, h: 0.05,
    fill: { color: colors.teal },
    line: { width: 0 },
  });

  // Team recognition sub-text
  slide4.addText('Frontend  ·  Backend  ·  Design  ·  Product', {
    x: 0.5, y: 3.7, w: 12.33, h: 0.6,
    fontSize: 18, bold: false, color: colors.midGray,
    fontFace: fonts.body,
    align: 'center',
    valign: 'middle',
  });

  slide4.addText('Full team effort. Everyone contributed.', {
    x: 0.5, y: 4.5, w: 12.33, h: 0.5,
    fontSize: 15, bold: false, color: '9E9E9E',
    fontFace: fonts.body,
    align: 'center',
    valign: 'middle',
  });

  slide4.addNotes(notes4);


  // ----- Slide 5: Q1 Preview -----
  const notes5 = `TALKING POINTS:
• "Same team, same energy. Here's what Q1 looks like."
• "Three things in flight: blog redesign is in design right now, accessibility audit starts next sprint, search improvements are scoped."
• "Full spec is in Notion — ask [PM name] for the link if you want it."
• "If you want to pick up any Q1 items early, grab [PM name] after standup."

PACING:
[~45 sec. This is a look-ahead, not a deep dive. Light touch — leave time for questions.]

[FOR DEVS:] "The accessibility audit will touch some of the same components we just shipped — worth knowing early."

TRANSITION:
"That's the Q4 story. Any questions before we jump into standups?" [END]`;

  const slide5 = pres.addSlide();
  slide5.background = { color: colors.offWhite };

  // Slide title
  slide5.addText('Q1 Preview', {
    x: 0.5, y: 0.35, w: 12.33, h: 0.75,
    fontSize: 30, bold: true, color: colors.nearBlack,
    fontFace: fonts.title,
    align: 'left',
    valign: 'middle',
  });

  // Teal underline
  slide5.addShape(pres.ShapeType.RECTANGLE, {
    x: 0.5, y: 1.1, w: 12.33, h: 0.04,
    fill: { color: colors.teal },
    line: { width: 0 },
  });

  // Q1 items — left-accent cards (differentiated from Slide 2 bullets by using inline status labels)
  const q1Items = [
    { label: 'Blog Redesign', detail: 'In design  ·  Estimated start: Week 2' },
    { label: 'Accessibility Audit + Fixes', detail: 'Scoped  ·  Starting next sprint' },
    { label: 'Search Improvements', detail: 'Spec complete  ·  Estimated start: Week 4' },
  ];

  q1Items.forEach(function(item, i) {
    const cardY = 1.35 + (i * 1.35);
    const cardH = 1.1;

    // Card + accent
    addCard(slide5, pres, { x: 0.5, y: cardY, w: 12.33, h: cardH, accentColor: colors.teal });

    // Item label
    slide5.addText(item.label, {
      x: 0.72, y: cardY + 0.1, w: 11.6, h: 0.38,
      fontSize: 16, bold: true, color: colors.nearBlack,
      fontFace: fonts.title,
      align: 'left',
      valign: 'middle',
    });

    // Status detail
    slide5.addText(item.detail, {
      x: 0.72, y: cardY + 0.5, w: 11.6, h: 0.45,
      fontSize: 13, bold: false, color: colors.midGray,
      fontFace: fonts.body,
      align: 'left',
      valign: 'top',
    });
  });

  // CTA callback line — echoes opening ("same team, same energy")
  slide5.addText('Same team, same energy.  Full spec in Notion — ask your PM for the link.', {
    x: 0.5, y: 6.6, w: 12.33, h: 0.5,
    fontSize: 14, bold: true, color: colors.teal,
    fontFace: fonts.body,
    align: 'center',
    valign: 'middle',
  });

  slide5.addNotes(notes5);
};
