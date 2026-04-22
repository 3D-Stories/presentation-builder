// slides-s1.js — Section 1: Hook (Slides 1–2)
// "The Number That Shouldn't Exist"
// Duration: ~2 min | 2 slides

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addTractionBadge, makeCardShadow } = require('./theme');

module.exports = function buildSection1(pres) {

  // ── Slide 1: The Hook — Cold open, no company name ────────────────────────
  const s1 = pres.addSlide();
  s1.background = { color: colors.navy };

  // Optional background image (dark)
  try {
    s1.addImage({ path: path.join(IMG, '01-hook-stat.jpg'), x: 0, y: 0, w: W, h: H, transparency: 50 });
  } catch (e) { /* image absent — continue */ }

  // The giant number — hero of the slide
  s1.addText('72%', {
    x: 0,
    y: 1.2,
    w: W,
    h: 1.8,
    fontSize: 120,
    fontFace: fonts.title,
    bold: true,
    color: colors.coral,
    align: 'center',
  });

  // Subtitle — the context that begs the question
  s1.addText('week-4 retention.  9 weeks in.  340 users.', {
    x: 1,
    y: 3.2,
    w: W - 2,
    h: 0.5,
    fontSize: 20,
    fontFace: fonts.body,
    bold: false,
    color: colors.white,
    align: 'center',
  });

  // Category benchmark — context whisper
  s1.addText('(Category benchmark: 15–20%)', {
    x: 2,
    y: 3.8,
    w: W - 4,
    h: 0.4,
    fontSize: 14,
    fontFace: fonts.body,
    bold: false,
    color: colors.gold,
    align: 'center',
  });

  s1.addNotes(`TALKING POINTS:
• [No introduction yet — let the number breathe for 3 seconds before speaking.]
• "Seventy-two percent."
• "That's week-four retention. Nine weeks into beta. Three hundred and forty users."
• [PAUSE — let them absorb it]
• "The category benchmark is fifteen to twenty percent."
• [PAUSE]
• "How?"

DEFINITION READY (if challenged before Slide 2):
• "Week-4 retention = user opened app and logged at least one session in their fourth week of usage."
• "Active user = opened app at least once in the last 7 days."
• "These are real TestFlight users — closed beta, invitation-only."

HANDLE EARLY INTERRUPTION:
• If a VC asks "whose deck is this?" before you click — smile and say: "Give me ten seconds — that's the reveal." The Slide 2 reveal is worth protecting.

PACING:
[~1 min. Slow. The silence is intentional. Do not rush past this slide.]

TRANSITION:
"Before I explain it — let me show you what we built." [CLICK]`);

  // ── Slide 2: Company Reveal — FitLoop ─────────────────────────────────────
  const s2 = pres.addSlide();
  s2.background = { color: colors.navy };

  // Background image (dark)
  try {
    s2.addImage({ path: path.join(IMG, '02-title-reveal.jpg'), x: 0, y: 0, w: W, h: H, transparency: 55 });
  } catch (e) { /* image absent — continue */ }

  // Company name — the reveal
  s2.addText('FitLoop', {
    x: 0.5,
    y: 1.0,
    w: W - 1,
    h: 1.2,
    fontSize: 72,
    fontFace: fonts.title,
    bold: true,
    color: colors.white,
    align: 'center',
  });

  // Tagline
  s2.addText('Real-time form coaching. On-device.', {
    x: 1,
    y: 2.4,
    w: W - 2,
    h: 0.5,
    fontSize: 22,
    fontFace: fonts.title,
    bold: false,
    color: colors.coral,
    align: 'center',
  });

  // Beta badge
  s2.addShape(pres.ShapeType.rect, {
    x: W / 2 - 1.3,
    y: 3.1,
    w: 2.6,
    h: 0.45,
    fill: { color: colors.gold },
    line: { type: 'none' },
    shadow: makeCardShadow(),
  });
  s2.addText('Closed Beta · TestFlight · 2026', {
    x: W / 2 - 1.3,
    y: 3.1,
    w: 2.6,
    h: 0.45,
    fontSize: 13,
    fontFace: fonts.body,
    bold: true,
    color: colors.navy,
    align: 'center',
    valign: 'middle',
  });

  // Traction callback badge
  addTractionBadge(s2, pres);

  s2.addNotes(`TALKING POINTS:
• "FitLoop."
• "We're nine weeks into a closed beta. Here's what we built — and here's why that number makes sense."
• "Real-time form coaching. On-device. No video leaves your phone."
• [Point to tagline] "Two hundred words or fewer — that's the product. The rest is proof."

PACING:
[~1 min. The name reveal after the cold open creates a beat. Let it land before moving.]

TRANSITION:
"Before we explain the number, you need to understand the problem it's solving." [CLICK]`);
};
