// slides-s3.js — Section 3: Why Now (Slide 5)
// "Three Simultaneous Unlocks"
// Duration: ~1.5 min | 1 slide

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addCard } = require('./theme');

module.exports = function buildSection3(pres) {

  // ── Slide 5: Why Now — Three Simultaneous Unlocks ─────────────────────────
  const s5 = pres.addSlide();
  s5.background = { color: colors.offWhite };

  // Coral left accent
  s5.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Title
  s5.addText('Why Now', {
    x: 0.25, y: 0.15, w: W - 0.5, h: 0.52,
    fontSize: 32, fontFace: fonts.title, bold: true,
    color: colors.charcoal, align: 'left',
  });

  // Separator (thin rect)
  s5.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 0.73, w: W - 0.5, h: 0.01,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Subtitle framing
  s5.addText('Three independent forces converging — not one trend, three.', {
    x: 0.25, y: 0.85, w: W - 0.5, h: 0.35,
    fontSize: 14, fontFace: fonts.body, bold: false,
    color: colors.grey, align: 'left',
  });

  // Optional three-icons image
  try {
    s5.addImage({ path: path.join(IMG, '05-why-now.png'), x: W - 4.2, y: 1.1, w: 4.0, h: 3.8 });
  } catch (e) { /* image absent */ }

  // Three unlock cards
  const unlocks = [
    {
      number: '01',
      title: 'On-Device ML Matured',
      body: 'MediaPipe Pose v3 (2025) + Apple ARBodyTracking on A17+ chips. Real-time pose estimation on a phone is production-ready. This was not true 24 months ago.',
    },
    {
      number: '02',
      title: 'Demand Spike',
      body: 'Post-Ozempic gym returners are re-learning movement basics. Motivated, embarrassed, coachable — and underserved by existing apps.',
    },
    {
      number: '03',
      title: 'Expectation Reset',
      body: 'Garmin and Whoop made "data-informed fitness" the consumer default. Neither does real-time form. The category expects coaching data — we deliver it.',
    },
  ];

  unlocks.forEach(({ number, title, body }, i) => {
    const cx = 0.25;
    const cy = 1.3 + i * 1.3;

    addCard(s5, pres, { x: cx, y: cy, w: 5.5, h: 1.15, accentColor: colors.coral });

    s5.addText(number, {
      x: cx + 0.2, y: cy + 0.1, w: 0.55, h: 0.9,
      fontSize: 32, fontFace: fonts.title, bold: true,
      color: colors.coral, align: 'center', valign: 'middle',
    });

    s5.addText(title, {
      x: cx + 0.85, y: cy + 0.08, w: 4.5, h: 0.38,
      fontSize: 16, fontFace: fonts.title, bold: true,
      color: colors.charcoal, align: 'left',
    });

    s5.addText(body, {
      x: cx + 0.85, y: cy + 0.48, w: 4.5, h: 0.55,
      fontSize: 11, fontFace: fonts.body,
      color: colors.grey, align: 'left',
    });
  });

  s5.addNotes(`TALKING POINTS:
• "Every 'why now' pitch talks about one trend. We have three that are independent of each other."
• [Point to 01] "The technology unlock: on-device pose estimation got good enough in 2025. MediaPipe Pose v3. Apple's ARBodyTrackingConfiguration. This is a proof-of-conditions statement — we used what now exists."
• [Point to 02] "Demand: the post-Ozempic gym returnee cohort is real and large. These are people re-learning basic movement who are highly motivated and have no good tool."
• [Point to 03] "Category expectations: Garmin and Whoop have normalized 'data about your body during exercise.' They own cardiovascular. Nobody owns real-time form."

[FOR TECH VCs:] "MediaPipe Pose v3 runs at 30fps on mid-range Android. ARBodyTracking on A17+ runs on-device at full resolution. These are the specific checkboxes that had to tick."
[FOR GENERALISTS:] "The short version: your phone is finally fast enough to watch your form in real time. That's new."

PACING:
[~1.5 min. Walk through each card steadily — don't rush. Each unlock is a sentence or two.]

TRANSITION:
"Here's what we built on top of those unlocks." [CLICK]`);
};
