# Review Tiers

Multi-perspective review is used at three points in the workflow:
- Phase 3: Design spec review
- Phase 5: Design + style guide review
- Phase 8: Implementation code review
- Ad-hoc: Speaker notes review, image review

## Detection Order

Check for available review tools in this order. Use the FIRST one found:

### Tier 1: BMAD Party Mode

**Check:** Is `/bmad-party-mode` available as a skill?

**How to use:** Invoke party mode and request agents relevant to the review type:
- **Design review:** Request storyteller, presentation expert, PM, architect
- **Code review:** Request developer, architect, QA, presentation expert
- **Notes review:** Request storyteller, presentation expert, PM

Party mode provides the richest feedback because agents have distinct personalities,
disagree with each other, and build on each other's ideas.

### Tier 2: Reflexion Critique

**Check:** Is `/reflexion:critique` available as a skill?

**How to use:** Invoke the critique skill with the artifact to review and specify the
review perspectives desired. The critique skill dispatches specialized judges.

### Tier 3: Built-in Multi-Perspective Review

**Check:** Always available (fallback).

**How to use:** Read `references/fallback-review-prompts.md` for four reviewer personas.
Adopt each persona in sequence and review the artifact from that perspective.
Synthesize all four reviews into a prioritized findings table.

## Review Output Format

Regardless of tier, the review should produce:

| Severity | Count | Key Issues |
|----------|-------|------------|
| Must fix | N | ... |
| Should fix | N | ... |
| Nice to have | N | ... |

Each finding should include: which reviewer identified it, what specifically is wrong,
and a concrete suggestion for fixing it.

## When to Use Full vs. Light Review

**Full multi-agent review** (all tiers):
- Complex presentations (>15 slides)
- Mixed audiences (technical + non-technical)
- High-stakes presentations (board meetings, conferences, investors)
- After major structural changes

**Light inline review** (quick self-check):
- Simple presentations (<10 slides)
- Single-audience presentations
- Minor iterations (fixing a typo, swapping an image)
- Quick Path presentations
