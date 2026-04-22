# Design: Sonnet-Hardening Pass for presentation-builder

**Date:** 2026-04-22
**Status:** Proposed
**Scope:** Iteration 2 of presentation-builder skill — instruction tightening across all 9 phases + setup to make the skill reliably executable by Sonnet-class models. Every phase gets a content-aware completion gate; phases with specific Sonnet-vulnerable patterns get targeted rewrites.

## Motivation

A real user ran the skill in a Sonnet session and reported two things: Claude "ignored critical instructions" and "no images were generated" — despite Replicate MCP being configured and working. The iteration-1 eval corroborates: all four with-skill subagent runs (also Sonnet) produced `IMAGE_PLAN.md` planning documents but never called the Replicate MCP to produce actual image files, even when given enough information to do so.

The skill works on Opus because Opus aggressively infers intent from under-specified instructions. Sonnet is more literal and follows what the skill *says*, not what it *means*. The current skill leans on Opus-shaped compliance — it says things like "plan ALL images before generating. Batch in groups of 4" and expects the model to cycle back to generation on its own. Sonnet does not.

This design fixes that.

## Goal

Make the skill produce substantively complete artifacts at every phase — including generated images — when invoked in a Sonnet-main-session. The skill must not silently downgrade any phase to a thin or placeholder output when the tools and context required for full execution are available.

Concrete guarantees:
- **Phase 1:** files are actually copied into `gathered-materials/`, not just indexed.
- **Phase 2:** every section in the design spec has all 6 required fields (see Glossary).
- **Phase 3 / 5:** reviews contain substantive findings (see Glossary) and findings are applied to the artifact.
- **Phase 4:** style guide contains all 6 required sections.
- **Phase 6:** `images/` contains real image files (unless Q8 = `text-only`; see Glossary), not just an `IMAGE_PLAN.md`.
- **Phase 7 / 8 / 9:** build is actually executed and the output file has correct slide count.

## Glossary

Terms used throughout this design.

- **Q8 / Visual Strategy.** A new requirements question added in Phase 2. Values: `full` (all slides get AI-generated images), `selective` (only specific slides listed in the spec get images), `text-only` (no AI images; native shapes/charts/typography only). Defined fully in the Phase 2 changes below.
- **Substantive finding.** A review finding that (a) names a concrete location in the artifact — a section name, slide number, or exact quoted phrase — and (b) states what specifically is wrong and why. A persona review with fewer than 3 findings of this shape is too shallow and fails the gate.
- **Substantiated waiver.** When a reviewer genuinely finds no issues from their perspective, they do not write "no issues" — they write an explicit statement naming the criteria they checked: e.g., *"No issues — I reviewed the section opening of each of the 5 sections for problem-first framing and found all 5 start with a problem."* A bare "no issues" does not satisfy the gate.
- **Provisional change.** A design change whose evidence base is inferred Sonnet-vulnerability rather than an observed failure (in iteration-1 evals or a user report). Provisional changes may be reduced to minimal gates if iteration-2 evals don't justify the investment. Flagged per-phase below.

## Non-goals

- Reducing skill runtime or token cost (addressed separately in a follow-on).
- Adding new phases or changing the 9-phase architecture.
- Multi-model delegation via subagents (possible follow-on; orthogonal to this pass).
- Solving the TAM/SAM fabrication problem (a separate behavioral issue the evals flagged).

## Principles

### 1. Inline the critical execution step in SKILL.md

Sonnet frequently does not fully follow `read references/<phase-N>.md` indirections. The minimum viable command — the actual tool call, the artifact to produce — must appear in SKILL.md itself. The detailed reference file becomes supporting material, not the carrier of primary instructions.

### 2. Action-first language, not plan-first

Language like "Plan ALL X before generating. Batch in groups of 4" trains deferral. Sonnet will plan and not return to execution. Replace with action-oriented loops: "For each X, call Y. Save to Z." Planning, where needed, becomes a side-effect of action, not a separate gate.

### 3. Explicit, content-aware phase-complete gates

Each phase ends with a mechanical check — "Phase N is not complete until `<concrete condition>`". The condition must be **content-aware**, not just existence-aware. "File X exists" is not a strong enough gate — Sonnet can satisfy it with an empty or placeholder file. Gates should check for *substance*: "file X contains at least N sections," "directory Y has files of non-zero size," "process Z was executed and its output captured in file W." Sonnet respects mechanical gates phrased as conditions on verifiable state.

### 4. Name known failure modes explicitly

Write sentences of the form "A common failure pattern is X. Do not do this." Sonnet reads these as hard constraints. This is meta-instruction but it measurably improves compliance. Use sparingly — only for failure modes actually observed.

### 5. Close escape hatches that permit silent downgrade

Instructions like "If X is not available, document placeholder descriptions for manual creation" give Sonnet permission to silently bypass the real work. Either X is a hard prerequisite (block the phase), or the fallback is itself a concrete executable path, not a prose description.

### 6. Every gate has a paired eval assertion

Iteration-1 scored 93% on Sonnet yet the real user hit the Phase 6 silent-skip — because no iteration-1 assertion required actual image files on disk. A gate we can't measure in an eval is a gate we can't trust. For every content-aware gate added in this iteration, the iteration-2 assertion set (Appendix B) must contain a corresponding check. New principles added in future iterations inherit this rule.

## Changes per file

### `SKILL.md`

- Replace the terse Phase 6 summary with the version in Appendix A (inlines the MCP call shape, names the failure mode, gates on `images/` file existence).
- Replace the Phase 7 summary with a version that names the `document-skills` fallback path explicitly (fall through to direct `pptxgenjs` when `/pptx` is unavailable) rather than leaving Sonnet to infer it.
- **Inline the Phase 3 gate + critical step.** Per Principle 1 — don't hide the gate behind a reference. SKILL.md Phase 3 summary says: "Run multi-perspective review (see `references/review-tiers.md` + `references/fallback-review-prompts.md`). Phase 3 is not complete until the spec's review-log section contains ≥ 3 substantive findings per persona (or a substantiated waiver — see Glossary) AND every Must-fix finding has a corresponding spec edit or documented dismissal."
- **Inline the Phase 5 gate + critical step** with the same pattern as Phase 3, applied to spec + style guide together.
- **Inline the Phase 9 gate + critical step** fully (Phase 9 is simple enough to not need its own reference file). SKILL.md Phase 9 summary says: "Run the build script (e.g., `node build.js`). Phase 9 is not complete until the output file exists at the expected path, its size exceeds the minimum threshold (≥ 10KB for PPTX, ≥ 5KB for PDF/DOCX/HTML), and the slide count matches the spec."
- Add a "Phase 6 is mandatory when Q8 ≠ `text-only` and Replicate MCP is configured" sentence to the Phase 6 section.

### `references/phase-6-visuals.md`

Full rewrite along the lines of the approved Phase 6 draft. Key changes:

- Replace "Plan ALL Images First" with "For each image in the style guide's plan, generate → download → background-remove (if light bg)."
- Inline the `mcp__replicate__create_predictions` and `mcp__replicate__download_files` call shapes with model IDs, prompt composition, and target filenames.
- Move the "Replicate MCP not available" branch from mid-phase to a hard prerequisite. If the MCP is absent, the phase does not start — the skill halts and asks the user to configure it.
- Add phase-complete gate: `ls images/` count check.
- Add named failure mode: "Writing `IMAGE_PLAN.md` without files on disk is not Phase 6 completion."

### `references/phase-7-implementation.md`

- Resolve the `/pptx` skill fallback ambiguity: add an explicit "if `/pptx` is unavailable, build with `pptxgenjs` directly using the architecture below" sentence, so Sonnet doesn't stall or degrade silently when document-skills isn't installed.
- Add phase-complete gate: "Phase 7 is not complete until `build.js` runs with zero errors and produces a presentation file of the expected slide count."

### `references/review-tiers.md`

- Acknowledge explicitly what the iteration-1 eval surfaced: Tier 1 (BMAD party mode) and Tier 2 (Reflexion critique) currently require interactive multi-turn orchestration and do not execute reliably in a single-agent session. For single-agent / autonomous runs, Tier 3 (built-in multi-perspective review) is the correct default.
- Leave Tier 1/2 as aspirational options but clarify when to use them (interactive Opus sessions, not autonomous/subagent runs). Note: this is a deliberate reliability-over-quality-ceiling tradeoff for Sonnet runs; Tier 1/2 remain the preferred path when available.

### `references/phase-1-research.md` *(provisional)*

Real Sonnet risk: writing `MATERIALS_INDEX.md` without actually moving files to `gathered-materials/`, and skipping the "Identify Gaps → present to user" interactive step.

Changes:
- Restructure steps so file-copy comes before indexing, not after (makes the index naturally reflect real copied files, not imagined ones).
- Add content-aware phase gate: `find gathered-materials/ -type f | wc -l` ≥ 1 **AND** every row in `MATERIALS_INDEX.md` points to a file that actually exists under `gathered-materials/`. (The "files referenced in index exist" check is the important one — prevents Sonnet from indexing files it meant to copy.)
- Make the gap-identification step a required output: gaps must be written to the end of `MATERIALS_INDEX.md` as a "Gaps" section (even if empty — then the section reads "Gaps: none identified — coverage audited against [list of topics]"). This converts an interactive dialogue step into an artifact, which Sonnet handles better.
- Exception-clause detection: as the *first* action in Phase 1, the skill asks the user exactly: *"Do you have any source materials (files, notes, docs, links) I should work from, or should I brainstorm from scratch?"* If the user says scratch, the skill writes a `NO_MATERIALS.md` marker file at the project root (single-line: "User is starting from scratch — Phase 1 skipped.") and proceeds directly to Phase 2. The Phase 1 gate then checks for either a valid `MATERIALS_INDEX.md` OR the `NO_MATERIALS.md` marker.

### `references/phase-2-requirements.md` *(provisional)*

Real Sonnet risk: thin Section Design (missing 2-3 of the 6 required fields per section) and skipped Cut Plan.

Changes:
- Add **Q8: Visual Strategy** to the core-questions section: "Do you want AI-generated images throughout the deck, or a text-only deck (charts/shapes/icons built natively, no AI-generated imagery)?" Choices: `full` / `selective` / `text-only` (see Glossary). Thread the answer into the design spec.
- Phase 6 consults the spec: if `text-only`, Phase 6 is skipped entirely; if `selective`, spec lists which slides get images; if `full`, Phase 6 runs as designed.
- **Setup re-entry path for Replicate.** When the user answers Q8 = `full` or `selective`, and Replicate MCP is not currently configured, Phase 2 pauses before completing and runs the Replicate setup flow inline (same procedure as `setup.md` step 2). On successful setup, Phase 2 resumes. If the user declines to configure Replicate at this point, the skill offers to change the Q8 answer to `text-only` — otherwise the skill cannot proceed to Phase 6 and halts with an explanation.
- Make the Section Design step mechanical: for each section, the spec must contain a labelled subsection with all 6 fields (title, duration, problem-opening, content, materials, slide concepts, transition). A section subsection with fewer than 6 labelled fields is incomplete — return to the user and ask for the missing fields explicitly.
- Cut Plan becomes a required spec field when duration > 20 minutes. If duration ≤ 20 minutes, the spec says "Cut plan: not required (duration under 20min)."
- Add content-aware phase gate: spec file exists **AND** all 8 Q answers are present **AND** every section has all 6 labelled fields **AND** (cut plan present OR explicitly waived) **AND** (Q8 = `text-only` OR Replicate MCP configured).

### Phase 3 — SKILL.md summary + update `references/fallback-review-prompts.md` *(provisional)*

**Decision:** No new `phase-3-multi-agent-review.md` file. The gate + critical step is inlined in SKILL.md (see SKILL.md changes above). The persona details and process live in the existing `references/review-tiers.md` and `references/fallback-review-prompts.md`.

Real Sonnet risk: shallow Tier 3 reviews (1-bullet per persona) and skipped "apply findings to spec" step.

Changes (to `fallback-review-prompts.md`):
- Set substance expectations at the top of the file: each persona must produce **at least 3 substantive findings** (see Glossary). A persona review that produces fewer than 3 substantive findings is too shallow — re-prompt with "Be more specific — name slides, sections, or exact phrases in the spec."
- Remove any "no issues from this perspective" escape-hatch phrasing. A genuine no-issues review requires a **substantiated waiver** (see Glossary) — a single line naming what was checked and against what criteria. A bare "no issues from this perspective" does not satisfy the gate.
- Make findings application explicit and verifiable: after the synthesis table is produced, the skill writes updated spec content that addresses each "Must fix" finding. The spec's review-log section records each finding, its reviewer, and which spec edit addressed it (or why it was deliberately not actioned).
- Content-aware phase gate (enforced in SKILL.md): spec contains a review-log section with ≥ 3 substantive findings per persona (or substantiated waivers), AND every "Must fix" finding has a corresponding spec edit or explicit dismissal.

### `references/phase-4-style-guide.md` *(provisional)*

Moderate risk: incomplete style guide missing visual-motifs or underspecified typography.

Changes:
- Image-prompt section becomes conditional on Phase 2 Q8. If `text-only`, include native-visual patterns (color blocks, typography, shape-based diagrams) but omit AI image-prompt prefixes.
- Content-aware phase gate: `style-guide.md` exists **AND** contains all 6 required sections:
  1. Color palette (≥ 4 colors with hex codes and role labels)
  2. Typography table (≥ 4 element types)
  3. Slide-structure patterns (dark/light mapping, accent patterns)
  4. Visual motifs (≥ 1 recurring element)
  5. Image-prompt prefixes *if Q8 ≠ `text-only`; omitted if Q8 = `text-only`*
  6. Written to the file (non-empty)

### Phase 5 — SKILL.md summary + reuse `references/review-tiers.md` + `references/fallback-review-prompts.md` *(provisional)*

**Decision:** No new `phase-5-design-review.md` file. The gate + critical step is inlined in SKILL.md. Phase 5 reuses the Phase 3 mechanism applied to spec + style guide together.

Changes: none beyond what Phase 3 already covers — the same fallback-review-prompts.md updates apply. The SKILL.md inline gate references spec + style-guide together.

### `references/phase-8-code-review.md` — **new file** *(provisional)*

**Decision:** New file. Justification — Phase 8 has unique content (mandatory pre-review build run, code-specific review criteria) that doesn't fit cleanly into the existing review-tiers/fallback-review-prompts files, and is bulky enough that inlining in SKILL.md would bloat the skill's always-present surface.

Real Sonnet risk: reviewing code without running the build. Shallow reviews. Skipped findings application.

Changes:
- **Mandatory pre-review step** (at the top of the new file, referenced from SKILL.md): run `node build.js` (or the equivalent) once, capture the output (stderr/stdout + exit code + generated file size), and include it in the review context. If the build fails, that's the first finding and all subsequent review is conditional on the fix.
- Same substance expectations as Phase 3 reviews: ≥ 3 substantive findings per persona, or substantiated waiver.
- Content-aware phase gate (enforced in SKILL.md): build was executed (output file exists with non-zero size OR a build failure is recorded and fixed) AND code-review log has ≥ 3 substantive findings per persona (or substantiated waivers) AND every "Must fix" finding is applied.

### Phase 9 — SKILL.md inline *(provisional)*

**Decision:** No new reference file. Phase 9 is simple enough to be inlined fully in SKILL.md (see SKILL.md changes above).

Real Sonnet risk: claiming success based on build scripts existing rather than actually executing.

The inlined instruction and gate are the only Phase 9 material — no other file touched.

### `references/setup.md`

Real Sonnet risk: the "If user doesn't want to set up Replicate" escape-hatch language. Currently: "No problem — I can design the presentation and create placeholder slides for images." This is a silent-downgrade path for Sonnet: if Sonnet can't quickly figure out how to prompt for the token, it may take this branch instead and silently produce a deck with no images.

Changes:
- Tie the "don't want Replicate" branch to the Phase 2 Q8 answer, not to an ad-hoc runtime fallback. If the user has said `text-only` in Q8, no setup prompt fires at all. If the user has said `full` or `selective`, setup is mandatory — no skip-without-explicit-opt-out branch.
- Remove the "create placeholder slides for images" language entirely. It's inconsistent with both the `text-only` (no image slots) and `full`/`selective` (real images) paths.
- Clarify that setup is per-machine: once `~/.claude/.presentation-builder-setup-complete` exists, skip setup entirely, but re-verify Replicate MCP is still present before Phase 6 if Q8 ≠ `text-only`.
- Cross-reference the Phase 2 setup re-entry path so both files agree on what happens if the user declines Replicate setup but then answers Q8 = `full`/`selective` later.

### Stale header corrections (ship as a separate mechanical commit)

These are trivial string fixes. Keeping them separate from the substantive changes preserves causality if iteration-2 evals surface an unexpected regression.

- `phase-6-visuals.md` — correct header ("Phase 8" → "Phase 6").
- `phase-7-implementation.md` — correct header ("Phase 6: Implementation Scripts" → "Phase 7: Implementation Scripts").

### Triggers for follow-on work

Not covered in this iteration — noted here so they don't get lost:

- **Reducing skill runtime.** Currently 5× baseline. Candidate: Quick Path simplification.
- **Multi-model delegation** where Phase 3/5 reviews dispatch Opus subagents. Orthogonal to this iteration.
- **TAM/SAM fabrication problem** — a content-grounding / hallucination issue both conditions failed. Needs its own design.

## Acceptance criteria

1. **Targeted fix works.** A Sonnet-main-session run of Test 2 (auth migration) produces files in `images/` at Phase 6 completion, not just `IMAGE_PLAN.md`.
2. **Assertions tightened to catch the real-user failure.** Iteration-1 evals scored 93% on Sonnet, yet the real user experienced silent Phase 6 skip because no iteration-1 assertion required image files on disk. Iteration 2 uses the full assertion set enumerated in Appendix B.
3. **Pass rate ≥ 90% on Sonnet against the iteration-2 assertion set (Appendix B).** Note: iteration-1's 93% is not comparable — it scored a strictly weaker rubric. The target is an independent goal.
4. **No regression on existing pass-rate wins.** Resumption detection (Test 4), rich-materials synthesis (Test 2), and missing-info handling (Test 3) continue to pass at iteration-1 levels.
5. **Token cost does not substantially increase.** Iteration 2 token cost per with-skill run ≤ iteration 1 × 1.15. (We are adding some inline instructions; some offsetting savings from closing escape hatches.)
6. **Provisional-change evaluation.** After iteration-2 evals complete, review which provisional changes produced measurable pass-rate wins on their paired assertions. Changes that did not produce measurable wins are candidates for reduction to minimal gates in iteration 3.

## Out of scope for this iteration

See "Triggers for follow-on work" above. Additionally:

- Updating the skill-creator eval framework itself (patches we applied to make iteration-1 benchmarking work — the broken `</script>` escaping, the timing.json schema mismatch — should be filed upstream separately).

## Risks

- **Inlined tool-call shapes tie the skill to specific Replicate model IDs.** If `google/nano-banana-2` is deprecated, the SKILL.md gets stale. Mitigation: the model IDs are also mentioned in the reference file, and SKILL.md uses "e.g." language rather than binding hard.
- **"Known failure mode" sections are unusual in skills.** They may feel defensive. Mitigation: keep them short, tied to specific observed patterns, and scoped to phases where we have evidence they help.
- **Hard-gating Phase 6 on Replicate MCP configuration** could block users who reasonably want to build a text-only deck. Mitigation (now in scope): Q8 Visual Strategy is asked up front in Phase 2. Phase 6 reads this from the spec and skips entirely if `text-only` — the Replicate MCP check only fires when images are actually planned. The Phase 2 setup re-entry path handles the case of a user who skipped Replicate setup but later answered Q8 = `full`/`selective`.
- **Scope expansion risk.** Changes to phases 1, 2, 3, 4, 5, 8, 9 are flagged *provisional* because their evidence base is inferred Sonnet-vulnerability rather than an observed failure. If iteration-2 evals do not show measurable wins on the paired assertions for these phases, the corresponding full changes should be reduced to minimal gates in iteration 3 to reduce maintenance surface. Mitigation: Acceptance Criterion 6 makes this evaluation explicit.
- **Inlining grows SKILL.md.** SKILL.md is loaded on every turn. Inlining Phase 3, 5, 6, 7, 9 summaries adds lines to the always-present system prompt. Mitigation: keep inlined sections short — the gate + one-sentence critical step only, with detailed process deferred to reference files. AC #5 (token cost ≤ 1.15×) acts as a hard budget.

## Appendix A: Proposed Phase 6 text

(Draft content approved in brainstorming; reproduced here for concreteness. Final text may have minor edits during implementation.)

SKILL.md Phase 6 summary:
```
### Phase 6: Visual Generation

**Hard prerequisite:** Replicate MCP configured and working AND Q8 ≠ `text-only`.
If Replicate is absent, STOP (Phase 2 should have caught this — see setup re-entry path).
If Q8 = `text-only`, skip Phase 6 entirely and advance to Phase 7.

Read `references/phase-6-visuals.md` and follow it end-to-end. This phase
is not complete until `images/` contains one file per image in the style
guide's plan. Writing `IMAGE_PLAN.md` without files on disk is a known
failure mode — do not advance to Phase 7 in that state.
```

references/phase-6-visuals.md opening:
```
# Phase 6: Visual Generation

## Prerequisite (hard gate)

Replicate MCP must be configured and working. If it is not, STOP and instruct
the user to set it up. Do NOT proceed. Do NOT produce an `IMAGE_PLAN.md` as
a substitute. An empty `images/` directory is not acceptable output.

## Process

Read `style-guide.md`. It defines the image plan. For each image in that plan:

1. Generate: `mcp__replicate__create_predictions`, model "google/nano-banana-2"
   (production) or "black-forest-labs/flux-schnell" (drafts), prompt is
   `<style guide prefix> + <image subject>`, aspect_ratio "16:9".
2. Download: `mcp__replicate__download_files` to `images/NN-<slug>.jpg`.
3. Background-remove for light-background slides using
   `recraft-ai/recraft-remove-background`. Save as `.png`.

Batch 4 image generations in parallel.

## Phase-complete gate

`ls images/` must show one file per image in the style guide's plan before
advancing to Phase 7.

## Known failure mode

A Sonnet-model failure pattern is writing `IMAGE_PLAN.md` describing what
would be generated, then advancing without calling the MCP. This is not
Phase 6 completion. The output of this phase is image files on disk.
```

## Appendix B: Iteration-2 assertion set

Every content-aware gate added in this design has a paired eval assertion, per Principle 6. The iteration-2 eval must run against this set (or a superset).

| # | Phase | Assertion |
|---|-------|-----------|
| B1 | Phase 1 | Either (a) `NO_MATERIALS.md` marker exists at project root, OR (b) `gathered-materials/` contains ≥ 1 file and every row in `MATERIALS_INDEX.md` points to a file that actually exists. |
| B2 | Phase 1 | `MATERIALS_INDEX.md` contains a "Gaps" section (non-empty content or explicit "Gaps: none identified — coverage audited against [list]"). |
| B3 | Phase 2 | Design spec exists at `docs/superpowers/specs/*.md` and contains answers to all 8 requirements questions (Q1–Q8). |
| B4 | Phase 2 | Every section in the spec has all 6 labelled fields (title, duration, problem-opening, content, materials, slide concepts, transition). |
| B5 | Phase 2 | Cut plan is present OR explicitly waived (spec line matching "Cut plan: not required (duration under 20min)"). |
| B6 | Phase 2 | If Q8 = `full` or `selective`, Replicate MCP is configured by the end of Phase 2 (or the user has changed Q8 to `text-only`). |
| B7 | Phase 3 | Spec review-log contains ≥ 3 substantive findings per persona (Presentation Expert, Narrative Specialist, PM, Technical Architect) — or a substantiated waiver per persona. |
| B8 | Phase 3 | Every Must-fix finding has a corresponding spec edit or documented dismissal in the review-log. |
| B9 | Phase 4 | `style-guide.md` exists with all 6 required sections (palette ≥ 4 colors, typography ≥ 4 elements, slide patterns, visual motifs ≥ 1 element, image prompts iff Q8 ≠ `text-only`, non-empty content). |
| B10 | Phase 5 | Spec + style-guide review-log contains ≥ 3 substantive findings per persona, OR substantiated waivers. |
| B11 | Phase 5 | Every Phase 5 Must-fix finding has a corresponding spec/style-guide edit or documented dismissal. |
| B12 | Phase 6 | If Q8 ≠ `text-only`, `ls images/` count == count of images in style-guide plan. If Q8 = `text-only`, no `images/` directory is required and no `IMAGE_PLAN.md` is produced. |
| B13 | Phase 6 | No `IMAGE_PLAN.md` is used as a completion marker in place of generated files. |
| B14 | Phase 7 | `build.js` runs with exit code 0 and produces a presentation file of the expected slide count. Transcript records the build invocation. |
| B15 | Phase 8 | Build was executed at least once before code review (transcript evidence of `node build.js` run with captured output). |
| B16 | Phase 8 | Code-review log contains ≥ 3 substantive findings per persona, or substantiated waivers, with locations cited. |
| B17 | Phase 8 | Every Phase 8 Must-fix finding is applied (code has been edited) or documented dismissal. |
| B18 | Phase 9 | Final output file exists at expected path, size exceeds threshold (≥ 10KB PPTX / ≥ 5KB others), and slide count matches spec. |

**Note on eval scenarios.** The four iteration-1 test scenarios (team-update Quick, auth-migration Standard, pitch-deck Complex, otel-resume Resumption) drive which assertions apply per run. Assertions that depend on Q8 (B6, B9 image-prompt section, B12, B13) are conditional. The eval framework should skip assertions that don't apply to a given scenario (e.g., Phase 1 assertions for the resumption scenario, since Phase 1 is already complete).
