# Phase 8: Code Review

## Purpose

Review the build scripts for correctness and spec conformance BEFORE
declaring Phase 7 complete. This catches runtime errors, layout overflow,
style-guide deviations, spec gaps, dead code, and terse speaker notes.

## Reviewer reading list

Reviewers should read these before forming findings:
- `references/review-tiers.md` — the review tier detection mechanism
- `references/fallback-review-prompts.md` — substance expectations and
  substantiated-waiver format
- `references/presentation-best-practices.md` — the standard for
  "substantive" speaker notes (so the "terse speaker notes" criterion
  has a concrete reference)

## Mandatory pre-review step: run the build

Before any code review happens, run the build command and capture the
output:

```bash
cd build-deck && node build.js 2>&1 | tee ../build-output.log ; echo "EXIT=$?"
```

Record in the review context:
- Exit code (must be 0 for review to proceed).
- stdout + stderr (captured in `build-output.log`).
- Generated file size (e.g., `ls -la output.pptx | awk '{print $5}'`).

If the build FAILS (exit code ≠ 0), that's the FIRST finding. All
subsequent review is conditional on fixing the build failure — re-run
the build after fixes until exit code 0.

A common Sonnet failure pattern is reading the build scripts and
commenting on them without running the build. The build failure class
is the most important thing code review catches — don't skip the run.

## Review process

Use the tiered review mechanism from `review-tiers.md`. For code review,
the relevant personas from `fallback-review-prompts.md` are:
- **Presentation Expert** — reviews slide layout, timing, visual hierarchy.
- **Technical Architect** — reviews code structure, module boundaries,
  error handling.
- **Product Manager** — reviews whether the deck delivers the primary
  takeaway.

The substance expectations apply: each persona produces ≥ 3 substantive
findings (or a substantiated waiver) with locations cited.

Focus on:
- Runtime errors (exit code ≠ 0 in the build — but this is already a
  blocker caught in the pre-review step)
- Layout overflow (text clipping, off-palette colors)
- Style-guide deviations (did a slide use an off-palette color?
  off-typography size?)
- Spec gaps (is every section from the spec represented in slides?)
- Dead code (unused helper functions, unused imports)
- Terse speaker notes — notes that are stage directions rather than
  speakable talking points. Reference `references/presentation-best-practices.md`
  for the "good notes (speakable script)" standard.
- **pptxgenjs API gotchas** (see checklist below) — each one has been
  observed to ship undetected by a less-rigorous Phase 8 review.

## pptxgenjs API gotcha checklist (PPTX format only)

Before marking Phase 8 complete for PPTX builds, grep each build-deck
file against these patterns. Each gotcha has caused a real runtime
build failure in prior evaluations.

1. **Shape constant casing.** The pptxgenjs shape enum is UPPERCASE.
   `ShapeType.line` throws "Missing/Invalid shape parameter"; the
   correct form is `ShapeType.LINE`. Check every `addShape` /
   `ShapeType.` call and every string literal shape name. Common
   offenders: `line`, `rect`, `ellipse`, `roundRect` (must be
   `ROUND_RECT`).

2. **Image path references match disk.** Every `addImage({ path: ... })`
   reference must resolve to an actual file. Cross-check the
   build-deck's `addImage` calls against `ls images/` output. If Phase 6
   produced `01-title-hero.jpg` but the build script references
   `01-hero.jpg`, the build fails with `ENOENT`.

3. **Hex color format.** pptxgenjs expects `"0891B2"` (no `#` prefix).
   `"#0891B2"` is silently ignored or renders wrong.

4. **Font size is a number, not a string.** `fontSize: 24` works;
   `fontSize: "24"` may silently fail or render at default size.

5. **Slide-file indexing consistency.** If `slides-s1.js` exports
   `addSection1Slides`, make sure `build.js` imports and calls it
   correctly. Off-by-one errors on `s0` vs `s1` naming are common
   when sections are added incrementally.

6. **Placeholder text left on slides.** If a stat was unavailable
   during Phase 2 (e.g., "TBD: conversion rate") and the placeholder
   string was carried into the build script verbatim, it will appear
   on the rendered slide. Either replace with the real number or
   remove the slide/bullet entirely. Do not ship `[TODO]`, `[TBD]`,
   or `[placeholder]` text on finished decks.

Mark each gotcha PASS/FAIL in the Phase 8 review log. A gotcha-level
FAIL is always a Must-fix.

## Review log location (canonical)

The Phase 8 review log is written to `code-review.md` at the project root
(a sibling of the spec and `style-guide.md`). This is the canonical
location — NOT the spec — so the Phase 8 review can be updated in
iteration without modifying the immutable design record.

The file contains a `## Review Log (Phase 8)` section in the same format
as `references/fallback-review-prompts.md` describes.

## Phase-complete gate

Phase 8 is NOT complete until:

1. The build was executed at least once (transcript contains evidence of
   `node build.js` invocation with captured output).
2. The most recent build run exited with code 0 OR the failure is
   recorded in the review log and subsequently fixed (re-run to 0).
3. The canonical `code-review.md` file exists at the project root with a
   `## Review Log (Phase 8)` section.
4. The review log contains ≥ 3 substantive findings per persona (or
   substantiated waivers).
5. Every Must-fix finding has a corresponding code edit applied (or
   explicit documented dismissal).

A common Sonnet failure pattern is reading the code and advancing
without running the build. Do NOT advance to Phase 9 without the
mandatory pre-review step complete.

## Outputs

- `build-output.log` (captured build stderr/stdout) — informational.
- `code-review.md` with `## Review Log (Phase 8)` section — canonical.
- Code edits applied for Must-fix findings.
