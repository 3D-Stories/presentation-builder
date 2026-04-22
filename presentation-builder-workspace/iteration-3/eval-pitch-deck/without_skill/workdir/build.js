"use strict";

const PptxGenJS = require("pptxgenjs");
const path = require("path");

const OUTPUT_PATH = path.join(
  __dirname,
  "../outputs/fitloop-seed-pitch-deck.pptx"
);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg:        "0D1117",   // near-black
  surface:   "161B22",   // card bg
  accent:    "00C896",   // brand green
  accentDim: "00A07A",
  white:     "FFFFFF",
  offWhite:  "E8EEF4",
  muted:     "8B949E",
  statBg:    "1C2A24",
};

const FONT = {
  heading:  "Calibri",
  body:     "Calibri",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slide(pptx, opts = {}) {
  const s = pptx.addSlide();
  // Full dark background
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: COLORS.bg },
    line: { type: "none" },
  });
  // Optional accent stripe at top
  if (opts.accentStripe !== false) {
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: "100%", h: 0.06,
      fill: { color: COLORS.accent },
      line: { type: "none" },
    });
  }
  return s;
}

function heading(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.5,
    y: opts.y ?? 0.35,
    w: opts.w ?? 9.0,
    h: opts.h ?? 0.65,
    fontSize: opts.size ?? 30,
    bold: true,
    color: opts.color ?? COLORS.white,
    fontFace: FONT.heading,
    align: opts.align ?? "left",
    valign: "middle",
  });
}

function subheading(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.5,
    y: opts.y ?? 1.1,
    w: opts.w ?? 9.0,
    h: opts.h ?? 0.35,
    fontSize: opts.size ?? 14,
    bold: false,
    color: opts.color ?? COLORS.muted,
    fontFace: FONT.body,
    align: opts.align ?? "left",
    valign: "top",
  });
}

function body(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.5,
    y: opts.y ?? 1.6,
    w: opts.w ?? 9.0,
    h: opts.h ?? 4.0,
    fontSize: opts.size ?? 13,
    color: opts.color ?? COLORS.offWhite,
    fontFace: FONT.body,
    align: opts.align ?? "left",
    valign: "top",
    wrap: true,
  });
}

function bullet(s, items, opts = {}) {
  const rows = items.map((item) => ({
    text: item.text ?? item,
    options: {
      bullet: { type: "bullet", code: "25CF", color: COLORS.accent },
      fontSize: item.size ?? opts.size ?? 13,
      color: item.color ?? opts.color ?? COLORS.offWhite,
      bold: item.bold ?? false,
      indentLevel: item.indent ?? 0,
      paraSpaceBefore: 3,
      paraSpaceAfter: 3,
    },
  }));
  s.addText(rows, {
    x: opts.x ?? 0.5,
    y: opts.y ?? 1.6,
    w: opts.w ?? 9.0,
    h: opts.h ?? 4.0,
    fontFace: FONT.body,
    valign: "top",
  });
}

function accentBox(s, opts = {}) {
  s.addShape(pptx.ShapeType.rect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fill: { color: opts.fill ?? COLORS.surface },
    line: { color: opts.border ?? COLORS.accent, pt: opts.borderPt ?? 1 },
    rectRadius: 0.05,
  });
}

function statCard(s, pptx, label, value, x, y, w = 2.1, h = 1.3) {
  s.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: COLORS.statBg },
    line: { color: COLORS.accent, pt: 1 },
    rectRadius: 0.05,
  });
  s.addText(value, {
    x, y: y + 0.1, w, h: 0.65,
    fontSize: 26,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
    align: "center",
    valign: "middle",
  });
  s.addText(label, {
    x, y: y + 0.72, w, h: 0.45,
    fontSize: 11,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "center",
    valign: "middle",
  });
}

function dividerLine(s, y) {
  s.addShape(pptx.ShapeType.line, {
    x: 0.5, y, w: 9.0, h: 0,
    line: { color: COLORS.accent, pt: 0.5, dashType: "solid" },
  });
}

function slideNumber(s, n) {
  s.addText(`${n} / 12`, {
    x: 8.8, y: 6.9, w: 1.1, h: 0.25,
    fontSize: 9,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "right",
  });
}

// ─── Deck Setup ───────────────────────────────────────────────────────────────
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";   // 13.33 x 7.5 in
pptx.author  = "FitLoop";
pptx.company = "FitLoop Inc.";
pptx.subject = "Seed Round — $2M";
pptx.title   = "FitLoop Investor Pitch Deck";

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx, { accentStripe: false });

  // Large accent bar left edge
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.12, h: "100%",
    fill: { color: COLORS.accent },
    line: { type: "none" },
  });

  // Brand mark wordmark area
  s.addText("FitLoop", {
    x: 0.6, y: 1.8, w: 7.0, h: 1.2,
    fontSize: 72,
    bold: true,
    color: COLORS.white,
    fontFace: FONT.heading,
    align: "left",
    valign: "middle",
    charSpacing: -1,
  });

  // Tagline
  s.addText("Real-time AI form coaching — on device, in the moment.", {
    x: 0.6, y: 3.15, w: 8.5, h: 0.5,
    fontSize: 18,
    color: COLORS.accent,
    fontFace: FONT.body,
    align: "left",
    bold: false,
  });

  // Divider
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 3.8, w: 3.0, h: 0.04,
    fill: { color: COLORS.muted },
    line: { type: "none" },
  });

  // Round / ask
  s.addText("Seed Round  •  $2M  •  Pre-Revenue", {
    x: 0.6, y: 4.0, w: 8.0, h: 0.4,
    fontSize: 14,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "left",
  });

  // Confidential
  s.addText("Confidential — For Discussion Purposes Only", {
    x: 0.6, y: 6.9, w: 8.0, h: 0.3,
    fontSize: 9,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "left",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 2);
  heading(s, "The Problem", { size: 28 });
  subheading(s, "Bad form is the silent injury epidemic in home and gym fitness.");

  dividerLine(s, 1.6);

  bullet(s, [
    { text: "1 in 3 regular lifters sustains a form-related injury every year.", bold: true },
    { text: "Personal trainers cost $60–120 / session — out of reach for most.", indent: 0 },
    { text: "YouTube / Reddit form checks are async, slow, and hit-or-miss.", indent: 0 },
    { text: 'Mirrors don\'t catch what you can\'t see. Neither does willpower.' },
    { text: "The gap: real-time, private, affordable feedback at rep-level granularity.", bold: true, color: COLORS.accent },
  ], { y: 1.75, h: 3.5, size: 14 });

  // Pull quote box
  s.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 5.5, w: 9.0, h: 1.0,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accent, pt: 1 },
  });
  s.addText('"It caught the thing my trainer missed."', {
    x: 0.7, y: 5.55, w: 8.6, h: 0.45,
    fontSize: 15,
    bold: true,
    color: COLORS.white,
    fontFace: FONT.body,
    italic: true,
    align: "left",
  });
  s.addText("— Unprompted, from multiple FitLoop beta users", {
    x: 0.7, y: 6.05, w: 8.6, h: 0.3,
    fontSize: 11,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "left",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE SOLUTION
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 3);
  heading(s, "The Solution", { size: 28 });
  subheading(s, "FitLoop — your phone's camera becomes a real-time coaching eye.");

  dividerLine(s, 1.6);

  // 3-column feature cards
  const cards = [
    { icon: "01", title: "Point & Lift", desc: "Phone camera + on-device pose AI analyzes 40 strength exercises in real time. No upload. No cloud." },
    { icon: "02", title: "Rep-Level Feedback", desc: "Text + audio cue delivered mid-rep — corrects elbow flare, depth, bar path — without breaking flow." },
    { icon: "03", title: "100% On-Device", desc: "Video never leaves the phone. Privacy-first by architecture, not policy." },
  ];

  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.75, w: 2.9, h: 4.5,
      fill: { color: COLORS.surface },
      line: { color: COLORS.accent, pt: 1 },
    });
    s.addText(c.icon, {
      x, y: 1.85, w: 2.9, h: 0.7,
      fontSize: 28,
      bold: true,
      color: COLORS.accent,
      fontFace: FONT.heading,
      align: "center",
    });
    s.addText(c.title, {
      x, y: 2.65, w: 2.9, h: 0.55,
      fontSize: 15,
      bold: true,
      color: COLORS.white,
      fontFace: FONT.heading,
      align: "center",
    });
    s.addText(c.desc, {
      x: x + 0.15, y: 3.3, w: 2.6, h: 2.7,
      fontSize: 12,
      color: COLORS.offWhite,
      fontFace: FONT.body,
      align: "center",
      valign: "top",
      wrap: true,
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — WHY NOW
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 4);
  heading(s, "Why Now", { size: 28 });
  subheading(s, "Three converging forces made this impossible 18 months ago.");

  dividerLine(s, 1.6);

  const timing = [
    {
      num: "1",
      title: "On-Device Pose AI Matured (2025)",
      body: "MediaPipe Pose v3 and Apple ARBodyTrackingConfiguration on A17+ deliver sub-30ms inference. Accuracy crossed the \"good enough for coaching\" threshold only recently.",
    },
    {
      num: "2",
      title: "Post-GLP-1 Gym Returners",
      body: "Millions re-entering fitness post-Ozempic are re-learning basics. Low-embarrassment, private feedback is exactly what this cohort wants. The timing is cultural.",
    },
    {
      num: "3",
      title: "Data-Informed Fitness is the Default",
      body: "Garmin and Whoop trained consumers to expect real-time body data. Neither does form. FitLoop fills the obvious gap in the wearable narrative.",
    },
  ];

  timing.forEach((t, i) => {
    const y = 1.85 + i * 1.6;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 0.55, h: 0.55,
      fill: { color: COLORS.accent },
      line: { type: "none" },
    });
    s.addText(t.num, {
      x: 0.5, y: y + 0.02, w: 0.55, h: 0.51,
      fontSize: 18,
      bold: true,
      color: COLORS.bg,
      fontFace: FONT.heading,
      align: "center",
      valign: "middle",
    });
    s.addText(t.title, {
      x: 1.25, y, w: 8.1, h: 0.38,
      fontSize: 14,
      bold: true,
      color: COLORS.white,
      fontFace: FONT.heading,
    });
    s.addText(t.body, {
      x: 1.25, y: y + 0.35, w: 8.1, h: 1.1,
      fontSize: 12,
      color: COLORS.offWhite,
      fontFace: FONT.body,
      wrap: true,
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — TARGET MARKET
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 5);
  heading(s, "Target Market", { size: 28 });
  subheading(s, "A well-defined, underserved beachhead inside a massive category.");

  dividerLine(s, 1.6);

  // Left: persona
  s.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.75, w: 4.5, h: 4.7,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accent, pt: 1 },
  });
  s.addText("Beachhead Persona", {
    x: 0.7, y: 1.9, w: 4.1, h: 0.4,
    fontSize: 14,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
  });

  const personaItems = [
    "Adults 25–45",
    "Lifts 3–5x/week, home gym or commercial",
    "Knows the exercises; unsure about form",
    "Already tracks health data (wearable owner)",
    'Won\'t hire a trainer ("too expensive / too awkward")',
    "Owns iPhone 14 Pro or newer, or flagship Android",
  ];

  bullet(s, personaItems.map(t => ({ text: t })), {
    x: 0.7, y: 2.4, w: 4.1, h: 3.8, size: 12,
  });

  // Right: market context
  s.addShape(pptx.ShapeType.rect, {
    x: 5.3, y: 1.75, w: 4.5, h: 4.7,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accentDim, pt: 1 },
  });
  s.addText("Market Context", {
    x: 5.5, y: 1.9, w: 4.1, h: 0.4,
    fontSize: 14,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
  });
  const mktItems = [
    "Global fitness app market: $15B+ (2024)",
    "Home fitness accelerated permanently post-2020",
    "AI fitness tools are nascent — no form-coaching leader",
    "Adjacent expansion: mobility, yoga, rehab, cardio",
    "TAM / SAM analysis in progress — not included here",
  ];
  bullet(s, mktItems.map(t => ({ text: t })), {
    x: 5.5, y: 2.4, w: 4.1, h: 3.8, size: 12,
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — PRODUCT DEMO / SCREENSHOT STAND-IN
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 6);
  heading(s, "The Product", { size: 28 });
  subheading(s, "How a rep feels with FitLoop active.");

  dividerLine(s, 1.6);

  // Central placeholder for demo screenshot
  s.addShape(pptx.ShapeType.rect, {
    x: 2.5, y: 1.75, w: 5.0, h: 4.0,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accent, pt: 1.5, dashType: "dash" },
  });
  s.addText("[Live Demo / Screen Recording]", {
    x: 2.5, y: 3.2, w: 5.0, h: 0.7,
    fontSize: 15,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "center",
    italic: true,
  });

  // Callout annotations around the placeholder
  const callouts = [
    { x: 0.2, y: 2.2,  text: "Camera overlay\nhighlights joint angles" },
    { x: 0.2, y: 3.8,  text: "Audio cue fires\nduring rep — mid-motion" },
    { x: 7.7, y: 2.2,  text: "40 exercises\nrecognized on-device" },
    { x: 7.7, y: 3.8,  text: "No video stored\nor transmitted" },
  ];

  callouts.forEach(c => {
    s.addText(c.text, {
      x: c.x, y: c.y, w: 2.2, h: 0.8,
      fontSize: 11,
      color: COLORS.accent,
      fontFace: FONT.body,
      align: "center",
      valign: "middle",
      bold: false,
    });
  });

  // Exercise list at bottom
  s.addText("Squat  •  Deadlift  •  Bench Press  •  Row  •  OHP  •  Pull-up  •  Lunge  •  + 33 more", {
    x: 0.5, y: 5.9, w: 9.2, h: 0.35,
    fontSize: 11,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "center",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — TRACTION
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 7);
  heading(s, "Early Traction", { size: 28 });
  subheading(s, "9 weeks of closed beta (TestFlight). Zero paid acquisition.");

  dividerLine(s, 1.6);

  // Stat cards row
  const stats = [
    { label: "Active Beta Users",    value: "340" },
    { label: "Week-4 Retention",     value: "72%" },
    { label: "Net Promoter Score",   value: "61" },
    { label: "Avg Session Length",   value: "38 min" },
  ];

  stats.forEach((st, i) => {
    statCard(s, pptx, st.label, st.value, 0.5 + i * 2.35, 1.8, 2.1, 1.45);
  });

  // Interpretation section
  s.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 3.45, w: 9.0, h: 2.85,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accent, pt: 0.5 },
  });

  s.addText("What the numbers mean:", {
    x: 0.75, y: 3.6, w: 8.5, h: 0.35,
    fontSize: 13,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
  });

  bullet(s, [
    { text: "72% week-4 retention is in the top quartile for consumer fitness apps (industry median ~35%).", bold: true },
    { text: "NPS of 61 is \"excellent\" — Apple App Store average is ~47 for top fitness apps." },
    { text: "38-min sessions signal genuine workout integration, not casual curiosity." },
    { text: "All users are word-of-mouth; zero ad spend confirms organic PMF signal." },
  ], { x: 0.75, y: 4.0, w: 8.5, h: 2.1, size: 12 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — BUSINESS MODEL
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 8);
  heading(s, "Business Model", { size: 28 });
  subheading(s, "Subscription-first, with freemium discovery. Still validating price points.");

  dividerLine(s, 1.6);

  const models = [
    {
      label: "Freemium Core",
      status: "Planned",
      desc: "Free tier: limited exercise library + session cap. Drives downloads and organic word-of-mouth.",
      statusColor: COLORS.muted,
    },
    {
      label: "FitLoop Pro (Subscription)",
      status: "Testing",
      desc: "Unlimited library, session history, advanced form analytics. Monthly or annual. Price point TBD from beta experiments.",
      statusColor: COLORS.accent,
    },
    {
      label: "Trainer/Studio Tier",
      status: "Future",
      desc: "B2B2C: coaches assign FitLoop homework to clients. Dashboard for trainers. Natural upsell once consumer base is established.",
      statusColor: COLORS.muted,
    },
  ];

  models.forEach((m, i) => {
    const y = 1.85 + i * 1.55;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 9.0, h: 1.35,
      fill: { color: COLORS.surface },
      line: { color: i === 1 ? COLORS.accent : COLORS.muted, pt: i === 1 ? 1.5 : 0.5 },
    });
    s.addText(m.label, {
      x: 0.75, y: y + 0.1, w: 5.5, h: 0.4,
      fontSize: 14,
      bold: true,
      color: COLORS.white,
      fontFace: FONT.heading,
    });
    s.addText(`[ ${m.status} ]`, {
      x: 7.5, y: y + 0.12, w: 1.8, h: 0.35,
      fontSize: 11,
      bold: true,
      color: m.statusColor,
      fontFace: FONT.body,
      align: "right",
    });
    s.addText(m.desc, {
      x: 0.75, y: y + 0.52, w: 8.5, h: 0.75,
      fontSize: 12,
      color: COLORS.offWhite,
      fontFace: FONT.body,
      wrap: true,
    });
  });

  s.addText("Pre-revenue. Subscription model will be validated and locked before public launch.", {
    x: 0.5, y: 6.65, w: 9.2, h: 0.3,
    fontSize: 10,
    color: COLORS.muted,
    fontFace: FONT.body,
    italic: true,
    align: "center",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — TECHNOLOGY & DEFENSIBILITY
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 9);
  heading(s, "Technology & Defensibility", { size: 28 });
  subheading(s, "The moat is deeper than the ML model.");

  dividerLine(s, 1.6);

  // Tech stack left
  s.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.75, w: 4.3, h: 4.7,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accent, pt: 1 },
  });
  s.addText("Technical Stack", {
    x: 0.7, y: 1.9, w: 3.9, h: 0.38,
    fontSize: 13,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
  });
  bullet(s, [
    { text: "MediaPipe Pose v3 — sub-30ms on-device" },
    { text: "Apple ARBodyTrackingConfiguration (A17+)" },
    { text: "Custom biomechanical rule engine (rep-phase aware)" },
    { text: "Proprietary correction classifier — trained on expert-annotated reps" },
    { text: "No server required for core coaching loop" },
  ], { x: 0.7, y: 2.38, w: 3.9, h: 3.8, size: 11.5 });

  // Moat right
  s.addShape(pptx.ShapeType.rect, {
    x: 5.1, y: 1.75, w: 4.7, h: 4.7,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accentDim, pt: 1 },
  });
  s.addText("Defensibility Layers", {
    x: 5.3, y: 1.9, w: 4.3, h: 0.38,
    fontSize: 13,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
  });
  bullet(s, [
    { text: "Proprietary rep-annotation dataset (grows with users)", bold: true },
    { text: "Biomechanical correction logic = high expertise barrier" },
    { text: "Trust/brand — privacy-first architecture is a differentiator" },
    { text: "Network effect potential: trainer tier creates stickiness" },
    { text: "Speed: 9 weeks to 340 retained users with no ad spend" },
  ], { x: 5.3, y: 2.38, w: 4.3, h: 3.8, size: 11.5 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — USE OF FUNDS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 10);
  heading(s, "Use of Funds — $2M Seed", { size: 28 });
  subheading(s, "18-month runway to public launch and first revenue milestone.");

  dividerLine(s, 1.6);

  const allocations = [
    { pct: "40%", label: "Engineering & Product",  amount: "$800K",  desc: "2 senior iOS engineers + 1 ML engineer. Ship Android and expand exercise library to 80+." },
    { pct: "25%", label: "ML & Data",              amount: "$500K",  desc: "Build and annotate proprietary form dataset. Train and tune correction classifiers per exercise." },
    { pct: "20%", label: "Go-to-Market",            amount: "$400K",  desc: "Validate freemium conversion funnel. Influencer seeding, fitness community partnerships." },
    { pct: "15%", label: "Operations & Reserve",    amount: "$300K",  desc: "Legal, finance, infrastructure. 3-month buffer against milestone slippage." },
  ];

  allocations.forEach((a, i) => {
    const y = 1.85 + i * 1.2;
    // pct bar background
    s.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 9.0, h: 1.05,
      fill: { color: COLORS.surface },
      line: { type: "none" },
    });
    // colored pct bar
    const barW = parseFloat(a.pct) / 100 * 3.5;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: barW, h: 1.05,
      fill: { color: COLORS.statBg },
      line: { type: "none" },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 0.08, h: 1.05,
      fill: { color: COLORS.accent },
      line: { type: "none" },
    });
    s.addText(`${a.pct}  ${a.label}`, {
      x: 0.75, y: y + 0.05, w: 5.5, h: 0.4,
      fontSize: 13,
      bold: true,
      color: COLORS.white,
      fontFace: FONT.heading,
    });
    s.addText(a.amount, {
      x: 7.8, y: y + 0.05, w: 1.6, h: 0.4,
      fontSize: 13,
      bold: true,
      color: COLORS.accent,
      fontFace: FONT.heading,
      align: "right",
    });
    s.addText(a.desc, {
      x: 0.75, y: y + 0.48, w: 8.6, h: 0.5,
      fontSize: 11,
      color: COLORS.muted,
      fontFace: FONT.body,
      wrap: true,
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx);
  slideNumber(s, 11);
  heading(s, "Team", { size: 28 });
  subheading(s, "Founders to be introduced at meeting. Brief bios below.");

  dividerLine(s, 1.6);

  // Placeholder team cards
  const members = [
    {
      role: "Co-Founder / CEO",
      focus: "Product & Vision",
      bullets: [
        "[Background to be shared at meeting]",
        "Deep domain expertise in fitness / consumer apps",
        "Operator background",
      ],
    },
    {
      role: "Co-Founder / CTO",
      focus: "ML & Engineering",
      bullets: [
        "[Background to be shared at meeting]",
        "On-device ML / computer vision background",
        "Previously shipped consumer-scale mobile products",
      ],
    },
    {
      role: "Advisor",
      focus: "Fitness Industry",
      bullets: [
        "[Name to be shared]",
        "Credentialed biomechanist / strength coach",
        "Expert validation for correction logic",
      ],
    },
  ];

  members.forEach((m, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.75, w: 2.9, h: 4.7,
      fill: { color: COLORS.surface },
      line: { color: COLORS.accent, pt: 1 },
    });
    // Avatar placeholder circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.85, y: 1.95, w: 1.2, h: 1.2,
      fill: { color: COLORS.statBg },
      line: { color: COLORS.accent, pt: 1 },
    });
    s.addText(m.role, {
      x, y: 3.3, w: 2.9, h: 0.45,
      fontSize: 12,
      bold: true,
      color: COLORS.white,
      fontFace: FONT.heading,
      align: "center",
    });
    s.addText(m.focus, {
      x, y: 3.72, w: 2.9, h: 0.3,
      fontSize: 11,
      color: COLORS.accent,
      fontFace: FONT.body,
      align: "center",
    });
    bullet(s, m.bullets.map(b => ({ text: b })), {
      x: x + 0.1, y: 4.1, w: 2.7, h: 2.2, size: 10,
    });
  });

  s.addText("Full team bios, LinkedIn profiles, and reference contacts available on request.", {
    x: 0.5, y: 6.65, w: 9.2, h: 0.3,
    fontSize: 10,
    color: COLORS.muted,
    fontFace: FONT.body,
    italic: true,
    align: "center",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK / CLOSE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = slide(pptx, { accentStripe: false });

  // Left accent bar (matching cover)
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.12, h: "100%",
    fill: { color: COLORS.accent },
    line: { type: "none" },
  });

  heading(s, "The Ask", { x: 0.6, y: 0.5, size: 28 });

  // Big ask box
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 9.0, h: 1.5,
    fill: { color: COLORS.statBg },
    line: { color: COLORS.accent, pt: 2 },
  });
  s.addText("$2,000,000 Seed Round", {
    x: 0.6, y: 1.2, w: 9.0, h: 0.85,
    fontSize: 34,
    bold: true,
    color: COLORS.white,
    fontFace: FONT.heading,
    align: "center",
    valign: "bottom",
  });
  s.addText("18-month runway  •  Pre-revenue  •  Targeting public launch in 12 months", {
    x: 0.6, y: 2.05, w: 9.0, h: 0.55,
    fontSize: 13,
    color: COLORS.muted,
    fontFace: FONT.body,
    align: "center",
    valign: "top",
  });

  // Milestones
  s.addText("Seed Milestones", {
    x: 0.6, y: 2.95, w: 9.0, h: 0.4,
    fontSize: 14,
    bold: true,
    color: COLORS.accent,
    fontFace: FONT.heading,
  });

  dividerLine(s, 3.4);

  bullet(s, [
    { text: "M3  —  Android beta live; exercise library expanded to 80+", bold: false },
    { text: "M6  —  Freemium pricing model locked; public App Store launch", bold: false },
    { text: "M9  —  10,000 MAU; subscription conversion rate benchmarked", bold: false },
    { text: "M12  —  Trainer tier in private beta; Series A data package ready", bold: true, color: COLORS.accent },
  ], { x: 0.6, y: 3.5, w: 9.0, h: 2.5, size: 13 });

  // Contact CTA
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.4, w: 9.0, h: 0.75,
    fill: { color: COLORS.surface },
    line: { color: COLORS.accent, pt: 0.5 },
  });
  s.addText("Let's talk.  |  [founder@fitloop.io]  |  deck + data room available under NDA", {
    x: 0.6, y: 6.4, w: 9.0, h: 0.75,
    fontSize: 13,
    color: COLORS.white,
    fontFace: FONT.body,
    align: "center",
    valign: "middle",
  });
}

// ─── Write file ───────────────────────────────────────────────────────────────
pptx.writeFile({ fileName: OUTPUT_PATH }).then(() => {
  console.log("SUCCESS:", OUTPUT_PATH);
}).catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
