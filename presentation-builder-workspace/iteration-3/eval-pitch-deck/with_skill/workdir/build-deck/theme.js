// theme.js — FitLoop Pitch Deck
// Translates style-guide.md into pptxgenjs constants and helpers.
// NOTE: NO '#' prefix on hex colors — pptxgenjs requirement.

'use strict';

const path = require('path');

// ─── Color Palette ────────────────────────────────────────────────────────────
const colors = {
  coral:      'F96167',   // Primary accent — borders, highlights, CTAs
  navy:       '2F3C7E',   // Dark slide backgrounds, section dividers
  gold:       'F9E795',   // Stat hero highlight background
  offWhite:   'FAFAFA',   // Content slide background
  white:      'FFFFFF',   // Text on dark slides
  charcoal:   '222222',   // Body text on light slides
  grey:       '555555',   // Captions, labels, secondary text
  success:    '4CAF50',   // "What we have" — close slide
  warning:    'FFA726',   // "What we're figuring out" — close slide
  darkNavy:   '1A2458',   // Title slide gradient end
};

// ─── Fonts ────────────────────────────────────────────────────────────────────
const fonts = {
  title:  'Montserrat',
  body:   'Open Sans',
  code:   'Consolas',
};

// ─── Image Paths ──────────────────────────────────────────────────────────────
const IMG = path.join(__dirname, '..', 'images');

// ─── Slide Dimensions (pptxgenjs default 16:9 = 10 x 5.625 inches) ───────────
const W = 10;   // slide width inches
const H = 5.625; // slide height inches

// ─── Shadow Factories (NEVER reuse option objects — pptxgenjs mutates them) ──
function makeShadow() {
  return { type: 'outer', color: '000000', opacity: 0.3, blur: 6, offset: 3, angle: 45 };
}
function makeCardShadow() {
  return { type: 'outer', color: '000000', opacity: 0.12, blur: 4, offset: 2, angle: 45 };
}

// ─── Helper: Dark Section Divider Slide ───────────────────────────────────────
// Used for: Slides 1 (hook), 3 (problem), 5 (why now), 6 (product), 8 (traction), 11 (ask), 12 (close)
function addDividerSlide(pres, { title, subtitle, imagePath, speakerNotes }) {
  const slide = pres.addSlide();

  // Dark navy background
  slide.background = { color: colors.navy };

  // Optional full-bleed background image (dark slides)
  if (imagePath) {
    try {
      slide.addImage({ path: imagePath, x: 0, y: 0, w: W, h: H, transparency: 55 });
    } catch (e) {
      // Image missing (Phase 6 blocked) — continue without image
    }
  }

  // Title
  slide.addText(title, {
    x: 0.5,
    y: H / 2 - 0.7,
    w: W - 1,
    h: 0.8,
    fontSize: 40,
    fontFace: fonts.title,
    bold: true,
    color: colors.white,
    align: 'center',
  });

  // Optional subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5,
      y: H / 2 + 0.15,
      w: W - 1,
      h: 0.5,
      fontSize: 20,
      fontFace: fonts.title,
      bold: false,
      color: colors.coral,
      align: 'center',
    });
  }

  // Speaker notes
  if (speakerNotes) {
    slide.addNotes(speakerNotes);
  }

  return slide;
}

// ─── Helper: Light Content Slide (returns slide for further decoration) ───────
function addContentSlide(pres, { title, speakerNotes }) {
  const slide = pres.addSlide();

  // Off-white background
  slide.background = { color: colors.offWhite };

  // Title bar with coral left accent
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.07,
    h: 0.85,
    fill: { color: colors.coral },
    line: { type: 'none' },
  });

  slide.addText(title, {
    x: 0.25,
    y: 0.12,
    w: W - 0.5,
    h: 0.6,
    fontSize: 32,
    fontFace: fonts.title,
    bold: true,
    color: colors.charcoal,
    align: 'left',
  });

  // Thin separator line below title (thin rect — pptxgenjs line ShapeType not reliable)
  slide.addShape(pres.ShapeType.rect, {
    x: 0.25,
    y: 0.82,
    w: W - 0.5,
    h: 0.01,
    fill: { color: colors.coral },
    line: { type: 'none' },
  });

  if (speakerNotes) {
    slide.addNotes(speakerNotes);
  }

  return slide;
}

// ─── Helper: Accent Card ──────────────────────────────────────────────────────
function addCard(slide, pres, { x, y, w, h, accentColor }) {
  const accent = accentColor || colors.coral;

  // White card body
  slide.addShape(pres.ShapeType.rect, {
    x: x + 0.07,
    y,
    w: w - 0.07,
    h,
    fill: { color: colors.white },
    line: { type: 'none' },
    shadow: makeCardShadow(),
  });

  // Left accent border
  slide.addShape(pres.ShapeType.rect, {
    x,
    y,
    w: 0.07,
    h,
    fill: { color: accent },
    line: { type: 'none' },
  });
}

// ─── Helper: Big Stat Callout ─────────────────────────────────────────────────
function addStat(slide, { x, y, number, label, contextNote, isHero, pres }) {
  const bgColor = isHero ? colors.gold : colors.white;
  const numColor = isHero ? colors.navy : colors.coral;
  const blockW = 2.1;
  const blockH = 2.3;

  // Card background
  if (pres) {
    slide.addShape(pres.ShapeType.rect, {
      x,
      y,
      w: blockW,
      h: blockH,
      fill: { color: bgColor },
      line: { type: 'none' },
      shadow: makeCardShadow(),
    });
  }

  // Big number
  slide.addText(number, {
    x: x + 0.1,
    y: y + 0.2,
    w: blockW - 0.2,
    h: 1.0,
    fontSize: 54,
    fontFace: fonts.title,
    bold: true,
    color: numColor,
    align: 'center',
  });

  // Label
  slide.addText(label, {
    x: x + 0.1,
    y: y + 1.2,
    w: blockW - 0.2,
    h: 0.4,
    fontSize: 13,
    fontFace: fonts.body,
    bold: true,
    color: colors.grey,
    align: 'center',
  });

  // Context note
  if (contextNote) {
    slide.addText(contextNote, {
      x: x + 0.05,
      y: y + 1.65,
      w: blockW - 0.1,
      h: 0.5,
      fontSize: 11,
      fontFace: fonts.body,
      bold: false,
      color: colors.grey,
      align: 'center',
    });
  }
}

// ─── Helper: Traction Callback Badge (appears bottom-right) ─────────────────
function addTractionBadge(slide, pres) {
  slide.addShape(pres.ShapeType.rect, {
    x: W - 2.2,
    y: H - 0.55,
    w: 2.0,
    h: 0.42,
    fill: { color: colors.coral },
    line: { type: 'none' },
  });
  slide.addText('72% retention · 9 wks', {
    x: W - 2.2,
    y: H - 0.55,
    w: 2.0,
    h: 0.42,
    fontSize: 10,
    fontFace: fonts.body,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
  });
}

module.exports = {
  colors,
  fonts,
  IMG,
  W,
  H,
  makeShadow,
  makeCardShadow,
  addDividerSlide,
  addContentSlide,
  addCard,
  addStat,
  addTractionBadge,
};
