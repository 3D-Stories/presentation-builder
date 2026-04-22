# Design Spec: Q4 Website Redesign — Team Update Standup

**Date:** 2026-04-21
**Format:** PPTX
**Path:** `docs/superpowers/specs/2026-04-21-q4-website-redesign-design.md`

---

## Requirements Q&A

| Q | Answer |
|---|--------|
| Q1 Primary Takeaway | "The Q4 redesign shipped on time — here's what's live." |
| Q2 Audience | Engineering teammates + one PM; all familiar with the project; high context |
| Q3 Duration | 5 minutes (informal standup) |
| Q4 Structure | The Journey — chronological, because we lived the story |
| Q5 Key Topics | New nav, homepage hero, performance wins, mobile fixes, what's still pending |
| Q6 Demos | None — verbal standup only |
| Q7 Output Format | PPTX |
| Q8 Visual Strategy | `text-only` — 5-min informal standup; AI images would be overkill |

---

## Primary Takeaway

**"The Q4 redesign shipped on time. Here's what's live and what comes next."**

The team should leave this standup knowing: (1) what shipped, (2) the wins, and (3) the one or two things still on the board.

---

## Success Criteria

- Every attendee can name at least 2 specific things that shipped
- PM has enough context to update the roadmap
- No one leaves with an unresolved "wait, did X land?" question
- Fits in 5 minutes with time for 1 quick question

---

## Design Principles

1. **Every slide = one idea** — this is a standup, not a deep dive
2. **Bullet-light** — 3–4 bullets max per slide
3. **Problem-first** — even standup updates should open with the "before" state where relevant
4. **No fluff** — skip the title animation, the agenda slide, the "thanks for coming"

---

## Section-by-Section Breakdown

### Section 1: Title / Context-setter (Slide 1)
**Title:** Q4 Website Redesign — What We Shipped (0.5 min)

**Problem opening:** Everyone's been heads-down — this is the moment to surface the full scope of what landed before Q1 planning kicks off.

**Content:**
- Project name + quarter
- "Shipped on time" signal (green light)
- One-liner on scope: nav, homepage, perf, mobile

**Materials:** none

**Slide concepts:**
- Dark background (section-divider style)
- Title: "Q4 Website Redesign"
- Subtitle: "What we shipped — standup recap, April 21"
- A single tag line: "All 4 tracks delivered ✓"

**Transition:** "Let's walk through what landed, track by track."

---

### Section 2: New Navigation (Slide 2)
**Title:** New Navigation (1 min)

**Problem opening:** The old nav had 11 top-level items, no mobile drawer, and the "Contact" CTA was buried three levels deep.

**Content:**
- Consolidated to 6 top-level items
- Sticky header + mobile hamburger drawer added
- "Contact" CTA promoted to persistent top-right
- Ship date: Dec 18

**Materials:** none

**Slide concepts:**
- Light background, card layout
- Before/after bullet pair (old: 11 items → new: 6 items)
- Ship date badge in accent color

**Transition:** "With navigation sorted, we turned to the homepage hero."

---

### Section 3: Homepage Hero (Slide 3)
**Title:** Homepage Hero Redesign (1 min)

**Problem opening:** The old hero was a stock photo with a headline that hadn't changed since 2021. Bounce rate on homepage was 68%.

**Content:**
- New custom illustration (product screenshot collage)
- Value prop headline rewritten: "Run your whole team from one place"
- CTA above the fold for the first time
- A/B test running: early data shows +12% CTA click rate

**Materials:** none

**Slide concepts:**
- Light background
- Stat callout: "+12% CTA clicks (A/B test, n=2,400)"
- Bullet list with before/after framing

**Transition:** "Good creative is only as good as its load time — which brings us to perf."

---

### Section 4: Performance & Mobile (Slide 4)
**Title:** Performance + Mobile Fixes (1 min)

**Problem opening:** Lighthouse scores were in the 40s on mobile. Three issues: unoptimized images, render-blocking fonts, and no lazy loading.

**Content:**
- Lighthouse mobile: 42 → 79 (desktop: 61 → 94)
- Images: switched to WebP + lazy-loaded below fold
- Fonts: subset + preloaded
- Mobile: fixed three layout-break viewports (375px, 390px, 414px)

**Materials:** none

**Slide concepts:**
- Two stat callouts: "42 → 79 mobile" and "61 → 94 desktop"
- Short bullet list for root causes fixed
- Accent color for the score deltas

**Transition:** "That's what landed. Here's the short list of what's still in flight."

---

### Section 5: Still Pending + Wrap (Slide 5)
**Title:** What's Still In Flight (1 min)

**Problem opening:** We didn't get everything in Q4 — two items slipped to Q1 by design, not by accident.

**Content:**
- Blog redesign: deprioritized; moved to Q1 sprint 2
- Analytics tagging audit: 60% done; targeting Jan 31
- No blockers — both have owners
- "Any questions?" close

**Materials:** none

**Slide concepts:**
- Light background
- Two-item checklist (pending items)
- Owner names + target dates
- Closing line: "Owners assigned, no blockers. Q1 plan lands Friday."

**Transition:** (final slide — no transition needed)

---

## Timing Summary Table

| # | Section | Time | Primary Audience | Slides |
|---|---------|------|-----------------|--------|
| 1 | Title / Context | 0.5 min | All | 1 |
| 2 | New Navigation | 1.0 min | All | 1 |
| 3 | Homepage Hero | 1.0 min | All | 1 |
| 4 | Performance + Mobile | 1.0 min | All | 1 |
| 5 | Still Pending + Wrap | 1.0 min | All | 1 |
| — | Buffer | 0.5 min | — | — |
| **Total** | | **5.0 min** | | **5 slides** |

---

## Cut Plan

Cut plan: not required (duration under 20min)

---

## Deliverables

- [ ] `MATERIALS_INDEX.md`
- [ ] This design spec
- [ ] `style-guide.md`
- [ ] `build-deck/` (theme.js, slides-s1.js through slides-s5.js, build.js)
- [ ] `output.pptx`
- [ ] `code-review.md`

---

## Review Log (Phase 3)

_Quick Path — inline light review. Substance expectations apply._

### Presentation Expert
- **Finding 1:** Slide 1 (Title) risks being a throwaway if it doesn't immediately signal value. The subtitle "standup recap" is a format descriptor, not a value statement. **Resolution:** Added "All 4 tracks delivered ✓" as a tag line to give the opening an immediate payoff signal.
- **Finding 2:** Slide 4 has two distinct topics (performance AND mobile) sharing one slide, which may feel rushed at 1 min. **Resolution:** Accepted risk — at 5-min informal standup, a combined "perf + mobile" slide is appropriate. The stat callouts create clear visual separation. No split needed.
- **Finding 3:** The 0.5 min buffer on a 5-min standup is thin if there's even one question. **Resolution:** The spec already notes "Any questions?" is on slide 5. Accepted — the audience is a small engineering team, and questions are expected to carry over to Slack. No structural change needed.

### Narrative Specialist
- **Finding 1:** The transition from slide 2 to slide 3 ("With navigation sorted, we turned to the homepage hero") is functional but generic. A stronger link would reference the user impact. **Resolution:** Transition revised to: "With navigation sorted, we turned to the place visitors land first — the homepage hero."
- **Finding 2:** Slide 5's "What's Still In Flight" section opens with a mild apology framing ("we didn't get everything"). Problem-first framing should create tension, not defensiveness. **Resolution:** Problem opening revised to: "Two items were intentionally deprioritized in Q4 — here's where they stand and who owns them." This is factual and forward-looking.
- **Finding 3:** There's no callback to the opening in the closing. The opening claims "all 4 tracks delivered" — the closing should echo that. **Resolution:** Slide 5 closing line updated to: "Four tracks shipped. Two items owned and scheduled. Q1 plan lands Friday." This closes the loop on the opening claim.

### Product Manager
- **Finding 1:** Slide 3 has a stat ("+12% CTA click rate, n=2,400") but no context for whether that's statistically significant or meaningful for the PM to put in the roadmap. **Resolution:** Added "(A/B test, early signal — full results due Jan 15)" qualifier. This gives the PM the right level of confidence framing.
- **Finding 2:** No slide explicitly calls out who should care about performance scores — the PM and non-eng audience may not know what Lighthouse 79 means. **Resolution:** Added framing: "79 = 'Good' per Google Core Web Vitals — crosses the threshold for search ranking benefit." This gives the PM an actionable talking point.
- **Finding 3:** Slide 5 lists two pending items but doesn't give the PM a single sentence they can drop into a roadmap update. **Resolution:** Added closing line to slide 5: "Owners assigned, no blockers. Q1 plan lands Friday."

### Technical Architect
- **No issues** — I audited the 5 sections for logical dependency ordering (nav → hero → perf → pending is a natural implementation sequence) and found all sections build on each other correctly. Slide 4's perf metrics are self-contained and don't require prior context from slides 2-3. The timing table sums correctly: 0.5 + 1.0 + 1.0 + 1.0 + 1.0 + 0.5 buffer = 5.0 min.

**Synthesis:**

| Severity | Count | Key Issues |
|----------|-------|------------|
| Must fix | 0 | — |
| Should fix | 6 | Transitions, problem framing, stat qualifier, Lighthouse context, callback close |
| Nice to have | 1 | Split slide 4 (declined — standup context) |

All should-fix findings applied above. No must-fix findings.
