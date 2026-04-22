// slides-s4.js — Section 4: Product (Slides 6–7)
// "Your Phone as a Form Coach"
// Duration: ~3 min | 2 slides

'use strict';

const path = require('path');
const { colors, fonts, IMG, W, H, addCard, makeCardShadow, addTractionBadge } = require('./theme');

module.exports = function buildSection4(pres) {

  // ── Slide 6: Product — Dark section opener / UI showcase ─────────────────
  const s6 = pres.addSlide();
  s6.background = { color: colors.navy };

  // Background product UI image (dark)
  try {
    s6.addImage({ path: path.join(IMG, '06-product-ui.jpg'), x: 0, y: 0, w: W, h: H, transparency: 40 });
  } catch (e) { /* image absent */ }

  // Section label top-left
  s6.addText('THE PRODUCT', {
    x: 0.4, y: 0.2, w: 3, h: 0.35,
    fontSize: 13, fontFace: fonts.title, bold: true,
    color: colors.coral, align: 'left',
  });

  // Headline
  s6.addText('Your Phone as a Form Coach', {
    x: 0.4, y: 0.65, w: 5.5, h: 0.75,
    fontSize: 36, fontFace: fonts.title, bold: true,
    color: colors.white, align: 'left',
  });

  // Four feature callouts (lower left stack)
  const features = [
    { icon: '[CAM]', text: 'Phone camera -> on-device pose estimation -> real-time rep feedback' },
    { icon: '[SEC]', text: 'No video ever leaves your phone. Privacy by architecture, not policy.' },
    { icon: '[40x]', text: '40 strength exercises in v1. Every rep scored, every set analyzed.' },
    { icon: '[AUD]', text: 'Audio cue feedback — no screen-staring mid-rep.' },
  ];

  features.forEach(({ icon, text }, i) => {
    // Card background
    s6.addShape(pres.ShapeType.rect, {
      x: 0.3, y: 1.6 + i * 0.82, w: 5.0, h: 0.7,
      fill: { color: colors.navy, transparency: 20 },
      line: { color: colors.coral, width: 1 },
    });

    s6.addText(icon + '  ' + text, {
      x: 0.45, y: 1.65 + i * 0.82, w: 4.7, h: 0.6,
      fontSize: 12, fontFace: fonts.body,
      color: colors.white, align: 'left', valign: 'middle',
    });
  });

  // Traction callback badge
  addTractionBadge(s6, pres);

  s6.addNotes(`TALKING POINTS:
• "Open the app, point the camera at yourself, start your set."
• "The phone watches your form in real time. No video uploads. No waiting. The coaching happens on the device."
• [Point to privacy feature] "Everything stays on the phone. That's not a marketing claim — it's the architecture. No video ever transmits."
• [Point to audio cue] "The insight we kept: mid-rep, you can't look at a screen. We deliver feedback as a subtle audio cue — a soft tone pattern that maps to form quality."
• "Forty exercises in v1. The library expands with the round."

PACING:
[~1.5 min. Walk the four feature cards. Privacy point often gets a nod from the room — pause there.]

TRANSITION:
"We can tell you how it works all day. Here's what 340 people actually did with it." [CLICK]`);

  // ── Slide 7: Technical Architecture — Plain English ───────────────────────
  const s7 = pres.addSlide();
  s7.background = { color: colors.offWhite };

  // Coral left accent
  s7.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: H,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Title
  s7.addText('How It Works', {
    x: 0.25, y: 0.15, w: 5, h: 0.52,
    fontSize: 28, fontFace: fonts.title, bold: true,
    color: colors.charcoal, align: 'left',
  });

  // "Everything on device" badge
  s7.addShape(pres.ShapeType.rect, {
    x: 6.8, y: 0.15, w: 3.0, h: 0.52,
    fill: { color: colors.coral }, line: { type: 'none' },
    shadow: makeCardShadow(),
  });
  s7.addText('Everything stays on your phone', {
    x: 6.8, y: 0.15, w: 3.0, h: 0.52,
    fontSize: 12, fontFace: fonts.title, bold: true,
    color: colors.white, align: 'center', valign: 'middle',
  });

  // Separator (thin rect)
  s7.addShape(pres.ShapeType.rect, {
    x: 0.25, y: 0.73, w: W - 0.5, h: 0.01,
    fill: { color: colors.coral }, line: { type: 'none' },
  });

  // Optional architecture diagram image
  try {
    s7.addImage({ path: path.join(IMG, '07-architecture.png'), x: 5.2, y: 1.0, w: 4.5, h: 4.0 });
  } catch (e) { /* image absent */ }

  // Pipeline steps (left side)
  const pipeline = [
    { step: '01', title: 'Camera Input', detail: 'Standard iOS/Android camera API. No special hardware. Works on A17+ iPhones natively; mid-range Android via MediaPipe Pose v3.' },
    { step: '02', title: 'On-Device Pose Estimation', detail: '33 body landmarks tracked at up to 30fps. All computation on-chip. No network call. No latency penalty.' },
    { step: '03', title: 'Form Scoring Engine', detail: 'Proprietary rep-phase detection + joint-angle thresholds per exercise. Scores each rep 0–100 in real time.' },
    { step: '04', title: 'Feedback Delivery', detail: 'Text overlay + audio cue (tone pattern). Calibrated not to interrupt the lifter mid-rep.' },
  ];

  pipeline.forEach(({ step, title, detail }, i) => {
    const cy = 0.95 + i * 1.1;

    addCard(s7, pres, { x: 0.25, y: cy, w: 4.85, h: 0.95, accentColor: colors.navy });

    s7.addText(step, {
      x: 0.38, y: cy + 0.05, w: 0.45, h: 0.82,
      fontSize: 20, fontFace: fonts.title, bold: true,
      color: colors.navy, align: 'center', valign: 'middle',
    });

    s7.addText(title, {
      x: 0.9, y: cy + 0.06, w: 4.0, h: 0.35,
      fontSize: 14, fontFace: fonts.title, bold: true,
      color: colors.charcoal, align: 'left',
    });

    s7.addText(detail, {
      x: 0.9, y: cy + 0.43, w: 4.0, h: 0.45,
      fontSize: 10, fontFace: fonts.body,
      color: colors.grey, align: 'left',
    });
  });

  s7.addNotes(`TALKING POINTS:
• "The pipeline is four steps — none of them require a network connection."

[FOR TECH VCs:] "MediaPipe Pose v3 gives us 33 body landmarks at 30fps on mid-range Android. On A17+ iPhones, ARBodyTrackingConfiguration adds depth — higher fidelity for joint-angle inference. Our form-scoring engine sits on top: rep-phase detection, joint-angle thresholds, per-exercise calibration. All on-device."
[FOR GENERALISTS:] "The short version: your phone watches, your phone scores, your phone tells you. No cloud involved. That's unusual in this space — usually the ML heavy lifting happens on a server."

• [Point to step 04] "The audio cue was the hardest UX problem. You can't look at a screen when you're mid-squat at depth. We spent six weeks calibrating the tone pattern so it's informative without being distracting."

PACING:
[~1.5 min. Pipeline cards can be walked through briskly. The on-device point and the audio-cue insight deserve pauses.]

TRANSITION:
"We can tell you how it works all day. Here's what 340 people actually did with it." [CLICK]`);
};
