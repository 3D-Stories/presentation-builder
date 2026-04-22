const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();

// Slide dimensions: 10" x 5.625" (widescreen 16:9)
pptx.layout = 'LAYOUT_WIDE';

// ── Shared theme ──────────────────────────────────────────────
const BG        = '1A1A2E';   // deep navy
const ACCENT    = '00D4AA';   // teal-green
const WHITE     = 'FFFFFF';
const SUBTEXT   = 'B0B8C8';   // muted slate
const CARD_BG   = '242440';   // slightly lighter navy for cards

const FONT = 'Calibri';

// Helper: slide with standard background
function makeSlide() {
  const s = pptx.addSlide();
  s.background = { color: BG };
  return s;
}

// Helper: accent line (horizontal rule under title)
function accentLine(slide, y) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.4, y: y, w: 1.2, h: 0.05,
    fill: { color: ACCENT },
    line: { color: ACCENT }
  });
}

// Helper: bullet card
function addCard(slide, x, y, w, h, title, bullets) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: CARD_BG },
    line: { color: ACCENT, width: 1 },
    rectRadius: 0.08
  });
  slide.addText(title, {
    x: x + 0.18, y: y + 0.15, w: w - 0.36, h: 0.35,
    fontSize: 13,
    bold: true,
    color: ACCENT,
    fontFace: FONT
  });
  const bulletLines = bullets.map(b => ({
    text: b,
    options: { bullet: { type: 'bullet' }, color: WHITE, fontSize: 11.5, fontFace: FONT, breakLine: true }
  }));
  slide.addText(bulletLines, {
    x: x + 0.18, y: y + 0.52, w: w - 0.36, h: h - 0.65,
    valign: 'top'
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ════════════════════════════════════════════════════════════════
{
  const s = makeSlide();

  // Large accent rectangle on left edge
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color: ACCENT },
    line: { color: ACCENT }
  });

  s.addText('Q4 Website Redesign', {
    x: 0.55, y: 1.5, w: 8.9, h: 0.85,
    fontSize: 42,
    bold: true,
    color: WHITE,
    fontFace: FONT
  });

  s.addText('What We Shipped', {
    x: 0.55, y: 2.38, w: 8.9, h: 0.55,
    fontSize: 30,
    color: ACCENT,
    fontFace: FONT
  });

  s.addText('Standup Update  ·  April 21, 2026', {
    x: 0.55, y: 3.1, w: 8.9, h: 0.35,
    fontSize: 14,
    color: SUBTEXT,
    fontFace: FONT
  });

  s.addText('Just the highlights — quick one today', {
    x: 0.55, y: 4.7, w: 8.9, h: 0.3,
    fontSize: 11,
    italic: true,
    color: SUBTEXT,
    fontFace: FONT
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2 — Homepage + Navigation
// ════════════════════════════════════════════════════════════════
{
  const s = makeSlide();

  s.addText('Homepage + Navigation', {
    x: 0.4, y: 0.35, w: 9.2, h: 0.6,
    fontSize: 28,
    bold: true,
    color: WHITE,
    fontFace: FONT
  });
  accentLine(s, 1.0);

  // Icon-style number badge
  const items = [
    { num: '01', head: 'New Hero Section', body: 'Full-width video background, cleaner CTA above the fold. Copywriting refresh done.' },
    { num: '02', head: 'Simplified Top Nav', body: 'Mega-menu gone. Flat 5-item nav with dropdown. Mobile-first approach.' },
    { num: '03', head: 'Faster First Load', body: 'LCP dropped 60% — hero image lazy-loaded & CDN cached.' }
  ];

  items.forEach((item, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.25, w: 2.9, h: 3.7,
      fill: { color: CARD_BG },
      line: { color: ACCENT, width: 1 }
    });
    s.addText(item.num, {
      x: x + 0.15, y: 1.38, w: 0.55, h: 0.45,
      fontSize: 22,
      bold: true,
      color: ACCENT,
      fontFace: FONT
    });
    s.addText(item.head, {
      x: x + 0.15, y: 1.88, w: 2.6, h: 0.38,
      fontSize: 13,
      bold: true,
      color: WHITE,
      fontFace: FONT
    });
    s.addText(item.body, {
      x: x + 0.15, y: 2.3, w: 2.6, h: 2.4,
      fontSize: 11.5,
      color: SUBTEXT,
      fontFace: FONT,
      valign: 'top',
      wrap: true
    });
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 — Product Detail Pages
// ════════════════════════════════════════════════════════════════
{
  const s = makeSlide();

  s.addText('Product Detail Pages', {
    x: 0.4, y: 0.35, w: 9.2, h: 0.6,
    fontSize: 28,
    bold: true,
    color: WHITE,
    fontFace: FONT
  });
  accentLine(s, 1.0);

  // Left column: what shipped
  addCard(s, 0.4, 1.25, 5.6, 3.7, 'What Shipped', [
    'New swipeable image gallery — up to 12 product photos',
    'Redesigned specs table — scannable, collapsible sections',
    'Social proof section added below the fold (reviews + Q&A)',
    'Sticky Add-to-Cart bar on scroll',
    'Breadcrumb nav standardized across all 3,200+ PDPs'
  ]);

  // Right column: impact
  addCard(s, 6.2, 1.25, 3.4, 3.7, 'Early Signal', [
    '↑ 12% avg time on PDP',
    '↓ 8% bounce from PDP',
    'Gallery used by 64% of sessions',
    'Review module load ✓ all browsers'
  ]);
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 — Checkout Flow
// ════════════════════════════════════════════════════════════════
{
  const s = makeSlide();

  s.addText('Checkout Flow', {
    x: 0.4, y: 0.35, w: 9.2, h: 0.6,
    fontSize: 28,
    bold: true,
    color: WHITE,
    fontFace: FONT
  });
  accentLine(s, 1.0);

  // Big highlight stat
  s.addShape(pptx.ShapeType.rect, {
    x: 0.4, y: 1.25, w: 4.0, h: 2.0,
    fill: { color: CARD_BG },
    line: { color: ACCENT, width: 2 }
  });
  s.addText('+18%', {
    x: 0.4, y: 1.38, w: 4.0, h: 1.0,
    fontSize: 52,
    bold: true,
    color: ACCENT,
    align: 'center',
    fontFace: FONT
  });
  s.addText('Conversion lift (early data, first 2 weeks)', {
    x: 0.4, y: 2.42, w: 4.0, h: 0.5,
    fontSize: 11,
    color: SUBTEXT,
    align: 'center',
    fontFace: FONT
  });

  // Steps reduction
  s.addShape(pptx.ShapeType.rect, {
    x: 0.4, y: 3.45, w: 4.0, h: 1.5,
    fill: { color: CARD_BG },
    line: { color: ACCENT, width: 1 }
  });
  s.addText('5 steps  →  3 steps', {
    x: 0.4, y: 3.58, w: 4.0, h: 0.5,
    fontSize: 18,
    bold: true,
    color: WHITE,
    align: 'center',
    fontFace: FONT
  });
  s.addText('Address + shipping collapsed\nPayment & review merged', {
    x: 0.4, y: 4.1, w: 4.0, h: 0.7,
    fontSize: 11,
    color: SUBTEXT,
    align: 'center',
    fontFace: FONT
  });

  // Right: what shipped
  addCard(s, 4.6, 1.25, 5.0, 3.7, 'What Shipped', [
    'Apple Pay + Google Pay — one-tap on mobile',
    'Guest checkout now default (account creation opt-in)',
    'Order summary always visible in sidebar',
    'Real-time address validation (no more failed submissions)',
    'Cart abandonment email trigger integrated'
  ]);
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 — Performance + What's Next
// ════════════════════════════════════════════════════════════════
{
  const s = makeSlide();

  s.addText('Performance + What\'s Next', {
    x: 0.4, y: 0.35, w: 9.2, h: 0.6,
    fontSize: 28,
    bold: true,
    color: WHITE,
    fontFace: FONT
  });
  accentLine(s, 1.0);

  // Performance metrics row
  const metrics = [
    { label: 'LCP', before: '4.2s', after: '1.8s', color: ACCENT },
    { label: 'CLS', before: '0.28', after: '0.04', color: ACCENT },
    { label: 'INP', before: '380ms', after: '110ms', color: ACCENT },
    { label: 'PageSpeed', before: '52', after: '91', color: ACCENT }
  ];

  metrics.forEach((m, i) => {
    const x = 0.4 + i * 2.4;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.25, w: 2.1, h: 1.8,
      fill: { color: CARD_BG },
      line: { color: m.color, width: 1 }
    });
    s.addText(m.label, {
      x, y: 1.32, w: 2.1, h: 0.3,
      fontSize: 11,
      color: SUBTEXT,
      align: 'center',
      fontFace: FONT
    });
    s.addText(m.after, {
      x, y: 1.65, w: 2.1, h: 0.55,
      fontSize: 26,
      bold: true,
      color: m.color,
      align: 'center',
      fontFace: FONT
    });
    s.addText(`was ${m.before}`, {
      x, y: 2.2, w: 2.1, h: 0.3,
      fontSize: 10,
      color: SUBTEXT,
      align: 'center',
      fontFace: FONT,
      strike: false
    });
  });

  // What's next
  addCard(s, 0.4, 3.25, 4.5, 2.0, 'Still In Flight', [
    'Mobile nav polish (sticky header edge cases)',
    'Dark mode toggle — pushed to Q1',
    'Search bar redesign — in design review'
  ]);

  addCard(s, 5.1, 3.25, 4.5, 2.0, 'Coming Up', [
    'Post-launch analytics review — next week',
    'A/B test: PDP hero image vs video',
    'Retro scheduled for Thursday'
  ]);
}

// ── Write output ──────────────────────────────────────────────
const OUT = '/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-3/eval-team-update/without_skill/outputs/team-update-q4-redesign.pptx';

pptx.writeFile({ fileName: OUT })
  .then(() => console.log('Done:', OUT))
  .catch(e => { console.error(e); process.exit(1); });
