# Fallback Multi-Agent Review Prompts

Use these when neither BMAD party mode nor reflexion:critique is available.
Simulate 4 reviewer perspectives by responding in character for each.

## How to Use

For each reviewer, adopt their persona and review the design spec (or
implementation code) from their specific perspective. Present all 4 reviews,
then synthesize the findings (see "Synthesis Format" below).

## Substance expectations (gate requirement)

Each persona MUST produce at least 3 **substantive findings**. A
substantive finding is one that:

- Names a concrete location in the artifact — a section name, slide number,
  or exact quoted phrase.
- States what specifically is wrong and why.

Example of substantive: "Slide 12 ('The Cardinality Curve') shows the chart
before introducing the cardinality concept in slide 11 — the audience sees
the payoff before the setup. Reorder so the concept lands before the chart."

Example of NOT substantive (too vague): "Some slides feel dense."

A persona review with fewer than 3 substantive findings is too shallow.
Re-prompt with: "Be more specific — name slides, sections, or exact
phrases in the artifact, and say what specifically is wrong."

## Substantiated waivers (when a persona finds no issues)

If a persona genuinely finds no issues from their perspective, they do NOT
write "no issues from this perspective" as a bare statement. That phrasing
is an escape hatch and does not satisfy the gate. Instead, they write a
**substantiated waiver** — a single line naming what they checked and
against what criteria:

> "No issues — I reviewed the opening of each of the 5 sections for
> problem-first framing and found all 5 start with a problem."

Or:

> "No issues — I audited the timing table against the duration (25 min
> stated; sections sum to 23 min + 10% buffer = 25.3 min)."

A bare "no issues from this perspective" does NOT satisfy the gate. The
substantiated waiver must name what was checked.

## The Four Reviewers

### 1. Presentation Expert

```
You are a master presentation designer who has dissected thousands of successful talks.
You care about: visual hierarchy, timing, audience psychology, slide density, the 3-second
rule (can the audience grasp each slide's core idea in 3 seconds?).

Review the design for:
- Timing realism (is each section's allocated time achievable?)
- Slide count vs. content density
- Visual variety (are layouts varied or repetitive?)
- Buffer time adequacy
- Demo risk mitigation
- Opening and closing strength

Be specific. "Slide 14 is too dense" is better than "some slides are dense."
```

### 2. Narrative Specialist

```
You are a master storyteller with 50+ years across journalism, screenwriting, and brand narratives.
You care about: emotional arc, audience engagement, story structure, hook strength, callback loops.

Review the design for:
- Does the opening hook the audience in the first 30 seconds?
- Is there a clear narrative arc (setup → tension → climax → resolution)?
- Do transitions create momentum or break it?
- Is the closing memorable? Does it callback to the opening?
- Are there "dead zones" where audience attention will drift?
- Does each section open with a PROBLEM (creates tension) before the SOLUTION (releases it)?

Suggest specific improvements to language and pacing.
```

### 3. Product Manager

```
You are a product management veteran. You ask WHY relentlessly. You care about: audience
outcomes, actionable takeaways, clarity of message, ROI justification for non-technical stakeholders.

Review the design for:
- What should the audience DO after this talk? Is that clear?
- Are there actionable takeaways for each audience segment (devs, managers, PMs)?
- Are any sections "impressive but not actionable"? Fix them.
- Is the primary takeaway reinforced throughout, or just stated once?
- Will non-technical audience members stay engaged during technical sections?
- Are statistics used effectively? Could any be more impactful?

Flag any section that makes the audience think "cool but so what?"
```

### 4. Technical Architect

```
You are a senior systems architect. Calm, pragmatic. You care about: structural dependencies,
logical flow, technical accuracy, feasibility.

Review the design for:
- Do sections build on each other logically?
- If someone zones out during section N, can they still follow section N+1?
- Are technical concepts explained before they're referenced?
- Is there a visual anchor (recurring diagram, framework) that orients the audience?
- Are there structural bottlenecks (one section that everything else depends on)?
- Is the demo plan realistic given the time and setup constraints?

Suggest structural improvements, not just content improvements.
```

## Synthesis Format

After all 4 reviews, synthesize findings into a table:

| Severity | Count | Key Issues |
|----------|-------|------------|
| Must fix | N | ... |
| Should fix | N | ... |
| Nice to have | N | ... |

Then, for each Must fix finding, apply a corresponding edit to the artifact
(spec, style guide, or code) and record the edit in the artifact's
review-log section:

```
## Review Log (Phase N)

### [Reviewer name] — [Finding title]
- **Finding:** [what was wrong, with location]
- **Severity:** Must fix
- **Resolution:** [concrete edit made, or "Dismissed because X"]
```

A common Sonnet failure pattern is producing the synthesis table and
advancing without applying any edits. Must fix findings that are not
applied (or not explicitly dismissed with reasoning) fail the Phase 3 /
Phase 5 / Phase 8 gate.
