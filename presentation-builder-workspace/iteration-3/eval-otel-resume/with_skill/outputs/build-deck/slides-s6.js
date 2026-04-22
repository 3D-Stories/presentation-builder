/**
 * slides-s6.js — Section 6: Q&A / Thank you (slide 28)
 */

const { colors, fonts, makeShadow } = require('./theme');

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 28: Q&A / Thank you
  // -------------------------------------------------------------------------
  const s28 = pres.addSlide();
  s28.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  // Teal accent bar
  s28.addShape('rect', {
    x: 0, y: 0, w: '100%', h: 0.06,
    fill: { color: colors.signalTeal },
    line: { color: colors.signalTeal },
  });
  // Large Q&A text
  s28.addText('Questions?', {
    x: 0.5, y: 1.5, w: 9, h: 1.5,
    fontSize: 60, color: colors.iceWhite, fontFace: fonts.title,
    bold: true, align: 'left',
    shadow: makeShadow(),
  });
  s28.addText('10 minutes', {
    x: 0.5, y: 3.0, w: 5, h: 0.6,
    fontSize: 22, color: colors.signalTeal, fontFace: fonts.body,
    align: 'left',
  });
  // Contact info
  s28.addShape('rect', {
    x: 0.4, y: 4.2, w: 5.5, h: 2.5,
    fill: { color: colors.slate, transparency: 70 },
    line: { color: colors.steelBlue, width: 0.5 },
  });
  s28.addText('Platform Team', {
    x: 0.5, y: 4.35, w: 5.2, h: 0.4,
    fontSize: 15, color: colors.signalTeal, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  s28.addText('platform@[company].com\nSlack: #platform-otel', {
    x: 0.5, y: 4.78, w: 5.2, h: 0.7,
    fontSize: 13, color: colors.iceWhite, fontFace: fonts.body,
    align: 'left',
  });
  s28.addText('This deck + recorded session:\nconfluence.internal/otel-migration-2026', {
    x: 0.5, y: 5.52, w: 5.2, h: 0.6,
    fontSize: 12, color: colors.steelBlue, fontFace: fonts.body,
    align: 'left',
  });
  // Key reminder
  s28.addText('"OTel doesn\'t eliminate observability debt — it moves it.\nPlan accordingly."', {
    x: 6.2, y: 4.2, w: 3.5, h: 2.5,
    fontSize: 14, color: colors.iceWhite, fontFace: fonts.body,
    italic: true, align: 'left', valign: 'middle',
  });
  s28.addNotes(`TALKING POINTS:
• "Thank you. That's 25 minutes."
• "Before I take questions — one sentence to leave you with."
• [Gesture at the quote:] "OTel doesn't eliminate observability debt. It moves it. Plan for where you want it to land."
• "I'm happy to go deep on any of the three traps, the collector architecture, or the sampling model. What would you like to dig into?"

PACING:
[Soft landing. Breathe. Let the audience settle.]

ANTICIPATED QUESTIONS:
• "What was your OTel Collector version?" — We're on v0.97, currently evaluating v1.0.
• "How do you handle multi-cluster tracing?" — Each cluster has its own gateway; cross-cluster traces require OTLP export at the gateway level.
• "What about the team that didn't want to rewrite instrumentation?" — We gave them a 6-month window with the Datadog agent still running. Eventually mandatory. Two teams pushed back; both are on OTel now.
• "Would you open-source your Helm chart configs?" — We're evaluating this. If leadership signs off, likely Q3 2026.`);

};
