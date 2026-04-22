/**
 * slides-s2.js — Section 2: Why OTel (and why we rejected the alternatives)
 * Slides: 7 (divider) + 8, 9, 10 = 4 slides
 */

const path = require('path');
const { colors, fonts, IMG, makeShadow, addDividerSlide, addContentSlide, addCard, addAccentBar, addBottomStrip } = require('./theme');

const SECTION_LABEL = 'SECTION 2 — WHY OTEL';

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 7: Section 2 Divider
  // -------------------------------------------------------------------------
  addDividerSlide(pres, {
    title: 'Why OTel (and why we\nrejected the alternatives)',
    subtitle: 'We almost chose New Relic. Here\'s what stopped us.',
    sectionNum: 2,
    imagePath: path.join(IMG, '10-s2-divider.jpg'),
    speakerNotes: `TALKING POINTS:
• "When we decided to leave Datadog, we didn't automatically go to OTel."
• "We ran an actual evaluation. Three finalists."
• [PAUSE] "This section is short — 3 minutes — because the decision turned out not to be close."

PACING:
[~20 sec. Set the frame: this was a real evaluation, not an ideological choice.]

TRANSITION:
"New Relic almost won." [CLICK]`,
  });

  // -------------------------------------------------------------------------
  // Slide 8: We almost went New Relic
  // -------------------------------------------------------------------------
  const s8 = pres.addSlide();
  s8.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s8);
  s8.addText('We almost chose New Relic', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 28, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Two-column comparison
  const leftX = 0.4;
  const rightX = 5.2;
  const colW = 4.5;
  // Headers
  s8.addText('New Relic (finalist)', {
    x: leftX, y: 1.0, w: colW, h: 0.4,
    fontSize: 15, color: colors.amber, fontFace: fonts.title,
    bold: true, align: 'center',
  });
  s8.addText('OTel + self-hosted', {
    x: rightX, y: 1.0, w: colW, h: 0.4,
    fontSize: 15, color: colors.mossGreen, fontFace: fonts.title,
    bold: true, align: 'center',
  });
  // Header underlines
  s8.addShape('line', { x: leftX, y: 1.42, w: colW, h: 0, line: { color: colors.amber, width: 1.5 } });
  s8.addShape('line', { x: rightX, y: 1.42, w: colW, h: 0, line: { color: colors.mossGreen, width: 1.5 } });
  // Vertical divider
  s8.addShape('line', { x: 4.95, y: 0.9, w: 0, h: 5.8, line: { color: colors.lightGray, width: 0.75 } });

  const nrPros = [
    '✓ Familiar UI to current team',
    '✓ Integrated APM + logs + alerts',
    '✓ Shorter migration timeline (~3 mo)',
    '✗ Still per-ingestion pricing',
    '✗ Similar cardinality cost risk',
    '✗ Another proprietary lock-in',
    '✗ Agent instrumentation = rewrite anyway',
  ];
  const otelPros = [
    '✓ Vendor-neutral, open standard',
    '✓ Per-sample cost model (Mimir)',
    '✓ Cardinality cost = compute, not $',
    '✓ Industry direction (CNCF)',
    '✗ Longer migration (we said 6 mo…)',
    '✗ Need platform eng to run it',
    '✗ Tooling less mature than Datadog',
  ];
  nrPros.forEach((item, i) => {
    const isPos = item.startsWith('✓');
    s8.addText(item, {
      x: leftX + 0.15, y: 1.6 + i * 0.53, w: colW - 0.3, h: 0.45,
      fontSize: 12, color: isPos ? colors.mossGreen : colors.coral,
      fontFace: fonts.body, align: 'left',
    });
  });
  otelPros.forEach((item, i) => {
    const isPos = item.startsWith('✓');
    s8.addText(item, {
      x: rightX + 0.15, y: 1.6 + i * 0.53, w: colW - 0.3, h: 0.45,
      fontSize: 12, color: isPos ? colors.mossGreen : colors.coral,
      fontFace: fonts.body, align: 'left',
    });
  });
  addBottomStrip(s8, SECTION_LABEL);
  s8.addNotes(`TALKING POINTS:
• "New Relic was the runner-up. And honestly, if our only goal was 'get off Datadog fast,' we would have picked it."
• "The migration would have been maybe 3 months. The UI is familiar. The feature set is comparable."
• "But look at the right side of the cons list for New Relic: still per-ingestion pricing, still proprietary lock-in."
• "We were going to rewrite our agent instrumentation anyway — Datadog's APM tracing is non-standard. If you're doing that work, you might as well instrument to the open standard."
• [FOR MANAGERS:] "The OTel path costs more upfront but the exit ramp is cheap. If Grafana Cloud prices us out in 3 years, we can move to any OTel-compatible backend. With New Relic, we'd be having this conversation again."

PACING:
[~60 sec. Walk the comparison. Don't linger — this is context, not the main story.]

TRANSITION:
"The decision came down to three things." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 9: Decision criteria
  // -------------------------------------------------------------------------
  const s9 = pres.addSlide();
  s9.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s9);
  s9.addText('Our three decision criteria', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 28, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  const criteria = [
    {
      title: '01  Portability',
      body: [
        'Never rewrite instrumentation again',
        'OTLP is becoming the default SDK for most languages',
        'If we migrate backends in 3 years, code changes = near zero',
      ],
    },
    {
      title: '02  Cost model',
      body: [
        'Per-sample pricing (Mimir/Prometheus) vs. per-tag-combination',
        'Cardinality mistakes cost compute, not money',
        'Predictable scaling: cost ~ data volume, not data structure',
      ],
    },
    {
      title: '03  Community momentum',
      body: [
        'CNCF graduated project (2023)',
        'Every major cloud has native OTLP endpoint',
        'Tooling catching up fast — Grafana Stack is now production-grade',
      ],
    },
  ];
  criteria.forEach((c, i) => {
    const xPos = 0.4 + i * 3.1;
    addCard(s9, {
      x: xPos, y: 1.0, w: 2.9, h: 5.2,
      accentColor: colors.signalTeal,
      title: c.title,
      bodyText: c.body,
      bodySize: 12,
    });
  });
  addBottomStrip(s9, SECTION_LABEL);
  s9.addNotes(`TALKING POINTS:
• "Three things. Not a long list."
• [Point to Portability:] "We were tired of instrumentation rewrites. Switching from Datadog APM to anything meant a rewrite. OTLP means we only do it once."
• [Point to Cost model:] "This was the big one. Per-sample pricing means our cost is predictable. We can add a high-cardinality label and the worst case is some extra compute — not a $100k surprise on the next invoice."
• [Point to Community:] "Three years ago this would have been a risk. Not today. The ecosystem has arrived."
• [FOR DEVS:] "The portability argument will matter to you directly — your instrumentation code won't be ripped out again in 3 years."

PACING:
[~60 sec. These three cards are the intellectual core of section 2. Give each one 15 seconds.]

TRANSITION:
"So the decision was OTel. Now we had to figure out how to actually do it." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 10: The choice
  // -------------------------------------------------------------------------
  const s10 = pres.addSlide();
  s10.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s10);
  s10.addText('The decision', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 28, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Central statement
  s10.addShape('rect', {
    x: 0.8, y: 1.4, w: 8.4, h: 2.8,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  s10.addText('OTel Collector + Grafana Stack\n(Tempo / Mimir / Loki)', {
    x: 0.8, y: 1.4, w: 8.4, h: 2.8,
    fontSize: 30, color: colors.iceWhite, fontFace: fonts.title,
    bold: true, align: 'center', valign: 'middle',
  });
  // Three small items below
  const decisions = [
    { label: 'Traces', backend: 'Grafana Cloud / Tempo' },
    { label: 'Metrics', backend: 'Self-hosted Mimir' },
    { label: 'Logs', backend: 'Self-hosted Loki' },
  ];
  decisions.forEach((d, i) => {
    const xPos = 0.8 + i * 2.9;
    s10.addShape('rect', {
      x: xPos, y: 4.5, w: 2.6, h: 0.9,
      fill: { color: colors.cloudWhite },
      line: { color: colors.steelBlue, width: 0.75 },
    });
    s10.addText(d.label, {
      x: xPos + 0.1, y: 4.56, w: 2.4, h: 0.3,
      fontSize: 13, color: colors.steelBlue, fontFace: fonts.body,
      bold: true, align: 'center',
    });
    s10.addText(d.backend, {
      x: xPos + 0.1, y: 4.88, w: 2.4, h: 0.3,
      fontSize: 11, color: colors.slate, fontFace: fonts.body,
      align: 'center',
    });
  });
  addBottomStrip(s10, SECTION_LABEL);
  s10.addNotes(`TALKING POINTS:
• "The decision: OTel Collector as the universal ingestion layer, Grafana Stack for storage and visualization."
• "Three backends: Tempo for traces, Mimir for metrics, Loki for logs. The same Grafana UI across all three."
• "Traces to Grafana Cloud because the volume is manageable there. Metrics to self-hosted because that's where the cost pressure was."
• "Logs to self-hosted Loki because we were already using it for Kubernetes logs — the incremental cost was minimal."
• "Simple in theory. Here's how it went in practice."

PACING:
[~45 sec. This is a transition slide. Don't over-explain — the audience will see the details in section 3.]

TRANSITION:
"The migration. Four acts. Ten months." [CLICK]`);

};
