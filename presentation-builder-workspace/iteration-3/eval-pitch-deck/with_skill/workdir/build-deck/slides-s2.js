// slides-s2.js — Section 2: Problem (Slides 3–4)
// "Bad Form Is a Silent Injury Factory"
// Duration: ~2.5 min | 2 slides

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addCard, makeCardShadow } = require('./theme');

module.exports = function buildSection2(pres) {

  // ── Slide 3: The Problem — The Feedback Gap ────────────────────────────────
  const s3 = pres.addSlide();
  s3.background = { color: colors.offWhite };

  // Coral left accent bar
  s3.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Title
  s3.addText('The Feedback Gap', {
    x: 0.25, y: 0.18, w: W - 0.5, h: 0.55,
    fontSize: 32, fontFace: fonts.title, bold: true,
    color: colors.charcoal, align: 'left',
  });

  // Separator (thin rect)
  s3.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 0.8, w: W - 0.5, h: 0.01,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Optional problem image (left side, light)
  try {
    s3.addImage({ path: path.join(IMG, '03-problem-gap.png'), x: 5.5, y: 1.0, w: 4.2, h: 3.8 });
  } catch (e) { /* image absent */ }

  // Three-column problem cards
  const cols = [
    { label: 'Personal Trainer', icon: '$$$', desc: 'Expensive. Requires scheduling.\nNot at every session.', color: colors.grey },
    { label: 'Reddit Form Check', icon: '⏱', desc: 'Async. Post a video. Wait a day.\nMaybe get useful feedback.', color: colors.grey },
    { label: 'Nothing', icon: '⚠', desc: 'Repetitions with unknown errors.\nInjury risk compounding silently.', color: colors.coral },
  ];

  cols.forEach(({ label, icon, desc, color }, i) => {
    const cx = 0.3 + i * 1.65;
    const cy = 1.05;

    addCard(s3, pres, { x: cx, y: cy, w: 1.55, h: 3.15, accentColor: color });

    s3.addText(icon, {
      x: cx + 0.15, y: cy + 0.15, w: 1.3, h: 0.45,
      fontSize: 22, fontFace: fonts.body,
      color: color, align: 'center',
    });

    s3.addText(label, {
      x: cx + 0.1, y: cy + 0.6, w: 1.35, h: 0.4,
      fontSize: 13, fontFace: fonts.title, bold: true,
      color: colors.charcoal, align: 'center',
    });

    s3.addText(desc, {
      x: cx + 0.1, y: cy + 1.05, w: 1.35, h: 1.9,
      fontSize: 11, fontFace: fonts.body,
      color: colors.grey, align: 'center',
    });
  });

  // "Nothing" card highlight text at bottom
  s3.addText('Most people choose nothing. Most injuries are from this column.', {
    x: 0.25, y: H - 0.7, w: 5, h: 0.5,
    fontSize: 12, fontFace: fonts.body, bold: false,
    color: colors.coral, align: 'left',
  });

  s3.addNotes(`TALKING POINTS:
• "Adults who lift regularly face a fundamental problem: they don't know if they're doing it right."
• "There are three options. A trainer — expensive, not always there. Reddit form-check — you film yourself, post it, wait a day, maybe get a useful reply."
• [Point to 'Nothing' card] "And then there's column three. Which is what most people choose."
• "Most gym injuries aren't acute. They're the result of hundreds of reps done slightly wrong."
• "YouTube gave everyone a program. No one gave them real-time correction."

[FOR PMs:] "Think about the last time you used an app that caught a behavior mistake in real time — not after the fact. That's the gap we're closing."

PACING:
[~1.5 min. The three columns should be gestured at. The 'Nothing' card is the emotional beat — pause there.]

TRANSITION:
"The feedback gap exists because the technology to close it didn't exist — until 2025." [CLICK]`);

  // ── Slide 4: User Voice — The Pull Quote ──────────────────────────────────
  const s4 = pres.addSlide();
  s4.background = { color: colors.offWhite };

  // Coral left accent
  s4.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Section label
  s4.addText('WHO WE BUILD FOR', {
    x: 0.25, y: 0.15, w: W - 0.5, h: 0.35,
    fontSize: 13, fontFace: fonts.title, bold: true,
    color: colors.coral, align: 'left',
  });

  // User persona card (left)
  addCard(s4, pres, { x: 0.25, y: 0.65, w: 4.5, h: 4.35, accentColor: colors.navy });

  s4.addText('The Self-Directed Lifter', {
    x: 0.4, y: 0.85, w: 4.15, h: 0.45,
    fontSize: 18, fontFace: fonts.title, bold: true,
    color: colors.navy, align: 'left',
  });

  const personaPoints = [
    'Age 25–45. Lifts at home or commercial gym 3–5× per week.',
    'Knows what to do. Unsure if doing it right.',
    'Tried a trainer. Too expensive, too scheduled.',
    'Tried YouTube form checks. Async, unreliable feedback.',
    'Doesn\'t want to embarrass themselves asking for help mid-set.',
  ];

  personaPoints.forEach((pt, i) => {
    s4.addText(`• ${pt}`, {
      x: 0.45, y: 1.42 + i * 0.6, w: 4.15, h: 0.52,
      fontSize: 13, fontFace: fonts.body,
      color: colors.charcoal, align: 'left',
    });
  });

  // Optional persona illustration (right)
  try {
    s4.addImage({ path: path.join(IMG, '04-user-quote.png'), x: 5.1, y: 0.75, w: 4.5, h: 3.4 });
  } catch (e) { /* image absent */ }

  // Pull quote at bottom
  s4.addShape(pres.ShapeType.rect, {
    x: 4.9, y: 4.1, w: 4.9, h: 1.2,
    fill: { color: colors.navy }, line: { type: 'none' },
    shadow: makeCardShadow(),
  });

  s4.addText('"it caught the thing my trainer missed"', {
    x: 5.05, y: 4.2, w: 4.6, h: 0.65,
    fontSize: 17, fontFace: fonts.title, bold: false, italic: true,
    color: colors.white, align: 'center',
  });

  s4.addText('— Beta user, week 2 unsolicited feedback', {
    x: 5.05, y: 4.85, w: 4.6, h: 0.35,
    fontSize: 11, fontFace: fonts.body,
    color: colors.gold, align: 'center',
  });

  s4.addNotes(`TALKING POINTS:
• "Our user is the self-directed lifter. They're not a beginner — they have a program. They've watched the tutorials. But every rep is a guess."
• "They don't want a trainer on their schedule. They want guidance on their set."
• [Point to quote] "We didn't write that quote. That's verbatim. Week two of beta. Unsolicited."
• "That's the product in one sentence. Not replacing the trainer — catching what the trainer misses."

[FOR PMs:] "The retention number on Slide 1 is explained by this user profile. High intent, real problem, no adequate alternative — when you solve it, they come back."

PACING:
[~1 min. Let the quote land. Don't rush past it.]

TRANSITION:
"The feedback gap exists because the technology to close it didn't exist — until 2025." [CLICK]`);
};
