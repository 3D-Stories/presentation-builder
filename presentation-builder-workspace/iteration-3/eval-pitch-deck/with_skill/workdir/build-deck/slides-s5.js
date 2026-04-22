// slides-s5.js — Section 5: Traction (Slide 8)
// "The Numbers"
// Duration: ~2 min | 1 slide

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addStat } = require('./theme');

module.exports = function buildSection5(pres) {

  // ── Slide 8: Traction — The Stat Grid ─────────────────────────────────────
  const s8 = pres.addSlide();
  s8.background = { color: colors.navy };

  // Optional atmospheric dark background image
  try {
    s8.addImage({ path: path.join(IMG, '08-traction-bg.jpg'), x: 0, y: 0, w: W, h: H, transparency: 55 });
  } catch (e) { /* image absent */ }

  // Section label
  s8.addText('EARLY SIGNAL', {
    x: 0.4, y: 0.12, w: 3, h: 0.32,
    fontSize: 12, fontFace: fonts.title, bold: true,
    color: colors.coral, align: 'left',
  });

  // Slide title
  s8.addText('9 Weeks. Real Users. Real Behavior.', {
    x: 0.4, y: 0.45, w: W - 0.8, h: 0.55,
    fontSize: 26, fontFace: fonts.title, bold: true,
    color: colors.white, align: 'left',
  });

  // Thin gold line under title (thin rect)
  s8.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.0, w: W - 0.8, h: 0.01,
    fill: { color: colors.gold }, line: { type: 'none' },
  });

  // Stat grid — 4 stats across (hero stat first = 72%)
  // Each stat block: x position calculated for equal 4-column layout
  const statsData = [
    { number: '72%',    label: 'Week-4 Retention',    contextNote: 'Category avg: 15–20%',  isHero: true  },
    { number: '61',     label: 'NPS Score',            contextNote: 'Promoter territory',    isHero: false },
    { number: '38min',  label: 'Avg Session Length',   contextNote: 'Full workouts, not dips',isHero: false },
    { number: '340',    label: 'Active Beta Users',    contextNote: 'Closed · TestFlight',   isHero: false },
  ];

  const statW = 2.1;
  const statGap = 0.25;
  const totalW = (statW * 4) + (statGap * 3);
  const startX = (W - totalW) / 2;

  statsData.forEach(({ number, label, contextNote, isHero }, i) => {
    const sx = startX + i * (statW + statGap);
    addStat(s8, {
      x: sx,
      y: 1.15,
      number,
      label,
      contextNote,
      isHero,
      pres,
    });
  });

  // Bottom context note
  s8.addText('Closed beta · TestFlight · invitation-only · 9 weeks in market', {
    x: 0.4, y: H - 0.55, w: W - 0.8, h: 0.38,
    fontSize: 12, fontFace: fonts.body, bold: false,
    color: colors.gold, align: 'center',
  });

  s8.addNotes(`TALKING POINTS:
• [Reveal each stat with a pause — don't read all four at once. Use animation builds if presenting live.]
• [72% — reveal first] "Seventy-two percent week-four retention."
• [PAUSE — 2 seconds]
• "The category benchmark is fifteen to twenty percent. This is the number we open on."
• [61 — reveal second] "NPS of sixty-one. That's promoter territory. People are telling their training partners."
• [38min — reveal third] "Thirty-eight minute median session. They're not dipping in for a quick check. They're doing full workouts with the app running."
• [340 — reveal last] "Three hundred and forty users. Closed beta. This is controlled — we want to understand behavior before we scale."
• [PAUSE]
• "This isn't novelty retention. The app is nine weeks old. Week-four means these users came back through the first month. That's behavior change."

DEFINITION READY (if challenged):
• "Week-4 retention = user opened app and logged at least one session in their fourth week of usage."
• "Active user = opened app at least once in the last 7 days."
• "We're using TestFlight — these are real humans, not click-farm installs."

[FOR PMs:] "38-minute sessions in a fitness app is extraordinary. Peloton averages 20 minutes. Most fitness apps see 8-12 minutes."

PACING:
[~2 min. This is the emotional climax of the deck. Slow down. Let each number breathe. The category benchmark context on 72% is the most important sentence in the presentation.]

TRANSITION:
"We don't yet have unit economics to show you. Here's what we're thinking about instead." [CLICK]`);
};
