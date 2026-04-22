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
