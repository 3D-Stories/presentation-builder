// slides-s6.js — Section 6: Business Model + Ask (Slides 9–11)
// "What We Know, What We're Testing, and What We Need"
// Duration: ~3 min | 3 slides

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addCard, makeCardShadow } = require('./theme');

module.exports = function buildSection6(pres) {

  // ── Slide 9: Business Model — Honest Framing ─────────────────────────────
  const s9 = pres.addSlide();
  s9.background = { color: colors.offWhite };

  s9.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  s9.addText('Business Model', {
    x: 0.25, y: 0.15, w: W - 0.5, h: 0.52,
    fontSize: 32, fontFace: fonts.title, bold: true,
    color: colors.charcoal, align: 'left',
  });

  s9.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 0.73, w: W - 0.5, h: 0.01,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Honest framing sub-header
  s9.addText('We\'re testing monetization. Here\'s the data that will tell us which model wins.', {
    x: 0.25, y: 0.85, w: W - 0.5, h: 0.4,
    fontSize: 14, fontFace: fonts.body, italic: true,
    color: colors.grey, align: 'left',
  });

  // Optional AB model image
  try {
    s9.addImage({ path: path.join(IMG, '09-business-model.png'), x: 5.5, y: 1.1, w: 4.2, h: 3.5 });
  } catch (e) { /* image absent */ }

  // Two model cards side by side
  const models = [
    {
      label: 'Model A',
      title: 'Subscription',
      price: '$12–15/mo',
      signal: 'High intent segment (40% of beta) already asking for premium features',
      pro: 'Recurring revenue, aligns incentive with daily use',
      con: 'Higher conversion friction; free trial needed',
    },
    {
      label: 'Model B',
      title: 'Freemium',
      price: 'Free + $7–10/mo',
      signal: '60% of beta uses ≤ 2 exercises — potential free tier',
      pro: 'Lower barrier, viral growth potential',
      con: 'Harder to convert; free segment may never pay',
    },
  ];

  models.forEach(({ label, title, price, signal, pro, con }, i) => {
    const cx = 0.3 + i * 2.55;
    addCard(s9, pres, { x: cx, y: 1.35, w: 2.3, h: 3.7, accentColor: i === 0 ? colors.navy : colors.coral });

    s9.addText(label, {
      x: cx + 0.2, y: 1.5, w: 1.9, h: 0.32,
      fontSize: 12, fontFace: fonts.title, bold: true,
      color: i === 0 ? colors.navy : colors.coral, align: 'left',
    });
    s9.addText(title, {
      x: cx + 0.2, y: 1.82, w: 1.9, h: 0.4,
      fontSize: 18, fontFace: fonts.title, bold: true,
      color: colors.charcoal, align: 'left',
    });
    s9.addText(price, {
      x: cx + 0.2, y: 2.22, w: 1.9, h: 0.35,
      fontSize: 14, fontFace: fonts.title, bold: false,
      color: colors.grey, align: 'left',
    });

    s9.addText('Signal: ' + signal, {
      x: cx + 0.2, y: 2.65, w: 1.9, h: 0.9,
      fontSize: 10, fontFace: fonts.body,
      color: colors.charcoal, align: 'left',
    });
    s9.addText('✓ ' + pro, {
      x: cx + 0.2, y: 3.58, w: 1.9, h: 0.55,
      fontSize: 10, fontFace: fonts.body,
      color: colors.success, align: 'left',
    });
    s9.addText('✗ ' + con, {
      x: cx + 0.2, y: 4.13, w: 1.9, h: 0.55,
      fontSize: 10, fontFace: fonts.body,
      color: colors.coral, align: 'left',
    });
  });

  // Market framing note
  s9.addShape(pres.ShapeType.rect, {
    x: 5.3, y: 4.65, w: 4.5, h: 0.7,
    fill: { color: colors.navy }, line: { type: 'none' },
    shadow: makeCardShadow(),
  });
  s9.addText('Market proxy: 55M regular US lifters (SFIA 2024).\nEstimated addressable segment: 30–40% with form anxiety.', {
    x: 5.4, y: 4.7, w: 4.3, h: 0.6,
    fontSize: 10, fontFace: fonts.body,
    color: colors.gold, align: 'left', valign: 'middle',
  });

  s9.addNotes(`TALKING POINTS:
• "We're pre-revenue. We're not going to show you a revenue model we haven't earned the right to claim."
• "What we know: two monetization paths make sense. We're in-market testing both."
• [Point to subscription card] "Model A: subscription. Twelve to fifteen dollars a month. Forty percent of our beta cohort is already asking for premium features — that's a buying signal."
• [Point to freemium card] "Model B: freemium with a paid tier. Lower barrier, viral potential, but harder conversion."
• "The data that decides: which segment pays to retain access vs. which segment stays free forever. We'll know after the first paid cohort — which this round funds."
• [Point to market note] "We're not presenting a TAM we can't defend. What we know: fifty-five million Americans lift weights regularly. Our beta screening suggests thirty to forty percent have the form-anxiety profile we solve for. That's a public proxy, not our own research."

[FOR PMs:] "The honest framing here is intentional. We'd rather tell you what we don't know yet than fake precision on unit economics."

PACING:
[~1 min. Two-card layout is pre-digestible — don't over-explain. Point and move.]

TRANSITION:
"Here's where the two million goes." [CLICK]`);

  // ── Slide 10: Use of Funds — Milestone Roadmap ────────────────────────────
  const s10 = pres.addSlide();
  s10.background = { color: colors.offWhite };

  s10.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  s10.addText('Use of Funds — $2M Seed', {
    x: 0.25, y: 0.15, w: W - 0.5, h: 0.52,
    fontSize: 30, fontFace: fonts.title, bold: true,
    color: colors.charcoal, align: 'left',
  });

  s10.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 0.73, w: W - 0.5, h: 0.01,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  s10.addText('12-month runway to paid cohort proof.', {
    x: 0.25, y: 0.85, w: W - 0.5, h: 0.38,
    fontSize: 14, fontFace: fonts.body, italic: true,
    color: colors.grey, align: 'left',
  });

  // Optional use-of-funds image
  try {
    s10.addImage({ path: path.join(IMG, '10-use-of-funds.png'), x: 6.5, y: 1.1, w: 3.2, h: 3.8 });
  } catch (e) { /* image absent */ }

  // Three allocation cards
  const allocations = [
    {
      pct: '60%',
      amt: '$1.2M',
      category: 'Engineering',
      milestones: [
        '100+ exercise library (from 40)',
        'Android port (iOS-only today)',
        'Rep analytics dashboard v1',
        'Form progression tracking',
      ],
    },
    {
      pct: '25%',
      amt: '$500K',
      category: 'Growth',
      milestones: [
        'First paid cohort experiment',
        'CAC measurement + payback period',
        'Subscription vs. freemium signal',
        'Referral mechanic testing',
      ],
    },
    {
      pct: '15%',
      amt: '$300K',
      category: 'Operations',
      milestones: [
        'Infra + security audit',
        'Legal (IP, data privacy)',
        'Team (1 senior iOS hire)',
        '2-month reserve buffer',
      ],
    },
  ];

  allocations.forEach(({ pct, amt, category, milestones }, i) => {
    const cx = 0.25 + i * 2.15;
    const cy = 1.35;

    addCard(s10, pres, { x: cx, y: cy, w: 2.0, h: 3.7, accentColor: colors.coral });

    // Percentage big number
    s10.addText(pct, {
      x: cx + 0.15, y: cy + 0.12, w: 1.7, h: 0.65,
      fontSize: 36, fontFace: fonts.title, bold: true,
      color: colors.coral, align: 'center',
    });

    s10.addText(amt, {
      x: cx + 0.15, y: cy + 0.75, w: 1.7, h: 0.35,
      fontSize: 15, fontFace: fonts.body, bold: true,
      color: colors.grey, align: 'center',
    });

    s10.addText(category, {
      x: cx + 0.15, y: cy + 1.1, w: 1.7, h: 0.38,
      fontSize: 14, fontFace: fonts.title, bold: true,
      color: colors.charcoal, align: 'center',
    });

    milestones.forEach((m, j) => {
      s10.addText('→ ' + m, {
        x: cx + 0.15, y: cy + 1.55 + j * 0.47, w: 1.7, h: 0.42,
        fontSize: 10, fontFace: fonts.body,
        color: colors.charcoal, align: 'left',
      });
    });
  });

  s10.addNotes(`TALKING POINTS:
• "Sixty percent engineering — that's the product roadmap. A hundred-plus exercises, Android, and rep analytics."
• "Twenty-five percent growth — specifically, funding the first paid cohort experiment. We need to know CAC before we can talk unit economics."
• "Fifteen percent operations — one senior iOS hire, infra hardening, legal."
• "The headline: twelve months to get to paid cohort proof. That's the milestone this round buys."

[FOR PMs:] "The milestones on each bucket are the commitment. We're not asking for funding for activities — we're asking for specific outcomes."

PACING:
[~1 min. Chart is visual — point to each bucket and name the headline milestone. Don't read every sub-item.]

TRANSITION:
"So here's the ask." [CLICK]`);

  // ── Slide 11: The Ask ─────────────────────────────────────────────────────
  const s11 = pres.addSlide();
  s11.background = { color: colors.navy };

  // Optional aspirational background image
  try {
    s11.addImage({ path: path.join(IMG, '11-ask.jpg'), x: 0, y: 0, w: W, h: H, transparency: 55 });
  } catch (e) { /* image absent */ }

  s11.addText('THE ASK', {
    x: 0.5, y: 0.3, w: W - 1, h: 0.38,
    fontSize: 14, fontFace: fonts.title, bold: true,
    color: colors.coral, align: 'center',
  });

  s11.addText('$2M Seed Round', {
    x: 0.5, y: 0.85, w: W - 1, h: 1.0,
    fontSize: 64, fontFace: fonts.title, bold: true,
    color: colors.white, align: 'center',
  });

  s11.addText('12 months · Paid cohort proof · Monetization signal', {
    x: 1, y: 2.0, w: W - 2, h: 0.5,
    fontSize: 18, fontFace: fonts.title, bold: false,
    color: colors.gold, align: 'center',
  });

  // Three milestone bullets at bottom
  const milestones = [
    '100+ exercises, Android port',
    'First paid cohort — CAC + payback data',
    'Monetization model decided with real data',
  ];

  milestones.forEach((m, i) => {
    s11.addShape(pres.ShapeType.rect, {
      x: W / 2 - 2.5, y: 2.75 + i * 0.65, w: 5.0, h: 0.52,
      fill: { color: colors.navy, transparency: 25 },
      line: { color: colors.coral, width: 1 },
    });
    s11.addText('✓  ' + m, {
      x: W / 2 - 2.3, y: 2.77 + i * 0.65, w: 4.7, h: 0.48,
      fontSize: 14, fontFace: fonts.body,
      color: colors.white, align: 'left', valign: 'middle',
    });
  });

  s11.addNotes(`TALKING POINTS:
• "Two million dollars. Twelve months of runway."
• "Three things this round buys: a hundred-plus exercise library and Android — so we're not iOS-only. The first paid cohort experiment — so we have CAC data and monetization signal. And a decision: subscription or freemium, made with real data, not a guess."
• "We're not asking you to fund a revenue model we haven't proven. We're asking for the time and resources to find it — with a product that already has a 72% week-four retention number backing the bet."

PACING:
[~30 sec. The ask slide should be simple. Three bullets. Pause after the retention callback.]

TRANSITION:
"Before we take questions — one more slide." [CLICK]`);
};
