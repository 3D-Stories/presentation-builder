# Presentation Design Spec — OTel Migration

**Generated:** 2026-04-15 — Phase 2 (Requirements) complete.
**Updated:** 2026-04-21 — Phase 3 (Multi-Agent Review) complete.

## Primary takeaway

"If you're paying Datadog more than $400k/yr and you have the platform headcount,
OTel is a 9-month project that pays for itself in 14 months. Here's the shape of
the work and where we got burned — and your first step is auditing tag cardinality today."

*(PM must-fix applied: primary takeaway now ends with a directive action.)*

## Audience

Engineering leaders (dir/VP) at mid-to-large tech orgs considering a migration
from a SaaS observability vendor. Secondary audience: platform ICs who will
actually do the work.

## Duration

25 minutes + 10 min Q&A. Likely venue is our annual internal platform summit;
may be re-recorded for external conference submission.

## Cost number policy

**Use real numbers** — $180k → $720k journey is the core hook and anonymizing
it would gut the credibility. If the external version needs anonymization, that
is a separate edit pass before external submission. For now: real numbers.

*(PM must-fix applied: open question resolved.)*

## Structure (revised after Phase 3 review)

| # | Section | Time | Purpose |
|---|---------|------|---------|
| 0 | Title / welcome | 0.5 min | Slide 1 — speaker intro, deck title, framing sentence |
| 1 | The invoice that broke our brain | 3.5 min | Hook: $180k → $720k cost curve. Human moment: "I had to explain this in a board call without knowing why it was happening." Define cardinality here — the cause of the cost explosion. |
| 2 | Why OTel (decision matrix) | 4 min | 3-column reusable decision matrix (cost, portability, operational burden) + why portability > cost for this team. Explicit bridge from Section 1: "We knew the cost was cardinality. We didn't know if a cheaper vendor just hid the bill." |
| 3 | The migration in four acts | 9 min | Collector deployment → traces first → metrics → logs. Visual anchor: a 4-phase timeline diagram that updates each act. What went well, what didn't. |
| 4 | The three things nobody tells you | 6 min | Narrative reset beat at start: "We thought we were done. We were not." Then: cardinality still bites, sampling is harder than you think, alerting rewrite is 30% of the work. |
| 5 | What we'd do differently | 2 min | Callback to opening: "That invoice that broke our brain? Here's how you don't get one." + "Your first step" moment for the eng-leader audience. |
| 6 | Closing / Q&A transition | 0.5 min | Thank you, QR code for internal doc, hand-off to Q&A |

**Total:** 25.5 min (within 25+10 window with 10% buffer).

*(Presentation Expert must-fix applied: Section 3 trimmed to 9 min, Section 4 extended to 6 min, title/close slides added.)*
*(Narrative must-fix applied: Section 4 narrative reset added, Section 5 callback to Section 1 added.)*
*(Architect must-fix applied: cardinality definition moved to Section 1, visual anchor added for Section 3, Section 1→2 bridge explicit.)*

## Slide count estimate

| Section | Slides |
|---------|--------|
| 0 (Title) | 1 |
| 1 (Invoice hook) | 4 (divider + cost curve + cardinality definition + pull-quote "I had to explain this in a board call without knowing why it was happening.") |
| 2 (Decision matrix) | 4 (divider + matrix [cols: Cost / Portability / Operational Burden] + why portability > cost + rejected alternatives) |
| 3 (Four acts) | 8 (divider + 4 act slides + slip post-mortem + alerting rewrite code) |
| 4 (Three things) | 4 (divider + cardinality + sampling + alerting 30%) |
| 5 (What we'd do differently) | 1 (divider) + 1 (card grid: lessons + first-step CTA as full-width accent card below grid) |
| 6 (Closing) | 1 |
| **Total** | **23 slides** |

*(Phase 5 must-fix applied: slide count reconciled to 23; pull-quote text specified; decision matrix column headers added.)*

## Cut plan

If given 15 min:
1. Cut Section 3 from 7 slides to 4 (drop act-by-act detail, keep "what went wrong" only)
2. Cut Section 2 to 1 slide (decision matrix summary only)
3. Compress Section 4 to 3 min (pick 2 of 3 topics; always keep alerting rewrite as the most surprising)
4. Keep intact: Section 1 (hook), Section 5 (callback + first step)

*(Presentation Expert should-fix applied: cut plan added.)*

## Format

PPTX. Speaker notes: full talking-point pass required. Output will be used as-is, then
reworked for external submission with less internal-specific data.

## Visual direction

Restrained corporate-technical. Data-heavy but not cluttered. Dark bookend slides for
title and each section divider; light content slides in between.

**Q8 (Visual Strategy): `selective`** — 4 AI-generated hero images:
- Section 1 divider: invoice/cost motif (dark bg)
- Section 3 divider: pipeline/architecture motif (dark bg)
- Section 4 divider: warning/danger motif (dark bg)
- Section 5 divider: retrospective/lessons motif (dark bg)

Section 2 and the title use typography-only design (no hero image needed).

Style guide not yet created.

## Open questions (resolved)

- **Cost numbers:** Use real numbers. (Resolved above.)
- **Live demo vs. video:** No live demo. No video captures either — collector config
  will be shown as annotated code blocks in slides (faster, more reliable, audience
  can read at own pace). Removes demo-failure risk entirely.
- **"What went wrong" candidly:** Yes, full candor for internal version. External
  version will have a separate review pass.

*(Architect should-fix applied: demo/video plan resolved.)*

---

## Review Log (Phase 3)

### Presentation Expert — Section 3 timing too tight

- **Finding:** Section 3 allocated 10 min for 4 distinct migration acts. At 1.5-2 min/slide, that yields only 5-6 slides — insufficient for the content scope. *Location: Structure table, Section 3.*
- **Severity:** Must fix
- **Resolution:** Section 3 trimmed to 9 min; scope explicitly bounded to "what went wrong" per act rather than comprehensive coverage. Title/close slides added with 0.5 min budget each. Section 4 extended to 6 min.

### Presentation Expert — No cut plan

- **Finding:** No cut plan for shorter-time version, despite spec noting potential external submission. *Location: Structure table — missing section.*
- **Severity:** Must fix
- **Resolution:** Cut plan section added above.

### Presentation Expert — Section 4 timing too short

- **Finding:** 5 min for 3 distinct concepts (cardinality, sampling, alerting) is too tight. *Location: Structure table, Section 4.*
- **Severity:** Should fix
- **Resolution:** Section 4 extended to 6 min.

### Narrative Specialist — Opening lacks human face

- **Finding:** "$180k → $720k" opens with numbers before a human moment. Audience needs emotional grounding in first 30 seconds. *Location: Section 1, Purpose field.*
- **Severity:** Must fix
- **Resolution:** Section 1 purpose now includes: "Human moment: 'I had to explain this in a board call without knowing why it was happening.'" Added to structure table.

### Narrative Specialist — No closing callback to opening

- **Finding:** Section 5 ("What we'd do differently") had no explicit callback to the opening cost moment. Narrative loop was open. *Location: Section 5.*
- **Severity:** Must fix
- **Resolution:** Section 5 purpose now reads: "Callback to opening: 'That invoice that broke our brain? Here's how you don't get one.'"

### Narrative Specialist — Section 4 narrative reset missing

- **Finding:** After 14 min of technical migration content, Section 4 needed a re-hook beat before the "three things" list. *Location: Section 4, transition.*
- **Severity:** Should fix
- **Resolution:** Section 4 purpose now starts: "Narrative reset beat at start: 'We thought we were done. We were not.'"

### Narrative Specialist — Section 2 defensive framing

- **Finding:** "Why we rejected alt vendors" sounds like justification. Should be reframed as a decision matrix. *Location: Section 2, title.*
- **Severity:** Should fix
- **Resolution:** Section 2 title changed to "Why OTel (decision matrix)" and purpose updated to reference 3-column reusable framework.

### Product Manager — No explicit audience action

- **Finding:** Primary takeaway is descriptive, not directive. Audience needs a first step. *Location: Primary takeaway.*
- **Severity:** Must fix
- **Resolution:** Primary takeaway updated to end with: "...and your first step is auditing tag cardinality today."

### Product Manager — Cost number policy unresolved

- **Finding:** Open question about real vs. anonymized numbers was blocking implementation. "$400k/yr" threshold in takeaway conflicted with "$180k → $720k" in materials if anonymized differently. *Location: Open questions.*
- **Severity:** Must fix
- **Resolution:** New "Cost number policy" section added: use real numbers for internal version.

### Product Manager — No reusable decision framework for audience

- **Finding:** Section 2 covered why this team chose OTel but gave nothing the audience could reuse. *Location: Section 2.*
- **Severity:** Should fix
- **Resolution:** Section 2 purpose updated to include 3-column decision matrix (cost, portability, operational burden).

### Product Manager — No "first step" moment for eng-leader audience

- **Finding:** Section 5 ("What we'd do differently") didn't give the non-platform-IC audience a concrete first step. *Location: Section 5.*
- **Severity:** Must fix
- **Resolution:** Section 5 purpose updated to include "Your first step" moment.

### Technical Architect — Cardinality defined after it's used

- **Finding:** "Cardinality still bites" (Section 4) uses the term before it's defined. Engineering-leader audience may not know it. Section 1 is the right place to define it, since cardinality is the cause of the cost explosion. *Location: Section 1 (missing definition), Section 4 (forward reference).*
- **Severity:** Must fix
- **Resolution:** Section 1 purpose updated to include "Define cardinality here — the cause of the cost explosion."

### Technical Architect — Section 3 has no visual anchor

- **Finding:** 4 migration acts over 9 min with no recurring orientation aid. Audience loses position. *Location: Section 3, Visual direction.*
- **Severity:** Must fix
- **Resolution:** Section 3 purpose updated: "Visual anchor: a 4-phase timeline diagram that updates each act."

### Technical Architect — Section 1→2 transition lacks bridge

- **Finding:** Decision in Section 2 to choose OTel seemed disconnected from the cost crisis in Section 1 without an explicit bridge. *Location: Section 2, transition.*
- **Severity:** Must fix
- **Resolution:** Section 2 purpose now includes explicit bridge: "We knew the cost was cardinality. We didn't know if a cheaper vendor just hid the bill."

### Technical Architect — Demo/video plan unresolved

- **Finding:** Open question about video captures vs. live demo was a production dependency. *Location: Open questions.*
- **Severity:** Should fix
- **Resolution:** Open questions section resolved: no demo, no video. Annotated code blocks only.

---

## Review Log (Phase 5)

Phase 5 reviewed spec + style-guide together.

### Presentation Expert — Slide count mismatch (spec 22 vs style-guide 23)

- **Finding:** Style guide layout sequence contained 23 slides but spec slide count table said 22. The slip post-mortem slide was added during style guide creation but the spec wasn't updated. *Location: Spec slide count table; style-guide layout sequence footer.*
- **Severity:** Must fix
- **Resolution:** Spec slide count table updated to 23; section breakdowns revised to account for all slides.

### Presentation Expert — Image file names misaligned with slide numbers

- **Finding:** Image Plan used file prefix numbers (05, 11, 20) that didn't match actual slide positions (2, 10, 21) in the layout sequence. Would cause broken image references in build scripts. *Location: Style guide Image Plan.*
- **Severity:** Must fix
- **Resolution:** Image file names updated: `02-section1-invoice.jpg`, `10-section3-pipeline.jpg`, `17-section4-warning.jpg`, `21-section5-lessons.jpg`.

### Narrative Specialist — Pull-quote text unspecified

- **Finding:** Slide 5 ("Human moment, pull-quote center") was in the layout sequence but the actual quote text wasn't locked in spec or style guide. Implementation would guess. *Location: Style guide slide 5, Spec Section 1.*
- **Severity:** Must fix
- **Resolution:** Pull-quote text now specified in both spec and style guide: "I had to explain this in a board call without knowing why it was happening."

### Product Manager — Decision matrix column headers unspecified

- **Finding:** Slide 7 decision matrix was described as "3-column card grid" but column headers weren't specified. Implementation would invent them. *Location: Style guide slide 7, Spec Section 2.*
- **Severity:** Must fix
- **Resolution:** Column headers locked: Cost / Portability / Operational Burden. Applied to both spec and style guide layout table.

### Technical Architect — Build path convention undefined

- **Finding:** Style guide references `../images/` but didn't specify relative directory structure. Would cause path errors in theme.js IMG constant. *Location: Style guide, general.*
- **Severity:** Must fix
- **Resolution:** Build path note added to style guide: `const IMG = path.join(__dirname, '..', 'images')` from `build-deck/`.

### Technical Architect — pptxgenjs connector limitation

- **Finding:** Motif 4 (timeline pipeline) described "nodes and connectors" but pptxgenjs doesn't support true SmartArt connectors. Could cause implementation stumble. *Location: Style guide Motif 4.*
- **Severity:** Should fix
- **Resolution:** pptxgenjs connector note added to style guide: use 4 rounded rectangles + 3 thin rectangles as arrow connectors.

### Narrative Specialist — Section 5 divider subtitle missing callback

- **Finding:** Section 5 divider (slide 21) was generic. The callback to Section 1 should start on the divider, not just in the content slide. *Location: Style guide slide 21.*
- **Severity:** Should fix
- **Resolution:** Slide 21 now includes subtitle: "That invoice that broke our brain? Here's how you don't get one."

### Product Manager — First-step CTA buried in card grid

- **Finding:** Slide 22 "first step" action was going into the card grid, where it would compete visually with lesson cards. It needs to stand apart. *Location: Style guide slide 22.*
- **Severity:** Should fix
- **Resolution:** Slide 22 updated: 4 lesson cards in grid + full-width teal accent card below for CTA: "Your first step: audit tag cardinality today."
