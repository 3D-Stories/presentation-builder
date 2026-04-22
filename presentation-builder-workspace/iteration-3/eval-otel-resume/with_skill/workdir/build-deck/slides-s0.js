/**
 * slides-s0.js — Section 0: Title + Agenda (slides 1-2)
 */

const path = require('path');
const { colors, fonts, IMG, makeShadow, addCard } = require('./theme');

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 1: Title Slide (dark)
  // -------------------------------------------------------------------------
  const s1 = pres.addSlide();
  s1.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  // Hero image guard
  try {
    const fs = require('fs');
    const heroPath = path.join(IMG, '01-title-hero.jpg');
    if (fs.existsSync(heroPath)) {
      s1.addImage({ path: heroPath, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover' } });
      s1.addShape('rect', {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: colors.deepNavy, transparency: 50 },
        line: { color: colors.deepNavy },
      });
    }
  } catch (e) {}
  // Teal accent bar top
  s1.addShape('rect', {
    x: 0, y: 0, w: '100%', h: 0.06,
    fill: { color: colors.signalTeal },
    line: { color: colors.signalTeal },
  });
  // Title
  s1.addText('From $720k/yr to OTel:', {
    x: 0.5, y: 1.8, w: 9, h: 0.85,
    fontSize: 38, color: colors.iceWhite, fontFace: fonts.title,
    bold: true, align: 'left',
    shadow: makeShadow(),
  });
  s1.addText('A Migration Story', {
    x: 0.5, y: 2.65, w: 9, h: 0.75,
    fontSize: 34, color: colors.signalTeal, fontFace: fonts.title,
    bold: true, align: 'left',
    shadow: makeShadow(),
  });
  // Subtitle
  s1.addText('How we replaced Datadog, what went wrong, and what we\'d do differently', {
    x: 0.5, y: 3.55, w: 9, h: 0.55,
    fontSize: 17, color: colors.iceWhite, fontFace: fonts.body,
    align: 'left',
  });
  // Speaker / date
  s1.addText('Platform Team — Internal Platform Summit, April 2026', {
    x: 0.5, y: 6.8, w: 9, h: 0.35,
    fontSize: 13, color: colors.steelBlue, fontFace: fonts.body,
    align: 'left',
  });
  s1.addNotes(`TALKING POINTS:
• "Good [morning/afternoon]. I'm going to talk about something I wish someone had told us before we started."
• "Eighteen months ago, our Datadog bill hit $720,000 a year. That's not a typo. Seven hundred twenty thousand dollars."
• "So we built an exit plan. Today I'm going to tell you how that went — the good parts, the painful parts, and the three traps we ran into that nobody warned us about."
• [PAUSE for effect]

PACING:
[~45 sec. Let the $720k number land. Don't rush through it. This is the hook.]

TRANSITION:
"But first — let me show you how we got there." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 2: Agenda
  // -------------------------------------------------------------------------
  const s2 = pres.addSlide();
  s2.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: colors.cloudWhite },
    line: { color: colors.cloudWhite },
  });
  s2.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.05, fill: { color: colors.signalTeal }, line: { color: colors.signalTeal } });
  s2.addText('Agenda', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 28, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Agenda items
  const agendaItems = [
    { num: '01', title: 'The Datadog invoice that broke our brain', time: '3 min' },
    { num: '02', title: 'Why OTel (and why we rejected the alternatives)', time: '3 min' },
    { num: '03', title: 'The migration in four acts', time: '9 min' },
    { num: '04', title: 'The three traps we didn\'t see coming', time: '4 min' },
    { num: '05', title: 'What we\'d do differently', time: '2 min' },
  ];
  agendaItems.forEach((item, i) => {
    const yPos = 1.1 + i * 1.1;
    // Number circle (teal)
    s2.addShape('ellipse', {
      x: 0.4, y: yPos, w: 0.55, h: 0.55,
      fill: { color: colors.signalTeal },
      line: { color: colors.signalTeal },
    });
    s2.addText(item.num, {
      x: 0.4, y: yPos, w: 0.55, h: 0.55,
      fontSize: 14, color: colors.white, fontFace: fonts.title,
      bold: true, align: 'center', valign: 'middle',
    });
    // Title
    s2.addText(item.title, {
      x: 1.1, y: yPos + 0.04, w: 7.5, h: 0.35,
      fontSize: 15, color: colors.slate, fontFace: fonts.body,
      bold: true, align: 'left',
    });
    // Time
    s2.addText(item.time, {
      x: 8.8, y: yPos + 0.04, w: 0.8, h: 0.35,
      fontSize: 12, color: colors.steelBlue, fontFace: fonts.body,
      align: 'right',
    });
    // Separator line
    if (i < agendaItems.length - 1) {
      s2.addShape('line', {
        x: 1.1, y: yPos + 0.62, w: 8.5, h: 0,
        line: { color: colors.lightGray, width: 0.5 },
      });
    }
  });
  // Total time note
  s2.addText('25 min + 10 min Q&A', {
    x: 0.4, y: 6.8, w: 9, h: 0.35,
    fontSize: 11, color: colors.steelBlue, fontFace: fonts.body,
    align: 'right', italic: true,
  });
  s2.addShape('rect', { x: 0, y: 7.2, w: '100%', h: 0.3, fill: { color: colors.deepNavy }, line: { color: colors.deepNavy } });
  s2.addText('OTEL MIGRATION — INTERNAL PLATFORM SUMMIT', {
    x: 0.2, y: 7.22, w: 9, h: 0.25,
    fontSize: 9, color: colors.iceWhite, fontFace: fonts.body,
  });
  s2.addNotes(`TALKING POINTS:
• "Here's the road map for the next 25 minutes."
• "We'll start with the why — the cost story. Then the decision process. Then the migration itself, act by act."
• "The most valuable section for most of you will probably be section 4 — the three traps. Things we wish we'd known before we started."
• "And we'll close with what we'd do differently — which is the part I'd steal if I were you."
• [FOR PMs/MANAGERS:] "Even if you're not involved in the technical details, stay with us through section 4. The headcount and timeline implications are significant."

PACING:
[~30 sec. This is a quick orientation, not a sales pitch. Move through it.]

TRANSITION:
"Let's start with the invoice." [CLICK]`);

};
