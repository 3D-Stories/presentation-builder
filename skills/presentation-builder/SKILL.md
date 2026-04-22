---
name: presentation-builder
description: >
  End-to-end presentation creation through structured phases: research, requirements, design,
  visual generation, implementation, and iteration. Handles PPTX, HTML, PDF, and DOCX output
  formats via document-skills. Use this skill whenever the user wants to create a presentation,
  slide deck, pitch deck, talk, or lecture — even if they just say "build me a deck about X" or
  "I need slides for a talk on Y." Also use when the user has existing content (notes, docs,
  research) they want turned into a presentation. Triggers on: "create presentation", "build slides",
  "make a deck", "presentation about", "slide deck for", "put together a talk", "pitch deck",
  "build me a pptx", or any request that involves creating structured visual content for an audience.
argument-hint: "<topic or description of the presentation>"
---

# Presentation Builder

Build professional presentations through a structured, iterative workflow. This skill captures the
methodology of spending the most effort on requirements and design (shift-left), using AI to handle
orchestration, and verifying output through multi-agent review.

## First Run: Prerequisites & Setup

On first invocation, check and install dependencies in order. Read `references/setup.md` for the
full setup process including MCP configuration.

**1. document-skills plugin** (required for output format skills + /generate-image):
```bash
ls ~/.claude/plugins/cache/anthropic-agent-skills/document-skills/ 2>/dev/null
```
If not found, guide the user:
> "This skill needs the document-skills plugin for building presentations. Let me set that up."

Then run:
```
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/reload-plugins
```

**2. `/generate-image` skill** (required for AI image generation):
Image generation is delegated to the `/generate-image` skill. If the user's environment does not have it set up, guide them:
> "Image generation is handled by the `/generate-image` skill. Run `/generate-image:setup` to configure it — you'll need a free Replicate API token from replicate.com/account/api-tokens. The setup skill handles MCP configuration."

Read `references/setup.md` for the delegation details and Q8 fallback choices.

**3. Review tools** (optional, enhances quality):
- Check for `/bmad-party-mode` (Tier 1 review)
- Check for `/reflexion:critique` (Tier 2 review)
- If neither available, the skill uses built-in multi-perspective review prompts (Tier 3)

After first successful setup, create `~/.claude/.presentation-builder-setup-complete`
so subsequent runs skip the check. This is global (not per-project) because the prerequisites
(document-skills, `/generate-image`) are machine-level, not project-level.

## Complexity Detection

Before starting, assess presentation complexity to choose the right workflow:

**Quick Path** (<10 slides, single topic, no external research needed):
- Skip Phase 1 (Research)
- Compress Phases 2-3 into one brainstorm
- Skip Phase 5 (Design Review)
- Generate visuals and build in one pass
- Example: "Make a 5-slide team update on Q4 progress"

**Standard Path** (10-20 slides, moderate complexity):
- Full workflow with single review passes
- Example: "Build a 20-minute talk on our new API for the dev team"

**Complex Path** (>20 slides, multiple sources, mixed audience):
- Full workflow with multi-agent reviews at every gate
- Example: "Put together a 45-minute presentation on advanced AI coding practices"

## Workflow Overview

The workflow has three user-facing stages with internal phases. At each check-in, show the
progress indicator so the user always knows where they are.

```
STAGE 1: DISCOVERY
  Phase 1: Research & Gather ──→ MATERIALS_INDEX.md
  Phase 2: Requirements ────────→ Presentation design spec

STAGE 2: DESIGN
  Phase 3: Multi-Agent Review ──→ Refined spec
  Phase 4: Style Guide ─────────→ style-guide.md
  Phase 5: Design Review ───────→ Approved spec + style guide
  Phase 6: Visual Generation ───→ AI-generated images

STAGE 3: BUILD
  Phase 7: Implementation ──────→ Build scripts (modular)
  Phase 8: Code Review ─────────→ Verified scripts
  Phase 9: Build & Iterate ─────→ Final presentation file
```

**Check-in format:** At the end of each phase, present:
> "[Stage N/3 — Phase M: Phase Name] Here's what we have so far: [brief summary].
> Does this look right? Anything to adjust before we move on?"

**Do NOT skip phases** -- the shift-left principle means most effort goes into Stages 1-2.
The implementation in Stage 3 becomes almost mechanical because the design is solid.

## Resuming a Presentation

If invoked in a directory with existing presentation artifacts, detect partial progress:

| If this exists... | Resume from... |
|-------------------|----------------|
| `MATERIALS_INDEX.md` only | Phase 2 (Requirements) |
| Design spec in `docs/superpowers/specs/` | Phase 3 (Review) |
| `style-guide.md` | Phase 5 (Design Review) or Phase 6 (Visuals) |
| `images/` directory with files | Phase 7 (Implementation) |
| `build-deck/` directory with scripts | Phase 8 (Code Review) or Phase 9 (Build) |
| `.pptx`/`.html`/`.pdf`/`.docx` output | Phase 9 (Iterate) |

Present what was found and ask: "It looks like you have a presentation in progress. Want to
pick up where you left off, or start fresh?"

## Phase Details

### Phase 1: Research & Gather

Read `references/phase-1-research.md` for the detailed process.

**Summary:** Identify and collect source material. Use parallel agents to explore multiple
locations simultaneously. Organize into `MATERIALS_INDEX.md`.

If the user has NO source materials (starting from scratch), skip this phase and go directly
to Phase 2. The brainstorm will generate content.

**Outputs:** `gathered-materials/` directory + `MATERIALS_INDEX.md`

**First:** Create a project directory if one doesn't exist. Ask the user where to create it
or use the current working directory.

### Phase 2: Requirements & Design

Read `references/phase-2-requirements.md` for the detailed process.

**Summary:** Brainstorm structure through one-question-at-a-time dialogue. Cover: primary
takeaway, audience, duration, sections, timing, demos, output format.

**Outputs:** Design spec at `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

### Phase 3: Multi-Agent Review

Read `references/review-tiers.md` for the tiered review detection process and
`references/fallback-review-prompts.md` for the Tier 3 persona prompts,
substance expectations, and substantiated-waiver format.

Refine the design spec through multi-perspective review using the best available mechanism.

**Phase-complete gate:** Phase 3 is NOT complete until:
1. The design spec contains a "Review Log (Phase 3)" section with ≥ 3 substantive findings per persona (or a substantiated waiver per persona — bare "no issues from this perspective" does NOT satisfy this gate).
2. Every Must-fix finding has a corresponding spec edit or explicit documented dismissal in the review log.

A common Sonnet failure pattern is producing shallow reviews (one or zero findings per persona) or advancing without applying Must-fix edits. Do NOT advance to Phase 4 in that state.

**Outputs:** Refined design spec with Review Log (Phase 3) section.

### Phase 4: Style Guide

Read `references/phase-4-style-guide.md` for the detailed process.

**Summary:** Create `style-guide.md` governing ALL visual output -- slides and generated images.
Present to user for approval before generating any images.

**Outputs:** `style-guide.md`

### Phase 5: Design Review

Run another review pass, this time on the complete design (spec + style guide together) using the same tiered mechanism from Phase 3.

For Complex presentations, use full multi-agent review. For Quick/Standard, an inline check is sufficient — but substance expectations and the substantiated-waiver rule still apply.

**Phase-complete gate:** Phase 5 is NOT complete until:
1. The spec contains a "Review Log (Phase 5)" section with ≥ 3 substantive findings per persona (or substantiated waiver), reviewing spec + style-guide together.
2. Every Must-fix finding has a corresponding spec/style-guide edit or explicit dismissal.

**Outputs:** Final approved spec + style guide with Review Log (Phase 5) section.

### Phase 6: Visual Generation

**Hard prerequisite:** `/generate-image` skill configured and working AND Q8 ≠ `text-only`.
If `/generate-image` is absent, STOP (Phase 2 should have caught this — see setup re-entry path in `references/phase-2-requirements.md`).
If Q8 = `text-only`, skip Phase 6 entirely and advance to Phase 7.

Read `references/phase-6-visuals.md` and follow it end-to-end. Delegate all image generation to the `/generate-image` skill — do not call `mcp__replicate__*` tools directly from this skill. This phase is not complete until `images/` contains one file per image in the style guide's plan. Writing `IMAGE_PLAN.md` without files on disk is a known failure mode — do not advance to Phase 7 in that state.

**Important:** This phase runs BEFORE implementation because build scripts reference image paths.

**Outputs:** `images/` directory with all generated assets (unless Q8 = `text-only`).

### Phase 7: Implementation Scripts

Read `references/phase-7-implementation.md` for the detailed process.

**Summary:** Build the presentation using modular scripts. Delegate to the
document-skills skill for the chosen format:
- **PPTX:** `/pptx` skill (pptxgenjs). **Fallback:** if `/pptx` is
  unavailable, use `pptxgenjs` directly with the modular theme.js +
  slides-s{N}.js + build.js architecture. Do NOT stall — this is a
  documented fall-through.
- **HTML:** `/frontend-design` skill. **Fallback:** plain HTML+CSS+JS.
- **PDF:** `/pdf` skill.
- **DOCX:** `/docx` skill.

For PPTX: `theme.js` + `slides-s{N}.js` per section + `build.js` orchestrator.

Speaker notes are NOT optional. Every slide gets the full treatment. Read
`references/presentation-best-practices.md` for the speaker notes format.

**Phase-complete gate:** Phase 7 is not complete until `build.js` runs with
zero errors and produces a presentation file of the expected slide count.
See `references/phase-7-implementation.md` for details.

**Outputs:** Build scripts in `build-deck/` directory + generated presentation file.

### Phase 8: Code Review

Read `references/phase-8-code-review.md` for the detailed process, including the MANDATORY pre-review build run.

**Summary:** Run the build FIRST (capture exit code, stderr/stdout, file size). Then review build scripts via the tiered review mechanism (see `references/review-tiers.md`). Apply Must-fix findings.

**Phase-complete gate:** Phase 8 is NOT complete until:
1. Build was executed with captured output.
2. Latest build run exits with code 0.
3. `code-review.md` exists at project root with "Review Log (Phase 8)" section containing ≥ 3 substantive findings per persona (or substantiated waivers).
4. Every Must-fix finding has a code edit applied or explicit dismissal.

A common Sonnet failure pattern is reviewing code without running the build. Do NOT advance to Phase 9 in that state.

**Outputs:** Verified build scripts + `code-review.md` with Review Log (Phase 8).

### Phase 9: Build & Iterate

Run the build script to generate the presentation file:

```bash
cd build-deck && node build.js
```

**Phase-complete gate:** Phase 9 is NOT complete until:

1. The output file exists at the expected path (e.g., `output.pptx`).
2. The output file size exceeds the minimum threshold:
   - PPTX: ≥ 10 KB
   - PDF: ≥ 5 KB
   - DOCX: ≥ 5 KB
   - HTML: ≥ 5 KB
3. The slide count in the output matches the spec's total slide count
   (pptxgenjs' built-in assertion in `build.js` covers this; parse the
   generated file for other formats if needed).
4. The build invocation is recorded in the transcript (exit code captured).

NOTE: Phase 7's build gate partially overlaps this one — that is
intentional. Phase 7 requires the build was made to work during
implementation; Phase 9 re-verifies the final build after any code-review
edits. Belt-and-suspenders redundancy is deliberate for Sonnet reliability.

A common Sonnet failure pattern is declaring Phase 9 complete based on
build scripts existing rather than on actually running them. Do NOT skip
the build invocation — the build script must execute and produce a file
on disk that passes the size and slide-count checks.

Iterate based on user feedback using the iteration protocol below.

**Outputs:** Final presentation file.

## Iteration Protocol

The modular architecture makes changes cheap:
- **Content change:** Edit specific `slides-s{N}.js`, rebuild
- **Image change:** Regenerate specific image, update reference, rebuild
- **Style change:** Update `style-guide.md` + `theme.js`, regenerate affected images, rebuild
- **Structure change:** Update spec, add/remove section files, update `build.js`, rebuild
- **Speaker notes:** Update notes in specific section file, rebuild

Always rebuild and verify after changes.

## Output Format Selection

| Format | Skill | Best For |
|--------|-------|----------|
| PPTX | `/pptx` | Conference talks, corporate presentations, speaker notes |
| HTML | `/frontend-design` | Interactive presentations, web-based delivery |
| PDF | `/pdf` | Handouts, read-along decks, print |
| DOCX | `/docx` | Narrative presentations, proposal decks with heavy text |

Default to **PPTX** unless the user specifies otherwise.
