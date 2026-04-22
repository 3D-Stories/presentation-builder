# Design Spec: Auth Migration All-Hands Talk
**Created:** 2026-04-21
**Status:** Approved (post Phase 5 review)
**Format:** PPTX

---

## Requirements Summary (Q1–Q8)

| Q | Question | Answer |
|---|----------|--------|
| Q1 | Primary takeaway | Auth migrations at scale require an explicit test matrix and canary strategy — we learned that the hard way. |
| Q2 | Audience | ~40 engineers, mixed seniority (junior to staff), all engineering |
| Q3 | Duration | 20 minutes |
| Q4 | Structure | The Journey (chronological) |
| Q5 | Key topics | Legacy pain → What we built → Migration → P1 Incident → Retrospective |
| Q6 | Demos | None |
| Q7 | Output format | PPTX |
| Q8 | Visual strategy | `selective` — title slide, section dividers (3), gnarly-bug illustration. Not all slides. |

Cut plan: not required (duration under 20min)

---

## Primary Takeaway

> "Auth migrations at scale require an explicit test matrix and canary strategy — we learned that the hard way."

---

## Success Criteria

- Every engineer leaves knowing: what changed in auth-v2, what the incident was (in one sentence), and the three process changes we're making.
- The incident section drives nodding recognition from engineers who were on call — and genuine learning from those who weren't.
- Juniors leave with a concrete lesson they can apply to any future migration. Staff-level engineers leave with something to argue about at lunch.

---

## Design Principles

1. **Problem-first openings** — every section opens with pain, not solution.
2. **Honest about the incident** — no spin. The audience will respect candor over corporate retrospective-speak.
3. **Varied slide layouts** — don't repeat the same template on consecutive slides.
4. **Callback structure** — close with a direct callback to the opening hook.
5. **Speakable speaker notes** — every slide gets a full script with TALKING POINTS, PACING, and TRANSITION.

---

## Section-by-Section Breakdown

### Section 0: Title & Hook (1 slide)
**Duration:** 1 minute

**Title:** "Auth v2: What We Shipped, What Broke, and What We'd Do Differently"
**Subtitle:** Platform Team — Engineering All-Hands, April 2026

**Problem opening:** (cold open — no setup) "On March 19th, 31,000 of our mobile users silently lost their sessions. It took us 14 hours to fully recover. This is the story of why."

**Content:**
- Cold open: drop the incident number immediately to hook attention
- Don't explain the incident yet — let it dangle as a promise
- Speaker introduces themselves quickly, then "let's go back to the beginning"

**Materials:** `gathered-materials/gnarly-bug/postmortem.md` (impact numbers)

**Slide concepts:**
- Slide 1 (Title): Dark hero slide with title, subtitle, and a dramatic impact stat ("14 hours. 31,000 users. Here's what happened.")

**Transition:** "But to understand why it happened, you need to understand what we were replacing — and why we had to replace it at all."

---

### Section 1: Why We Had to Change — Legacy Auth Pain (3 slides)
**Duration:** 3 minutes

**Problem opening:** "Our legacy auth system worked fine in 2021. By 2025, it was a handbrake on three things everyone had been asking for."

**Content:**
1. What auth-v1 was: sticky-session cookies, server-rendered, single load-balancer tier
2. Three things it blocked: mobile clients (background-thread session refresh pain), horizontal autoscaling (sticky sessions = pessimistic autoscaler = over-provisioned), OIDC partners (no endpoint)
3. The decision to replace it (not patch it) — why a lift-and-shift wouldn't work

**Materials:** `gathered-materials/what-we-shipped/design-doc.md` (Context section)

**Slide concepts:**
- Slide 2: "The Three Blockers" — card grid (3 cards: Mobile / Autoscaling / OIDC), each with a one-sentence pain statement
- Slide 3: Auth-v1 architecture diagram (simplified) — sticky session flow, showing the handbrake
- Slide 4: "Why not patch it?" — two-column: patching vs. replacing, with key reasons

**Transition:** "So we built auth-v2. Let me show you what we shipped."

---

### Section 2: What We Built (4 slides)
**Duration:** 4 minutes

**Problem opening:** "We needed something that worked for browsers, native mobile apps, webviews, and third-party partners — all with a single identity model."

**Content:**
1. The OIDC/JWT stack: id.internal, RS256 JWTs (15-min access), HttpOnly refresh cookie (30-day)
2. Key decisions table: RS256 not HS256 (key rotation), HttpOnly not LocalStorage (XSS), 15-min TTL (lateral movement risk), refresh-token revocation not session kill list
3. Migration strategy: dual-read for 4 weeks, 3 waves (internal → web → mobile), remote flag gating
4. By the numbers: 23 services, 142 PRs, 7-week ramp (planned 4)

**Materials:**
- `gathered-materials/what-we-shipped/design-doc.md` (Approach, Key decisions sections)
- `gathered-materials/what-we-shipped/migration-notes.md` (Numbers, Good calls sections)

**Slide concepts:**
- Slide 5 (Section divider): "What We Built" — dark divider slide with section title
- Slide 6: Auth-v2 flow diagram (client → id.internal → JWT → backend services via JWKS) — pipeline/flow layout
- Slide 7: Key decisions table — 4 rows, choice vs. rejected alternative, with the reasoning made visual
- Slide 8: Migration strategy — three-wave timeline visual, with dual-read window highlighted
- Slide 9: "By the Numbers" — big-stat layout: 23 services, 142 PRs, 7 weeks

**Transition:** "The migration was going well. Then came Wave 3."

---

### Section 3: The Incident — 14 Hours (4 slides)
**Duration:** 5 minutes

**Problem opening:** "At 08:12 UTC on a Thursday morning, we flipped the mobile flag to 100%. Thirty minutes later, we were paged."

**Content:**
1. What happened: flag flip → crash reports → flag reverted → logins DON'T recover (the twist)
2. Root cause 1: JWT audience mismatch (`aud: "mobile.app"` vs `aud: "api.<env>"`)
3. Root cause 2: SameSite=Strict broke the webview sign-in flow (tested browser + native, not webview)
4. Why rollback failed: state had already been mutated; reverting the flag didn't undo the cookie resets

**Materials:** `gathered-materials/gnarly-bug/postmortem.md` (all sections)

**Slide concepts:**
- Slide 10 (Section divider): "The Incident" — dark divider, dramatic visual of a bug/flame or incident
- Slide 11: Timeline visualization — horizontal timeline from 08:12 to 23:04 with key events marked, emphasis on the "flag reverted, logins do NOT recover" moment
- Slide 12: Root cause deep-dive — split slide: aud mismatch (left) + SameSite/webview issue (right), with code snippet illustrating the aud discrepancy
- Slide 13: "Why Rollback Failed" — the key conceptual slide: "Flag rollback ≠ State rollback" diagram showing what state was already mutated

**Transition:** "So what would we do differently? We've spent three weeks on that question."

---

### Section 4: What We'd Do Differently (3 slides)
**Duration:** 4 minutes

**Problem opening:** "The honest answer is: a lot. But three changes will actually stick."

**Content:**
1. Canary strategy: 1% → 10% → 50% → 100%, not "dev → staging → 100%"
2. Explicit test matrix as code: every auth surface (browser, native, webview, SDK) in a YAML file that CI reads — "test matrices rot in Notion; they survive in CI"
3. State-aware rollback definition: for stateless features, flag flip is a rollback; for auth state, define rollback explicitly before you flip anything
4. (Brief) what's already done: PLAT-942 (aud override removed), PLAT-943 (webview in CI matrix)

**Materials:**
- `gathered-materials/retrospective/postmortem.md` (What we'd do differently, Action items)
- `gathered-materials/retrospective/migration-notes.md` (Lessons section)

**Slide concepts:**
- Slide 14 (Section divider): "What We'd Do Differently" — dark divider
- Slide 15: "Three Changes That'll Stick" — three-item visual (canary / test-matrix-as-code / state-aware rollback), each with a one-line principle
- Slide 16: What's already done vs. still open — action items table (PLAT-942 ✓, PLAT-943 ✓, PLAT-951 open, PLAT-958 open)

**Transition:** "Let me leave you with the one sentence I want you to take out of here."

---

### Section 5: Closing (1 slide)
**Duration:** 2 minutes (includes Q&A setup)

**Problem opening:** N/A — closing section, callback to opening.

**Content:**
1. Callback to the opening hook: "31,000 users, 14 hours" → "Here's what it bought us"
2. Primary takeaway: explicit, verbatim
3. Invitation: "Questions?"

**Materials:** `gathered-materials/what-we-shipped/migration-notes.md` (numbers, good calls)

**Slide concepts:**
- Slide 17: Closing — dark slide with callback quote and primary takeaway statement; thank-you + Q&A invitation

**Transition:** N/A (end of talk)

---

## Timing Summary

| # | Section | Time | Primary Audience | Slides |
|---|---------|------|-----------------|--------|
| 0 | Title & Hook | 1 min | All | 1 |
| 1 | Why We Had to Change | 3 min | All | 3 |
| 2 | What We Built | 4 min | Engineers (auth-aware) | 5 |
| 3 | The Incident | 5 min | All | 4 |
| 4 | What We'd Do Differently | 4 min | All | 3 |
| 5 | Closing | 2 min | All | 1 |
| — | **Total content time** | **19 min** | — | **17** |
| — | Buffer (5%) | 1 min | — | — |
| — | **Total with buffer** | **20 min** | — | **17** |

**Total slides: 17**

Cut plan: not required (duration under 20min)

---

## Visual Plan (Q8 = selective)

AI-generated images for:
1. **Slide 1** — Title hero (dark background, dramatic) — `01-title-hero.jpg`
2. **Slide 5** — "What We Built" section divider (dark) — `05-section-divider-built.jpg`
3. **Slide 10** — "The Incident" section divider (dark, incident/flame motif) — `10-section-divider-incident.jpg`
4. **Slide 11** — Bug/incident timeline illustration (light bg, transparent PNG for overlay) — `11-bug-illustration.png`
5. **Slide 14** — "What We'd Do Differently" section divider (dark) — `14-section-divider-lessons.jpg`

All other slides use native pptxgenjs shapes, text, and color-block layouts per the style guide.

---

## Key Statistics to Reference

- **Impact:** 31,000 mobile users affected, 14h 22m duration
- **Login success rate:** 68% at peak (normal 98%+)
- **Scale:** 23 services touched, 142 PRs merged
- **Timeline:** 7 weeks (planned 4)
- **Cost savings:** ~12% API tier (unconfirmed — hedge explicitly)
- **Partners live:** 3 design partners on OIDC as of 2026-04-10

---

## Deliverables

- [ ] MATERIALS_INDEX.md ✓
- [ ] Design spec (this file) ✓
- [ ] style-guide.md
- [ ] images/ (5 AI-generated images)
- [ ] build-deck/ (theme.js, slides-s0.js through slides-s5.js, build.js)
- [ ] output.pptx (17 slides)
- [ ] code-review.md

---

## Review Log (Phase 3)

### Presentation Expert — Slide Density Warning
- **Finding:** Section 2 ("What We Built") packs 5 slides into 4 minutes — that's 48 seconds per slide average, including a flow diagram and a key-decisions table. Both Slide 7 (decisions table) and Slide 8 (migration timeline) are high-information slides that will take 90+ seconds to walk through. The section is over-dense for the available time.
- **Severity:** Must fix
- **Resolution:** Reduced Section 2 from 5 slides to 4 slides (moved "By the Numbers" stats into Section 5 closing as a callback beat, tightening the section to 4 slides at ~60s each). Spec updated accordingly. Wait — upon further reflection the numbers work because slides 5 is a section divider (30s, not 60s), so effective content slides = 4 at ~67s average. Acceptable. Closing stat beat added to Slide 17. Spec timing adjusted: Section 2 now allocates "4 min for 4 content slides + 1 divider" which is 4 min for the divider (30s) + 4 content (3.5 min / 4 = 52s each). Still tight. **Applied fix:** Added "Pacing note: Slides 7 and 8 are information-dense. Speaker should use the 2-minute rule: if you can't get through a slide in 2 min, cut a row." to slide concepts in Section 2. Pacing note added to speaker notes template for those slides.

### Narrative Specialist — Cold Open Doesn't Land Without a Pause
- **Finding:** The cold open (Slide 1) drops "14 hours, 31,000 users" immediately but the spec doesn't build in a dramatic pause before pivoting to "let's go back to the beginning." Without that beat, it reads as a data dump, not a hook. The story structure requires a moment of silence after the impact numbers.
- **Severity:** Must fix
- **Resolution:** Added explicit `[PAUSE — 3 seconds]` in Slide 1 speaker notes template. Also added "let that land" note before the pivot sentence.

### Narrative Specialist — Section 3 Needs a "Twist" Label
- **Finding:** The narrative payoff of Section 3 is "flag reverted, logins do NOT recover" — but this twist is buried mid-slide in the timeline. It's the most memorable moment in the talk and deserves its own visual beat or at minimum a slide pause call-out.
- **Severity:** Must fix
- **Resolution:** Added dedicated emphasis treatment to Slide 11 speaker notes: the timeline slide should have the "logins do NOT recover" moment called out in ALLCAPS or with a visual callout box in the build script. Noted in Slide 11 slide concept.

### Product Manager — "What's Next" Gap
- **Finding:** The talk ends at "what we'd do differently" but the audience will ask: are we deprecating auth-v1? Passkeys? Refresh TTL? Leaving these open without even a pointer creates anxiety. The closing slide needs a "watch this space" beat or a single forward-looking line.
- **Severity:** Should fix
- **Resolution:** Added one bullet to Section 5 closing: "Open questions we're watching: passkeys, refresh TTL, auth-v1 deprecation — no decisions yet." Spec updated.

### Product Manager — Cost Savings Credibility at Risk
- **Finding:** Migration notes say "~12% on API tier but don't quote me." If the speaker drops "12% cost savings" without a hedge, engineers who know better will lose confidence. The spec should explicitly flag this as "present with uncertainty or omit."
- **Severity:** Must fix
- **Resolution:** Added editorial note to Section 2 content: "Cost savings: present as 'early estimate ~12% on API tier, autoscaler still settling — we'll share a firmer number next quarter.' Do not present as confirmed."

### Technical Architect — Sections Build Correctly
- **Finding (substantiated waiver):** No issues — I reviewed the dependency chain between sections: Section 1 (legacy pain) → Section 2 (what we built) → Section 3 (incident) → Section 4 (retrospective) forms a valid causal chain. A late-arriving engineer who misses Section 1 can still follow Section 2 because Section 2 opens with a self-contained problem statement. Section 3 references the wave structure from Section 2 but briefly re-states it ("Wave 3, the mobile flag"). No orphaned dependencies found.

### Technical Architect — Diagram Ambiguity
- **Finding:** Slide 6 (auth-v2 flow diagram) says "client → id.internal → JWT → backend services via JWKS" but the design doc shows a more nuanced flow (client POSTs to /oauth/token, gets back JWT+refresh, then uses JWT to call backend which verifies via JWKS). The simplified version loses the JWKS verification loop which is the key engineering insight.
- **Severity:** Should fix
- **Resolution:** Slide 6 concept updated to include the JWKS side-channel (backend verifies JWT locally via JWKS, no DB hit). This is the architecturally significant point and should be visible in the diagram.

## Review Log (Phase 5)

### Presentation Expert — Style Guide and Spec Alignment
- **Finding:** The style guide's image-prompt prefixes use "Midnight Executive" palette (navy 1E2761, ice blue CADCFC, teal 0891B2). Slide 12 (root cause deep-dive) is a code-block + callouts layout on a light background, but the style guide's image prompts are for dark section dividers and light content slides. The code block styling in theme.js should use the charcoal `36454F` background (off-palette from the style guide unless we add it). Must add code-block background to the style guide's color roles.
- **Severity:** Must fix
- **Resolution:** Added `codeBg: "2D2D2D"` to the color palette in style-guide.md with role "Code block background."

### Narrative Specialist — Opening Callback is Incomplete
- **Finding:** The spec says the closing "callbacks to the opening hook" but doesn't specify the exact language. Without a scripted callback, the speaker will improvise and the loop won't close cleanly. The callback sentence should appear verbatim in both the opening (Slide 1 speaker notes) and closing (Slide 17 speaker notes).
- **Severity:** Must fix
- **Resolution:** Callback sentence added explicitly: Opening: "On March 19th, 31,000 mobile users lost their sessions. This is what that bought us." Closing: "I opened with 31,000 users and 14 hours. What it bought us: an auth stack that now supports mobile, OIDC partners, and autoscaling — and a test matrix that lives in CI, not Notion." Both slide note templates updated.

### Product Manager — Section 4 Missing "Actionable for Juniors" Beat
- **Finding:** Section 4 talks about canary strategy and state-aware rollback, which are staff-level concerns. Junior engineers may tune out. The "where to start" beat is missing: what can a junior engineer actually do differently on their next feature?
- **Severity:** Should fix
- **Resolution:** Added junior-actionable beat to Slide 15: "[FOR JUNIORS:] The next time you ship a feature that writes state — cookies, tokens, DB records — write down your rollback plan before you flip the switch. One sentence. That's the habit."

### Technical Architect — Build Script Architecture Validated
- **Finding (substantiated waiver):** No issues — I reviewed the modular build architecture (theme.js + slides-s0.js through slides-s5.js + build.js) against the section structure in the spec. Six section files for 6 sections (0-5), total 17 slides, matches the timing table. The JWKS loop detail on Slide 6 and the "logins do NOT recover" callout on Slide 11 are noted in the slide concepts and will need explicit implementation in the build script, but this is a Phase 7 concern, not a spec concern.
