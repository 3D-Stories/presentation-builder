const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();

// Theme colors
const DARK_BG = '1A1F2E';
const ACCENT_BLUE = '4A90D9';
const ACCENT_ORANGE = 'F5A623';
const ACCENT_RED = 'E74C3C';
const ACCENT_GREEN = '2ECC71';
const WHITE = 'FFFFFF';
const LIGHT_GRAY = 'B0B8C8';
const MID_GRAY = '6B7A99';

pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Platform Team';
pptx.title = 'Auth v2 Migration — Engineering All-Hands';

// Helper: add a dark-background slide
function darkSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };

  if (title) {
    slide.addText(title, {
      x: 0.5, y: 1.8, w: 12.3, h: 1.2,
      fontSize: 36, bold: true, color: WHITE,
      fontFace: 'Calibri', align: 'center',
    });
  }
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 3.2, w: 12.3, h: 0.6,
      fontSize: 18, color: LIGHT_GRAY,
      fontFace: 'Calibri', align: 'center',
    });
  }
  return slide;
}

// Helper: add a content slide with left-panel accent bar
function contentSlide(title) {
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };
  // Top accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: ACCENT_BLUE }, line: { type: 'none' },
  });
  slide.addText(title, {
    x: 0.5, y: 0.18, w: 12.3, h: 0.7,
    fontSize: 24, bold: true, color: WHITE,
    fontFace: 'Calibri',
  });
  // Divider line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.5, y: 0.95, w: 12.3, h: 0,
    line: { color: MID_GRAY, width: 0.5 },
  });
  return slide;
}

// ─────────────────────────────────────────────
// SLIDE 1 — Title
// ─────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };

  // Big accent block
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 2.6, w: 13.33, h: 0.12,
    fill: { color: ACCENT_BLUE }, line: { type: 'none' },
  });

  slide.addText('Auth v2 Migration', {
    x: 0.5, y: 0.7, w: 12.3, h: 1.4,
    fontSize: 52, bold: true, color: WHITE,
    fontFace: 'Calibri', align: 'center',
  });
  slide.addText('What we shipped, the gnarliest bug, and what we'd do differently', {
    x: 0.5, y: 2.2, w: 12.3, h: 0.5,
    fontSize: 20, color: LIGHT_GRAY,
    fontFace: 'Calibri', align: 'center',
  });
  slide.addText('Platform Team  ·  Engineering All-Hands  ·  April 2026', {
    x: 0.5, y: 3.0, w: 12.3, h: 0.4,
    fontSize: 14, color: MID_GRAY,
    fontFace: 'Calibri', align: 'center',
  });

  // Shipped badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.4, y: 3.7, w: 2.5, h: 0.45,
    fill: { color: ACCENT_GREEN }, line: { type: 'none' },
    rectRadius: 0.1,
  });
  slide.addText('✓  SHIPPED 2026-03-28', {
    x: 5.4, y: 3.7, w: 2.5, h: 0.45,
    fontSize: 12, bold: true, color: WHITE,
    fontFace: 'Calibri', align: 'center',
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 — Agenda
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Agenda  (20 min)');

  const items = [
    ['1', 'Why we migrated', '3 min'],
    ['2', 'What we shipped', '5 min'],
    ['3', 'The 14-hour mobile lockout', '7 min'],
    ['4', 'What we'd do differently', '3 min'],
    ['5', 'Q&A', '2 min'],
  ];

  items.forEach(([num, label, time], i) => {
    const y = 1.15 + i * 0.72;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 0.5, h: 0.5,
      fill: { color: ACCENT_BLUE }, line: { type: 'none' },
    });
    slide.addText(num, {
      x: 0.5, y, w: 0.5, h: 0.5,
      fontSize: 16, bold: true, color: WHITE,
      fontFace: 'Calibri', align: 'center', valign: 'middle',
    });
    slide.addText(label, {
      x: 1.2, y: y + 0.04, w: 8.5, h: 0.42,
      fontSize: 18, color: WHITE,
      fontFace: 'Calibri', valign: 'middle',
    });
    slide.addText(time, {
      x: 9.9, y: y + 0.04, w: 2.9, h: 0.42,
      fontSize: 14, color: MID_GRAY,
      fontFace: 'Calibri', align: 'right', valign: 'middle',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3 — Why We Migrated
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Why We Migrated');

  slide.addText('auth-v1 (ca. 2021): server-rendered session cookies + sticky-session load balancer', {
    x: 0.5, y: 1.05, w: 12.3, h: 0.45,
    fontSize: 15, color: LIGHT_GRAY, fontFace: 'Calibri', italic: true,
  });

  const blockers = [
    { icon: '📱', title: 'Mobile clients blocked', body: 'Sticky sessions force a clunky HTML form round-trip for background refresh — native apps can\'t live with this.' },
    { icon: '⚖️', title: 'Autoscaler pinned', body: 'Session affinity means users stick to a pod until it dies. Our autoscaler stays over-provisioned as a result.' },
    { icon: '🔗', title: 'No OIDC endpoint', body: 'Three design partners asked for OIDC. We had nothing to give them. Every integration was bespoke.' },
  ];

  blockers.forEach((b, i) => {
    const y = 1.65 + i * 1.15;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 12.3, h: 1.0,
      fill: { color: '252B3D' }, line: { color: '3A4260', width: 1 },
    });
    slide.addText(b.icon + '  ' + b.title, {
      x: 0.75, y: y + 0.05, w: 11.8, h: 0.38,
      fontSize: 16, bold: true, color: ACCENT_BLUE, fontFace: 'Calibri',
    });
    slide.addText(b.body, {
      x: 0.75, y: y + 0.44, w: 11.8, h: 0.48,
      fontSize: 13, color: LIGHT_GRAY, fontFace: 'Calibri',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 4 — What We Shipped (Overview)
// ─────────────────────────────────────────────
{
  const slide = contentSlide('What We Shipped');

  const bullets = [
    ['OIDC-compliant IdP', 'New id.internal service wrapping our existing user table'],
    ['RS256 JWTs (15 min TTL)', 'Short-lived access tokens — no shared secret across 23 services'],
    ['HttpOnly refresh cookie', '30-day, SameSite=Strict — XSS-safe by design'],
    ['4-week dual-read window', 'All services accepted either Cookie session OR Bearer JWT simultaneously'],
    ['3-wave rollout', 'Internal tools → customer web → mobile (remote-flag gated)'],
    ['Partner OIDC live', '3 design partners integrated as of 2026-04-10'],
  ];

  bullets.forEach(([title, sub], i) => {
    const y = 1.1 + i * 0.65;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: y + 0.12, w: 0.08, h: 0.28,
      fill: { color: ACCENT_BLUE }, line: { type: 'none' },
    });
    slide.addText(title, {
      x: 0.8, y, w: 4.8, h: 0.35,
      fontSize: 15, bold: true, color: WHITE, fontFace: 'Calibri',
    });
    slide.addText(sub, {
      x: 0.8, y: y + 0.33, w: 11.8, h: 0.28,
      fontSize: 12, color: LIGHT_GRAY, fontFace: 'Calibri',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 5 — Key Decisions
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Key Decisions');

  const rows = [
    ['Decision', 'We Chose', 'We Rejected', 'Why'],
    ['Token algorithm', 'RS256', 'HS256', 'Shared secret = every service is a key-holder'],
    ['Refresh storage', 'HttpOnly cookie', 'LocalStorage', 'XSS-reachable; security vendors ping us monthly'],
    ['Token lifetime', '15 min / 30 day', '1 hr / 7 day', 'Shorter window limits lateral risk from stolen token'],
    ['Logout model', 'Refresh revocation\n+ short TTL', 'Session kill list', 'Kill list needs distributed cache we don\'t have'],
  ];

  const colX = [0.5, 3.1, 5.7, 8.3];
  const colW = [2.5, 2.5, 2.5, 4.8];
  const headerH = 0.45;
  const rowH = 0.72;

  rows.forEach((row, ri) => {
    const y = 1.05 + ri * (ri === 0 ? headerH : rowH) + (ri > 0 ? headerH - rowH : 0);
    const rowY = ri === 0 ? 1.05 : 1.05 + headerH + (ri - 1) * rowH;
    const bg = ri === 0 ? ACCENT_BLUE : (ri % 2 === 0 ? '252B3D' : '1F243A');
    const h = ri === 0 ? headerH : rowH;

    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: rowY, w: 12.3, h,
      fill: { color: bg }, line: { type: 'none' },
    });

    row.forEach((cell, ci) => {
      slide.addText(cell, {
        x: colX[ci] + 0.08, y: rowY + 0.04, w: colW[ci] - 0.1, h: h - 0.08,
        fontSize: ri === 0 ? 13 : 12,
        bold: ri === 0,
        color: ri === 0 ? WHITE : (ci === 1 ? ACCENT_GREEN : ci === 2 ? ACCENT_ORANGE : LIGHT_GRAY),
        fontFace: 'Calibri', valign: 'middle',
      });
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 6 — By the Numbers
// ─────────────────────────────────────────────
{
  const slide = contentSlide('By the Numbers');

  const stats = [
    { val: '23', label: 'services touched', color: ACCENT_BLUE },
    { val: '142', label: 'PRs merged', color: ACCENT_BLUE },
    { val: '7 wks', label: 'ramp time\n(planned: 4)', color: ACCENT_ORANGE },
    { val: '~12%', label: 'API tier cost\nsavings (est.)', color: ACCENT_GREEN },
    { val: '3', label: 'OIDC design\npartners live', color: ACCENT_GREEN },
    { val: '31k', label: 'mobile users\nimpacted (P1)', color: ACCENT_RED },
  ];

  stats.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.25;
    const y = 1.1 + row * 1.85;

    slide.addShape(pptx.ShapeType.rect, {
      x, y, w: 4.0, h: 1.6,
      fill: { color: '252B3D' }, line: { color: s.color, width: 1.5 },
    });
    slide.addText(s.val, {
      x, y: y + 0.1, w: 4.0, h: 0.75,
      fontSize: 36, bold: true, color: s.color,
      fontFace: 'Calibri', align: 'center',
    });
    slide.addText(s.label, {
      x, y: y + 0.85, w: 4.0, h: 0.65,
      fontSize: 13, color: LIGHT_GRAY,
      fontFace: 'Calibri', align: 'center',
    });
  });

  slide.addText('* Cost savings estimate: autoscaler still settling — treat as directional', {
    x: 0.5, y: 4.85, w: 12.3, h: 0.3,
    fontSize: 11, color: MID_GRAY, fontFace: 'Calibri', italic: true,
  });
}

// ─────────────────────────────────────────────
// SLIDE 7 — Section divider: The Incident
// ─────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: '1A0A0A' };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 2.4, w: 13.33, h: 0.12,
    fill: { color: ACCENT_RED }, line: { type: 'none' },
  });

  slide.addText('⚡ The Gnarliest Bug', {
    x: 0.5, y: 0.8, w: 12.3, h: 1.2,
    fontSize: 44, bold: true, color: WHITE,
    fontFace: 'Calibri', align: 'center',
  });
  slide.addText('14-hour mobile lockout · P1 · 31,000 users', {
    x: 0.5, y: 2.1, w: 12.3, h: 0.5,
    fontSize: 20, color: ACCENT_RED,
    fontFace: 'Calibri', align: 'center',
  });
  slide.addText('2026-03-19', {
    x: 0.5, y: 2.8, w: 12.3, h: 0.4,
    fontSize: 14, color: MID_GRAY,
    fontFace: 'Calibri', align: 'center',
  });
}

// ─────────────────────────────────────────────
// SLIDE 8 — What Happened
// ─────────────────────────────────────────────
{
  const slide = contentSlide('What Happened');
  slide.background = { color: '1A0A0A' };

  slide.addText('Two independent bugs combined to make a rollback impossible', {
    x: 0.5, y: 1.05, w: 12.3, h: 0.45,
    fontSize: 15, color: LIGHT_GRAY, fontFace: 'Calibri', italic: true,
  });

  // Bug 1
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.65, w: 5.8, h: 2.4,
    fill: { color: '2A1010' }, line: { color: ACCENT_RED, width: 1.5 },
  });
  slide.addText('Bug 1 — JWT audience mismatch', {
    x: 0.65, y: 1.75, w: 5.5, h: 0.42,
    fontSize: 14, bold: true, color: ACCENT_RED, fontFace: 'Calibri',
  });
  slide.addText(
    'Mobile issuer configured: aud: "mobile.app"\n\nBackend verifier expected: aud: "api.<env>"\n\nResult: every mobile token rejected.',
    {
      x: 0.65, y: 2.22, w: 5.5, h: 1.75,
      fontSize: 13, color: LIGHT_GRAY, fontFace: 'Calibri',
    }
  );

  // Bug 2
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.9, y: 1.65, w: 5.9, h: 2.4,
    fill: { color: '2A1010' }, line: { color: ACCENT_ORANGE, width: 1.5 },
  });
  slide.addText('Bug 2 — SameSite=Strict broke webview', {
    x: 7.05, y: 1.75, w: 5.65, h: 0.42,
    fontSize: 14, bold: true, color: ACCENT_ORANGE, fontFace: 'Calibri',
  });
  slide.addText(
    'Webview top-level navigation looks cross-site to the cookie.\n\nWe tested browser + native, NOT the webview flow.\n\nWhen we reverted the flag, upgraded sessions couldn\'t re-establish under v1.',
    {
      x: 7.05, y: 2.22, w: 5.65, h: 1.75,
      fontSize: 13, color: LIGHT_GRAY, fontFace: 'Calibri',
    }
  );

  // Combined effect callout
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 4.2, w: 12.3, h: 0.65,
    fill: { color: '3A1515' }, line: { color: ACCENT_RED, width: 1 },
  });
  slide.addText('💥  Combined effect: "flip the flag back" didn\'t restore logins — state had already been mutated.', {
    x: 0.65, y: 4.3, w: 12.0, h: 0.45,
    fontSize: 14, bold: true, color: WHITE, fontFace: 'Calibri',
  });
}

// ─────────────────────────────────────────────
// SLIDE 9 — Incident Timeline
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Incident Timeline');
  slide.background = { color: '1A0A0A' };

  const events = [
    { time: '08:12', label: 'auth_v2_mobile flag → 100%', type: 'trigger' },
    { time: '08:28', label: 'First user-reported login failure (support ticket)', type: 'info' },
    { time: '08:42', label: 'Ops paged — app crash spike', type: 'warn' },
    { time: '09:10', label: 'Flag reverted to 0%.  Logins do NOT recover.  3 hrs lost looking at mobile build.', type: 'crit' },
    { time: '12:35', label: 'aud claim mismatch found while running verifier locally', type: 'info' },
    { time: '13:10', label: 'Hotfix #1 PR merged (audience list)', type: 'fix' },
    { time: '14:02', label: 'Staged rollout begins', type: 'fix' },
    { time: '17:50', label: 'SameSite issue found — why recovered sessions re-fail after 15 min', type: 'warn' },
    { time: '19:30', label: 'Hotfix #2: SameSite=Lax for mobile webview path', type: 'fix' },
    { time: '23:04', label: 'Error rate back to baseline  (14h 22m total)', type: 'resolved' },
  ];

  const typeColor = {
    trigger: ACCENT_ORANGE,
    info: ACCENT_BLUE,
    warn: ACCENT_ORANGE,
    crit: ACCENT_RED,
    fix: ACCENT_GREEN,
    resolved: ACCENT_GREEN,
  };

  events.forEach((e, i) => {
    const y = 1.05 + i * 0.4;
    const col = typeColor[e.type];

    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: y + 0.06, w: 0.22, h: 0.22,
      fill: { color: col }, line: { type: 'none' },
    });
    slide.addText(e.time, {
      x: 0.85, y, w: 1.0, h: 0.35,
      fontSize: 12, bold: true, color: col, fontFace: 'Calibri',
    });
    slide.addText(e.label, {
      x: 2.0, y, w: 11.0, h: 0.35,
      fontSize: 12, color: e.type === 'crit' ? ACCENT_RED : LIGHT_GRAY, fontFace: 'Calibri',
      bold: e.type === 'crit',
    });
    // connecting line (not last)
    if (i < events.length - 1) {
      slide.addShape(pptx.ShapeType.line, {
        x: 0.605, y: y + 0.28, w: 0, h: 0.17,
        line: { color: MID_GRAY, width: 0.5 },
      });
    }
  });
}

// ─────────────────────────────────────────────
// SLIDE 10 — Root Cause Deep-Dive
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Root Cause — Three Process Failures');
  slide.background = { color: '1A0A0A' };

  const items = [
    {
      num: '1',
      title: 'aud claim in two places',
      body: 'Issuer config + staging deploy overlay disagreed. Staging uses a different audience string so CI caught neither.'
    },
    {
      num: '2',
      title: 'Webview flow never tested',
      body: 'Three engineers said "we should test that" across two sprints. It never made it into a test plan. Webview is neither browser nor native — it\'s its own platform.'
    },
    {
      num: '3',
      title: 'Naive rollback assumption',
      body: '"Flip the flag back" is not a rollback when state has already been mutated in-flight. We spent 3 hours on the wrong hypothesis.'
    },
  ];

  items.forEach((item, i) => {
    const y = 1.15 + i * 1.28;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 12.3, h: 1.1,
      fill: { color: '221212' }, line: { color: ACCENT_RED, width: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 0.55, h: 1.1,
      fill: { color: ACCENT_RED }, line: { type: 'none' },
    });
    slide.addText(item.num, {
      x: 0.5, y: y + 0.3, w: 0.55, h: 0.5,
      fontSize: 22, bold: true, color: WHITE, fontFace: 'Calibri', align: 'center',
    });
    slide.addText(item.title, {
      x: 1.2, y: y + 0.06, w: 11.4, h: 0.38,
      fontSize: 15, bold: true, color: WHITE, fontFace: 'Calibri',
    });
    slide.addText(item.body, {
      x: 1.2, y: y + 0.46, w: 11.4, h: 0.55,
      fontSize: 13, color: LIGHT_GRAY, fontFace: 'Calibri',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 11 — Section divider: Lessons
// ─────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 2.4, w: 13.33, h: 0.12,
    fill: { color: ACCENT_GREEN }, line: { type: 'none' },
  });

  slide.addText('What We\'d Do Differently', {
    x: 0.5, y: 0.8, w: 12.3, h: 1.2,
    fontSize: 44, bold: true, color: WHITE,
    fontFace: 'Calibri', align: 'center',
  });
  slide.addText('Four lessons that are already changing how we ship', {
    x: 0.5, y: 2.1, w: 12.3, h: 0.5,
    fontSize: 20, color: LIGHT_GRAY,
    fontFace: 'Calibri', align: 'center',
  });
}

// ─────────────────────────────────────────────
// SLIDE 12 — Lessons
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Lessons — Already in Practice');

  const lessons = [
    {
      icon: '🐦',
      title: 'Canary at 1% → 10% → 50% → 100%',
      body: 'Not "dev → staging → 100%". Each wave gets a soak period. Three waves was two waves too few.',
      status: 'adopted',
    },
    {
      icon: '🧪',
      title: 'Explicit test matrix for every auth surface',
      body: 'Browser, native, webview, SDK — all four. The matrix now lives as a YAML file in the repo; CI reads it. Written-in-Notion matrices rot.',
      status: 'adopted',
    },
    {
      icon: '🔄',
      title: 'State-aware rollback',
      body: 'Accept v1 OR v2 tokens for a full week after any flag flip, not just during initial migration. Flag rollback ≠ state rollback. (Runbook: PLAT-951, in progress.)',
      status: 'in-progress',
    },
    {
      icon: '🎯',
      title: 'One source of truth for every config value',
      body: 'Deleted the staging aud override. If two files can disagree, they will, at the worst possible time.',
      status: 'adopted',
    },
  ];

  const statusColor = { adopted: ACCENT_GREEN, 'in-progress': ACCENT_ORANGE };
  const statusLabel = { adopted: 'Done ✓', 'in-progress': 'In progress' };

  lessons.forEach((l, i) => {
    const y = 1.1 + i * 0.95;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 12.3, h: 0.82,
      fill: { color: '1E2535' }, line: { color: statusColor[l.status], width: 1 },
    });
    slide.addText(l.icon + '  ' + l.title, {
      x: 0.7, y: y + 0.04, w: 9.5, h: 0.35,
      fontSize: 14, bold: true, color: WHITE, fontFace: 'Calibri',
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 10.35, y: y + 0.14, w: 2.3, h: 0.28,
      fill: { color: statusColor[l.status] }, line: { type: 'none' },
    });
    slide.addText(statusLabel[l.status], {
      x: 10.35, y: y + 0.14, w: 2.3, h: 0.28,
      fontSize: 11, bold: true, color: WHITE, fontFace: 'Calibri', align: 'center', valign: 'middle',
    });
    slide.addText(l.body, {
      x: 0.7, y: y + 0.4, w: 11.9, h: 0.35,
      fontSize: 12, color: LIGHT_GRAY, fontFace: 'Calibri',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 13 — Open Questions
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Open Questions & What\'s Next');

  const questions = [
    { q: 'Do we move to passkeys next?', note: 'Team opinion is split — good problem to have' },
    { q: 'Should the refresh-token TTL be shorter than 30 days?', note: 'PLAT-958 audit underway for all SameSite settings too' },
    { q: 'Do we deprecate auth-v1 entirely, or keep it alive for legacy partners?', note: 'Decision needed before Q3 SSO roadmap' },
    { q: 'Q3 roadmap: device binding, hardware-key flows, SSO with parent company IdP', note: 'Out of scope for this migration — starting design in Q3' },
  ];

  questions.forEach((item, i) => {
    const y = 1.15 + i * 0.9;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 0.07, h: 0.55,
      fill: { color: ACCENT_ORANGE }, line: { type: 'none' },
    });
    slide.addText('?  ' + item.q, {
      x: 0.75, y: y + 0.02, w: 11.8, h: 0.38,
      fontSize: 15, bold: true, color: WHITE, fontFace: 'Calibri',
    });
    slide.addText(item.note, {
      x: 0.75, y: y + 0.42, w: 11.8, h: 0.35,
      fontSize: 13, color: MID_GRAY, fontFace: 'Calibri', italic: true,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 14 — Good Calls in Retrospect
// ─────────────────────────────────────────────
{
  const slide = contentSlide('Good Calls in Retrospect');

  const wins = [
    {
      title: 'RS256 over HS256',
      body: 'Would have been a nightmare to rotate shared secrets across 23 services. Asymmetric signing was the right call from the start.',
    },
    {
      title: 'HttpOnly refresh cookie',
      body: 'Every month a security vendor pings us about LocalStorage token storage. Now we just say "no." XSS-safe by design.',
    },
    {
      title: 'Dual-read window saved us',
      body: 'Without the 4-week dual-read window, the mobile incident would have been a complete outage, not a partial one. It bought us time.',
    },
  ];

  wins.forEach((w, i) => {
    const y = 1.2 + i * 1.35;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 12.3, h: 1.15,
      fill: { color: '0E2E1E' }, line: { color: ACCENT_GREEN, width: 1.5 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y, w: 0.55, h: 1.15,
      fill: { color: ACCENT_GREEN }, line: { type: 'none' },
    });
    slide.addText('✓', {
      x: 0.5, y: y + 0.32, w: 0.55, h: 0.5,
      fontSize: 22, bold: true, color: WHITE, fontFace: 'Calibri', align: 'center',
    });
    slide.addText(w.title, {
      x: 1.2, y: y + 0.1, w: 11.4, h: 0.4,
      fontSize: 16, bold: true, color: ACCENT_GREEN, fontFace: 'Calibri',
    });
    slide.addText(w.body, {
      x: 1.2, y: y + 0.52, w: 11.4, h: 0.55,
      fontSize: 13, color: LIGHT_GRAY, fontFace: 'Calibri',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 15 — Summary / Closing
// ─────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: ACCENT_BLUE }, line: { type: 'none' },
  });

  slide.addText('TL;DR', {
    x: 0.5, y: 0.25, w: 12.3, h: 0.65,
    fontSize: 28, bold: true, color: ACCENT_BLUE, fontFace: 'Calibri', align: 'center',
  });

  const summary = [
    'We shipped a full OIDC auth stack across 23 services in 7 weeks.',
    'Two compounding bugs (aud mismatch + SameSite cookie) turned a wave-3 flag flip into a 14-hour P1.',
    'Flag rollback ≠ state rollback. This is now a first-class design constraint.',
    'Test matrices that live in Notion rot. Ours is now YAML in CI.',
    'The dual-read window was the best decision we made — plan your escape hatch before you need it.',
  ];

  summary.forEach((line, i) => {
    const y = 1.05 + i * 0.72;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: y + 0.12, w: 0.28, h: 0.28,
      fill: { color: ACCENT_BLUE }, line: { type: 'none' },
    });
    slide.addText(line, {
      x: 0.98, y, w: 11.8, h: 0.6,
      fontSize: 15, color: WHITE, fontFace: 'Calibri', valign: 'middle',
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 16 — Q&A
// ─────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 2.5, w: 13.33, h: 0.12,
    fill: { color: ACCENT_BLUE }, line: { type: 'none' },
  });

  slide.addText('Q&A', {
    x: 0.5, y: 0.7, w: 12.3, h: 1.5,
    fontSize: 72, bold: true, color: WHITE,
    fontFace: 'Calibri', align: 'center',
  });
  slide.addText('Design doc: PLAT-842  ·  Postmortem: PLAT-943', {
    x: 0.5, y: 2.7, w: 12.3, h: 0.45,
    fontSize: 16, color: LIGHT_GRAY, fontFace: 'Calibri', align: 'center',
  });
  slide.addText('Platform Team  ·  candrosoff@stars.ca', {
    x: 0.5, y: 3.25, w: 12.3, h: 0.38,
    fontSize: 14, color: MID_GRAY, fontFace: 'Calibri', align: 'center',
  });
}

// ─────────────────────────────────────────────
// Write output
// ─────────────────────────────────────────────
const outputPath = '/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-3/eval-auth-migration/without_skill/outputs/auth-migration-allhands.pptx';

pptx.writeFile({ fileName: outputPath })
  .then(() => console.log('PPTX written to: ' + outputPath))
  .catch(err => { console.error('Error:', err); process.exit(1); });
