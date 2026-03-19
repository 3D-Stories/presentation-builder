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

### 2. Section Design

After core questions, design the section-by-section structure:

For each section define:
- **Title** and duration (minutes)
- **Problem opening** -- what pain point does this section address?
- **Content** -- key talking points (3-5 per section)
- **Materials** -- which gathered files support this section
- **Slide concepts** -- rough visual ideas
- **Transition** -- exact bridge sentence to next section

### 3. Timing Table

Create a timing summary table:

| # | Section | Time | Primary Audience | Slides |
|---|---------|------|-----------------|--------|
| 1 | ... | X min | ... | N |

Include:
- Total content time
- Buffer time (10-15% of total)
- Total time

### 4. Cut Plan

If the presentation might need to be shortened, define a cut plan:
"If told you have [shorter time], cut in this order: ..."

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
