/**
 * build.js — OTel Migration Deck (Phase 3: Build)
 * Design spec: docs/superpowers/specs/2026-04-15-otel-migration-design.md
 * Run: NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build.js
 */

const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.join(
  __dirname,
  "..",
  "outputs"
);
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const pptx = new PptxGenJS();

// ─── Theme ───────────────────────────────────────────────────────────────────
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
pptx.title = "OTel Migration: From $720k Datadog Bills to Self-Hosted Observability";
pptx.author = "Platform Team";
pptx.subject = "Observability Migration — internal platform summit 2026";

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  bg: "0F1117",        // near-black background
  surface: "1C1F2B",  // card background
  accent: "F46800",   // OTel orange
  blue: "3B82F6",     // highlight blue
  green: "22C55E",    // success / positive
  red: "EF4444",      // warning / problem
  textPrimary: "F1F5F9",
  textSecondary: "94A3B8",
  textMuted: "64748B",
  divider: "2D3148",
  white: "FFFFFF",
};

// ─── Typography helpers ───────────────────────────────────────────────────────
const T = {
  hero: { fontSize: 44, bold: true, color: C.textPrimary },
  h1:   { fontSize: 32, bold: true, color: C.textPrimary },
  h2:   { fontSize: 24, bold: true, color: C.textPrimary },
  h3:   { fontSize: 18, bold: true, color: C.textPrimary },
  body: { fontSize: 16, color: C.textSecondary },
  small:{ fontSize: 13, color: C.textMuted },
  note: { fontSize: 12, color: C.textMuted, italic: true },
  stat: { fontSize: 48, bold: true, color: C.accent },
  statSub: { fontSize: 16, color: C.textSecondary },
  label: { fontSize: 14, bold: true, color: C.textPrimary },
};

// ─── Shared layout constants ──────────────────────────────────────────────────
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;
const PAD = 0.55;        // slide edge padding
const CONTENT_TOP = 1.5; // top of content area below title

// ─── Helpers ─────────────────────────────────────────────────────────────────
function addSlide(opts = {}) {
  const slide = pptx.addSlide();
  // Background
  slide.background = { color: opts.bgColor || C.bg };
  return slide;
}

function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? PAD,
    y: opts.y ?? 0.32,
    w: opts.w ?? SLIDE_W - PAD * 2,
    h: opts.h ?? 0.9,
    fontSize: opts.fontSize ?? 26,
    bold: true,
    color: opts.color ?? C.textPrimary,
    fontFace: "Calibri",
  });
  // Accent rule below title
  if (opts.rule !== false) {
    slide.addShape(pptx.ShapeType.rect, {
      x: PAD,
      y: 1.28,
      w: 0.45,
      h: 0.045,
      fill: { color: C.accent },
      line: { color: C.accent },
    });
  }
}

function addBodyText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: opts.fontSize ?? 15,
    color: opts.color ?? C.textSecondary,
    fontFace: "Calibri",
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    wrap: true,
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    paraSpaceAfter: opts.paraSpaceAfter ?? 4,
  });
}

function addStatBox(slide, stat, label, x, y, w = 2.6, h = 1.5, color = C.accent) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: C.surface },
    line: { color: C.divider, width: 1 },
    shadow: { type: "outer", blur: 8, offset: 2, angle: 45, color: "000000", opacity: 0.4 },
  });
  slide.addText(stat, {
    x, y: y + 0.18, w, h: 0.7,
    fontSize: 36, bold: true, color: color, fontFace: "Calibri", align: "center",
  });
  slide.addText(label, {
    x, y: y + 0.85, w, h: 0.5,
    fontSize: 13, color: C.textSecondary, fontFace: "Calibri", align: "center", wrap: true,
  });
}

function addCallout(slide, text, x, y, w, h, fillColor = C.surface, textColor = C.textPrimary) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: fillColor },
    line: { color: C.divider, width: 1 },
  });
  slide.addText(text, {
    x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.24,
    fontSize: 14, color: textColor, fontFace: "Calibri", wrap: true, valign: "middle",
  });
}

function addBullets(slide, items, x, y, w, opts = {}) {
  const rows = items.map((item) => {
    if (typeof item === "string") {
      return [{ text: "• ", options: { bold: true, color: C.accent, fontSize: opts.fontSize ?? 15, fontFace: "Calibri" } },
              { text: item, options: { color: opts.color ?? C.textSecondary, fontSize: opts.fontSize ?? 15, fontFace: "Calibri" } }];
    }
    // item = { text, sub }
    return [{ text: "• ", options: { bold: true, color: C.accent, fontSize: opts.fontSize ?? 15, fontFace: "Calibri" } },
            { text: item.text, options: { bold: true, color: C.textPrimary, fontSize: opts.fontSize ?? 15, fontFace: "Calibri" } },
            { text: item.sub ? `  — ${item.sub}` : "", options: { color: C.textSecondary, fontSize: (opts.fontSize ?? 15) - 1, fontFace: "Calibri" } }];
  });

  // Render one text box per bullet for clean spacing
  items.forEach((item, i) => {
    const lineH = opts.lineH ?? 0.44;
    const iy = y + i * lineH;
    const displayText = typeof item === "string" ? item : `${item.text}${item.sub ? `  — ${item.sub}` : ""}`;
    slide.addText(
      [
        { text: "▸  ", options: { bold: true, color: C.accent, fontSize: opts.fontSize ?? 15, fontFace: "Calibri" } },
        { text: displayText, options: { color: opts.color ?? C.textSecondary, fontSize: opts.fontSize ?? 15, fontFace: "Calibri" } },
      ],
      { x, y: iy, w, h: lineH, valign: "middle" }
    );
  });
}


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ═══════════════════════════════════════════════════════════════════════════════
(function buildCover() {
  const slide = addSlide();

  // Big accent bar on left edge
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.12, h: SLIDE_H,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Subtle grid texture (faint horizontal lines)
  for (let row = 0; row < 8; row++) {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.12, y: row * (SLIDE_H / 8), w: SLIDE_W - 0.12, h: 0.6,
      fill: { color: "141720", transparency: 80 },
      line: { color: C.divider, width: 0.5, transparency: 70 },
    });
  }

  // Title
  slide.addText("Migrating Off Datadog:\nOTel, Self-Hosted Backends,\nand What Nobody Tells You", {
    x: 0.7, y: 1.5, w: 8.5, h: 3.5,
    fontSize: 38, bold: true, color: C.textPrimary, fontFace: "Calibri",
    lineSpacingMultiple: 1.2,
  });

  // Subtitle badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 5.1, w: 5.2, h: 0.5,
    fill: { color: C.accent, transparency: 85 },
    line: { color: C.accent, width: 1 },
  });
  slide.addText("Platform Summit 2026  |  Engineering Leaders Track  |  25 min", {
    x: 0.7, y: 5.12, w: 5.2, h: 0.46,
    fontSize: 12, color: C.accent, fontFace: "Calibri", align: "center", bold: true,
  });

  // Cost badge (right side)
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.8, y: 2.2, w: 3.0, h: 3.0,
    fill: { color: C.surface },
    line: { color: C.accent, width: 2 },
    shadow: { type: "outer", blur: 18, offset: 4, angle: 45, color: "000000", opacity: 0.5 },
  });
  slide.addText("$180k", { x: 9.8, y: 2.35, w: 3.0, h: 0.65, fontSize: 28, bold: true, color: C.green, fontFace: "Calibri", align: "center" });
  slide.addText("→ $720k/yr", { x: 9.8, y: 2.9, w: 3.0, h: 0.5, fontSize: 20, bold: true, color: C.red, fontFace: "Calibri", align: "center" });
  slide.addText("3 years, flat usage", { x: 9.8, y: 3.42, w: 3.0, h: 0.38, fontSize: 12, color: C.textSecondary, fontFace: "Calibri", align: "center" });
  slide.addShape(pptx.ShapeType.rect, {
    x: 10.4, y: 3.9, w: 1.8, h: 0.06,
    fill: { color: C.divider }, line: { color: C.divider },
  });
  slide.addText("Now: self-hosted OTel\n+Mimir+Tempo+Loki", { x: 9.8, y: 4.0, w: 3.0, h: 0.8, fontSize: 12, color: C.textSecondary, fontFace: "Calibri", align: "center", wrap: true });

  slide.addNotes("Welcome. I want to start by showing you a bill. Not to embarrass anyone — we did this to ourselves. This talk is about how a $180k/yr Datadog contract became $720k, what we decided to do about it, and the shape of the work. The honest version, including where we got burned.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Agenda
// ═══════════════════════════════════════════════════════════════════════════════
(function buildAgenda() {
  const slide = addSlide();
  addTitle(slide, "What We'll Cover");

  const acts = [
    { num: "01", title: "The Datadog Invoice That Broke Our Brain", time: "3 min", color: C.red },
    { num: "02", title: "Why OTel (and Why We Rejected the Alternatives)", time: "4 min", color: C.blue },
    { num: "03", title: "The Migration in Four Acts", time: "10 min", color: C.accent },
    { num: "04", title: "Three Things Nobody Tells You", time: "5 min", color: C.accent },
    { num: "05", title: "What We'd Do Differently", time: "3 min", color: C.green },
  ];

  acts.forEach((act, i) => {
    const y = CONTENT_TOP + i * 0.97;
    // Row background
    slide.addShape(pptx.ShapeType.rect, {
      x: PAD, y, w: SLIDE_W - PAD * 2, h: 0.86,
      fill: { color: C.surface },
      line: { color: C.divider, width: 1 },
    });
    // Number pill
    slide.addShape(pptx.ShapeType.rect, {
      x: PAD, y, w: 0.72, h: 0.86,
      fill: { color: act.color, transparency: 20 },
      line: { color: act.color, width: 1 },
    });
    slide.addText(act.num, {
      x: PAD, y, w: 0.72, h: 0.86,
      fontSize: 22, bold: true, color: act.color, fontFace: "Calibri", align: "center", valign: "middle",
    });
    // Title
    slide.addText(act.title, {
      x: PAD + 0.82, y: y + 0.18, w: 9.5, h: 0.5,
      fontSize: 16, bold: true, color: C.textPrimary, fontFace: "Calibri",
    });
    // Time badge
    slide.addText(act.time, {
      x: SLIDE_W - PAD - 1.1, y: y + 0.23, w: 1.0, h: 0.4,
      fontSize: 12, color: act.color, fontFace: "Calibri", align: "right", bold: true,
    });
  });

  slide.addNotes("Quick roadmap. We have 25 minutes. I'll keep each section tight. The section that usually generates the most questions is 'Three Things Nobody Tells You' — feel free to save questions for the end but I'll pause for a breath after section 4.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Section divider: Act 01
// ═══════════════════════════════════════════════════════════════════════════════
(function buildAct01Divider() {
  const slide = addSlide({ bgColor: C.surface });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: 0.08,
    fill: { color: C.red }, line: { color: C.red },
  });

  slide.addText("ACT 01", {
    x: PAD, y: 2.4, w: 12, h: 0.6,
    fontSize: 14, bold: true, color: C.red, fontFace: "Calibri", charSpacing: 4,
  });
  slide.addText("The Datadog Invoice\nThat Broke Our Brain", {
    x: PAD, y: 3.0, w: 12, h: 2.0,
    fontSize: 40, bold: true, color: C.textPrimary, fontFace: "Calibri", lineSpacingMultiple: 1.15,
  });
  slide.addText("3 minutes", {
    x: PAD, y: 5.1, w: 2.5, h: 0.4,
    fontSize: 14, color: C.textMuted, fontFace: "Calibri",
  });

  slide.addNotes("Transition into the cost story.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Cost explosion chart (data visualized as bars)
// ═══════════════════════════════════════════════════════════════════════════════
(function buildCostChart() {
  const slide = addSlide();
  addTitle(slide, "Our Datadog Bill — Three Years, Same Product");

  // Data
  const data = [
    { year: "2023", cost: 180, ts: 2.1 },
    { year: "2024", cost: 380, ts: 6.8 },
    { year: "2025", cost: 590, ts: 14.2 },
    { year: "2026\n(proj.)", cost: 720, ts: 19 },
  ];

  const chartLeft = PAD;
  const chartTop = CONTENT_TOP;
  const chartH = 4.0;
  const barArea = 8.5;
  const maxCost = 800;
  const barW = 1.4;
  const gap = 0.6;
  const totalBarWidth = data.length * (barW + gap) - gap;
  const startX = chartLeft + (barArea - totalBarWidth) / 2;

  // Y-axis label
  slide.addText("Annual Cost (USD)", {
    x: chartLeft, y: chartTop, w: 1.4, h: 0.4,
    fontSize: 11, color: C.textMuted, fontFace: "Calibri", align: "center",
  });

  // Grid lines
  [0, 200000, 400000, 600000, 800000].forEach((v) => {
    const yRatio = 1 - v / maxCost / 1000;
    const gy = chartTop + 0.5 + yRatio * (chartH - 0.5);
    slide.addShape(pptx.ShapeType.line, {
      x: startX, y: gy, w: totalBarWidth + 0.2, h: 0,
      line: { color: C.divider, width: 0.5, dashType: "dash" },
    });
    slide.addText(`$${v / 1000}k`, {
      x: chartLeft, y: gy - 0.15, w: 0.8, h: 0.3,
      fontSize: 10, color: C.textMuted, fontFace: "Calibri", align: "right",
    });
  });

  data.forEach((d, i) => {
    const barH = ((d.cost / 1000) / (maxCost / 1000)) * (chartH - 0.5);
    const bx = startX + i * (barW + gap);
    const by = chartTop + 0.5 + (chartH - 0.5) - barH;

    const barColor = i === 3 ? C.red : i === 0 ? C.green : C.accent;

    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by, w: barW, h: barH,
      fill: { color: barColor, transparency: i === 3 ? 40 : 0 },
      line: { color: barColor, width: 1 },
    });

    // Cost label on bar
    slide.addText(`$${d.cost}k`, {
      x: bx, y: by - 0.38, w: barW, h: 0.36,
      fontSize: 16, bold: true, color: barColor, fontFace: "Calibri", align: "center",
    });

    // Year label below
    slide.addText(d.year, {
      x: bx, y: chartTop + 0.5 + (chartH - 0.5) + 0.08, w: barW, h: 0.4,
      fontSize: 13, color: C.textSecondary, fontFace: "Calibri", align: "center",
    });
  });

  // Arrow annotation
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.5, y: CONTENT_TOP + 0.3, w: 3.3, h: 2.6,
    fill: { color: C.surface },
    line: { color: C.red, width: 1.5 },
  });
  slide.addText("4× cost in 3 years", {
    x: 9.5, y: CONTENT_TOP + 0.42, w: 3.3, h: 0.4,
    fontSize: 15, bold: true, color: C.red, fontFace: "Calibri", align: "center",
  });
  slide.addText("72% is custom metrics SKU\n(not hosts, not APM)", {
    x: 9.6, y: CONTENT_TOP + 0.9, w: 3.1, h: 0.7,
    fontSize: 12, color: C.textSecondary, fontFace: "Calibri", align: "left", wrap: true,
  });
  slide.addText("Usage was roughly flat.\nThis is a pricing structure\nproblem, not a growth story.", {
    x: 9.6, y: CONTENT_TOP + 1.6, w: 3.1, h: 0.9,
    fontSize: 12, color: C.textSecondary, fontFace: "Calibri", align: "left", wrap: true, italic: true,
  });

  slide.addNotes("Walk through the bars year by year. The key line: our infrastructure didn't triple. Our usage didn't triple. Our bill did. The reason was cardinality — we'll get into exactly what happened on the next slide.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Cardinality root cause
// ═══════════════════════════════════════════════════════════════════════════════
(function buildCardinalitySlide() {
  const slide = addSlide();
  addTitle(slide, "The Root Cause: Cardinality Explosion");

  // Timeline of decisions
  const events = [
    { year: "2022", text: "~14 core metrics. Sensible tags: service, env, region.", color: C.green, icon: "✓" },
    { year: "2024\nQ1", text: "Added user_id tag to 14 metrics for a debugging sprint. Never removed.", color: C.red, icon: "!" },
    { year: "2024\nQ3", text: "Added tenant_id. 900 tenants × existing tags = ~900× time-series explosion.", color: C.red, icon: "!" },
    { year: "2024\nQ4", text: "request_id added to a counter. Each unique request = unique time series.", color: C.red, icon: "✗" },
  ];

  events.forEach((ev, i) => {
    const y = CONTENT_TOP + i * 1.1;
    // Connector line
    if (i < events.length - 1) {
      slide.addShape(pptx.ShapeType.line, {
        x: PAD + 0.55, y: y + 0.62, w: 0, h: 0.62,
        line: { color: C.divider, width: 1.5 },
      });
    }
    // Circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: PAD + 0.22, y: y + 0.1, w: 0.68, h: 0.68,
      fill: { color: ev.color, transparency: 30 },
      line: { color: ev.color, width: 1.5 },
    });
    slide.addText(ev.icon, {
      x: PAD + 0.22, y: y + 0.1, w: 0.68, h: 0.68,
      fontSize: 16, bold: true, color: ev.color, fontFace: "Calibri", align: "center", valign: "middle",
    });
    // Year
    slide.addText(ev.year, {
      x: PAD + 1.05, y: y + 0.08, w: 0.8, h: 0.72,
      fontSize: 13, bold: true, color: C.textMuted, fontFace: "Calibri", valign: "middle", align: "center",
    });
    // Description box
    slide.addShape(pptx.ShapeType.rect, {
      x: PAD + 2.0, y: y + 0.05, w: 8.0, h: 0.8,
      fill: { color: C.surface },
      line: { color: ev.color, width: 1 },
    });
    slide.addText(ev.text, {
      x: PAD + 2.15, y: y + 0.1, w: 7.7, h: 0.7,
      fontSize: 14, color: C.textSecondary, fontFace: "Calibri", wrap: true, valign: "middle",
    });
  });

  // Side callout
  slide.addShape(pptx.ShapeType.rect, {
    x: 10.3, y: CONTENT_TOP, w: 2.6, h: 2.0,
    fill: { color: "1A0808" },
    line: { color: C.red, width: 1.5 },
  });
  slide.addText("19M\ntime-series\nby 2026", {
    x: 10.3, y: CONTENT_TOP + 0.18, w: 2.6, h: 1.6,
    fontSize: 22, bold: true, color: C.red, fontFace: "Calibri", align: "center", lineSpacingMultiple: 1.2,
  });

  slide.addNotes("Here's what actually happened. None of these decisions were crazy in isolation. user_id for debugging? Totally reasonable. The problem is Datadog charges per unique tag combination, and a tag like request_id means every single request gets its own time series. That counter had literally billions of unique values. The insight that mattered: with OTel plus self-hosted Mimir, cardinality mistakes cost you compute, not licensing dollars. We can drop high-cardinality labels at the collector before they ever hit storage.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Section divider: Act 02
// ═══════════════════════════════════════════════════════════════════════════════
(function buildAct02Divider() {
  const slide = addSlide({ bgColor: C.surface });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue },
  });

  slide.addText("ACT 02", {
    x: PAD, y: 2.4, w: 12, h: 0.6,
    fontSize: 14, bold: true, color: C.blue, fontFace: "Calibri", charSpacing: 4,
  });
  slide.addText("Why OTel (and Why We\nRejected the Alternatives)", {
    x: PAD, y: 3.0, w: 12, h: 2.0,
    fontSize: 40, bold: true, color: C.textPrimary, fontFace: "Calibri", lineSpacingMultiple: 1.15,
  });
  slide.addText("4 minutes", {
    x: PAD, y: 5.1, w: 2.5, h: 0.4,
    fontSize: 14, color: C.textMuted, fontFace: "Calibri",
  });

  slide.addNotes("Transition: Once we knew we needed to move, the question was: where?");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Vendor comparison matrix
// ═══════════════════════════════════════════════════════════════════════════════
(function buildVendorMatrix() {
  const slide = addSlide();
  addTitle(slide, "Decision Matrix: Vendors We Evaluated");

  const cols = ["Vendor", "Cost model", "Lock-in", "OTel-native?", "Self-host?", "Decision"];
  const rows = [
    ["Datadog\n(stay)", "Per tag-combination\n(our problem)", "High", "Partial", "No", "❌ Stay = same cliff"],
    ["New Relic", "Per GB ingest", "High", "Partial", "No", "❌ Cheaper, same lock-in"],
    ["Honeycomb", "Per event", "Medium", "Yes", "No (SaaS only)", "❌ Great UX, no self-host"],
    ["OTel +\nSelf-hosted", "Compute only\n(per-sample)", "None", "Yes — it IS OTel", "Yes", "✅ Chosen"],
  ];

  const colW = [1.8, 2.3, 1.1, 1.4, 1.2, 2.3];
  const totalW = colW.reduce((a, b) => a + b, 0);
  const tableX = PAD + (SLIDE_W - PAD * 2 - totalW) / 2;
  const rowH = 0.88;
  const headerH = 0.52;

  // Header
  let cx = tableX;
  cols.forEach((col, ci) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: cx, y: CONTENT_TOP, w: colW[ci], h: headerH,
      fill: { color: C.accent, transparency: 10 },
      line: { color: C.accent, width: 1 },
    });
    slide.addText(col, {
      x: cx, y: CONTENT_TOP, w: colW[ci], h: headerH,
      fontSize: 12, bold: true, color: C.textPrimary, fontFace: "Calibri", align: "center", valign: "middle", wrap: true,
    });
    cx += colW[ci];
  });

  rows.forEach((row, ri) => {
    const isChosen = ri === rows.length - 1;
    const ry = CONTENT_TOP + headerH + ri * rowH;
    cx = tableX;
    row.forEach((cell, ci) => {
      const cellColor = isChosen ? (ci === 5 ? "0D2B12" : "0D1F0D") : C.surface;
      const textColor = isChosen ? C.green : (ci === 5 ? (cell.startsWith("✅") ? C.green : C.red) : C.textSecondary);
      slide.addShape(pptx.ShapeType.rect, {
        x: cx, y: ry, w: colW[ci], h: rowH,
        fill: { color: cellColor },
        line: { color: isChosen ? C.green : C.divider, width: 1 },
      });
      slide.addText(cell, {
        x: cx + 0.08, y: ry, w: colW[ci] - 0.16, h: rowH,
        fontSize: 12, color: textColor, fontFace: "Calibri", valign: "middle", wrap: true,
        bold: isChosen,
      });
      cx += colW[ci];
    });
  });

  slide.addNotes("We evaluated three alternatives. The short version: New Relic would have been cheaper but we'd still have the same structural lock-in problem. Honeycomb was the most thoughtfully designed product we looked at but they don't offer self-hosting. The decision wasn't primarily about cost — it was about never being in this position again. OTel is the standard. We own our data pipeline. Cardinality mistakes cost us a restart, not a contract renegotiation.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Section divider: Act 03
// ═══════════════════════════════════════════════════════════════════════════════
(function buildAct03Divider() {
  const slide = addSlide({ bgColor: C.surface });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: 0.08,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  slide.addText("ACT 03", {
    x: PAD, y: 2.4, w: 12, h: 0.6,
    fontSize: 14, bold: true, color: C.accent, fontFace: "Calibri", charSpacing: 4,
  });
  slide.addText("The Migration in Four Acts", {
    x: PAD, y: 3.0, w: 12, h: 1.2,
    fontSize: 40, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });
  slide.addText("Collector  →  Traces  →  Metrics  →  Logs", {
    x: PAD, y: 4.2, w: 12, h: 0.6,
    fontSize: 18, color: C.textSecondary, fontFace: "Calibri",
  });
  slide.addText("10 minutes", {
    x: PAD, y: 5.1, w: 2.5, h: 0.4,
    fontSize: 14, color: C.textMuted, fontFace: "Calibri",
  });

  slide.addNotes("Transition: Here's what the work actually looked like.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Collector architecture
// ═══════════════════════════════════════════════════════════════════════════════
(function buildCollectorArch() {
  const slide = addSlide();
  addTitle(slide, "Architecture: Agent Tier + Gateway Tier");

  // Left column: diagram boxes
  const archItems = [
    { label: "Pods / Services", sub: "Instrumented with OTel SDK", x: 0.55, y: 1.65, w: 2.8, color: C.blue },
    { label: "Agent (DaemonSet)", sub: "Scrape + k8s attribute enrichment", x: 0.55, y: 3.1, w: 2.8, color: C.accent },
    { label: "Gateway (Deployment)", sub: "Sampling, batching, fan-out", x: 0.55, y: 4.55, w: 2.8, color: C.accent },
  ];

  archItems.forEach((item) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: item.x, y: item.y, w: item.w, h: 1.1,
      fill: { color: C.surface },
      line: { color: item.color, width: 1.5 },
    });
    slide.addText(item.label, {
      x: item.x + 0.14, y: item.y + 0.1, w: item.w - 0.28, h: 0.44,
      fontSize: 14, bold: true, color: item.color, fontFace: "Calibri",
    });
    slide.addText(item.sub, {
      x: item.x + 0.14, y: item.y + 0.52, w: item.w - 0.28, h: 0.44,
      fontSize: 12, color: C.textSecondary, fontFace: "Calibri",
    });
    // Arrow down
    if (item.y < 4.55) {
      slide.addShape(pptx.ShapeType.line, {
        x: item.x + item.w / 2, y: item.y + 1.1, w: 0, h: 0.42,
        line: { color: C.accent, width: 1.5 },
      });
    }
  });

  // Right column: backends
  const backends = [
    { label: "Tempo", sub: "Traces", detail: "Grafana Cloud (internal)\nSelf-hosted (customer data)", color: C.blue },
    { label: "Mimir", sub: "Metrics", detail: "Self-hosted, Prometheus-compatible\nAll cost pressure → we own this tier", color: C.accent },
    { label: "Loki", sub: "Logs", detail: "Self-hosted\n~1 sprint to migrate from k8s logs", color: C.green },
  ];

  backends.forEach((b, i) => {
    const bx = 4.3;
    const by = 1.65 + i * 1.76;
    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by, w: 4.0, h: 1.4,
      fill: { color: C.surface },
      line: { color: b.color, width: 1.5 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by, w: 1.3, h: 1.4,
      fill: { color: b.color, transparency: 75 },
      line: { color: b.color, width: 1 },
    });
    slide.addText(`${b.label}\n(${b.sub})`, {
      x: bx, y: by, w: 1.3, h: 1.4,
      fontSize: 13, bold: true, color: b.color, fontFace: "Calibri", align: "center", valign: "middle", wrap: true,
    });
    slide.addText(b.detail, {
      x: bx + 1.4, y: by + 0.22, w: 2.5, h: 1.0,
      fontSize: 12, color: C.textSecondary, fontFace: "Calibri", wrap: true, valign: "middle",
    });
  });

  // Sampling callout (right side)
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.8, y: CONTENT_TOP, w: 4.1, h: 4.5,
    fill: { color: C.surface },
    line: { color: C.divider, width: 1 },
  });
  slide.addText("Sampling Strategy", {
    x: 8.95, y: CONTENT_TOP + 0.12, w: 3.8, h: 0.38,
    fontSize: 14, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.8, y: CONTENT_TOP + 0.52, w: 4.1, h: 0.04,
    fill: { color: C.divider }, line: { color: C.divider },
  });
  const samplingItems = [
    "HEAD-BASED (agent tier):",
    "• 10% for most services",
    "• 100% for payments + auth",
    "",
    "TAIL-BASED (gateway tier):",
    "• Errors → 100% kept",
    "• Slow spans → 100% kept",
    "• Rest → 1% sample",
    "",
    "⚠  Tail-based = all spans of a\ntrace must hit same gateway\n→ pinned our scaling pattern",
  ];
  let sy = CONTENT_TOP + 0.62;
  samplingItems.forEach((item) => {
    const isHeader = item.endsWith(":");
    const isWarning = item.startsWith("⚠");
    slide.addText(item, {
      x: 8.95, y: sy, w: 3.8, h: isWarning ? 0.65 : 0.35,
      fontSize: isHeader ? 12 : 11,
      bold: isHeader,
      color: isWarning ? C.red : (isHeader ? C.accent : C.textSecondary),
      fontFace: "Calibri", wrap: true,
    });
    sy += isWarning ? 0.68 : (item === "" ? 0.2 : 0.35);
  });

  slide.addNotes("Two-tier collector deployment. Agent DaemonSet per node does the local scraping and k8s attribute enrichment. Gateway Deployment handles sampling decisions and backend fan-out. The key architectural decision: traces go to Tempo, metrics to Mimir, logs to Loki. We split on cost control — Mimir is where our cardinality problem lived, so we needed to own that tier. The sampling callout on the right is important — we'll come back to the tail-based scaling constraint in the 'things nobody tells you' section.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Migration timeline (planned vs actual)
// ═══════════════════════════════════════════════════════════════════════════════
(function buildTimeline() {
  const slide = addSlide();
  addTitle(slide, "The Timeline: Planned 6 Months, Actual 10");

  const milestones = [
    { m: "M1", name: "Collector deployed alongside Datadog", planned: 0, slip: 0, status: "Hit" },
    { m: "M2", name: "Traces flipped for 2 services", planned: 0, slip: 0, status: "Hit" },
    { m: "M3", name: "Traces fully on Tempo", planned: 0, slip: 1, status: "1 mo slip" },
    { m: "M4", name: "Metrics flipped for 2 services", planned: 0, slip: 2, status: "2 mo slip" },
    { m: "M5", name: "Metrics fully on Mimir", planned: 0, slip: 3, status: "3 mo slip" },
    { m: "M6", name: "Logs + alerting rewrite", planned: 0, slip: 4, status: "4 mo slip" },
  ];

  const barLeft = 2.1;
  const barScale = 0.78; // width per month
  const rowH = 0.7;
  const barH = 0.38;

  milestones.forEach((ms, i) => {
    const ry = CONTENT_TOP + i * rowH;

    // Milestone label
    slide.addText(ms.m, {
      x: PAD, y: ry + 0.14, w: 0.5, h: 0.42,
      fontSize: 12, bold: true, color: C.accent, fontFace: "Calibri", align: "center",
    });
    slide.addText(ms.name, {
      x: PAD + 0.55, y: ry + 0.14, w: 1.45, h: 0.42,
      fontSize: 10, color: C.textSecondary, fontFace: "Calibri", wrap: true,
    });

    const originalEnd = (i + 1);
    const actualEnd = originalEnd + ms.slip;
    const planW = originalEnd * barScale;
    const actualW = actualEnd * barScale;

    // Planned bar (dark background)
    slide.addShape(pptx.ShapeType.rect, {
      x: barLeft, y: ry + 0.04, w: planW, h: barH / 2,
      fill: { color: C.green, transparency: 55 },
      line: { color: C.green, width: 0.5 },
    });

    if (ms.slip > 0) {
      // Slip extension
      slide.addShape(pptx.ShapeType.rect, {
        x: barLeft + planW, y: ry + 0.04, w: (ms.slip) * barScale, h: barH / 2,
        fill: { color: C.red, transparency: 40 },
        line: { color: C.red, width: 0.5 },
      });
    }

    // Status badge
    const statusColor = ms.slip === 0 ? C.green : C.red;
    slide.addText(ms.status, {
      x: barLeft + actualW + 0.15, y: ry + 0.1, w: 1.4, h: 0.3,
      fontSize: 11, bold: ms.slip > 0, color: statusColor, fontFace: "Calibri",
    });
  });

  // Month labels
  for (let m = 1; m <= 10; m++) {
    slide.addText(`M${m}`, {
      x: barLeft + (m - 1) * barScale - 0.1, y: CONTENT_TOP + 6 * rowH + 0.08, w: 0.5, h: 0.3,
      fontSize: 9, color: C.textMuted, fontFace: "Calibri", align: "center",
    });
  }

  // Annotations for slip causes
  const annotations = [
    { y: CONTENT_TOP + 2 * rowH + 0.04, text: "Service teams had to rewrite Datadog-APM-specific instrumentation. ~3 wks per team.", color: C.red },
    { y: CONTENT_TOP + 3 * rowH + 0.04, text: "~120 Datadog alerts didn't translate to Prometheus rules. Rebuilt by hand; 15 wrong (caught in staging).", color: C.red },
  ];

  slide.addShape(pptx.ShapeType.rect, {
    x: 9.2, y: CONTENT_TOP, w: 3.7, h: 3.8,
    fill: { color: C.surface },
    line: { color: C.divider, width: 1 },
  });
  slide.addText("Why the slips?", {
    x: 9.35, y: CONTENT_TOP + 0.1, w: 3.4, h: 0.35,
    fontSize: 13, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });
  slide.addText("M3: Service teams had to rewrite\nDatadog-APM-specific\ninstrumentation. ~3 weeks per team × 2 teams.", {
    x: 9.35, y: CONTENT_TOP + 0.5, w: 3.4, h: 1.1,
    fontSize: 11, color: C.textSecondary, fontFace: "Calibri", wrap: true,
  });
  slide.addText("M4-M5: Alerting rewrite was 30% of\nthe total effort. 120 Datadog alerts\n→ Prometheus rules. 15 wrong (staging).", {
    x: 9.35, y: CONTENT_TOP + 1.65, w: 3.4, h: 1.1,
    fontSize: 11, color: C.textSecondary, fontFace: "Calibri", wrap: true,
  });
  slide.addText("M6: Logs were actually the easy part.\nBut we were burned out.", {
    x: 9.35, y: CONTENT_TOP + 2.8, w: 3.4, h: 0.75,
    fontSize: 11, color: C.green, fontFace: "Calibri", wrap: true, italic: true,
  });

  slide.addNotes("The original plan was 6 months. Actual: 10. This wasn't a failure — we're fully migrated and Datadog agents are off 19 of 22 clusters. But I'd be lying if I said we called this. Three things drove the slips: one, our service teams had Datadog APM-specific instrumentation that didn't translate. Two, the alerting rewrite was enormous — we've been trained to think of alerts as a configuration artifact, but when you're rebuilding from scratch in a new query language, it's an engineering task. Three — and this is a gift for you — logs turned out to be the easiest thing we did. Budget your time accordingly.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Current state: what's in production
// ═══════════════════════════════════════════════════════════════════════════════
(function buildCurrentState() {
  const slide = addSlide();
  addTitle(slide, "Current State: April 2026");

  const items = [
    { icon: "✅", label: "100% of traces in Tempo", sub: "Since 2026-02", color: C.green },
    { icon: "✅", label: "100% of metrics in Mimir", sub: "Since 2026-03", color: C.green },
    { icon: "✅", label: "100% of logs in Loki", sub: "Since 2026-04-01", color: C.green },
    { icon: "🔄", label: "Datadog agents removed: 19/22 clusters", sub: "Remaining 3 are legacy customer envs → Q3 2026", color: C.accent },
  ];

  items.forEach((item, i) => {
    const y = CONTENT_TOP + 0.1 + i * 1.1;
    slide.addShape(pptx.ShapeType.rect, {
      x: PAD, y, w: SLIDE_W - PAD * 2 - 4.0, h: 0.9,
      fill: { color: C.surface },
      line: { color: item.color, width: 1.5 },
    });
    slide.addText(item.icon, {
      x: PAD + 0.15, y, w: 0.65, h: 0.9,
      fontSize: 20, fontFace: "Calibri", align: "center", valign: "middle",
    });
    slide.addText(item.label, {
      x: PAD + 0.9, y: y + 0.1, w: 6.5, h: 0.4,
      fontSize: 16, bold: true, color: item.color, fontFace: "Calibri",
    });
    slide.addText(item.sub, {
      x: PAD + 0.9, y: y + 0.48, w: 6.5, h: 0.3,
      fontSize: 12, color: C.textMuted, fontFace: "Calibri",
    });
  });

  // Stat boxes
  addStatBox(slide, "$720k", "Projected Datadog\n2026 cost (avoided)", 9.5, CONTENT_TOP, 3.3, 1.55, C.red);
  addStatBox(slide, "~$95k", "Estimated OTel\ninfra + eng cost/yr", 9.5, CONTENT_TOP + 1.7, 3.3, 1.55, C.green);
  addStatBox(slide, "14 mo", "Projected payback\nperiod", 9.5, CONTENT_TOP + 3.4, 3.3, 1.1, C.accent);

  slide.addNotes("This is where we are today. Fully migrated. Datadog agents are off 19 of 22 clusters — the remaining three are legacy customer environments we're committed to removing Q3 2026. The cost projection: we avoided roughly $625k in Datadog costs this year, against about $95k in actual OTel infrastructure and engineering time. Payback period sits at about 14 months from when we started the project.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Section divider: Act 04
// ═══════════════════════════════════════════════════════════════════════════════
(function buildAct04Divider() {
  const slide = addSlide({ bgColor: C.surface });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: 0.08,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  slide.addText("ACT 04", {
    x: PAD, y: 2.4, w: 12, h: 0.6,
    fontSize: 14, bold: true, color: C.accent, fontFace: "Calibri", charSpacing: 4,
  });
  slide.addText("Three Things Nobody\nTells You", {
    x: PAD, y: 3.0, w: 12, h: 2.0,
    fontSize: 40, bold: true, color: C.textPrimary, fontFace: "Calibri", lineSpacingMultiple: 1.15,
  });
  slide.addText("5 minutes", {
    x: PAD, y: 5.1, w: 2.5, h: 0.4,
    fontSize: 14, color: C.textMuted, fontFace: "Calibri",
  });

  slide.addNotes("This is the section I wish someone had given us before we started.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — Three things nobody tells you
// ═══════════════════════════════════════════════════════════════════════════════
(function buildThreeThings() {
  const slide = addSlide();
  addTitle(slide, "The Three Things Nobody Tells You");

  const things = [
    {
      num: "1",
      title: "Cardinality still bites you",
      body: "OTel doesn't solve cardinality — it just changes what it costs you. With Datadog, cardinality = dollars. With self-hosted Mimir, cardinality = compute + pages. You need a label hygiene policy before you go live.",
      color: C.red,
    },
    {
      num: "2",
      title: "Sampling is harder than you think",
      body: "Tail-based sampling — the good kind — requires all spans of a trace to land on the same gateway pod. This forced a scaling pattern we didn't love. Head-based sampling is easy; tail-based is an architecture decision.",
      color: C.accent,
    },
    {
      num: "3",
      title: "The alerting rewrite is 30% of the work",
      body: "Every Datadog monitor needs to be rebuilt as a Prometheus alert rule. They don't translate 1:1. Budget time, don't skip staging validation, and own the fact that some of your old alerts were wrong anyway.",
      color: C.blue,
    },
  ];

  things.forEach((t, i) => {
    const y = CONTENT_TOP + i * 1.65;
    // Number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: PAD, y: y + 0.1, w: 0.8, h: 0.8,
      fill: { color: t.color, transparency: 20 },
      line: { color: t.color, width: 2 },
    });
    slide.addText(t.num, {
      x: PAD, y: y + 0.1, w: 0.8, h: 0.8,
      fontSize: 22, bold: true, color: t.color, fontFace: "Calibri", align: "center", valign: "middle",
    });

    // Card
    slide.addShape(pptx.ShapeType.rect, {
      x: PAD + 1.0, y, w: SLIDE_W - PAD * 2 - 1.0, h: 1.5,
      fill: { color: C.surface },
      line: { color: t.color, width: 1.5 },
    });
    slide.addText(t.title, {
      x: PAD + 1.15, y: y + 0.1, w: SLIDE_W - PAD * 2 - 1.3, h: 0.44,
      fontSize: 16, bold: true, color: t.color, fontFace: "Calibri",
    });
    slide.addText(t.body, {
      x: PAD + 1.15, y: y + 0.52, w: SLIDE_W - PAD * 2 - 1.3, h: 0.88,
      fontSize: 13, color: C.textSecondary, fontFace: "Calibri", wrap: true,
    });
  });

  slide.addNotes("Let me hit these one at a time. One: cardinality. OTel is not a cardinality cure. What it does is change the cost model. With Datadog, a bad label costs you money immediately. With Mimir, a bad label costs you compute and potentially pages. Before you flip any production traffic, write a label governance policy and implement cardinality limits in Mimir's config. Two: sampling. If you want proper tail-based sampling — and you do, because it's the only kind that can keep all errors — you have to route all spans of a trace to the same gateway. That means sticky routing and it limits how you scale horizontally. Plan for this upfront. Three: alerting. This is the hidden project inside your project. Every Datadog monitor has to be manually ported to a Prometheus rule. You will get some wrong. The blessing in disguise: some of your old Datadog alerts were also wrong, and you'll discover it.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — Section divider: Act 05
// ═══════════════════════════════════════════════════════════════════════════════
(function buildAct05Divider() {
  const slide = addSlide({ bgColor: C.surface });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: 0.08,
    fill: { color: C.green }, line: { color: C.green },
  });

  slide.addText("ACT 05", {
    x: PAD, y: 2.4, w: 12, h: 0.6,
    fontSize: 14, bold: true, color: C.green, fontFace: "Calibri", charSpacing: 4,
  });
  slide.addText("What We'd Do Differently", {
    x: PAD, y: 3.0, w: 12, h: 1.4,
    fontSize: 40, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });
  slide.addText("The punchline — what to steal", {
    x: PAD, y: 4.4, w: 10, h: 0.6,
    fontSize: 18, color: C.textSecondary, fontFace: "Calibri",
  });
  slide.addText("3 minutes", {
    x: PAD, y: 5.1, w: 2.5, h: 0.4,
    fontSize: 14, color: C.textMuted, fontFace: "Calibri",
  });

  slide.addNotes("Final act. If you're planning this migration, here's what we'd hand you.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 15 — What we'd do differently
// ═══════════════════════════════════════════════════════════════════════════════
(function buildDoDifferently() {
  const slide = addSlide();
  addTitle(slide, "What We'd Do Differently");

  const recs = [
    {
      icon: "📋",
      title: "Write a label governance policy before M1",
      body: "Decide which labels are permitted on metrics before a single series is emitted. Cardinality limits in Mimir should be configured at day 0, not when you get paged at 2am.",
      type: "do",
    },
    {
      icon: "⚠",
      title: "Budget the alerting rewrite as a standalone project",
      body: "Scope it separately from the metrics migration. Assign a dedicated owner. Treat each alert as a product requirement that needs validation, not a config file to copy.",
      type: "do",
    },
    {
      icon: "🔀",
      title: "Start sampling architecture before traces flip",
      body: "Tail-based sampling is an architectural constraint. Decide upfront whether you need it. If you do, design the gateway scaling model first — don't retrofit it during the metrics phase.",
      type: "do",
    },
    {
      icon: "⏱",
      title: "Double your timeline estimate",
      body: "If your estimate is 6 months, plan for 10. Not because the work is hard — because service team coordination, alert rewrites, and staging validation are all longer than they look.",
      type: "warn",
    },
    {
      icon: "✅",
      title: "Do logs last — it's genuinely easy",
      body: "Contrary to our fears, Loki ingestion of OTel log records was about 1 sprint. Do it last when the team has the collector pipeline mastered.",
      type: "good",
    },
  ];

  const typeColor = { do: C.blue, warn: C.red, good: C.green };

  recs.forEach((rec, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const x = PAD + col * 6.1;
    const y = CONTENT_TOP + row * 1.58;
    const w = 5.7;
    const h = 1.42;
    const color = typeColor[rec.type];

    slide.addShape(pptx.ShapeType.rect, {
      x, y, w, h,
      fill: { color: C.surface },
      line: { color: color, width: 1.5 },
    });
    slide.addText(rec.icon, {
      x: x + 0.12, y: y + 0.1, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: "Calibri", align: "center",
    });
    slide.addText(rec.title, {
      x: x + 0.65, y: y + 0.1, w: w - 0.8, h: 0.44,
      fontSize: 13, bold: true, color: color, fontFace: "Calibri", wrap: true,
    });
    slide.addText(rec.body, {
      x: x + 0.14, y: y + 0.56, w: w - 0.28, h: 0.8,
      fontSize: 11, color: C.textSecondary, fontFace: "Calibri", wrap: true,
    });
  });

  slide.addNotes("Five recommendations. The most important ones in order: First, label governance before you start. Write the policy. Configure Mimir limits. Don't rely on engineers remembering. Second, treat the alerting rewrite as its own project with its own owner and timeline — it's easily 30% of total effort and the most likely thing to get deprioritized. Third, decide on sampling architecture early — the tail-based constraint affects gateway scaling and you don't want to redesign this mid-migration. Fourth, double your timeline. Fifth — and this is the one surprise gift I can give you — logs are easy. Do them last and let the win close out the project on a high note.");
})();


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 16 — Close / Call to action
// ═══════════════════════════════════════════════════════════════════════════════
(function buildClose() {
  const slide = addSlide({ bgColor: C.surface });

  // Accent bar top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: 0.1,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Primary takeaway
  slide.addText("The One-Liner", {
    x: PAD, y: 1.0, w: 12, h: 0.5,
    fontSize: 16, bold: true, color: C.accent, fontFace: "Calibri", charSpacing: 2,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: PAD, y: 1.55, w: SLIDE_W - PAD * 2, h: 1.6,
    fill: { color: "181C2A" },
    line: { color: C.accent, width: 1.5 },
  });
  slide.addText('"If you\'re paying Datadog more than $400k/yr\nand you have the platform headcount,\nOTel is a 9-month project that pays for itself in 14 months."', {
    x: PAD + 0.3, y: 1.6, w: SLIDE_W - PAD * 2 - 0.6, h: 1.5,
    fontSize: 18, color: C.textPrimary, fontFace: "Calibri", align: "center", valign: "middle",
    italic: true, lineSpacingMultiple: 1.3,
  });

  // Three takeaways
  slide.addText("What to steal from this talk:", {
    x: PAD, y: 3.3, w: 8, h: 0.42,
    fontSize: 15, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });

  const takeaways = [
    "Label governance policy before you start — don't learn it the hard way",
    "Alerting rewrite = standalone project with its own owner",
    "Double your timeline; logs are the easy win — save them for last",
  ];
  takeaways.forEach((t, i) => {
    slide.addText(
      [
        { text: `${i + 1}.  `, options: { bold: true, color: C.accent, fontSize: 14, fontFace: "Calibri" } },
        { text: t, options: { color: C.textSecondary, fontSize: 14, fontFace: "Calibri" } },
      ],
      { x: PAD, y: 3.78 + i * 0.48, w: 10, h: 0.44 }
    );
  });

  // Q&A prompt
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.6, y: 3.2, w: 3.3, h: 1.6,
    fill: { color: C.bg },
    line: { color: C.divider, width: 1 },
  });
  slide.addText("Q&A", {
    x: 9.6, y: 3.28, w: 3.3, h: 0.55,
    fontSize: 28, bold: true, color: C.accent, fontFace: "Calibri", align: "center",
  });
  slide.addText("10 minutes\n\nQuestions?", {
    x: 9.6, y: 3.82, w: 3.3, h: 0.9,
    fontSize: 13, color: C.textSecondary, fontFace: "Calibri", align: "center",
  });

  // Footer note
  slide.addText("Note: Cost figures represent internal data. External version will use anonymized ranges. Legal review pending.", {
    x: PAD, y: 6.98, w: SLIDE_W - PAD * 2, h: 0.3,
    fontSize: 10, color: C.textMuted, fontFace: "Calibri", italic: true,
  });

  slide.addNotes("Closing. The one-liner is what I want you to leave with. If you're at the threshold — north of $400k/yr and you have a platform engineer or two who can own this — OTel pays for itself. The shape of the work is 9-10 months, most of the pain is in alerting rewrites, and the cost curve flattens permanently. Happy to take questions — especially on anything I glossed over in the sampling or cardinality sections.");
})();


// ─── Write output ─────────────────────────────────────────────────────────────
const outFile = path.join(OUT_DIR, "otel-migration-deck.pptx");
pptx.writeFile({ fileName: outFile })
  .then(() => {
    console.log(`✓ Saved: ${outFile}`);
    console.log(`  Slides: 16`);
  })
  .catch((err) => {
    console.error("ERROR writing PPTX:", err);
    process.exit(1);
  });
