/**
 * slides-s1.js — Section 1: The Datadog invoice that broke our brain
 * Slides: 3 (divider) + 4, 5, 6 = 4 slides
 */

const path = require('path');
const { colors, fonts, IMG, makeShadow, makeCardShadow, addDividerSlide, addContentSlide, addStat, addCard, addAccentBar, addBottomStrip } = require('./theme');

const SECTION_LABEL = 'SECTION 1 — THE DATADOG INVOICE';

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 3: Section 1 Divider
  // -------------------------------------------------------------------------
  addDividerSlide(pres, {
    title: 'The Datadog invoice\nthat broke our brain',
    subtitle: 'How a $180k bill became $720k without changing what we measured',
    sectionNum: 1,
    imagePath: path.join(IMG, '05-s1-divider.jpg'),
    speakerNotes: `TALKING POINTS:
• "Three years ago we were paying Datadog $180,000 a year."
• "Reasonable for the size of our platform. We knew what we were getting."
• [PAUSE] "Then something changed. Or rather — nothing changed. That's the problem."

PACING:
[~20 sec. Let this land as a mystery. The audience should be wondering: what happened?]

TRANSITION:
"Here's the moment we realized we had a problem." [CLICK]`,
  });

  // -------------------------------------------------------------------------
  // Slide 4: The inciting moment
  // -------------------------------------------------------------------------
  const s4 = pres.addSlide();
  s4.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s4);
  // Big quote text centered
  s4.addText('"Finance put the Datadog line\nitem on the projector.\n\nQ3 2025 budget review.\nThat\'s when we started looking."', {
    x: 0.8, y: 1.2, w: 8.2, h: 4.5,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: false, align: 'center', valign: 'middle',
    italic: true,
  });
  // Attribution
  s4.addText('— Platform Lead, Q3 2025 budget review', {
    x: 0.8, y: 5.8, w: 8.2, h: 0.4,
    fontSize: 14, color: colors.steelBlue, fontFace: fonts.body,
    align: 'center', italic: true,
  });
  addBottomStrip(s4, SECTION_LABEL);
  s4.addNotes(`TALKING POINTS:
• "Q3 2025. Finance pulled up the infrastructure costs slide."
• "The Datadog line was $590,000. For the year. And trending upward."
• "I remember the room going quiet. Someone said: 'I thought we had a Datadog contract.' We did. We'd blown through the committed spend."
• "That afternoon we started actually looking at what we were paying for."
• [PAUSE — let the audience picture that meeting]
• "And what we found was embarrassing. We'd done it to ourselves."

PACING:
[~45 sec. This is the most personal moment in the talk. Slow down here. The pause is critical.]

TRANSITION:
"Here's the actual number." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 5: The cost curve
  // -------------------------------------------------------------------------
  const s5 = pres.addSlide();
  s5.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s5);
  s5.addText('The cost curve', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 28, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Native cost chart (horizontal bar approximation with shape blocks)
  const chartData = [
    { year: '2023', cost: '$180k', pct: 0.25, series: 2100000, label: '2.1M series' },
    { year: '2024', cost: '$380k', pct: 0.53, series: 6800000, label: '6.8M series' },
    { year: '2025', cost: '$590k', pct: 0.82, series: 14200000, label: '14.2M series' },
    { year: '2026\n(proj)', cost: '$720k', pct: 1.0, series: 19000000, label: '19M series' },
  ];
  const barMaxW = 5.0;
  const barH = 0.45;
  const startX = 1.5;
  const startY = 1.2;
  const rowSpacing = 1.0;
  chartData.forEach((d, i) => {
    const yPos = startY + i * rowSpacing;
    const barW = Math.max(barMaxW * d.pct, 0.1);
    const barColor = d.year.includes('proj') ? colors.steelBlue : colors.signalTeal;
    // Year label
    s5.addText(d.year, {
      x: 0.1, y: yPos + 0.05, w: 1.3, h: 0.4,
      fontSize: 13, color: colors.slate, fontFace: fonts.body,
      bold: true, align: 'right',
    });
    // Bar
    s5.addShape('rect', {
      x: startX, y: yPos, w: barW, h: barH,
      fill: { color: barColor },
      line: { color: barColor },
    });
    // Cost label inside bar
    s5.addText(d.cost, {
      x: startX + 0.1, y: yPos + 0.08, w: 1.2, h: 0.3,
      fontSize: 13, color: colors.white, fontFace: fonts.body,
      bold: true, align: 'left',
    });
    // Series count
    s5.addText(d.label, {
      x: startX + barW + 0.1, y: yPos + 0.08, w: 1.8, h: 0.3,
      fontSize: 11, color: colors.steelBlue, fontFace: fonts.body,
      align: 'left',
    });
  });
  // Annotation
  s5.addText('Custom metrics SKU = 72% of total cost', {
    x: 1.5, y: 5.3, w: 5.5, h: 0.4,
    fontSize: 12, color: colors.amber, fontFace: fonts.body,
    bold: true, italic: true, align: 'left',
  });
  // Note about usage being flat
  s5.addShape('rect', {
    x: 6.8, y: 1.1, w: 2.8, h: 2.4,
    fill: { color: colors.white },
    line: { color: colors.lightGray, width: 0.5 },
    shadow: makeCardShadow(),
  });
  s5.addShape('rect', { x: 6.8, y: 1.1, w: 0.06, h: 2.4, fill: { color: colors.coral }, line: { color: colors.coral } });
  s5.addText('What didn\'t change:', {
    x: 7.0, y: 1.2, w: 2.5, h: 0.3,
    fontSize: 12, color: colors.slate, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  s5.addText('• Number of services\n• Traffic volume\n• Engineering headcount\n• Product features', {
    x: 7.0, y: 1.55, w: 2.5, h: 1.5,
    fontSize: 11, color: colors.slate, fontFace: fonts.body,
    align: 'left',
  });
  addBottomStrip(s5, SECTION_LABEL);
  s5.addNotes(`TALKING POINTS:
• "2023: $180k. Reasonable."
• "2024: $380k. Concerning."
• "2025: $590k. Now we're in a meeting with Finance."
• "2026 projected: $720k. And here's the kicker — nothing changed. Same services. Same traffic. Same team."
• [Point to sidebar:] "None of these grew. What grew was our metric cardinality — specifically, three tags we added in 2024: user_id, tenant_id, and request_id."
• "We added those tags for a debugging push and never removed them. Each one multiplied our time-series count. Custom metrics is priced per tag combination. You can do the math."
• [FOR MANAGERS:] "This is a billing model trap, not an OTel argument. We'll come back to this in section 4."

PACING:
[~60 sec. Walk through each bar. Pause at 2026 projected. The "nothing changed" beat is important.]

TRANSITION:
"So here's what we decided the number had to look like instead." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 6: ROI Summary — "The Numbers"
  // -------------------------------------------------------------------------
  const s6 = pres.addSlide();
  s6.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s6);
  s6.addText('If you\'re paying $400k+/yr, here\'s the case:', {
    x: 0.4, y: 0.18, w: 9, h: 0.65,
    fontSize: 24, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Three stats
  addStat(s6, { x: 0.4, y: 1.3, number: '10 mo', label: 'Actual migration time', context: 'Planned: 6 months', color: colors.signalTeal });
  addStat(s6, { x: 3.5, y: 1.3, number: '14 mo', label: 'Payback period', context: 'From migration start', color: colors.steelBlue });
  addStat(s6, { x: 6.6, y: 1.3, number: '~65%', label: 'Observability cost reduction', context: 'Year-over-year after OTel', color: colors.mossGreen });
  // Fine print / caveats card
  addCard(s6, {
    x: 0.4, y: 3.4, w: 9.2, h: 1.8,
    accentColor: colors.amber,
    title: 'What this number requires:',
    bodyText: [
      '1-2 dedicated platform engineers for 10+ months (the hidden cost)',
      'Leadership buy-in to accept 4 months of migration-induced alert noise',
      'Legal decision on cost number sharing before external use',
      'OTel does NOT eliminate cardinality risk — it moves it from your wallet to your infra team',
    ],
    bodySize: 11,
  });
  addBottomStrip(s6, SECTION_LABEL);
  s6.addNotes(`TALKING POINTS:
• "Here's the headline. 10 months, not 6. 14-month payback from when we started."
• "We're not claiming this is a slam dunk. It requires headcount — real platform engineering time."
• [Point to the 65% reduction:] "That's the exit velocity. Once you're off Datadog custom metrics pricing, the cost curve inverts."
• [FOR ENGINEERING LEADERS:] "The question to ask your finance team isn't 'what does OTel cost' — it's 'what is our current vendor's cost trajectory in 24 months?' Model that out. If the line keeps going up at this angle, the math changes."
• [FOR PMs:] "I want to set expectations: this is not a low-effort project. If your platform team is under-resourced, this will slip. We slipped 4 months."

PACING:
[~75 sec. This is the business case slide. Engineering leaders need to see numbers early. Don't rush.]

TRANSITION:
"So we had the 'why.' Now we needed to figure out the 'what.' And that started with a decision: which vendor do we replace Datadog with?" [CLICK]`);

};
