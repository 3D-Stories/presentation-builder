# Presentation Design Spec: Auth Migration All-Hands Talk

## Meta
- **Date:** 2026-04-21
- **Topic:** Auth v2 Migration — What We Shipped, What Broke, What We Learned
- **Author:** C. Androsoff (simulated)

## Q1–Q8 Answers

| Q | Question | Answer |
|---|----------|--------|
| Q1 | Primary takeaway | "A flag rollback isn't a state rollback — design your rollback strategy before you ship." |
| Q2 | Audience | ~40 engineers, mixed seniority; all technical; aware the migration happened |
| Q3 | Duration | 20 minutes |
| Q4 | Structure | The Journey (chronological — we lived this story; the bug lands harder with setup) |
| Q5 | Key topics | What we shipped, the gnarly bug, what we'd do differently |
| Q6 | Demos | None. Architecture diagram as a slide. |
| Q7 | Output format | PPTX |
| Q8 | Visual strategy | `selective` — title, section dividers, bug illustration get AI images; content slides use native shapes/text/tables |

## Primary Takeaway

> "A flag rollback isn't a state rollback — design your rollback strategy before you ship."

## Success Criteria

- Every engineer in the room can explain the aud-claim + SameSite double-failure that caused the 14-hour outage.
- At least 3 people use the phrase "flag rollback ≠ state rollback" in code review or planning within a month.
- The audience leaves with concrete, actionable changes they could apply to their own migrations: canary %, test-matrix-as-code, state-aware rollback planning.

## Design Principles

1. **Problem-first openings** — each section starts with the pain, not the solution
2. **Honest about failures** — don't soften the 14-hour outage; credibility comes from owning it
3. **Actionable for all levels** — juniors get "what to do"; seniors get "why these tradeoffs"
4. **Callback structure** — closing references the opening premise
5. **One recurring visual anchor** — the auth flow diagram evolves across slides as we tell the story

---

## Section Design

### Section 0: Title Slide (~0.5 min)
**Title:** "Auth Migration: What We Shipped, What Broke, and What We'd Do Differently"
- Duration: 0.5 min
- **Problem opening:** N/A — title slide sets stage
- **Content:**
  - Talk title
  - Speaker name + date
  - "20 min + Q&A"
  - **Opening hook (verbal, not on slide):** "Raise your hand if you saw a 'can't log in' message from a mobile user in March." [PAUSE] "That was us. That was our fault. Here's the full story."
- **Materials:** None
- **Slide concepts:** Dark background hero slide with AI-generated image (locks/keys/circuit motif), white text
- **Transition:** "In March we shipped the biggest auth change since 2021. Let's start with why we had to."

---

### Section 1: Why We Had to Migrate (~3 min, 2 slides)
**Title:** "The Problem with auth-v1"
- Duration: 3 min
- **Problem opening:** "We had three things we couldn't build because of how auth worked. And we'd been asked to deliver all three of them this year."
- **Content:**
  1. Sticky sessions blocked mobile clients (background thread refresh = HTML form round-trip)
  2. Sticky sessions blocked horizontal autoscaling (pods pinned = pessimistic autoscaler = over-provisioned)
  3. No OIDC endpoint = partner integrations blocked
  4. Quick sketch of the old model: session_id cookie → sticky LB tier
- **Materials:** `gathered-materials/what-we-shipped/design-doc.md` (Context section)
- **Slide concepts:**
  - Slide 1: Three-column card layout (Mobile Blocked / Autoscaling Blocked / Partners Blocked) — native shapes, no AI image
  - Slide 2: Simple architecture diagram of auth-v1 (native shapes: boxes + arrows)
- **Transition:** "So here's what we decided to build instead."

---

### Section 2: What We Shipped (~4 min, 3 slides)
**Title:** "Auth v2: The Architecture"
- Duration: 4 min
- **Problem opening:** "The goal was simple: replace cookies with JWTs without breaking anyone. In practice: 7 weeks, 23 services, 142 PRs."
- **Content:**
  1. New model: id.internal OIDC IdP → RS256 JWT (15min) + refresh token in HttpOnly cookie
  2. Key decisions table: RS256 not HS256, HttpOnly not LocalStorage, 15min not 1hr, refresh revocation not kill list
  3. Three-wave rollout: internal tools → web → mobile (gated by remote flag)
  4. Dual-read window: 4 weeks of accepting both cookie + Bearer — this was intentional insurance; services accepted EITHER auth method during the transition window. This is what prevented Wave 3 from being a total outage (key: set this up before the incident section)
- **Materials:** `gathered-materials/what-we-shipped/design-doc.md`, `gathered-materials/what-we-shipped/migration-notes.md`
- **Slide concepts:**
  - Slide 3: Auth-v2 architecture diagram (the ASCII flow from design-doc as a proper visual — native shapes)
  - Slide 4: Key decisions table (4 rows: algo, refresh storage, token lifetime, logout model)
  - Slide 5: Three-wave rollout timeline (horizontal bar or wave diagram — native shapes)
- **Transition:** "Wave 1 and Wave 2 went smoothly. Then came Wave 3 and the Thursday from hell."

---

### Section 3: The Incident — A Thursday From Hell (~6 min, 4 slides)
**Title:** "The 14-Hour Mobile Lockout"
- Duration: 6 min
- **Problem opening:** "At 08:12 UTC on a Thursday, we flipped auth_v2_mobile to 100%. By 08:42, we had 40 crash reports and Twitter chatter. By 09:10 we'd reverted the flag. Logins did NOT recover."
- **Content:**
  1. Root cause 1: JWT audience check mismatch (mobile configured with `aud: "mobile.app"`, backend accepted `aud: "api.<env>"`)
  2. Root cause 2: SameSite=Strict broke webview sign-in (webview top-level nav looks cross-site from cookie's POV)
  3. **The compounding effect**: Bug 1 alone would have been bad (audience mismatch → tokens rejected). Bug 2 compounded: when we reverted the flag, sessions that had already been upgraded to v2 couldn't re-establish under v1 because the refresh cookie had already been reset with wrong attributes. Flag reverted. Logins still broken. This is the "aha" moment.
  4. Why rollback failed: "Flip the flag back" assumed stateless — but refresh cookies had already been mutated in-flight. "We were 3 hours into debugging a mobile build before we realized: this wasn't a code bug. It was a state problem."
  4. Timeline: 08:12 flip → 08:42 paged → 09:10 reverted (logins still broken) → 12:35 aud mismatch found → 17:50 SameSite found → 23:04 baseline
  5. Impact: ~31k mobile users, 14h 22m, login success rate dipped to 68% (normally 98%+)
- **Materials:** `gathered-materials/gnarly-bug/postmortem.md`
- **Slide concepts:**
  - Slide 6: Section divider — dark bg, AI-generated image (storm/bug/circuit motif), "The Incident" title
  - Slide 7: "Two Bugs, One Outage" — two-column comparison card (Bug 1: aud mismatch / Bug 2: SameSite webview). Native shapes.
  - Slide 8: Timeline slide — horizontal timeline with key events (08:12, 08:42, 09:10, 12:35, 17:50, 23:04). Native shapes.
  - Slide 9: "Why Rollback Failed" — big stat (14h 22m) + callout box: "Flag rollback ≠ state rollback." Accent color highlight. AI-generated image optional (broken link / undo symbol motif).
- **Transition:** "So now we know what went wrong. The harder question is: what would we do differently?"

---

### Section 4: What We'd Do Differently (~4 min, 3 slides)
**Title:** "The Playbook We Wish We Had"
- Duration: 4 min
- **Problem opening:** "We had a good migration plan. We had testing. We had a remote flag. And we still had a 14-hour outage. Here's what the plan was missing."
- **Content:**
  1. Canary at 1% → 10% → 50% → 100% per wave, not dev → staging → 100%
  2. Explicit test matrix for every auth surface: browser, native, webview, SDK (test matrices as code, not Notion docs)
  3. State-aware rollback: accept v1 OR v2 tokens for a full week after any flip
  4. One source of truth for audience claim — deleted staging override (PLAT-942, PLAT-943)
  5. "A flag rollback isn't a state rollback" — define rollback per feature before you ship
- **Materials:** `gathered-materials/gnarly-bug/postmortem.md`, `gathered-materials/lessons-learned/migration-notes.md`
- **Slide concepts:**
  - Slide 10: Four-item bulleted card layout: 4 lessons, each with a short title + 1-line explanation. Native shapes.
  - Slide 11: "Rollback ≠ Undo" — big text treatment of the key insight. Dark accent card. AI-generated image (undo arrow with X motif). Native shapes + accent.
  - Slide 12: "The Test Matrix" — before/after comparison: Notion doc (rotting) vs CI YAML (durable). Native shapes.
- **Transition:** "Let me bring this back to where we started."

---

### Section 5: Closing / Callback (~2 min, 2 slides)
**Title:** "The Takeaway"
- Duration: 2 min
- **Problem opening:** N/A — this is resolution, not new problem
- **Content:**
  1. Callback: "In January I would have said 'we have a remote flag, we can roll back anytime.' I know better now."
  2. The three things we shipped that auth-v1 blocked: mobile, autoscaling, partners. All three now delivered.
  3. The one thing we'd tell ourselves: define rollback before you flip. Every stateful migration needs a state-aware rollback plan.
  4. Open questions: passkeys? Shorter refresh TTL? auth-v1 deprecation? These are next. Talk to us.
- **Materials:** `gathered-materials/what-we-shipped/migration-notes.md`
- **Slide concepts:**
  - Slide 13: "What We Unlocked" — three-column layout (Mobile ✓ / Autoscaling ✓ / Partners ✓), callback to Section 1 cards. Native shapes.
  - Slide 14: Closing dark slide — "Define rollback before you flip." + speaker name. AI-generated image (same visual motif as title slide, now resolved/open lock). Dark bg hero.
- **Transition:** N/A — end of talk → Q&A

---

## Timing Summary

| # | Section | Time | Primary Audience | Slides |
|---|---------|------|-----------------|--------|
| 0 | Title | 0.5 min | All | 1 |
| 1 | Why We Had to Migrate | 3 min | All | 2 |
| 2 | What We Shipped | 4 min | All | 3 |
| 3 | The Incident | 6 min | All | 4 |
| 4 | What We'd Do Differently | 4 min | All | 3 |
| 5 | Closing / Callback | 2 min | All | 2 |
| — | **Total content** | **19.5 min** | — | **15** |
| — | Buffer (10%) | 2 min | — | — |
| — | **Total (with buffer)** | **~21.5 min** | — | **15** |

> **Buffer is earmarked for Section 3 overflow.** Section 3 is the emotional heart of the talk; don't rush it. If the audience is engaged, let it breathe. Section 5 (closing) can compress to 1.5 min if needed.

## Cut Plan

Cut plan: not required (duration under 20min)

(If told you have 15 min: cut Section 2 slide 3 [wave rollout] and collapse Section 4 to 2 slides. Saves ~3-4 min.)

## Key Statistics to Reference

- 23 services touched; 142 PRs merged
- 7 weeks actual vs 4 weeks planned
- 14h 22m incident duration
- ~31k mobile users affected
- Login success rate dipped to 68% (normally 98%+)
- ~12% API tier cost savings estimated (caveat: autoscaler still settling, don't quote definitively)
- 3 partner OIDC integrations live as of 2026-04-10

## Visual Direction

Q8 = `selective`. Images for:
- Slide 1 (title): Dark hero image — locks/keys/circuit motif
- Slide 6 (incident divider): Dark hero — storm/bug/circuit motif
- Slide 9 ("Why Rollback Failed"): Optional — broken undo/link motif on light bg (transparent PNG)
- Slide 11 ("Rollback ≠ Undo"): Optional — undo arrow with X motif, light bg (transparent PNG)
- Slide 14 (closing): Dark hero — open lock resolved motif, callbacks title image

All other slides: native shapes, tables, text, accent cards.

---

## Review Log (Phase 3)

### Presentation Expert — No opening hook on title slide
- **Finding:** Title slide (Section 0) had no verbal hook. The first 30 seconds of the talk had no engagement mechanism beyond displaying the title.
- **Severity:** Must fix
- **Resolution:** Added opening hook to Section 0 Content: "Raise your hand if you saw a 'can't log in' message from a mobile user in March." Speaker notes will anchor this.

### Technical Architect — Dual-read window not set up before rollback-failed moment
- **Finding:** Section 2's dual-read window was mentioned in passing. Without understanding "dual-read was intentional insurance," the audience would be confused in Section 3 when rollback failed despite dual-read. They need to know: dual-read accepted both auth methods — which is why the outage was partial (31k affected) rather than total.
- **Severity:** Must fix
- **Resolution:** Section 2, Content item 4 now explicitly calls out dual-read as "intentional insurance" and notes this must be set up before the incident section.

### Technical Architect — Two-bug compounding mechanism not shown
- **Finding:** Slide 7 (two-column Bug 1 / Bug 2) didn't explain WHY Bug 2 caused the flag rollback to fail. The compounding logic ("Bug 1 alone was bad; Bug 2 meant the rollback broke state that v1 couldn't recover") is the hardest concept and most important.
- **Severity:** Must fix
- **Resolution:** Section 3, Content item 3 now explicitly describes the compounding effect and has a dedicated beat: "Flag reverted. Logins still broken." Content item 4 adds the key realization quote.

### Presentation Expert — Section 3 timing buffer not earmarked
- **Finding:** Buffer time (2 min) was described as usable for Q&A, but Section 3 is the densest section and most likely to run long. Buffer should be explicitly reserved for Section 3 overflow.
- **Severity:** Must fix
- **Resolution:** Timing Summary buffer note updated: buffer is now earmarked for Section 3 overflow; Section 5 can compress if needed.

### Narrative Specialist — Key decisions table is a "tell" not a "show"
- **Finding:** Section 2, Slide 4 (key decisions table with 4 rows) is a pure information dump. Mixed-seniority audience will disengage. Each decision should have a mini-story.
- **Severity:** Should fix
- **Resolution:** Noted in speaker notes to be implemented in Phase 7 build. Each table row will have a one-line story framing: "We chose RS256 not HS256 because we had 23 services — shared secrets would have been a rotation nightmare."

### Product Manager — Primary takeaway absent from Section 4
- **Finding:** "Flag rollback ≠ state rollback" appears in Section 3 (Slide 9) and Section 5 (Slide 14) but not Section 4. Every section should reinforce the primary takeaway.
- **Severity:** Should fix
- **Resolution:** Section 4, Content now includes explicit beat: "And the root gap was: we had never defined what 'rollback' meant for a stateful migration." Speaker notes will surface this.

### Product Manager — Cost savings not on any slide
- **Finding:** "~12% API tier savings" is in Key Statistics but not surfaced on any slide. For mixed-seniority audience including EMs, this is the ROI signal.
- **Severity:** Should fix
- **Resolution:** Will add as a callout to Section 2 Slide 5 (rollout waves) — "The payoff: autoscaler freed up, ~12% efficiency gain estimated (still settling)." Speaker notes will add the caveat about uncertainty.

### Technical Architect — Timeline's critical inflection point not visually distinguished
- **Finding:** Slide 8 timeline has 6 events. The 09:10 event ("flag reverted, logins DO NOT RECOVER") is the most critical moment but has no visual distinction from other events.
- **Severity:** Should fix
- **Resolution:** Phase 7 speaker notes and build script will use accent color callout on 09:10 event. Spec updated to note this explicitly in Slide 8 concept.

---

## Review Log (Phase 5)

Reviewing spec + style-guide together.

### Narrative Specialist — Rollback image subject too abstract
- **Finding:** Image plan Slide 9 subject ("undo arrow with red X") is abstract. For an incident story, the image should evoke visceral failure — broken chain, stuck door handle — not a UX concept.
- **Severity:** Should fix
- **Resolution:** style-guide.md image plan Slide 9 subject updated to "broken chain link or door handle that won't turn."

### Product Manager — Progress indicator marked optional
- **Finding:** Style guide's progress indicator was "optional." For an all-hands where engineers arrive/leave at different times, it's essential for orientation.
- **Severity:** Should fix
- **Resolution:** style-guide.md progress indicator updated to "required on all content slides."

### Product Manager — ~12% caveat not explicit in stat callout pattern
- **Finding:** Stat callout pattern allowed "optional sub-label/caveat." For the ~12% savings number, the caveat ("autoscaler still settling") is required for credibility.
- **Severity:** Should fix
- **Resolution:** style-guide.md stat callout sub-label updated to note "REQUIRED when using soft metrics."

### Presentation Expert — Spec + style guide consistent
- **Substantiated waiver:** No issues — audited all 5 image plan entries (01, 06, 09, 11, 14) against spec's selective-image slides list and found all match; verified dark/light slide mapping in spec matches style guide's slide structure patterns; confirmed Incident Red is scoped to Section 3 only (slides 6-9) per both spec and style guide.

### Technical Architect — Typography system-safe
- **Substantiated waiver:** No issues — reviewed all 9 typography entries; all use Calibri (system-safe) or Consolas (system-safe); no Google Fonts or custom fonts that would require additional pptxgenjs configuration.

## Deliverables

- [ ] MATERIALS_INDEX.md (done)
- [ ] Design spec (this file)
- [ ] style-guide.md
- [ ] images/ (5 images for selective visual strategy)
- [ ] build-deck/ (theme.js + slides-s0.js through slides-s5.js + build.js)
- [ ] output.pptx
- [ ] code-review.md
- [ ] transcript.md
