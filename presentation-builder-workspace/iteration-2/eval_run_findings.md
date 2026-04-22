# Iteration-2 Eval Run — Findings (Aborted)

**Date:** 2026-04-22
**Status:** ABORTED before full grading. Hardening is shipped without
iter-2 eval validation. Follow-up eval run required in a session with
Bash pre-authorized.

## Summary

Dispatched 7 of 8 planned eval subagents (4 scenarios × with_skill +
3 of 4 without_skill). None of the `with_skill` runs produced a usable
presentation artifact. Two `without_skill` runs succeeded by choosing
HTML output (which bypasses `npm install` / `node build.js`).

The root cause is infrastructure, not skill quality. Two classes of
failure are entangled:

1. **Bash permission wall.** Subagents dispatched via the Task tool
   inherit the session permission mode but cannot answer permission
   prompts interactively. Any command that needs approval (`npm
   install`, `mkdir`, `node build.js`, `jq` on transcripts, writes
   to `.claude/settings.json`) stalls the subagent.
2. **Skill-composition derail.** When subagents hit a permission wall,
   instead of falling through or halting cleanly, they pivot into the
   `fewer-permission-prompts` / `update-config` skill to analyze their
   own permission problem. This consumed 6–9 minutes and 70–95k
   tokens per derailed run with no presentation output.

## Scorecard

| Scenario | Condition | Outcome | Token cost | Notes |
|----------|-----------|---------|------------|-------|
| team-update | with_skill | DERAILED | 73k | Pivoted into permission-allowlist analysis mid-run. |
| team-update | without_skill | ✅ PRODUCED HTML deck (5 slides) | 23k | Chose HTML, bypassed bash. |
| auth-migration | with_skill | STILL RUNNING at abort | n/a | Left to finish in background. |
| auth-migration | without_skill | ❌ BAILED on bash at 35s | 29k | Asked for permission to run `npm install`. |
| pitch-deck | with_skill | ❌ BAILED on bash at 50s | 46k | Asked for permission to run `jq`. |
| pitch-deck | without_skill | ✅ PRODUCED HTML deck (11 slides) | 43k | Chose HTML; honored no-fabricate rule for missing TAM/SAM/team. |
| otel-resume | with_skill | DERAILED | 95k | Pivoted into permission-allowlist analysis. |
| otel-resume | without_skill | NOT DISPATCHED | n/a | Aborted before launching. |

## What this does and does not tell us about the hardening

**Can say:**

- The two `without_skill` runs that produced HTML decks honored the
  embedded rules (no fabrication on pitch-deck; correct 5-slide
  informal framing on team-update). This is iteration-1 behavior
  confirmed to persist, not evidence about iter-2 changes.
- The PPTX path is blocked in this environment regardless of which
  skill is used — a bash-permission / infra constraint, not a
  presentation-builder bug.

**Cannot say:**

- Whether iter-2 hardening moved the with-skill pass rate (the target
  was ≥ 90%, up from 93% in iter-1 with a broader assertion base).
  No with-skill run produced gradeable output.
- Whether the Phase 6 `/generate-image` delegation path works end-to-end
  under Sonnet. No with-skill run reached Phase 6 in a gradeable state.
- Whether the per-phase content-aware gates fire correctly. Not
  exercised by any graded run.

## What was de-risked independently of this eval run

- **Spec/plan quality gates:** reflexion critique (3 judges) ran on
  both the design spec and implementation plan. 17 fixes applied to
  the plan, 3+ must-fix fixes applied to the spec.
- **Mechanical invariants:** every hardening task's verification grep
  check passed. Structure, heading counts, gate presence are correct.
- **Architecture correction:** the `/generate-image` delegation was
  restored in a follow-up commit after the user flagged that the
  initial Phase 6 rewrite had inlined `mcp__replicate__*` calls
  incorrectly.

## Recommendations for the follow-up eval run

1. Pre-authorize Bash in the session before dispatching subagents
   (e.g., `/permissions` or claude session flags). The minimum set is
   `npm install`, `mkdir -p`, `node` (for `build.js`), `jq`, writes
   under `.claude/`.
2. Patch subagent prompt templates to explicitly forbid calling the
   `fewer-permission-prompts` / `update-config` skill — those
   pivots destroyed every with-skill run.
3. Pre-install `pptxgenjs` globally (or in the workdir) so runs
   don't need a fresh `npm install` per scenario.
4. Consider pre-authorizing writes to `<workdir>/.claude/` so
   subagents can't be pulled into the config-update skill by write
   denials.
5. Budget for the full run: ~45–60 min and ~400k tokens across 8
   parallel Sonnet subagents + graders.

## Partial data preserved

The workspace at `presentation-builder-workspace/iteration-2/` retains
whatever workdir/outputs artifacts the 7 dispatched runs produced. The
two successful `without_skill` HTML decks (team-update, pitch-deck)
are a useful baseline reference even though they can't answer the
iter-2 validation question.
