//
// theme.js — Auth Migration All-Hands Talk
// Translates style-guide.md into pptxgenjs constants and helpers.
//
// Style guide: Midnight Executive palette
// Colors: no # prefix (pptxgenjs requirement)

"use strict";

const path = require("path");

// ---------------------------------------------------------------------------
// Color constants
// ---------------------------------------------------------------------------
const colors = {
  navy:       "1E2761",   // Primary — dark slide backgrounds
  iceBlue:    "CADCFC",   // Secondary — accent text on dark slides
  teal:       "0891B2",   // Accent — stats, highlights, borders
  offWhite:   "F8F9FC",   // Content slide backgrounds
  white:      "FFFFFF",   // Text on dark slides
  codeBg:     "2D2D2D",   // Code block backgrounds
  success:    "16A34A",   // Completed action items
  warning:    "D97706",   // Caveats / unconfirmed figures
  danger:     "DC2626",   // Incident severity, critical markers
  gray:       "6B7280",   // Captions only
};

// ---------------------------------------------------------------------------
// Font constants
// ---------------------------------------------------------------------------
const fonts = {
  title:  "Calibri",
  body:   "Calibri",
  code:   "Courier New",
};

// ---------------------------------------------------------------------------
// Image path helper
// ---------------------------------------------------------------------------
const IMG = path.resolve(__dirname, "../images");

function imgPath(filename) {
  return path.join(IMG, filename);
}

// ---------------------------------------------------------------------------
// Shadow factory functions (avoid pptxgenjs option mutation bug)
// ---------------------------------------------------------------------------
function makeShadow() {
  return { type: "outer", color: "000000", opacity: 0.18, blur: 6, offset: 2, angle: 45 };
}

function makeCardShadow() {
  return { type: "outer", color: "000000", opacity: 0.10, blur: 4, offset: 1, angle: 45 };
}

// ---------------------------------------------------------------------------
// Slide helpers
// ---------------------------------------------------------------------------

/**
 * Add a dark (navy) section divider slide.
 * @param {object} pres - pptxgenjs presentation instance
 * @param {object} opts
 *   title        {string}  - large title text
 *   subtitle     {string}  - subtitle / tagline (optional)
 *   imagePath    {string}  - full path to bg image (optional)
 *   sectionIndex {number}  - 0-based index for progress indicator (0–4)
 *   speakerNotes {string}  - full speaker notes text
 * @returns {object} slide
 */
function addDividerSlide(pres, { title, subtitle = "", imagePath = null, sectionIndex = 0, speakerNotes = "" }) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: colors.navy };

  // Optional hero image (right half)
  if (imagePath) {
    try {
      slide.addImage({ path: imagePath, x: 5.5, y: 0, w: 4.5, h: 7.5, sizing: { type: "cover" }, transparency: 30 });
    } catch (e) {
      console.warn(`[WARN] Image not found, skipping: ${imagePath}`);
    }
  }

  // Title
  slide.addText(title, {
    x: 0.5, y: 2.5, w: 9, h: 1.4,
    fontSize: 40, bold: true, color: colors.white,
    fontFace: fonts.title, align: "left",
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 4.0, w: 8, h: 0.6,
      fontSize: 20, bold: false, color: colors.iceBlue,
      fontFace: fonts.body, align: "left",
    });
  }

  // Progress row (bottom of slide)
  const sections = ["Legacy Pain", "What We Built", "The Incident", "Lessons", "Close"];
  const progressText = sections.map((s, i) => (i < sectionIndex ? "● " : i === sectionIndex ? "◉ " : "○ ") + s).join("  ");
  slide.addText(progressText, {
    x: 0.5, y: 7.0, w: 9, h: 0.35,
    fontSize: 10, color: colors.iceBlue, fontFace: fonts.body, align: "left",
  });

  // Speaker notes
  if (speakerNotes) {
    slide.addNotes(speakerNotes);
  }

  return slide;
}

/**
 * Add a light (off-white) content slide with a title.
 * @param {object} pres
 * @param {object} opts
 *   title        {string}
 *   speakerNotes {string}
 * @returns {object} slide
 */
function addContentSlide(pres, { title, speakerNotes = "" }) {
  const slide = pres.addSlide();

  slide.background = { color: colors.offWhite };

  // Title
  slide.addText(title, {
    x: 0.5, y: 0.25, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: colors.navy,
    fontFace: fonts.title, align: "left",
  });

  // Teal underline accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 9, h: 0.05,
    fill: { color: colors.teal }, line: { color: colors.teal },
  });

  if (speakerNotes) {
    slide.addNotes(speakerNotes);
  }

  return slide;
}

/**
 * Add a card with a left accent border.
 * @param {object} slide
 * @param {object} pres
 * @param {object} opts - x, y, w, h, accentColor (default teal)
 */
function addCard(slide, pres, { x, y, w, h, accentColor = null }) {
  const ac = accentColor || colors.teal;

  // Card background
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: colors.white },
    line: { color: "E5E7EB", width: 1 },
    shadow: makeCardShadow(),
  });

  // Left accent border
  slide.addShape(pres.ShapeType.rect, {
    x, y, w: 0.05, h,
    fill: { color: ac },
    line: { color: ac },
  });
}

/**
 * Add a big stat callout (number + label).
 * @param {object} slide
 * @param {object} opts - x, y, number, label, color
 */
function addStat(slide, { x, y, number, label, color = null }) {
  const c = color || colors.teal;

  slide.addText(String(number), {
    x, y, w: 2, h: 0.9,
    fontSize: 52, bold: true, color: c,
    fontFace: fonts.title, align: "center",
  });
  slide.addText(label, {
    x, y: y + 0.85, w: 2, h: 0.35,
    fontSize: 13, bold: false, color: colors.navy,
    fontFace: fonts.body, align: "center",
  });
}

/**
 * Add a dark code block.
 * @param {object} slide
 * @param {object} pres
 * @param {object} opts - x, y, w, h, code (string)
 */
function addCode(slide, pres, { x, y, w, h, code }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: colors.codeBg },
    line: { color: colors.codeBg },
    rectRadius: 0.08,
  });
  slide.addText(code, {
    x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
    fontSize: 12, fontFace: fonts.code, color: colors.iceBlue,
    valign: "top",
  });
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  colors,
  fonts,
  IMG,
  imgPath,
  makeShadow,
  makeCardShadow,
  addDividerSlide,
  addContentSlide,
  addCard,
  addStat,
  addCode,
};
