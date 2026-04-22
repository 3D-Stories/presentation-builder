//
// slides-s2.js — Section 2: What We Built (Slides 5–9)
// Section divider + auth-v2 flow + key decisions + migration strategy + numbers
//
// Pacing note (from Phase 3 review): Slides 7 and 8 are information-dense.
// Use the 2-minute rule: if you can't get through a slide in 2 min, cut a row.
//

"use strict";

const { colors, fonts, imgPath, addDividerSlide, addContentSlide, addCard, addStat } = require("./theme");

module.exports = function addSection2(pres) {
  // ─────────────────────────────────────────────────────────────────────────
  // Slide 5: Section Divider — "What We Built"
  // ─────────────────────────────────────────────────────────────────────────
  addDividerSlide(pres, {
    title: "What We Built",
    subtitle: "id.internal · JWT (RS256) · HttpOnly refresh · 23 services",
    imagePath: imgPath("05-section-divider-built.jpg"),
    sectionIndex: 1,
    speakerNotes: `TALKING POINTS:
• "We needed an auth stack that worked for browsers, native mobile, webviews, and third-party partners — all from a single identity model."
• "This is auth-v2."

PACING:
[~30 sec. Visual beat — let the slide breathe.]

TRANSITION:
"Let me walk you through the architecture." [CLICK]`,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 6: Auth-v2 Flow Diagram
  // ─────────────────────────────────────────────────────────────────────────
  const slide6 = addContentSlide(pres, {
    title: "auth-v2: How It Works",
  });

  // Flow as a pipeline using shapes
  const steps = [
    { label: "Client", x: 0.4, y: 2.3, bg: colors.navy, fg: colors.white },
    { label: "POST /oauth/token\n(authorization_code)", x: 2.0, y: 1.95, bg: null, fg: colors.teal },
    { label: "id.internal\n(OIDC IdP)", x: 3.8, y: 2.3, bg: colors.teal, fg: colors.white },
    { label: "JWT (15min)\n+ refresh cookie\n(HttpOnly, 30day)", x: 5.8, y: 1.95, bg: null, fg: colors.navy },
    { label: "Backend\nServices", x: 7.6, y: 2.3, bg: colors.navy, fg: colors.white },
  ];

  steps.forEach((s, i) => {
    if (s.bg) {
      slide6.addShape(pres.ShapeType.roundRect, {
        x: s.x, y: s.y, w: 1.5, h: 0.7,
        fill: { color: s.bg }, line: { color: s.bg }, rectRadius: 0.08,
      });
    }
    slide6.addText(s.label, {
      x: s.x, y: s.y + (s.bg ? 0.05 : 0), w: 1.5, h: 0.65,
      fontSize: 11, bold: !!s.bg, color: s.fg, fontFace: fonts.body, align: "center", valign: "middle",
    });

    // Arrow between boxes
    if (i < steps.length - 1 && steps[i].bg && steps[i + 2] && steps[i + 2].bg) {
      slide6.addShape(pres.ShapeType.line, {
        x: s.x + 1.5, y: s.y + 0.35, w: 0.45, h: 0,
        line: { color: colors.teal, width: 2 },
      });
    }
  });

  // JWKS verification side-channel (key architectural insight)
  addCard(slide6, pres, { x: 0.5, y: 3.4, w: 9, h: 1.8, accentColor: colors.teal });
  slide6.addText("Key insight: JWKS verification", {
    x: 0.65, y: 3.5, w: 3, h: 0.4,
    fontSize: 13, bold: true, color: colors.teal, fontFace: fonts.title,
  });
  slide6.addText(
    "Backend services verify JWTs locally via JWKS endpoint — no database hit per request. " +
    "This is what enables stateless horizontal scaling: any pod can verify any token without shared state.",
    {
      x: 0.65, y: 3.95, w: 8.6, h: 1.1,
      fontSize: 13, color: colors.navy, fontFace: fonts.body, wrap: true,
    }
  );

  slide6.addNotes(`TALKING POINTS:
• "Here's the high-level flow."
• "Client authenticates with id.internal — our new in-house OIDC identity provider."
• "id.internal issues two things: a short-lived JWT access token (15 minutes), and a long-lived opaque refresh token stored in an HttpOnly cookie."
• "The JWT goes in the Authorization header. Backend services verify it locally using the JWKS endpoint — no database call."
• [PAUSE] "That last point is the key architectural change: any pod can verify any token. No sticky sessions. No shared memory."
• [FOR DEVS:] "If you've worked with OIDC before, this is standard. If you haven't: think of JWKS as a public key directory. The IdP signs tokens; services verify against the public key."

PACING:
[~1.5 min. Pause after "no database call" — let the stateless insight register.]

TRANSITION:
"We made four key decisions building this. Let me show you the ones that matter." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 7: Key Decisions Table
  // Pacing note: information-dense — 2-minute rule applies
  // ─────────────────────────────────────────────────────────────────────────
  const slide7 = addContentSlide(pres, {
    title: "Four Decisions That Shaped the Stack",
  });

  const decisions = [
    {
      decision: "Token algorithm",
      choice: "RS256 (asymmetric)",
      rejected: "HS256 (shared secret)",
      why: "With 23 services, rotating a shared secret = 23 deploys. RS256 keys rotate at the IdP only.",
    },
    {
      decision: "Refresh token storage",
      choice: "HttpOnly cookie",
      rejected: "LocalStorage",
      why: "LocalStorage is XSS-reachable. HttpOnly cookies are not. Security vendor audit passes instantly.",
    },
    {
      decision: "Access token lifetime",
      choice: "15 min",
      rejected: "1 hour",
      why: "Stolen access token = 15-min blast radius. Not 60. Short TTL is the lateral movement mitigation.",
    },
    {
      decision: "Logout model",
      choice: "Refresh-token revocation + short TTL",
      rejected: "Session kill list",
      why: "Kill list needs a distributed cache we don't have. Revocation + short TTL gets us 99% of the way there.",
    },
  ];

  // Table header
  const colWidths = [1.8, 2.0, 2.0, 3.1];
  const colXs = [0.5, 2.35, 4.4, 6.45];
  const headers = ["Decision", "We chose", "Rejected", "Because"];
  headers.forEach((h, i) => {
    slide7.addShape(pres.ShapeType.rect, {
      x: colXs[i], y: 1.1, w: colWidths[i], h: 0.42,
      fill: { color: colors.navy }, line: { color: colors.navy },
    });
    slide7.addText(h, {
      x: colXs[i] + 0.07, y: 1.12, w: colWidths[i] - 0.1, h: 0.38,
      fontSize: 12, bold: true, color: colors.white, fontFace: fonts.title,
    });
  });

  decisions.forEach((d, r) => {
    const rowY = 1.55 + r * 1.1;
    const rowBg = r % 2 === 0 ? "F0F4FF" : colors.offWhite;
    const rowData = [d.decision, d.choice, d.rejected, d.why];
    rowData.forEach((cell, c) => {
      slide7.addShape(pres.ShapeType.rect, {
        x: colXs[c], y: rowY, w: colWidths[c], h: 1.0,
        fill: { color: rowBg }, line: { color: "E5E7EB", width: 1 },
      });
      slide7.addText(cell, {
        x: colXs[c] + 0.07, y: rowY + 0.05, w: colWidths[c] - 0.12, h: 0.9,
        fontSize: 11,
        color: c === 1 ? colors.success : c === 2 ? colors.danger : colors.navy,
        bold: c === 1,
        fontFace: fonts.body, valign: "middle", wrap: true,
      });
    });
  });

  slide7.addNotes(`TALKING POINTS:
• "Four decisions. Let me give you the one-sentence rationale for each."
• [Decision 1] "RS256 not HS256 — with 23 services, a shared HMAC secret means every service is a key holder. Rotating it is 23 deploys. RS256 keys rotate at the IdP only."
• [Decision 2] "HttpOnly cookie for the refresh token. LocalStorage is XSS-reachable. Every month a security vendor pings us about token storage — now the answer is just 'no.'"
• [Decision 3] "15-minute access token. A stolen access token gives an attacker a 15-minute window, not 60. That's the math."
• [Decision 4] "Refresh-token revocation instead of a session kill list. Kill list requires a distributed cache — we don't have one. Revocation plus short TTL achieves the same outcome."
• [PAUSE] "In hindsight, every one of these held up. The decisions weren't where we went wrong."

PACING:
[~1.5 min. 2-minute rule: if this runs long, drop decision 4 — it's the least critical for this audience.]

TRANSITION:
"Now let me show you how we actually rolled this out across 23 services." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 8: Migration Strategy
  // Pacing note: information-dense — 2-minute rule applies
  // ─────────────────────────────────────────────────────────────────────────
  const slide8 = addContentSlide(pres, {
    title: "Migration Strategy: Dual-Read + Three Waves",
  });

  // Dual-read explanation
  addCard(slide8, pres, { x: 0.5, y: 1.1, w: 9, h: 1.1, accentColor: colors.teal });
  slide8.addText("Dual-read window (4 weeks): every service accepted BOTH session cookies (v1) AND Bearer JWTs (v2) simultaneously.", {
    x: 0.65, y: 1.2, w: 8.6, h: 0.85,
    fontSize: 13, color: colors.navy, fontFace: fonts.body, wrap: true,
  });

  // Three waves
  const waves = [
    { num: "Wave 1", time: "Week 1", what: "Internal tools\n(~500 users)", note: "" },
    { num: "Wave 2", time: "Weeks 2–3", what: "Customer web\n(~180k users)", note: "" },
    { num: "Wave 3", time: "Week 4", what: "Mobile app\n(remote flag)", note: "← the incident" },
  ];

  waves.forEach((w, i) => {
    const x = 0.5 + i * 3.15;
    const isIncident = i === 2;
    addCard(slide8, pres, { x, y: 2.35, w: 2.9, h: 3.2, accentColor: isIncident ? colors.danger : colors.teal });
    slide8.addText(w.num, {
      x: x + 0.15, y: 2.42, w: 2.6, h: 0.42,
      fontSize: 15, bold: true, color: isIncident ? colors.danger : colors.navy,
      fontFace: fonts.title,
    });
    slide8.addText(w.time, {
      x: x + 0.15, y: 2.85, w: 2.6, h: 0.35,
      fontSize: 12, color: colors.teal, fontFace: fonts.body,
    });
    slide8.addText(w.what, {
      x: x + 0.15, y: 3.25, w: 2.6, h: 0.8,
      fontSize: 13, color: colors.navy, fontFace: fonts.body,
    });
    if (w.note) {
      slide8.addText(w.note, {
        x: x + 0.15, y: 4.15, w: 2.6, h: 0.4,
        fontSize: 12, bold: true, color: colors.danger, fontFace: fonts.body,
      });
    }
  });

  slide8.addNotes(`TALKING POINTS:
• "The migration strategy was dual-read: every service accepted both auth methods simultaneously."
• "This was the safety net. If the new tokens broke, the old sessions still worked — in theory."
• "Three waves: internal tools first, then customer web, then mobile."
• "Each wave let us validate before going broader."
• "Wave 1 and 2 went fine. Wave 3 — mobile — is where we discovered what 'in theory' means in practice."

PACING:
[~1 min. Keep this brisk — Wave 3 gets its full treatment next section.]

TRANSITION:
"At 08:12 UTC on March 19th, we flipped the mobile flag to 100%." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 9: By the Numbers
  // ─────────────────────────────────────────────────────────────────────────
  const slide9 = addContentSlide(pres, {
    title: "By the Numbers",
  });

  const stats = [
    { number: "23", label: "Services touched" },
    { number: "142", label: "PRs merged" },
    { number: "7 wks", label: "Actual ramp (planned 4)" },
    { number: "3", label: "OIDC partners live" },
  ];

  stats.forEach((s, i) => {
    const x = 0.5 + (i % 2) * 4.7;
    const y = 1.3 + Math.floor(i / 2) * 2.3;
    addCard(slide9, pres, { x, y, w: 4.3, h: 2.0 });
    addStat(slide9, { x: x + 1.15, y: y + 0.2, number: s.number, label: s.label });
  });

  // Cost savings — flagged as uncertain per Phase 3 review
  slide9.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 5.8, w: 9, h: 0.55,
    fill: { color: "FEF3C7" }, line: { color: colors.warning, width: 1 },
  });
  slide9.addText(
    "⚠  Early estimate: ~12% reduction on API tier compute cost. Autoscaler still settling — we'll share a firmer number next quarter.",
    {
      x: 0.65, y: 5.85, w: 8.7, h: 0.45,
      fontSize: 11, color: "92400E", fontFace: fonts.body, italic: true,
    }
  );

  slide9.addNotes(`TALKING POINTS:
• "The scope of this migration: 23 services, 142 pull requests, 7 weeks end to end."
• "We planned 4 weeks. The extra 3 were not wasted — they were the dual-read window."
• "Three OIDC design partners are live as of April 10th."
• [FOR MANAGERS:] "On cost savings — I want to be upfront. Early signs suggest about 12% reduction on the API tier, but the autoscaler is still tuning. I'm not going to give you a confident number until we have one. Watch for a follow-up next quarter."
• "The important number isn't in this slide. The important number is 14 hours."

PACING:
[~45 sec. Brisk — this is a pause beat before the incident section.]

TRANSITION:
"Let's talk about the 14 hours." [CLICK]`);
};
