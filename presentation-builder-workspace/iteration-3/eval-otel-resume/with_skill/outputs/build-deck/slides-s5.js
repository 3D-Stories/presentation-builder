/**
 * slides-s5.js — Section 5: What we'd do differently
 * Slides: 24 (divider) + 25, 26, 27 = 4 slides
 */

const path = require('path');
const { colors, fonts, IMG, makeShadow, makeCardShadow, addDividerSlide, addAccentBar, addBottomStrip, addStat, addCard } = require('./theme');

const SECTION_LABEL = 'SECTION 5 — WHAT WE\'D DO DIFFERENTLY';

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 24: Section 5 Divider (Dark — standard)
  // -------------------------------------------------------------------------
  addDividerSlide(pres, {
    title: 'What we\'d do differently',
    subtitle: 'Three things to steal. Two things to avoid.',
    sectionNum: 5,
    imagePath: null, // No AI image — relies on dark background + progress dots
    speakerNotes: `TALKING POINTS:
• "Final section. Three minutes."
• "I'm going to close with the question I most wanted answered before we started."
• "If you knew then what you know now, what would you do differently?"

PACING:
[~15 sec.]

TRANSITION:
"Let's start with the cost curve." [CLICK]`,
  });

  // -------------------------------------------------------------------------
  // Slide 25: Cost curve callback
  // -------------------------------------------------------------------------
  const s25 = pres.addSlide();
  s25.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s25);
  s25.addText('That Q3 budget line item? Here\'s what it looks like now.', {
    x: 0.4, y: 0.18, w: 9, h: 0.65,
    fontSize: 22, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });

  // Callback cost chart — same style as slide 5, extended with Year 4 (OTel)
  const chartData = [
    { year: '2023', cost: '$180k', pct: 0.25, note: 'Datadog' },
    { year: '2024', cost: '$380k', pct: 0.53, note: 'Datadog' },
    { year: '2025', cost: '$590k', pct: 0.82, note: 'Datadog' },
    { year: '2026\n(OTel)', cost: '$210k', pct: 0.29, note: 'OTel + infra' },
  ];
  const barMaxW = 5.0;
  const barH = 0.45;
  const startX = 1.5;
  const startY = 1.2;
  const rowSpacing = 1.0;

  chartData.forEach((d, i) => {
    const yPos = startY + i * rowSpacing;
    const barW = Math.max(barMaxW * d.pct, 0.1);
    const barColor = d.note === 'OTel + infra' ? colors.mossGreen : colors.signalTeal;
    s25.addText(d.year, {
      x: 0.1, y: yPos + 0.05, w: 1.3, h: 0.4,
      fontSize: 13, color: colors.slate, fontFace: fonts.body,
      bold: true, align: 'right',
    });
    s25.addShape('rect', {
      x: startX, y: yPos, w: barW, h: barH,
      fill: { color: barColor },
      line: { color: barColor },
    });
    s25.addText(d.cost, {
      x: startX + 0.1, y: yPos + 0.08, w: 1.2, h: 0.3,
      fontSize: 13, color: colors.white, fontFace: fonts.body,
      bold: true, align: 'left',
    });
    s25.addText(d.note, {
      x: startX + barW + 0.1, y: yPos + 0.08, w: 2.5, h: 0.3,
      fontSize: 11, color: i === 3 ? colors.mossGreen : colors.steelBlue,
      fontFace: fonts.body, bold: i === 3, align: 'left',
    });
  });

  // Arrow showing the drop
  s25.addShape('line', {
    x: 2.3, y: 4.2, w: 0, h: -1.6,
    line: { color: colors.mossGreen, width: 2, endArrowType: 'open' },
  });
  s25.addText('−65%', {
    x: 2.4, y: 2.8, w: 1.0, h: 0.35,
    fontSize: 14, color: colors.mossGreen, fontFace: fonts.title,
    bold: true, align: 'left',
  });

  // Thesis echo
  s25.addShape('rect', {
    x: 0.4, y: 5.45, w: 9.2, h: 0.95,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  s25.addText('"OTel moves the debt. This is what that looks like when it moves."', {
    x: 0.5, y: 5.45, w: 9.0, h: 0.95,
    fontSize: 15, color: colors.signalTeal, fontFace: fonts.body,
    italic: true, align: 'center', valign: 'middle',
  });

  addBottomStrip(s25, SECTION_LABEL);
  s25.addNotes(`TALKING POINTS:
• "Remember slide 5? The cost curve going up and to the right?"
• [Gesture at the chart] "Here's slide 5 extended by one more year."
• "2026: $210,000. That's observability spend including OTel infrastructure, platform engineering time, and Grafana Cloud fees."
• "That's a 65% reduction from the $590k we were paying Datadog in 2025."
• [Point to the thesis box:] "OTel moves the debt. This is what that looks like when it moves."
• "The debt is still there — it's in platform engineering headcount, in the operational discipline of cardinality limits and sampling configs."
• "But it's predictable. It's ours. And it doesn't have surprise invoices."
• [PAUSE — let the callback land]

PACING:
[~45 sec. This is the emotional payoff of the talk. The callback from slide 5 should feel like a loop closing.]

TRANSITION:
"So what would we actually do differently?" [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 26: What we'd do differently (3-card grid)
  // -------------------------------------------------------------------------
  const s26 = pres.addSlide();
  s26.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s26);
  s26.addText('Three things we\'d do differently', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  const lessons = [
    {
      title: '01  Start with traces only',
      body: [
        'Don\'t touch metrics or logs until 100% of traces are in Tempo and running stable for 2 weeks',
        'Traces have the best ROI-to-risk ratio: fast to migrate, fast to validate, builds team confidence',
        'Starting with metrics caused us to take on the alerting rewrite too early',
      ],
    },
    {
      title: '02  Do sampling architecture in week 2',
      body: [
        'Before any service goes to production with OTel',
        'Document: head-based vs tail-based decision for each service tier',
        'Gateway scaling model decided before you need it, not during an incident',
        'Costs 3 days of design — saves weeks of re-architecture',
      ],
    },
    {
      title: '03  Budget the alerting rewrite as a project',
      body: [
        '30% of your metrics migration effort — not a task, a project',
        'Assign a dedicated owner (not the same person migrating metrics)',
        'Run the semantic test: replay 2 weeks of metric data and compare fire/no-fire',
        'Don\'t declare metrics complete until alerting parity is verified',
      ],
    },
  ];
  lessons.forEach((l, i) => {
    addCard(s26, {
      x: 0.35 + i * 3.15, y: 1.0, w: 2.95, h: 5.6,
      accentColor: colors.signalTeal,
      title: l.title,
      bodyText: l.body,
      bodySize: 11,
    });
  });
  // Thesis echo
  s26.addText('"OTel moves the debt — here\'s how to move it on your terms."', {
    x: 0.4, y: 6.75, w: 9.2, h: 0.4,
    fontSize: 13, color: colors.steelBlue, fontFace: fonts.body,
    italic: true, align: 'center',
  });
  addBottomStrip(s26, SECTION_LABEL);
  s26.addNotes(`TALKING POINTS:
• "Three things. You can steal all three."
• [Card 1 — Traces first:] "Start with traces. Only traces. Get them stable, run them for two weeks, do your post-mortem. Then move to metrics. The order matters."
• [Card 2 — Sampling:] "Week 2 of the project — before anything is in production — sit down and make the sampling decision. It takes 3 days. Avoiding the re-architecture later is worth it."
• [Card 3 — Alerting:] "And the alerting rewrite. If you have more than 30 alert rules, this is a project with its own owner, its own timeline, and its own semantic testing phase."
• [Bottom quote:] "The debt is moving. Here's how to control where it lands."
• [FOR DEVS:] "The 'traces first' order also has a developer experience benefit — trace sampling in OTel is intuitive. Metric cardinality limits are not. Start where it's easier."

PACING:
[~60 sec. Walk each card briskly. The audience should be writing notes at this point.]

TRANSITION:
"And here's what that means for each of you specifically." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 27: Your first steps (two-column)
  // -------------------------------------------------------------------------
  const s27 = pres.addSlide();
  s27.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s27);
  s27.addText('Your first steps', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Column headers
  s27.addShape('rect', { x: 0.4, y: 0.9, w: 4.5, h: 0.5, fill: { color: colors.deepNavy }, line: { color: colors.deepNavy } });
  s27.addText('Engineering Leaders', {
    x: 0.4, y: 0.9, w: 4.5, h: 0.5,
    fontSize: 15, color: colors.signalTeal, fontFace: fonts.title,
    bold: true, align: 'center', valign: 'middle',
  });
  s27.addShape('rect', { x: 5.1, y: 0.9, w: 4.5, h: 0.5, fill: { color: colors.deepNavy }, line: { color: colors.deepNavy } });
  s27.addText('Platform ICs', {
    x: 5.1, y: 0.9, w: 4.5, h: 0.5,
    fontSize: 15, color: colors.signalTeal, fontFace: fonts.title,
    bold: true, align: 'center', valign: 'middle',
  });
  // Vertical divider
  s27.addShape('line', { x: 4.85, y: 0.9, w: 0, h: 6.0, line: { color: colors.lightGray, width: 0.5 } });

  const leaderSteps = [
    { num: '1', title: 'Run a cost audit this week', body: 'Pull your observability vendor spend for the last 12 months. Project 24 months at the current growth rate. That\'s the cost of inaction.' },
    { num: '2', title: 'Calculate headcount cost', body: 'One platform engineer for 10 months = roughly $200k loaded. Subtract from your projected savings. If the math is positive in under 18 months, the business case exists.' },
    { num: '3', title: 'Greenlight a pilot scope', body: 'Not "migrate everything." Pick one non-critical service, run it through the OTel collector to Tempo for traces only. 6-week pilot. Evaluate before committing the roadmap.' },
  ];
  const icSteps = [
    { num: '1', title: 'Start with traces', body: 'One service, OTLP traces to Tempo. Use the OTel Helm chart. Get it running, run it stable for 2 weeks, write the runbook. This is your proof of concept.' },
    { num: '2', title: 'Decide sampling in week 2', body: 'Answer one question: for this service, is tail-based or head-based sampling the right model? Document the decision and the rationale. Don\'t skip this.' },
    { num: '3', title: 'Inventory your alert rules before touching metrics', body: 'Count your Datadog monitors. Budget 0.3× your metrics migration timeline for the alerting rewrite. Flag this to your lead before the metrics migration starts.' },
  ];
  [leaderSteps, icSteps].forEach((steps, col) => {
    const xBase = col === 0 ? 0.5 : 5.2;
    steps.forEach((step, i) => {
      const yPos = 1.55 + i * 1.65;
      // Step number
      s27.addShape('ellipse', {
        x: xBase, y: yPos, w: 0.4, h: 0.4,
        fill: { color: colors.signalTeal },
        line: { color: colors.signalTeal },
      });
      s27.addText(step.num, {
        x: xBase, y: yPos, w: 0.4, h: 0.4,
        fontSize: 12, color: colors.white, fontFace: fonts.body,
        bold: true, align: 'center', valign: 'middle',
      });
      s27.addText(step.title, {
        x: xBase + 0.5, y: yPos + 0.02, w: 3.9, h: 0.35,
        fontSize: 12, color: colors.slate, fontFace: fonts.body,
        bold: true, align: 'left',
      });
      s27.addText(step.body, {
        x: xBase + 0.5, y: yPos + 0.38, w: 3.9, h: 1.15,
        fontSize: 10, color: colors.slate, fontFace: fonts.body,
        align: 'left',
      });
    });
  });
  addBottomStrip(s27, SECTION_LABEL);
  s27.addNotes(`TALKING POINTS:
• "Two columns. One for the people who approve roadmaps. One for the people who build them."
• [FOR ENGINEERING LEADERS — point to left column:] "Your first step: do the cost audit this week. Not later. Your instinct on your current bill might be wrong. Pull the number."
• "Second: the headcount math. One platform engineer for 10 months. At your loaded cost. Does the 18-month payback hold? If yes, the business case exists. Run the pilot."
• [FOR PLATFORM ICs — point to right column:] "Your first step: one service, traces only, to Tempo. Helm chart. Two weeks stable. Write the runbook."
• "Step 2: the sampling decision. Don't skip it. It's 3 days of design."
• "Step 3: count your alert rules before you start on metrics. Just count them. Tell your lead."
• [PAUSE] "We had 120. It took 8 weeks. We thought it would take 3 days."

PACING:
[~60 sec. Walk left column first, then right. Pause on the last line — the 120 alerts callback ties to section 3.]

TRANSITION:
"That's the talk. Thank you. I'll take questions." [CLICK]`);

};
