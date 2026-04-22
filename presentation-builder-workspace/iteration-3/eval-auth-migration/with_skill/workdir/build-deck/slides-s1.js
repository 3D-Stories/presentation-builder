//
// slides-s1.js — Section 1: Why We Had to Change (Slides 2–4)
// "Our legacy auth system worked fine in 2021. By 2025, it was a handbrake on three things."
//

"use strict";

const { colors, fonts, addContentSlide, addCard } = require("./theme");

module.exports = function addSection1(pres) {
  // ─────────────────────────────────────────────────────────────────────────
  // Slide 2: The Three Blockers
  // ─────────────────────────────────────────────────────────────────────────
  const slide2 = addContentSlide(pres, {
    title: "Legacy Auth Was Blocking Three Things",
  });

  // Opening problem statement
  slide2.addText("auth-v1 (2021): server-rendered sessions, sticky load-balancer tier. Fine until it wasn't.", {
    x: 0.5, y: 1.1, w: 9, h: 0.45,
    fontSize: 14, color: colors.gray, fontFace: fonts.body, italic: true,
  });

  // Three cards
  const cards = [
    {
      title: "📱  Mobile Clients",
      body: "Background-thread session refresh requires a full HTML form round-trip. Native apps hate this.",
    },
    {
      title: "⚡  Horizontal Autoscaling",
      body: "Sticky sessions pin users to pods until they die. Autoscaler reads this as demand. We stay over-provisioned.",
    },
    {
      title: "🤝  OIDC Partners",
      body: "Three partner integrations blocked for 12 months waiting for an OIDC endpoint we didn't have.",
    },
  ];

  cards.forEach((card, i) => {
    const x = 0.5 + i * 3.1;
    addCard(slide2, pres, { x, y: 1.65, w: 2.9, h: 3.4 });
    slide2.addText(card.title, {
      x: x + 0.15, y: 1.75, w: 2.6, h: 0.5,
      fontSize: 14, bold: true, color: colors.navy, fontFace: fonts.title,
    });
    slide2.addText(card.body, {
      x: x + 0.15, y: 2.3, w: 2.6, h: 2.6,
      fontSize: 13, color: colors.navy, fontFace: fonts.body,
      valign: "top", wrap: true,
    });
  });

  slide2.addText("2021 was fine. 2025 was not.", {
    x: 0.5, y: 5.2, w: 9, h: 0.4,
    fontSize: 14, bold: true, color: colors.teal, fontFace: fonts.body, align: "center",
  });

  slide2.addNotes(`TALKING POINTS:
• "auth-v1 was built in 2021. It worked — for 2021."
• "By 2025, it was actively blocking three things the business had been asking for."
• [Point to card 1] "Mobile clients: background-thread refresh requires a round-trip HTML form. Native devs had been complaining about this for two sprints."
• [Point to card 2] "Autoscaling: sticky sessions mean your autoscaler thinks a pod is busy until the user's session expires. We were paying for capacity we didn't need."
• [Point to card 3] "OIDC partners: three integration requests, all blocked on an endpoint we simply didn't have."
• "The decision wasn't whether to replace it. It was how."

PACING:
[~1 min. One sentence per card, don't linger. The audience gets it fast.]

TRANSITION:
"We decided to replace it properly — not patch it. Here's what 'properly' looked like." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 3: Auth-v1 Architecture (simplified)
  // ─────────────────────────────────────────────────────────────────────────
  const slide3 = addContentSlide(pres, {
    title: "auth-v1: The Sticky-Session Problem",
  });

  // Left side: architecture description
  slide3.addText("How auth-v1 worked:", {
    x: 0.5, y: 1.1, w: 4.2, h: 0.4,
    fontSize: 14, bold: true, color: colors.navy, fontFace: fonts.body,
  });

  const steps = [
    "1. Client POSTs credentials to server",
    "2. Server creates session in memory",
    "3. Load balancer pins client to that pod (sticky)",
    "4. Pod dies → session dies → user logged out",
    "5. Mobile refresh = full HTML form round-trip",
  ];
  steps.forEach((step, i) => {
    slide3.addText(step, {
      x: 0.5, y: 1.55 + i * 0.45, w: 4.3, h: 0.4,
      fontSize: 13, color: i === 3 || i === 4 ? colors.danger : colors.navy,
      fontFace: fonts.body,
    });
  });

  // Right side: consequence callout
  addCard(slide3, pres, { x: 5.1, y: 1.1, w: 4.3, h: 3.8, accentColor: colors.danger });
  slide3.addText("The real cost", {
    x: 5.3, y: 1.2, w: 3.9, h: 0.45,
    fontSize: 14, bold: true, color: colors.danger, fontFace: fonts.title,
  });
  slide3.addText(
    "Every pod that holds sessions is load-balancer-pinned for its entire lifetime. " +
    "This makes horizontal scaling pessimistic by design.\n\n" +
    "No shared memory = no OIDC. The architecture isn't extensible.",
    {
      x: 5.3, y: 1.7, w: 3.9, h: 2.9,
      fontSize: 13, color: colors.navy, fontFace: fonts.body, wrap: true, valign: "top",
    }
  );

  slide3.addNotes(`TALKING POINTS:
• "For those who haven't seen auth-v1's internals — it's a classic 2021 PHP-era pattern."
• "Sessions live in pod memory. The load balancer routes you back to the same pod every time."
• "When that pod dies — scheduled or not — your session dies with it."
• [FOR DEVS:] "If you've ever wondered why our autoscaler is so conservative, sticky sessions are a big reason. It can't safely drain a pod without logging out users."
• "And there's no shared session store — which means no OIDC, because OIDC needs to issue tokens across service boundaries."
• "We couldn't patch this. The architecture itself was the constraint."

PACING:
[~1 min. Technical slide — don't rush. Let the senior engineers nod.]

TRANSITION:
"So we built a replacement from scratch." [CLICK]`);

  // ─────────────────────────────────────────────────────────────────────────
  // Slide 4: Why Not Patch It?
  // ─────────────────────────────────────────────────────────────────────────
  const slide4 = addContentSlide(pres, {
    title: "Why Not Patch auth-v1?",
  });

  // Two column comparison
  const colHeaders = ["Patching auth-v1", "Replacing with auth-v2"];
  const colColors = [colors.danger, colors.success];
  const colData = [
    ["Add Redis session store → adds distributed cache dependency", "JWT verification is stateless — no shared cache needed"],
    ["Add OIDC layer on top of session cookies → leaky abstraction", "OIDC is native to the new id.internal IdP"],
    ["Mobile still requires session cookie round-trips", "JWT works in any HTTP client, any thread"],
    ["Technical debt compounds — harder to audit and rotate secrets", "RS256 keys rotate without touching 23 services"],
  ];

  colHeaders.forEach((header, col) => {
    const x = 0.5 + col * 4.8;
    // Header bar
    pres.addSlide; // (no-op — already on slide4 context)
    slide4.addShape(pres.ShapeType.rect, {
      x, y: 1.1, w: 4.4, h: 0.5,
      fill: { color: colColors[col] },
      line: { color: colColors[col] },
    });
    slide4.addText(header, {
      x: x + 0.1, y: 1.1, w: 4.2, h: 0.5,
      fontSize: 14, bold: true, color: colors.white, fontFace: fonts.title,
    });

    colData.forEach((row, r) => {
      addCard(slide4, pres, { x, y: 1.65 + r * 1.05, w: 4.4, h: 0.95, accentColor: colColors[col] });
      slide4.addText(row[col], {
        x: x + 0.15, y: 1.7 + r * 1.05, w: 4.1, h: 0.85,
        fontSize: 12, color: colors.navy, fontFace: fonts.body, valign: "middle", wrap: true,
      });
    });
  });
  // Note: pres.addSlide call removed — was dead code (no-op), fixes Phase 8 finding

  slide4.addNotes(`TALKING POINTS:
• "This was the key decision point: patch or replace."
• "Patching would have meant adding Redis for sessions — that's a new distributed cache dependency we don't have."
• "It would have meant bolting OIDC onto a session cookie model — a leaky abstraction that creates its own security surface."
• "The right call was the harder call: full replacement."
• [FOR MANAGERS:] "The 7-week ramp vs. the planned 4 was partly because we were doing this right, not fast."

PACING:
[~1 min. Don't read every cell. Hit the key contrast: stateless JWT vs. stateful session store.]

TRANSITION:
"Let me show you what we built." [CLICK]`);
};
