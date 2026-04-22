/**
 * theme.js — Q4 Website Redesign Team Update
 * Style guide: Charcoal Minimal, text-only, 5-slide standup deck
 * pptxgenjs: no '#' in hex colors, use factory functions for options objects
 */

'use strict';

// ---------------------------------------------------------------------------
// Color palette (no '#' prefix — pptxgenjs requirement)
// ---------------------------------------------------------------------------
const colors = {
  charcoal:   '36454F',   // Dark bg — title + divider slides
  offWhite:   'F2F2F2',   // Light bg — content slides
  teal:       '0D7377',   // Accent — cards, stat numbers, CTAs
  white:      'FFFFFF',   // Text on dark backgrounds
  nearBlack:  '212121',   // Text on light backgrounds
  midGray:    '9E9E9E',   // Captions, labels, secondary text
  green:      '4CAF50',   // Positive metric callouts (optional)
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
const fonts = {
  title:  'Calibri',
  body:   'Calibri',
  code:   'Consolas',
};

// ---------------------------------------------------------------------------
// Shadow factory functions (never reuse the same options object in pptxgenjs)
// ---------------------------------------------------------------------------
function makeShadow() {
  return { type: 'outer', color: '000000', opacity: 0.15, blur: 4, offset: 2, angle: 45 };
}
function makeCardShadow() {
  return { type: 'outer', color: '000000', opacity: 0.08, blur: 3, offset: 1, angle: 45 };
}

// ---------------------------------------------------------------------------
// addDividerSlide — dark section divider / title slide
// opts: { title, subtitle, speakerNotes }
// ---------------------------------------------------------------------------
function addDividerSlide(pres, opts) {
  const slide = pres.addSlide();
  slide.background = { color: colors.charcoal };

  // Title
  slide.addText(opts.title, {
    x: 0.5, y: 2.5, w: 12.33, h: 1.2,
    fontSize: 40, bold: true, color: colors.white,
    fontFace: fonts.title,
    align: 'center',
    valign: 'middle',
  });

  // Subtitle (optional)
  if (opts.subtitle) {
    slide.addText(opts.subtitle, {
      x: 0.5, y: 3.8, w: 12.33, h: 0.6,
      fontSize: 20, bold: false, color: colors.midGray,
      fontFace: fonts.body,
      align: 'center',
      valign: 'middle',
    });
  }

  // Speaker notes
  if (opts.speakerNotes) {
    slide.addNotes(opts.speakerNotes);
  }

  return slide;
}

// ---------------------------------------------------------------------------
// addContentSlide — light content slide with title
// opts: { title, speakerNotes }
// Returns the slide for further content additions
// ---------------------------------------------------------------------------
function addContentSlide(pres, opts) {
  const slide = pres.addSlide();
  slide.background = { color: colors.offWhite };

  // Slide title
  slide.addText(opts.title, {
    x: 0.5, y: 0.35, w: 12.33, h: 0.8,
    fontSize: 28, bold: true, color: colors.nearBlack,
    fontFace: fonts.title,
    align: 'left',
    valign: 'middle',
  });

  // Teal underline accent bar below title
  slide.addShape(pres.ShapeType.RECTANGLE, {
    x: 0.5, y: 1.15, w: 12.33, h: 0.04,
    fill: { color: colors.teal },
    line: { width: 0 },
  });

  if (opts.speakerNotes) {
    slide.addNotes(opts.speakerNotes);
  }

  return slide;
}

// ---------------------------------------------------------------------------
// addCard — left-accent card for list items
// opts: { x, y, w, h, accentColor }
// Returns the card shapes added (for reference)
// ---------------------------------------------------------------------------
function addCard(slide, pres, opts) {
  const accentColor = opts.accentColor || colors.teal;
  const bg = opts.bgColor || colors.offWhite;

  // Card background (slightly lighter inset)
  slide.addShape(pres.ShapeType.RECTANGLE, {
    x: opts.x, y: opts.y, w: opts.w, h: opts.h,
    fill: { color: 'FFFFFF' },
    line: { width: 0 },
    shadow: makeCardShadow(),
  });

  // Left accent bar (3px teal vertical rule)
  slide.addShape(pres.ShapeType.RECTANGLE, {
    x: opts.x, y: opts.y, w: 0.06, h: opts.h,
    fill: { color: accentColor },
    line: { width: 0 },
  });
}

// ---------------------------------------------------------------------------
// addStat — big number + label callout
// opts: { x, y, w, h, number, label, color }
// ---------------------------------------------------------------------------
function addStat(slide, pres, opts) {
  const color = opts.color || colors.teal;

  // Stat background card
  slide.addShape(pres.ShapeType.RECTANGLE, {
    x: opts.x, y: opts.y, w: opts.w, h: opts.h,
    fill: { color: 'FFFFFF' },
    line: { width: 0 },
    shadow: makeCardShadow(),
  });

  // Big number
  slide.addText(opts.number, {
    x: opts.x, y: opts.y + 0.15, w: opts.w, h: opts.h * 0.55,
    fontSize: 48, bold: true, color: color,
    fontFace: fonts.title,
    align: 'center',
    valign: 'middle',
  });

  // Label below
  slide.addText(opts.label, {
    x: opts.x, y: opts.y + opts.h * 0.62, w: opts.w, h: opts.h * 0.38,
    fontSize: 13, bold: false, color: colors.midGray,
    fontFace: fonts.body,
    align: 'center',
    valign: 'top',
  });
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  colors,
  fonts,
  makeShadow,
  makeCardShadow,
  addDividerSlide,
  addContentSlide,
  addCard,
  addStat,
};
