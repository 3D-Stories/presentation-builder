//
// slides-s3.js — Section 3: The Incident (Slides 10–13)
// "At 08:12 UTC on a Thursday morning, we flipped the mobile flag to 100%."
//
// Phase 3 review notes:
// - "logins do NOT recover" twist must have a visual callout on Slide 11
// - Root cause on Slide 12 needs the aud claim discrepancy shown explicitly
//

"use strict";

const { colors, fonts, imgPath, addDividerSlide, addContentSlide, addCard, addCode } = require("./theme");

module.exports = function addSection3(pres) {
  // ─────────────────────────────────────────────────────────────────────────
  // Slide 10: Section Divider — "The Incident"
  // ─────────────────────────────────────────────────────────────────────────
  addDividerSlide(pres, {
    title: "The Incident",
    subtitle: "P1 · 14h 22m · 31,000 mobile users",
    imagePath: imgPath("10-section-divider-incident.jpg"),
    sectionIndex: 2,
    speakerNotes: `TALKING POINTS:
• "P1. 14 hours 22 minutes. 31,000 mobile users silently logged out."
• [PAUSE — 2 seconds]
• "This is where the talk gets real."

PACING:
[~30 sec. Visual beat — let the severity land.]

TRANSITION:
"Here's the timeline." [CLICK]`,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 11: Timeline
  // Phase 3: "logins do NOT recover" must be a visual callout
  // ─────────────────────────────────────────────────────────────────────────
  const slide11 = addContentSlide(pres, {
    title: "08:12 to 23:04 — What Actually Happened",
  });

  // Timeline events
  const events = [
    { time: "08:12", label: "Flag flipped to 100%", color: colors.navy, y: 2.1 },
    { time: "08:28", label: "First support ticket", color: colors.warning, y: 2.1 },
    { time: "08:42", label: "Ops paged (crash spike)", color: colors.danger, y: 2.1 },
    { time: "09:10", label: "Flag reverted to 0%", color: colors.navy, y: 2.1 },
    { time: "12:35", label: "aud mismatch found", color: colors.success, y: 2.1 },
    { time: "13:10", label: "Hotfix #1 merged", color: colors.success, y: 2.1 },
    { time: "17:50", label: "SameSite issue found", color: colors.teal, y: 2.1 },
    { time: "19:30", label: "Hotfix #2: SameSite=Lax", color: colors.success, y: 2.1 },
    { time: "23:04", label: "Error rate baseline", color: colors.success, y: 2.1 },
  ];

  // Timeline base line
  slide11.addShape(pres.ShapeType.line, {
    x: 0.4, y: 2.5, w: 9.2, h: 0,
    line: { color: colors.teal, width: 2 },
  });

  const spacing = 9.2 / (events.length - 1);
  events.forEach((ev, i) => {
    const x = 0.4 + i * spacing;
    const isReverted = i === 3; // 09:10 — flag reverted

    // Dot
    slide11.addShape(pres.ShapeType.ellipse, {
      x: x - 0.13, y: 2.37, w: 0.26, h: 0.26,
      fill: { color: isReverted ? colors.danger : ev.color },
      line: { color: isReverted ? colors.danger : ev.color, width: 1 },
    });

    // Time label (alternating above/below)
    const labelY = i % 2 === 0 ? 1.4 : 3.05;
    slide11.addText(ev.time, {
      x: x - 0.35, y: labelY, w: 0.7, h: 0.3,
      fontSize: 9, bold: true, color: colors.navy, fontFace: fonts.body, align: "center",
    });
    slide11.addText(ev.label, {
      x: x - 0.65, y: labelY + 0.3, w: 1.3, h: 0.55,
      fontSize: 9, color: ev.color, fontFace: fonts.body, align: "center", wrap: true,
    });
  });

  // CRITICAL: "logins do NOT recover" callout box — visual emphasis required (Phase 3)
  addCard(slide11, pres, { x: 1.6, y: 3.8, w: 5.8, h: 1.4, accentColor: colors.danger });
  slide11.addText("LOGINS DO NOT RECOVER", {
    x: 1.75, y: 3.9, w: 5.5, h: 0.5,
    fontSize: 18, bold: true, color: colors.danger, fontFace: fonts.title, align: "center",
  });
  slide11.addText(
    "Flag revert at 09:10 was supposed to roll back. It didn't. Sessions already upgraded to v2 " +
    "couldn't re-establish under v1 because the refresh cookie had been rewritten with wrong attributes.",
    {
      x: 1.75, y: 4.4, w: 5.5, h: 0.75,
      fontSize: 11, color: colors.navy, fontFace: fonts.body, wrap: true,
    }
  );

  slide11.addNotes(`TALKING POINTS:
• "Here's the timeline. Walk through it with me."
• "08:12 — we flip the flag. 08:28 — first support ticket. 08:42 — ops is paged."
• "09:10 — we revert the flag. And this is the moment that matters."
• [PAUSE] "Logins. Did. Not. Recover."
• "We expected the flag rollback to fix it. It didn't. We spent the next three hours looking at the mobile build — wrong direction entirely."
• "At 12:35, I was running the verifier locally and noticed the aud claim mismatch. That was the first real break."
• "We shipped hotfix #1 at 13:10. But at 17:50 we found a second bug — the SameSite issue — which explained why recovered sessions were re-failing after 15 minutes."
• "23:04 — error rate back to baseline. 14 hours 22 minutes total."
• [FOR DEVS:] "The three hours spent on the wrong track — 09:10 to 12:35 — is the most expensive lesson here."

PACING:
[~2 min. Go slower on the "logins do NOT recover" beat. The audience needs to understand what rollback failure means before the root cause slide.]

TRANSITION:
"Why didn't the rollback work? Two bugs compounded." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 12: Root Cause Deep-Dive
  // ─────────────────────────────────────────────────────────────────────────
  const slide12 = addContentSlide(pres, {
    title: "Root Cause: Two Bugs That Compounded",
  });

  // Bug 1 — left column
  addCard(slide12, pres, { x: 0.4, y: 1.15, w: 4.5, h: 5.1, accentColor: colors.danger });
  slide12.addText("Bug 1: JWT Audience Mismatch", {
    x: 0.55, y: 1.22, w: 4.2, h: 0.45,
    fontSize: 13, bold: true, color: colors.danger, fontFace: fonts.title,
  });
  slide12.addText("Mobile issuer configured with:", {
    x: 0.55, y: 1.72, w: 4.1, h: 0.32,
    fontSize: 11, color: colors.navy, fontFace: fonts.body,
  });
  addCode(slide12, pres, {
    x: 0.55, y: 2.08, w: 4.1, h: 0.5,
    code: 'aud: "mobile.app"   // legacy spike value',
  });
  slide12.addText("Backend verifier only accepted:", {
    x: 0.55, y: 2.65, w: 4.1, h: 0.32,
    fontSize: 11, color: colors.navy, fontFace: fonts.body,
  });
  addCode(slide12, pres, {
    x: 0.55, y: 3.0, w: 4.1, h: 0.5,
    code: 'aud: "api.<env>"    // new standard',
  });
  slide12.addText(
    "Result: every mobile token rejected as\n\"audience mismatch\" — 100% failure rate.\n\n" +
    "Root issue: aud claim set in TWO places (issuer config + staging deploy overlay). They disagreed. Staging tests never caught it because staging uses a different aud string.",
    {
      x: 0.55, y: 3.6, w: 4.2, h: 2.3,
      fontSize: 11, color: colors.navy, fontFace: fonts.body, wrap: true, valign: "top",
    }
  );

  // Bug 2 — right column
  addCard(slide12, pres, { x: 5.1, y: 1.15, w: 4.5, h: 5.1, accentColor: colors.warning });
  slide12.addText("Bug 2: SameSite=Strict in Webview", {
    x: 5.25, y: 1.22, w: 4.2, h: 0.45,
    fontSize: 13, bold: true, color: colors.warning, fontFace: fonts.title,
  });
  slide12.addText(
    "Refresh cookie set with SameSite=Strict.\n\n" +
    "Browser sign-in: fine — top-level navigation is same-site.\n\n" +
    "Native app sign-in: fine — no cookie policy applies.\n\n" +
    "Webview sign-in: the webview's top-level navigation looks CROSS-SITE from the cookie's perspective. Refresh cookie is blocked.",
    {
      x: 5.25, y: 1.72, w: 4.2, h: 3.2,
      fontSize: 11, color: colors.navy, fontFace: fonts.body, wrap: true, valign: "top",
    }
  );
  slide12.addText(
    "We tested browser extensively. We tested native briefly. We never tested webview.",
    {
      x: 5.25, y: 5.05, w: 4.2, h: 0.85,
      fontSize: 12, bold: true, color: colors.danger, fontFace: fonts.body, wrap: true,
    }
  );

  slide12.addNotes(`TALKING POINTS:
• "Two bugs. Either one alone would have been bad. Together they made rollback impossible."
• [Point to Bug 1] "The audience claim mismatch: the mobile issuer was configured with 'aud: mobile.app' — a value from a proof-of-concept spike months earlier. The backend's new verifier only accepted 'aud: api.<env>'. Every single mobile token was rejected."
• "What made it worse: the audience claim was defined in two places. The issuer config and the staging deploy overlay. They disagreed. Staging tests caught neither because staging uses its own audience string — a gap in our test matrix."
• [Point to Bug 2] "The SameSite issue is subtler. We set SameSite=Strict on the refresh cookie, which is the right default for browser security. But the webview's navigation model looks cross-site to the cookie layer. The cookie gets blocked."
• "We had tested the browser flow. We had briefly tested the native flow. We had not tested the webview flow."
• [PAUSE] "Three engineers had said 'we should test that' across two sprints. It never made it into a test plan."

PACING:
[~2 min. This is the most technical slide in the deck. Go slowly on the aud claim explanation. The SameSite/webview distinction is non-obvious — pause and let it land.]

TRANSITION:
"Bug 1 plus Bug 2 created a third problem: rollback didn't work the way we assumed it would." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 13: "Flag Rollback ≠ State Rollback"
  // ─────────────────────────────────────────────────────────────────────────
  const slide13 = addContentSlide(pres, {
    title: "Flag Rollback ≠ State Rollback",
  });

  // Try to add the bug illustration if available
  try {
    slide13.addImage({
      path: imgPath("11-bug-illustration.png"),
      x: 6.5, y: 1.1, w: 3.0, h: 2.2,
      sizing: { type: "contain" },
    });
  } catch (e) {
    console.warn(`[WARN] Image not found, skipping: ${imgPath("11-bug-illustration.png")}`);
  }

  // Left: the assumption
  addCard(slide13, pres, { x: 0.4, y: 1.15, w: 5.8, h: 2.2, accentColor: colors.warning });
  slide13.addText("The assumption:", {
    x: 0.55, y: 1.22, w: 5.4, h: 0.4,
    fontSize: 13, bold: true, color: colors.warning, fontFace: fonts.title,
  });
  slide13.addText(
    '"Flip the flag back to 0% and everything returns to the auth-v1 baseline."',
    {
      x: 0.55, y: 1.65, w: 5.4, h: 1.4,
      fontSize: 14, italic: true, color: colors.navy, fontFace: fonts.body, wrap: true,
    }
  );

  // Middle: the reality
  addCard(slide13, pres, { x: 0.4, y: 3.5, w: 5.8, h: 2.5, accentColor: colors.danger });
  slide13.addText("The reality:", {
    x: 0.55, y: 3.57, w: 5.4, h: 0.4,
    fontSize: 13, bold: true, color: colors.danger, fontFace: fonts.title,
  });
  slide13.addText(
    "During the ramp, sessions that had upgraded to v2 had their refresh cookies rewritten with the wrong SameSite attribute. " +
    "Reverting the flag didn't rewrite those cookies — the state was already mutated.\n\n" +
    "Flag rollback restores feature routing. It does not restore mutated state.",
    {
      x: 0.55, y: 4.0, w: 5.4, h: 1.85,
      fontSize: 12, color: colors.navy, fontFace: fonts.body, wrap: true, valign: "top",
    }
  );

  // Key principle callout
  slide13.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 6.15, w: 9.2, h: 0.72,
    fill: { color: colors.navy }, line: { color: colors.navy },
  });
  slide13.addText(
    "For stateless features: flag flip = rollback.  For auth state: rollback must be explicitly defined before you flip.",
    {
      x: 0.55, y: 6.2, w: 9.0, h: 0.62,
      fontSize: 13, bold: true, color: colors.white, fontFace: fonts.title, align: "center",
    }
  );

  slide13.addNotes(`TALKING POINTS:
• "This is the conceptual lesson — the one I want every engineer in this room to carry forward."
• "We assumed a flag rollback would restore our baseline. It didn't. Here's why."
• "During the 58-minute ramp window, some sessions had already been upgraded. Their refresh cookies had been rewritten — with the wrong SameSite attribute."
• "When we reverted the flag, the feature routing changed. The cookies didn't."
• [PAUSE] "Flag rollback restores routing. It does not restore state."
• "For a stateless feature — a UI toggle, a new API endpoint — flag flip is a rollback. For anything that writes state — cookies, tokens, database records — rollback has to be defined explicitly before you flip."
• [FOR DEVS:] "The next time you build a feature that writes state, write down your rollback plan before you ship. One sentence. 'If I need to undo this, I will do X.' That's the habit."

PACING:
[~1.5 min. Slow down on "flag rollback restores routing, not state" — repeat it if needed. This is the primary takeaway anchor.]

TRANSITION:
"So what would we do differently? Three things." [CLICK]`);
};
