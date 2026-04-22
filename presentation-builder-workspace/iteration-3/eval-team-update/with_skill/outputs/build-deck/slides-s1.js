/**
 * slides-s1.js — Section 1: Title / Context Setter
 * Slide 1: Dark title slide with quarter framing
 */

'use strict';

const { colors, fonts, addDividerSlide } = require('./theme');

module.exports = function addSection1(pres) {

  // ----- Slide 1: Title -----
  const notes1 = `TALKING POINTS:
• "Morning everyone — quick two minutes on Q4 before we jump into standups."
• "Here's the short version of what we pulled off this quarter."
• [PAUSE] "At the start of Q4, we had [X] open design tickets, a new design system to adopt, and a 10-week clock."
• "That's the context. Here's what happened."

PACING:
[~1 min total. Keep it tight — this is setup, not the payoff. Pause briefly after the tension line to let it land.]

TRANSITION:
"Let's run through what actually shipped." [CLICK]`;

  const slide1 = pres.addSlide();
  slide1.background = { color: colors.charcoal };

  // Main title
  slide1.addText('Q4 Website Redesign', {
    x: 0.5, y: 1.8, w: 12.33, h: 1.2,
    fontSize: 44, bold: true, color: colors.white,
    fontFace: fonts.title,
    align: 'center',
    valign: 'middle',
  });

  // Subtitle
  slide1.addText('What We Shipped', {
    x: 0.5, y: 3.1, w: 12.33, h: 0.7,
    fontSize: 26, bold: false, color: '0D7377',
    fontFace: fonts.body,
    align: 'center',
    valign: 'middle',
  });

  // Date / context line
  slide1.addText('Q4 2025  ·  Team Update  ·  April 2026', {
    x: 0.5, y: 5.8, w: 12.33, h: 0.5,
    fontSize: 14, bold: false, color: colors.midGray,
    fontFace: fonts.body,
    align: 'center',
    valign: 'middle',
  });

  slide1.addNotes(notes1);
};
