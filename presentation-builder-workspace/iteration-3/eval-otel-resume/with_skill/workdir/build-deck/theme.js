/**
 * theme.js — OTel Migration Deck
 *
 * Translates style-guide.md into pptxgenjs constants and helpers.
 * Colors: Deep Navy 1B2A4A | Steel Blue 2D6A9F | Signal Teal 00B4D8
 *         Cloud White F8FAFC | Ice White E8F4FD | Slate 1E3A5F
 *         Moss Green 2D7D46 | Amber D97706 | Coral DC3545
 *
 * pptxgenjs rules:
 *   - NEVER use # in hex colors — causes file corruption
 *   - NEVER reuse option objects — pptxgenjs mutates them
 *   - Use bullet:true not unicode bullets
 *   - Use breakLine:true between text array items
 */

const path = require('path');

// ---------------------------------------------------------------------------
// Color constants (no # prefix)
// ---------------------------------------------------------------------------
const colors = {
  deepNavy:    '1B2A4A',
  steelBlue:   '2D6A9F',
  signalTeal:  '00B4D8',
  cloudWhite:  'F8FAFC',
  iceWhite:    'E8F4FD',
  slate:       '1E3A5F',
  mossGreen:   '2D7D46',
  amber:       'D97706',
  coral:       'DC3545',
  lightGray:   'E2E8F0',
  black:       '000000',
  white:       'FFFFFF',
};

// ---------------------------------------------------------------------------
// Font constants
// ---------------------------------------------------------------------------
const fonts = {
  title:  'Calibri',
  body:   'Calibri',
  code:   'Consolas',
};

// ---------------------------------------------------------------------------
// Image path prefix (relative to build-deck/ — pptxgenjs resolves from cwd)
// ---------------------------------------------------------------------------
const IMG = path.resolve(__dirname, '../images');

// ---------------------------------------------------------------------------
// Shadow factory functions (avoid mutation bugs)
// ---------------------------------------------------------------------------
function makeShadow() {
  return { type: 'outer', color: '00000040', blur: 6, offset: 3, angle: 45, opacity: 0.25 };
}

function makeCardShadow() {
  return { type: 'outer', color: '00000020', blur: 4, offset: 2, angle: 45, opacity: 0.15 };
}

// ---------------------------------------------------------------------------
// Top accent bar (Signal Teal bar, full width, 0.05in height at top)
// ---------------------------------------------------------------------------
function addAccentBar(slide) {
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: 0.05,
    fill: { color: colors.signalTeal },
    line: { color: colors.signalTeal },
  });
}

// ---------------------------------------------------------------------------
// Bottom section label strip
// ---------------------------------------------------------------------------
function addBottomStrip(slide, sectionLabel) {
  slide.addShape('rect', {
    x: 0, y: 7.2, w: '100%', h: 0.3,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  slide.addText(sectionLabel, {
    x: 0.2, y: 7.22, w: 9, h: 0.25,
    fontSize: 9, color: colors.iceWhite, fontFace: fonts.body,
  });
}

// ---------------------------------------------------------------------------
// Dark section divider slide
// ---------------------------------------------------------------------------
function addDividerSlide(pres, { title, subtitle, sectionNum, speakerNotes, imagePath }) {
  const slide = pres.addSlide();
  // Full-bleed dark background
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  // Hero image (if provided and file exists — guarded for missing Phase 6 images)
  if (imagePath) {
    try {
      const fs = require('fs');
      if (fs.existsSync(imagePath)) {
        slide.addImage({ path: imagePath, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover' } });
        // Navy overlay
        slide.addShape('rect', {
          x: 0, y: 0, w: '100%', h: '100%',
          fill: { color: colors.deepNavy, transparency: 45 },
          line: { color: colors.deepNavy },
        });
      }
    } catch (e) { /* image missing — render dark slide without image */ }
  }
  // Section number pill
  if (sectionNum) {
    slide.addText(`SECTION ${sectionNum}`, {
      x: 0.4, y: 0.3, w: 1.8, h: 0.35,
      fontSize: 11, color: colors.signalTeal, fontFace: fonts.title,
      bold: true, align: 'left',
    });
  }
  // Title
  slide.addText(title, {
    x: 0.4, y: 2.8, w: 9, h: 1.8,
    fontSize: 40, color: colors.iceWhite, fontFace: fonts.title,
    bold: true, align: 'left', valign: 'middle',
    shadow: makeShadow(),
  });
  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.4, y: 4.7, w: 9, h: 0.5,
      fontSize: 18, color: colors.signalTeal, fontFace: fonts.body,
      align: 'left',
    });
  }
  // Progress dots (1-5)
  if (sectionNum) {
    const totalSections = 5;
    const dotSize = 0.12;
    const spacing = 0.22;
    const startX = 9.2 - (totalSections * spacing);
    for (let i = 1; i <= totalSections; i++) {
      const filled = i < sectionNum ? colors.steelBlue : i === sectionNum ? colors.signalTeal : null;
      if (filled) {
        slide.addShape('ellipse', {
          x: startX + (i - 1) * spacing, y: 7.0, w: dotSize, h: dotSize,
          fill: { color: filled },
          line: { color: filled },
        });
      } else {
        slide.addShape('ellipse', {
          x: startX + (i - 1) * spacing, y: 7.0, w: dotSize, h: dotSize,
          fill: { type: 'none' },
          line: { color: colors.iceWhite, width: 1 },
        });
      }
    }
  }
  if (speakerNotes) slide.addNotes(speakerNotes);
  return slide;
}

// ---------------------------------------------------------------------------
// Light content slide
// ---------------------------------------------------------------------------
function addContentSlide(pres, { title, sectionLabel, speakerNotes }) {
  const slide = pres.addSlide();
  // Background
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: colors.cloudWhite },
    line: { color: colors.cloudWhite },
  });
  addAccentBar(slide);
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.18, w: 9, h: 0.75,
    fontSize: 28, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left', valign: 'middle',
  });
  if (sectionLabel) addBottomStrip(slide, sectionLabel);
  if (speakerNotes) slide.addNotes(speakerNotes);
  return slide;
}

// ---------------------------------------------------------------------------
// Card with left accent border
// ---------------------------------------------------------------------------
function addCard(slide, { x, y, w, h, accentColor, title, bodyText, titleSize, bodySize }) {
  accentColor = accentColor || colors.signalTeal;
  titleSize = titleSize || 13;
  bodySize = bodySize || 11;
  // Card background
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: colors.white },
    line: { color: colors.lightGray, width: 0.5 },
    shadow: makeCardShadow(),
  });
  // Left accent border
  slide.addShape('rect', {
    x, y, w: 0.06, h,
    fill: { color: accentColor },
    line: { color: accentColor },
  });
  // Title
  if (title) {
    slide.addText(title, {
      x: x + 0.15, y: y + 0.1, w: w - 0.25, h: 0.28,
      fontSize: titleSize, color: colors.slate, fontFace: fonts.title,
      bold: true, align: 'left',
    });
  }
  // Body text (array of strings → bullet-separated)
  if (bodyText) {
    const items = Array.isArray(bodyText) ? bodyText : [bodyText];
    slide.addText(
      items.map((t, i) => [
        { text: t, options: { bullet: true, fontSize: bodySize, color: colors.slate, fontFace: fonts.body } },
        ...(i < items.length - 1 ? [{ text: '', options: { breakLine: true } }] : []),
      ]).flat(),
      { x: x + 0.15, y: title ? y + 0.42 : y + 0.1, w: w - 0.25, h: h - (title ? 0.52 : 0.2), valign: 'top' }
    );
  }
}

// ---------------------------------------------------------------------------
// Stat callout: big number + label
// ---------------------------------------------------------------------------
function addStat(slide, { x, y, number, label, context, color }) {
  color = color || colors.signalTeal;
  slide.addText(number, {
    x, y, w: 2.8, h: 0.9,
    fontSize: 54, color, fontFace: fonts.title,
    bold: true, align: 'center',
  });
  slide.addText(label, {
    x, y: y + 0.85, w: 2.8, h: 0.35,
    fontSize: 13, color: colors.steelBlue, fontFace: fonts.body,
    bold: true, align: 'center',
  });
  if (context) {
    slide.addText(context, {
      x, y: y + 1.22, w: 2.8, h: 0.4,
      fontSize: 10, color: colors.slate, fontFace: fonts.body,
      align: 'center', italic: true,
    });
  }
}

// ---------------------------------------------------------------------------
// Code block
// ---------------------------------------------------------------------------
function addCode(slide, { x, y, w, h, code }) {
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: colors.slate },
    line: { color: colors.slate },
  });
  slide.addText(code, {
    x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
    fontSize: 11, color: colors.iceWhite, fontFace: fonts.code,
    align: 'left', valign: 'top',
  });
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  colors,
  fonts,
  IMG,
  makeShadow,
  makeCardShadow,
  addAccentBar,
  addBottomStrip,
  addDividerSlide,
  addContentSlide,
  addCard,
  addStat,
  addCode,
};
