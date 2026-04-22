# Phase 2: Requirements & Design

## Purpose

Define WHAT the presentation will say, to WHOM, in what ORDER, with what TIMING.
This is the most important phase -- shift-left means spending the most effort here.

## Process

### 1. Core Questions (One at a Time)

Ask these questions one per message, in order. Use multiple choice where possible.

**Q1: Primary Takeaway**
"What's the ONE thing you want the audience to remember tomorrow?"
- Offer 3-4 options based on the gathered materials, plus "something else"

**Q2: Audience**
"Who is in the room? What's their technical level?"
- Developers, managers, PMs, sysops, mixed?
- Have they seen this topic before? Baseline knowledge?

**Q3: Duration**
"How long is the talk?"
- This drives slide count: ~1.5-2 min per slide is a good rule
- 30 min = ~15-18 slides, 45 min = ~22-28 slides

**Q4: Structure Approach**
Propose 2-3 structural approaches with trade-offs. Common patterns:
- **The Journey** -- chronological evolution (best when presenter lived the story)
- **The Maturity Ladder** -- levels of sophistication (best for technical progression)
- **The Methodology** -- philosophy first, then proof (best for frameworks)
- **Problem-Solution** -- pain points then answers (best for sales/pitch)

**Q5: Key Topics**
"What must be covered?" Map gathered materials to topics.

**Q6: Demos**
"Any live demos? What's the backup plan if they fail?"

**Q7: Output Format**
"PPTX (default), HTML, PDF, or DOCX?"

**Q8: Visual Strategy**
"Do you want AI-generated images throughout the deck, or a text-only deck
(charts/shapes/icons built natively, no AI-generated imagery)?"
- Choices: `full` (all slides get images), `selective` (specific slides only — the spec will list which), `text-only` (no AI images)
- Thread the answer into the design spec's "Visual direction" section.
- If answer is `full` or `selective` AND Replicate MCP is not yet configured,
  pause Phase 2 and run the Replicate setup flow inline (see `setup.md`
  step 2). Resume Phase 2 on successful setup. If user declines to configure
  Replicate, offer to change Q8 to `text-only` — otherwise the skill cannot
  proceed to Phase 6 and halts with an explanation.

### 2. Section Design (mechanical — enforceable)

After core questions, design the section-by-section structure. For EACH
section in the spec, produce a labelled subsection that contains ALL 6
of the following fields. A section subsection with fewer than 6 labelled
fields is incomplete — return to the user and ask for the missing fields
explicitly.

Required fields per section:
1. **Title** (and duration in minutes)
2. **Problem opening** — what pain point does this section address?
3. **Content** — key talking points (3-5 per section)
4. **Materials** — which gathered files support this section (or "none" if scratch)
5. **Slide concepts** — rough visual ideas per slide in the section
6. **Transition** — exact bridge sentence to the next section

A common Sonnet failure pattern is producing a thin section plan with 2-3
fields filled and the rest omitted. Do not do this — every section needs
all 6 labels, even if a field's content is "none" or "N/A".

### 3. Timing Table

Create a timing summary table:

| # | Section | Time | Primary Audience | Slides |
|---|---------|------|-----------------|--------|
| 1 | ... | X min | ... | N |

Include:
- Total content time
- Buffer time (10-15% of total)
- Total time

### 4. Cut Plan (mandatory when duration > 20 min)

If the presentation duration is GREATER than 20 minutes, the spec MUST
include a cut plan: "If told you have [shorter time], cut in this order: ..."
Prioritize dropping sections least essential to the primary takeaway.

If duration is 20 minutes or less, the spec must contain the exact line:

> Cut plan: not required (duration under 20min)

This converts "skip the cut plan quietly" into an explicit, gate-checkable
artifact state.

### 5. Write the Design Spec

Save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

The spec should include:
- Primary takeaway
- Success criteria (measurable if possible)
- Design principles
- Section-by-section breakdown with all details above
- Timing summary with full and cut versions
- Key statistics to reference
- Deliverables list

## Key Principles

- **One question at a time** -- don't overwhelm
- **Problem-first** -- every section should open with the pain, not the solution
- **Actionable for all roles** -- include "where to start" beats for non-technical audience
- **Honest about limitations** -- credibility comes from acknowledging what doesn't work
- **Buffer time** -- always leave 10-15% buffer for questions and demo issues

## Phase 2 — Phase-complete gate

Phase 2 is not complete until ALL of the following hold:

1. The design spec file exists at `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`.
2. Answers to Q1–Q8 are all recorded in the spec (including Q8 Visual Strategy).
3. Every section has a labelled subsection with all 6 required fields.
4. Cut plan is present (duration > 20 min) OR the line "Cut plan: not required (duration under 20min)" is present.
5. If Q8 = `full` or `selective`: Replicate MCP is configured. Check BOTH locations:
   - Global: `grep -q "replicate" ~/.claude/mcp.json 2>/dev/null`
   - Project-local: `test -f .mcp.json && grep -q "replicate" .mcp.json 2>/dev/null`
   Either path satisfies the condition. If neither, the user must configure Replicate or explicitly change Q8 to `text-only`.

A common Sonnet failure pattern is advancing to Phase 3 with condition
(3), (4), or (5) unmet. Do not advance until all five conditions hold.
