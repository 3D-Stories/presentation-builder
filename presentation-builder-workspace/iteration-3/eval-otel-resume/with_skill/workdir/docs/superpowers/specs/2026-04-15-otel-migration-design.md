# Presentation Design Spec — OTel Migration

**Generated:** 2026-04-15 — Phase 2 (Requirements) complete.
**Updated:** 2026-04-21 — Phase 3 (Multi-Agent Review) complete. Edits applied per review findings.

## Primary takeaway

"If you're paying Datadog more than $400k/yr and you have the platform headcount,
OTel is a 9-month project that pays for itself in 14 months. Here's the shape of
the work and where we got burned."

## Audience

Engineering leaders (dir/VP) at mid-to-large tech orgs considering a migration
from a SaaS observability vendor. Secondary audience: platform ICs who will
actually do the work.

**Actionable takeaways per audience segment (MUST appear in Section 5):**
- **Engineering leaders:** Commission a cost audit against your current vendor; calculate
  your per-seat-equivalent cost. If it exceeds $400k/yr, request a headcount analysis
  to greenlight an OTel pilot.
- **Platform ICs:** Start with traces only. Get one service emitting to your OTel collector
  before touching metrics or logs. The cardinality and sampling issues are much easier to
  learn on traces than on metrics.

## Duration

25 minutes content + 10 min Q&A. Note: 5 section divider slides (~30 sec each = 2.5 min)
are included in the content time budget. Actual content section time is 22.5 minutes
to stay within the 25-minute slot.

Likely venue: annual internal platform summit; may be re-recorded for external conference
submission.

## Structure (with slide counts)

| # | Section | Time | Slides | Purpose |
|---|---------|------|--------|---------|
| 0 | Title + agenda | 1 min | 2 | Title slide + one-line agenda overview |
| 1 | The Datadog invoice that broke our brain | 3 min | 3 | Hook: cost curve from $180k → $720k in 3 years, inciting moment, ROI summary upfront |
| 2 | Why OTel (and why we rejected alt vendors) | 3 min | 3 | Decision criteria; not cost alone — portability, standardization. Opens with "we almost chose New Relic — here's what stopped us." |
| 3 | The migration in four acts | 9 min | 7 | Collector → traces → metrics → logs (Gantt visualization showing sequential/overlapping phases). What went well, what didn't per act. |
| 4 | The three traps we didn't see coming | 4 min | 4 | Cardinality (we tripled ours in 2 weeks); sampling harder than expected (one diagram, one decision rule, not a tutorial); alerting rewrite is 30% of the work. |
| 5 | What we'd do differently | 2 min | 3 | The punchline: cost-curve callback, 3-card lessons, per-audience first steps. |
| 6 | Q&A / Thank you | 30 sec | 1 | Thank-you slide with contact + deck URL. |
| — | Section dividers (5×) | 2.5 min | 5 | Visual beats between sections. |
| **Total** | | **25 min** | **28** | |

**ROI slide requirement:** Section 1 must include an explicit "the numbers" slide stating:
9-month migration, 14-month payback, current run-rate cost vs. Datadog. This slide anchors
the business case for engineering leaders before any technical content.

## Narrative backbone and callback structure

- **Opening:** Inciting moment in Section 1 — a specific meeting or moment when the team
  first saw the $720k bill and realized the trajectory. Name the meeting. Make it concrete.
  Example: "Q3 budget review. Finance put the Datadog line item on the projector. That's
  the moment we started looking at alternatives."
- **Arc:** Setup (the cost crisis) → Tension (is OTel even feasible?) → Climax (the four-act
  migration) → Resolution (what we learned, what we'd do differently)
- **Callback:** Section 5 must explicitly return to the opening invoice. Show the bill today
  with OTel (or a projection). "That Q3 budget line item? Here's what it looks like now."
  This closes the narrative loop.

## Architecture diagram requirements (Section 3)

The collector architecture hero image for Section 3 must show:
- **Components:** Receivers (OTLP, Prometheus) → Processors (batch, filter, sampling) →
  Exporters → Backend split (Mimir for metrics, Tempo for traces, Loki for logs)
- **Style:** Clean flow diagram on white background, Kubernetes deployment context implied
  (not detailed). Left-to-right data flow.
- This diagram should be built as a native PPTX diagram (shapes + arrows), not an AI image,
  to ensure label accuracy.

**Gantt visualization requirement (Section 3):**
Show the four migration phases with actual-vs-planned timeline data from
`gathered-materials/migration-timeline.md`. Use a horizontal bar chart or Gantt row per phase.

## Sampling depth guidance (Section 4)

The sampling section is one slide, one diagram, one decision rule. It is NOT a sampling
tutorial. The diagram shows a decision tree: "tail-based or head-based?" The decision
rule is the one the team actually uses. Keep it opinionated and brief.

## Format

PPTX. Speaker notes: full talking-point pass required for every slide. Output will be
used as-is, then reworked for external submission with less internal-specific data.

**Visual strategy (Q8):** `selective` — AI-generated images for hero/divider slides only;
section 3 architecture and Gantt are native PPTX elements.

## Visual direction

Restrained corporate-technical. Data-heavy but not cluttered. Hero image per act
(collector architecture as native diagram, timeline as native Gantt, cardinality chart
as native chart, "three traps" motif as AI-generated image for section 4 divider).

**Recurring visual anchor:** The cost curve line from Section 1 ($180k → $720k) should
reappear in Section 5 with an extended data point showing OTel run-rate, creating visual
bookending. The same line-chart style should be used in both instances.

Style guide not yet created (Phase 4 pending).

## Open questions — with decision owners

These must be resolved BEFORE Phase 6 (Visual Generation):

- **Cost number anonymization:** Will we include real cost numbers ($180k, $720k) or
  anonymize them? **Owner:** Legal / VP Eng. **Decision needed before:** external recording.
  For internal version, use real numbers.
- **Live demo vs. video:** We want video captures, not live demo. **Decision: video captures.**
  Include 1-slide placeholder per demo moment with "video" callout.
- **Candid "things that went wrong" for external:** Leadership alignment needed before
  sharing Section 4 content externally. **Owner:** VP Eng. **Decision needed before:**
  conference submission.

## External version cut plan

For external conference submission (anticipated): anonymize all dollar figures (use
percentage increases and order-of-magnitude references instead), remove any
product-specific internal tool names, remove Section 4 bullet 3 if leadership hasn't
signed off. The external version is a separate deliverable — do not modify this deck.

## Review Log (Phase 3)

### Presentation Expert — Missing slide count targets
- **Finding:** Spec had no per-section slide counts; implementation would bloat Section 3 to 12+ slides.
- **Severity:** Must fix
- **Resolution:** Added slide count column to structure table. Section 3 capped at 7 slides; total deck is 27 slides.

### Presentation Expert — Section dividers unaccounted in runtime
- **Finding:** 5 section dividers at 30 sec each = 2.5 min unaccounted, putting actual runtime at ~27.5 min against a 25-min slot.
- **Severity:** Should fix
- **Resolution:** Duration section now explicitly budgets 2.5 min for dividers; content section time reduced to 22.5 min total. Section 2 trimmed from 4→3 min, Section 3 from 10→9 min, Section 4 from 5→4 min, Section 5 from 3→2 min.

### Narrative Specialist — No inciting moment for hook
- **Finding:** Cost numbers stated but no personal/narrative beat. Opening needs a specific meeting or moment to make the hook land.
- **Severity:** Must fix
- **Resolution:** Added "Narrative backbone and callback structure" section. Section 1 now requires naming a specific inciting moment (the Q3 budget review framing is offered as a template).

### Narrative Specialist — No callback instruction to Section 5
- **Finding:** No instruction for Section 5 to callback to the opening invoice, risking a generic "lessons learned" close.
- **Severity:** Must fix
- **Resolution:** Added explicit callback requirement in "Narrative backbone" section: Section 5 must return to the opening invoice and show the bill today with OTel.

### Product Manager — ROI summary slide absent from structure
- **Finding:** The primary takeaway (9-month project, 14-month ROI) was not assigned to a specific slide. Exec audience would wait 20 minutes for the business case.
- **Severity:** Must fix
- **Resolution:** Added "ROI slide requirement" note to Section 1: must include explicit "the numbers" slide with 9-month/14-month claim, early in the presentation.

### Product Manager — No actionable takeaways per audience segment
- **Finding:** Spec listed secondary audience (platform ICs) but no tailored content or first-step beats.
- **Severity:** Must fix
- **Resolution:** Added "Actionable takeaways per audience segment" subsection under Audience, with distinct first-step beats for engineering leaders and platform ICs. These must appear in Section 5.

### Technical Architect — Section 3 execution model undefined
- **Finding:** Four migration acts listed without specifying whether sequential or concurrent; audience can't model project scope.
- **Severity:** Must fix
- **Resolution:** Added Gantt visualization requirement to Section 3. Timeline data from `gathered-materials/migration-timeline.md` to be used for actual-vs-planned visualization.

### Technical Architect — Collector architecture diagram underspecified
- **Finding:** Hero image listed as "collector architecture" but no component detail given; AI image would miss essential technical accuracy.
- **Severity:** Should fix
- **Resolution:** Added "Architecture diagram requirements" section specifying all components (receivers, processors, exporters, backend split) and instructing it be built as native PPTX diagram for label accuracy.

### Technical Architect — Sampling depth not defined
- **Finding:** "Sampling is harder than you think" section could expand to a tutorial or shrink to a throwaway line.
- **Severity:** Should fix
- **Resolution:** Added "Sampling depth guidance" section: one slide, one diagram (decision tree), one decision rule. Explicitly not a tutorial.

### Narrative Specialist — Section 4 framing generic
- **Finding:** "Three things nobody tells you" frames content as revelatory but all three items are well-known to OTel practitioners.
- **Severity:** Should fix
- **Resolution:** Renamed Section 4 to "The three traps we didn't see coming" and added company-specific context for cardinality ("we tripled ours in 2 weeks of adding our first service").

### Product Manager — Open questions lack decision-owners
- **Finding:** Three open questions listed with no owners or timelines.
- **Severity:** Should fix
- **Resolution:** All three open questions now have explicit owners and decision deadlines noted under "Open questions — with decision owners."

### Product Manager — No external cut plan
- **Finding:** Deck "may go external" but no guidance on what to remove.
- **Severity:** Nice to have
- **Resolution:** Added "External version cut plan" section.

### Presentation Expert — No title/close slides in structure
- **Finding:** No title or closing/Q&A slides in structure table.
- **Severity:** Nice to have
- **Resolution:** Added Section 0 (Title + agenda, 2 slides) and Section 6 (Q&A/Thank you, 1 slide) to structure table.

### Technical Architect — No recurring visual anchor
- **Finding:** Hero images don't create cross-section continuity.
- **Severity:** Nice to have
- **Resolution:** Added "Recurring visual anchor" note: cost-curve line from Section 1 reappears in Section 5 with OTel data point extended.

## Review Log (Phase 5)

**Updated:** 2026-04-21 — Phase 5 (Design Review — spec + style guide together)

### Presentation Expert — Section 5 divider incorrectly marked Light
- **Finding:** Style guide slide 24 marked as "Light (exception)" for Section 5 divider, breaking the dark/light sandwich rule defined in the same style guide.
- **Severity:** Must fix
- **Resolution:** Changed slide 24 to Dark section divider (standard). The cost-curve callback moved to slide 25 (first content slide of Section 5) where the audience is paying attention. Style guide layout table updated.

### Narrative Specialist — Thesis statement "OTel moves debt" not echoed in Section 5
- **Finding:** Slide 23 contains the talk's strongest thesis but Section 5 had no echo. Without the callback, the thesis lands once and dissipates.
- **Severity:** Must fix
- **Resolution:** Slide 26 (S5-2: What we'd do differently) now includes the echo line: "OTel moves debt — here's how to move it on your terms." Recorded in style guide layout table.

### Technical Architect — Collector architecture slide positioned after per-act slides
- **Finding:** Architecture diagram (originally slide 17) appeared after four slides using architectural terms. Audience needs the diagram to understand the "acts."
- **Severity:** Should fix
- **Resolution:** Collector architecture moved to slide 13 (immediately after the Gantt, before the per-act slides 14–17). Style guide layout table updated.

### Technical Architect — Gantt layout unspecified
- **Finding:** Gantt visualization referenced but no layout spec; implementer would improvise with likely clipping.
- **Severity:** Should fix
- **Resolution:** Added full layout spec to slide 12 in the style guide: horizontal bar chart, 4 rows, planned=hollow outline, actual=Signal Teal filled, X-axis in weeks.

### Technical Architect — Sampling decision-tree underspecified
- **Finding:** "Decision-tree diagram" referenced with no node descriptions; implementer would produce a generic or inaccurate diagram.
- **Severity:** Should fix
- **Resolution:** Added full node description to slide 21 in style guide: root node question, two branches with specific conditions and outcomes.

### Presentation Expert — Four consecutive identical card layouts (slides 14–17)
- **Finding:** Acts 1–4 all use the same two-column card layout; visual monotony would cause attention drift.
- **Severity:** Should fix
- **Resolution:** Slide 17 (Act 4 — Logs) changed to pipeline/flow diagram layout (different from card layout). Style guide updated. Three consecutive slides is the maximum for identical layouts.

### Narrative Specialist — Section 5 needs dedicated first-steps slide
- **Finding:** "What we'd do differently" and "your first steps" were merged, diluting both messages.
- **Severity:** Nice to have
- **Resolution:** Section 5 expanded to 3 content slides (25, 26, 27) — callback chart, lessons card grid, and first-steps two-column. Slide count updated to 28.
