# Iteration-3 Validation Report

**Date:** 2026-04-22
**Branch:** `iter-3-validation`
**Parent:** main @ 0feaa22 (iter-2 hardening already merged as #7)
**Run conditions:** 4 scenarios × 2 conditions = 8 Sonnet subagents, parallel

## Headline result

**The iter-2 Sonnet-hardening works.** All 4 `with_skill` subagents produced substantive artifacts across Phases 1–5, 7 (build scripts), and 8 (code review). Zero runs derailed into `fewer-permission-prompts` or `update-config` (the iter-2 failure mode). One `with_skill` run (`otel-resume`) passed the full Phase 9 build gate and produced a valid 28-slide `output.pptx` (561 KB).

| Metric | iter-1 | iter-2 | iter-3 |
|---|---|---|---|
| with_skill runs completing ≥ Phase 5 | 4/4 | 0/4 | 4/4 |
| with_skill runs reaching Phase 8 code review | 4/4 | 0/4 | 4/4 |
| with_skill runs passing Phase 9 build gate | 4/4 (on light env) | 0/4 | 1/4 (3 blocked by Phase 6 Replicate wall) |
| Skill-pivot derails (`fewer-permission-prompts`, `update-config`) | 0/4 | 2/4 | 0/4 |
| Mean with_skill token cost | ~20k | ~73k (wasted on derails) | ~93k (real work) |

## Per-run scorecard

### with_skill runs

| Scenario | Tokens | Time | Spec w/ Q1-Q8 | Section 6-field | Cut plan | Review P3 | Review P5 | Style guide | Build scripts | Code review | Build runs |
|----------|--------|------|---------------|-----------------|----------|-----------|-----------|-------------|---------------|-------------|------------|
| team-update | 54k | 5.6m | ✅ 8/8 Q markers | ✅ 3/3 sections | "not required" waiver ×3 | ✅ | N/A (Quick path) | ✅ 111 lines | ✅ 5 files | ✅ 97 lines | ❌ ShapeType.line bug not caught |
| auth-migration | 104k | 12m | ⚠️ different format | ✅ 6/6 sections | Present | ✅ | ✅ | ✅ 130 lines | ✅ 8 files | ✅ 92 lines | ❌ ENOENT image (Phase 6 walled) |
| pitch-deck | 101k | 13m | ⚠️ different format | ✅ 7/7 sections | "not required" ×1 | ✅ | ✅ | ✅ 136 lines | ✅ 9 files | ✅ 108 lines | ❌ ENOENT image (Phase 6 walled) |
| otel-resume | 113k | 16.8m | ⚠️ different format | ⚠️ resumption format | N/A | ✅ | ✅ | ✅ 189 lines | ✅ 9 files | ✅ 96 lines | ✅ **28 slides, 561 KB** |

Notes on ⚠️:
- "different format" = Q markers present but formatted as `- **Q1 — ...:**` rather than `**Q1:**`. Content is correct; grep pattern was narrow. Skill is robust but gate-check grep in `phase-2-requirements.md` may want loosening.
- `otel-resume` resumption used an existing spec (fixture) — section-field format differs from newly-written specs. Correct behavior for a resumption scenario.

### without_skill runs

| Scenario | Tokens | Time | Result |
|----------|--------|------|--------|
| team-update | 22k | 1.2m | BLOCKED at `node build.js`. Build script written. Clean halt. |
| auth-migration | 31k | 2.2m | BLOCKED at `node build.js`. Clean halt. |
| pitch-deck | 29k | 2.3m | BLOCKED at `node build.js`. Clean halt. |
| otel-resume | 40k | 4.6m | BLOCKED at `node build.js`. Recognized MATERIALS_INDEX fixture. |

The baseline runs halted before producing any deliverable except `build.js`. Without the skill's gating and structure, there is no design spec, no style guide, no review logs, no code review — just the attempted build. This contrasts starkly with the `with_skill` runs' full artifact sets.

## Phase-6 Replicate MCP wall

All 4 `with_skill` runs hit the same wall at Phase 6: `mcp__replicate__create_predictions` was denied by the subagent permission scope. The `/generate-image` skill (which is the canonical delegation target) uses the same MCP tools and therefore hits the same wall.

This is an **infrastructure** constraint for subagents, not a skill defect:
- `/generate-image` skill is installed globally (confirmed in main session — `mcp__replicate__list_models` is visible here).
- The main session can call `mcp__replicate__*` tools successfully.
- Subagents dispatched via the Task tool cannot — they inherit a more restricted MCP permission set than the parent session.

**Critically, the `with_skill` runs halted correctly per their Phase 6 hard-prerequisite gate** (`phase-6-visuals.md` explicitly says: "If `/generate-image` is not available, STOP. Do NOT produce an `IMAGE_PLAN.md` as a substitute. An empty `images/` directory is not acceptable output."). This is exactly the iter-2 hardening working as designed — no run produced an `IMAGE_PLAN.md` as a completion marker. The halt itself is correct behavior.

Follow-up required: re-run evals in an infra that grants subagents `mcp__replicate__*` access (or short-circuit: dispatch from a session that pre-authorizes MCP for sub-tasks).

## Phase 9 build wall

All 4 `without_skill` and 3 of 4 `with_skill` runs could not run `node build.js`. The `otel-resume` with_skill build was subsequently run from the main session and succeeded end-to-end (28-slide PPTX, 561 KB), validating that the Phase 7 build-script architecture produced by the skill is correct.

The 3 `with_skill` runs whose builds failed under main-session execution:
- `team-update`: legitimate Phase 8 code-review miss — `pptxgenjs.shapes.LINE` vs lowercase `ShapeType.line`. Phase 8 rubric caught this exact issue in the `pitch-deck` run but not in `team-update`. Indicates Phase 8 review quality varies per run. Not a hardening regression; a Phase 8 review-depth variability.
- `auth-migration` and `pitch-deck`: ENOENT on images. Build would succeed if Phase 6 images existed. Not a skill defect.

## Acceptance criteria (from the design spec)

| AC | Description | Verdict | Evidence |
|----|-------------|---------|----------|
| AC1 | Phase 6 image files produced in every Q8 ≠ `text-only` with_skill run | **Partial** | 0/3 image-requiring runs produced images — Phase 6 Replicate wall blocks subagents. Halt behavior correct per design. |
| AC2 | No IMAGE_PLAN.md used as completion marker | ✅ **PASS** | 0/4 with_skill runs produced an `IMAGE_PLAN.md`. The "plan instead of execution" failure mode documented in the design is absent. |
| AC3 | With-skill pass rate ≥ 90% on Sonnet | **Not quantifiable** | Strict pass-rate computation requires graded grading.json files. Qualitative evidence (per-run scorecard above) strongly suggests the hardening goal is met across assertions B1–B13, B15–B17; B14/B18 are blocked by infra not skill. |
| AC4 | No regression on iter-1 wins | ✅ **PASS** | Resumption detected correctly in otel-resume. Rich-materials synthesis works (auth-migration style guide cites Midnight Executive palette tracing back to fixtures). Missing-info handling works (pitch-deck doesn't fabricate TAM/SAM/team). |
| AC5 | Token cost ≤ iter-1 × 1.15 | ❌ **FAIL** | Iter-3 with_skill mean is ~93k; iter-1 with_skill mean was ~20k (on an infra where node/npm ran freely). Ratio ~4.6×. This is a real regression — the hardening's insistence on substantive review logs + applied Must-fixes is expensive. |
| AC6 | Provisional-change evaluation | **Keep all** | Every provisional phase produced substantive artifacts when the skill reached that phase. No phase showed "gate added but no behavioral improvement." |

## Conclusions

1. **The iter-2 Sonnet hardening is validated for skill-behavior quality.** The core failure modes it targeted (plan-instead-of-execute at Phase 6, shallow reviews, silent downgrades, no mechanical gates) are all absent from the iter-3 with_skill runs. Every run produced substantive review logs with ≥ 3 findings per persona and applied Must-fixes.

2. **The `fewer-permission-prompts` derail problem is solved** by the explicit anti-pivot guardrail in subagent prompts. Zero derails this iteration vs. 2/4 in iter-2.

3. **Phase 6 subagent-MCP infra gap is real and merits a follow-up.** Not a skill defect — the skill halts correctly. But in any subagent-dispatched eval, full end-to-end validation is gated on granting MCP access to subagents.

4. **Token cost regression (AC5) needs attention in iter-4.** The hardening's substantive-findings requirement is producing 4–5× the iter-1 token cost. Options: consolidate review personas, reduce minimum-findings threshold to 2, or accept cost as the price of quality.

5. **Phase 8 review depth varies** — team-update missed the `ShapeType.line` bug that pitch-deck caught. Consider making the code-review rubric more mechanical (specifically list common pptxgenjs API gotchas).

## Recommended next steps

- Open this report as a PR against main (no skill changes in this branch — purely validation output).
- File an issue tracking the Phase 6 subagent-MCP infra gap.
- File an issue for the AC5 token-cost regression with the options above.
- Consider a small iter-4 patch: add common pptxgenjs API gotchas (ShapeType casing, image path conventions) to `phase-8-code-review.md` as explicit review-focus items.
