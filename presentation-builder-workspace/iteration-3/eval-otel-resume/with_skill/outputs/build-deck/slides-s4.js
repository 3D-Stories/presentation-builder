/**
 * slides-s4.js — Section 4: The three traps we didn't see coming
 * Slides: 19 (divider) + 20, 21, 22, 23 = 5 slides
 */

const path = require('path');
const { colors, fonts, IMG, makeShadow, makeCardShadow, addDividerSlide, addAccentBar, addBottomStrip, addStat, addCard, addCode } = require('./theme');

const SECTION_LABEL = 'SECTION 4 — THE THREE TRAPS';

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 19: Section 4 Divider
  // -------------------------------------------------------------------------
  addDividerSlide(pres, {
    title: 'The three traps\nwe didn\'t see coming',
    subtitle: 'Things OTel documentation doesn\'t warn you about',
    sectionNum: 4,
    imagePath: path.join(IMG, '22-s4-divider.jpg'),
    speakerNotes: `TALKING POINTS:
• "This section is the one I most wish existed before we started."
• "Three traps. Not theoretical — we hit every one."
• [PAUSE] "If you remember nothing else from this talk, remember this section."

PACING:
[~15 sec. Short, punchy setup.]

TRANSITION:
"Trap 1: cardinality." [CLICK]`,
  });

  // -------------------------------------------------------------------------
  // Slide 20: Trap 1 — Cardinality
  // -------------------------------------------------------------------------
  const s20 = pres.addSlide();
  s20.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s20);
  s20.addText('Trap 1: Cardinality still bites', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });

  // Story beat
  s20.addShape('rect', {
    x: 0.4, y: 0.9, w: 9.2, h: 0.7,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  s20.addText('"Day 14 post-migration. Alerting system fired 4,000 times in one hour. A new service had added user_id as a metric label."', {
    x: 0.5, y: 0.92, w: 9.0, h: 0.66,
    fontSize: 13, color: colors.signalTeal, fontFace: fonts.body,
    italic: true, align: 'left', valign: 'middle',
  });

  // Stat: 3x cardinality
  addStat(s20, { x: 0.4, y: 1.8, number: '3×', label: 'cardinality spike in 2 weeks', context: 'New service, 1 bad label', color: colors.coral });

  // Code block showing the bad label
  addCode(s20, {
    x: 3.5, y: 1.8, w: 6.0, h: 2.2,
    code: `# Bad: user_id on a high-frequency counter
http_requests_total{
  service="payments",
  user_id="u_8f3k2",    # <-- cardinality bomb
  method="POST",
  status="200"
}
# user_id × tenants × methods × statuses
# = 850K users × 900 tenants = ~765M series`,
  });

  // What to do instead
  addCard(s20, {
    x: 0.4, y: 4.2, w: 9.2, h: 2.2,
    accentColor: colors.signalTeal,
    title: 'The OTel difference (and the trap):',
    bodyText: [
      'With Datadog: high-cardinality label = expensive invoice',
      'With OTel + Mimir: high-cardinality label = expensive compute (still bad, just differently)',
      'Mimir enforces cardinality limits at ingest — exceeding them causes dropped metrics, not bills',
      'Set cardinality budgets per service at onboarding, not after the incident',
    ],
    bodySize: 11,
  });
  addBottomStrip(s20, SECTION_LABEL);
  s20.addNotes(`TALKING POINTS:
• "Day 14. We thought we were done with the cardinality problem. We were wrong."
• "A new service joined post-migration. Their developer added user_id as a metric label — same mistake we made with Datadog in 2024."
• [Point to code block:] "user_id times tenant count times method times status code. On a high-frequency counter, that's 765 million potential time-series. Mimir hit its cardinality limit and started dropping metrics."
• "We caught it because the alerting fired 4,000 times. But those alerts were wrong — they were firing on missing data, not real problems."
• [Point to card:] "Here's the OTel difference: it's not that OTel solves cardinality. It's that with OTel, cardinality mistakes cost compute instead of money. That's a meaningful improvement. But it's not a free pass."
• "The lesson: set per-service cardinality budgets during onboarding. Don't wait for incidents."

PACING:
[~75 sec. The story beat sets up the lesson. Walk through the code example briefly — devs will understand it, managers just need to see the scale.]

TRANSITION:
"Trap 2: sampling is harder than you think." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 21: Trap 2 — Sampling
  // -------------------------------------------------------------------------
  const s21 = pres.addSlide();
  s21.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s21);
  s21.addText('Trap 2: Sampling is harder than you think', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Decision tree (native diagram)
  s21.addText('Start here:', {
    x: 0.4, y: 0.95, w: 2, h: 0.3,
    fontSize: 12, color: colors.steelBlue, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  // Root question box
  s21.addShape('rect', {
    x: 3.0, y: 0.95, w: 3.6, h: 0.6,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  s21.addText('What\'s your backend retention cost?', {
    x: 3.0, y: 0.95, w: 3.6, h: 0.6,
    fontSize: 12, color: colors.iceWhite, fontFace: fonts.body,
    bold: true, align: 'center', valign: 'middle',
  });
  // Left branch: high volume, low cost → tail-based
  s21.addShape('line', { x: 3.5, y: 1.55, w: 0, h: 0.4, line: { color: colors.signalTeal, width: 1.5 } });
  s21.addShape('rect', { x: 0.6, y: 2.0, w: 2.5, h: 0.6, fill: { color: colors.cloudWhite }, line: { color: colors.steelBlue, width: 1 } });
  s21.addText('High volume\nLow retention cost', { x: 0.6, y: 2.0, w: 2.5, h: 0.6, fontSize: 11, color: colors.slate, fontFace: fonts.body, align: 'center', valign: 'middle' });
  s21.addShape('line', { x: 1.85, y: 2.6, w: 0, h: 0.4, line: { color: colors.signalTeal, width: 1.5 } });
  s21.addShape('rect', { x: 0.4, y: 3.0, w: 2.9, h: 0.7, fill: { color: colors.steelBlue }, line: { color: colors.steelBlue } });
  s21.addText('Tail-based sampling\n(gateway tier)', { x: 0.4, y: 3.0, w: 2.9, h: 0.7, fontSize: 11, color: colors.white, fontFace: fonts.body, bold: true, align: 'center', valign: 'middle' });
  // Left branch connector from root to left
  s21.addShape('line', { x: 3.0, y: 1.25, w: -1.15, h: 0, line: { color: colors.signalTeal, width: 1.5 } });
  s21.addShape('line', { x: 1.85, y: 1.25, w: 0, h: 0.75, line: { color: colors.signalTeal, width: 1.5 } });
  // Right branch: low volume or high cost → head-based
  s21.addShape('line', { x: 6.6, y: 1.55, w: 0, h: 0.4, line: { color: colors.signalTeal, width: 1.5 } });
  s21.addShape('rect', { x: 5.6, y: 2.0, w: 2.5, h: 0.6, fill: { color: colors.cloudWhite }, line: { color: colors.steelBlue, width: 1 } });
  s21.addText('Low volume\nor high retention cost', { x: 5.6, y: 2.0, w: 2.5, h: 0.6, fontSize: 11, color: colors.slate, fontFace: fonts.body, align: 'center', valign: 'middle' });
  s21.addShape('line', { x: 6.85, y: 2.6, w: 0, h: 0.4, line: { color: colors.signalTeal, width: 1.5 } });
  s21.addShape('rect', { x: 5.4, y: 3.0, w: 2.9, h: 0.7, fill: { color: colors.signalTeal }, line: { color: colors.signalTeal } });
  s21.addText('Head-based sampling\n(agent tier)', { x: 5.4, y: 3.0, w: 2.9, h: 0.7, fontSize: 11, color: colors.white, fontFace: fonts.body, bold: true, align: 'center', valign: 'middle' });
  // Right branch connector from root to right
  s21.addShape('line', { x: 6.6, y: 1.25, w: 1.25, h: 0, line: { color: colors.signalTeal, width: 1.5 } });
  s21.addShape('line', { x: 6.85, y: 1.25, w: 0, h: 0.75, line: { color: colors.signalTeal, width: 1.5 } });
  // Our decision callout
  addCard(s21, {
    x: 0.4, y: 4.0, w: 9.2, h: 2.3,
    accentColor: colors.amber,
    title: 'Our decision — and the trap:',
    bodyText: [
      'We use BOTH: head-based (10%) at agent + tail-based (keep errors/slow) at gateway',
      'Tail-based sampling requires all spans of a trace to hit the SAME gateway instance',
      'This pins your gateway scaling strategy — sticky routing, not round-robin',
      'If a gateway instance restarts, you lose partial traces for ~30 sec',
      'The decision: tail sampling is worth it for the error coverage. But plan the scaling model first.',
    ],
    bodySize: 11,
  });
  addBottomStrip(s21, SECTION_LABEL);
  s21.addNotes(`TALKING POINTS:
• "Sampling sounds simple: 'just keep 10% of traces.' It's not."
• [Point to decision tree:] "Start with one question: what's your backend retention cost? Grafana Cloud charges per trace stored. If your volume is high and your service is high-frequency, tail-based sampling is the only practical option."
• [Left branch:] "Tail-based: the gateway sees the full trace before deciding whether to keep it. You can keep 100% of error traces, 100% of slow requests, and sample everything else at 1%. Powerful."
• [Right branch:] "Head-based: the decision is made at the agent — before the trace is complete. Simpler, but you're sampling blind. You'll drop some errors."
• [Point to callout card:] "Here's the trap. Tail-based sampling requires all spans of a trace to hit the same gateway instance. That means sticky routing. That means your gateway can't scale horizontally the simple way."
• [FOR DEVS:] "We use sticky routing based on trace ID hash. It works, but gateway deploys cause ~30 seconds of partial trace loss. Plan for this in your SLI definitions."

PACING:
[~75 sec. Walk the decision tree. The scaling constraint callout is the key insight.]

TRANSITION:
"And trap 3 — the one that cost us 8 weeks we didn't budget." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 22: Trap 3 — Alerting rewrite
  // -------------------------------------------------------------------------
  const s22 = pres.addSlide();
  s22.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s22);
  s22.addText('Trap 3: The alerting rewrite is 30% of your work', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 24, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  addStat(s22, { x: 0.4, y: 1.0, number: '120', label: 'alert rules rewritten', context: 'Datadog monitors → PromQL', color: colors.coral });
  addStat(s22, { x: 3.5, y: 1.0, number: '15', label: 'wrong in staging', context: '~13% behavioral drift', color: colors.amber });
  addStat(s22, { x: 6.6, y: 1.0, number: '8 wk', label: 'actual effort', context: 'Planned: 3 days', color: colors.coral });
  // What triggers a rewrite (not a port)
  addCard(s22, {
    x: 0.4, y: 2.9, w: 9.2, h: 3.7,
    accentColor: colors.coral,
    title: 'What triggers a full rewrite (not just a port):',
    bodyText: [
      '"No data" behavior: Datadog alerts on missing data differently than Prometheus (absent() vs. default value)',
      '"As count" vs. "as rate": Datadog monitors can toggle this; PromQL has distinct functions (increase() vs. rate())',
      'Threshold recovery: Datadog has configurable recovery thresholds; Prometheus uses "for" duration',
      'Multi-condition monitors: Datadog "AND" conditions require separate recording rules in Prometheus',
      'The semantic test: rerun every alert against 2 weeks of production data and verify it would have fired when it should have',
    ],
    bodySize: 11,
  });
  addBottomStrip(s22, SECTION_LABEL);
  s22.addNotes(`TALKING POINTS:
• "We planned 3 days for the alerting migration. It took 8 weeks."
• "The reason: Datadog monitors are not Prometheus alert rules with different syntax. They're a different behavioral model."
• [Point to card items:] "The 'no data' behavior was the biggest gotcha. When a metric disappears from Datadog, monitors behave differently than when a metric stops appearing in Prometheus. We had 12 monitors that silently changed behavior."
• [Point to stats:] "15 alerts wrong in staging. We found them because we ran a semantic test: replay 2 weeks of production metric data through all 120 rules and verify the fire/no-fire behavior matched the Datadog history."
• "Budget this as a separate project. Assign an owner. The semantic test is mandatory — don't trust a mechanical translation."
• [FOR MANAGERS:] "120 rules is the number we had. Your number might be higher. The 30% figure is a ratio: if your metrics migration is X weeks, add 0.3X weeks for the alerting rewrite."

PACING:
[~75 sec. The stats hit first, then the card explains why. Don't read the card — summarize it.]

TRANSITION:
"So three traps. And now the question: what would we actually do differently?" [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 23: Synthesized lesson
  // -------------------------------------------------------------------------
  const s23 = pres.addSlide();
  s23.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s23);
  s23.addText('The synthesized lesson', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Main thesis
  s23.addShape('rect', {
    x: 0.4, y: 1.0, w: 9.2, h: 2.6,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  s23.addText('"OTel doesn\'t eliminate\nobservability debt —\nit moves it."', {
    x: 0.5, y: 1.0, w: 9.0, h: 2.6,
    fontSize: 30, color: colors.iceWhite, fontFace: fonts.title,
    bold: true, align: 'center', valign: 'middle',
    shadow: makeShadow(),
  });
  // What it moves
  s23.addText('From your vendor\'s invoice   →   To your platform team\'s capacity', {
    x: 0.4, y: 3.75, w: 9.2, h: 0.5,
    fontSize: 16, color: colors.steelBlue, fontFace: fonts.body,
    align: 'center',
  });
  // Three bullet implications
  addCard(s23, {
    x: 0.4, y: 4.4, w: 9.2, h: 2.1,
    accentColor: colors.signalTeal,
    title: 'What this means for your migration:',
    bodyText: [
      'Cardinality discipline is still required — just in compute terms, not billing terms',
      'Sampling architecture needs a decision before you write a line of config, not after it breaks',
      'Alerting rewrite is 30% of the work — plan for it like a project, not a task',
    ],
    bodySize: 12,
  });
  addBottomStrip(s23, SECTION_LABEL);
  s23.addNotes(`TALKING POINTS:
• "One sentence. This is the thing to put in your notes if you're taking notes."
• [Pause on the thesis slide]
• "OTel doesn't eliminate observability debt. It moves it. From your vendor's invoice to your platform team's capacity."
• "That's a trade worth making if you have the team. It's not a free lunch."
• [Point to the bottom card:] "Three implications. Cardinality is still your problem — just differently expensive. Sampling architecture needs to be decided before you're in production. And budget the alerting rewrite as a project."
• "We're going to come back to this thesis in the final section."

PACING:
[~45 sec. The thesis lands better with silence. Let it sit for 3-4 seconds after you say it.]

TRANSITION:
"Let's close with what we'd do if we were starting today." [CLICK]`);

};
