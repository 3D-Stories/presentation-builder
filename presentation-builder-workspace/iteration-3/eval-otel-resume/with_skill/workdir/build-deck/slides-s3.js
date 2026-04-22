/**
 * slides-s3.js — Section 3: The migration in four acts
 * Slides: 11 (divider) + 12, 13, 14, 15, 16, 17, 18 = 8 slides
 */

const path = require('path');
const { colors, fonts, IMG, makeShadow, makeCardShadow, addDividerSlide, addAccentBar, addBottomStrip, addStat, addCard, addCode } = require('./theme');

const SECTION_LABEL = 'SECTION 3 — THE MIGRATION IN FOUR ACTS';

module.exports = function(pres) {

  // -------------------------------------------------------------------------
  // Slide 11: Section 3 Divider
  // -------------------------------------------------------------------------
  addDividerSlide(pres, {
    title: 'The migration in four acts',
    subtitle: 'Collector → Traces → Metrics → Logs. Planned: 6 months. Actual: 10.',
    sectionNum: 3,
    imagePath: path.join(IMG, '17-s3-divider.jpg'),
    speakerNotes: `TALKING POINTS:
• "The migration had four phases. We ran them sequentially — each one unlocked the next."
• "We planned 6 months. It took 10."
• [PAUSE] "I'm going to tell you exactly where the time went."

PACING:
[~20 sec.]

TRANSITION:
"Here's the timeline." [CLICK]`,
  });

  // -------------------------------------------------------------------------
  // Slide 12: Overview / Gantt — Timeline Planned vs. Actual
  // -------------------------------------------------------------------------
  const s12 = pres.addSlide();
  s12.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s12);
  s12.addText('Migration Timeline: Planned vs. Actual', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 24, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  // Gantt chart — horizontal bar chart with planned (outline) and actual (filled) bars
  const ganttRows = [
    { label: 'Collector', planned: [0, 1], actual: [0, 1], status: 'On time' },
    { label: 'Traces', planned: [1, 2], actual: [1, 3], status: '+1 month slip' },
    { label: 'Metrics', planned: [2, 4], actual: [2, 7], status: '+3 month slip' },
    { label: 'Logs + Alerts', planned: [4, 6], actual: [6, 10], status: '+4 month slip' },
  ];
  const ganttStartX = 1.8;
  const ganttMaxW = 7.0;
  const totalMonths = 10;
  const ganttRowH = 0.7;
  const ganttStartY = 1.0;
  const barH = 0.28;
  // Month labels
  for (let m = 0; m <= totalMonths; m += 1) {
    s12.addText(`M${m}`, {
      x: ganttStartX + (m / totalMonths) * ganttMaxW - 0.1, y: 0.85,
      w: 0.3, h: 0.2,
      fontSize: 9, color: colors.slate, fontFace: fonts.body,
      align: 'center',
    });
    // Gridline
    s12.addShape('line', {
      x: ganttStartX + (m / totalMonths) * ganttMaxW, y: 1.0,
      w: 0, h: ganttRows.length * ganttRowH + 0.1,
      line: { color: colors.lightGray, width: 0.3 },
    });
  }
  ganttRows.forEach((row, i) => {
    const yPos = ganttStartY + i * ganttRowH;
    // Row label
    s12.addText(row.label, {
      x: 0.1, y: yPos + 0.1, w: 1.6, h: 0.5,
      fontSize: 12, color: colors.slate, fontFace: fonts.body,
      bold: true, align: 'right',
    });
    // Planned bar (hollow outline — steelBlue border)
    const pStartX = ganttStartX + (row.planned[0] / totalMonths) * ganttMaxW;
    const pW = Math.max(((row.planned[1] - row.planned[0]) / totalMonths) * ganttMaxW, 0.05);
    s12.addShape('rect', {
      x: pStartX, y: yPos + 0.05, w: pW, h: barH,
      fill: { type: 'none' },
      line: { color: colors.steelBlue, width: 1.5 },
    });
    // Actual bar (filled Signal Teal or Amber if slipped)
    const aColor = row.actual[1] > row.planned[1] ? colors.amber : colors.signalTeal;
    const aStartX = ganttStartX + (row.actual[0] / totalMonths) * ganttMaxW;
    const aW = Math.max(((row.actual[1] - row.actual[0]) / totalMonths) * ganttMaxW, 0.05);
    s12.addShape('rect', {
      x: aStartX, y: yPos + 0.35, w: aW, h: barH,
      fill: { color: aColor },
      line: { color: aColor },
    });
    // Status label
    s12.addText(row.status, {
      x: ganttStartX + (row.actual[1] / totalMonths) * ganttMaxW + 0.1,
      y: yPos + 0.35, w: 2.0, h: barH,
      fontSize: 10, color: row.status === 'On time' ? colors.mossGreen : colors.amber,
      fontFace: fonts.body, bold: true, align: 'left',
    });
  });
  // Legend
  s12.addShape('rect', { x: 0.4, y: 4.1, w: 0.5, h: 0.22, fill: { type: 'none' }, line: { color: colors.steelBlue, width: 1.5 } });
  s12.addText('Planned', { x: 0.95, y: 4.1, w: 1.2, h: 0.22, fontSize: 11, color: colors.steelBlue, fontFace: fonts.body });
  s12.addShape('rect', { x: 2.3, y: 4.1, w: 0.5, h: 0.22, fill: { color: colors.signalTeal }, line: { color: colors.signalTeal } });
  s12.addText('Actual (on time)', { x: 2.85, y: 4.1, w: 1.8, h: 0.22, fontSize: 11, color: colors.signalTeal, fontFace: fonts.body });
  s12.addShape('rect', { x: 4.8, y: 4.1, w: 0.5, h: 0.22, fill: { color: colors.amber }, line: { color: colors.amber } });
  s12.addText('Actual (slipped)', { x: 5.35, y: 4.1, w: 1.8, h: 0.22, fontSize: 11, color: colors.amber, fontFace: fonts.body });
  addBottomStrip(s12, SECTION_LABEL);
  s12.addNotes(`TALKING POINTS:
• "The hollow bars are what we planned. The filled bars are what actually happened."
• "Act 1 — collector: on time. This is the easy win. DaemonSet deployment, one sprint."
• "Act 2 — traces: one month slip. Service teams had to rewrite trace instrumentation that was Datadog-APM-specific. About 3 weeks per team."
• "Act 3 — metrics: three month slip. This is where the alerting rewrite ambushed us."
• "Act 4 — logs and alerts: four month slip total. Logs were actually easy. Alerts were not."
• [FOR MANAGERS:] "The 4-month slip on logs/alerts isn't because logs are hard. It's because we got there burned out, and we hadn't budgeted the alerting rewrite."

PACING:
[~75 sec. Walk the chart row by row. The slips are the story — don't gloss over them.]

TRANSITION:
"Let's look at the collector architecture we landed on, then we'll walk each act." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 13: Collector Architecture (native PPTX diagram)
  // -------------------------------------------------------------------------
  const s13 = pres.addSlide();
  s13.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s13);
  s13.addText('OTel Collector Architecture', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 24, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });

  // Architecture diagram — boxes + arrows, left to right
  // Layer 1: Receivers
  const archY = 1.2;
  const boxH = 0.85;
  const boxW = 1.8;
  const arrowW = 0.5;

  // Helper: add architecture box
  function addArchBox(slide, x, y, label, sublabel, color) {
    slide.addShape('rect', {
      x, y, w: boxW, h: boxH,
      fill: { color: color || colors.steelBlue },
      line: { color: color || colors.steelBlue },
    });
    slide.addText(label, {
      x: x + 0.05, y: y + 0.1, w: boxW - 0.1, h: 0.35,
      fontSize: 11, color: colors.white, fontFace: fonts.body,
      bold: true, align: 'center',
    });
    if (sublabel) {
      slide.addText(sublabel, {
        x: x + 0.05, y: y + 0.45, w: boxW - 0.1, h: 0.32,
        fontSize: 9, color: colors.iceWhite, fontFace: fonts.body,
        align: 'center',
      });
    }
  }

  function addArrow(slide, x, y) {
    slide.addShape('line', {
      x: x, y: y + boxH / 2, w: arrowW, h: 0,
      line: { color: colors.signalTeal, width: 2, endArrowType: 'open' },
    });
  }

  // Two tiers: Agent (DaemonSet) and Gateway (Deployment)
  s13.addText('Agent tier (DaemonSet — per node)', {
    x: 0.3, y: archY - 0.35, w: 5.5, h: 0.3,
    fontSize: 10, color: colors.steelBlue, fontFace: fonts.body,
    bold: true, italic: true, align: 'left',
  });
  // Receivers
  addArchBox(s13, 0.3, archY, 'Receivers', 'OTLP / Prometheus', colors.steelBlue);
  addArrow(s13, 0.3 + boxW, archY);
  // Processors
  addArchBox(s13, 0.3 + boxW + arrowW, archY, 'Processors', 'enrich k8s attrs\nbatch', colors.steelBlue);
  addArrow(s13, 0.3 + boxW + arrowW + boxW, archY);
  // Gateway label
  s13.addText('Gateway tier (Deployment — sampling + fan-out)', {
    x: 0.3 + boxW * 2 + arrowW * 2 + 0.1, y: archY - 0.35, w: 5.5, h: 0.3,
    fontSize: 10, color: colors.signalTeal, fontFace: fonts.body,
    bold: true, italic: true, align: 'left',
  });
  // Gateway Processors
  addArchBox(s13, 0.3 + boxW * 2 + arrowW * 2, archY, 'Processors', 'tail sampling\nfilter', colors.signalTeal);
  addArrow(s13, 0.3 + boxW * 3 + arrowW * 2, archY);
  // Exporters
  addArchBox(s13, 0.3 + boxW * 3 + arrowW * 3, archY, 'Exporters', 'OTLP / Prom-write', colors.signalTeal);

  // Fan-out arrows to backends
  const exporterX = 0.3 + boxW * 3 + arrowW * 3;
  const exporterMidX = exporterX + boxW;
  const backendStartY = archY + boxH + 0.7;
  const backends = [
    { label: 'Tempo', sublabel: 'Traces\n(Grafana Cloud)', color: colors.deepNavy, offset: 0 },
    { label: 'Mimir', sublabel: 'Metrics\n(self-hosted)', color: colors.deepNavy, offset: 2.0 },
    { label: 'Loki', sublabel: 'Logs\n(self-hosted)', color: colors.deepNavy, offset: 4.0 },
  ];
  backends.forEach((b) => {
    const bX = exporterX - 0.5 + b.offset;
    s13.addShape('line', {
      x: exporterMidX - 0.5 + b.offset / 3, y: archY + boxH,
      w: 0, h: 0.7,
      line: { color: colors.signalTeal, width: 1.5 },
    });
    addArchBox(s13, bX, backendStartY, b.label, b.sublabel, b.color);
  });

  addBottomStrip(s13, SECTION_LABEL);
  s13.addNotes(`TALKING POINTS:
• "Here's the architecture we landed on. Two tiers."
• "Agent tier: a DaemonSet on every node. It receives telemetry from your services, enriches it with Kubernetes metadata, and forwards it."
• "Gateway tier: a Deployment that handles tail-based sampling and fan-out to three backends."
• [Point to backends:] "Tempo for traces, Mimir for metrics, Loki for logs. Three separate stores, one unified Grafana frontend."
• [FOR DEVS:] "The key decision here was gateway-level tail sampling. This is what allows us to keep 100% of error traces while sampling normal traffic at 1%. But it has a scaling constraint — all spans for a trace have to hit the same gateway instance."
• "You'll see that constraint again in section 4."

PACING:
[~60 sec. Walk left to right. Don't over-explain — the architecture is the setup for the per-act lessons.]

TRANSITION:
"Act 1: the collector." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 14: Act 1 — Collector
  // -------------------------------------------------------------------------
  const s14 = pres.addSlide();
  s14.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s14);
  s14.addText('Act 1: Collector deployment', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  s14.addText('On time — 1 month', {
    x: 0.4, y: 0.75, w: 3, h: 0.35,
    fontSize: 14, color: colors.mossGreen, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  addCard(s14, {
    x: 0.4, y: 1.2, w: 4.5, h: 5.3,
    accentColor: colors.mossGreen,
    title: 'What went well',
    bodyText: [
      'Helm chart deployment — 1 sprint, 22 clusters',
      'OTLP receiver handles all language SDKs with zero config changes at service level initially',
      'Gateway tier added in month 2 — tail sampling working on day 1',
      'Datadog agent stayed running in parallel — no big-bang cutover',
      'K8s attribute enrichment worked out of the box',
    ],
    bodySize: 12,
  });
  addCard(s14, {
    x: 5.1, y: 1.2, w: 4.5, h: 5.3,
    accentColor: colors.amber,
    title: 'What didn\'t',
    bodyText: [
      'Config sprawl hit immediately — 6 different configs for 6 cluster types',
      'Tail-based sampling pins gateway scaling: all spans of a trace must hit same instance (still unsolved)',
      'OTLP + Prometheus receiver conflict on scrape interval — needed manual workaround',
      'Operational runbooks didn\'t exist — wrote them post-deployment',
    ],
    bodySize: 12,
  });
  addBottomStrip(s14, SECTION_LABEL);
  s14.addNotes(`TALKING POINTS:
• "Act 1 was the good news. The collector deployed on time."
• "The Helm chart deployment was clean. We ran Datadog agent alongside the OTel collector for 6 weeks — both receiving the same telemetry — before we cut over anything."
• [Good side:] "The parallel running period was invaluable. We caught three signal differences in metric labels before we made metrics the source of truth."
• [Didn't side:] "Config sprawl was immediate. We had 6 cluster types — dev, staging, three prod tiers, and a customer-dedicated cluster. Six configs. Four of them drifted within two months."
• [FOR DEVS:] "The tail-based sampling pinning problem is real. We still don't have a clean solution. If you have a horizontally-scaled gateway and a multi-span trace, every span needs to reach the same instance. Our current answer is sticky session routing, which works but doesn't scale elegantly."

PACING:
[~90 sec. Two columns — walk left then right. The tail sampling pin problem is worth 15 seconds on its own.]

TRANSITION:
"Act 2: traces." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 15: Act 2 — Traces
  // -------------------------------------------------------------------------
  const s15 = pres.addSlide();
  s15.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s15);
  s15.addText('Act 2: Traces to Tempo', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  s15.addText('+1 month slip (M2 → M3)', {
    x: 0.4, y: 0.75, w: 3.5, h: 0.35,
    fontSize: 14, color: colors.amber, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  addCard(s15, {
    x: 0.4, y: 1.2, w: 4.5, h: 5.3,
    accentColor: colors.mossGreen,
    title: 'What went well',
    bodyText: [
      'OTLP → Tempo works natively with zero serialization issues',
      'Grafana Explore / TraceQL immediately useful — teams switched fast',
      'Service maps from Tempo in Grafana replaced Datadog APM overview',
      'Grafana Cloud Tempo pricing was reasonable for our trace volume',
      '2 services migrated first — reduced blast radius during learning',
    ],
    bodySize: 12,
  });
  addCard(s15, {
    x: 5.1, y: 1.2, w: 4.5, h: 5.3,
    accentColor: colors.amber,
    title: 'What didn\'t',
    bodyText: [
      'Datadog APM instrumentation is non-standard — teams had to rewrite trace instrumentation (~3 weeks per team)',
      'Auto-instrumentation agents (Java, Python) needed version upgrades',
      'Distributed context propagation broke in 2 services using older SDKs (B3 vs W3C headers)',
      'Datadog trace correlation with logs relied on Datadog-specific trace IDs',
    ],
    bodySize: 12,
  });
  addBottomStrip(s15, SECTION_LABEL);
  s15.addNotes(`TALKING POINTS:
• "Traces was the act where we realized the migration was bigger than we thought."
• "Datadog APM is not just an agent — it injects proprietary trace context. You can't just swap it out."
• [Didn't side:] "Every service team had to rewrite trace instrumentation. That's 3 weeks per team, and we had teams doing it in parallel. But it still added a month."
• [Good side:] "The silver lining: once teams were on OTLP, they loved TraceQL. It's better than Datadog's trace search for complex queries."
• [FOR DEVS:] "The B3 vs W3C headers issue caught us by surprise. If you have services using older OpenTracing SDKs, they default to B3. OTLP uses W3C. You need a conversion layer in the collector or broken distributed traces."
• "Lesson: budget 3 weeks per service team for the trace rewrite. Don't assume auto-instrumentation covers it."

PACING:
[~90 sec.]

TRANSITION:
"Act 3: metrics. This is where the real pain lived." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 16: Act 3 — Metrics
  // -------------------------------------------------------------------------
  const s16 = pres.addSlide();
  s16.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s16);
  s16.addText('Act 3: Metrics to Mimir', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  s16.addText('+3 month slip (M4 → M7)', {
    x: 0.4, y: 0.75, w: 3.5, h: 0.35,
    fontSize: 14, color: colors.coral, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  addCard(s16, {
    x: 0.4, y: 1.2, w: 4.5, h: 5.3,
    accentColor: colors.mossGreen,
    title: 'What went well',
    bodyText: [
      'Prometheus Remote Write → Mimir is battle-tested — no data loss',
      'Mimir multi-tenancy allowed per-team metric isolation',
      'Cost curve immediately flattened after migration to Mimir',
      'Grafana dashboards migrated in bulk — 85% of PromQL worked unmodified',
      'Cardinality limits enforced at ingest — forces discipline',
    ],
    bodySize: 12,
  });
  addCard(s16, {
    x: 5.1, y: 1.2, w: 4.5, h: 5.3,
    accentColor: colors.coral,
    title: 'What didn\'t',
    bodyText: [
      'Alerting rewrite: 120 Datadog monitor → Prometheus alert rule translations, ~30% behavioral drift',
      '15 alerts silently wrong in staging — behavior differs from Datadog conditions',
      'Metric naming conventions differed — many queries broke',
      'Recording rules needed for performance — not planned, added 3 weeks',
      'Two chart migrations had to be done by hand — Datadog expressions don\'t translate',
    ],
    bodySize: 12,
  });
  addBottomStrip(s16, SECTION_LABEL);
  s16.addNotes(`TALKING POINTS:
• "Metrics was the big slip. Three months."
• "Here's the root cause: 120 Datadog monitors. We assumed they'd translate 1:1 to Prometheus alert rules. They don't."
• [Didn't side:] "The behavioral model is different. Datadog monitors have 'no data' behavior, 'as count' vs 'as rate' semantics, and threshold recovery conditions that don't map cleanly to Prometheus rules. We rebuilt them by hand and still got 15 wrong — all caught in staging, thankfully."
• [Good side:] "The cost curve flattening was real and immediate. Week 1 on Mimir, our custom metric cost went to near-zero."
• [FOR DEVS:] "Budget the alerting rewrite separately. It's 30% of the total metrics migration effort. We didn't. That's where the 3 months went."
• [FOR MANAGERS:] "The 30% alerting rewrite figure will come up again in section 4. Plan for it explicitly."

PACING:
[~90 sec.]

TRANSITION:
"Act 4: logs. This one was supposed to be hard." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 17: Act 4 — Logs (different layout: pipeline flow diagram)
  // -------------------------------------------------------------------------
  const s17 = pres.addSlide();
  s17.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s17);
  s17.addText('Act 4: Logs to Loki', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 26, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  s17.addText('+4 month slip (total), but logs took 3 weeks', {
    x: 0.4, y: 0.75, w: 5, h: 0.35,
    fontSize: 13, color: colors.mossGreen, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  s17.addText('(the slip was getting there burned out)', {
    x: 5.5, y: 0.75, w: 4, h: 0.35,
    fontSize: 12, color: colors.amber, fontFace: fonts.body,
    italic: true, align: 'left',
  });
  // Log pipeline flow diagram
  s17.addText('Log collection path:', {
    x: 0.4, y: 1.3, w: 3, h: 0.3,
    fontSize: 12, color: colors.steelBlue, fontFace: fonts.body,
    bold: true, align: 'left',
  });
  const pipelineItems = [
    { label: 'fluent-bit\n(DaemonSet)', sublabel: 'Parses\nlog files', color: colors.steelBlue },
    { label: 'OTel Collector\n(Agent)', sublabel: 'OTLP log\nreceiver', color: colors.steelBlue },
    { label: 'OTel Collector\n(Gateway)', sublabel: 'Loki exporter\n+ filtering', color: colors.signalTeal },
    { label: 'Loki', sublabel: 'LogQL queries\n+ alerting', color: colors.deepNavy },
  ];
  const pipeW = 2.0;
  const pipeH = 1.2;
  const pipeStartX = 0.4;
  const pipeY = 1.8;
  pipelineItems.forEach((item, i) => {
    const x = pipeStartX + i * (pipeW + 0.4);
    s17.addShape('rect', {
      x, y: pipeY, w: pipeW, h: pipeH,
      fill: { color: item.color },
      line: { color: item.color },
    });
    s17.addText(item.label, {
      x: x + 0.05, y: pipeY + 0.1, w: pipeW - 0.1, h: 0.55,
      fontSize: 11, color: colors.white, fontFace: fonts.body,
      bold: true, align: 'center',
    });
    s17.addText(item.sublabel, {
      x: x + 0.05, y: pipeY + 0.65, w: pipeW - 0.1, h: 0.45,
      fontSize: 10, color: colors.iceWhite, fontFace: fonts.body,
      align: 'center',
    });
    if (i < pipelineItems.length - 1) {
      s17.addShape('line', {
        x: x + pipeW, y: pipeY + pipeH / 2,
        w: 0.4, h: 0,
        line: { color: colors.signalTeal, width: 2, endArrowType: 'open' },
      });
    }
  });
  // What changed callouts
  const changes = [
    { title: 'Log format standardization', body: 'Structured JSON → OTLP LogRecord. One-time fluent-bit config update.' },
    { title: 'Label explosion avoided', body: 'Loki labels kept minimal: namespace, app, level. Everything else as indexed fields.' },
    { title: 'LogQL vs Datadog Log search', body: 'Different syntax but teams adapted in ~1 week. LogQL is more powerful for structured logs.' },
  ];
  changes.forEach((c, i) => {
    addCard(s17, {
      x: 0.4 + i * 3.15, y: 3.3, w: 3.0, h: 2.6,
      accentColor: colors.signalTeal,
      title: c.title,
      bodyText: [c.body],
      bodySize: 11,
    });
  });
  addBottomStrip(s17, SECTION_LABEL);
  s17.addNotes(`TALKING POINTS:
• "Logs were supposed to be the hardest act. They turned out to be the easiest."
• "We were already using Loki for Kubernetes system logs. Migrating OTel log records into it was essentially a config change in the collector — a Loki exporter."
• "The actual migration took 3 weeks. The 4-month slip on the overall timeline was cumulative — we got to Act 4 burned out from Acts 2 and 3."
• [Point to pipeline:] "The log collection path: fluent-bit parses log files from pods, forwards to the OTel collector agent, which forwards to the gateway, which exports to Loki. One-way flow."
• [FOR DEVS:] "The Loki label discipline is critical. We kept labels to three: namespace, app, severity. Everything else is an indexed field. If you add high-cardinality labels to Loki, you recreate the Datadog cost problem in your log store."
• "The lesson from Act 4 is about sequencing: logs should probably go before metrics. Logs are fast, metrics are slow. Reversing the order would have let us get a win earlier and reduce burnout."

PACING:
[~90 sec.]

TRANSITION:
"So the migration took 10 months. What would we have done differently if we'd known? Let me show you the three traps." [CLICK]`);

  // -------------------------------------------------------------------------
  // Slide 18: Timeline lessons
  // -------------------------------------------------------------------------
  const s18 = pres.addSlide();
  s18.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.cloudWhite }, line: { color: colors.cloudWhite } });
  addAccentBar(s18);
  s18.addText('By the numbers: actual vs. planned', {
    x: 0.4, y: 0.18, w: 9, h: 0.6,
    fontSize: 24, color: colors.slate, fontFace: fonts.title,
    bold: true, align: 'left',
  });
  addStat(s18, { x: 0.4, y: 1.2, number: '6 mo', label: 'Planned', context: 'Original approved timeline', color: colors.steelBlue });
  addStat(s18, { x: 3.5, y: 1.2, number: '10 mo', label: 'Actual', context: '4 months over plan', color: colors.amber });
  addStat(s18, { x: 6.6, y: 1.2, number: '120', label: 'Alert rules rewritten', context: '~30% of total effort', color: colors.coral });
  // Key lesson
  s18.addShape('rect', {
    x: 0.4, y: 3.1, w: 9.2, h: 1.9,
    fill: { color: colors.deepNavy },
    line: { color: colors.deepNavy },
  });
  s18.addText('The single biggest underestimate: the alerting rewrite.\nIt\'s not a migration task — it\'s a system rebuild.', {
    x: 0.5, y: 3.1, w: 9.0, h: 1.9,
    fontSize: 18, color: colors.iceWhite, fontFace: fonts.title,
    bold: true, align: 'center', valign: 'middle',
  });
  addBottomStrip(s18, SECTION_LABEL);
  s18.addNotes(`TALKING POINTS:
• "The summary of the migration: 6 months planned, 10 actual."
• "120 alert rules rewritten by hand. That alone was 30% of the total effort."
• [Point to the dark box:] "If you take nothing else from section 3, take this: the alerting rewrite is not a migration task. It's a system rebuild. Treat it as a separate project with its own timeline and owner."
• "We did not do that. We treated it as 'a few days of work.' It was 8 weeks."
• [FOR MANAGERS:] "When you scope your migration, ask your team: 'how many alert rules do you have?' If the answer is more than 50, add 6-8 weeks to your estimate."

PACING:
[~60 sec. This is the section wrap-up. Let the dark box land. Then transition.]

TRANSITION:
"Which brings me to the three things we wish we'd known before we started." [CLICK]`);

};
